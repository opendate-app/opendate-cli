import type { Command } from "commander";
import { createClient } from "../../client.js";
import { output } from "../../output.js";
import { withErrorHandling } from "../../errors.js";
import { addPaginationOptions, paginationParams } from "../../pagination.js";
import { resolveVenueOwnershipId, consumerBasePath, addVenueOption } from "../../consumer.js";

export function registerConsumerMembershipsCommands(consumer: Command): void {
  const group = consumer
    .command("memberships")
    .description("Manage consumer memberships");

  addPaginationOptions(
    addVenueOption(
      group.command("list").description("List memberships"),
    ),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const venueId = resolveVenueOwnershipId(opts);
      const base = consumerBasePath(venueId);
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get(`${base}/memberships`, {
        ...paginationParams(opts),
      });
      output(data, globalOpts);
    }),
  );

  addVenueOption(
    group
      .command("get <token>")
      .description("Get a membership by token"),
  ).action(
    withErrorHandling(async (token, opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const venueId = resolveVenueOwnershipId(opts);
      const base = consumerBasePath(venueId);
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get(`${base}/memberships/${token}`);
      output(data, globalOpts);
    }),
  );
}
