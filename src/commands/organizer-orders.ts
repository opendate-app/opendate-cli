import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";

export function registerOrganizerOrdersCommands(program: Command): void {
  const group = program
    .command("organizer-orders")
    .description("Manage organizer orders");

  addMutationOptions(
    group
      .command("build")
      .description("Build an organizer order")
      .requiredOption("--event <id>", "Event ID"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("POST", `/api/v2/confirms/${opts.event}/organizer_orders/build`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.post(`/api/v2/confirms/${opts.event}/organizer_orders/build`, data);
      output(result, globalOpts);
    }),
  );

  addMutationOptions(
    group
      .command("create")
      .description("Create an organizer order")
      .requiredOption("--event <id>", "Event ID"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("POST", `/api/v2/confirms/${opts.event}/organizer_orders`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.post(`/api/v2/confirms/${opts.event}/organizer_orders`, data);
      output(result, globalOpts);
    }),
  );
}
