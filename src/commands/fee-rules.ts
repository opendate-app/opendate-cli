import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addSortOption, sortParams, addFilterOptions, filterParams } from "../filters.js";

export function registerFeeRulesCommands(program: Command): void {
  const group = program
    .command("fee-rules")
    .description("View fee rules");

  addSortOption(
    addFilterOptions(
      addPaginationOptions(
        group.command("list").description("List fee rules"),
      ),
      [],
    ),
    "Fee Rules",
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get("/api/v2/fee_rules", {
        ...paginationParams(opts),
        ...filterParams(opts, []),
        ...sortParams(opts),
      });
      output(data, globalOpts);
    }),
  );

  group
    .command("get <id>")
    .description("Get a fee rule by ID")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/fee_rules/${id}`);
        output(data, globalOpts);
      }),
    );
}
