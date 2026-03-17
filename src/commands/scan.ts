import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";

export function registerScanCommands(program: Command): void {
  const group = program
    .command("scan")
    .description("Scan barcodes and tokens");

  group
    .command("lookup <code>")
    .description("Look up a scan code")
    .action(
      withErrorHandling(async (code, _opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/scan_lookups/${code}`);
        output(data, globalOpts);
      }),
    );
}
