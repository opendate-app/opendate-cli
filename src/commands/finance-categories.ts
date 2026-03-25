import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";
import { addSortOption, sortParams, addFilterOptions, filterParams, type FilterDef } from "../filters.js";
import { serializerParam } from "../serializer.js";

const FINANCE_CATEGORY_FILTERS: FilterDef[] = [
  { flag: "--search <query>", description: "Search by name", ransackKey: "name_cont" },
];

export function registerFinanceCategoriesCommands(program: Command): void {
  const group = program
    .command("finance-categories")
    .description("Manage finance categories");

  addSortOption(
    addFilterOptions(
      addPaginationOptions(
        group.command("list").description("List finance categories"),
      ),
      FINANCE_CATEGORY_FILTERS,
    ),
    "Finance Categories",
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get("/api/v2/finance_categories", {
        ...paginationParams(opts),
        ...filterParams(opts, FINANCE_CATEGORY_FILTERS),
        ...sortParams(opts),
        ...serializerParam("finance_categories"),
      });
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
        const data = await client.get(`/api/v2/finance_categories/${id}`, { ...serializerParam("finance_categories") });
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
