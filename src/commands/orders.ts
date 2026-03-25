import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";
import { addSortOption, sortParams, addFilterOptions, filterParams, type FilterDef } from "../filters.js";
import { serializerParam } from "../serializer.js";

const ORDER_FILTERS: FilterDef[] = [
  { flag: "--search <query>", description: "Search by name or email", ransackKey: "first_name_or_last_name_or_email_cont" },
];

export function registerOrdersCommands(program: Command): void {
  const orders = program.command("orders").description("Manage orders");

  addSortOption(
    addFilterOptions(
      addPaginationOptions(
        orders
          .command("list")
          .description("List orders for an event")
          .requiredOption("--event <id>", "Event ID"),
      ),
      ORDER_FILTERS,
    ),
    "Orders",
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get(`/api/v2/confirms/${opts.event}/orders`, {
        ...paginationParams(opts),
        ...filterParams(opts, ORDER_FILTERS),
        ...sortParams(opts),
        ...serializerParam("orders"),
      });
      output(data, globalOpts);
    }),
  );

  orders
    .command("get <id>")
    .description("Get an order by ID")
    .requiredOption("--event <id>", "Event ID")
    .action(
      withErrorHandling(async (id, opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/confirms/${opts.event}/orders/${id}`, { ...serializerParam("orders") });
        output(data, globalOpts);
      }),
    );

  addMutationOptions(
    orders
      .command("update <id>")
      .description("Update an order")
      .requiredOption("--event <id>", "Event ID"),
  ).action(
    withErrorHandling(async (id, opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("PUT", `/api/v2/confirms/${opts.event}/orders/${id}`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.put(`/api/v2/confirms/${opts.event}/orders/${id}`, data);
      output(result, globalOpts);
    }),
  );

  orders
    .command("print <id>")
    .description("Print an order")
    .requiredOption("--event <id>", "Event ID")
    .option("--printer-id <id>", "Printer ID")
    .action(
      withErrorHandling(async (id, opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const body: Record<string, any> = {};
        if (opts.printerId) body.printer_id = opts.printerId;
        const result = await client.post(`/api/v2/confirms/${opts.event}/orders/${id}/print`, body);
        output(result, globalOpts);
      }),
    );

  orders
    .command("send-receipt <id>")
    .description("Send receipt for an order")
    .requiredOption("--event <id>", "Event ID")
    .option("--email <email>", "Email address")
    .option("--skip-tickets", "Skip sending tickets")
    .action(
      withErrorHandling(async (id, opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const body: Record<string, any> = {};
        if (opts.email) body.email = opts.email;
        if (opts.skipTickets) body.skip_tickets = true;
        const result = await client.post(`/api/v2/confirms/${opts.event}/orders/${id}/send_receipt`, body);
        output(result, globalOpts);
      }),
    );

  orders
    .command("check-in <id>")
    .description("Check in an order")
    .requiredOption("--event <id>", "Event ID")
    .action(
      withErrorHandling(async (id, opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const result = await client.post(`/api/v2/confirms/${opts.event}/orders/${id}/check_in`);
        output(result, globalOpts);
      }),
    );

  orders
    .command("check-out <id>")
    .description("Check out an order")
    .requiredOption("--event <id>", "Event ID")
    .action(
      withErrorHandling(async (id, opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const result = await client.post(`/api/v2/confirms/${opts.event}/orders/${id}/check_out`);
        output(result, globalOpts);
      }),
    );
}
