import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";

export function registerSettlementsCommands(program: Command): void {
  const group = program
    .command("settlements")
    .description("View settlement information");

  group
    .command("summary")
    .description("Get settlement summary")
    .requiredOption("--event <id>", "Event ID")
    .action(
      withErrorHandling(async (opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/confirms/${opts.event}/settlements/summary`);
        output(data, globalOpts);
      }),
    );
}
