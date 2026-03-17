import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";

export function registerTicketsCommands(program: Command): void {
  const tickets = program.command("tickets").description("Manage tickets");

  addPaginationOptions(
    tickets
      .command("list")
      .description("List tickets for an event")
      .requiredOption("--event <id>", "Event ID")
      .option("--search <query>", "Search tickets")
      .option("--ticket-type-id <id>", "Filter by ticket type ID")
      .option("--include-unpaid", "Include unpaid tickets")
      .option("--sort <sort>", "Sort order"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const params: Record<string, any> = {
        ...paginationParams(opts),
      };
      if (opts.search) params.search = opts.search;
      if (opts.ticketTypeId) params.ticket_type_id = opts.ticketTypeId;
      if (opts.includeUnpaid) params.include_unpaid = true;
      if (opts.sort) params.sort = opts.sort;
      const data = await client.get(`/api/v2/confirms/${opts.event}/tickets`, params);
      output(data, globalOpts);
    }),
  );

  tickets
    .command("get <barcode>")
    .description("Get a ticket by barcode")
    .requiredOption("--event <id>", "Event ID")
    .option("--include-unpaid", "Include unpaid tickets")
    .action(
      withErrorHandling(async (barcode, opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const params: Record<string, any> = {};
        if (opts.includeUnpaid) params.include_unpaid = true;
        const data = await client.get(`/api/v2/confirms/${opts.event}/tickets/${barcode}`, params);
        output(data, globalOpts);
      }),
    );

  addMutationOptions(
    tickets
      .command("check-in <barcode>")
      .description("Check in a ticket")
      .requiredOption("--event <id>", "Event ID"),
  ).action(
    withErrorHandling(async (barcode, opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("PUT", `/api/v2/confirms/${opts.event}/tickets/${barcode}`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.put(`/api/v2/confirms/${opts.event}/tickets/${barcode}`, data);
      output(result, globalOpts);
    }),
  );

  tickets
    .command("print <barcode>")
    .description("Print a ticket")
    .requiredOption("--event <id>", "Event ID")
    .option("--printer-id <id>", "Printer ID")
    .action(
      withErrorHandling(async (barcode, opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const body: Record<string, any> = {};
        if (opts.printerId) body.printer_id = opts.printerId;
        const result = await client.post(`/api/v2/confirms/${opts.event}/tickets/${barcode}/print`, body);
        output(result, globalOpts);
      }),
    );
}
