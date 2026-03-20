import type { Command } from "commander";
import { createClient } from "../../client.js";
import { output } from "../../output.js";
import { withErrorHandling } from "../../errors.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../../mutation.js";
import { resolveVenueOwnershipId, consumerBasePath } from "../../consumer.js";

export function registerConsumerVenueMembershipsCommands(consumer: Command): void {
  const group = consumer.command("venue-memberships").description("Venue memberships (Consumer API)");

  group
    .command("get <id>")
    .description("Get a venue membership by ID")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const venueId = resolveVenueOwnershipId(globalOpts);
        const base = consumerBasePath(venueId);
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`${base}/venue_memberships/${id}`);
        output(data, globalOpts);
      }),
    );

  addMutationOptions(
    group
      .command("update <id>")
      .description("Update a venue membership"),
  ).action(
    withErrorHandling(async (id, opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      const venueId = resolveVenueOwnershipId(globalOpts);
      const base = consumerBasePath(venueId);
      if (globalOpts.dryRun) {
        handleDryRun("PATCH", `${base}/venue_memberships/${id}`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.patch(`${base}/venue_memberships/${id}`, data);
      output(result, globalOpts);
    }),
  );
}
