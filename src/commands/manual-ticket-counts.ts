import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";

export function registerManualTicketCountsCommands(program: Command): void {
  const group = program
    .command("manual-ticket-counts")
    .description("Manage manual ticket counts");

  addPaginationOptions(
    group
      .command("list")
      .description("List manual ticket counts")
      .option("--event-id <id>", "Filter by event ID")
      .option("--sort <sort>", "Sort order"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const params: Record<string, any> = {
        ...paginationParams(opts),
      };
      if (opts.eventId) params.event_id = opts.eventId;
      if (opts.sort) params.sort = opts.sort;
      const data = await client.get("/api/v2/manual_ticket_counts", params);
      output(data, globalOpts);
    }),
  );

  group
    .command("get <id>")
    .description("Get a manual ticket count by ID")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/manual_ticket_counts/${id}`);
        output(data, globalOpts);
      }),
    );

  addMutationOptions(
    group.command("create").description("Create a manual ticket count"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("POST", "/api/v2/manual_ticket_counts", data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.post("/api/v2/manual_ticket_counts", data);
      output(result, globalOpts);
    }),
  );

  addMutationOptions(
    group.command("update <id>").description("Update a manual ticket count"),
  ).action(
    withErrorHandling(async (id, opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("PUT", `/api/v2/manual_ticket_counts/${id}`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.put(`/api/v2/manual_ticket_counts/${id}`, data);
      output(result, globalOpts);
    }),
  );

  group
    .command("delete <id>")
    .description("Delete a manual ticket count")
    .option("--dry-run", "Preview the request without executing")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        if (globalOpts.dryRun) {
          handleDryRun("DELETE", `/api/v2/manual_ticket_counts/${id}`);
          return;
        }
        const client = createClient(globalOpts.baseUrl);
        const result = await client.delete(`/api/v2/manual_ticket_counts/${id}`);
        output(result, globalOpts);
      }),
    );
}
