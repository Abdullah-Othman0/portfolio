"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  JOURNEY_VH,
  PLANETS,
  cameraZ,
  heroState,
  journeyState,
  planetFocus,
} from "@/components/three/journey-data";

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export function GalaxyJourney({ children }: { children?: React.ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      // Planets leave the hero formation as the hero scrolls away.
      heroState.blend = clamp(
        window.scrollY / (window.innerHeight * 0.85),
        0,
        1
      );
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = clamp(-rect.top / total, 0, 1);
      journeyState.progress = p;

      if (introRef.current) {
        const o = clamp(1 - p / 0.06, 0, 1);
        introRef.current.style.opacity = String(o);
        introRef.current.style.visibility = o === 0 ? "hidden" : "visible";
      }
      if (outroRef.current) {
        const o = clamp((p - 0.93) / 0.06, 0, 1);
        outroRef.current.style.opacity = String(o);
        outroRef.current.style.visibility = o === 0 ? "hidden" : "visible";
      }

      const camZ = cameraZ(p);
      let idx = -1;
      let best = 0.08;
      PLANETS.forEach((pl, i) => {
        const f = planetFocus(camZ, pl.position[2]);
        if (f > best) {
          best = f;
          idx = i;
        }
      });
      setActive(idx);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      // Other routes share the canvas; park the camera back at the hero view
      // and keep planets in corridor order there.
      journeyState.progress = 0;
      heroState.blend = 1;
    };
  }, []);

  const jumpTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const total = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + PLANETS[i].pFocus * total,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-label="Selected work"
      className="relative pointer-events-none"
      style={{ height: `${JOURNEY_VH}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Intro: fades out as the flight begins */}
        <div
          ref={introRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-[-0.03em] text-on-surface mb-6 text-shadow-strong">
            Selected Work
          </h2>
          <p className="text-base md:text-lg text-on-surface-variant max-w-md text-shadow-strong">
            Four production systems, four planets. Scroll to fly the route.
          </p>
          <span className="material-symbols-outlined journey-chevron text-3xl text-secondary mt-12">
            keyboard_arrow_down
          </span>
        </div>

        {/* Outro: appears once the last planet is behind the camera */}
        <div
          ref={outroRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          <h3 className="text-3xl md:text-5xl font-bold tracking-[-0.02em] text-on-surface mb-6 text-shadow-strong">
            Route complete.
          </h3>
          <p className="text-base text-on-surface-variant mb-10 max-w-md text-shadow-strong">
            Four stops is the short tour. The full archive has the rest.
          </p>
          <Link
            href="/projects"
            className="pointer-events-auto bg-secondary-container text-on-secondary-container font-bold px-8 py-3.5 rounded-xl glow-button transition-transform active:scale-95"
          >
            Browse the full archive
          </Link>
        </div>

        {/* Flight rail: one stop per planet */}
        <nav
          aria-label="Jump to project"
          className="absolute right-5 md:right-10 top-1/2 -translate-y-1/2 z-10 flex flex-col items-end gap-5 pointer-events-auto"
        >
          {PLANETS.map((pl, i) => (
            <button
              key={pl.title}
              type="button"
              onClick={() => jumpTo(i)}
              className="group flex items-center gap-3 cursor-pointer"
              aria-label={`Fly to ${pl.title}`}
            >
              <span
                className={`hidden md:block font-[var(--font-jetbrains)] text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                  active === i
                    ? "text-white"
                    : "text-white/35 group-hover:text-white/70"
                }`}
              >
                {pl.title}
              </span>
              <span
                className="block w-2 h-2 rounded-full border transition-all duration-300"
                style={
                  active === i
                    ? {
                        background: pl.hue,
                        borderColor: "transparent",
                        boxShadow: `0 0 14px ${pl.hue}`,
                        transform: "scale(1.3)",
                      }
                    : { borderColor: "rgba(255,255,255,0.4)" }
                }
              />
            </button>
          ))}
        </nav>
      </div>
      {children}
    </section>
  );
}
