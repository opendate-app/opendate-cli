import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";

export function registerCalendarContactsCommands(program: Command): void {
  const group = program
    .command("calendar-contacts")
    .description("View calendar event contacts");

  addPaginationOptions(
    group
      .command("list")
      .description("List calendar event contacts")
      .option("--sort <sort>", "Sort order"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const params: Record<string, any> = {
        ...paginationParams(opts),
      };
      if (opts.sort) params.sort = opts.sort;
      const data = await client.get("/api/v2/calendar_event_contacts", params);
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
