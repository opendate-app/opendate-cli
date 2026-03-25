import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";
import { addSortOption, sortParams, addFilterOptions, filterParams, type FilterDef } from "../filters.js";
import { serializerParam } from "../serializer.js";

const ROOM_FILTERS: FilterDef[] = [
  { flag: "--search <query>", description: "Search rooms by name", ransackKey: "name_cont" },
  { flag: "--venue-id <id>", description: "Filter by venue ownership ID", ransackKey: "venue_ownership_id_eq" },
];

export function registerRoomsCommands(program: Command): void {
  const rooms = program.command("rooms").description("Manage rooms");

  addSortOption(
    addFilterOptions(
      addPaginationOptions(
        rooms.command("list").description("List rooms"),
      ),
      ROOM_FILTERS,
    ),
    "Rooms",
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get("/api/v2/rooms", {
        ...paginationParams(opts),
        ...filterParams(opts, ROOM_FILTERS),
        ...sortParams(opts),
        ...serializerParam("rooms"),
      });
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
        const data = await client.get(`/api/v2/rooms/${id}`, { ...serializerParam("rooms") });
        output(data, globalOpts);
      }),
    );
}
