# Tasks: Book a Meeting

**Input**: Design documents from `/specs/001-book-meeting/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are OPTIONAL — not requested in this spec. Manual QA per verification steps in quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project at repository root
- Source: `src/` (Next.js App Router)
- API routes: `src/app/api/`
- Components: `src/components/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Directory scaffolding for the new feature

- [ ] T001 Create `src/app/api/booking/` directory for the server-side booking endpoint
- [ ] T002 [P] Create `src/components/booking/` directory for the booking modal and form components

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Purpose**: Server-side API endpoint that all user stories depend on — validates, sanitizes, forwards to FormSubmit.co

- [ ] T003 Create shared server-client validation types and field definitions in `src/components/booking/validation.ts` (field names, required list, max lengths, email regex, date comparison helpers)
- [ ] T004 [P] Implement `POST /api/booking` route in `src/app/api/booking/route.ts` — parse JSON, run server-side validation, check honeypot (silent discard if filled), check IP rate limit (max 5/hr), forward sanitized data to FormSubmit.co with `_template: "table"`, return success/validation-error/rate-limit/server-error responses per contracts/booking-api.md
- [ ] T005 [P] Implement rate limiting middleware — track submission count by IP using in-memory Map with hourly TTL, return 429 when exceeded in `src/app/api/booking/route.ts`

**Checkpoint**: Foundation ready — API route can receive and forward booking requests. User story implementation can now begin.

---

## Phase 3: User Story 1 — Visitor books a meeting via the Contact section (Priority: P1) 🎯 MVP

**Goal**: Visitor sees "Book a Meeting" button on the Contact page, clicks it to open a modal, fills in fields, submits, sees success message, and portfolio owner receives an HTML booking email.

**Independent Test**: Click "Book a Meeting" button → modal opens → fill all fields with valid data → submit → success message appears → check email inbox for booking notification.

### Implementation for User Story 1

- [x] T006 [US1] Create `src/components/booking/booking-modal.tsx` — native `<dialog>` element with `showModal()`, backdrop styling matching glass-surface design tokens, aria-labelledby, aria-describedby, role="dialog", aria-modal="true", focus trap on open, return focus on close, Escape to close, close button
- [x] T007 [P] [US1] Create `src/components/booking/meeting-form.tsx` — "use client" component with useState for form fields (name, email, company, subject, preferredDate, preferredTime, message), honeypot hidden field `_honey`, submit handler that POSTs to `/api/booking`, idle/sending/sent/error state machine, submit button disabled while sending with loading spinner
- [x] T008 [US1] Add success UI to `src/components/booking/meeting-form.tsx` — green success toast/message with check icon, auto-reset form after 2 seconds, dismiss to close modal
- [x] T009 [US1] Modify `src/app/contact/page.tsx` — import BookingModal, add "Book a Meeting" button positioned beneath the existing contact form within the card, button styling matching the existing glass-card / primary button pattern, open modal on click
- [x] T010 [US1] Add email template generation in `src/app/api/booking/route.ts` — format booking data (Name, Email, Company, Subject, Preferred Date, Preferred Time, Message, submission timestamp) into a clean HTML email body and include as `_message` field in the FormSubmit.co POST

**Checkpoint**: MVP complete — visitor can book a meeting end-to-end. Email delivered to portfolio owner.

---

## Phase 4: User Story 2 — Visitor encounters validation errors (Priority: P2)

**Goal**: Visitor submits form with invalid data and sees clear inline error messages for each field without any server request.

**Independent Test**: Submit empty form → see "Full Name is required" style errors for each empty required field. Enter bad email → see "Please enter a valid email address". Select a date <24h from now → see "Meeting must be booked at least 24 hours in advance". Correct all errors → submit succeeds.

### Implementation for User Story 2

- [x] T011 [US2] Add client-side validation logic to `src/components/booking/validation.ts` — validateField function that checks each field: required (non-empty), email format (RFC 5322 regex), date+time >= 24 hours from submission, max length per data-model.md
- [x] T012 [US2] Wire validation into `src/components/booking/meeting-form.tsx` — validate all fields on submit attempt, show per-field inline error messages below each input styled with error color, prevent POST if validation fails, clear errors when user corrects the field
- [x] T013 [US2] Ensure server-side validation in `src/app/api/booking/route.ts` returns 400 with field-level `errors` object matching the contract, test by submitting directly to the API with invalid data

**Checkpoint**: Validation works both client-side (immediate feedback) and server-side (redundant enforcement).

---

## Phase 5: User Story 3 — Visitor experiences a server error (Priority: P3)

**Goal**: Server fails or network drops — visitor sees clear error message, data is preserved, and retry works.

**Independent Test**: Simulate FormSubmit.co failure (e.g., by disconnecting network or modifying endpoint to invalid URL) → submit → see error message → button re-enables → form data preserved → click submit again to retry.

### Implementation for User Story 3

- [x] T014 [US3] Add error UI to `src/components/booking/meeting-form.tsx` — red error toast/message with error icon, auto-dismiss after 4 seconds, re-enable submit button, preserve form data for retry
- [x] T015 [US3] Add timeout handling in `src/components/booking/meeting-form.tsx` — set a 15-second AbortController timeout on the fetch call, show connection error if request hangs
- [x] T016 [US3] Add error logging in `src/app/api/booking/route.ts` — log failed FormSubmit.co responses to console.error for debugging

**Checkpoint**: Error handling covers server failure, network timeout, and retry. Form data survives errors.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, responsiveness, edge cases, and final validation

- [x] T017 [P] Add WCAG AA accessibility to `src/components/booking/booking-modal.tsx` and `src/components/booking/meeting-form.tsx` — keyboard navigation (Tab, Shift+Tab, Escape, Enter), focus management (trap in modal, return on close), ARIA live region `aria-live="polite"` for status announcements (sending, success, error), color contrast verification for all text vs background
- [x] T018 [P] Verify mobile responsiveness of booking modal in `src/components/booking/booking-modal.tsx` — test at 320px width, ensure inputs stack vertically, modal fits viewport with scrolling, close button accessible
- [x] T019 Handle edge cases in `src/components/booking/meeting-form.tsx` — double-click prevention (button disabled during submit), modal close while submitting (abort fetch, reset state), max length enforcement on all inputs per data-model.md
- [x] T020 Run `npm run dev` — verify zero build errors, lint passes with `npm run lint`
- [x] T021 Walk through quickstart.md verification steps — button appears, modal opens, valid submit succeeds, invalid submit shows errors, server failure shows error, keyboard-only operation works

**Checkpoint**: Feature is production-ready — accessible, responsive, handles edge cases.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Foundational completion; can be done in parallel with or after US1
- **User Story 3 (Phase 5)**: Depends on Foundational completion; can be done in parallel with or after US1
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

| Story | Dependencies | Independent? |
|-------|--------------|--------------|
| US1 (P1) | Phase 1 → Phase 2 | ✅ Can test end-to-end booking flow alone |
| US2 (P2) | Phase 1 → Phase 2 | ✅ Can test validation independently via direct API calls and form interactions |
| US3 (P3) | Phase 1 → Phase 2 | ✅ Can test error states independently via network simulation |

### Within Each User Story

- Validation utility before components
- Modal container before form content
- Core flow before error/edge-case layers
- Story complete before moving to next priority

### Parallel Opportunities

- T001 and T002 can run in parallel (different directories)
- T004 and T005 can run in parallel (different files — route handler and rate limiter)
- T006 and T007 can run in parallel (modal shell and form shell are separate files)
- T017 and T018 can run in parallel (accessibility and responsive are independent passes)
- US2 (Phase 4) and US3 (Phase 5) can be done in parallel after US1

---

## Parallel Example: User Story 1

```bash
# Launch modal and form components together:
Task: "Create src/components/booking/booking-modal.tsx"
Task: "Create src/components/booking/meeting-form.tsx"

# Both are separate files with no dependencies on each other.
# After both complete, modify contact page to wire them together.
```

---

## Parallel Example: User Stories 2 & 3

```bash
# Run concurrently after US1 completes:
# Stream A — Validation (US2):
Task: "Add client-side validation to src/components/booking/validation.ts and meeting-form.tsx"

# Stream B — Error handling (US3):
Task: "Add error UI, timeout, and retry to src/components/booking/meeting-form.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup → directories created
2. Complete Phase 2: Foundational → API route ready
3. Complete Phase 3: User Story 1 → modal, form, button, success flow, email sent
4. **STOP and VALIDATE**: Book a meeting end-to-end
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add Polish fixes → Finalize

### Validation Checklist

After each phase, verify:
- `npm run dev` still works with no errors
- No existing functionality broken (homepage, projects, about, contact form all intact)
- New feature tasks from the completed phase function correctly
