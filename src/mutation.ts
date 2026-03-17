import { readFileSync } from "node:fs";
import chalk from "chalk";

export function parseMutationData(opts: any): Record<string, any> | undefined {
  if (opts.data) {
    try {
      return JSON.parse(opts.data);
    } catch {
      console.error(chalk.red("Invalid JSON in --data flag"));
      process.exit(1);
    }
  }

  if (opts.dataFile) {
    try {
      const raw = readFileSync(opts.dataFile, "utf-8");
      return JSON.parse(raw);
    } catch (err) {
      console.error(
        chalk.red(`Failed to read --data-file: ${(err as Error).message}`),
      );
      process.exit(1);
    }
  }

  return undefined;
}

export function addMutationOptions(cmd: any): any {
  return cmd
    .option("--data <json>", "JSON data for the request body")
    .option("--data-file <path>", "Path to a JSON file for the request body")
    .option("--dry-run", "Preview the request without executing");
}

export function handleDryRun(
  method: string,
  path: string,
  data?: any,
): boolean {
  const opts =
    data !== undefined
      ? (typeof data === "object" ? data : {})
      : {};

  // Check if dry-run is in the calling command's options
  // This function is called by the command handler which checks opts.dryRun
  console.log(chalk.yellow(`[DRY RUN] ${method} ${path}`));
  if (data && Object.keys(data).length > 0) {
    console.log(chalk.yellow("Body:"), JSON.stringify(data, null, 2));
  }
  return true;
}
