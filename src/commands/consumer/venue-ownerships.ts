import type { Command } from "commander";
import { createClient } from "../../client.js";
import { output } from "../../output.js";
import { withErrorHandling } from "../../errors.js";
import { addPaginationOptions, paginationParams } from "../../pagination.js";
import { addSortOption, sortParams, addFilterOptions, filterParams, type FilterDef } from "../../filters.js";
import { resolveVenueOwnershipId, consumerBasePath } from "../../consumer.js";

export function registerConsumerVenueOwnershipsCommands(consumer: Command): void {
  const group = consumer.command("venue").description("Venue ownership (Consumer API)");

  group
    .command("get")
    .description("Get the venue ownership")
    .action(
      withErrorHandling(async (_opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const venueId = resolveVenueOwnershipId(globalOpts);
        const base = consumerBasePath(venueId);
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(base);
        output(data, globalOpts);
      }),
    );

  addSortOption(
    addFilterOptions(
      addPaginationOptions(
        group.command("included").description("Get venue included resources"),
      ),
      [],
    ),
    "Venue Ownerships",
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const venueId = resolveVenueOwnershipId(globalOpts);
      const base = consumerBasePath(venueId);
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get(`${base}/included`, {
        ...paginationParams(opts),
        ...filterParams(opts, []),
        ...sortParams(opts),
      });
      output(data, globalOpts);
    }),
  );
}
