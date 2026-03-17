import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";

export function registerFansCommands(program: Command): void {
  const group = program
    .command("fans")
    .description("Manage fans");

  addPaginationOptions(
    group
      .command("list")
      .description("List fans")
      .option("--search <query>", "Search fans")
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
      const data = await client.get("/api/v2/fans", params);
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
