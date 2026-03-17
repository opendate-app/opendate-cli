import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";

export function registerInboundSubmissionsCommands(program: Command): void {
  const group = program
    .command("inbound-submissions")
    .description("Manage inbound artist submissions");

  addMutationOptions(
    group
      .command("create")
      .description("Create an inbound submission")
      .requiredOption("--app-id <id>", "Application ID (sent as AppId header)"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const data = parseMutationData(opts);
      if (globalOpts.dryRun) {
        handleDryRun("POST", "/api/v2/inbound_submissions", data);
        return;
      }
      const client = createClient(globalOpts.baseUrl);
      client.setHeader("AppId", opts.appId);
      const result = await client.post("/api/v2/inbound_submissions", data);
      output(result, globalOpts);
    }),
  );
}
