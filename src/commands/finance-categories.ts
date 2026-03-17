import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";

export function registerFinanceCategoriesCommands(program: Command): void {
  const group = program
    .command("finance-categories")
    .description("Manage finance categories");

  addPaginationOptions(
    group
      .command("list")
      .description("List finance categories")
      .option("--search <query>", "Search finance categories")
      .option("--sort <sort>", "Sort order"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const params: Record<string, any> = {
        ...paginationParams(opts),
      };
      if (opts.search) params.search = opts.search;
      if (opts.sort) params.sort = opts.sort;
      const data = await client.get("/api/v2/finance_categories", params);
      output(data, globalOpts);
    }),
  );

  group
    .command("get <id>")
    .description("Get a finance category by ID")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/finance_categories/${id}`);
        output(data, globalOpts);
      }),
    );

  addMutationOptions(
    group.command("create").description("Create a finance category"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("POST", "/api/v2/finance_categories", data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.post("/api/v2/finance_categories", data);
      output(result, globalOpts);
    }),
  );

  addMutationOptions(
    group.command("update <id>").description("Update a finance category"),
  ).action(
    withErrorHandling(async (id, opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("PUT", `/api/v2/finance_categories/${id}`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.put(`/api/v2/finance_categories/${id}`, data);
      output(result, globalOpts);
    }),
  );

  group
    .command("delete <id>")
    .description("Delete a finance category")
    .option("--dry-run", "Preview the request without executing")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        if (globalOpts.dryRun) {
          handleDryRun("DELETE", `/api/v2/finance_categories/${id}`);
          return;
        }
        const client = createClient(globalOpts.baseUrl);
        const result = await client.delete(`/api/v2/finance_categories/${id}`);
        output(result, globalOpts);
      }),
    );
}
