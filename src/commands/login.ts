import type { Command } from "commander";
import chalk from "chalk";
import { createUnauthenticatedClient } from "../client.js";
import { saveConfig } from "../config.js";
import { withErrorHandling } from "../errors.js";
import { promptCredentials } from "../utils/prompt.js";

export function registerLoginCommand(program: Command): void {
  program
    .command("login")
    .description("Authenticate with Opendate")
    .action(
      withErrorHandling(async (_opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const { email, password, clientId, clientSecret } =
          await promptCredentials();

        const client = createUnauthenticatedClient(globalOpts.baseUrl);
        const data = await client.postForm("/oauth/token", {
          grant_type: "password",
          email,
          password,
          client_id: clientId,
          client_secret: clientSecret,
        });

        saveConfig({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          tokenExpiresAt: Date.now() + data.expires_in * 1000,
          clientId,
          clientSecret,
        });

        console.log(chalk.green(`Logged in as ${email}`));
      }),
    );
}
