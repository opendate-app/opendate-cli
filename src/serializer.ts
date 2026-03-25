const CLI_SERIALIZERS: Record<string, string> = {
  add_ons: "API::V2::CLI::AddOnBlueprint",
  artists: "API::V2::CLI::ArtistBlueprint",
  calendar_event_contacts: "API::V2::CLI::CalendarEventContactBlueprint",
  confirms: "API::V2::CLI::ConfirmBlueprint",
  custom_charge_types: "API::V2::CLI::CustomChargeTypeBlueprint",
  fans: "API::V2::CLI::FanBlueprint",
  fee_rules: "API::V2::CLI::FeeRuleBlueprint",
  finance_categories: "API::V2::CLI::FinanceCategoryBlueprint",
  finance_items: "API::V2::CLI::FinanceItemBlueprint",
  food_and_beverage_items: "API::V2::CLI::FoodAndBeverageItemBlueprint",
  inbound_submissions: "API::V2::CLI::InboundSubmissionBlueprint",
  manual_ticket_counts: "API::V2::CLI::ManualTicketCountBlueprint",
  memberships: "API::V2::CLI::MembershipBlueprint",
  notes: "API::V2::CLI::NoteBlueprint",
  offers: "API::V2::CLI::OfferBlueprint",
  orders: "API::V2::CLI::OrderBlueprint",
  promo_codes: "API::V2::CLI::PromoCodeBlueprint",
  refunds: "API::V2::CLI::RefundBlueprint",
  rooms: "API::V2::CLI::RoomBlueprint",
  show_activities: "API::V2::CLI::ShowActivityBlueprint",
  tags: "API::V2::CLI::TagBlueprint",
  tagged_items: "API::V2::CLI::TaggedItemBlueprint",
  tickets: "API::V2::CLI::TicketBlueprint",
  ticket_reservations: "API::V2::CLI::TicketReservationBlueprint",
  ticket_types: "API::V2::CLI::TicketTypeBlueprint",
  venue_ownerships: "API::V2::CLI::VenueOwnershipBlueprint",
};

export function serializerParam(resource: string): Record<string, string> {
  const name = CLI_SERIALIZERS[resource];
  return name ? { serializer: name } : {};
}
