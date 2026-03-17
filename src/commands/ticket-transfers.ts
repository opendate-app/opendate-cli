import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";

export function registerTicketTransfersCommands(program: Command): void {
  const group = program
    .command("ticket-transfers")
    .description("Manage ticket transfers");

  group
    .command("new")
    .description("Get a new ticket transfer form")
    .requiredOption("--order <id>", "Order ID")
    .action(
      withErrorHandling(async (opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/orders/${opts.order}/ticket_transfers/new`);
        output(data, globalOpts);
      }),
    );

  addMutationOptions(
    group
      .command("create")
      .description("Create a ticket transfer")
      .requiredOption("--order <id>", "Order ID"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("POST", `/api/v2/orders/${opts.order}/ticket_transfers`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.post(`/api/v2/orders/${opts.order}/ticket_transfers`, data);
      output(result, globalOpts);
    }),
  );
}
