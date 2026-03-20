import { Command } from "commander";
import { registerEnvCommands } from "./commands/env.js";
import { registerLoginCommand } from "./commands/login.js";
import { registerLogoutCommand } from "./commands/logout.js";
import { registerUsersCommands } from "./commands/users.js";
import { registerEventsCommands } from "./commands/events.js";
import { registerArtistsCommands } from "./commands/artists.js";
import { registerVenuesCommands } from "./commands/venues.js";
import { registerRoomsCommands } from "./commands/rooms.js";
import { registerTicketTypesCommands } from "./commands/ticket-types.js";
import { registerTicketsCommands } from "./commands/tickets.js";
import { registerOrdersCommands } from "./commands/orders.js";
import { registerAddOnsCommands } from "./commands/add-ons.js";
import { registerCustomChargesCommands } from "./commands/custom-charges.js";
import { registerPromoCodesCommands } from "./commands/promo-codes.js";
import { registerOrganizerReservationsCommands } from "./commands/organizer-reservations.js";
import { registerOrganizerOrdersCommands } from "./commands/organizer-orders.js";
import { registerTicketReservationsCommands } from "./commands/ticket-reservations.js";
import { registerTicketTransfersCommands } from "./commands/ticket-transfers.js";
import { registerFinanceItemsCommands } from "./commands/finance-items.js";
import { registerFinanceCategoriesCommands } from "./commands/finance-categories.js";
import { registerSettlementsCommands } from "./commands/settlements.js";
import { registerRefundsCommands } from "./commands/refunds.js";
import { registerFeeRulesCommands } from "./commands/fee-rules.js";
import { registerFansCommands } from "./commands/fans.js";
import { registerScanCommands } from "./commands/scan.js";
import { registerMembershipsCommands } from "./commands/memberships.js";
import { registerOffersCommands } from "./commands/offers.js";
import { registerTagsCommands } from "./commands/tags.js";
import { registerTaggedItemsCommands } from "./commands/tagged-items.js";
import { registerCanonicalTagsCommands } from "./commands/canonical-tags.js";
import { registerNotesCommands } from "./commands/notes.js";
import { registerCalendarContactsCommands } from "./commands/calendar-contacts.js";
import { registerFoodAndBeverageCommands } from "./commands/food-and-beverage.js";
import { registerManualTicketCountsCommands } from "./commands/manual-ticket-counts.js";
import { registerShowActivitiesCommands } from "./commands/show-activities.js";
import { registerInboundSubmissionsCommands } from "./commands/inbound-submissions.js";
import { registerDocsCommands } from "./commands/docs.js";

export function createProgram(): Command {
  const program = new Command();

  program
    .name("opdt")
    .description("Opendate CLI — manage your Opendate account from the command line")
    .version("0.1.0")
    .option("--json", "Output in JSON format")
    .option("--verbose", "Enable verbose output")
    .option("--base-url <url>", "Override API base URL");

  // Docs & reference
  registerDocsCommands(program);

  // Environment
  registerEnvCommands(program);

  // Auth
  registerLoginCommand(program);
  registerLogoutCommand(program);

  // Users
  registerUsersCommands(program);

  // Core resources
  registerEventsCommands(program);
  registerArtistsCommands(program);
  registerVenuesCommands(program);
  registerRoomsCommands(program);

  // Ticketing
  registerTicketTypesCommands(program);
  registerTicketsCommands(program);
  registerOrdersCommands(program);
  registerAddOnsCommands(program);
  registerCustomChargesCommands(program);
  registerPromoCodesCommands(program);

  // Organizer flows
  registerOrganizerReservationsCommands(program);
  registerOrganizerOrdersCommands(program);
  registerTicketReservationsCommands(program);
  registerTicketTransfersCommands(program);

  // Financial
  registerFinanceItemsCommands(program);
  registerFinanceCategoriesCommands(program);
  registerSettlementsCommands(program);
  registerRefundsCommands(program);
  registerFeeRulesCommands(program);

  // Fans & engagement
  registerFansCommands(program);
  registerScanCommands(program);
  registerMembershipsCommands(program);

  // Offers & deals
  registerOffersCommands(program);

  // Tags
  registerTagsCommands(program);
  registerTaggedItemsCommands(program);
  registerCanonicalTagsCommands(program);

  // Operations
  registerNotesCommands(program);
  registerCalendarContactsCommands(program);
  registerFoodAndBeverageCommands(program);
  registerManualTicketCountsCommands(program);
  registerShowActivitiesCommands(program);
  registerInboundSubmissionsCommands(program);

  return program;
}
