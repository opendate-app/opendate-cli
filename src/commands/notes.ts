import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addSortOption, sortParams, addFilterOptions, filterParams } from "../filters.js";

export function registerNotesCommands(program: Command): void {
  const group = program
    .command("notes")
    .description("View notes");

  addSortOption(
    addFilterOptions(
      addPaginationOptions(
        group.command("list").description("List notes"),
      ),
      [],
    ),
    "Notes",
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get("/api/v2/notes", {
        ...paginationParams(opts),
        ...filterParams(opts, []),
        ...sortParams(opts),
      });
      output(data, globalOpts);
    }),
  );

  group
    .command("get <id>")
    .description("Get a note by ID")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/notes/${id}`);
        output(data, globalOpts);
      }),
    );
}
