import type { Command } from "commander";
import { createClient } from "../../client.js";
import { output } from "../../output.js";
import { withErrorHandling } from "../../errors.js";
import { resolveVenueOwnershipId, consumerBasePath } from "../../consumer.js";

export function registerConsumerDeviceRegistrationsCommands(consumer: Command): void {
  const group = consumer.command("device-registrations").description("Device registrations (Consumer API)");

  group
    .command("register")
    .description("Register a device")
    .requiredOption("--token <token>", "Device registration token")
    .action(
      withErrorHandling(async (opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const venueId = resolveVenueOwnershipId(globalOpts);
        const base = consumerBasePath(venueId);
        const client = createClient(globalOpts.baseUrl);
        const data = await client.post(`${base}/device_registrations/register`, { token: opts.token });
        output(data, globalOpts);
      }),
    );
}
