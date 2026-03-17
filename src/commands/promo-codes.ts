import type { Command } from "commander";
import { createClient } from "../client.js";
import { output } from "../output.js";
import { withErrorHandling } from "../errors.js";
import { addPaginationOptions, paginationParams } from "../pagination.js";
import { addMutationOptions, parseMutationData, handleDryRun } from "../mutation.js";

export function registerPromoCodesCommands(program: Command): void {
  const promoCodes = program.command("promo-codes").description("Manage promo codes");

  addPaginationOptions(
    promoCodes
      .command("list")
      .description("List promo codes for an event")
      .requiredOption("--event <id>", "Event ID")
      .option("--sort <sort>", "Sort order"),
  ).action(
    withErrorHandling(async (opts, cmd) => {
      const globalOpts = cmd.optsWithGlobals();
      const client = createClient(globalOpts.baseUrl);
      const params: Record<string, any> = {
        ...paginationParams(opts),
      };
      if (opts.sort) params.sort = opts.sort;
      const data = await client.get(`/api/v2/confirms/${opts.event}/promo_codes`, params);
      output(data, globalOpts);
    }),
  );

  promoCodes
    .command("get <id>")
    .description("Get a promo code by ID")
    .requiredOption("--event <id>", "Event ID")
    .action(
      withErrorHandling(async (id, opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const data = await client.get(`/api/v2/confirms/${opts.event}/promo_codes/${id}`);
        output(data, globalOpts);
      }),
    );

  promoCodes
    .command("lookup")
    .description("Look up a promo code by code")
    .requiredOption("--event <id>", "Event ID")
    .requiredOption("--code <code>", "Promo code")
    .action(
      withErrorHandling(async (opts, cmd) => {
        const globalOpts = cmd.optsWithGlobals();
        const client = createClient(globalOpts.baseUrl);
        const params: Record<string, any> = {
          code: opts.code,
        };
        const data = await client.get(`/api/v2/confirms/${opts.event}/promo_codes/lookup`, params);
        output(data, globalOpts);
      }),
    );
}
