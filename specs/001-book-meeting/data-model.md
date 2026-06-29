# Data Model: Book a Meeting

## Entity: MeetingBooking

Represents a meeting booking request submitted by a visitor. Transient — sent via email, not stored persistently.

### Fields

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `name` | string | Yes | Non-empty, max 100 chars | Visitor's full name |
| `email` | string | Yes | Valid email format (RFC 5322), max 254 chars | Visitor's email address |
| `company` | string | No | Max 200 chars | Optional company name |
| `subject` | string | Yes | Non-empty, max 200 chars | Meeting topic |
| `preferredDate` | string (date) | Yes | Must be a valid date >= 24 hours from submission | Format: YYYY-MM-DD |
| `preferredTime` | string (time) | Yes | Must be a valid time string | Format: HH:MM (24-hour) |
| `message` | string | No | Max 2000 chars | Meeting agenda or notes |
| `submittedAt` | string (ISO datetime) | Auto | Set server-side at submission | ISO 8601 format |

### Derived / Computed Fields

| Field | Source | Description |
|-------|--------|-------------|
| `combinedDateTime` | `preferredDate` + `preferredTime` | Used for the 24-hour advance validation check |

### State Machine

The booking request has no persistence, so states are request-level only:

```
idle → submitting → success (email sent)
                    → error (validation or delivery failure)
```

States map to UI states per spec FR-008, FR-014, FR-015.

## Validation Rules

### Client-Side (immediate feedback)

| Rule | Fields | Error Message |
|------|--------|---------------|
| Required | `name`, `email`, `subject`, `preferredDate`, `preferredTime` | "[Field] is required" |
| Email format | `email` | "Please enter a valid email address" |
| Date ≥ 24h | `preferredDate` + `preferredTime` | "Meeting must be booked at least 24 hours in advance" |

### Server-Side (redundant — enforces integrity)

| Rule | Fields | Action |
|------|--------|--------|
| Required | `name`, `email`, `subject`, `preferredDate`, `preferredTime` | Return 400 with field-level errors |
| Email format | `email` | Return 400 with error |
| Date ≥ 24h | `preferredDate` + `preferredTime` | Return 400 with error |
| Max length | All fields per limits above | Truncate or reject (prefer reject) |
| Honeypot check | Hidden field `_honey` | If filled, silently accept (200) but do not send email |

## Spam Prevention

- **Honeypot**: Hidden field `_honey` that humans don't see but bots fill. If present on server → accept silently but discard (no email sent).
- **Rate limiting**: Track by IP address. Max 5 submissions per IP per hour. Exceeded → 429 response.
