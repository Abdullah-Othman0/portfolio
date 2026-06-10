"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import {
  type ProjectPlanet,
  heroState,
  planetFocus,
  planetHeroPos,
  planetWorldPos,
} from "./journey-data";
import { makeRingTexture } from "./textures";

const NOISE_GLSL = /* glsl */ `
float hash3(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float vnoise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash3(i), hash3(i + vec3(1, 0, 0)), f.x),
        mix(hash3(i + vec3(0, 1, 0)), hash3(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(hash3(i + vec3(0, 0, 1)), hash3(i + vec3(1, 0, 1)), f.x),
        mix(hash3(i + vec3(0, 1, 1)), hash3(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
}
float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p *= 2.1;
    a *= 0.5;
  }
  return v;
}
`;

const SURFACE_VERT = /* glsl */ `
varying vec3 vWorldNormal;
varying vec3 vWorldPos;
varying vec3 vPos;
#include <fog_pars_vertex>
void main() {
  vPos = position;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`;

const SURFACE_FRAG = /* glsl */ `
uniform vec3 uColA;
uniform vec3 uColB;
uniform vec3 uColDeep;
uniform vec3 uRimColor;
uniform float uRimPower;
uniform float uRimStrength;
uniform float uBandFreq;
uniform float uWarp;
uniform float uNoiseScale;
uniform float uSeed;
uniform float uTime;
uniform vec3 uLightDir;
uniform float uEmberStrength;
uniform vec3 uEmberColor;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;
varying vec3 vPos;
#include <fog_pars_fragment>
${"NOISE"}
void main() {
  vec3 N = normalize(vWorldNormal);
  vec3 V = normalize(cameraPosition - vWorldPos);
  float n = fbm(vPos * uNoiseScale + uSeed);

  float pattern;
  if (uBandFreq > 0.0) {
    // Latitudinal gas bands, warped by noise so they churn instead of striping
    pattern = 0.5 + 0.5 * sin(vPos.y * uBandFreq + (n - 0.5) * uWarp + uTime * 0.04);
  } else {
    pattern = smoothstep(0.32, 0.72, n);
  }
  vec3 surf = mix(uColA, uColB, pattern);
  surf = mix(surf, uColDeep, smoothstep(0.45, 1.0, abs(normalize(vPos).y)) * 0.55);

  float diff = clamp(dot(N, uLightDir), 0.0, 1.0);
  float light = 0.16 + 0.95 * pow(diff, 0.9);
  vec3 col = surf * light;

  if (uEmberStrength > 0.0) {
    float v = fbm(vPos * uNoiseScale * 2.3 + uSeed * 1.7);
    float veins = smoothstep(0.5, 0.55, v) * (1.0 - smoothstep(0.6, 0.66, v));
    col += uEmberColor * veins * uEmberStrength * (0.85 + 0.3 * sin(uTime * 0.8));
  }

  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), uRimPower);
  col += uRimColor * fres * uRimStrength;

  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
}
`.replace("NOISE", NOISE_GLSL);

const ATMO_VERT = /* glsl */ `
varying vec3 vViewNormal;
void main() {
  vViewNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const ATMO_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uPower;
uniform float uStrength;
varying vec3 vViewNormal;
void main() {
  // Back-face normals point away from the camera at sphere center and graze
  // it at the rim, producing a halo that hugs the silhouette.
  float d = dot(normalize(vViewNormal), vec3(0.0, 0.0, 1.0));
  float i = pow(clamp(1.0 + d, 0.0, 1.0), uPower);
  gl_FragColor = vec4(uColor * i * uStrength, i);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

const LIGHT_DIR = new THREE.Vector3(-0.4, 0.5, 0.75).normalize();

function createSurfaceMaterial(p: ProjectPlanet, seed: number) {
  const isGas = p.kind === "gas" || p.kind === "ringed";
  return new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        uColA: { value: new THREE.Color(p.palette.a) },
        uColB: { value: new THREE.Color(p.palette.b) },
        uColDeep: { value: new THREE.Color(p.palette.deep) },
        uRimColor: { value: new THREE.Color(p.palette.rim) },
        uRimPower: { value: 2.6 },
        uRimStrength: { value: 1.25 },
        uBandFreq: { value: isGas ? (p.kind === "gas" ? 3.4 : 4.2) : 0 },
        uWarp: { value: p.kind === "gas" ? 2.2 : 1.6 },
        uNoiseScale: { value: isGas ? 1.6 : 2.2 },
        uSeed: { value: seed },
        uTime: { value: 0 },
        uLightDir: { value: LIGHT_DIR.clone() },
        uEmberStrength: { value: p.kind === "ember" ? 1.7 : 0 },
        uEmberColor: { value: new THREE.Color("#ff7430") },
      },
    ]),
    vertexShader: SURFACE_VERT,
    fragmentShader: SURFACE_FRAG,
    fog: true,
  });
}

function createMoonMaterial(seed: number) {
  return new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        uColA: { value: new THREE.Color("#525a70") },
        uColB: { value: new THREE.Color("#9aa3b8") },
        uColDeep: { value: new THREE.Color("#2c3142") },
        uRimColor: { value: new THREE.Color("#cdd6ee") },
        uRimPower: { value: 3.0 },
        uRimStrength: { value: 0.45 },
        uBandFreq: { value: 0 },
        uWarp: { value: 0 },
        uNoiseScale: { value: 5.0 },
        uSeed: { value: seed },
        uTime: { value: 0 },
        uLightDir: { value: LIGHT_DIR.clone() },
        uEmberStrength: { value: 0 },
        uEmberColor: { value: new THREE.Color("#000000") },
      },
    ]),
    vertexShader: SURFACE_VERT,
    fragmentShader: SURFACE_FRAG,
    fog: true,
  });
}

function createAtmoMaterial(p: ProjectPlanet) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(p.palette.atmo) },
      uPower: { value: 4.2 },
      uStrength: { value: 1.3 },
    },
    vertexShader: ATMO_VERT,
    fragmentShader: ATMO_FRAG,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
  });
}

export function ProjectPlanetMesh({
  planet,
  index,
  portal,
  narrow,
  reduced,
}: {
  planet: ProjectPlanet;
  index: number;
  portal: React.RefObject<HTMLElement>;
  narrow: boolean;
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const moonPivotRef = useRef<THREE.Group>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const snapped = useRef(false);

  const seed = (index + 1) * 7.31;
  const surface = useMemo(() => createSurfaceMaterial(planet, seed), [planet, seed]);
  const atmosphere = useMemo(() => createAtmoMaterial(planet), [planet]);
  const moonMat = useMemo(
    () => (planet.kind === "moon" ? createMoonMaterial(seed + 3.7) : null),
    [planet.kind, seed]
  );
  const ring = useMemo(() => {
    if (planet.kind !== "ringed") return null;
    const inner = planet.radius * 1.45;
    const outer = planet.radius * 2.5;
    const geo = new THREE.RingGeometry(inner, outer, 128, 1);
    // RingGeometry maps UVs planar; remap u to the radial distance so the
    // gradient texture reads as concentric bands.
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const uv = geo.attributes.uv as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5);
    }
    const mat = new THREE.MeshBasicMaterial({
      map: makeRingTexture(),
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      opacity: 0.95,
    });
    return { geo, mat };
  }, [planet.kind, planet.radius]);

  useEffect(() => {
    return () => {
      surface.dispose();
      atmosphere.dispose();
      moonMat?.dispose();
      if (ring) {
        ring.geo.dispose();
        ring.mat.map?.dispose();
        ring.mat.dispose();
      }
    };
  }, [surface, atmosphere, moonMat, ring]);

  const journeyPos = planetWorldPos(planet, narrow);
  const heroPos = planetHeroPos(planet, narrow);
  const side = Math.sign(planet.position[0]);
  const visScale = narrow ? 0.78 : 1;
  const effRadius = planet.radius * visScale;
  // Narrow: cancel the planet's lateral offset so the card never clips the
  // screen edge; the camera's opposite-side weave keeps it slightly off-center.
  const anchor: [number, number, number] = narrow
    ? [-planet.position[0] * 0.32, -(effRadius + 1.45), 0]
    : [-side * (planet.radius + 1.15), 0.15, 0];

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    surface.uniforms.uTime.value = t;
    if (!reduced) {
      if (meshRef.current) meshRef.current.rotation.y += delta * 0.06;
      if (moonPivotRef.current)
        moonPivotRef.current.rotation.y = t * 0.42 + seed;
    }
    // Blend between hero formation and corridor station as the hero scrolls away.
    const g = groupRef.current;
    if (g) {
      const b = heroState.blend;
      const eased = b * b * (3 - 2 * b);
      const tx = heroPos[0] + (journeyPos[0] - heroPos[0]) * eased;
      const ty = heroPos[1] + (journeyPos[1] - heroPos[1]) * eased;
      const tz = heroPos[2] + (journeyPos[2] - heroPos[2]) * eased;
      if (!snapped.current) {
        g.position.set(tx, ty, tz);
        snapped.current = true;
      } else {
        g.position.x = THREE.MathUtils.damp(g.position.x, tx, 3.5, delta);
        g.position.y = THREE.MathUtils.damp(g.position.y, ty, 3.5, delta);
        g.position.z = THREE.MathUtils.damp(g.position.z, tz, 3.5, delta);
      }
    }
    // Card visibility follows camera proximity; direct style writes keep
    // this off React's render path entirely.
    const el = cardRef.current;
    if (el) {
      const f = planetFocus(state.camera.position.z, planet.position[2]);
      if (f < 0.02) {
        el.style.visibility = "hidden";
        el.style.opacity = "0";
      } else {
        el.style.visibility = "visible";
        el.style.opacity = f.toFixed(3);
        el.style.transform = `translateY(${((1 - f) * 14).toFixed(1)}px) scale(${(
          0.94 +
          f * 0.06
        ).toFixed(3)})`;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <group scale={visScale}>
        <mesh ref={meshRef} material={surface} rotation={[0.1, 0, 0.08]}>
          <sphereGeometry args={[planet.radius, 96, 96]} />
        </mesh>
        <mesh material={atmosphere} scale={1.16} renderOrder={2}>
          <sphereGeometry args={[planet.radius, 48, 48]} />
        </mesh>
        {ring && (
          <mesh
            geometry={ring.geo}
            material={ring.mat}
            rotation={[-Math.PI / 2.15, 0.12, 0]}
            renderOrder={1}
          />
        )}
        {moonMat && (
          <group ref={moonPivotRef} rotation={[0.2, 0, 0.1]}>
            <mesh material={moonMat} position={[2.35, 0.15, 0]}>
              <sphereGeometry args={[0.3, 32, 32]} />
            </mesh>
          </group>
        )}
      </group>

      <Html
        position={anchor}
        center
        portal={portal}
        zIndexRange={[40, 0]}
      >
        <div
          ref={cardRef}
          className="planet-card"
          data-side={side > 0 ? "right" : "left"}
          style={
            {
              "--card-glow": planet.hue,
              opacity: 0,
              visibility: "hidden",
            } as React.CSSProperties
          }
        >
          <div className="flex items-baseline gap-3 mb-3">
            <span
              className="font-[var(--font-jetbrains)] text-xs font-semibold"
              style={{ color: planet.hue }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-xl font-bold tracking-tight text-white">
              {planet.title}
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-white/65 mb-4">
            {planet.blurb}
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {planet.tags.map((tag) => (
              <span key={tag} className="planet-tag">
                {tag}
              </span>
            ))}
          </div>
          <a
            href={planet.repo}
            target="_blank"
            rel="noreferrer"
            tabIndex={-1}
            className="inline-flex items-center gap-1.5 text-sm font-bold transition-opacity hover:opacity-75"
            style={{ color: planet.hue }}
          >
            View source
            <span className="material-symbols-outlined text-base leading-none">
              north_east
            </span>
          </a>
        </div>
      </Html>
    </group>
  );
}
