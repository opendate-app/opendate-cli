import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";
import { addFilterOptions, filterParams } from "../filters.js";
import { serializerParam } from "../serializer.js";

export function registerTagsCommands(program: Command): void {
  const group = program
    .command("tags")
    .description("Manage tags");

  addFilterOptions(
    group
      .command("list")
      .description("List tags")
      .option("--scope <scope>", "Filter by scope"),
    [],
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const params: Record<string, any> = {
        ...filterParams(opts, []),
        ...serializerParam("tags"),
      };
      if (opts.scope) params.scope = opts.scope;
      const data = await client.get("/api/v2/tags", params);
      output(data, globalOpts);
    }),
  );

  group
    .command("get <id>")
    .description("Get a tag by ID")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/tags/${id}`, { ...serializerParam("tags") });
        output(data, globalOpts);
      }),
    );

  addMutationOptions(
    group.command("create").description("Create a tag"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("POST", "/api/v2/tags", data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.post("/api/v2/tags", data);
      output(result, globalOpts);
    }),
  );

  addMutationOptions(
    group.command("update <id>").description("Update a tag"),
  ).action(
    withErrorHandling(async (id, opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("PUT", `/api/v2/tags/${id}`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.put(`/api/v2/tags/${id}`, data);
      output(result, globalOpts);
    }),
  );

  group
    .command("delete <id>")
    .description("Delete a tag")
    .option("--dry-run", "Preview the request without executing")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        if (globalOpts.dryRun) {
          handleDryRun("DELETE", `/api/v2/tags/${id}`);
          return;
        }
        const client = createClient(globalOpts.baseUrl);
        const result = await client.delete(`/api/v2/tags/${id}`);
        output(result, globalOpts);
      }),
    );
}
