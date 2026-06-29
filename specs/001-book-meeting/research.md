# Research: Book a Meeting

## Technology Decisions

### Email Sending Strategy
- **Decision**: Proxy through existing FormSubmit.co service via server-side API route
- **Rationale**: The project already uses FormSubmit.co for the contact form. Creating a server-side API route that validates booking data and forwards it to FormSubmit.co achieves server-side email sending (FR-010) with zero additional dependencies. No SMTP setup, no new mail library, no third-party account.
- **Alternatives considered**: Nodemailer (adds SMTP config + 1 dependency), Resend SDK (adds API key + 1 dependency), raw Node.js `net.SMTP` (overengineered). All rejected in favor of reusing the existing service.

### Modal Implementation
- **Decision**: Native `<dialog>` element with custom backdrop
- **Rationale**: The HTML `<dialog>` element provides built-in focus trapping, Escape-to-close, and ARIA roles out of the box — directly supporting WCAG AA requirements (FR-021–FR-024). No modal library needed. Polyfill not required for modern browser targets.
- **Alternatives considered**: Custom div-based overlay (more code to get accessibility right), headless UI library (adds dependency). Native `<dialog>` is the most minimal, accessible, and dependency-free option.

### Form State Management
- **Decision**: React `useState` for form fields + `useReducer` for submission state machine
- **Rationale**: Matches the existing contact form pattern (useState-based). No form library (react-hook-form, Formik) needed for 7 fields.
- **Alternatives considered**: react-hook-form (adds dependency), Formik (adds dependency). Both unnecessary for this form's complexity.

### Styling Approach
- **Decision**: Tailwind CSS utility classes, matching existing project patterns
- **Rationale**: The project already uses Tailwind CSS v4. No additional styling dependencies needed.

### WCAG AA Implementation
- **Decision**: Native `<dialog>` provides dialog role, aria-modal, focus trap. Supplement with manual ARIA live regions for status announcements and manual focus management for open/close.
- **Rationale**: `<dialog>` handles ~60% of accessibility requirements natively. The remaining ~40% (announcements, return focus) requires ~20 lines of imperative code — no accessibility library needed.

### Server-side Validation
- **Decision**: Manual validation function shared between client and server
- **Rationale**: Simple field-level checks (required, email format, date >= 24h from now). No validation library (zod, yup) needed for this scope. A plain TypeScript function with typed returns suffices.

## Architectural Decision Records

### ADR-001: Server-side FormSubmit.co Proxy
- **Status**: Accepted
- **Context**: Feature requires server-side email sending (FR-010) without adding dependencies. Project already uses FormSubmit.co for contact form emails.
- **Decision**: Create `src/app/api/booking/route.ts` that receives booking data, validates it, and POSTs to FormSubmit.co. Client never talks to FormSubmit.co directly — it posts to `/api/booking`.
- **Consequences**: Zero new dependencies. Single source of truth for email delivery. API route acts as a validation + forwarding layer. FormSubmit.co downtime affects both contact form and booking (same service).

### ADR-002: Native `<dialog>` for Modal
- **Status**: Accepted
- **Context**: Modal required with WCAG AA accessibility. No existing modal component in project. Constraint: minimum dependencies.
- **Decision**: Use HTML `<dialog>` element with `showModal()` for the booking modal.
- **Consequences**: Accessible-by-default modal. Requires polyfill for very old browsers (out of scope). Limited to modern CSS styling of `<dialog>` backdrop — acceptable for this project.
