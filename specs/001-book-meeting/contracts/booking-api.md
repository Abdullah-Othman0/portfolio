# API Contract: Booking Endpoint

## `POST /api/booking`

Server-side endpoint that validates booking requests and forwards them to FormSubmit.co for email delivery.

### Request

**Content-Type**: `application/json`

```json
{
  "name": "string (required, max 100)",
  "email": "string (required, valid email, max 254)",
  "company": "string (optional, max 200)",
  "subject": "string (required, max 200)",
  "preferredDate": "string (required, date YYYY-MM-DD, >= 24h from now)",
  "preferredTime": "string (required, time HH:MM)",
  "message": "string (optional, max 2000)",
  "_honey": "string (hidden honeypot — if populated, silently discard)"
}
```

### Successful Response

**Status**: `200 OK`

```json
{
  "status": "success",
  "message": "Your meeting request has been sent. The portfolio owner will follow up."
}
```

### Validation Error Response

**Status**: `400 Bad Request`

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "email": "Please enter a valid email address",
    "preferredDate": "Meeting must be booked at least 24 hours in advance"
  }
}
```

### Rate Limit Response

**Status**: `429 Too Many Requests`

```json
{
  "status": "error",
  "message": "Too many requests. Please try again later."
}
```

### Server Error Response

**Status**: `500 Internal Server Error`

```json
{
  "status": "error",
  "message": "Failed to send booking request. Please try again."
}
```

### Honeypot Detection

**Status**: `200 OK` (identical to success — do not reveal detection)

```json
{
  "status": "success",
  "message": "Your meeting request has been sent. The portfolio owner will follow up."
}
```

The email is silently NOT sent when honeypot is triggered.

### Internal Flow

1. Parse and validate JSON body
2. Check honeypot field — if filled, return fake success without sending
3. Check rate limit by IP
4. Forward sanitized data to `https://formsubmit.co/ajax/{owner-email}` with `_template: "table"` and `_subject: "New Meeting Booking: {subject}"` meta-fields
5. Return appropriate response based on FormSubmit.co result
