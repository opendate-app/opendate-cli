import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";

export function registerTicketTypesCommands(program: Command): void {
  const ticketTypes = program.command("ticket-types").description("Manage ticket types");

  addPaginationOptions(
    ticketTypes
      .command("list")
      .description("List ticket types for an event")
      .requiredOption("--event <id>", "Event ID")
      .option("--search <query>", "Search ticket types")
      .option("--sort <sort>", "Sort order"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const params: Record<string, any> = {
        ...paginationParams(opts),
      };
      if (opts.search) params.search = opts.search;
      if (opts.sort) params.sort = opts.sort;
      const data = await client.get(`/api/v2/confirms/${opts.event}/ticket_types`, params);
      output(data, globalOpts);
    }),
  );

  ticketTypes
    .command("get <id>")
    .description("Get a ticket type by ID")
    .requiredOption("--event <id>", "Event ID")
    .action(
      withErrorHandling(async (id, opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/confirms/${opts.event}/ticket_types/${id}`);
        output(data, globalOpts);
      }),
    );
}
