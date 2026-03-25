import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";
import { addSortOption, sortParams, addFilterOptions, filterParams } from "../filters.js";
import { serializerParam } from "../serializer.js";

export function registerFinanceItemsCommands(program: Command): void {
  const group = program
    .command("finance-items")
    .description("Manage finance items");

  addSortOption(
    addFilterOptions(
      addPaginationOptions(
        group
          .command("list")
          .description("List finance items")
          .requiredOption("--event <id>", "Event ID"),
      ),
      [],
    ),
    "Finance Items",
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get(`/api/v2/confirms/${opts.event}/finance_items`, {
        ...paginationParams(opts),
        ...filterParams(opts, []),
        ...sortParams(opts),
        ...serializerParam("finance_items"),
      });
      output(data, globalOpts);
    }),
  );

  group
    .command("get <id>")
    .description("Get a finance item by ID")
    .requiredOption("--event <id>", "Event ID")
    .action(
      withErrorHandling(async (id, opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/confirms/${opts.event}/finance_items/${id}`, { ...serializerParam("finance_items") });
        output(data, globalOpts);
      }),
    );

  addMutationOptions(
    group
      .command("create")
      .description("Create a finance item")
      .requiredOption("--event <id>", "Event ID"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("POST", `/api/v2/confirms/${opts.event}/finance_items`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.post(`/api/v2/confirms/${opts.event}/finance_items`, data);
      output(result, globalOpts);
    }),
  );

  addMutationOptions(
    group
      .command("update <id>")
      .description("Update a finance item")
      .requiredOption("--event <id>", "Event ID"),
  ).action(
    withErrorHandling(async (id, opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("PUT", `/api/v2/confirms/${opts.event}/finance_items/${id}`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.put(`/api/v2/confirms/${opts.event}/finance_items/${id}`, data);
      output(result, globalOpts);
    }),
  );
}
