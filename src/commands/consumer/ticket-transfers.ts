import type { Command } from "commander";
import { createClient } from "../../client.js";
import { output } from "../../output.js";
import { withErrorHandling } from "../../errors.js";
import { addPaginationOptions, paginationParams } from "../../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../../mutation.js";
import { resolveVenueOwnershipId, consumerBasePath, addVenueOption } from "../../consumer.js";

export function registerConsumerTicketTransfersCommands(consumer: Command): void {
  const group = consumer
    .command("ticket-transfers")
    .description("Manage consumer ticket transfers");

  addPaginationOptions(
    addVenueOption(
      group.command("list").description("List ticket transfers"),
    ),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const venueId = resolveVenueOwnershipId(opts);
      const base = consumerBasePath(venueId);
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get(`${base}/ticket_transfers`, {
        ...paginationParams(opts),
      });
      output(data, globalOpts);
    }),
  );

  addVenueOption(
    group
      .command("new <order-id>")
      .description("Show transferable tickets for an order"),
  ).action(
    withErrorHandling(async (orderId, opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const venueId = resolveVenueOwnershipId(opts);
      const base = consumerBasePath(venueId);
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get(`${base}/ticket_transfers/new`, {
        order_id: orderId,
      });
      output(data, globalOpts);
    }),
  );

  addMutationOptions(
    addVenueOption(
      group.command("create").description("Create a ticket transfer"),
    ),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const venueId = resolveVenueOwnershipId(opts);
      const base = consumerBasePath(venueId);
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("POST", `${base}/ticket_transfers`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.post(`${base}/ticket_transfers`, data);
      output(result, globalOpts);
    }),
  );
}
