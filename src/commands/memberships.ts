import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addSortOption, sortParams, addFilterOptions, filterParams, type FilterDef } from "../filters.js";
import { serializerParam } from "../serializer.js";

const MEMBERSHIP_FILTERS: FilterDef[] = [
  { flag: "--search <query>", description: "Search by name or email", paramKey: "search" },
];

export function registerMembershipsCommands(program: Command): void {
  const group = program
    .command("memberships")
    .description("View memberships");

  addSortOption(
    addFilterOptions(
      addPaginationOptions(
        group.command("list").description("List memberships"),
      ),
      MEMBERSHIP_FILTERS,
    ),
    "Memberships",
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get("/api/v2/memberships", {
        ...paginationParams(opts),
        ...filterParams(opts, MEMBERSHIP_FILTERS),
        ...sortParams(opts),
        ...serializerParam("memberships"),
      });
      output(data, globalOpts);
    }),
  );
}
