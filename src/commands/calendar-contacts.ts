import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addSortOption, sortParams, addFilterOptions, filterParams } from "../filters.js";

export function registerCalendarContactsCommands(program: Command): void {
  const group = program
    .command("calendar-contacts")
    .description("View calendar event contacts");

  addSortOption(
    addFilterOptions(
      addPaginationOptions(
        group.command("list").description("List calendar event contacts"),
      ),
      [],
    ),
    "Calendar Contacts",
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const data = await client.get("/api/v2/calendar_event_contacts", {
        ...paginationParams(opts),
        ...filterParams(opts, []),
        ...sortParams(opts),
      });
      output(data, globalOpts);
    }),
  );

  group
    .command("get <id>")
    .description("Get a calendar event contact by ID")
    .action(
      withErrorHandling(async (id, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/calendar_event_contacts/${id}`);
        output(data, globalOpts);
      }),
    );
}
