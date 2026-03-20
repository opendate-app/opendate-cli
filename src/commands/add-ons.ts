import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";
import { addSortOption, sortParams, addFilterOptions, filterParams } from "../filters.js";

export function registerAddOnsCommands(program: Command): void {
  const addOns = program.command("add-ons").description("Manage event add-ons");

  addSortOption(
    addFilterOptions(
      addPaginationOptions(
        addOns
          .command("list")
          .description("List add-ons for an event")
          .requiredOption("--event <id>", "Event ID"),
      ),
      [],
    ),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get(`/api/v2/confirms/${opts.event}/add_ons`, {
        ...paginationParams(opts),
        ...filterParams(opts, []),
        ...sortParams(opts),
      });
      output(data, globalOpts);
    }),
  );

  addOns
    .command("get <id>")
    .description("Get an add-on by ID")
    .requiredOption("--event <id>", "Event ID")
    .action(
      withErrorHandling(async (id, opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/confirms/${opts.event}/add_ons/${id}`);
        output(data, globalOpts);
      }),
    );
}
