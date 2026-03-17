import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";

export function registerVenuesCommands(program: Command): void {
  const venues = program.command("venues").description("Manage venues");

  addPaginationOptions(
    venues
      .command("list")
      .description("List venues")
      .option("--search <query>", "Search venues")
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
      const data = await client.get("/api/v2/venue_ownerships", params);
      output(data, globalOpts);
    }),
  );

  venues
    .command("get <id>")
    .description("Get a venue by ID")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/venue_ownerships/${id}`);
        output(data, globalOpts);
      }),
    );

  venues
    .command("app-downloaded <id>")
    .description("Check if app is downloaded for a venue")
    .option("--email <email>", "Email address")
    .action(
      withErrorHandling(async (id, opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const params: Record<string, any> = {};
        if (opts.email) params.email = opts.email;
        const data = await client.get(`/api/v2/venue_ownerships/${id}/app_downloaded`, params);
        output(data, globalOpts);
      }),
    );
}
