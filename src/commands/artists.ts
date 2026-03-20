import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";
import { addSortOption, sortParams, addFilterOptions, filterParams, type FilterDef } from "../filters.js";

const ARTIST_FILTERS: FilterDef[] = [
  { flag: "--search <query>", description: "Search artists by name", ransackKey: "name_cont" },
];

export function registerArtistsCommands(program: Command): void {
  const artists = program.command("artists").description("Manage artists");

  addSortOption(
    addFilterOptions(
      addPaginationOptions(
        artists.command("list").description("List artists"),
      ),
      ARTIST_FILTERS,
    ),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get("/api/v2/artists", {
        ...paginationParams(opts),
        ...filterParams(opts, ARTIST_FILTERS),
        ...sortParams(opts),
      });
      output(data, globalOpts);
    }),
  );

  artists
    .command("get <id>")
    .description("Get an artist by ID")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/artists/${id}`);
        output(data, globalOpts);
      }),
    );

  addMutationOptions(
    artists.command("create").description("Create a new artist"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("POST", "/api/v2/artists", data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      const result = await client.post("/api/v2/artists", data);
      output(result, globalOpts);
    }),
  );
}
