# Feature Specification: Book a Meeting

**Feature Branch**: `001-book-meeting`
**Created**: 2026-06-29
**Status**: Draft
**Input**: User description: "Implement a 'Book a Meeting' feature in a portfolio site with a modal form, validation, email sending via existing mail service, and full UX feedback."

## Clarifications

### Session 2026-06-29

- Q: What level of accessibility should the booking modal support? → A: Full WCAG AA compliance (keyboard navigation, focus management, ARIA labels, color contrast ratios, screen reader announcements for dynamic content, skip links, error announcements)
- Q: Should there be a minimum advance notice for booking? → A: At least 24 hours advance notice required
- Q: Should completed booking data be stored persistently? → A: Ephemeral - email only, no data storage

## User Scenarios & Testing

### User Story 1 - Visitor books a meeting via the Contact section (Priority: P1)

A visitor to the portfolio lands on the Contact section, sees a "Book a Meeting" button, clicks it to open a booking modal, fills in the required fields, and submits the request. The system validates all inputs, sends a clean HTML booking notification email to the portfolio owner, and shows a success message to the visitor.

**Why this priority**: This is the core flow of the feature. Without successful booking and email delivery, the feature provides no value.

**Independent Test**: Can be fully tested by clicking the "Book a Meeting" button, filling out every field with valid data, submitting, and verifying both the success message on screen and the email receipt. This delivers the complete value of the feature.

**Acceptance Scenarios**:

1. **Given** a visitor is viewing the Contact section, **When** they click the "Book a Meeting" button, **Then** a modal form appears with fields: Full Name, Email, Company (optional), Meeting Subject, Preferred Date, Preferred Time, and Message/Agenda
2. **Given** the modal is open with all valid data entered, **When** the visitor clicks the submit button, **Then** the button becomes disabled, a loading indicator appears, the form data is sent to the server, and upon success a toast/message confirms the booking
3. **Given** a booking is successfully submitted, **When** the server processes the request, **Then** an HTML email containing Name, Email, Company, Subject, Preferred Date, Preferred Time, Message, and submission timestamp is delivered to the portfolio owner's email
4. **Given** the success message is shown, **When** the visitor dismisses it, **Then** the modal closes and the form resets to its initial state

---

### User Story 2 - Visitor encounters validation errors (Priority: P2)

A visitor attempts to submit the booking form with missing, invalid, or past-date inputs. The system rejects the submission on the client side without sending a request to the server, and displays clear error messages for each invalid field.

**Why this priority**: Data quality and user experience. Preventing invalid submissions server-side is critical, but client-side validation gives immediate feedback and reduces server load.

**Independent Test**: Can be tested by attempting to submit an empty form, entering an invalid email, selecting a past date, and verifying that appropriate error messages appear for each field without any server request being made.

**Acceptance Scenarios**:

1. **Given** the booking modal is open, **When** the visitor clicks submit with empty required fields (Full Name, Email, Meeting Subject, Preferred Date, Preferred Time), **Then** inline validation errors appear next to each empty required field and the form is not submitted
2. **Given** the visitor has entered an email in an incorrect format, **When** they click submit, **Then** a validation error indicates the email is invalid
3. **Given** the visitor has selected a date in the past, **When** they click submit, **Then** a validation error indicates the date cannot be in the past
4. **Given** validation errors are shown, **When** the visitor corrects all fields and resubmits, **Then** the form proceeds to submit successfully

---

### User Story 3 - Visitor experiences a server error (Priority: P3)

A visitor submits the booking form, but the server fails to process or send the email. The system shows a clear error message and allows the visitor to retry without re-entering all fields.

**Why this priority**: Error handling is important for a polished experience, but is less critical than the core booking flow and validation.

**Independent Test**: Can be tested by simulating a server failure (e.g., network disruption or email service error) and verifying that an appropriate error message appears, the submit button re-enables, the form data is preserved, and the visitor can attempt resubmission.

**Acceptance Scenarios**:

1. **Given** a visitor has submitted the form, **When** the server fails to send the email, **Then** an error message is displayed indicating the booking could not be completed and the visitor should try again
2. **Given** a server error has occurred, **When** the visitor sees the error message, **Then** the submit button is re-enabled, form data is preserved, and the visitor can attempt to submit again
3. **Given** the form submission process is underway, **When** there is a network interruption, **Then** a timeout or connection error message is shown after a reasonable period

---

### Edge Cases

- What happens when the visitor enters excessively long text in any field? (e.g., 10,000 character name)
- How does the system handle rapid double-clicks on the submit button?
- How does the system behave when the email service is temporarily unavailable?
- What happens if the visitor closes the modal while the form is submitting?
- How does the modal behave when the page is scrolled to the Contact section on mobile?
- What happens when JavaScript is disabled in the visitor's browser?
- What happens when the visitor selects a date/time less than 24 hours in the future?

## Requirements

### Functional Requirements

- **FR-001**: System MUST display a "Book a Meeting" button within the Contact section of the portfolio
- **FR-002**: System MUST open a modal dialog when the "Book a Meeting" button is clicked
- **FR-003**: Modal MUST contain input fields for: Full Name, Email, Company (optional), Meeting Subject, Preferred Date, Preferred Time, and Message/Agenda
- **FR-004**: System MUST validate that all required fields (Full Name, Email, Meeting Subject, Preferred Date, Preferred Time) are not empty before submission
- **FR-005**: System MUST validate that the Email field contains a valid email format
- **FR-006**: System MUST validate that the Preferred Date and Preferred Time are at least 24 hours in the future from the time of submission
- **FR-007**: System MUST display inline error messages for each validation failure near the corresponding field
- **FR-008**: System MUST disable the submit button and show a loading state while the booking request is being processed
- **FR-009**: System MUST send all booking data (Name, Email, Company, Subject, Preferred Date, Preferred Time, Message, submission timestamp) in a clean HTML email to the portfolio owner's email address upon successful submission
- **FR-010**: System MUST perform all email sending on the server side
- **FR-011**: System MUST sanitize all inputs on the server side before processing
- **FR-012**: System MUST validate all inputs on the server side (redundant validation)
- **FR-013**: System MUST implement a spam prevention mechanism (e.g., honeypot field, rate limiting per IP, or both)
- **FR-014**: System MUST show a success message to the visitor after successful booking submission
- **FR-015**: System MUST show a descriptive error message if the booking submission fails
- **FR-016**: System MUST automatically dismiss the modal or reset the form after successful submission
- **FR-017**: System MUST preserve form data and allow retry if submission fails
- **FR-018**: System MUST be fully responsive and usable on mobile devices without zooming or horizontal scrolling
- **FR-019**: System MUST use the project's existing email service/abstraction for sending emails; if none exists, use the framework's recommended mail implementation
- **FR-020**: System MUST NOT modify, alter, or interfere with the existing Contact form or any other existing page functionality
- **FR-021**: System MUST support full keyboard navigation of the modal (Tab, Shift+Tab, Escape to close, Enter to submit)
- **FR-022**: System MUST manage focus: trap focus within the modal when open, return focus to the trigger button when closed
- **FR-023**: System MUST include ARIA labels and roles (role="dialog", aria-modal, aria-labelledby, aria-describedby) on the modal
- **FR-024**: System MUST announce dynamic content changes (loading state, success/error messages) to screen readers via live regions
- **FR-025**: System MUST meet WCAG AA color contrast ratios (minimum 4.5:1 for normal text, 3:1 for large text) for all modal elements
- **FR-026**: System MUST NOT store visitor personal data (name, email, company, message) persistently beyond the email sending process; the email is the sole record

### Key Entities

- **MeetingBooking**: Represents a meeting booking request submitted by a visitor. Key attributes: visitor's full name, email address, company (optional), meeting subject, preferred date, preferred time, message/agenda text, and submission timestamp.
- **BookingEmailNotification**: Represents the HTML email sent to the portfolio owner containing all MeetingBooking details and a readable formatted layout.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Visitors can complete a meeting booking (from clicking the button to seeing a success message) in under 30 seconds with valid data
- **SC-002**: All invalid inputs (empty fields, bad email, past date) are clearly indicated with error messages within 1 second of submission attempt
- **SC-003**: Booking notification emails are delivered within 5 minutes of submission under normal conditions
- **SC-004**: The booking modal renders properly and is fully functional on mobile screens (320px width and above), desktop, and tablet viewports
- **SC-005**: The feature does not break, alter, or degrade the performance of any existing page functionality or styling
- **SC-006**: Spam prevention mechanism blocks or flags automated submissions without impacting legitimate user submissions
- **SC-007**: The booking modal is fully operable via keyboard alone, and all status changes are announced to screen readers

## Assumptions

- The portfolio owner will check their email inbox for new booking notifications and follow up with the visitor manually
- No automated confirmation email is sent to the visitor (the portfolio owner follows up directly)
- The Preferred Date and Preferred Time fields represent a single meeting slot preference, not a date range
- Timezone handling is not required; the submitted date/time is accepted as provided by the visitor
- The existing Contact section and any existing form within it remain completely untouched
- The project already has an email service or mailing abstraction in place; if not, a standard framework mailer will be set up without SMTP configuration if SMTP is already configured
- The "Book a Meeting" button appears alongside but distinctly from the existing Contact form
- Standard form input length limits apply (e.g., name up to 100 chars, email up to 254 chars, subject up to 200 chars, message up to 2000 chars)
- Rate limiting (if used) defaults to reasonable values such as max 5 submissions per IP per hour
- Booking data is ephemeral; the email sent to the portfolio owner is the only record of the booking
