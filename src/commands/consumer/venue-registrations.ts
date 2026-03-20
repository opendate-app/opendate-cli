import type { Command } from "commander";
import { createClient } from "../../client.js";
import { output } from "../../output.js";
import { withErrorHandling } from "../../errors.js";
import { resolveVenueOwnershipId, consumerBasePath } from "../../consumer.js";

export function registerConsumerVenueRegistrationsCommands(consumer: Command): void {
  const group = consumer.command("venue-registrations").description("Venue registrations (Consumer API)");

  group
    .command("create")
    .description("Create a venue registration")
    .action(
      withErrorHandling(async (_opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const venueId = resolveVenueOwnershipId(globalOpts);
        const base = consumerBasePath(venueId);
        const client = createClient(globalOpts.baseUrl);
        const data = await client.post(`${base}/venue_registrations`);
        output(data, globalOpts);
      }),
    );
}
