# Implementation Plan: Book a Meeting

**Branch**: `001-book-meeting` | **Date**: 2026-06-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-book-meeting/spec.md`

## Summary

Add a "Book a Meeting" button to the Contact page that opens a modal form (Name, Email, Company, Subject, Preferred Date, Preferred Time, Message). On submit, validate client and server side, then send a clean HTML booking email to the portfolio owner via the existing FormSubmit.co service proxied through a new server-side API route — zero additional dependencies, isolated implementation, full WCAG AA accessibility.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 16.2.6, React 19.2.4  
**Primary Dependencies**: None beyond the existing project deps (FormSubmit.co server-side POST via Node.js `fetch`, available natively in Next.js 16 runtime)  
**Storage**: None (ephemeral — email is the sole record)  
**Testing**: No existing test framework detected; manual QA for this feature  
**Target Platform**: Web — modern browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Web application — Next.js App Router  
**Performance Goals**: Form submission perceived response <200ms (optimistic UI with server confirmation)  
**Constraints**: Minimum dependencies and 3rd party packages; no modifications to existing components or pages beyond adding the trigger button; server-side email sending only; ephemeral data; full WCAG AA accessibility  
**Scale/Scope**: Personal portfolio — low traffic, single owner

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Gate Results**:

| Gate | Status | Notes |
|------|--------|-------|
| Constitution exists | ⚠️ Partial | Constitution file is a template with placeholder values — no real principles defined |
| Feature justified | ✅ Pass | Meeting booking is a natural portfolio extension; enables direct client outreach |
| Complexity justified | ✅ Pass | Single modal + one API route + one email proxy — minimal complexity |
| Existing code preserved | ✅ Pass | Only addition: button in contact page + new isolated files |

**Verdict**: PASS (gates clear). The placeholder constitution imposes no actionable constraints.

**Post-Design Re-check**: ✅ No new violations introduced. All design decisions (native `<dialog>`, FormSubmit.co proxy, ephemeral data) align with the simplicity and isolation constraints of the spec.

## Project Structure

### Documentation (this feature)

```text
specs/001-book-meeting/
├── plan.md              # This file
├── research.md          # Phase 0 output (tech decisions)
├── data-model.md        # Phase 1 output (entities, validation rules)
├── quickstart.md        # Phase 1 output (developer setup notes)
├── contracts/           # Phase 1 output (API contract for booking endpoint)
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── spec.md              # Feature specification
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── contact/
│   │   └── page.tsx         # [MODIFIED] Add "Book a Meeting" button
│   └── api/
│       └── booking/
│           └── route.ts      # [NEW] Server-side booking endpoint
└── components/
    └── booking/
        ├── booking-modal.tsx  # [NEW] Modal dialog component
        └── meeting-form.tsx   # [NEW] Form with validation
```

**Structure Decision**: Feature-colocated under `src/components/booking/` for isolation, matching the existing single-component-per-file pattern. API route follows Next.js App Router convention at `src/app/api/booking/route.ts`.

## Complexity Tracking

> No constitution violations detected — this feature is simple and well-scoped.

## Execution Status

| Phase | Status | Artifacts |
|-------|--------|-----------|
| Phase 0: Research | ✅ Complete | `research.md` — tech decisions, ADRs, FormSubmit.co proxy strategy |
| Phase 1: Design & Contracts | ✅ Complete | `data-model.md` — entities, validation rules, state machine; `contracts/booking-api.md` — API contract; `quickstart.md` — developer setup |
| Phase 2: Tasks | ⏳ Pending | Run `/speckit.tasks` to generate task breakdown |
