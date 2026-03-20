import type { Command } from "commander";
import { createClient } from "../../client.js";
import { output } from "../../output.js";
import { withErrorHandling } from "../../errors.js";
import { addPaginationOptions, paginationParams } from "../../pagination.js";
import { addSortOption, sortParams, addFilterOptions, filterParams, type FilterDef } from "../../filters.js";
import { resolveVenueOwnershipId, consumerBasePath, addVenueOption } from "../../consumer.js";

const CONFIRM_FILTERS: FilterDef[] = [
  { flag: "--search <query>", description: "Search by title", ransackKey: "title_cont" },
];

export function registerConsumerConfirmsCommands(consumer: Command): void {
  const confirms = consumer
    .command("confirms")
    .description("Manage consumer confirms");

  addSortOption(
    addFilterOptions(
      addPaginationOptions(
        addVenueOption(
          confirms.command("list").description("List confirms"),
        ),
      ),
      CONFIRM_FILTERS,
    ),
    "Consumer Confirms",
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const venueId = resolveVenueOwnershipId(opts);
      const base = consumerBasePath(venueId);
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get(`${base}/confirms`, {
        ...paginationParams(opts),
        ...filterParams(opts, CONFIRM_FILTERS),
        ...sortParams(opts),
      });
      output(data, globalOpts);
    }),
  );

  addVenueOption(
    confirms
      .command("get <id>")
      .description("Get a confirm by ID"),
  ).action(
    withErrorHandling(async (id, opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const venueId = resolveVenueOwnershipId(opts);
      const base = consumerBasePath(venueId);
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get(`${base}/confirms/${id}`);
      output(data, globalOpts);
    }),
  );

  addPaginationOptions(
    addVenueOption(
      confirms
        .command("upgradeable")
        .description("List upgradeable confirms"),
    ),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const venueId = resolveVenueOwnershipId(opts);
      const base = consumerBasePath(venueId);
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get(`${base}/confirms/upgradeable`, {
        ...paginationParams(opts),
      });
      output(data, globalOpts);
    }),
  );
}
