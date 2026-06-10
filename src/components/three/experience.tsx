"use client";

import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { GalaxyScene } from "./galaxy-scene";

export default function Experience() {
  const portalRef = useRef<HTMLDivElement>(null!);
  const [portalReady, setPortalReady] = useState(false);
  useEffect(() => setPortalReady(true), []);

  return (
    <>
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <Canvas
          camera={{ position: [0, 0.5, 6], fov: 50, near: 0.1, far: 400 }}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, 1.75]}
        >
          <color attach="background" args={["#0b1326"]} />
          <fog attach="fog" args={["#0b1326", 16, 52]} />
          <Suspense fallback={null}>
            {portalReady && (
              <GalaxyScene portal={portalRef as React.RefObject<HTMLElement>} />
            )}
            <EffectComposer multisampling={0}>
              <Bloom
                luminanceThreshold={0.32}
                luminanceSmoothing={0.25}
                mipmapBlur
                intensity={0.85}
                radius={0.7}
              />
              <Vignette eskil={false} offset={0.16} darkness={0.82} />
            </EffectComposer>
            <Preload all />
          </Suspense>
        </Canvas>
      </div>
      {/* Project cards portal: above page content so the glass cards stay
          clickable, while the layer itself never blocks the page. */}
      <div
        ref={portalRef}
        aria-hidden
        className="fixed inset-0 z-20 pointer-events-none overflow-hidden"
      />
    </>
  );
}
