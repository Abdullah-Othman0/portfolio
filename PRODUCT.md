# Product

## Register

brand

## Users

Two audiences, weighted equally:

- **Freelance clients**: founders, startups, and small teams evaluating Abdullah Othman for contract/freelance engineering work. They're scanning for proof of capability and an easy path to start a conversation.
- **Recruiters / employers**: people assessing for full-time roles. They're scanning for credibility, depth of experience, and technical range across the stack.

Both groups are busy and pattern-matching against a sea of similar portfolios; the site needs to earn attention quickly and back it up with substance.

## Product Purpose

A personal portfolio for Abdullah Othman, a full-stack engineer (backend, frontend, mobile, infrastructure). The site exists to:

- Demonstrate engineering range and production experience (8+ shipped systems across healthcare, AI, commerce, education).
- Build trust quickly through clear, specific writing (no vague buzzwords).
- Convert visitors into either a freelance inquiry or a recruiter follow-up via low-friction CTAs (`/contact`, `/projects`).

Success = a visitor leaves understanding what Abdullah builds, the tech he's strong in, and how to reach him, without friction on any device.

## Brand Personality

**Precise, calm, technical.** Confidence comes from clarity and restraint, not noise. The site can be visually ambitious (the galaxy/scroll journey on the homepage is a deliberate showcase of technical and creative capability), but copy, layout, and interaction should stay understated and engineering-minded: short sentences, concrete numbers, no marketing fluff.

The galaxy/space visual identity is the one place the brand allows itself some spectacle, treat it as "show, don't tell" evidence of skill (Three.js, GSAP, scroll choreography), not decoration for its own sake.

## Anti-references

- Generic "tech portfolio" template look: hero-metric cards, identical project-card grids, gradient-text headlines used purely for decoration.
- Overstated marketing language ("revolutionary", "cutting-edge", "passionate") that isn't backed by the concrete project/role descriptions already on the site.
- Anything that makes the site feel like a SaaS landing page rather than an individual engineer's body of work.

## Design Principles

1. **Reliability over flash.** Even within the bold space theme, layout, type, and copy should read as precise and considered, matching the "I prefer simple architecture over unnecessary abstraction" voice already on the About page.
2. **Serve both audiences on every page.** Recruiters should be able to scan for credibility (roles, stack, shipped systems) while freelance clients should always have a clear, nearby path to `/contact`.
3. **Show, don't tell.** Use the galaxy journey, project visuals, and interaction craft as the demonstration of technical ability, not just supporting decoration.
4. **Lead with specifics.** Concrete numbers (years, systems shipped, stack items, role outcomes) carry more weight than adjectives, prefer the existing data-driven sections (stats, journey quotes, tech groups) over abstract claims.
5. **Mobile is first-class.** The site is regularly used on phones; spacing, type scale, and touch targets must hold up at small sizes, not just degrade gracefully.

## Accessibility & Inclusion

- Target WCAG AA contrast across text/background combinations, especially on the dark glass surfaces.
- Respect `prefers-reduced-motion` for all animation (galaxy scroll journey, chevrons, hover transforms).
- Keep navigation keyboard-operable, including the mobile menu.
- Hover-only affordances (glow/lift effects) should not be the sole signal of interactivity, gate them behind `(hover: hover)` as already done, and ensure focus states exist for keyboard users.
