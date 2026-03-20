import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";
import { addFilterOptions, filterParams } from "../filters.js";

export function registerTaggedItemsCommands(program: Command): void {
  const group = program
    .command("tagged-items")
    .description("Manage tagged items");

  addFilterOptions(
    group
      .command("list")
      .description("List tagged items")
      .option("--taggable-id <id>", "Filter by taggable ID")
      .option("--taggable-type <type>", "Filter by taggable type"),
    [],
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const params: Record<string, any> = {
        ...filterParams(opts, []),
      };
      if (opts.taggableId) params.taggable_id = opts.taggableId;
      if (opts.taggableType) params.taggable_type = opts.taggableType;
      const data = await client.get("/api/v2/tagged_items", params);
      output(data, globalOpts);
    }),
  );

  group
    .command("get <id>")
    .description("Get a tagged item by ID")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/tagged_items/${id}`);
        output(data, globalOpts);
      }),
    );

  addMutationOptions(
    group.command("create").description("Create a tagged item"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("POST", "/api/v2/tagged_items", data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.post("/api/v2/tagged_items", data);
      output(result, globalOpts);
    }),
  );

  addMutationOptions(
    group.command("update <id>").description("Update a tagged item"),
  ).action(
    withErrorHandling(async (id, opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("PUT", `/api/v2/tagged_items/${id}`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.put(`/api/v2/tagged_items/${id}`, data);
      output(result, globalOpts);
    }),
  );

  group
    .command("delete <id>")
    .description("Delete a tagged item")
    .option("--dry-run", "Preview the request without executing")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        if (globalOpts.dryRun) {
          handleDryRun("DELETE", `/api/v2/tagged_items/${id}`);
          return;
        }
        const client = createClient(globalOpts.baseUrl);
        const result = await client.delete(`/api/v2/tagged_items/${id}`);
        output(result, globalOpts);
      }),
    );
}
