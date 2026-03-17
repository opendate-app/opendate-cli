# opdt — Opendate CLI

Command line tool for the [Opendate API](https://app.opendate.io/developers). Manage events, tickets, orders, fans, finances, and more from your terminal.

## Installation

```bash
npm install
npm run build
```

After building, the CLI is available at `./dist/bin/opdt.js`. For development, use `npx tsx bin/opdt.ts` instead.

## Getting Started

### 1. Log in

```bash
opdt login
```

You'll be prompted for your email and password. Your auth token is stored in `~/.opdt/config.json`.

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
