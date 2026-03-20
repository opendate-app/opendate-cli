import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";
import { addSortOption, sortParams, addFilterOptions, filterParams } from "../filters.js";

export function registerOffersCommands(program: Command): void {
  const group = program
    .command("offers")
    .description("Manage offers");

  addSortOption(
    addFilterOptions(
      addPaginationOptions(
        group.command("list").description("List offers"),
      ),
      [],
    ),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get("/api/v2/offers", {
        ...paginationParams(opts),
        ...filterParams(opts, []),
        ...sortParams(opts),
      });
      output(data, globalOpts);
    }),
  );

  group
    .command("get <id>")
    .description("Get an offer by ID")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/offers/${id}`);
        output(data, globalOpts);
      }),
    );

  addMutationOptions(
    group.command("create").description("Create an offer"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("POST", "/api/v2/offers", data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.post("/api/v2/offers", data);
      output(result, globalOpts);
    }),
  );
}
