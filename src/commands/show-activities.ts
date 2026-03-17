import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";

export function registerShowActivitiesCommands(program: Command): void {
  const group = program
    .command("show-activities")
    .description("Manage show activities");

  addPaginationOptions(
    group
      .command("list")
      .description("List show activities")
      .requiredOption("--event <id>", "Event ID")
      .option("--sort <sort>", "Sort order"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const params: Record<string, any> = {
        ...paginationParams(opts),
      };
      if (opts.sort) params.sort = opts.sort;
      const data = await client.get(`/api/v2/confirms/${opts.event}/show_activities`, params);
      output(data, globalOpts);
    }),
  );

  group
    .command("get <id>")
    .description("Get a show activity by ID")
    .requiredOption("--event <id>", "Event ID")
    .action(
      withErrorHandling(async (id, opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/confirms/${opts.event}/show_activities/${id}`);
        output(data, globalOpts);
      }),
    );

  addMutationOptions(
    group
      .command("create-offline-checkin")
      .description("Create an offline check-in activity")
      .requiredOption("--event <id>", "Event ID"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("POST", `/api/v2/confirms/${opts.event}/offline_check_in_activities`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.post(`/api/v2/confirms/${opts.event}/offline_check_in_activities`, data);
      output(result, globalOpts);
    }),
  );
}
