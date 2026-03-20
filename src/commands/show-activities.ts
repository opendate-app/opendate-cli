import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";
import { addSortOption, sortParams, addFilterOptions, filterParams } from "../filters.js";

export function registerShowActivitiesCommands(program: Command): void {
  const group = program
    .command("show-activities")
    .description("Manage show activities");

  addSortOption(
    addFilterOptions(
      addPaginationOptions(
        group
          .command("list")
          .description("List show activities")
          .requiredOption("--event <id>", "Event ID"),
      ),
      [],
    ),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get(`/api/v2/confirms/${opts.event}/show_activities`, {
        ...paginationParams(opts),
        ...filterParams(opts, []),
        ...sortParams(opts),
      });
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
