import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";
import { addSortOption, sortParams, addFilterOptions, filterParams, type FilterDef } from "../filters.js";
import { serializerParam } from "../serializer.js";

const TICKET_TYPE_FILTERS: FilterDef[] = [
  { flag: "--search <query>", description: "Search ticket types by name", ransackKey: "name_cont" },
];

export function registerTicketTypesCommands(program: Command): void {
  const ticketTypes = program.command("ticket-types").description("Manage ticket types");

  addSortOption(
    addFilterOptions(
      addPaginationOptions(
        ticketTypes
          .command("list")
          .description("List ticket types for an event")
          .requiredOption("--event <id>", "Event ID"),
      ),
      TICKET_TYPE_FILTERS,
    ),
    "Ticket Types",
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get(`/api/v2/confirms/${opts.event}/ticket_types`, {
        ...paginationParams(opts),
        ...filterParams(opts, TICKET_TYPE_FILTERS),
        ...sortParams(opts),
        ...serializerParam("ticket_types"),
      });
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
        const data = await client.get(`/api/v2/confirms/${opts.event}/ticket_types/${id}`, { ...serializerParam("ticket_types") });
        output(data, globalOpts);
      }),
    );
}
