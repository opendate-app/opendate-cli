import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";
import { addSortOption, sortParams, addFilterOptions, filterParams } from "../filters.js";

export function registerCustomChargesCommands(program: Command): void {
  const customCharges = program.command("custom-charges").description("Manage custom charge types");

  addSortOption(
    addFilterOptions(
      addPaginationOptions(
        customCharges
          .command("list")
          .description("List custom charge types for an event")
          .requiredOption("--event <id>", "Event ID"),
      ),
      [],
    ),
    "Custom Charges",
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get(`/api/v2/confirms/${opts.event}/custom_charge_types`, {
        ...paginationParams(opts),
        ...filterParams(opts, []),
        ...sortParams(opts),
      });
      output(data, globalOpts);
    }),
  );

  customCharges
    .command("get <id>")
    .description("Get a custom charge type by ID")
    .requiredOption("--event <id>", "Event ID")
    .action(
      withErrorHandling(async (id, opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/confirms/${opts.event}/custom_charge_types/${id}`);
        output(data, globalOpts);
      }),
    );
}
