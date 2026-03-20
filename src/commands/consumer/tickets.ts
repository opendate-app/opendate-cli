import { writeFileSync } from "node:fs";
import type { Command } from "commander";
import { createClient } from "../../client.js";
import { output } from "../../output.js";
import { withErrorHandling } from "../../errors.js";
import { addPaginationOptions, paginationParams } from "../../pagination.js";
import { addSortOption, sortParams, addFilterOptions, filterParams, type FilterDef } from "../../filters.js";
import { resolveVenueOwnershipId, consumerBasePath, addVenueOption } from "../../consumer.js";

const TICKET_FILTERS: FilterDef[] = [
  { flag: "--include-delayed-delivery", description: "Include delayed delivery tickets", paramKey: "include_delayed_delivery", isBoolean: true },
];

export function registerConsumerTicketsCommands(consumer: Command): void {
  const tickets = consumer
    .command("tickets")
    .description("Manage consumer tickets");

  addSortOption(
    addFilterOptions(
      addPaginationOptions(
        addVenueOption(
          tickets.command("list").description("List tickets"),
        ),
      ),
      TICKET_FILTERS,
    ),
    "Consumer Tickets",
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const venueId = resolveVenueOwnershipId(opts);
      const base = consumerBasePath(venueId);
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get(`${base}/tickets`, {
        ...paginationParams(opts),
        ...filterParams(opts, TICKET_FILTERS),
        ...sortParams(opts),
      });
      output(data, globalOpts);
    }),
  );

  addVenueOption(
    tickets
      .command("get <barcode>")
      .description("Get a ticket by barcode"),
  ).action(
    withErrorHandling(async (barcode, opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const venueId = resolveVenueOwnershipId(opts);
      const base = consumerBasePath(venueId);
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get(`${base}/tickets/${barcode}`);
      output(data, globalOpts);
    }),
  );

  addVenueOption(
    tickets
      .command("claim <share-code>")
      .description("Claim a ticket by share code"),
  ).action(
    withErrorHandling(async (shareCode, opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const venueId = resolveVenueOwnershipId(opts);
      const base = consumerBasePath(venueId);
      const client = createClient(globalOpts.baseUrl);
      const result = await client.post(`${base}/tickets/${shareCode}/claim`);
      output(result, globalOpts);
    }),
  );

  addVenueOption(
    tickets
      .command("pkpass <barcode>")
      .description("Download a ticket as a pkpass file")
      .option("--output <path>", "Output file path"),
  ).action(
    withErrorHandling(async (barcode, opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const venueId = resolveVenueOwnershipId(opts);
      const base = consumerBasePath(venueId);
      const client = createClient(globalOpts.baseUrl);
      const buffer = await client.getBinary(`${base}/tickets/${barcode}/pkpass`);
      const outputPath = opts.output || `${barcode}.pkpass`;
      writeFileSync(outputPath, buffer);
      console.log(`Saved to ${outputPath}`);
    }),
  );
}
