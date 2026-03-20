import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";
import { addSortOption, sortParams, addFilterOptions, filterParams, type FilterDef } from "../filters.js";

const FAN_FILTERS: FilterDef[] = [
  { flag: "--search <query>", description: "Search by name or email", paramKey: "search" },
];

export function registerFansCommands(program: Command): void {
  const group = program
    .command("fans")
    .description("Manage fans");

  addSortOption(
    addFilterOptions(
      addPaginationOptions(
        group.command("list").description("List fans"),
      ),
      FAN_FILTERS,
    ),
    "Fans",
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get("/api/v2/fans", {
        ...paginationParams(opts),
        ...filterParams(opts, FAN_FILTERS),
        ...sortParams(opts),
      });
      output(data, globalOpts);
    }),
  );

  group
    .command("get <id>")
    .description("Get a fan by ID")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/fans/${id}`);
        output(data, globalOpts);
      }),
    );

  addMutationOptions(
    group.command("create").description("Create a fan"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("POST", "/api/v2/fans", data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.post("/api/v2/fans", data);
      output(result, globalOpts);
    }),
  );

  addPaginationOptions(
    group
      .command("recommendations")
      .description("Get fan recommendations for an event")
      .requiredOption("--event <id>", "Event ID"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const params: Record<string, any> = {
        ...paginationParams(opts),
      };
      const data = await client.get(`/api/v2/confirms/${opts.event}/fans/recommendations`, params);
      output(data, globalOpts);
    }),
  );

  group
    .command("update-marketing <id>")
    .description("Update marketing subscriptions for a fan")
    .requiredOption("--venue-id <id>", "Venue ID")
    .requiredOption("--subscribed <value>", "Subscribed status")
    .action(
      withErrorHandling(async (id, opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const result = await client.put(`/api/v2/fans/${id}/update_marketing_subscriptions`, {
          venue_id: opts.venueId,
          subscribed: opts.subscribed,
        });
        output(result, globalOpts);
      }),
    );
}
