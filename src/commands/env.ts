import type { Command } from "commander";
import chalk from "chalk";
import { loadConfig, saveConfig, resolveBaseUrl } from "../config.js";
import { withErrorHandling } from "../errors.js";
import { ENVIRONMENT_URLS, type OpdtEnvironment } from "../types/index.js";

const VALID_ENVS = Object.keys(ENVIRONMENT_URLS) as OpdtEnvironment[];

export function registerEnvCommands(program: Command): void {
  const env = program
    .command("env")
    .description("Manage environment (production or test)");

  env
    .command("current")
    .description("Show the current environment")
    .action(
      withErrorHandling(async () => {
        const config = loadConfig();
        const url = resolveBaseUrl(config);
        console.log(`Environment: ${chalk.cyan(config.environment)}`);
        console.log(`API URL:     ${chalk.dim(url)}`);
      }),
    );

  env
    .command("set <environment>")
    .description(`Set the environment (${VALID_ENVS.join(", ")})`)
    .action(
      withErrorHandling(async (environment: string) => {
        if (!VALID_ENVS.includes(environment as OpdtEnvironment)) {
          console.error(
            chalk.red(
              `Invalid environment "${environment}". Valid options: ${VALID_ENVS.join(", ")}`,
            ),
          );
          process.exit(1);
        }

        const env = environment as OpdtEnvironment;
        saveConfig({
          environment: env,
          baseUrl: ENVIRONMENT_URLS[env],
          // Clear auth when switching environments
          accessToken: undefined,
          refreshToken: undefined,
          tokenExpiresAt: undefined,
        });

        console.log(
          chalk.green(`Switched to ${env} (${ENVIRONMENT_URLS[env]})`),
        );
        console.log(chalk.yellow("Auth tokens cleared — run `opdt login` to authenticate."));
      }),
    );
}
