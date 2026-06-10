// Single source of truth for the scroll-driven galaxy journey.
// Consumed by the 3D scene (camera rig, planets), the DOM journey section,
// and the server-rendered sr-only project list.

export type PlanetKind = "gas" | "ringed" | "moon" | "ember";

export interface ProjectPlanet {
  title: string;
  blurb: string;
  tags: string[];
  repo: string;
  /** CSS accent color used for card glow, tags, and rail dots */
  hue: string;
  kind: PlanetKind;
  radius: number;
  position: [number, number, number];
  /** Where the planet sits in the hero formation: clustered right of the
      viewport, close to the camera, before flying out to `position`. */
  heroPosition: [number, number, number];
  /** Scroll progress (0..1) at which the camera dwells on this planet */
  pFocus: number;
  palette: {
    a: string;
    b: string;
    deep: string;
    rim: string;
    atmo: string;
  };
}

export const CAM = { startZ: 6, endZ: -74, lead: 5.2 };

/** Height of the scroll spacer section, in vh. */
export const JOURNEY_VH = 560;

export function cameraZ(p: number): number {
  return CAM.startZ + (CAM.endZ - CAM.startZ) * p;
}

/**
 * How "focused" a planet is for a given camera depth. Peaks when the camera
 * hovers CAM.lead units in front of the planet; fades in slowly on approach
 * and cuts off quickly once the camera passes, so cards never linger while
 * the planet is behind the lens.
 */
export function planetFocus(camZ: number, planetZ: number): number {
  const d = camZ - (planetZ + CAM.lead);
  const t = d >= 0 ? 1 - d / 9 : 1 + d / 3.4;
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

export function planetWorldPos(
  p: ProjectPlanet,
  narrow: boolean
): [number, number, number] {
  const [x, y, z] = p.position;
  // On narrow screens planets sit near center, pushed up so the card fits below.
  return narrow ? [x * 0.32, y + 1.05, z] : [x, y, z];
}

export function planetHeroPos(
  p: ProjectPlanet,
  narrow: boolean
): [number, number, number] {
  const [x, y, z] = p.heroPosition;
  // Narrow viewports: tuck the cluster in and push it back so it still fits.
  return narrow ? [x * 0.45, y * 0.85, z - 2] : [x, y, z];
}

export const PLANETS: ProjectPlanet[] = [
  {
    title: "Nebula Chat",
    blurb:
      "An AI chat platform where people and custom AI personas share the same conversation, with replies streaming back token by token.",
    tags: ["NESTJS", "SOCKETIO", "OPENAI"],
    repo: "https://github.com/Abdullah-Othman0/chatter",
    hue: "#4cd7f6",
    kind: "gas",
    radius: 1.45,
    position: [2.7, 0.25, -16.8],
    heroPosition: [3.4, 0.3, -1.5],
    pFocus: 0.22,
    palette: {
      a: "#123a6b",
      b: "#3fc6ea",
      deep: "#0a1f43",
      rim: "#7fe7ff",
      atmo: "#3ec7f0",
    },
  },
  {
    title: "Vanguard Commerce",
    blurb:
      "A complete storefront: browse, check out with Stripe, and manage orders and inventory from an admin back office.",
    tags: ["NEXTJS", "STRIPE", "NESTJS"],
    repo: "https://github.com/Abdullah-Othman0/nn-ecommerce",
    hue: "#8fb0ff",
    kind: "ringed",
    radius: 1.2,
    position: [-2.7, -0.35, -32.8],
    heroPosition: [6.8, 2.3, -7.5],
    pFocus: 0.42,
    palette: {
      a: "#26337f",
      b: "#8fa8ff",
      deep: "#131c4a",
      rim: "#aebfff",
      atmo: "#6f8cff",
    },
  },
  {
    title: "Atlas LMS",
    blurb:
      "A learning platform where schools sell video courses, run quizzes, and track student progress and revenue from one dashboard.",
    tags: ["DJANGO", "VUE3", "DOCKER"],
    repo: "https://github.com/Abdullah-Othman0/anmo_backend",
    hue: "#c2a0ff",
    kind: "moon",
    radius: 1.3,
    position: [2.7, 0.45, -48.8],
    heroPosition: [3.0, -1.9, -5.0],
    pFocus: 0.62,
    palette: {
      a: "#3a2a6e",
      b: "#9a6cf0",
      deep: "#1c1240",
      rim: "#c9a4ff",
      atmo: "#8e64e8",
    },
  },
  {
    title: "Arbiter Live",
    blurb:
      "A live scoring and voting system for card games that keeps working offline and syncs results across devices via QR scan.",
    tags: ["FLUTTER", "BLOC", "SQLITE"],
    repo: "https://github.com/Abdullah-Othman0/gm_dashboard",
    hue: "#ffb46b",
    kind: "ember",
    radius: 1.1,
    position: [-2.7, -0.15, -64.8],
    heroPosition: [4.6, -1.1, -7.0],
    pFocus: 0.82,
    palette: {
      a: "#241114",
      b: "#6e2f1d",
      deep: "#160a0e",
      rim: "#ff9a5a",
      atmo: "#ff7a3c",
    },
  },
];

/** Lateral camera keyframes: the camera weaves to the opposite side of each planet. */
export const CAM_KEYS: { p: number; x: number; y: number }[] = [
  { p: 0, x: 0, y: 0.55 },
  { p: 0.1, x: 0.25, y: 0.35 },
  { p: 0.22, x: -0.85, y: 0.25 },
  { p: 0.32, x: -0.3, y: 0 },
  { p: 0.42, x: 0.9, y: -0.1 },
  { p: 0.52, x: 0.3, y: 0.2 },
  { p: 0.62, x: -0.85, y: 0.4 },
  { p: 0.72, x: -0.2, y: 0.15 },
  { p: 0.82, x: 0.85, y: 0.05 },
  { p: 1, x: 0, y: 0.7 },
];

/** Smoothstep interpolation between keyframes; lateral drift eases to a rest at each dwell. */
export function sampleCamKeys(p: number): [number, number] {
  const keys = CAM_KEYS;
  if (p <= keys[0].p) return [keys[0].x, keys[0].y];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (p <= b.p) {
      let t = (p - a.p) / (b.p - a.p);
      t = t * t * (3 - 2 * t);
      return [a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t];
    }
  }
  const last = keys[keys.length - 1];
  return [last.x, last.y];
}

/**
 * Scroll progress through the journey section, written by the DOM scroll
 * handler and read by the 3D camera rig every frame. A plain mutable object
 * keeps the per-scroll cost at zero re-renders.
 */
export const journeyState = { progress: 0 };

/**
 * 0 = hero formation (planets clustered left of the viewport, zoomed in),
 * 1 = journey order (planets at their corridor stations). Driven by how far
 * the homepage hero has been scrolled away; defaults to 1 so every other
 * route keeps the corridor backdrop.
 */
export const heroState = { blend: 1 };
