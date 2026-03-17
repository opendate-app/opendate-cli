import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";

export function registerOrganizerReservationsCommands(program: Command): void {
  const group = program
    .command("organizer-reservations")
    .description("Manage organizer ticket reservations");

  addMutationOptions(
    group
      .command("build")
      .description("Build an organizer ticket reservation")
      .requiredOption("--event <id>", "Event ID"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("POST", `/api/v2/confirms/${opts.event}/organizer_ticket_reservations/build`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.post(`/api/v2/confirms/${opts.event}/organizer_ticket_reservations/build`, data);
      output(result, globalOpts);
    }),
  );

  addMutationOptions(
    group
      .command("create")
      .description("Create an organizer ticket reservation")
      .requiredOption("--event <id>", "Event ID"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("POST", `/api/v2/confirms/${opts.event}/organizer_ticket_reservations`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.post(`/api/v2/confirms/${opts.event}/organizer_ticket_reservations`, data);
      output(result, globalOpts);
    }),
  );

  addMutationOptions(
    group
      .command("update <token>")
      .description("Update an organizer ticket reservation")
      .requiredOption("--event <id>", "Event ID"),
  ).action(
    withErrorHandling(async (token, opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("PUT", `/api/v2/confirms/${opts.event}/organizer_ticket_reservations/${token}`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.put(`/api/v2/confirms/${opts.event}/organizer_ticket_reservations/${token}`, data);
      output(result, globalOpts);
    }),
  );

  group
    .command("cancel <token>")
    .description("Cancel an organizer ticket reservation")
    .requiredOption("--event <id>", "Event ID")
    .option("--dry-run", "Preview the request without executing")
    .action(
      withErrorHandling(async (token, opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        if (globalOpts.dryRun) {
          handleDryRun("DELETE", `/api/v2/confirms/${opts.event}/organizer_ticket_reservations/${token}`);
          return;
        }
        const client = createClient(globalOpts.baseUrl);
        const result = await client.delete(`/api/v2/confirms/${opts.event}/organizer_ticket_reservations/${token}`);
        output(result, globalOpts);
      }),
    );

  group
    .command("complete <token>")
    .description("Complete an organizer ticket reservation")
    .requiredOption("--event <id>", "Event ID")
    .option("--dry-run", "Preview the request without executing")
    .action(
      withErrorHandling(async (token, opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        if (globalOpts.dryRun) {
          handleDryRun("POST", `/api/v2/confirms/${opts.event}/organizer_ticket_reservations/${token}/complete`);
          return;
        }
        const client = createClient(globalOpts.baseUrl);
        const result = await client.post(`/api/v2/confirms/${opts.event}/organizer_ticket_reservations/${token}/complete`);
        output(result, globalOpts);
      }),
    );
}
