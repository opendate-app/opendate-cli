import type { Command } from "commander";
import chalk from "chalk";

export interface FilterDef {
  flag: string;
  description: string;
  ransackKey?: string;
  paramKey?: string;
  isBoolean?: boolean;
}

export function addSortOption(cmd: Command): Command {
  return cmd.option("--sort <sort>", 'Sort order (e.g. "created_at desc")');
}

export function sortParams(opts: any): Record<string, string> {
  const params: Record<string, string> = {};
  if (opts.sort) params["q[s]"] = opts.sort;
  return params;
}

export function addFilterOptions(
  cmd: Command,
  filters: FilterDef[],
): Command {
  for (const f of filters) {
    if (f.isBoolean) {
      cmd.option(f.flag, f.description);
    } else {
      cmd.option(f.flag, f.description);
    }
  }
  // Raw Ransack escape hatches
  cmd.option(
    "--filter <key=value>",
    "Ransack filter (repeatable, e.g. --filter \"title_cont=jazz\")",
    collectFilter,
    [],
  );
  cmd.option(
    "--query <json>",
    'Ransack filters as JSON (e.g. \'{"title_cont":"jazz"}\')',
  );
  return cmd;
}

export function filterParams(
  opts: any,
  filters: FilterDef[],
): Record<string, any> {
  const params: Record<string, any> = {};

  for (const f of filters) {
    const optKey = flagToOptKey(f.flag);
    const value = opts[optKey];
    if (value === undefined || value === false) continue;

    if (f.ransackKey) {
      params[`q[${f.ransackKey}]`] = f.isBoolean ? true : value;
    } else if (f.paramKey) {
      params[f.paramKey] = f.isBoolean ? true : value;
    }
  }

  // Process --filter flags (repeatable)
  if (Array.isArray(opts.filter) && opts.filter.length > 0) {
    for (const entry of opts.filter) {
      const eqIndex = entry.indexOf("=");
      if (eqIndex === -1) {
        console.error(
          chalk.red(`Invalid --filter format: "${entry}". Use key=value.`),
        );
        process.exit(1);
      }
      const key = entry.slice(0, eqIndex);
      const val = entry.slice(eqIndex + 1);
      params[`q[${key}]`] = val;
    }
  }

  // Process --query flag (JSON)
  if (opts.query) {
    try {
      const parsed = JSON.parse(opts.query);
      for (const [key, val] of Object.entries(parsed)) {
        params[`q[${key}]`] = val;
      }
    } catch {
      console.error(chalk.red("Invalid JSON in --query flag"));
      process.exit(1);
    }
  }

  return params;
}

function collectFilter(value: string, previous: string[]): string[] {
  return [...previous, value];
}

function flagToOptKey(flag: string): string {
  // Extract the flag name: "--start-after <date>" -> "start-after" -> "startAfter"
  const match = flag.match(/^--([a-z][a-z0-9-]*)/);
  if (!match) return flag;
  return match[1].replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
