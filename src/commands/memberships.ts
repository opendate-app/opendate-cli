import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";

export function registerMembershipsCommands(program: Command): void {
  const group = program
    .command("memberships")
    .description("View memberships");

  addPaginationOptions(
    group
      .command("list")
      .description("List memberships")
      .option("--search <query>", "Search memberships")
      .option("--sort <sort>", "Sort order"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const params: Record<string, any> = {
        ...paginationParams(opts),
      };
      if (opts.search) params.search = opts.search;
      if (opts.sort) params.sort = opts.sort;
      const data = await client.get("/api/v2/memberships", params);
      output(data, globalOpts);
    }),
  );
}
