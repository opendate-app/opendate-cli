import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";

export function registerRoomsCommands(program: Command): void {
  const rooms = program.command("rooms").description("Manage rooms");

  addPaginationOptions(
    rooms
      .command("list")
      .description("List rooms")
      .option("--search <query>", "Search rooms")
      .option("--venue-id <id>", "Filter by venue ID")
      .option("--sort <sort>", "Sort order"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const params: Record<string, any> = {
        ...paginationParams(opts),
      };
      if (opts.search) params.search = opts.search;
      if (opts.venueId) params.venue_id = opts.venueId;
      if (opts.sort) params.sort = opts.sort;
      const data = await client.get("/api/v2/rooms", params);
      output(data, globalOpts);
    }),
  );

  rooms
    .command("get <id>")
    .description("Get a room by ID")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/rooms/${id}`);
        output(data, globalOpts);
      }),
    );
}
