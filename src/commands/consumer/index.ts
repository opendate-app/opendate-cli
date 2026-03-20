import type { Command } from "commander";
import chalk from "chalk";
import { loadConfig, saveConfig } from "../../config.js";
import { registerConsumerConfirmsCommands } from "./confirms.js";
import { registerConsumerTicketsCommands } from "./tickets.js";
import { registerConsumerTicketTransfersCommands } from "./ticket-transfers.js";
import { registerConsumerMembershipsCommands } from "./memberships.js";
import { registerConsumerUsersCommands } from "./users.js";
import { registerConsumerPushNotificationsCommands } from "./push-notifications.js";
import { registerConsumerDeviceRegistrationsCommands } from "./device-registrations.js";
import { registerConsumerVenueMembershipsCommands } from "./venue-memberships.js";
import { registerConsumerVenueOwnershipsCommands } from "./venue-ownerships.js";
import { registerConsumerVenueRegistrationsCommands } from "./venue-registrations.js";

export function registerConsumerCommands(program: Command): void {
  const consumer = program
    .command("consumer")
    .description("Consumer API — fan-facing mobile app commands");

  consumer
    .command("use-venue <id>")
    .description("Set the default venue ownership ID for consumer commands")
    .action((id: string) => {
      saveConfig({ consumerVenueOwnershipId: id });
      console.log(chalk.green(`Default consumer venue set to ${id}`));
    });

  consumer
    .command("current-venue")
    .description("Show the current default venue ownership ID")
    .action(() => {
      const config = loadConfig();
      if (config.consumerVenueOwnershipId) {
        console.log(
          `Current consumer venue: ${chalk.cyan(config.consumerVenueOwnershipId)}`,
        );
      } else {
        console.log(
          chalk.yellow(
            'No default venue set. Run "opdt consumer use-venue <id>" to set one.',
          ),
        );
      }
    });

  registerConsumerVenueOwnershipsCommands(consumer);
  registerConsumerConfirmsCommands(consumer);
  registerConsumerTicketsCommands(consumer);
  registerConsumerTicketTransfersCommands(consumer);
  registerConsumerMembershipsCommands(consumer);
  registerConsumerUsersCommands(consumer);
  registerConsumerPushNotificationsCommands(consumer);
  registerConsumerDeviceRegistrationsCommands(consumer);
  registerConsumerVenueMembershipsCommands(consumer);
  registerConsumerVenueRegistrationsCommands(consumer);
}
