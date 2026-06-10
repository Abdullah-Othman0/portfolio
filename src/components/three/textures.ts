import * as THREE from "three";

/** Soft radial glow used for nebula sprites and the galaxy core. White, tinted via material color. */
export function makeGlowTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const half = size / 2;
  const g = ctx.createRadialGradient(half, half, 0, half, half, half);
  g.addColorStop(0, "rgba(255,255,255,0.85)");
  g.addColorStop(0.25, "rgba(255,255,255,0.32)");
  g.addColorStop(0.55, "rgba(255,255,255,0.08)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Radial band gradient for planetary rings. Sampled along u (inner -> outer edge). */
export function makeRingTexture(): THREE.CanvasTexture {
  const w = 256;
  const h = 4;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, "rgba(143,168,255,0)");
  g.addColorStop(0.08, "rgba(143,168,255,0.4)");
  g.addColorStop(0.28, "rgba(186,202,255,0.6)");
  g.addColorStop(0.36, "rgba(120,148,255,0.07)");
  g.addColorStop(0.44, "rgba(196,209,255,0.55)");
  g.addColorStop(0.6, "rgba(150,174,255,0.45)");
  g.addColorStop(0.67, "rgba(120,148,255,0.1)");
  g.addColorStop(0.8, "rgba(172,191,255,0.35)");
  g.addColorStop(1, "rgba(143,168,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
