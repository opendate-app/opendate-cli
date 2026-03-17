import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";

export function registerArtistsCommands(program: Command): void {
  const artists = program.command("artists").description("Manage artists");

  addPaginationOptions(
    artists
      .command("list")
      .description("List artists")
      .option("--search <query>", "Search artists")
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
      const data = await client.get("/api/v2/artists", params);
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
