'use client';

import React, { useEffect, useLayoutEffect, useRef, useState, isValidElement } from 'react';
import * as THREE from 'three';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Download04Icon,
  Layers01Icon,
  Award01Icon,
  BookOpen01Icon,
  Briefcase01Icon,
  File01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  PauseIcon,
  PlayIcon,
} from '@hugeicons/core-free-icons';

const RESUME_FILE = '/crft/crft1.jpg';
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const useIsoLayout = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const AUTOPLAY_MS = 5500;      // time per slide
const USER_HOLD_MS = 10000;    // pause auto-advance for 10s after user interaction

/* ───────────────────────── helpers ───────────────────────── */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const finite = (v, f) => (Number.isFinite(v) ? v : f);
const spring = (value = 0) => ({ value, target: value, velocity: 0 });

function advance(s, dt, duration, instant) {
  if (instant || duration <= 0) { s.value = s.target; s.velocity = 0; return false; }
  const omega = 8 / Math.max(0.06, duration);
  const offset = s.value - s.target;
  const term = s.velocity + omega * offset;
  const decay = Math.exp(-omega * dt);
  s.value = s.target + (offset + term * dt) * decay;
  s.velocity = (s.velocity - omega * term * dt) * decay;
  if (Math.abs(s.value - s.target) < 0.0001 && Math.abs(s.velocity) < 0.001) {
    s.value = s.target; s.velocity = 0; return false;
  }
  return true;
}
function randomSource(seed) {
  let v = seed | 0;
  return () => {
    v |= 0; v = (v + 0x6d2b79f5) | 0;
    let n = Math.imul(v ^ (v >>> 15), 1 | v);
    n = (n + Math.imul(n ^ (n >>> 7), 61 | n)) ^ n;
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}

/* ─────────────── paper path (fold simulation) ─────────────── */
function createPaperPath(rest, triangles, shortSide, density, sharpness, depth, seed) {
  const count = rest.length / 3;
  const points = Float64Array.from(rest);
  const previous = Float64Array.from(rest);
  const before = Float64Array.from(rest);
  const edges = [], hinges = [];
  const adjacency = new Map();
  const random = randomSource(seed);
  const guides = Array.from({ length: density }, () => {
    const a = random() * Math.PI * 2;
    return { x: Math.cos(a), y: Math.sin(a), phase: random() * Math.PI * 2, weight: random() * 0.6 + 0.4 };
  });
  for (let t = 0; t < triangles.length; t += 3) {
    for (let k = 0; k < 3; k++) {
      const a = triangles[t + k], b = triangles[t + ((k + 1) % 3)], opposite = triangles[t + ((k + 2) % 3)];
      const key = Math.min(a, b) * count + Math.max(a, b);
      const other = adjacency.get(key);
      if (!other) {
        adjacency.set(key, { a, b, opposite });
        const length = Math.hypot(rest[a * 3] - rest[b * 3], rest[a * 3 + 1] - rest[b * 3 + 1]);
        edges.push(a * 3, b * 3, length);
      } else {
        const c = other.opposite * 3, d = opposite * 3;
        const length = Math.hypot(rest[c] - rest[d], rest[c + 1] - rest[d + 1]);
        const mx = (rest[c] + rest[d]) * 0.5, my = (rest[c + 1] + rest[d + 1]) * 0.5;
        let weakness = 0;
        for (const g of guides) {
          const dist = Math.abs(Math.sin(((mx * g.x + my * g.y) / shortSide) * 4 + g.phase));
          weakness = Math.max(weakness, Math.exp(-dist * dist * 80) * g.weight);
        }
        hinges.push(c, d, length, 0.12 + (1 - weakness) * 0.75);
      }
    }
  }
  const spacing = Math.sqrt((shortSide * shortSide) / count);
  const thickness = shortSide * 0.008;
  const samples = [rest.slice()];
  const frameCount = 64, stepsPerFrame = 3, totalSteps = frameCount * stepsPerFrame;
  let initialRadius = 0;
  for (let i = 0; i < rest.length; i += 3)
    initialRadius = Math.max(initialRadius, Math.hypot(rest[i] / 0.94, rest[i + 1] / 1.02));
  initialRadius *= 1.02;

  function constrain(list, stride, stiffness, reverse) {
    for (let n = 0; n < list.length; n += stride) {
      const edge = reverse ? list.length - stride - n : n;
      const a = list[edge], b = list[edge + 1];
      const dx = points[b] - points[a], dy = points[b + 1] - points[a + 1], dz = points[b + 2] - points[a + 2];
      const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (length < 1e-6) continue;
      const weight = stride === 4 ? list[edge + 3] : 1;
      const amt = (1 - list[edge + 2] / length) * 0.5 * stiffness * weight;
      points[a] += dx * amt; points[b] -= dx * amt;
      points[a + 1] += dy * amt; points[b + 1] -= dy * amt;
      points[a + 2] += dz * amt; points[b + 2] -= dz * amt;
    }
  }
  function separateLayers() {
    const margin = thickness * 2;
    for (let t = 0; t < triangles.length; t += 3) {
      const a = triangles[t] * 3, b = triangles[t + 1] * 3, c = triangles[t + 2] * 3;
      const ax = points[a], ay = points[a + 1], az = points[a + 2];
      const bx = points[b] - ax, by = points[b + 1] - ay, bz = points[b + 2] - az;
      const cx = points[c] - ax, cy = points[c + 1] - ay, cz = points[c + 2] - az;
      let nx = by * cz - bz * cy, ny = bz * cx - bx * cz, nz = bx * cy - by * cx;
      const length = Math.hypot(nx, ny, nz);
      if (length < 1e-7) continue;
      nx /= length; ny /= length; nz /= length;
      const minX = Math.min(ax, points[b], points[c]) - margin;
      const maxX = Math.max(ax, points[b], points[c]) + margin;
      const minY = Math.min(ay, points[b + 1], points[c + 1]) - margin;
      const maxY = Math.max(ay, points[b + 1], points[c + 1]) + margin;
      const minZ = Math.min(az, points[b + 2], points[c + 2]) - margin;
      const maxZ = Math.max(az, points[b + 2], points[c + 2]) + margin;
      const bb = bx * bx + by * by + bz * bz, cc = cx * cx + cy * cy + cz * cz;
      const bc = bx * cx + by * cy + bz * cz;
      const det = bb * cc - bc * bc;
      if (det < 1e-10) continue;
      for (let p = 0; p < points.length; p += 3) {
        if (p === a || p === b || p === c) continue;
        if (points[p] < minX || points[p] > maxX || points[p + 1] < minY || points[p + 1] > maxY || points[p + 2] < minZ || points[p + 2] > maxZ) continue;
        const rx = rest[p] - (rest[a] + rest[b] + rest[c]) / 3;
        const ry = rest[p + 1] - (rest[a + 1] + rest[b + 1] + rest[c + 1]) / 3;
        if (rx * rx + ry * ry < spacing * spacing * 6) continue;
        const dx = points[p] - ax, dy = points[p + 1] - ay, dz = points[p + 2] - az;
        const dist = dx * nx + dy * ny + dz * nz;
        const prevDist = (before[p] - before[a]) * nx + (before[p + 1] - before[a + 1]) * ny + (before[p + 2] - before[a + 2]) * nz;
        const side = prevDist >= 0 ? 1 : -1;
        if (dist * side >= thickness || Math.abs(dist) > margin) continue;
        const pb = dx * bx + dy * by + dz * bz, pc = dx * cx + dy * cy + dz * cz;
        const u = (cc * pb - bc * pc) / det, v = (bb * pc - bc * pb) / det;
        if (u < 0 || v < 0 || u + v > 1) continue;
        const w = 1 - u - v;
        const correction = (thickness * side - dist) / (1 + w * w + u * u + v * v);
        for (let axis = 0; axis < 3; axis++) {
          const normal = axis === 0 ? nx : axis === 1 ? ny : nz;
          const move = normal * correction;
          points[p + axis] += move;
          points[a + axis] -= move * w;
          points[b + axis] -= move * u;
          points[c + axis] -= move * v;
        }
      }
    }
  }
  for (let step = 1; step <= totalSteps; step++) {
    const progress = step / totalSteps;
    const compression = progress * progress * (3 - 2 * progress);
    const radius = initialRadius * (1 - compression) + shortSide * (0.19 - depth * 0.025) * compression;
    before.set(points);
    for (let i = 0; i < points.length; i += 3) {
      const x = rest[i] / shortSide, y = rest[i + 1] / shortSide;
      let buckle = 0;
      for (const g of guides) buckle += Math.sin((x * g.x + y * g.y) * 5 + g.phase) * g.weight;
      for (let axis = 0; axis < 3; axis++) {
        const vel = (points[i + axis] - previous[i + axis]) * 0.55;
        previous[i + axis] = points[i + axis];
        points[i + axis] += clamp(vel, -spacing * 0.15, spacing * 0.15);
      }
      points[i + 2] += (buckle / density) * shortSide * 0.0007 * Math.sin(progress * Math.PI);
    }
    for (let pass = 0; pass < 18; pass++) {
      constrain(hinges, 4, 0.45 * (1 - sharpness * 0.4), pass % 2 === 0);
      for (let i = 0; i < points.length; i += 3) {
        const x = points[i] / 0.94, y = points[i + 1] / 1.02, z = points[i + 2] / 0.86;
        const dist = Math.hypot(x, y, z);
        if (dist > radius) {
          const push = (1 - radius / dist) * 0.55;
          points[i] -= points[i] * push; points[i + 1] -= points[i + 1] * push; points[i + 2] -= points[i + 2] * push;
        }
      }
      constrain(edges, 3, 1, pass % 2 !== 0);
      if (pass === 8 || pass === 17) separateLayers();
    }
    for (let h = 0; h < hinges.length; h += 4) {
      const a = hinges[h], b = hinges[h + 1];
      const len = Math.hypot(points[a] - points[b], points[a + 1] - points[b + 1], points[a + 2] - points[b + 2]);
      if (len < hinges[h + 2] * 0.86) hinges[h + 2] += (len - hinges[h + 2]) * 0.12;
    }
    if (step % stepsPerFrame === 0) samples.push(Float32Array.from(points));
  }
  const folded = Float64Array.from(points);
  for (let step = 1; step <= 80; step++) {
    const t = step / 80;
    const unfold = t * t * (3 - 2 * t);
    for (let pass = 0; pass < 12; pass++) {
      for (let i = 0; i < points.length; i++) {
        const target = folded[i] + (rest[i] - folded[i]) * unfold;
        points[i] += (target - points[i]) * (i % 3 === 2 ? 0.04 : 0.22);
      }
      constrain(hinges, 4, 0.7, pass % 2 === 0);
      constrain(edges, 3, 1, pass % 2 !== 0);
    }
  }
  return { samples, creased: Float32Array.from(points) };
}

/* ═══════════════════════════════════════════════════════════
   PaperCrumple
   ═══════════════════════════════════════════════════════════ */
const PaperCrumple = ({
  src, alt = 'Crumplable image', backSrc = '',
  width = 320, height = 400, sceneHeight = 560, imageFit = 'cover',
  releaseBehavior = 'restore', crumpleAmount = 0.85, crumpleDuration = 0.55,
  releaseDuration = 0.4, foldCount = 6, foldSharpness = 0.6, wrinkleDepth = 0.65,
  creaseStrength = 0.18, paperColor = '#f4f0e8', roughness = 0.92,
  paperTexture = 0.08, lightIntensity = 1.8, lightAngle = -35,
  shadow = true, shadowOpacity = 0.08, draggable = true, dragRotation = 10,
  dragRadius = 180, returnToOrigin = true, rotation = 0, seed = 7, detail = 64,
  disabled = false, resetKey = 0, onStateChange, onError,
  className = '', style
}) => {
  const pathCache = useRef(null);
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const hitRef = useRef(null);
  const resetRef = useRef(null);
  const cancelRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const options = useRef({});
  options.current = { releaseBehavior, crumpleAmount, crumpleDuration, releaseDuration, creaseStrength, draggable, dragRotation, dragRadius, returnToOrigin, disabled, onStateChange, onError };

  useEffect(() => {
    const root = rootRef.current, canvas = canvasRef.current, hit = hitRef.current;
    if (!root || !canvas || !hit) return;
    setStatus('loading');
    hit.disabled = true;
    hit.dataset.held = 'false';
    hit.setAttribute('aria-pressed', 'false');
    const initialRect = root.getBoundingClientRect();
    const initialWidth = Math.max(1, finite(width, 320));
    const initialHeight = Math.max(1, finite(height, 400));
    const initialScale = Math.min(1, Math.max(1, initialRect.width - 48) / initialWidth, Math.max(1, initialRect.height - 48) / initialHeight);
    root.style.setProperty('--pc-image-width', `${initialWidth * initialScale}px`);
    root.style.setProperty('--pc-image-height', `${initialHeight * initialScale}px`);
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch (error) {
      setStatus('error');
      options.current.onError?.(error instanceof Error ? error : new Error('WebGL is unavailable.'));
      return;
    }
    const paperWidth = Math.max(1, finite(width, 320));
    const paperHeight = Math.max(1, finite(height, 400));
    const aspect = paperHeight / paperWidth;
    const shortSide = Math.min(1, aspect);
    const resolution = Math.round(clamp(finite(detail, 64) / 4, 8, 24));
    const columns = Math.max(8, Math.round(resolution / Math.max(1, aspect)));
    const rows = Math.max(8, Math.round(resolution * Math.min(1, aspect)));
    const rng = randomSource(finite(seed, 7));
    const sharpness = clamp(finite(foldSharpness, 0.6), 0, 1);
    const foldTotal = Math.round(clamp(finite(foldCount, 6), 3, 16));
    const depth = clamp(finite(wrinkleDepth, 0.65), 0, 2);
    const count = (columns + 1) * (rows + 1);
    const original = new Float32Array(count * 3);
    const positions = new Float32Array(count * 3);
    const uvs = new Float32Array(count * 2);
    const indices = [];
    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= columns; col++) {
        const index = row * (columns + 1) + col;
        const u = (col + (col > 0 && col < columns ? (rng() - 0.5) * 0.5 : 0)) / columns;
        const v = (row + (row > 0 && row < rows ? (rng() - 0.5) * 0.5 : 0)) / rows;
        const x = u - 0.5, y = (v - 0.5) * aspect;
        original[index * 3] = x; original[index * 3 + 1] = y;
        uvs[index * 2] = u; uvs[index * 2 + 1] = v;
        if (col < columns && row < rows) {
          const a = index, b = index + 1, c = index + columns + 1, d = c + 1;
          if (rng() > 0.5) indices.push(a, b, d, a, d, c);
          else indices.push(a, b, c, b, d, c);
        }
      }
    }
    const pathKey = JSON.stringify([paperWidth, paperHeight, resolution, foldTotal, sharpness, depth, seed]);
    if (pathCache.current?.key !== pathKey) {
      pathCache.current = { key: pathKey, value: createPaperPath(original, indices, shortSide, foldTotal, sharpness, depth, finite(seed, 7)) };
    }
    const paperPath = pathCache.current.value;
    const renderPositions = new Float32Array(indices.length * 3);
    const renderNormals = new Float32Array(indices.length * 3);
    const renderUvs = new Float32Array(indices.length * 2);
    const faceNormals = new Float32Array(indices.length);
    const incidentFaces = Array.from({ length: count }, () => []);
    for (let i = 0; i < indices.length; i++) {
      renderUvs[i * 2] = uvs[indices[i] * 2];
      renderUvs[i * 2 + 1] = uvs[indices[i] * 2 + 1];
      incidentFaces[indices[i]].push(Math.floor(i / 3) * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(renderPositions, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('normal', new THREE.BufferAttribute(renderNormals, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute('uv', new THREE.BufferAttribute(renderUvs, 2));
    const grainData = new Uint8Array(128 * 128 * 4);
    for (let i = 0; i < grainData.length; i += 4) {
      const value = 100 + Math.floor(rng() * 155);
      grainData[i] = grainData[i + 1] = grainData[i + 2] = value;
      grainData[i + 3] = 255;
    }
    const grain = new THREE.DataTexture(grainData, 128, 128);
    grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
    grain.repeat.set(5, 5 * aspect);
    grain.magFilter = THREE.LinearFilter;
    grain.minFilter = THREE.LinearFilter;
    grain.needsUpdate = true;
    const materialOptions = { roughness: clamp(finite(roughness, 0.92), 0, 1), metalness: 0, bumpMap: grain, bumpScale: clamp(finite(paperTexture, 0.08), 0, 1) * 0.32, alphaTest: 0.04, alphaToCoverage: true, flatShading: false };
    const frontMaterial = new THREE.MeshStandardMaterial({ ...materialOptions, side: THREE.FrontSide });
    const backMaterial = new THREE.MeshStandardMaterial({ ...materialOptions, side: THREE.BackSide, color: backSrc ? '#ffffff' : paperColor });
    const lighting = { value: 0 };
    for (const material of [frontMaterial, backMaterial]) {
      material.onBeforeCompile = shader => {
        shader.uniforms.paperLighting = lighting;
        shader.fragmentShader = 'uniform float paperLighting;\n' + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
          #include <map_fragment>
          #ifdef USE_MAP
            if (vMapUv.x < 0.0 || vMapUv.x > 1.0 || vMapUv.y < 0.0 || vMapUv.y > 1.0) discard;
            ${material === backMaterial && !backSrc ? 'diffuseColor.rgb = diffuse;' : ''}
          #endif
        `);
        shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', `
          outgoingLight = mix(diffuseColor.rgb, outgoingLight, paperLighting);
          #include <opaque_fragment>
        `);
      };
      material.customProgramCacheKey = () => `paper-${material === backMaterial && !backSrc ? 'stock' : 'print'}`;
    }
    const depthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, alphaTest: 0.04, side: THREE.DoubleSide });
    depthMaterial.onBeforeCompile = shader => {
      shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
        #include <map_fragment>
        #ifdef USE_MAP
          if (vMapUv.x < 0.0 || vMapUv.x > 1.0 || vMapUv.y < 0.0 || vMapUv.y > 1.0) discard;
        #endif
      `);
    };
    const sheet = new THREE.Group();
    const front = new THREE.Mesh(geometry, frontMaterial);
    const back = new THREE.Mesh(geometry, backMaterial);
    front.castShadow = shadow; front.receiveShadow = shadow; back.receiveShadow = shadow;
    front.customDepthMaterial = depthMaterial;
    sheet.add(front, back);
    const scene = new THREE.Scene();
    scene.add(sheet);
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 10000);
    const ambient = new THREE.HemisphereLight(0xffffff, 0xa4a0b0, 1.35);
    scene.add(ambient);
    const light = new THREE.DirectionalLight(0xfffaf0, Math.max(0, finite(lightIntensity, 1.8)));
    light.castShadow = shadow;
    light.shadow.mapSize.set(1024, 1024);
    light.shadow.bias = -0.0002;
    light.shadow.normalBias = 0.6;
    light.shadow.radius = 3;
    scene.add(light, light.target);
    const floorGeometry = new THREE.PlaneGeometry(1, 1);
    const floorMaterial = new THREE.ShadowMaterial({ opacity: clamp(finite(shadowOpacity, 0.08), 0, 1), depthWrite: false });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.receiveShadow = true;
    floor.visible = shadow;
    scene.add(floor);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = shadow;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const amount = spring(), memory = spring(), posX = spring(), posY = spring(), tiltX = spring(), tiltY = spring();
    const springs = [amount, memory, posX, posY, tiltX, tiltY];
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const anchor = new THREE.Vector3(), world = new THREE.Vector3(), corner = new THREE.Vector3();
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    const weights = new THREE.Vector3(1, 0, 0);
    let gripIndices = [Math.floor(count / 2), 0, 0];
    let viewportWidth = 1, viewportHeight = 1, scale = paperWidth;
    let pointerX = 0, pointerY = 0, lastX = 0, lastY = 0, lastMove = 0;
    let speedX = 0, speedY = 0;
    let held = false, keyboard = false, pointerId = null;
    let peak = 0, disposed = false, ready = false, inView = true, contextLost = false;
    let frame = 0, lastTime = 0, state = 'flat';
    const textures = new Set();
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduceMotion = media.matches;
    let prevAmount = -1, prevMemory = -1;
    const baseRotation = THREE.MathUtils.degToRad(finite(rotation, 0));

    function publish(next) {
      if (next === state) return;
      state = next;
      options.current.onStateChange?.(next);
    }
    function deform() {
      if (amount.value === prevAmount && memory.value === prevMemory) return;
      prevAmount = amount.value; prevMemory = memory.value;
      const fold = clamp(amount.value, 0, 1);
      const fr = fold * (paperPath.samples.length - 1);
      const lower = Math.floor(fr);
      const upper = Math.min(lower + 1, paperPath.samples.length - 1);
      const mix = fr - lower;
      const from = paperPath.samples[lower], to = paperPath.samples[upper];
      for (let i = 0; i < positions.length; i++) {
        positions[i] = from[i] + (to[i] - from[i]) * mix;
        positions[i] += (paperPath.creased[i] - original[i]) * memory.value * (1 - fold);
      }
      for (let face = 0; face < indices.length; face += 3) {
        const A = indices[face] * 3, B = indices[face + 1] * 3, C = indices[face + 2] * 3;
        const bx = positions[B] - positions[A], by = positions[B + 1] - positions[A + 1], bz = positions[B + 2] - positions[A + 2];
        const cx = positions[C] - positions[A], cy = positions[C + 1] - positions[A + 1], cz = positions[C + 2] - positions[A + 2];
        const nx = by * cz - bz * cy, ny = bz * cx - bx * cz, nz = bx * cy - by * cx;
        const len = Math.hypot(nx, ny, nz) || 1;
        faceNormals[face] = nx / len; faceNormals[face + 1] = ny / len; faceNormals[face + 2] = nz / len;
      }
      for (let i = 0; i < indices.length; i++) {
        const source = indices[i] * 3;
        const face = Math.floor(i / 3) * 3;
        let nx = 0, ny = 0, nz = 0;
        for (const neighbor of incidentFaces[indices[i]]) {
          const dot = faceNormals[face] * faceNormals[neighbor] + faceNormals[face + 1] * faceNormals[neighbor + 1] + faceNormals[face + 2] * faceNormals[neighbor + 2];
          const w = THREE.MathUtils.smoothstep(dot, 0.88 - (1 - sharpness) * 0.18, 0.98);
          nx += faceNormals[neighbor] * w; ny += faceNormals[neighbor + 1] * w; nz += faceNormals[neighbor + 2] * w;
        }
        const len = Math.hypot(nx, ny, nz) || 1;
        renderPositions[i * 3] = positions[source]; renderPositions[i * 3 + 1] = positions[source + 1]; renderPositions[i * 3 + 2] = positions[source + 2];
        renderNormals[i * 3] = nx / len; renderNormals[i * 3 + 1] = ny / len; renderNormals[i * 3 + 2] = nz / len;
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.normal.needsUpdate = true;
      geometry.computeBoundingSphere();
      geometry.computeBoundingBox();
      lighting.value = THREE.MathUtils.smoothstep(fold + memory.value, 0, 0.4);
    }
    function placeHitTarget() {
      const bounds = geometry.boundingBox;
      if (!bounds) return;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (let i = 0; i < 8; i++) {
        corner.set(i & 1 ? bounds.max.x : bounds.min.x, i & 2 ? bounds.max.y : bounds.min.y, i & 4 ? bounds.max.z : bounds.min.z);
        corner.applyMatrix4(sheet.matrixWorld).project(camera);
        const x = ((corner.x + 1) * viewportWidth) / 2, y = ((1 - corner.y) * viewportHeight) / 2;
        minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
      hit.style.transform = `translate3d(${minX}px, ${minY}px, 0)`;
      hit.style.width = `${Math.max(24, maxX - minX)}px`;
      hit.style.height = `${Math.max(24, maxY - minY)}px`;
    }
    function setPointer(x, y) {
      pointer.set((x / viewportWidth) * 2 - 1, 1 - (y / viewportHeight) * 2);
      raycaster.setFromCamera(pointer, camera);
    }
    function render(time) {
      frame = 0;
      if (disposed || !ready || contextLost || !inView || document.hidden) return;
      const dt = lastTime ? Math.min(0.04, (time - lastTime) / 1000) : 1 / 60;
      lastTime = time;
      const opts = options.current;
      let moving = false;
      const duration = held ? finite(opts.crumpleDuration, 0.55) : finite(opts.releaseDuration, 0.4);
      for (const s of springs)
        moving = advance(s, dt, s === amount || s === memory ? duration : 0.42, reduceMotion || keyboard) || moving;
      peak = Math.max(peak, amount.value);
      deform();
      sheet.rotation.set(tiltX.value, tiltY.value, baseRotation);
      if (held && !keyboard && opts.draggable) {
        const attribute = geometry.attributes.position;
        anchor.set(0, 0, 0);
        for (let i = 0; i < 3; i++) {
          a.fromBufferAttribute(attribute, gripIndices[i]);
          anchor.addScaledVector(a, weights.getComponent(i));
        }
        anchor.multiplyScalar(scale).applyEuler(sheet.rotation);
        plane.constant = -anchor.z;
        setPointer(pointerX, pointerY);
        if (raycaster.ray.intersectPlane(plane, world)) {
          posX.value = posX.target = world.x - anchor.x;
          posY.value = posY.target = world.y - anchor.y;
          posX.velocity = posY.velocity = 0;
        }
      }
      sheet.position.set(posX.value, posY.value, 0);
      sheet.updateMatrixWorld(true);
      const shadowBounds = geometry.boundingBox;
      if (shadowBounds) {
        let backZ = Infinity;
        for (let i = 0; i < 8; i++) {
          corner.set(i & 1 ? shadowBounds.max.x : shadowBounds.min.x, i & 2 ? shadowBounds.max.y : shadowBounds.min.y, i & 4 ? shadowBounds.max.z : shadowBounds.min.z);
          corner.applyMatrix4(sheet.matrixWorld);
          backZ = Math.min(backZ, corner.z);
        }
        floor.position.z = backZ - scale * shortSide * 0.08;
      }
      renderer.render(scene, camera);
      placeHitTarget();
      if (moving) wake();
    }
    function wake() {
      if (!frame && !disposed && ready && inView && !document.hidden && !contextLost) frame = requestAnimationFrame(render);
    }
    function resize() {
      const rect = root.getBoundingClientRect();
      viewportWidth = Math.max(1, rect.width);
      viewportHeight = Math.max(1, rect.height);
      scale = paperWidth * Math.min(1, Math.max(1, viewportWidth - 48) / paperWidth, Math.max(1, viewportHeight - 48) / paperHeight);
      sheet.scale.setScalar(scale);
      camera.aspect = viewportWidth / viewportHeight;
      camera.position.z = viewportHeight / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(viewportWidth, viewportHeight, false);
      const reach = Math.max(viewportWidth, viewportHeight);
      const angle = THREE.MathUtils.degToRad(finite(lightAngle, -35));
      light.position.set(Math.sin(angle) * reach, Math.cos(angle) * reach, reach * 4);
      light.shadow.camera.left = light.shadow.camera.bottom = -reach;
      light.shadow.camera.right = light.shadow.camera.top = reach;
      light.shadow.camera.near = 1;
      light.shadow.camera.far = reach * 6;
      light.shadow.camera.updateProjectionMatrix();
      floor.position.z = -scale * shortSide * 0.12;
      floor.scale.set(viewportWidth * 4, viewportHeight * 4, 1);
      root.style.setProperty('--pc-image-width', `${scale}px`);
      root.style.setProperty('--pc-image-height', `${scale * aspect}px`);
      if (!held) {
        const limitX = Math.max(0, (viewportWidth - scale) / 2 - 16);
        const limitY = Math.max(0, (viewportHeight - scale * aspect) / 2 - 16);
        posX.value = posX.target = clamp(posX.value, -limitX, limitX);
        posY.value = posY.target = clamp(posY.value, -limitY, limitY);
      }
      wake();
    }
    function finish(instant = false) {
      if (!held) return;
      const opts = options.current;
      held = false;
      hit.setAttribute('aria-pressed', 'false');
      hit.dataset.held = 'false';
      const captured = pointerId;
      pointerId = null;
      if (captured !== null && hit.hasPointerCapture(captured)) hit.releasePointerCapture(captured);
      if (opts.releaseBehavior === 'stay') {
        amount.target = amount.value; amount.velocity = 0;
      } else {
        amount.target = 0;
        memory.target = opts.releaseBehavior === 'creased' ? Math.max(memory.value, peak * clamp(finite(opts.creaseStrength, 0.18), 0, 1)) : 0;
      }
      tiltX.target = tiltY.target = 0;
      if (opts.returnToOrigin && opts.releaseBehavior !== 'stay') {
        posX.target = posY.target = 0;
      } else {
        const bounds = geometry.boundingBox;
        const spanX = opts.releaseBehavior === 'stay' && bounds ? bounds.max.x - bounds.min.x : 1;
        const spanY = opts.releaseBehavior === 'stay' && bounds ? bounds.max.y - bounds.min.y : aspect;
        const halfW = ((Math.abs(Math.cos(baseRotation)) * spanX + Math.abs(Math.sin(baseRotation)) * spanY) * scale) / 2;
        const halfH = ((Math.abs(Math.sin(baseRotation)) * spanX + Math.abs(Math.cos(baseRotation)) * spanY) * scale) / 2;
        const limitX = Math.min(Math.max(0, finite(opts.dragRadius, 180)), Math.max(0, viewportWidth / 2 - halfW - 16));
        const limitY = Math.min(Math.max(0, finite(opts.dragRadius, 180)), Math.max(0, viewportHeight / 2 - halfH - 16));
        const coast = !reduceMotion && !keyboard && performance.now() - lastMove < 90 ? 0.06 : 0;
        posX.target = clamp(posX.value + speedX * coast, -limitX, limitX);
        posY.target = clamp(posY.value - speedY * coast, -limitY, limitY);
      }
      if (instant || keyboard || reduceMotion) for (const s of springs) advance(s, 0, 0, true);
      keyboard = false;
      publish(opts.releaseBehavior === 'stay' && amount.target > 0.001 ? 'crumpled' : memory.target > 0.001 ? 'creased' : 'flat');
      wake();
    }
    function reset() {
      finish(true);
      for (const s of springs) s.target = s.value = s.velocity = 0;
      peak = 0;
      publish('flat');
      wake();
    }
    resetRef.current = reset;
    cancelRef.current = () => finish(true);
    function start() {
      held = true;
      peak = amount.value;
      amount.target = clamp(finite(options.current.crumpleAmount, 0.85), 0, 1);
      hit.setAttribute('aria-pressed', 'true');
      hit.dataset.held = 'true';
      publish('holding');
      wake();
    }
    function pointerDown(event) {
      if (!ready || options.current.disabled || held || event.button !== 0 || !event.isPrimary) return;
      const rect = root.getBoundingClientRect();
      pointerX = lastX = event.clientX - rect.left;
      pointerY = lastY = event.clientY - rect.top;
      setPointer(pointerX, pointerY);
      sheet.updateMatrixWorld(true);
      const intersection = raycaster.intersectObjects([front, back], false)[0];
      if (!intersection?.face) return;
      event.preventDefault();
      hit.dataset.pointer = 'true';
      hit.focus({ preventScroll: true });
      const { face } = intersection;
      gripIndices = [face.a, face.b, face.c];
      const attribute = geometry.attributes.position;
      a.fromBufferAttribute(attribute, face.a);
      b.fromBufferAttribute(attribute, face.b);
      c.fromBufferAttribute(attribute, face.c);
      THREE.Triangle.getBarycoord(sheet.worldToLocal(intersection.point.clone()), a, b, c, weights);
      keyboard = false;
      pointerId = event.pointerId;
      speedX = speedY = 0;
      lastMove = performance.now();
      hit.setPointerCapture(event.pointerId);
      start();
    }
    function pointerMove(event) {
      if (!held || event.pointerId !== pointerId || !options.current.draggable) return;
      const rect = root.getBoundingClientRect();
      const now = performance.now();
      const x = event.clientX - rect.left, y = event.clientY - rect.top;
      const dt = Math.max(0.008, (now - lastMove) / 1000);
      speedX = (x - lastX) / dt;
      speedY = (y - lastY) / dt;
      lastX = x; lastY = y; lastMove = now;
      pointerX = clamp(x, 12, viewportWidth - 12);
      pointerY = clamp(y, 12, viewportHeight - 12);
      const maxTilt = reduceMotion ? 0 : THREE.MathUtils.degToRad(clamp(finite(options.current.dragRotation, 10), 0, 60));
      tiltX.target = clamp(speedY / 1800, -1, 1) * maxTilt;
      tiltY.target = clamp(speedX / 1800, -1, 1) * maxTilt;
      wake();
    }
    function pointerUp(event) { if (event.pointerId === pointerId) finish(); }
    function pointerCancel(event) { if (event.pointerId === pointerId) finish(true); }
    function cancel() { finish(true); }
    function blur() { hit.dataset.pointer = 'false'; cancel(); }
    function keyDown(event) {
      if (options.current.disabled || !ready) return;
      hit.dataset.pointer = 'false';
      if (event.key === 'Escape') { event.preventDefault(); reset(); return; }
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        if (event.repeat || held) return;
        keyboard = true; start(); advance(amount, 0, 0, true); peak = Math.max(peak, amount.value);
      } else if (held && keyboard && options.current.draggable && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        event.preventDefault();
        const step = event.shiftKey ? 30 : 12;
        const limit = Math.max(0, finite(options.current.dragRadius, 180));
        posX.target = clamp(posX.target + (event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0), -Math.min(limit, viewportWidth / 3), Math.min(limit, viewportWidth / 3));
        posY.target = clamp(posY.target + (event.key === 'ArrowUp' ? step : event.key === 'ArrowDown' ? -step : 0), -Math.min(limit, viewportHeight / 3), Math.min(limit, viewportHeight / 3));
        wake();
      }
    }
    function keyUp(event) { if (keyboard && (event.key === ' ' || event.key === 'Enter')) { event.preventDefault(); finish(true); } }
    function visibility() { lastTime = 0; if (document.hidden) cancel(); else wake(); }
    function motionChange() { reduceMotion = media.matches; if (reduceMotion) tiltX.target = tiltY.target = 0; wake(); }
    function loseContext(event) {
      event.preventDefault(); contextLost = true; cancel(); hit.disabled = true; setStatus('error');
      options.current.onError?.(new Error('The WebGL context was lost.'));
    }
    function restoreContext() { contextLost = false; if (ready) { setStatus('ready'); hit.disabled = options.current.disabled; wake(); } }
    hit.addEventListener('pointerdown', pointerDown);
    hit.addEventListener('pointermove', pointerMove);
    hit.addEventListener('pointerup', pointerUp);
    hit.addEventListener('pointercancel', pointerCancel);
    hit.addEventListener('lostpointercapture', pointerUp);
    hit.addEventListener('keydown', keyDown);
    hit.addEventListener('keyup', keyUp);
    hit.addEventListener('blur', blur);
    window.addEventListener('blur', cancel);
    document.addEventListener('visibilitychange', visibility);
    media.addEventListener('change', motionChange);
    canvas.addEventListener('webglcontextlost', loseContext);
    canvas.addEventListener('webglcontextrestored', restoreContext);
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    const intersectionObserver = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      lastTime = 0;
      if (!inView) cancel(); else wake();
    });
    intersectionObserver.observe(root);
    deform();
    resize();
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    function load(url) {
      return new Promise((resolve, reject) => {
        loader.load(url, texture => {
          if (disposed) { texture.dispose(); resolve(texture); return; }
          textures.add(texture);
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
          const image = texture.image;
          const imageAspect = image.width / image.height;
          const targetAspect = paperWidth / paperHeight;
          let rx = 1, ry = 1;
          if (imageFit === 'cover') {
            if (imageAspect > targetAspect) rx = targetAspect / imageAspect; else ry = imageAspect / targetAspect;
          } else {
            if (imageAspect > targetAspect) ry = imageAspect / targetAspect; else rx = targetAspect / imageAspect;
          }
          texture.repeat.set(rx, ry);
          texture.offset.set((1 - rx) / 2, (1 - ry) / 2);
          resolve(texture);
        }, undefined, () => reject(new Error(`Unable to load paper image: ${url}.`)));
      });
    }
    if (src) {
      Promise.all([load(src), backSrc ? load(backSrc) : Promise.resolve(null)])
        .then(([frontTexture, backTexture]) => {
          if (disposed) return;
          if (backTexture) { backTexture.repeat.x *= -1; backTexture.offset.x = 1 - backTexture.offset.x; }
          frontMaterial.map = frontTexture;
          backMaterial.map = backTexture || frontTexture;
          depthMaterial.map = frontTexture;
          frontMaterial.needsUpdate = backMaterial.needsUpdate = depthMaterial.needsUpdate = true;
          ready = true;
          setStatus('ready');
          hit.disabled = options.current.disabled;
          wake();
        })
        .catch(error => { if (disposed) return; setStatus('error'); options.current.onError?.(error); });
    } else {
      setStatus('error');
      options.current.onError?.(new Error('PaperCrumple requires an image src.'));
    }
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      if (pointerId !== null && hit.hasPointerCapture(pointerId)) hit.releasePointerCapture(pointerId);
      resetRef.current = cancelRef.current = null;
      observer.disconnect();
      intersectionObserver.disconnect();
      hit.removeEventListener('pointerdown', pointerDown);
      hit.removeEventListener('pointermove', pointerMove);
      hit.removeEventListener('pointerup', pointerUp);
      hit.removeEventListener('pointercancel', pointerCancel);
      hit.removeEventListener('lostpointercapture', pointerUp);
      hit.removeEventListener('keydown', keyDown);
      hit.removeEventListener('keyup', keyUp);
      hit.removeEventListener('blur', blur);
      window.removeEventListener('blur', cancel);
      document.removeEventListener('visibilitychange', visibility);
      media.removeEventListener('change', motionChange);
      canvas.removeEventListener('webglcontextlost', loseContext);
      canvas.removeEventListener('webglcontextrestored', restoreContext);
      geometry.dispose(); floorGeometry.dispose();
      frontMaterial.dispose(); backMaterial.dispose(); depthMaterial.dispose(); floorMaterial.dispose();
      grain.dispose();
      textures.forEach(t => t.dispose());
      light.shadow.dispose();
      renderer.dispose();
    };
  }, [src, backSrc, width, height, imageFit, foldCount, foldSharpness, wrinkleDepth, paperColor, roughness, paperTexture, lightIntensity, lightAngle, shadow, shadowOpacity, rotation, seed, detail]);

  useEffect(() => { resetRef.current?.(); }, [resetKey]);
  useEffect(() => { if (disabled) cancelRef.current?.(); }, [disabled]);

  const shadowFilter = shadow ? `drop-shadow(0 10px 22px rgb(0 0 0 / ${clamp(finite(shadowOpacity, 0.08), 0, 1)}))` : undefined;

  return (
    <div ref={rootRef} className={`relative isolate w-full overflow-hidden ${className}`} style={{ height: sceneHeight, background: 'transparent', ...style }} data-status={status}>
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 block h-full w-full" aria-hidden="true" style={{ visibility: status === 'ready' ? 'visible' : 'hidden', filter: shadowFilter, background: 'transparent' }} />
      {status !== 'ready' && (
        <img className="pointer-events-none absolute left-1/2 top-1/2 h-[var(--pc-image-height,72%)] w-[var(--pc-image-width,60%)] select-none" src={src || undefined} alt={alt} draggable={false} style={{ objectFit: imageFit, transform: `translate(-50%, -50%) rotate(${rotation}deg)`, filter: shadowFilter }} />
      )}
      <button ref={hitRef} type="button" className="peer absolute left-0 top-0 m-0 cursor-grab touch-none appearance-none select-none rounded-[2px] border-0 bg-transparent p-0 data-[held=true]:cursor-grabbing focus:outline-none disabled:cursor-default" disabled={disabled || status !== 'ready'} aria-label={`${alt}. Hold to crumple and drag.`} aria-pressed="false" style={{ visibility: status === 'ready' ? 'visible' : 'hidden' }} />
      <span className="sr-only" role="status">
        {status === 'loading' ? 'Loading interactive paper.' : status === 'error' ? 'Interactive paper unavailable. Showing the original image.' : ''}
      </span>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   BranchedMenu — single-open accordion + auto-sync + hover
   ═══════════════════════════════════════════════════════════ */
const PAD = 6;
const MARK = 16;
const renderIcon = icon => (isValidElement(icon) ? icon : <HugeiconsIcon icon={icon} size={16} strokeWidth={1.8} />);
const toSet = open => new Set(Array.isArray(open) ? open : open >= 0 ? [open] : []);

function BranchedMenu({
  items = [],
  defaultActive = '',
  onSelect,
  onHover,
  color = '#18181b',
  accentColor = '#18181b',
  lineColor = '#d4d4d8',
  width = 240,
  rowHeight = 36,
  indent = 40,
  trunk = 14,
  radius = 10,
  lineWidth = 1.5,
  fontSize = 14,
  drawDuration = 400,
  foldDuration = 300,
  className = ''
}) {
  // find which branch contains `defaultActive`, open it automatically
  const resolveOpen = (value) => {
    if (!value) return new Set();
    const idx = items.findIndex(it => it.children?.some(kid => kid.value === value));
    return idx >= 0 ? new Set([idx]) : new Set();
  };
  const [open, setOpen] = useState(() => resolveOpen(defaultActive));
  const [active, setActive] = useState(defaultActive || '');
  const navRef = useRef(null);
  const heads = useRef([]);
  const markerRef = useRef(null);
  const latest = useRef({});
  latest.current = { onSelect, onHover };

  // Auto-expand branch whenever active changes (from carousel or user)
  useEffect(() => {
    if (!defaultActive) return;
    setActive(defaultActive);
    const idx = items.findIndex(it => it.children?.some(kid => kid.value === defaultActive));
    if (idx >= 0) setOpen(new Set([idx]));
  }, [defaultActive, items]);

  const activeSection = items.findIndex(it => it.children?.some(kid => kid.value === active));
  const markerShown = activeSection >= 0 && open.has(activeSection);

  useIsoLayout(() => {
    const place = glide => {
      const m = markerRef.current;
      const el = heads.current[activeSection];
      if (!m) return;
      const on = markerShown && el;
      if (!glide) m.style.transition = 'none';
      if (on) m.style.top = `${el.offsetTop + (el.offsetHeight - MARK) / 2}px`;
      m.toggleAttribute('data-on', Boolean(on));
      if (!glide) { void m.offsetHeight; m.style.transition = ''; }
    };
    place(true);
    let first = true;
    const ro = new ResizeObserver(() => {
      if (first) { first = false; return; }
      place(false);
    });
    if (navRef.current) ro.observe(navRef.current);
    return () => ro.disconnect();
  }, [activeSection, markerShown, items, fontSize, rowHeight]);

  const select = (value, item) => {
    setActive(value);
    latest.current.onSelect?.(value, item);
  };
  const hover = (value, item) => {
    latest.current.onHover?.(value, item);
  };
  const toggle = i => {
    setOpen(prev => {
      const wasOpen = prev.has(i);
      return wasOpen ? new Set() : new Set([i]); // single-open
    });
  };

  const r = Math.min(radius, rowHeight / 2 - 2);
  const endX = indent - 8;
  const rowY = k => PAD + k * rowHeight + rowHeight / 2;
  const branch = k => `M ${trunk} ${rowY(k) - r} A ${r} ${r} 0 0 0 ${trunk + r} ${rowY(k)} H ${endX}`;
  const reach = k => `M ${trunk} 0 V ${rowY(k) - r} A ${r} ${r} 0 0 0 ${trunk + r} ${rowY(k)} H ${endX}`;
  const length = k => rowY(k) - r + (Math.PI * r) / 2 + (endX - trunk - r);

  return (
    <nav
      ref={navRef}
      className={`relative flex w-fit max-w-[min(var(--bm-w),100%)] flex-col pl-3.5 leading-[1.2] [color:var(--bm-ink)] [font-family:inherit] [font-size:var(--bm-font)] before:absolute before:top-2 before:bottom-0 before:left-0 before:w-0.5 before:rounded-[1px] before:[background:linear-gradient(to_bottom,var(--bm-line)_0%,var(--bm-line)_55%,transparent_100%)] before:content-['']${className ? ` ${className}` : ''}`}
      style={{
        '--bm-w': `${width}px`,
        '--bm-ink': color,
        '--bm-accent': accentColor,
        '--bm-line': lineColor,
        '--bm-font': `${fontSize}px`,
        '--bm-row': `${rowHeight}px`,
        '--bm-indent': `${indent}px`,
        '--bm-line-w': lineWidth,
        '--bm-draw': `${drawDuration}ms`,
        '--bm-muted': `color-mix(in srgb, ${color} 55%, transparent)`,
        '--bm-fold': `${foldDuration}ms`
      }}
    >
      <span ref={markerRef} className="absolute -top-px left-0 z-[1] h-4 w-0.5 rounded-[1px] opacity-0 [background:var(--bm-accent)] [transition:top_300ms_cubic-bezier(0.23,1,0.32,1),opacity_200ms_ease] data-[on]:opacity-100 motion-reduce:[transition:opacity_200ms_ease]" aria-hidden="true" />
      {items.map((item, i) => {
        const kids = item.children;
        const isOpen = kids ? open.has(i) : false;
        const leafValue = item.value ?? item.label;
        const leafActive = !kids && leafValue === active;
        const bodyH = kids ? PAD * 2 + kids.length * rowHeight : 0;
        return (
          <div key={item.value ?? item.label} className="group/section flex flex-col" data-open={isOpen ? '' : undefined}>
            <button
              ref={el => { heads.current[i] = el; }}
              type="button"
              className="m-0 block cursor-pointer border-0 bg-transparent py-[9px] text-left font-medium outline-none [color:var(--bm-muted)] [font-family:inherit] [font-size:calc(var(--bm-font)+1px)] [-webkit-tap-highlight-color:transparent] [transition:color_220ms_ease] group-data-[open]/section:[color:var(--bm-ink)] data-[active]:[color:var(--bm-ink)] hover:[color:var(--bm-ink)]"
              aria-expanded={kids ? isOpen : undefined}
              aria-current={leafActive ? 'true' : undefined}
              data-active={leafActive ? '' : undefined}
              onClick={() => (kids ? toggle(i) : select(leafValue, item))}
            >
              {item.label}
            </button>
            {kids ? (
              <div className="grid [grid-template-rows:0fr] [transition:grid-template-rows_var(--bm-fold)_cubic-bezier(0.23,1,0.32,1)] group-data-[open]/section:[grid-template-rows:1fr] motion-reduce:transition-none">
                <div className="min-h-0 overflow-hidden">
                  <div className="relative box-border py-1.5" style={{ height: bodyH }}>
                    <svg className="pointer-events-none absolute top-0 left-0 overflow-visible opacity-0 [transition:opacity_200ms_ease] group-data-[open]/section:opacity-100 group-data-[open]/section:[transition:opacity_250ms_ease_100ms]" width={indent} height={bodyH} aria-hidden="true">
                      <path className="fill-none [stroke:var(--bm-line)] [stroke-width:var(--bm-line-w)] [stroke-linecap:round] [stroke-linejoin:round]" d={`M ${trunk} 0 V ${rowY(kids.length - 1) - r}`} />
                      {kids.map((kid, k) => (
                        <path key={kid.value} className="fill-none [stroke:var(--bm-line)] [stroke-width:var(--bm-line-w)] [stroke-linecap:round] [stroke-linejoin:round]" d={branch(k)} />
                      ))}
                      {kids.map((kid, k) => (
                        <path key={kid.value} className="fill-none [stroke:var(--bm-accent)] [stroke-width:var(--bm-line-w)] [stroke-linecap:round] [stroke-linejoin:round] [transition:stroke-dashoffset_var(--bm-draw)_cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none" d={reach(k)} style={{ strokeDasharray: length(k), strokeDashoffset: kid.value === active ? 0 : length(k) }} />
                      ))}
                    </svg>
                    {kids.map(kid => (
                      <button
                        key={kid.value}
                        type="button"
                        className="m-0 box-border flex w-full cursor-pointer items-center gap-2 border-0 bg-transparent py-0 pr-0 text-left outline-none [height:var(--bm-row)] [padding-left:var(--bm-indent)] [color:var(--bm-muted)] [font-family:inherit] [-webkit-tap-highlight-color:transparent] [transition:color_200ms_ease] hover:[color:var(--bm-ink)] data-[active]:font-medium data-[active]:[color:var(--bm-accent)]"
                        aria-current={kid.value === active ? 'true' : undefined}
                        data-active={kid.value === active ? '' : undefined}
                        tabIndex={isOpen ? 0 : -1}
                        onMouseEnter={() => hover(kid.value, kid)}
                        onFocus={() => hover(kid.value, kid)}
                        onClick={() => select(kid.value, kid)}
                      >
                        {kid.icon ? <span className="inline-flex flex-none" aria-hidden="true">{renderIcon(kid.icon)}</span> : null}
                        <span className="whitespace-nowrap">{kid.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════
   Data
   ═══════════════════════════════════════════════════════════ */
const SUMMARY =
  'Final-year Computer Science student at GM Institute of Technology and freelance full-stack developer. I specialize in building scalable, user-centric web and Web3 applications using the MERN stack, Java, and blockchain technologies — with a growing focus on Agentic AI and GenAI: LangChain, LangGraph, RAG, Guardrails, and Evals. An aspiring AI Engineer, campus tech leader, and first-principles builder driven by continuous learning.';

const EDUCATION = [
  { school: 'G M Institute of Technology', location: 'Davanagere', detail: 'Bachelor of Engineering — Computer Science', score: '8.3', scoreUnit: 'CGPA / 10', date: 'Expected June 2027' },
  { school: 'RTES PU College', location: 'Ranebennur', detail: 'Pre-University — Science', score: '92', scoreUnit: '% Score', date: 'March 2023' },
  { school: 'Government High School', location: 'Hulikatti', detail: 'Secondary School Certificate (SSLC)', score: '98', scoreUnit: '% Score', date: 'July 2021' },
];

const EXPERIENCE = [
  { role: 'Software Developer', org: 'GMIT CSE Department', when: 'Jan 2026 – Present', stack: 'MERN · Gemini API · Database Design', bullets: ['Developed departmental academic platforms serving 500+ users, reducing administrative overhead by 60% through Gemini API automation.'] },
  { role: 'Freelance Full-Stack Developer', org: 'Independent', when: 'Jan 2026 – Present', stack: 'React.js · Node.js · MongoDB · Express.js · REST APIs', bullets: ['Deployed 5+ full-stack web applications featuring secure authentication and optimized database queries.'] },
  { role: 'Lead Organizer & Platform Developer', org: 'Interconnect 26.0', when: 'April 2026', stack: 'MERN · Event Management · Deployment', bullets: ['Built and deployed the official GSoC-style platform supporting 200+ concurrent users with 100% uptime.'] },
];

const PROJECTS = [
  { name: 'PDMS', tagline: 'AI-Integrated Curriculum Management', when: 'Jan 2026 – Present', stack: 'MERN · Gemini API · Python', bullets: ['AI-integrated curriculum system with Gemini API, Python PDF parsing, schema-based processing, and version control.'], tag: 'AI' },
  { name: 'GMU-CSE Community', tagline: 'Department Platform', when: '2025', stack: 'MERN · Context API · Cloudinary', bullets: ['Institutional platform with admin dashboard consolidating faculty directories, placements, and alumni networks.'], tag: 'Platform' },
  { name: 'TejasDairy', tagline: 'Dairy Management System', when: 'April 2026', stack: 'MERN · Tailwind CSS', bullets: ['Full-stack dairy management with real-time inventory tracking and automated billing cycles.'], tag: 'Freelance' },
  { name: 'Influancaa', tagline: 'AI Influencer–Brand Matchmaking', when: '2025', stack: 'MERN · JWT · Razorpay Escrow', bullets: ['AI-powered matchmaking, campaign management, social tracking, and secure escrow payments.'], tag: 'Web3' },
];

const ACHIEVEMENTS = [
  { rank: '01', name: 'JEE Main 2023', detail: 'NTA 76.06 · AIR 94,007' },
  { rank: '02', name: 'InterConnect 26.0', detail: 'Tech Lead & Organizer' },
  { rank: '03', name: 'NATA 2023', detail: 'Score 94 · State Rank 311' },
  { rank: '04', name: 'NMMS 2018', detail: 'Top 4.26% statewide' },
];

/* ═══════════════════════════════════════════════════════════
   Sidebar tree — one section per slide
   ═══════════════════════════════════════════════════════════ */
const MENU_ITEMS = [
  { label: 'About', children: [{ value: 'hero', label: 'Introduction', icon: File01Icon }] },
  { label: 'Education', children: EDUCATION.map((ed, i) => ({ value: `edu-${i}`, label: ed.school, icon: BookOpen01Icon })) },
  { label: 'Experience', children: EXPERIENCE.map((e, i) => ({ value: `exp-${i}`, label: e.role, icon: Briefcase01Icon })) },
  { label: 'Projects', children: PROJECTS.map((p, i) => ({ value: `proj-${i}`, label: p.name, icon: Layers01Icon })) },
  { label: 'Achievements', children: ACHIEVEMENTS.map((a, i) => ({ value: `ach-${i}`, label: a.name, icon: Award01Icon })) },
  { label: 'Resume', children: [{ value: 'resume', label: 'The Paper', icon: Download04Icon }] },
];

const SLIDES = [
  { id: 'hero', kind: 'hero', label: 'Introduction' },
  ...EDUCATION.map((ed, i) => ({ id: `edu-${i}`, kind: 'edu', index: i, label: `Education ${i + 1}` })),
  ...EXPERIENCE.map((e, i) => ({ id: `exp-${i}`, kind: 'exp', index: i, label: e.role })),
  ...PROJECTS.map((p, i) => ({ id: `proj-${i}`, kind: 'proj', index: i, label: p.name })),
  ...ACHIEVEMENTS.map((a, i) => ({ id: `ach-${i}`, kind: 'ach', index: i, label: a.name })),
  { id: 'resume', kind: 'resume', label: 'Resume' },
];

const SLIDE_INDEX = Object.fromEntries(SLIDES.map((s, i) => [s.id, i]));

/* ═══════════════════════════════════════════════════════════
   Small atoms
   ═══════════════════════════════════════════════════════════ */
const Kicker = ({ children }) => (
  <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-500">{children}</span>
);

/* ═══════════════════════════════════════════════════════════
   Main
   ═══════════════════════════════════════════════════════════ */
const Me = () => {
  const [currentId, setCurrentId] = useState('hero');
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const currentIdx = SLIDE_INDEX[currentId] ?? 0;
  const lastInteractionRef = useRef(0);
  const hoverTimer = useRef(null);
  const wheelLock = useRef(0);
  const touchStart = useRef(null);
  const rafRef = useRef(0);

  const goTo = (id) => {
    if (id in SLIDE_INDEX && id !== currentId) {
      lastInteractionRef.current = performance.now();
      setCurrentId(id);
    }
  };
  const next = () => goTo(SLIDES[(currentIdx + 1) % SLIDES.length].id);
  const prev = () => goTo(SLIDES[(currentIdx - 1 + SLIDES.length) % SLIDES.length].id);

  const handleHover = (value) => {
    if (!(value in SLIDE_INDEX)) return;
    lastInteractionRef.current = performance.now();
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      if (value !== currentId) { lastInteractionRef.current = performance.now(); setCurrentId(value); }
    }, 200);
  };
  const handleSelect = (value) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    goTo(value);
  };

  // AUTOPLAY loop — pauses when: user hovers tree, on resume slide, paused, or recent interaction
  useEffect(() => {
    const isResume = currentId === 'resume';
    if (paused || isResume) { setProgress(0); return; }
    let raf;
    let startTime = performance.now();
    const loop = (now) => {
      const since = now - lastInteractionRef.current;
      if (since < USER_HOLD_MS) {
        setProgress(0);
        startTime = now;
        raf = requestAnimationFrame(loop);
        return;
      }
      const elapsed = now - startTime;
      const p = clamp(elapsed / AUTOPLAY_MS, 0, 1);
      setProgress(p);
      if (p >= 1) {
        startTime = now;
        setProgress(0);
        next();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [currentId, paused]);

  // wheel / keys / swipe
  useEffect(() => {
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < 12) return;
      const now = performance.now();
      if (now - wheelLock.current < 900) return;
      wheelLock.current = now;
      e.deltaY > 0 ? next() : prev();
    };
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); prev(); }
      else if (e.key === ' ') { e.preventDefault(); setPaused(p => !p); }
    };
    const onTouchStart = (e) => { touchStart.current = e.touches[0].clientY; };
    const onTouchEnd = (e) => {
      if (touchStart.current == null) return;
      const dy = e.changedTouches[0].clientY - touchStart.current;
      if (Math.abs(dy) > 60) dy < 0 ? next() : prev();
      touchStart.current = null;
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [currentIdx]);

  const isResume = currentId === 'resume';

  return (
    <section id="me" className="relative w-full h-[100dvh] bg-[#fafafa] text-zinc-900 overflow-hidden">
      {/* Top hairline progress bar */}
      <div className="absolute top-0 left-0 right-0 h-px bg-zinc-200 z-30">
        <div
          className="h-full bg-zinc-900 origin-left"
          style={{ transform: `scaleX(${progress})`, transition: 'transform 60ms linear' }}
        />
      </div>

      {/* Fixed sidebar tree */}
      <aside className="absolute left-0 top-0 h-full hidden lg:flex flex-col justify-center pl-8 xl:pl-14 z-20 pointer-events-auto">
        <div className="mb-5 flex items-center justify-between" style={{ width: 260 }}>
          <Kicker>Index</Kicker>
          <button
            type="button"
            onClick={() => setPaused(p => !p)}
            aria-label={paused ? 'Play' : 'Pause'}
            className="grid h-6 w-6 place-items-center rounded-full border border-zinc-300 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 transition-colors"
          >
            <HugeiconsIcon icon={paused ? PlayIcon : PauseIcon} size={10} strokeWidth={2.2} />
          </button>
        </div>
        <BranchedMenu
          items={MENU_ITEMS}
          defaultActive={currentId}
          onSelect={handleSelect}
          onHover={handleHover}
          color="#18181b"
          accentColor="#18181b"
          lineColor="#d4d4d8"
          width={260}
          rowHeight={34}
          indent={38}
          trunk={12}
          radius={9}
          lineWidth={1.4}
          fontSize={13.5}
        />
      </aside>

      {/* Slide viewport */}
      <div className="relative h-full w-full lg:pl-[360px] xl:pl-[400px] pr-10 sm:pr-14 lg:pr-20">
        <div className="relative h-full w-full">
          {SLIDES.map((slide, i) => {
            const active = i === currentIdx;
            return (
              <div
                key={slide.id}
                id={slide.id}
                aria-hidden={!active}
                className="absolute inset-0 flex items-center"
                style={{
                  opacity: active ? 1 : 0,
                  transform: active ? 'translateY(0)' : 'translateY(12px)',
                  pointerEvents: active ? 'auto' : 'none',
                  transition: `opacity 700ms ${EASE}, transform 900ms ${EASE}`,
                  willChange: 'opacity, transform',
                }}
              >
                <SlideRenderer slide={slide} active={active} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Right progress / arrows */}
      <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous"
          className="grid h-9 w-9 place-items-center rounded-full border border-zinc-300 text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 transition-colors"
        >
          <HugeiconsIcon icon={ArrowUp01Icon} size={14} strokeWidth={2} />
        </button>
        <div className="flex flex-col items-center gap-1.5 py-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(s.id)}
              aria-label={`Go to ${s.label}`}
              className={`rounded-full transition-all duration-300 ${i === currentIdx ? 'h-5 w-1 bg-zinc-900' : 'h-1 w-1 bg-zinc-300 hover:bg-zinc-500'}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Next"
          className="grid h-9 w-9 place-items-center rounded-full border border-zinc-300 text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 transition-colors"
        >
          <HugeiconsIcon icon={ArrowDown01Icon} size={14} strokeWidth={2} />
        </button>
      </div>

      {/* Slide counter with label */}
      <div className="absolute right-4 sm:right-6 bottom-5 z-20 flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-zinc-500 tabular-nums">
        <span>{String(currentIdx + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}</span>
        <span className="h-3 w-px bg-zinc-300" />
        <span className="uppercase">{SLIDES[currentIdx].label}</span>
      </div>

      {/* Mobile hint */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-5 lg:hidden z-20 font-mono text-[10.5px] uppercase tracking-[0.24em] text-zinc-400">
        swipe · ↑↓
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════
   Slide renderer
   ═══════════════════════════════════════════════════════════ */
function SlideRenderer({ slide }) {
  if (slide.kind === 'hero') return <HeroSlide />;
  if (slide.kind === 'edu') return <EduSlide item={EDUCATION[slide.index]} index={slide.index} />;
  if (slide.kind === 'exp') return <ExpSlide item={EXPERIENCE[slide.index]} index={slide.index} />;
  if (slide.kind === 'proj') return <ProjSlide item={PROJECTS[slide.index]} index={slide.index} />;
  if (slide.kind === 'ach') return <AchSlide item={ACHIEVEMENTS[slide.index]} />;
  if (slide.kind === 'resume') return <ResumeSlide />;
  return null;
}

/* ── Hero ── */
function HeroSlide() {
  return (
    <div className="w-full max-w-[860px] mx-auto text-center flex flex-col items-center">
      <div className="flex items-center gap-3 mb-6 justify-center">
        <div className="h-px w-10 bg-zinc-900" />
        <Kicker>Behind the Code</Kicker>
        <div className="h-px w-10 bg-zinc-900" />
      </div>
      <h1 className="font-secondary font-light text-[64px] sm:text-[104px] md:text-[128px] leading-[0.85] tracking-[-0.035em] text-zinc-900">
        The Architect<span className="text-zinc-400">.</span>
      </h1>
      <p className="mt-8 max-w-[640px] text-[15px] sm:text-[17px] leading-[1.7] text-zinc-600">
        {SUMMARY}
      </p>
    </div>
  );
}

/* ── Education ── */
function EduSlide({ item, index }) {
  return (
    <div className="w-full max-w-[820px] mx-auto text-center flex flex-col items-center">
      <Kicker>Education · {String(index + 1).padStart(2, '0')}</Kicker>
      <h2 className="mt-4 text-[36px] sm:text-[52px] font-light leading-[1.05] tracking-[-0.02em] text-zinc-900">
        {item.school}
      </h2>
      <p className="mt-2 text-[14px] sm:text-[15px] text-zinc-500">{item.location}</p>
      <p className="mt-5 text-[16px] sm:text-[18px] text-zinc-700">{item.detail}</p>
      <div className="mt-12 flex items-baseline justify-center gap-3">
        <span className="text-[64px] sm:text-[88px] font-light tabular-nums leading-none text-zinc-900">{item.score}</span>
        <span className="font-mono text-[11.5px] uppercase tracking-[0.22em] text-zinc-500">{item.scoreUnit}</span>
      </div>
      <p className="mt-6 font-mono text-[11.5px] uppercase tracking-[0.2em] text-zinc-400">{item.date}</p>
    </div>
  );
}

/* ── Experience ── */
function ExpSlide({ item, index }) {
  return (
    <div className="w-full max-w-[820px] mx-auto text-center flex flex-col items-center">
      <Kicker>Experience · {String(index + 1).padStart(2, '0')}</Kicker>
      <p className="mt-4 font-mono text-[11.5px] uppercase tracking-[0.2em] text-zinc-500">{item.when}</p>
      <h2 className="mt-3 text-[34px] sm:text-[52px] font-light leading-[1.05] tracking-[-0.02em] text-zinc-900">
        {item.role}
      </h2>
      <p className="mt-2 text-[15px] sm:text-[17px] text-zinc-500">@ {item.org}</p>
      <p className="mt-4 font-mono text-[11.5px] text-zinc-400">{item.stack}</p>
      <ul className="mt-10 flex flex-col gap-3 max-w-[620px] mx-auto text-left">
        {item.bullets.map(b => (
          <li key={b} className="relative pl-6 text-[14.5px] leading-[1.7] text-zinc-700">
            <span className="absolute left-0 top-[0.72em] h-px w-4 bg-zinc-400" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Project ── */
function ProjSlide({ item, index }) {
  return (
    <div className="w-full max-w-[820px] mx-auto text-center flex flex-col items-center">
      <div className="flex items-center gap-3 mb-5">
        <span className="inline-flex items-center rounded-full bg-zinc-900 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white">{item.tag}</span>
        <span className="font-mono text-[10.5px] text-zinc-400 uppercase tracking-[0.22em]">Project · {String(index + 1).padStart(2, '0')}</span>
      </div>
      <h2 className="text-[36px] sm:text-[56px] font-light leading-[1.02] tracking-[-0.02em] text-zinc-900">
        {item.name}
      </h2>
      <p className="mt-2 text-[16px] sm:text-[18px] text-zinc-500 italic">{item.tagline}</p>
      <p className="mt-4 font-mono text-[11.5px] text-zinc-400">{item.stack}</p>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">{item.when}</p>
      <ul className="mt-10 flex flex-col gap-3 max-w-[620px] mx-auto text-left">
        {item.bullets.map(b => (
          <li key={b} className="relative pl-6 text-[14.5px] leading-[1.7] text-zinc-700">
            <span className="absolute left-0 top-[0.72em] h-px w-4 bg-zinc-400" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Achievement ── */
function AchSlide({ item }) {
  return (
    <div className="w-full max-w-[820px] mx-auto text-center flex flex-col items-center">
      <div className="font-mono text-[88px] sm:text-[128px] leading-none tabular-nums text-zinc-300 select-none">{item.rank}</div>
      <Kicker>Achievement</Kicker>
      <h2 className="mt-3 text-[36px] sm:text-[56px] font-light leading-[1.05] tracking-[-0.02em] text-zinc-900">
        {item.name}
      </h2>
      <p className="mt-5 text-[16px] sm:text-[18px] text-zinc-600">{item.detail}</p>
    </div>
  );
}

/* ── Resume — big, premium, no card ── */
function ResumeSlide() {
  return (
    <div className="w-full h-full max-h-[100dvh] flex flex-col items-center justify-center py-6 relative">
      {/* Soft radial vignette behind paper */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 50% 55%, rgba(24,24,27,0.055) 0%, rgba(24,24,27,0.02) 40%, rgba(24,24,27,0) 70%)',
        }}
        aria-hidden="true"
      />
      <div className="relative text-center mb-4">
        <Kicker>Resume · The Paper</Kicker>
        <h2 className="mt-2 text-[28px] sm:text-[40px] font-light leading-[1.05] tracking-[-0.02em] text-zinc-900">
          Hold the paper<span className="text-zinc-400">.</span>
        </h2>
        <p className="mt-2 max-w-[480px] mx-auto text-[12.5px] leading-[1.55] text-zinc-500">
          Press, drag, and let it crumple. Release to smooth it back out.
        </p>
        <a
          href={RESUME_FILE}
          download
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-300 px-3.5 py-1.5 text-[11.5px] font-medium text-zinc-900 hover:border-zinc-900 transition-colors"
        >
          <HugeiconsIcon icon={Download04Icon} size={12} strokeWidth={2} />
          Download
        </a>
      </div>
      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center">
        <div className="w-full max-w-[780px]">
          <PaperCrumple
            src={RESUME_FILE}
            alt="Beereshkumar B C — Resume"
            width={420}
            height={560}
            sceneHeight={780}
            imageFit="contain"
            releaseBehavior="restore"
            crumpleAmount={0.82}
            crumpleDuration={0.55}
            releaseDuration={0.5}
            foldCount={8}
            foldSharpness={0.62}
            wrinkleDepth={0.6}
            paperColor="#f8f6f0"
            roughness={0.95}
            paperTexture={0.05}
            lightIntensity={1.9}
            lightAngle={-32}
            shadow
            shadowOpacity={0.11}
            draggable
            dragRotation={10}
            dragRadius={260}
            returnToOrigin
            rotation={0}
            seed={7}
            detail={80}
          />
        </div>
      </div>
    </div>
  );
}

export default Me;