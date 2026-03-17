import type { Command } from "commander";

export function addPaginationOptions(cmd: Command): Command {
  return cmd
    .option("--page <number>", "Page number", "1")
    .option("--per-page <number>", "Results per page (max 250)", "30");
}

export function paginationParams(opts: any): Record<string, string> {
  const params: Record<string, string> = {};
  if (opts.page) params.page = opts.page;
  if (opts.perPage) params.per_page = opts.perPage;
  return params;
}
