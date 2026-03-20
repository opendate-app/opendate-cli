import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";
import { addSortOption, sortParams, addFilterOptions, filterParams, type FilterDef } from "../filters.js";

const EVENT_FILTERS: FilterDef[] = [
  { flag: "--search <query>", description: "Search events by title", paramKey: "search" },
  { flag: "--venue-id <id>", description: "Filter by venue ID", paramKey: "venue_id" },
  { flag: "--has-ticket-types", description: "Only events with ticket types", paramKey: "has_ticket_types", isBoolean: true },
  { flag: "--start-after <date>", description: "Events starting on or after date (YYYY-MM-DD)", ransackKey: "start_time_gteq" },
  { flag: "--start-before <date>", description: "Events starting on or before date (YYYY-MM-DD)", ransackKey: "start_time_lteq" },
  { flag: "--classification <value>", description: "Filter by classification (confirmed, past, canceled)", ransackKey: "calendar_classification_eq" },
];

export function registerEventsCommands(program: Command): void {
  const events = program.command("events").description("Manage events");

  addSortOption(
    addFilterOptions(
      addPaginationOptions(
        events.command("list").description("List events"),
      ),
      EVENT_FILTERS,
    ),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get("/api/v2/confirms", {
        ...paginationParams(opts),
        ...filterParams(opts, EVENT_FILTERS),
        ...sortParams(opts),
      });
      output(data, globalOpts);
    }),
  );

  events
    .command("get <id>")
    .description("Get an event by ID")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/confirms/${id}`);
        output(data, globalOpts);
      }),
    );

  events
    .command("description <id>")
    .description("Get an event description")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/confirms/${id}/description`);
        output(data, globalOpts);
      }),
    );

  addPaginationOptions(
    events
      .command("similars <id>")
      .description("Get similar events"),
  ).action(
    withErrorHandling(async (id, opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const params = { ...paginationParams(opts) };
      const data = await client.get(`/api/v2/confirms/${id}/similars`, params);
      output(data, globalOpts);
    }),
  );

  events
    .command("pnl <id>")
    .description("Get event profit and loss")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/confirms/${id}/profit_and_loss`);
        output(data, globalOpts);
      }),
    );

  events
    .command("toast-summary <id>")
    .description("Get event toast summary")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/confirms/${id}/toast_summary`);
        output(data, globalOpts);
      }),
    );

  events
    .command("cash-summary <id>")
    .description("Get event cash summary")
    .option("--created-after <date>", "Filter by created after date")
    .option("--created-before <date>", "Filter by created before date")
    .action(
      withErrorHandling(async (id, opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const params: Record<string, any> = {};
        if (opts.createdAfter) params.created_after = opts.createdAfter;
        if (opts.createdBefore) params.created_before = opts.createdBefore;
        const data = await client.get(`/api/v2/confirms/${id}/cash_summary`, params);
        output(data, globalOpts);
      }),
    );

  addPaginationOptions(
    events
      .command("recommendations")
      .description("Get event recommendations")
      .option("--fan-id <id>", "Fan ID"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const params: Record<string, any> = {
        ...paginationParams(opts),
      };
      if (opts.fanId) params.fan_id = opts.fanId;
      const data = await client.get("/api/v2/confirms/recommendations", params);
      output(data, globalOpts);
    }),
  );
}
