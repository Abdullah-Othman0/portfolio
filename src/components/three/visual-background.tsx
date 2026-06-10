"use client";

import dynamic from "next/dynamic";

const Experience = dynamic(() => import("./experience"), {
  ssr: false,
});

export function VisualBackground() {
  return <Experience />;
}
