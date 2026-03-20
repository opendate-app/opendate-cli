import type { Command } from "commander";
import { loadConfig } from "./config.js";

export function resolveVenueOwnershipId(opts: any): string {
  if (opts.venue) return opts.venue;

  const config = loadConfig();
  if (config.consumerVenueOwnershipId) return config.consumerVenueOwnershipId;

  console.error(
    'No venue set. Run "opdt consumer use-venue <id>" or pass --venue <id>.',
  );
  process.exit(1);
}

export function consumerBasePath(venueOwnershipId: string): string {
  return `/api/consumer/venue_ownerships/${venueOwnershipId}`;
}

export function addVenueOption(cmd: Command): Command {
  cmd.option("--venue <id>", "Venue ownership ID (overrides stored value)");
  return cmd;
}
