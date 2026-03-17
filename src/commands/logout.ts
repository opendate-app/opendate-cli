import type { Command } from "commander";
import chalk from "chalk";
import { createClient } from "../client.js";
import { clearConfig, loadConfig } from "../config.js";
import { withErrorHandling } from "../errors.js";

export function registerLogoutCommand(program: Command): void {
  program
    .command("logout")
    .description("Revoke token and log out")
    .action(
      withErrorHandling(async (_opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const config = loadConfig();

        if (config.accessToken) {
          try {
            const client = createClient(globalOpts.baseUrl);
            await client.post("/oauth/revoke", {
              token: config.accessToken,
            });
          } catch {
            // Revocation failed, still clear local config
          }
        }

        clearConfig();
        console.log(chalk.green("Logged out successfully."));
      }),
    );
}
