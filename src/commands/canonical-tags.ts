import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";

export function registerCanonicalTagsCommands(program: Command): void {
  const group = program
    .command("canonical-tags")
    .description("View canonical tags");

  group
    .command("list")
    .description("List canonical tags")
    .option("--search <query>", "Search canonical tags")
    .option("--category-id <id>", "Filter by category ID")
    .action(
      withErrorHandling(async (opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const params: Record<string, any> = {};
        if (opts.search) params.search = opts.search;
        if (opts.categoryId) params.category_id = opts.categoryId;
        const data = await client.get("/api/v2/canonical_tags", params);
        output(data, globalOpts);
      }),
    );
}
