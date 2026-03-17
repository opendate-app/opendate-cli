import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";

export function registerFoodAndBeverageCommands(program: Command): void {
  const group = program
    .command("food-and-beverage")
    .description("Manage food and beverage items");

  addPaginationOptions(
    group
      .command("list")
      .description("List food and beverage items")
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
      const data = await client.get("/api/v2/food_and_beverage_items", params);
      output(data, globalOpts);
    }),
  );

  group
    .command("get <id>")
    .description("Get a food and beverage item by ID")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/food_and_beverage_items/${id}`);
        output(data, globalOpts);
      }),
    );

  addMutationOptions(
    group.command("create").description("Create a food and beverage item"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("POST", "/api/v2/food_and_beverage_items", data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.post("/api/v2/food_and_beverage_items", data);
      output(result, globalOpts);
    }),
  );

  addMutationOptions(
    group.command("update <id>").description("Update a food and beverage item"),
  ).action(
    withErrorHandling(async (id, opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("PUT", `/api/v2/food_and_beverage_items/${id}`, data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.put(`/api/v2/food_and_beverage_items/${id}`, data);
      output(result, globalOpts);
    }),
  );
}
