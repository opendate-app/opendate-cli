import type { Command } from "commander";
import { createClient } from "../../client.js";
import { output } from "../../output.js";
import { withErrorHandling } from "../../errors.js";
import { addPaginationOptions, paginationParams } from "../../pagination.js";
import { addSortOption, sortParams, addFilterOptions, filterParams, type FilterDef } from "../../filters.js";
import { resolveVenueOwnershipId, consumerBasePath } from "../../consumer.js";

export function registerConsumerPushNotificationsCommands(consumer: Command): void {
  const group = consumer.command("push-notifications").description("Push notifications (Consumer API)");

  addSortOption(
    addFilterOptions(
      addPaginationOptions(
        group.command("list").description("List push notifications"),
      ),
      [],
    ),
    "Consumer Push Notifications",
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const venueId = resolveVenueOwnershipId(globalOpts);
      const base = consumerBasePath(venueId);
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get(`${base}/push_notifications`, {
        ...paginationParams(opts),
        ...filterParams(opts, []),
        ...sortParams(opts),
      });
      output(data, globalOpts);
    }),
  );

  group
    .command("get <id>")
    .description("Get a push notification by ID")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const venueId = resolveVenueOwnershipId(globalOpts);
        const base = consumerBasePath(venueId);
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`${base}/push_notifications/${id}`);
        output(data, globalOpts);
      }),
    );
}
