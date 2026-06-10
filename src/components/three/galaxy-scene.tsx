"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import {
  PLANETS,
  type ProjectPlanet,
  cameraZ,
  journeyState,
  planetFocus,
  planetWorldPos,
  sampleCamKeys,
} from "./journey-data";
import { makeGlowTexture } from "./textures";
import { ProjectPlanetMesh } from "./planet";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

const _look = new THREE.Vector3();
const _planet = new THREE.Vector3();

function CameraRig({ narrow, reduced }: { narrow: boolean; reduced: boolean }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const smooth = useRef({ p: 0, look: new THREE.Vector3(0, 0.3, -6) });
  const ptr = useRef({ x: 0, y: 0 });

  useEffect(() => {
    camera.fov = narrow ? 58 : 50;
    camera.updateProjectionMatrix();
  }, [camera, narrow]);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      ptr.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useFrame((state, delta) => {
    const s = smooth.current;
    s.p = THREE.MathUtils.damp(s.p, journeyState.progress, 2.8, delta);
    const p = s.p;
    const z = cameraZ(p);
    const xf = narrow ? 0.35 : 1;
    const [kx, ky] = sampleCamKeys(p);
    let x = kx * xf;
    let y = ky;
    if (!reduced) {
      const t = state.clock.elapsedTime;
      x += Math.sin(t * 0.24) * 0.07 + ptr.current.x * 0.09;
      y += Math.cos(t * 0.19) * 0.05 - ptr.current.y * 0.05;
    }
    camera.position.set(x, y, z);

    // Look ahead along the path, pulled toward whichever planet is in focus.
    const [ax, ay] = sampleCamKeys(Math.min(p + 0.05, 1));
    _look.set(ax * xf * 0.6, ay * 0.6, z - 11);
    let best = 0;
    let bestPlanet: ProjectPlanet | null = null;
    for (const pl of PLANETS) {
      const f = planetFocus(z, pl.position[2]);
      if (f > best) {
        best = f;
        bestPlanet = pl;
      }
    }
    if (bestPlanet) {
      const [px, py, pz] = planetWorldPos(bestPlanet, narrow);
      _look.lerp(_planet.set(px, py, pz), best * 0.42);
    }
    s.look.x = THREE.MathUtils.damp(s.look.x, _look.x, 3.2, delta);
    s.look.y = THREE.MathUtils.damp(s.look.y, _look.y, 3.2, delta);
    s.look.z = THREE.MathUtils.damp(s.look.z, _look.z, 3.2, delta);
    camera.lookAt(s.look);
  });

  return null;
}

function SpiralGalaxy({ narrow, reduced }: { narrow: boolean; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const glowTex = useMemo(() => makeGlowTexture(), []);

  const geometry = useMemo(() => {
    const count = narrow ? 20000 : 42000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const inside = new THREE.Color("#ffd3ae");
    const outside = new THREE.Color("#2c63d6");
    const accent = new THREE.Color("#4cd7f6");
    const radius = 27;
    const branches = 4;
    const spin = 1.05;
    const randomness = 0.34;
    const power = 2.9;
    const c = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 1.6) * radius;
      const branch = ((i % branches) / branches) * Math.PI * 2;
      const angle = branch + r * (spin / radius) * Math.PI * 2;
      const rx =
        Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
      const ry =
        Math.pow(Math.random(), power) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        r *
        0.3;
      const rz =
        Math.pow(Math.random(), power) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

      positions[i * 3] = Math.cos(angle) * r + rx;
      positions[i * 3 + 1] = ry;
      positions[i * 3 + 2] = Math.sin(angle) * r + rz;

      c.copy(inside).lerp(outside, r / radius);
      if (Math.random() < 0.05) c.lerp(accent, 0.7);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [narrow]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (ref.current && !reduced) ref.current.rotation.y += delta * 0.012;
  });

  return (
    <group position={[0, -9, -42]} rotation={[0.22, 0, -0.09]}>
      <points ref={ref} geometry={geometry}>
        <pointsMaterial
          size={0.09}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors
          transparent
          opacity={0.85}
          fog={false}
        />
      </points>
      {/* Warm galactic core */}
      <sprite scale={[15, 15, 1]}>
        <spriteMaterial
          map={glowTex}
          color="#ffd9b3"
          blending={THREE.AdditiveBlending}
          transparent
          opacity={0.2}
          depthWrite={false}
          fog={false}
        />
      </sprite>
    </group>
  );
}

/** Sparse near-field particles along the flight corridor; their parallax sells forward motion. */
function DustField({ narrow }: { narrow: boolean }) {
  const geometry = useMemo(() => {
    const count = narrow ? 700 : 1500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = 12 - Math.random() * 98;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [narrow]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.05}
        sizeAttenuation
        color="#9db8ff"
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        transparent
        opacity={0.55}
      />
    </points>
  );
}

const NEBULAE: {
  pos: [number, number, number];
  scale: number;
  color: string;
  opacity: number;
  drift: number;
}[] = [
  { pos: [6.5, 2.5, -20], scale: 16, color: "#2f5ed8", opacity: 0.1, drift: 0.008 },
  { pos: [-7.5, -1.5, -30], scale: 19, color: "#4cd7f6", opacity: 0.07, drift: -0.006 },
  { pos: [7, -2, -44], scale: 17, color: "#7b5cff", opacity: 0.09, drift: 0.007 },
  { pos: [-6.5, 3, -56], scale: 20, color: "#3553c9", opacity: 0.1, drift: -0.005 },
  { pos: [1.5, -3.5, -68], scale: 18, color: "#b257d8", opacity: 0.08, drift: 0.006 },
  { pos: [-2, 4.5, -14], scale: 13, color: "#4cd7f6", opacity: 0.05, drift: -0.008 },
];

function NebulaField({ reduced }: { reduced: boolean }) {
  const glowTex = useMemo(() => makeGlowTexture(), []);
  const mats = useRef<(THREE.SpriteMaterial | null)[]>([]);

  useEffect(() => () => glowTex.dispose(), [glowTex]);

  useFrame((_, delta) => {
    if (reduced) return;
    mats.current.forEach((m, i) => {
      if (m) m.rotation += NEBULAE[i].drift * delta * 10;
    });
  });

  return (
    <>
      {NEBULAE.map((n, i) => (
        <sprite key={i} position={n.pos} scale={[n.scale, n.scale, 1]}>
          <spriteMaterial
            ref={(m) => {
              mats.current[i] = m;
            }}
            map={glowTex}
            color={n.color}
            blending={THREE.AdditiveBlending}
            transparent
            opacity={n.opacity}
            depthWrite={false}
            fog={false}
          />
        </sprite>
      ))}
    </>
  );
}

export function GalaxyScene({ portal }: { portal: React.RefObject<HTMLElement> }) {
  const width = useThree((s) => s.size.width);
  const narrow = width < 768;
  const reduced = usePrefersReducedMotion();

  return (
    <>
      <CameraRig narrow={narrow} reduced={reduced} />
      <Stars
        radius={240}
        depth={90}
        count={4500}
        factor={5.5}
        saturation={0}
        fade
        speed={reduced ? 0 : 0.5}
      />
      <SpiralGalaxy narrow={narrow} reduced={reduced} />
      <DustField narrow={narrow} />
      <NebulaField reduced={reduced} />
      {PLANETS.map((planet, i) => (
        <ProjectPlanetMesh
          key={planet.title}
          planet={planet}
          index={i}
          portal={portal}
          narrow={narrow}
          reduced={reduced}
        />
      ))}
    </>
  );
}
