import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addSortOption, sortParams, addFilterOptions, filterParams } from "../filters.js";

export function registerRefundsCommands(program: Command): void {
  const group = program
    .command("refunds")
    .description("View refunds");

  addSortOption(
    addFilterOptions(
      addPaginationOptions(
        group
          .command("list")
          .description("List refunds")
          .requiredOption("--event <id>", "Event ID"),
      ),
      [],
    ),
    "Refunds",
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get(`/api/v2/confirms/${opts.event}/refunds`, {
        ...paginationParams(opts),
        ...filterParams(opts, []),
        ...sortParams(opts),
      });
      output(data, globalOpts);
    }),
  );

  group
    .command("get <id>")
    .description("Get a refund by ID")
    .requiredOption("--event <id>", "Event ID")
    .action(
      withErrorHandling(async (id, opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/confirms/${opts.event}/refunds/${id}`);
        output(data, globalOpts);
      }),
    );
}
