# Quickstart: Book a Meeting

## Files to Create

| File | Purpose |
|------|---------|
| `src/app/api/booking/route.ts` | Server-side API endpoint — validates booking, proxies to FormSubmit.co |
| `src/components/booking/booking-modal.tsx` | Modal dialog wrapping the form |
| `src/components/booking/meeting-form.tsx` | Form with validation, submission, and UX states |

## Files to Modify

| File | Change |
|------|--------|
| `src/app/contact/page.tsx` | Add "Book a Meeting" button (single `<button>` element + import + open handler) |

## No Dependencies to Install

This feature uses zero additional npm packages:
- **`<dialog>` element** — native HTML5 API, no library
- **`fetch`** — native Node.js/global API, no library
- **FormSubmit.co** — existing service already used by the project
- **Tailwind CSS** — already installed and configured
- **TypeScript types** — already in project

## Reuse Points

- **Email destination**: Reuse `abdullahoth210@gmail.com` (the same address already configured in the contact form)
- **FormSubmit.co pattern**: Mirror the `_template: "table"` and `_subject` meta-parameter approach from the existing contact form
- **Styling**: Use the same Tailwind utility classes and design tokens as the contact page

## Key Integration Points

1. The API route must live at `src/app/api/booking/route.ts` (Next.js App Router convention)
2. The "Book a Meeting" button should be a single `<button>` element added near the existing contact form on the contact page — no layout changes, no new sections
3. The modal's submit action POSTs to `/api/booking` (not directly to FormSubmit.co)
4. The honeypot field name must match between client and server

## Verification

1. `npm run dev` — no build errors
2. Visit `/contact` — button appears
3. Click button — modal opens with proper focus trap
4. Submit valid data — success message + email received
5. Submit invalid data — error messages per field
6. Submit with past date / <24h date — validation error
7. Test with keyboard (Tab, Enter, Escape) — fully operable
8. Test on mobile (320px+) — responsive layout
