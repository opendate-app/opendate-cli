# opdt — Opendate CLI

Command line tool for the [Opendate API](https://app.opendate.io/developers). Manage events, tickets, orders, fans, finances, and more from your terminal.

## Installation

```bash
git clone https://github.com/opendate/opendate-cli.git
cd opendate-cli
npm install
npm run build
npm link
```

This installs `opdt` globally on your machine. You can now run `opdt` from any directory.

To update later:

```bash
cd opendate-cli
git pull
npm install
npm run build
```

## AI Agent Setup

If you use an AI coding assistant (e.g., Claude Code), add the following to your assistant's configuration so it knows how to use the CLI. For Claude Code, add this to `~/.claude/CLAUDE.md`:

```markdown
## Opendate CLI (opdt)

The `opdt` CLI tool is installed globally and provides access to the Opendate API. When asked about Opendate data (events, tickets, venues, orders, etc.), use it.

- Run `opdt --help` to see all available commands
- Run `opdt docs` to see the full field/filter reference
- Run `opdt docs <resource>` to see fields, scopes, and filter examples for a specific resource
- Run `opdt <resource> <command> --help` for command-specific options
- Supports `--json` flag for machine-readable output
- Supports Ransack filters via `--query 'q[field_predicate]=value'`
```

This enables AI agents to discover and use `opdt` commands autonomously — just ask in natural language (e.g., "show me all events this week") and the agent will build the right command.

## Getting Started

### 1. Log in

```bash
opdt login
```

You'll be prompted for your email, password, client ID, and client secret. Your auth token is stored in `~/.opdt/config.json`.

> **Note:** A client ID and client secret are required to authenticate. If you don't have these credentials, contact our team at [support@opendate.io](mailto:support@opendate.io).

### 2. Verify your session

```bash
opdt whoami
```

### 3. Start using it

```bash
opdt events list
opdt events get 123
opdt artists list
opdt tickets list --event 456
```

### 4. Log out

```bash
opdt logout
```

## Environments

By default, all requests go to `https://app.opendate.io` (production). To switch to a test environment:

```bash
# Switch to test (http://opendate.test)
opdt env set test

# Switch back to production
opdt env set production

# Check current environment
opdt env current
```

Switching environments clears your auth tokens, so you'll need to run `opdt login` again.

You can also override the base URL for a single command:

```bash
opdt events list --base-url http://localhost:3000
```

## Usage

Commands follow the pattern `opdt <resource> <action> [args] [options]`.

### Global Options

| Flag | Description |
|---|---|
| `--json` | Output in JSON format (default is table) |
| `--verbose` | Enable verbose output |
| `--base-url <url>` | Override API base URL for this command |
| `--version` | Show version number |
| `--help` | Show help |

### Events

```bash
opdt events list                      # List all events
opdt events list --page 2 --per-page 50  # With pagination
opdt events get <id>                  # Get event details
opdt events description <id>          # Get event description (HTML)
opdt events similars <id>             # Find similar events
opdt events pnl <id>                  # Profit and loss report
opdt events toast-summary <id>        # Toast POS summary
opdt events cash-summary <id>         # Cash transaction summary
opdt events recommendations           # Event recommendations
```

### Artists

```bash
opdt artists list
opdt artists get <id>
opdt artists create --data '{"artist": {"name": "Band Name"}}'
```

### Venues & Rooms

```bash
opdt venues list
opdt venues get <id>
opdt rooms list
opdt rooms get <id>
```

### Tickets

Ticket commands require `--event <id>` to specify which event.

```bash
opdt tickets list --event <id>
opdt tickets get <barcode> --event <id>
opdt tickets check-in <barcode> --event <id>
opdt tickets print <barcode> --event <id>
```

### Ticket Types

```bash
opdt ticket-types list --event <id>
opdt ticket-types get <type-id> --event <id>
```

### Orders

```bash
opdt orders list --event <id>
opdt orders get <order-id> --event <id>
opdt orders update <order-id> --event <id> --data '{"order": {"first_name": "Jane"}}'
opdt orders print <order-id> --event <id>
opdt orders send-receipt <order-id> --event <id>
opdt orders check-in <order-id> --event <id>
opdt orders check-out <order-id> --event <id>
```

### Promo Codes

```bash
opdt promo-codes list --event <id>
opdt promo-codes get <promo-id> --event <id>
opdt promo-codes lookup --event <id> --code SUMMER2024
```

### Add-Ons & Custom Charges

```bash
opdt add-ons list --event <id>
opdt custom-charges list --event <id>
```

### Organizer Reservations

```bash
opdt organizer-reservations build --event <id> --data '...'
opdt organizer-reservations create --event <id> --data '...'
opdt organizer-reservations update <token> --event <id> --data '...'
opdt organizer-reservations cancel <token> --event <id>
opdt organizer-reservations complete <token> --event <id>
```

### Organizer Orders

```bash
opdt organizer-orders build --event <id> --data '...'
opdt organizer-orders create --event <id> --data '...'
```

### Ticket Reservations & Transfers

```bash
opdt ticket-reservations list --event <id>
opdt ticket-reservations get <reservation-id> --event <id>
opdt ticket-transfers new --order <id>
opdt ticket-transfers create --order <id> --data '...'
```

### Fans

```bash
opdt fans list
opdt fans get <id>
opdt fans create --data '{"fan": {"first_name": "Jane", "last_name": "Doe", "email": "jane@example.com"}}'
opdt fans recommendations --event <id>
opdt fans update-marketing <id> --venue-id 1 --subscribed true
```

### Scanning

```bash
opdt scan lookup <barcode-or-token>
```

### Memberships

```bash
opdt memberships list
```

### Finance

```bash
opdt finance-items list --event <id>
opdt finance-items get <item-id> --event <id>
opdt finance-items create --event <id> --data '...'
opdt finance-items update <item-id> --event <id> --data '...'

opdt finance-categories list
opdt finance-categories create --data '{"finance_category": {"name": "Catering"}}'
opdt finance-categories update <id> --data '...'
opdt finance-categories delete <id>

opdt settlements summary --event <id>

opdt refunds list --event <id>
opdt refunds get <refund-id> --event <id>

opdt fee-rules list
opdt fee-rules get <id>
```

### Offers

```bash
opdt offers list
opdt offers get <id>
opdt offers create --data '...'
```

### Tags

```bash
opdt tags list
opdt tags list --scope events
opdt tags get <id>
opdt tags create --data '{"tag": {"name": "VIP", "scope": "events"}}'
opdt tags update <id> --data '{"tag": {"name": "Premium"}}'
opdt tags delete <id>

opdt tagged-items list --taggable-id 1 --taggable-type Event
opdt tagged-items create --data '...'
opdt tagged-items delete <id>

opdt canonical-tags list
```

### Show Activities

```bash
opdt show-activities list --event <id>
opdt show-activities get <activity-id> --event <id>
opdt show-activities create-offline-checkin --event <id> --data '...'
```

### Other Resources

```bash
opdt notes list
opdt notes get <id>

opdt calendar-contacts list
opdt calendar-contacts get <id>

opdt food-and-beverage list
opdt food-and-beverage create --data '...'

opdt manual-ticket-counts list
opdt manual-ticket-counts create --data '...'
opdt manual-ticket-counts delete <id>

opdt inbound-submissions create --app-id <app-id> --data '...'
```

### Users

```bash
opdt users current
opdt users create --data '...'
opdt users update <id> --data '...'
opdt users delete <id>
opdt users reset-password --email user@example.com
opdt users resend-confirmation --email user@example.com
```

## Passing Data

For commands that create or update resources, pass JSON with `--data` or `--data-file`:

```bash
# Inline JSON
opdt artists create --data '{"artist": {"name": "The Headliners"}}'

# From a file
opdt artists create --data-file ./artist.json
```

## Dry Run

Preview what a mutating command would send without executing it:

```bash
opdt tags create --data '{"tag": {"name": "VIP"}}' --dry-run
# [DRY RUN] POST /api/v2/tags
# Body: { "tag": { "name": "VIP" } }
```

## JSON Output

Add `--json` to any command to get raw JSON instead of a formatted table:

```bash
opdt events list --json
opdt events get 123 --json
```

## Pagination

List commands support `--page` and `--per-page` (max 250):

```bash
opdt events list --page 3 --per-page 100
```

## Filtering & Sorting

All list commands support filtering and sorting via the Opendate API's Ransack query interface.

### Quick Start

```bash
# Convenience flags (most common filters)
opdt events list --search "jazz" --classification confirmed --sort "start_time asc"

# Raw Ransack filters (any field + predicate)
opdt events list --filter "title_cont=jazz" --filter "venue_id_eq=42"

# Complex queries via JSON
opdt events list --query '{"start_time_gteq":"2024-01-01","calendar_classification_eq":"confirmed"}'
```

### Filter Flags

Every list command supports these flags:

| Flag | Description |
|---|---|
| `--sort <sort>` | Sort order, e.g. `"created_at desc"`, `"name asc"` |
| `--filter <key=value>` | Ransack filter (repeatable). Key is `field_predicate`, e.g. `title_cont=jazz` |
| `--query <json>` | Ransack filters as JSON object, e.g. `'{"title_cont":"jazz","venue_id_eq":"5"}'` |

Some commands also have convenience flags like `--search`, `--venue-id`, etc. (documented per-resource below).

### Ransack Predicate Reference

Combine any field name with a predicate suffix to build a filter. For example, the field `title` with predicate `_cont` becomes `title_cont`.

| Predicate | Description | Example |
|---|---|---|
| `_eq` | Equals | `--filter "status_eq=active"` |
| `_not_eq` | Not equals | `--filter "status_not_eq=canceled"` |
| `_cont` | Contains (case-insensitive) | `--filter "title_cont=jazz"` |
| `_not_cont` | Does not contain | `--filter "title_not_cont=test"` |
| `_start` | Starts with | `--filter "name_start=The"` |
| `_end` | Ends with | `--filter "email_end=gmail.com"` |
| `_gt` | Greater than | `--filter "price_gt=50"` |
| `_lt` | Less than | `--filter "price_lt=100"` |
| `_gteq` | Greater than or equal | `--filter "start_time_gteq=2024-01-01"` |
| `_lteq` | Less than or equal | `--filter "start_time_lteq=2024-12-31"` |
| `_in` | In list (comma-separated) | `--filter "id_in=1,2,3"` |
| `_not_in` | Not in list | `--filter "id_not_in=4,5"` |
| `_true` | Boolean is true | `--filter "paid_true=1"` |
| `_false` | Boolean is false | `--filter "cash_false=1"` |
| `_null` | Is null | `--filter "refunded_at_null=1"` |
| `_not_null` | Is not null | `--filter "checked_in_at_not_null=1"` |
| `_present` | Is present (not null/empty) | `--filter "email_present=1"` |
| `_blank` | Is blank (null or empty) | `--filter "phone_number_blank=1"` |

### Sorting

Sort by any field with direction (`asc` or `desc`):

```bash
opdt events list --sort "start_time desc"
opdt fans list --sort "last_name asc"
opdt orders list --event 123 --sort "total desc"
```

---

## Resource Field Reference

Complete reference of filterable fields, scopes, and convenience flags for each resource. Use any field with a Ransack predicate via `--filter` or `--query`.

### Events (`opdt events list`)

**Convenience flags:**

| Flag | Description |
|---|---|
| `--search <query>` | Search events by title |
| `--venue-id <id>` | Filter by venue ID |
| `--has-ticket-types` | Only events with ticket types |
| `--start-after <date>` | Events starting on or after date (YYYY-MM-DD) |
| `--start-before <date>` | Events starting on or before date (YYYY-MM-DD) |
| `--classification <value>` | Filter by classification: `confirmed`, `past`, `canceled` |

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `title` | string | Event title |
| `start_time` | datetime | Event start time |
| `end_time` | datetime | Event end time |
| `start_date` | date | Event start date |
| `end_date` | date | Event end date |
| `door_time` | datetime | Door open time |
| `calendar_classification` | string | Status: `confirmed`, `past`, `canceled` |
| `venue_id` | integer | Venue ID |
| `venue_ownership_id` | integer | Venue ownership ID |
| `team_id` | integer | Team ID |
| `is_public` | boolean | Whether event is public |
| `published_at` | datetime | When event was published |
| `presenter` | string | Presenter name |
| `venue_capacity` | integer | Venue capacity |
| `age_restriction` | string | Age restriction |
| `ticketing_arrangement` | string | Ticketing arrangement type |
| `venue_permalink` | string | Venue permalink slug |
| `type` | string | Event type |
| `position` | integer | Display position |
| `eventbrite_event_id` | integer | Eventbrite event ID (if imported) |
| `pipeline_id` | integer | Pipeline ID |
| `seating_chart_id` | integer | Seating chart ID |
| `ticket_forecast` | integer | Ticket forecast number |
| `auto_added` | boolean | Whether auto-added |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

**Available scopes** (use as `--filter "scope_name=1"`):

| Scope | Description |
|---|---|
| `no_occurred_pipeline_event` | Events without an occurred pipeline event |
| `from_eventbrite` | Events imported from Eventbrite |
| `not_from_eventbrite` | Events not from Eventbrite |
| `from_axs` | Events imported from AXS |
| `not_from_axs` | Events not from AXS |
| `upcoming_non_seated` | Upcoming non-seated events |

**Examples:**

```bash
opdt events list --classification confirmed --start-after 2024-06-01
opdt events list --filter "title_cont=jazz" --filter "venue_id_eq=42"
opdt events list --query '{"start_time_gteq":"2024-01-01","is_public_true":"1"}'
opdt events list --sort "start_time desc" --per-page 100
```

---

### Artists (`opdt artists list`)

**Convenience flags:**

| Flag | Description |
|---|---|
| `--search <query>` | Search artists by name |

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `name` | string | Artist name |
| `hidden` | boolean | Whether hidden |
| `on_tour` | boolean | Whether currently on tour |
| `multi_artist` | boolean | Whether multi-artist |
| `spotify_id` | string | Spotify artist ID |
| `permalink` | string | Artist permalink |
| `genres` | text | Genres |
| `tags` | text | Tags |
| `facebook_url` | string | Facebook URL |
| `instagram_url` | string | Instagram URL |
| `twitter_url` | string | Twitter URL |
| `spotify_url` | string | Spotify URL |
| `youtube_url` | string | YouTube URL |
| `website_url` | string | Website URL |
| `average_ticket_cost` | integer | Average ticket cost |
| `total_capacity_sold` | float | Total capacity sold |
| `last_show_date` | date | Last show date |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

**Available scopes:**

| Scope | Description |
|---|---|
| `displayable` | Non-hidden artists |
| `single_artist` | Single artists only |
| `multi_artist` | Multi-artist entries only |
| `not_analyzed` | Not yet analyzed |

**Examples:**

```bash
opdt artists list --search "Beatles"
opdt artists list --filter "on_tour_true=1" --sort "name asc"
opdt artists list --filter "last_show_date_gteq=2024-01-01"
```

---

### Venues (`opdt venues list`)

**Convenience flags:**

| Flag | Description |
|---|---|
| `--search <query>` | Search venues by name |

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `nickname` | string | Venue display name |
| `email` | string | Venue email |
| `team_id` | integer | Team ID |
| `bio` | text | Venue bio/description |
| `primary_color_hex` | string | Primary brand color |
| `statement_descriptor_suffix` | string | Statement descriptor |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

**Examples:**

```bash
opdt venues list --search "Blue Note"
opdt venues list --filter "nickname_cont=theater" --sort "nickname asc"
```

---

### Rooms (`opdt rooms list`)

**Convenience flags:**

| Flag | Description |
|---|---|
| `--search <query>` | Search rooms by name |
| `--venue-id <id>` | Filter by venue ownership ID |

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `name` | string | Room name |
| `venue_ownership_id` | integer | Venue ownership ID |
| `capacity` | integer | Room capacity |
| `stage_type` | string | Stage type |
| `calendar_color_hex` | string | Calendar color |
| `notes` | text | Notes |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

**Examples:**

```bash
opdt rooms list --venue-id 5
opdt rooms list --filter "capacity_gteq=500" --sort "capacity desc"
```

---

### Tickets (`opdt tickets list --event <id>`)

**Convenience flags:**

| Flag | Description |
|---|---|
| `--search <query>` | Search by attendee name or email |
| `--ticket-type-id <id>` | Filter by ticket type ID |
| `--include-unpaid` | Include unpaid tickets |
| `--include-abstract` | Include abstract tickets |

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `first_name` | string | Attendee first name |
| `last_name` | string | Attendee last name |
| `email` | string | Attendee email |
| `barcode` | string | Ticket barcode |
| `checked_in_at` | datetime | Check-in timestamp (null = not checked in) |
| `paid` | boolean | Whether ticket is paid |
| `type` | string | Ticket type class (`Tickets::Admission`, `Tickets::AddOn`, `Tickets::Abstract`) |
| `ticket_type_id` | integer | Ticket type ID (via order_itemable) |
| `price` | decimal | Original price |
| `discounted_price` | decimal | Price after discount |
| `face_value` | decimal | Face value |
| `fees` | decimal | Total fees |
| `final_cost` | decimal | Final cost to buyer |
| `discount` | decimal | Discount amount |
| `refunded_at` | datetime | Refund timestamp |
| `disputed_at` | datetime | Dispute timestamp |
| `seat_assignment` | string | Seat assignment |
| `seat_type` | string | Seat type |
| `fan_id` | integer | Fan ID |
| `promo_code_id` | integer | Promo code ID |
| `product_name` | string | Product name |
| `sequence_number` | integer | Sequence number |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

**Available scopes:**

| Scope | Description |
|---|---|
| `is_paid` | Paid tickets only |
| `initially_paid` | Tickets that were initially paid |
| `unclaimed` | Unclaimed tickets |
| `manifested` | Manifested tickets |
| `comped` | Complimentary tickets |
| `checked_in` | Checked-in tickets |
| `is_admission` | Admission tickets only |
| `is_add_on` | Add-on tickets only |
| `is_abstract` | Abstract tickets only |

**Examples:**

```bash
opdt tickets list --event 123 --search "john@example.com"
opdt tickets list --event 123 --filter "checked_in_at_not_null=1" --sort "checked_in_at desc"
opdt tickets list --event 123 --filter "paid_true=1" --filter "refunded_at_null=1"
opdt tickets list --event 123 --include-unpaid --sort "created_at desc"
```

---

### Ticket Types (`opdt ticket-types list --event <id>`)

**Convenience flags:**

| Flag | Description |
|---|---|
| `--search <query>` | Search ticket types by name |

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `name` | string | Ticket type name |
| `price` | decimal | Price |
| `available` | integer | Number available |
| `free` | boolean | Whether free |
| `visibility` | string | Visibility setting |
| `sales_channel` | string | Sales channel |
| `manifested` | boolean | Whether manifested |
| `type` | string | Type class |
| `position` | integer | Display position |
| `start_time` | datetime | Sales start time |
| `end_time` | datetime | Sales end time |
| `start_date` | date | Sales start date |
| `end_date` | date | Sales end date |
| `minimum_tickets_per_order` | integer | Minimum per order |
| `maximum_tickets_per_order` | integer | Maximum per order |
| `absorb_fees` | boolean | Whether fees are absorbed |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

**Available scopes:**

| Scope | Description |
|---|---|
| `manifested` | Manifested ticket types |
| `unmanifested` | Unmanifested ticket types |
| `general_admission` | General admission types |
| `online_sales_channel` | Online sales channel only |
| `distribution_eligible` | Distribution eligible types |

**Examples:**

```bash
opdt ticket-types list --event 123 --search "VIP"
opdt ticket-types list --event 123 --filter "free_false=1" --sort "price desc"
```

---

### Orders (`opdt orders list --event <id>`)

**Convenience flags:**

| Flag | Description |
|---|---|
| `--search <query>` | Search by name or email |

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `first_name` | string | Buyer first name |
| `last_name` | string | Buyer last name |
| `email` | string | Buyer email |
| `total` | decimal | Order total |
| `subtotal` | decimal | Subtotal before fees |
| `discount` | decimal | Discount amount |
| `fees` | decimal | Fee amount |
| `state` | string | Order state (e.g. `paid`) |
| `cash` | boolean | Whether cash payment |
| `complimentary` | boolean | Whether complimentary |
| `type` | string | Order type class |
| `token` | string | Order token |
| `postal_code` | string | Buyer postal code |
| `card_brand` | string | Card brand |
| `card_last4` | string | Last 4 digits of card |
| `manual` | boolean | Whether manual order |
| `manual_type` | string | Manual order type |
| `promo_code_id` | integer | Promo code ID |
| `fan_id` | integer | Fan ID |
| `geo_state` | string | Geo state |
| `geo_city` | string | Geo city |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

**Available scopes:**

| Scope | Description |
|---|---|
| `is_paid` | Paid orders (default) |
| `eligible_for_refund` | Orders eligible for refund |
| `attended` | Orders with checked-in tickets |

**Examples:**

```bash
opdt orders list --event 123 --search "jane@example.com"
opdt orders list --event 123 --filter "cash_true=1" --sort "total desc"
opdt orders list --event 123 --filter "created_at_gteq=2024-06-01"
```

---

### Add-Ons (`opdt add-ons list --event <id>`)

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `name` | string | Add-on name |
| `price` | decimal | Price |
| `available` | integer | Number available |
| `position` | integer | Display position |
| `start_time` | datetime | Sales start time |
| `end_time` | datetime | Sales end time |
| `require_ticket_type` | boolean | Requires a ticket type |
| `absorb_fees` | boolean | Whether fees absorbed |
| `timed_entry` | boolean | Whether timed entry |
| `dynamic_pricing_enabled` | boolean | Dynamic pricing enabled |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

---

### Promo Codes (`opdt promo-codes list --event <id>`)

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `name` | string | Promo code name |
| `amount` | decimal | Discount amount |
| `percentage` | integer | Discount percentage |
| `unlimited` | boolean | Whether unlimited uses |
| `limit` | integer | Usage limit |
| `availability` | string | Availability setting |
| `reveal_hidden_tickets` | boolean | Whether reveals hidden tickets |
| `applies_to_ticket_types` | boolean | Applies to ticket types |
| `applies_to_add_ons` | boolean | Applies to add-ons |
| `start_time` | datetime | Valid from |
| `end_time` | datetime | Valid until |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

---

### Custom Charges (`opdt custom-charges list --event <id>`)

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `name` | string | Charge name |
| `type` | string | Charge type |
| `input_type` | string | Input type |
| `enabled` | boolean | Whether enabled |
| `sales_channel` | string | Sales channel |
| `default_amount` | decimal | Default amount |
| `created_at` | datetime | Record created timestamp |

**Available scopes:**

| Scope | Description |
|---|---|
| `enabled` | Enabled charges only |

---

### Fans (`opdt fans list`)

**Convenience flags:**

| Flag | Description |
|---|---|
| `--search <query>` | Search by name or email |

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `first_name` | string | First name |
| `last_name` | string | Last name |
| `email` | string | Email |
| `phone_number` | string | Phone number |
| `source` | string | Acquisition source |
| `city` | string | City |
| `state` | string | State |
| `zip` | string | ZIP code |
| `company_name` | string | Company name |
| `contact_type` | string | Contact type |
| `lifetime_value` | float | Lifetime value |
| `calendar_events_count` | integer | Number of events attended |
| `birthday` | date | Birthday |
| `facebook_url` | string | Facebook URL |
| `instagram_url` | string | Instagram URL |
| `twitter_url` | string | Twitter URL |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

**Available scopes:**

| Scope | Description |
|---|---|
| `name_or_email_like(query)` | Search name or email |
| `email_marketing_subscribed(venue_ownership_id)` | Subscribed to email marketing |
| `sms_marketing_subscribed(venue_ownership_id)` | Subscribed to SMS marketing |

**Examples:**

```bash
opdt fans list --search "jane@example.com"
opdt fans list --filter "city_eq=Nashville" --sort "lifetime_value desc"
opdt fans list --filter "calendar_events_count_gteq=5"
```

---

### Memberships (`opdt memberships list`)

**Convenience flags:**

| Flag | Description |
|---|---|
| `--search <query>` | Search by name or email |

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `first_name` | string | First name |
| `last_name` | string | Last name |
| `email` | string | Email |
| `status` | string | Membership status |
| `interval` | string | Billing interval |
| `amount_cents` | integer | Amount in cents |
| `token` | string | Membership token |
| `canceled_at` | datetime | Cancellation timestamp |
| `ended_at` | datetime | End timestamp |
| `current_period_start` | datetime | Current period start |
| `current_period_end` | datetime | Current period end |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

**Available scopes:**

| Scope | Description |
|---|---|
| `active_or_trialing` | Active or trialing memberships |
| `not_canceled` | Non-canceled memberships |

**Examples:**

```bash
opdt memberships list --search "john"
opdt memberships list --filter "status_eq=active" --sort "created_at desc"
```

---

### Finance Items (`opdt finance-items list --event <id>`)

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `activity` | string | Activity description |
| `amount` | decimal | Amount |
| `expense_type` | string | Expense type |
| `payment_method` | string | Payment method |
| `is_income` | boolean | Whether income (vs expense) |
| `paid` | boolean | Whether paid |
| `on_settlement` | boolean | Whether on settlement |
| `due_on` | date | Due date |
| `issued_on` | date | Issue date |
| `type` | string | Finance item type |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

**Examples:**

```bash
opdt finance-items list --event 123 --filter "is_income_true=1" --sort "amount desc"
opdt finance-items list --event 123 --filter "paid_false=1"
```

---

### Finance Categories (`opdt finance-categories list`)

**Convenience flags:**

| Flag | Description |
|---|---|
| `--search <query>` | Search by name |

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `name` | string | Category name |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

---

### Refunds (`opdt refunds list --event <id>`)

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `reason` | string | Refund reason |
| `amount` | decimal | Refund amount |
| `max_amount` | decimal | Maximum refund amount |
| `state` | string | Refund state |
| `type` | string | Refund type |
| `confirmed_at` | datetime | Confirmation timestamp |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

**Available scopes:**

| Scope | Description |
|---|---|
| `not_reviewing` | Refunds not in reviewing state (default) |

---

### Fee Rules (`opdt fee-rules list`)

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `minimum` | decimal | Minimum ticket price |
| `maximum` | decimal | Maximum ticket price |
| `opendate_service_fee` | decimal | Opendate service fee |
| `organizer_service_fee` | decimal | Organizer service fee |
| `processing_fee_percentage` | decimal | Processing fee percentage |
| `processing_fee_cash` | decimal | Cash processing fee |
| `inclusive_processing` | boolean | Whether inclusive processing |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

---

### Offers (`opdt offers list`)

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `event_name` | string | Event name |
| `state` | string | Offer state |
| `start_date` | date | Start date |
| `start_time` | datetime | Start time |
| `venue_id` | integer | Venue ID |
| `dollar_amount` | decimal | Dollar amount |
| `upside_percentage` | integer | Upside percentage |
| `dollar_or_percentage_operator` | string | Dollar or percentage operator |
| `agent_name` | string | Agent name |
| `agent_email` | string | Agent email |
| `expires_at` | datetime | Expiration timestamp |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

**Available scopes:**

| Scope | Description |
|---|---|
| `future` | Future offers |
| `expired` | Expired offers |
| `not_expired` | Non-expired offers |
| `expiring_soon` | Expiring soon |

**Examples:**

```bash
opdt offers list --filter "state_eq=accepted" --sort "start_date desc"
opdt offers list --filter "not_expired=1"
```

---

### Tags (`opdt tags list`)

Tags use `--scope` for filtering (not Ransack):

```bash
opdt tags list --scope Artist
opdt tags list --scope Fan
opdt tags list --scope CalendarEvent
```

**Filterable fields** (via `--filter`/`--query`):

| Field | Type | Description |
|---|---|---|
| `name` | string | Tag name |
| `scope` | string | Tag scope (`Artist`, `Fan`, `Offer`, `CalendarEvent`, `Note`, `Deal`) |
| `created_at` | datetime | Record created timestamp |

---

### Tagged Items (`opdt tagged-items list`)

Use `--taggable-id` and `--taggable-type` for filtering:

```bash
opdt tagged-items list --taggable-id 123 --taggable-type CalendarEvent
```

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `tag_id` | integer | Tag ID |
| `taggable_type` | string | Tagged model type |
| `taggable_id` | integer | Tagged model ID |
| `created_at` | datetime | Record created timestamp |

---

### Notes (`opdt notes list`)

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `title` | string | Note title |
| `body` | text | Note body |
| `type` | string | Note type |
| `calendar_event_id` | integer | Associated event ID |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

---

### Calendar Contacts (`opdt calendar-contacts list`)

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `calendar_event_id` | integer | Event ID |
| `contact_id` | integer | Contact ID |
| `send_daily_ticket_updates` | boolean | Whether receives daily ticket updates |
| `ticket_update_frequency` | string | Update frequency |

---

### Food & Beverage (`opdt food-and-beverage list`)

**Convenience flags:**

| Flag | Description |
|---|---|
| `--event-id <id>` | Filter by event ID |

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `menu_display_name` | string | Menu item name |
| `category` | string | Category |
| `amount` | decimal | Amount |
| `tip_amount` | decimal | Tip amount |
| `payment_type` | string | Payment type |
| `payment_status` | string | Payment status |
| `business_date` | date | Business date |
| `calendar_event_id` | integer | Event ID |
| `venue_ownership_id` | integer | Venue ownership ID |
| `voided` | boolean | Whether voided |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

---

### Manual Ticket Counts (`opdt manual-ticket-counts list`)

**Convenience flags:**

| Flag | Description |
|---|---|
| `--event-id <id>` | Filter by event ID |

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `name` | string | Count name |
| `price` | decimal | Price |
| `quantity` | integer | Quantity |
| `available` | integer | Available count |
| `calendar_event_id` | integer | Event ID |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

---

### Show Activities (`opdt show-activities list --event <id>`)

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `name` | string | Activity name |
| `start_time` | datetime | Start time |
| `start_date` | date | Start date |
| `set` | boolean | Whether set |
| `show_in_advance` | boolean | Whether shown in advance |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

---

### Ticket Reservations (`opdt ticket-reservations list --event <id>`)

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `first_name` | string | First name |
| `last_name` | string | Last name |
| `email` | string | Email |
| `state` | string | Reservation state |
| `token` | string | Reservation token |
| `total` | decimal | Total amount |
| `cash` | boolean | Whether cash |
| `complimentary` | boolean | Whether complimentary |
| `expires_at` | datetime | Expiration time |
| `completed_at` | datetime | Completion time |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

---

### Inbound Submissions (`opdt inbound-submissions list`)

**Filterable fields:**

| Field | Type | Description |
|---|---|---|
| `artist_name` | string | Artist name |
| `name` | string | Submitter name |
| `email` | string | Submitter email |
| `phone` | string | Phone number |
| `location` | string | Location |
| `spotify` | string | Spotify URL |
| `instagram` | string | Instagram URL |
| `venue_ownership_id` | integer | Venue ownership ID |
| `created_at` | datetime | Record created timestamp |
| `updated_at` | datetime | Record updated timestamp |

## Configuration

Auth tokens and environment settings are stored in `~/.opdt/config.json`. This file is created automatically when you run `opdt login`.

## Development

```bash
# Run in development (no build required)
npx tsx bin/opdt.ts events list

# Build
npm run build

# Run tests
npm test
```

## API Reference

Full API documentation is available at [app.opendate.io/developers](https://app.opendate.io/developers).
