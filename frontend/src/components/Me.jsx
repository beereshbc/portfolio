'use client';

/* ═══════════════════════════════════════════════════════════════════════
   Me.jsx — fully self-contained
   • MagicBento (inlined)  • Folder (inlined)  • inline SVG icons
   • The old "Collaboration" tile is now the interactive Resume Folder.
   Only React itself is imported — no framer-motion / lucide / hugeicons.
═══════════════════════════════════════════════════════════════════════ */
import React, {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/* Change this to your real resume file (PDF recommended) */
const RESUME_FILE = '/crft/crft1.jpg';

/* ═══════════════════════════════════════════════════════════════════════
   INLINE SVG ICONS
═══════════════════════════════════════════════════════════════════════ */
const Icon = ({ size = 16, strokeWidth = 1.8, children }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const GitBranchIcon = (p) => (
  <Icon {...p}>
    <circle cx="6" cy="5" r="2" />
    <circle cx="6" cy="19" r="2" />
    <circle cx="18" cy="8" r="2" />
    <path d="M6 7v10" />
    <path d="M18 10c0 4-6 4-11 8.3" />
  </Icon>
);
const TickIcon = (p) => (
  <Icon {...p}>
    <path d="M5 12.5 9.5 17 19 7.5" />
  </Icon>
);
const SparklesIcon = (p) => (
  <Icon {...p}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    <path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z" />
  </Icon>
);
const SlackIcon = (p) => (
  <Icon {...p}>
    <path d="M9 4 7 20M17 4l-2 16M4 9h16M3.5 15h16" />
  </Icon>
);
const GithubIcon = (p) => (
  <Icon {...p}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </Icon>
);
const FigmaIcon = (p) => (
  <Icon {...p}>
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
    <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
    <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
    <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
    <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
  </Icon>
);
const NotionIcon = (p) => (
  <Icon {...p}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M9 16V8l6 8V8" />
  </Icon>
);
const KeyIcon = (p) => (
  <Icon {...p}>
    <circle cx="8" cy="15" r="4" />
    <path d="m11 12 8-8M16 7l2 2M14 9l2 2" />
  </Icon>
);
const FingerPrintIcon = (p) => (
  <Icon {...p}>
    <path d="M12 11v3c0 2-.5 4-1.5 6" />
    <path d="M8 14c0-2.2 1.8-4 4-4s4 1.8 4 4c0 2-.3 3.5-1 5" />
    <path d="M5 12a7 7 0 0 1 14 0c0 2-.2 3.5-.6 5" />
    <path d="M9 20c.5-1 .8-2 1-3" />
  </Icon>
);
const DownloadIcon = (p) => (
  <Icon {...p}>
    <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />
  </Icon>
);

/* ═══════════════════════════════════════════════════════════════════════
   TEXT LOOP
═══════════════════════════════════════════════════════════════════════ */
const TextLoop = ({ text = 'Creative Developer ✦ Full Stack ✦ Web3 ✦', speed = 50, fontSize = 64, className = '' }) => {
  const [offset, setOffset] = useState(0);
  const textRef = useRef(null);
  useEffect(() => {
    let raf;
    let start;
    const duration = 20000 / (speed / 50);
    const textWidth = textRef.current?.scrollWidth / 2 || 1000;
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = ((ts - start) % duration) / duration;
      setOffset(-progress * textWidth);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [speed]);
  return (
    <div className={`relative overflow-hidden whitespace-nowrap ${className}`}>
      <div
        ref={textRef}
        className="inline-block w-full font-clash font-black "
        style={{ fontSize: `${fontSize}px`, transform: `translateX(${offset}px)`, color: '#0a0a0a' }}
      >
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="inline-block pr-8">{text}</span>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   MOBILE DETECTION
═══════════════════════════════════════════════════════════════════════ */
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

/* ═══════════════════════════════════════════════════════════════════════
   FOLDER (WebGL glass + spring physics)
═══════════════════════════════════════════════════════════════════════ */
const TAU = Math.PI * 2;
const STEP = 1 / 240;
const MAX_ITEMS = 6;
const FOLDER_DEFAULT_ITEMS = [{ title: 'Brand guidelines' }, { title: 'Launch plan' }, { title: 'Moodboard' }];

const PILE_TURN = [0.5, -1.1, 1.5, -0.7, 1.2, -1.6];
const BOOK_REST = [
  { x: 0.14, y: -0.004, r: 1.4 },
  { x: 0.115, y: 0.008, r: -1.1 },
  { x: 0.09, y: 0, r: 0.6 },
];
const BOOK_PEEK = [
  { x: 0.27, y: -0.016, r: 4.5 },
  { x: 0.2, y: 0.014, r: 1.2 },
  { x: 0.14, y: 0, r: -1.2 },
];
const FLAP_REST = [
  { x: 0.16, rise: 0, r: 3 },
  { x: -0.17, rise: 0.05, r: -3.5 },
  { x: 0, rise: 0.1, r: 0.5 },
  { x: 0.25, rise: 0.08, r: 5 },
  { x: -0.25, rise: 0.09, r: -5.5 },
  { x: 0.08, rise: 0.12, r: 1.5 },
];
const SPREAD_TURN = [4, -5, 3, -6, 5, -3];
const SPREAD_DROP = [0.03, -0.04, 0.05, -0.02, 0.04, -0.05];
const DROP_TURN = [-6, 4, -3, 7, -5, 3];
const BOOK_ANGLES = { open: -180, receive: -24, peek: -13, rest: 0 };
const FLAP_ANGLES = { open: -64, receive: -30, peek: -15, rest: 0 };
const LAYERS = { out: 50, drag: 80, focus: 90 };

const parseColor = (() => {
  let context = null;
  const cache = new Map();
  return (value) => {
    const key = String(value);
    if (cache.has(key)) return cache.get(key);
    let rgb = [61, 139, 255];
    if (typeof document !== 'undefined') {
      context ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true });
      if (context) {
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = '#3d8bff';
        context.fillStyle = key;
        context.fillRect(0, 0, 1, 1);
        rgb = Array.from(context.getImageData(0, 0, 1, 1).data.slice(0, 3));
      }
    }
    cache.set(key, rgb);
    return rgb;
  };
})();

const mixRgb = (rgb, target, amount) => rgb.map((c, i) => Math.round(c + (target[i] - c) * amount));
const rgbString = (rgb) => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
const luma = (rgb) => (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;

const multiply = (a, b) => {
  const out = new Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      out[col * 4 + row] =
        a[row] * b[col * 4] + a[4 + row] * b[col * 4 + 1] + a[8 + row] * b[col * 4 + 2] + a[12 + row] * b[col * 4 + 3];
    }
  }
  return out;
};

const chain = (...list) => list.reduce(multiply);
const move = (x, y, z = 0) => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
const stretch = (x, y) => [x, 0, 0, 0, 0, y, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

const turnX = (degrees) => {
  const r = (degrees * Math.PI) / 180;
  const c = Math.cos(r); const s = Math.sin(r);
  return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
};
const turnY = (degrees) => {
  const r = (degrees * Math.PI) / 180;
  const c = Math.cos(r); const s = Math.sin(r);
  return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
};
const turnZ = (degrees) => {
  const r = (degrees * Math.PI) / 180;
  const c = Math.cos(r); const s = Math.sin(r);
  return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
};

const toCss = (m) => `matrix3d(${m.map((v) => (Math.abs(v) < 1e-7 ? 0 : Number(v.toFixed(6)))).join(', ')})`;

const measureFolder = (book, scale, labelWidth, hasLabel, tabPosition) => {
  const w = (book ? 180 : 224) * scale;
  const h = (book ? 232 : 176) * scale;
  const tabH = 20 * scale;
  const r = 12 * scale;
  const shoulder = tabH * 0.75;
  const frontTop = book ? tabH : tabH + h * 0.3;
  const corners = book ? [0, r, r, 0] : [r, r, r, r];
  const maxTab = w - corners[0] - corners[1] - shoulder * 2 - 10 * scale;
  const tabW = clamp(hasLabel ? labelWidth + 14 * scale + shoulder : w * 0.34, Math.min(w * 0.3, maxTab), maxTab);
  const tabX =
    tabPosition === 'left'
      ? corners[0] + 5 * scale + shoulder
      : tabPosition === 'center'
        ? (w - tabW) / 2
        : w - corners[1] - 5 * scale - shoulder - tabW;
  const docW = book ? w * 0.8 : w * 0.54;
  return { book, scale, w, h, tabH, r, shoulder, corners, tabW, tabX, frontTop, frontH: tabH + h - frontTop, docW, docH: docW * (book ? 1.28 : 1.22) };
};

const backPath = (g) => {
  const { w, h, tabX, tabW, tabH, shoulder } = g;
  const [tl, tr, br, bl] = g.corners;
  const top = tabH;
  const bottom = tabH + h;
  return [
    `M 0 ${top + tl}`,
    `Q 0 ${top} ${tl} ${top}`,
    `L ${tabX - shoulder} ${top}`,
    `C ${tabX} ${top} ${tabX} 0 ${tabX + shoulder} 0`,
    `L ${tabX + tabW - shoulder} 0`,
    `C ${tabX + tabW} 0 ${tabX + tabW} ${top} ${tabX + tabW + shoulder} ${top}`,
    `L ${w - tr} ${top}`,
    `Q ${w} ${top} ${w} ${top + tr}`,
    `L ${w} ${bottom - br}`,
    `Q ${w} ${bottom} ${w - br} ${bottom}`,
    `L ${bl} ${bottom}`,
    `Q 0 ${bottom} 0 ${bottom - bl}`,
    'Z',
  ].join(' ');
};

const VERTEX = `#version 300 es
layout(location = 0) in vec2 aCorner;
uniform mat4 uModel;
uniform vec2 uSize;
uniform float uDepth;
uniform vec2 uOrigin;
uniform vec4 uView;
uniform float uBleed;
out vec2 vLocal;
out vec2 vUv;
void main() {
  vLocal = aCorner * (uSize + vec2(uBleed, 0.0)) - vec2(uBleed, 0.0);
  vUv = aCorner;
  vec4 q = uModel * vec4(vLocal, 0.0, 1.0);
  float w = 1.0 - q.z / uDepth;
  vec2 p = q.xy - uOrigin + (uOrigin - uView.xy) * w;
  vec2 clip = p / uView.zw * 2.0 - w;
  gl_Position = vec4(clip.x, -clip.y, 0.0, w);
}`;

const PAINT = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uImage;
uniform float uAlpha;
out vec4 outColor;
void main() {
  outColor = texture(uImage, vUv) * uAlpha;
}`;

const SCREEN = `#version 300 es
layout(location = 0) in vec2 aCorner;
out vec2 vUv;
void main() {
  vUv = aCorner;
  gl_Position = vec4(aCorner * 2.0 - 1.0, 0.0, 1.0);
}`;

const BLUR = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uImage;
uniform vec2 uStep;
uniform float uSigma;
out vec4 outColor;
void main() {
  float spacing = max(1.0, uSigma * 2.5 / 24.0);
  int reach = int(min(ceil(uSigma * 2.5 / spacing), 24.0));
  vec4 sum = texture(uImage, vUv);
  float total = 1.0;
  for (int i = 1; i <= 24; i++) {
    if (i > reach) break;
    float x = float(i) * spacing;
    float weight = exp(-0.5 * x * x / (uSigma * uSigma));
    sum += (texture(uImage, vUv + uStep * x) + texture(uImage, vUv - uStep * x)) * weight;
    total += 2.0 * weight;
  }
  outColor = sum / total;
}`;

const GLASS = `#version 300 es
precision highp float;
in vec2 vLocal;
uniform mat4 uModel;
uniform vec2 uSize;
uniform float uDepth;
uniform vec2 uOrigin;
uniform vec4 uView;
uniform sampler2D uBehind;
uniform vec4 uRadii;
uniform float uSpine;
uniform float uLens;
uniform float uMorph;
uniform vec3 uInsideTop;
uniform vec3 uInsideBottom;
uniform float uTabRatio;
uniform vec2 uGutter;
uniform float uBevel;
uniform float uStrength;
uniform float uSplit;
uniform vec4 uTint;
uniform float uHaze;
uniform float uDim;
uniform float uGlint;
uniform float uShine;
uniform vec2 uLight;
out vec4 outColor;

float box(vec2 p, vec2 b, vec4 r) {
  float k = p.x > 0.0 ? (p.y > 0.0 ? r.z : r.y) : (p.y > 0.0 ? r.w : r.x);
  vec2 q = abs(p) - b + k;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - k;
}
float shape(vec2 p) {
  vec2 halfSize = vec2(uSize.x + uSpine, uSize.y) * 0.5;
  return box(p - vec2(uSize.x - halfSize.x, halfSize.y), halfSize, uRadii);
}
vec2 locate(vec2 p) {
  vec4 q = uModel * vec4(p, 0.0, 1.0);
  float w = 1.0 - q.z / uDepth;
  vec2 s = uOrigin + (q.xy - uOrigin) / w;
  vec2 uv = (s - uView.xy) / uView.zw;
  return vec2(uv.x, 1.0 - uv.y);
}
void main() {
  float d = shape(vLocal);
  float aa = max(fwidth(d), 1e-3);
  float cover = clamp(0.5 - d / aa, 0.0, 1.0);
  if (cover <= 0.0) discard;
  float e = 0.5;
  vec2 n = vec2(
    shape(vLocal + vec2(e, 0.0)) - shape(vLocal - vec2(e, 0.0)),
    shape(vLocal + vec2(0.0, e)) - shape(vLocal - vec2(0.0, e))
  );
  n /= max(length(n), 1e-5);
  float inside = max(0.0, -d);
  float t = 1.0 - clamp(inside / uBevel, 0.0, 1.0);
  vec2 bend = -n * pow(t, 2.0) * uStrength + (uSize * 0.5 - vLocal) * uLens;
  vec2 p = vLocal + bend;
  vec2 uv = locate(p);
  mat2 jac = mat2(locate(p + vec2(1.0, 0.0)) - uv, locate(p + vec2(0.0, 1.0)) - uv);
  vec4 seen = texture(uBehind, uv);
  if (uSplit > 0.0) {
    vec2 split = jac * (bend * uSplit);
    seen.r = texture(uBehind, uv + split).r;
    seen.b = texture(uBehind, uv - split).b;
  }
  vec4 color = vec4(uTint.rgb, 1.0) * uTint.a + seen * (1.0 - uTint.a);
  color.rgb = mix(color.rgb, vec3(color.a), uHaze + uGlint);
  color.rgb *= 1.0 - uDim;
  float band = 0.0;
  if (uMorph > 0.0) {
    band = (1.0 - smoothstep(0.0, uSize.x * 0.75, vLocal.x)) * uMorph;
    vec3 solid = mix(uInsideTop, uInsideBottom, uTabRatio + vLocal.y / uSize.y * (1.0 - uTabRatio));
    color = mix(color, vec4(solid, 1.0), band);
  }
  if (uGutter.y > 0.0) color.rgb *= 1.0 - uGutter.y * (1.0 - smoothstep(0.0, uGutter.x, vLocal.x));
  float facing = dot(n, uLight);
  float edge = clamp(inside / aa, 0.0, 1.0);
  vec2 span = vLocal / uSize;
  float across = uLight.x > 0.0 ? 1.0 - span.x : span.x;
  float sheen = smoothstep(0.85, 0.0, across * 0.55 + span.y) * 0.07 * uShine * (1.0 - band);
  float light = (max(facing, 0.0) * 0.85 + max(-facing, 0.0) * 0.28) * t * t * t * uShine + sheen;
  light += exp(-inside / 0.9) * (0.16 + 0.3 * max(facing, 0.0)) * uShine;
  float shade = max(-facing, 0.0) * t * t * 0.22 * (1.0 - band);
  color = color * (1.0 - shade) + vec4(0.0, 0.0, 0.0, shade);
  light = clamp(light * edge * (1.0 - band), 0.0, 1.0);
  color = color * (1.0 - light) + vec4(light);
  outColor = color * cover;
}`;

const compileShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
};

const linkProgram = (gl, vertexSource, fragmentSource, names) => {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  const uniforms = {};
  names.forEach((name) => { uniforms[name] = gl.getUniformLocation(program, name); });
  return { program, uniforms };
};

const PLACED = ['uModel', 'uSize', 'uDepth', 'uOrigin', 'uView', 'uBleed'];

const createGlassRenderer = (canvas) => {
  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: true });
  if (!gl) return null;
  const paint = linkProgram(gl, VERTEX, PAINT, [...PLACED, 'uImage', 'uAlpha']);
  const blur = linkProgram(gl, SCREEN, BLUR, ['uImage', 'uStep', 'uSigma']);
  const glass = linkProgram(gl, VERTEX, GLASS, [
    ...PLACED, 'uBehind', 'uRadii', 'uSpine', 'uLens', 'uMorph', 'uInsideTop', 'uInsideBottom',
    'uTabRatio', 'uGutter', 'uBevel', 'uStrength', 'uSplit', 'uTint', 'uHaze', 'uDim', 'uGlint', 'uShine', 'uLight',
  ]);
  if (!paint || !blur || !glass) return null;

  const vao = gl.createVertexArray();
  const buffer = gl.createBuffer();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const makeTarget = () => ({ texture: gl.createTexture(), frame: gl.createFramebuffer() });
  const targets = [makeTarget(), makeTarget(), makeTarget()];
  const size = { width: 0, height: 0 };
  const textures = new Map();

  const placed = (program, scene) => {
    gl.uniform1f(program.uniforms.uDepth, scene.depth);
    gl.uniform2f(program.uniforms.uOrigin, scene.origin[0], scene.origin[1]);
    gl.uniform4f(program.uniforms.uView, scene.view.x, scene.view.y, scene.view.width, scene.view.height);
  };

  const resize = (width, height) => {
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    if (size.width === width && size.height === height) return;
    size.width = width; size.height = height;
    targets.forEach((target) => {
      gl.bindTexture(gl.TEXTURE_2D, target.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.frame);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target.texture, 0);
    });
  };

  const pass = (source, target, stepX, stepY, sigma) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.frame);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindTexture(gl.TEXTURE_2D, source.texture);
    gl.uniform2f(blur.uniforms.uStep, stepX, stepY);
    gl.uniform1f(blur.uniforms.uSigma, sigma);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  return {
    upload(key, source) {
      let texture = textures.get(key);
      if (!texture) { texture = gl.createTexture(); textures.set(key, texture); }
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    },
    prune(keys) {
      textures.forEach((texture, key) => { if (keys.has(key)) return; gl.deleteTexture(texture); textures.delete(key); });
    },
    render(scene) {
      if (gl.isContextLost()) return;
      const width = Math.max(1, Math.round(scene.view.width * scene.dpr));
      const height = Math.max(1, Math.round(scene.view.height * scene.dpr));
      resize(width, height);
      const [sharp, half, soft] = targets;
      gl.bindVertexArray(vao);
      gl.activeTexture(gl.TEXTURE0);
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.bindFramebuffer(gl.FRAMEBUFFER, sharp.frame);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(paint.program);
      placed(paint, scene);
      gl.uniform1i(paint.uniforms.uImage, 0);
      gl.uniform1f(paint.uniforms.uBleed, 0);
      scene.layers.forEach((layer) => {
        const texture = textures.get(layer.key);
        if (!texture) return;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniformMatrix4fv(paint.uniforms.uModel, false, layer.matrix);
        gl.uniform2f(paint.uniforms.uSize, layer.width, layer.height);
        gl.uniform1f(paint.uniforms.uAlpha, layer.alpha);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      });

      const pane = scene.glass;
      const sigma = pane.frost * scene.dpr;
      let behind = sharp;
      if (sigma > 0.35) {
        gl.disable(gl.BLEND);
        gl.useProgram(blur.program);
        gl.uniform1i(blur.uniforms.uImage, 0);
        pass(sharp, half, 1 / width, 0, sigma);
        pass(half, soft, 0, 1 / height, sigma);
        gl.enable(gl.BLEND);
        behind = soft;
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const u = glass.uniforms;
      gl.useProgram(glass.program);
      placed(glass, scene);
      gl.bindTexture(gl.TEXTURE_2D, behind.texture);
      gl.uniform1i(u.uBehind, 0);
      gl.uniformMatrix4fv(u.uModel, false, pane.matrix);
      gl.uniform2f(u.uSize, pane.width, pane.height);
      gl.uniform1f(u.uBleed, pane.bleed);
      gl.uniform4fv(u.uRadii, pane.radii);
      gl.uniform1f(u.uSpine, pane.spine);
      gl.uniform1f(u.uLens, pane.lens);
      gl.uniform1f(u.uMorph, pane.morph);
      gl.uniform3fv(u.uInsideTop, pane.insideTop);
      gl.uniform3fv(u.uInsideBottom, pane.insideBottom);
      gl.uniform1f(u.uTabRatio, pane.tabRatio);
      gl.uniform2fv(u.uGutter, pane.gutter);
      gl.uniform1f(u.uBevel, pane.bevel);
      gl.uniform1f(u.uStrength, pane.strength);
      gl.uniform1f(u.uSplit, pane.split);
      gl.uniform4fv(u.uTint, pane.tint);
      gl.uniform1f(u.uHaze, pane.haze);
      gl.uniform1f(u.uDim, pane.dim);
      gl.uniform1f(u.uGlint, pane.glint);
      gl.uniform1f(u.uShine, pane.shine);
      gl.uniform2fv(u.uLight, pane.light);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    dispose() {
      textures.forEach((texture) => gl.deleteTexture(texture));
      textures.clear();
      targets.forEach((target) => { gl.deleteTexture(target.texture); gl.deleteFramebuffer(target.frame); });
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(paint.program);
      gl.deleteProgram(blur.program);
      gl.deleteProgram(glass.program);
    },
  };
};

const roundedRect = (ctx, x, y, width, height, radius) => {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
};

const offsetWithin = (element, root) => {
  let x = 0; let y = 0; let node = element;
  while (node && node !== root) { x += node.offsetLeft; y += node.offsetTop; node = node.offsetParent; }
  return node === root ? [x, y] : null;
};

const isClear = (color) => !color || color === 'transparent' || /rgba?\([^)]*[,/]\s*0\s*\)$/.test(color);

const drawText = (ctx, element, x, y, width, style) => {
  const text = Array.from(element.childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
  if (!text) return;
  const size = parseFloat(style.fontSize) || 12;
  const lineHeight = parseFloat(style.lineHeight) || size * 1.2;
  const left = x + (parseFloat(style.paddingLeft) || 0);
  const top = y + (parseFloat(style.paddingTop) || 0);
  const room = width - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
  ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  ctx.fillStyle = style.color;
  ctx.textBaseline = 'middle';
  const fit = (line) => {
    if (ctx.measureText(line).width <= room) return line;
    let cut = line;
    while (cut.length > 1 && ctx.measureText(`${cut}…`).width > room) cut = cut.slice(0, -1);
    return `${cut.trimEnd()}…`;
  };
  if (style.whiteSpace === 'nowrap') { ctx.fillText(fit(text), left, top + lineHeight / 2); return; }
  let line = ''; let row = 0;
  text.split(/\s+/).forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > room) { ctx.fillText(line, left, top + lineHeight * (row + 0.5)); row += 1; line = word; }
    else { line = next; }
  });
  if (line) ctx.fillText(line, left, top + lineHeight * (row + 0.5));
};

const rasterize = (node, dpr, skipImages) => {
  const width = Math.max(1, node.offsetWidth);
  const height = Math.max(1, node.offsetHeight);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));
  const pending = [];
  const ctx = canvas.getContext('2d');
  if (!ctx) return { canvas, pending };
  ctx.scale(dpr, dpr);
  const paint = (element, x, y) => {
    const style = getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') return;
    const w = element.offsetWidth; const h = element.offsetHeight;
    const radius = parseFloat(style.borderTopLeftRadius) || 0;
    const opacity = element !== node && Number.isFinite(parseFloat(style.opacity)) ? parseFloat(style.opacity) : 1;
    ctx.save();
    ctx.globalAlpha *= opacity;
    if (!isClear(style.backgroundColor)) { ctx.fillStyle = style.backgroundColor; roundedRect(ctx, x, y, w, h, radius); ctx.fill(); }
    if (style.overflow !== 'visible') { roundedRect(ctx, x, y, w, h, radius); ctx.clip(); }
    if (element instanceof HTMLImageElement) {
      if (!element.complete || !element.naturalWidth) pending.push(element);
      else if (!skipImages) {
        const ratio = Math.max(w / element.naturalWidth, h / element.naturalHeight);
        const sw = w / ratio; const sh = h / ratio;
        ctx.drawImage(element, (element.naturalWidth - sw) / 2, (element.naturalHeight - sh) / 2, sw, sh, x, y, w, h);
      }
    } else {
      drawText(ctx, element, x, y, w, style);
      Array.from(element.children).forEach((child) => { const at = offsetWithin(child, node); if (at) paint(child, at[0], at[1]); });
    }
    ctx.restore();
  };
  paint(node, 0, 0);
  return { canvas, pending };
};

const paintBack = (g, top, bottom, dpr) => {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(g.w * dpr));
  canvas.height = Math.max(1, Math.round((g.tabH + g.h) * dpr));
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  ctx.scale(dpr, dpr);
  const fill = ctx.createLinearGradient(0, 0, 0, g.tabH + g.h);
  fill.addColorStop(0, top); fill.addColorStop(1, bottom);
  ctx.fillStyle = fill;
  ctx.fill(new Path2D(backPath(g)));
  return canvas;
};

const FOLDER_THEMES = {
  dark: { '--folder-ground': 'rgba(0, 0, 0, 0.42)', '--folder-ground-soft': 'rgba(0, 0, 0, 0.26)', '--folder-focus': '#ffffff' },
  light: { '--folder-ground': 'rgba(24, 22, 40, 0.16)', '--folder-ground-soft': 'rgba(24, 22, 40, 0.1)', '--folder-focus': '#18181b' },
};

const LAYER = 'absolute top-0 left-0 origin-top-left will-change-transform';
const FACE = 'absolute inset-0 overflow-hidden';
const TAB_TEXT = 'absolute top-0 box-border flex items-center justify-center overflow-hidden leading-none font-semibold text-ellipsis whitespace-nowrap';
const TAB_STYLE = { height: 'var(--folder-tab-h)', paddingTop: 'calc(1px * var(--folder-scale))', color: 'var(--folder-tab-ink)', fontSize: 'calc(10.5px * var(--folder-scale))', letterSpacing: '-0.005em' };
const RECT_SHADOW = '0 calc(1px * var(--folder-scale)) calc(2px * var(--folder-scale)) var(--folder-ground), 0 calc(10px * var(--folder-scale)) calc(28px * var(--folder-scale)) var(--folder-ground-soft)';
const PAPER_SHADOW = '0 0 0 0.5px rgba(0, 0, 0, 0.06), 0 calc(1px * var(--folder-scale)) calc(2px * var(--folder-scale)) rgba(0, 0, 0, 0.12), 0 calc((2px + var(--folder-lift, 0) * 16px) * var(--folder-scale)) calc((5px + var(--folder-lift, 0) * 26px) * var(--folder-scale)) rgba(0, 0, 0, calc(0.1 + var(--folder-lift, 0) * 0.14))';
const FACE_LIGHT = 'linear-gradient(rgba(255, 255, 255, var(--folder-glint, 0)), rgba(255, 255, 255, var(--folder-glint, 0))), rgba(0, 0, 0, var(--folder-dim, 0))';
const GUTTER = 'linear-gradient(90deg, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0))';
const INSIDE_FILL = 'linear-gradient(180deg, var(--folder-inside-top), var(--folder-inside-bottom))';
const GLASS_FACE = {
  background: 'linear-gradient(160deg, rgba(255, 255, 255, 0.34) 0%, rgba(255, 255, 255, 0.08) 46%, rgba(255, 255, 255, 0.16) 100%), rgba(var(--folder-rgb), 0.24)',
  boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
  WebkitBackdropFilter: 'blur(var(--folder-frost)) saturate(1.8)',
  backdropFilter: 'blur(var(--folder-frost)) saturate(1.8)',
};
const SKINS = {
  solid: {
    back: INSIDE_FILL,
    outer: { background: 'linear-gradient(160deg, var(--folder-front-top) 0%, var(--folder-base) 48%, var(--folder-front-bottom) 100%)', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.28), inset 0 0 0 1px rgba(255, 255, 255, 0.05)' },
    inner: { background: INSIDE_FILL },
  },
  glass: { back: INSIDE_FILL, outer: GLASS_FACE, inner: GLASS_FACE },
  matte: { back: 'var(--folder-inside-bottom)', outer: { background: 'var(--folder-base)' }, inner: { background: 'var(--folder-inside-bottom)' } },
};

const DOC_STYLE = { gap: 'calc(6px * var(--folder-scale))', padding: 'calc(14px * var(--folder-scale)) calc(13px * var(--folder-scale))' };
const DOC_TITLE_STYLE = { marginBottom: 'calc(4px * var(--folder-scale))', color: 'var(--folder-paper-text)', fontSize: 'calc(11px * var(--folder-scale))', letterSpacing: '-0.01em' };
const DOC_TEXT_STYLE = { marginTop: 'calc(-6px * var(--folder-scale))', marginBottom: 'calc(4px * var(--folder-scale))', color: 'var(--folder-paper-ink-strong)', fontSize: 'calc(9px * var(--folder-scale))' };
const DOC_HEADING_STYLE = { height: 'calc(7px * var(--folder-scale))', marginBottom: 'calc(4px * var(--folder-scale))', background: 'var(--folder-paper-ink-strong)' };
const DOC_LINE_STYLE = { height: 'calc(4px * var(--folder-scale))', background: 'var(--folder-paper-ink)' };
const DOC_BLOCK_STYLE = { height: 'calc(40px * var(--folder-scale))', margin: 'calc(3px * var(--folder-scale)) 0', borderRadius: 'calc(5px * var(--folder-scale))', background: 'var(--folder-paper-ink)' };
const PHOTO_STYLE = { inset: 'calc(5px * var(--folder-scale))', borderRadius: 'calc(3px * var(--folder-scale))' };

const DocumentCard = ({ title, description }) => (
  <div className="box-border flex h-full flex-col" style={DOC_STYLE}>
    {title ? <span className="overflow-hidden leading-[1.2] font-semibold text-ellipsis whitespace-nowrap" style={DOC_TITLE_STYLE}>{title}</span> : <span className="w-[56%] flex-none rounded-full" style={DOC_HEADING_STYLE} />}
    {description && <span className="leading-[1.3]" style={DOC_TEXT_STYLE}>{description}</span>}
    <span className="flex-none rounded-full" style={{ ...DOC_LINE_STYLE, width: '92%' }} />
    <span className="flex-none rounded-full" style={{ ...DOC_LINE_STYLE, width: '84%' }} />
    <span className="flex-none rounded-full" style={{ ...DOC_LINE_STYLE, width: '88%' }} />
    <span className="flex-none opacity-75" style={DOC_BLOCK_STYLE} />
    <span className="flex-none rounded-full" style={{ ...DOC_LINE_STYLE, width: '80%' }} />
    <span className="flex-none rounded-full" style={{ ...DOC_LINE_STYLE, width: '62%' }} />
  </div>
);

const renderFolderItem = (item) => {
  if (isValidElement(item)) return item;
  if (typeof item === 'string' || typeof item === 'number') return <DocumentCard title={String(item)} />;
  if (item && typeof item === 'object') {
    if (item.image) {
      return (
        <div className="absolute overflow-hidden" style={PHOTO_STYLE}>
          <img src={item.image} alt={item.alt ?? item.title ?? ''} draggable={false} className="pointer-events-none block h-full w-full object-cover [-webkit-user-drag:none]" />
        </div>
      );
    }
    if (item.content) return item.content;
    return <DocumentCard title={item.title} description={item.description} />;
  }
  return <DocumentCard />;
};

const placeBook = (rank, count, phase, layout, g) => {
  const pileX = g.w / 2;
  const pileY = g.frontTop + g.frontH / 2;
  if (phase === 'open') {
    if (layout === 'row') {
      const gap = 10 * g.scale;
      const fit = Math.min(0.8, (g.w * 1.86 - gap * (count - 1)) / (count * g.docW));
      const step = g.docW * fit + gap;
      return { x: g.w / 2 + (rank - (count - 1) / 2) * step, y: pileY, z: 0, r: 0, ry: 0, s: fit };
    }
    if (layout === 'stack') {
      const fit = 0.74;
      const strip = Math.min(26 * g.scale, (g.h * 0.36) / Math.max(1, count - 1));
      const top = g.frontTop + 14 * g.scale + (count - 1) * strip;
      return { x: g.w, y: top + (g.docH * fit) / 2 - rank * strip, z: 0, r: 0, ry: 0, s: fit };
    }
    const fit = count > 4 ? 0.58 : count > 3 ? 0.64 : 0.72;
    const span = count === 2 ? g.w : Math.min(g.w * 1.3, g.w * 0.6 * (count - 1));
    const x = count > 1 ? span / 2 - (rank * span) / (count - 1) : g.w * 0.5;
    return { x: g.w / 2 + x, y: pileY + SPREAD_DROP[rank] * g.h, z: 0, r: SPREAD_TURN[rank], ry: 0, s: fit };
  }
  const offsets = phase === 'rest' ? BOOK_REST : BOOK_PEEK;
  const offset = offsets[rank] ?? { x: 0.06, y: 0, r: PILE_TURN[rank] ?? 0 };
  return { x: pileX + offset.x * g.w, y: pileY + offset.y * g.h + rank * 0.8 * g.scale, z: 0, r: offset.r, ry: 0, s: 1 };
};

const placeFlap = (rank, count, phase, layout, g, pointer) => {
  const rest = FLAP_REST[rank] ?? FLAP_REST[FLAP_REST.length - 1];
  const floor = g.tabH + g.h - 5 * g.scale - g.docH / 2;
  const mid = (count - 1) / 2;
  if (phase === 'open') {
    const lift = g.tabH - g.h * 0.02;
    if (layout === 'stack') {
      const strip = Math.min(30 * g.scale, (g.h * 0.62) / Math.max(1, count - 1));
      const fit = 1.04 - rank * 0.05;
      return { x: g.w / 2, y: g.tabH + g.h * 0.1 - rank * strip - (g.docH * (1.04 - fit)) / 2, z: -rank * 18 * g.scale, r: 0, ry: 0, s: fit };
    }
    const gap = 12 * g.scale;
    const fit = Math.min(0.94, (g.w * 2.3 - gap * (count - 1)) / (count * g.docW));
    const step = g.docW * fit + gap;
    const tidy = layout === 'row';
    return { x: g.w / 2 + (rank - mid) * step, y: lift + (tidy ? 0 : SPREAD_DROP[rank] * g.h * 0.7), z: 0, r: tidy ? 0 : SPREAD_TURN[rank] * 0.55, ry: 0, s: fit };
  }
  const part = phase === 'receive' ? 1.7 : phase === 'peek' ? 1.3 : 1;
  const x = g.w / 2 + rest.x * g.w * part;
  if (phase === 'rest') return { x, y: floor - rest.rise * g.h, z: 0, r: rest.r, ry: 0, s: 1 };
  const near = phase === 'peek' && pointer != null ? Math.max(0, 1 - Math.abs(pointer - x) / (g.w * 0.32)) : 0;
  const rise = rest.rise + (phase === 'receive' ? 0.03 : 0.1);
  return { x, y: floor - rise * g.h - near * near * g.h * 0.09, z: 0, r: rest.r * 1.6, ry: 0, s: 1 };
};

const Folder = ({
  items, label, mode = 'flap', variant = 'solid', color = '#3d8bff', paperColor = '#ffffff',
  tabPosition = 'right', layout = 'spread', size = 1, openOn = 'click', open, defaultOpen = false,
  onOpenChange, onItemClick, onItemDrop, draggable = true, zoomOnClick = true, peek = true, intro = true,
  tilt = 0.5, bounce = 0.4, speed = 1, frost = 0.25, closeOnOutsideClick = true, theme = 'dark',
  className = '', style, children,
}) => {
  const rootRef = useRef(null);
  const backRef = useRef(null);
  const frontRef = useRef(null);
  const groundRef = useRef(null);
  const castRef = useRef(null);
  const shadeRef = useRef(null);
  const glassRef = useRef(null);
  const itemRefs = useRef([]);
  const measureRef = useRef(null);
  const engineRef = useRef(null);
  const rendererRef = useRef(null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [labelWidth, setLabelWidth] = useState(0);
  const [outside, setOutside] = useState([]);
  const [gpu, setGpu] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? Boolean(open) : internalOpen;
  const book = mode === 'book';
  const glass = variant === 'glass';

  const entries = useMemo(() => {
    const custom = Children.toArray(children).filter(isValidElement);
    const source = custom.length ? custom : items?.length ? items : FOLDER_DEFAULT_ITEMS;
    return source.slice(0, MAX_ITEMS);
  }, [children, items]);
  const count = entries.length;

  const scale = Math.max(0.3, Number(size) || 1);
  const g = measureFolder(book, scale, labelWidth, Boolean(label), tabPosition);
  const total = g.tabH + g.h;
  const view = book
    ? { x: -0.75 * g.w, y: -0.25 * total, width: 2.5 * g.w, height: 1.5 * total }
    : { x: -0.25 * g.w, y: -0.1 * total, width: 1.5 * g.w, height: 1.3 * total };

  useIsomorphicLayoutEffect(() => {
    const node = measureRef.current;
    if (!node) return undefined;
    let active = true;
    const measure = () => { if (active) setLabelWidth(node.offsetWidth); };
    measure();
    document.fonts?.ready.then(measure);
    return () => { active = false; };
  }, [label, scale]);

  const setOpen = useCallback((next) => {
    const value = typeof next === 'function' ? next(isOpen) : next;
    if (!isControlled) setInternalOpen(value);
    if (value !== isOpen) onOpenChange?.(value);
  }, [isControlled, isOpen, onOpenChange]);

  const setOpenRef = useRef(setOpen);
  setOpenRef.current = setOpen;

  const rgb = parseColor(color);
  const paper = parseColor(paperColor);
  const backTone = mixRgb(rgb, [0, 0, 0], 0.16);
  const insideTop = rgbString(mixRgb(rgb, [0, 0, 0], 0.08));
  const insideBottom = rgbString(backTone);

  const settingsRef = useRef(null);
  settingsRef.current = {
    open: isOpen, layout, openOn, peek, intro, draggable, zoomOnClick, closeOnOutsideClick,
    onItemClick, onItemDrop, tilt: clamp(tilt, 0, 1.5), bounce: clamp(bounce, 0, 1),
    speed: clamp(speed, 0.2, 3), frost: clamp(frost, 0, 1), count, entries, glass,
    light: theme === 'light', tint: rgb, insideTop, insideBottom,
    insideTone: [mixRgb(rgb, [0, 0, 0], 0.08).map((v) => v / 255), backTone.map((v) => v / 255)],
    content: `${mode}|${scale}|${paperColor}|${color}|${g.tabX}|${g.tabW}`,
    depth: Math.round(Math.max(g.w, g.h) * 5), view, g,
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    const spring = (value) => ({ value, velocity: 0 });
    const state = {
      raf: 0, last: 0, ready: false, hovered: false, pressed: false,
      pointerX: 0, pointerY: 0, deskX: 0, deskY: 0, hoveredItem: -1,
      phase: 'rest', previous: 'rest', changedAt: 0,
      front: spring(0), rx: spring(0), ry: spring(0), lift: spring(0), squash: spring(1),
      items: [], focus: -1, drag: null, receiving: false, receiveUntil: 0,
      suppressClick: false, dropCount: 0,
      intro: { phase: 'done', start: 0, opening: false },
      anchor: spring(0), appear: 1, content: { key: '', entries: null, renderer: null },
    };

    const ensureItems = (n) => {
      while (state.items.length < n) {
        state.items.push({
          x: spring(0), y: spring(0), z: spring(0), r: spring(0), ry: spring(0), s: spring(1),
          hover: spring(0), mx: spring(0), my: spring(0), alpha: spring(1),
          place: 'inside', rank: 0, layer: 'inside', elevated: false,
          insertUntil: 0, insertFrom: null, outX: 0, outY: 0, outR: 0, outS: 1, outOrder: 0,
          localX: 0, localY: 0, fresh: true,
        });
      }
      if (state.items.length > n) { state.items.length = n; if (state.focus >= n) state.focus = -1; syncOutside(); }
    };

    const syncOutside = () => {
      const list = [];
      state.items.forEach((item, i) => { if (item.place === 'out') list.push(i); });
      setOutside((prev) => prev.length === list.length && prev.every((v, i) => v === list[i]) ? prev : list);
    };

    const integrate = (item, target, omega, zeta, dt) => {
      const k = omega * omega; const d = 2 * zeta * omega;
      const steps = Math.max(1, Math.ceil(dt / STEP)); const step = dt / steps;
      for (let i = 0; i < steps; i++) { item.velocity += (k * (target - item.value) - d * item.velocity) * step; item.value += item.velocity * step; }
      return Math.abs(target - item.value) > 0.01 || Math.abs(item.velocity) > 0.01;
    };

    const snap = (item, value) => { item.value = value; item.velocity = 0; };

    const shiftOf = () => { const { g: geometry } = settingsRef.current; return geometry.book ? (geometry.w / 2) * clamp(-state.front.value / 180, 0, 1) : 0; };

    const toDesk = (clientX, clientY) => {
      const box = root.getBoundingClientRect();
      const kx = root.offsetWidth / (box.width || 1);
      const ky = root.offsetHeight / (box.height || 1);
      return [(clientX - box.left) * kx, (clientY - box.top) * ky];
    };

    const clipBounds = () => {
      const box = root.getBoundingClientRect();
      let left = 0; let top = 0; let right = window.innerWidth; let bottom = window.innerHeight;
      for (let node = root.parentElement; node && node !== document.body; node = node.parentElement) {
        const computed = getComputedStyle(node);
        if (/(hidden|clip|auto|scroll)/.test(`${computed.overflowX} ${computed.overflowY}`)) {
          const rect = node.getBoundingClientRect();
          left = Math.max(left, rect.left); top = Math.max(top, rect.top);
          right = Math.min(right, rect.right); bottom = Math.min(bottom, rect.bottom);
          break;
        }
      }
      const kx = root.offsetWidth / (box.width || 1);
      const ky = root.offsetHeight / (box.height || 1);
      return { left: (left - box.left) * kx, top: (top - box.top) * ky, right: (right - box.left) * kx, bottom: (bottom - box.top) * ky };
    };

    const overFolder = (x, y) => {
      const { g: geometry } = settingsRef.current;
      const shift = shiftOf();
      if (geometry.book) {
        const left = state.front.value < -90 ? shift - geometry.w : shift;
        return x >= left && x <= shift + geometry.w && y >= geometry.tabH * 0.5 && y <= geometry.tabH + geometry.h;
      }
      return x >= 0 && x <= geometry.w && y >= 0 && y <= geometry.tabH + geometry.h;
    };

    const inPocket = (item) => {
      const { g: geometry } = settingsRef.current;
      const halfW = (geometry.docW * item.s.value) / 2;
      const halfH = (geometry.docH * item.s.value) / 2;
      if (geometry.book) {
        if (state.front.value < -60) return false;
        const shift = shiftOf();
        return item.x.value - halfW < shift + geometry.w && item.x.value + halfW > shift && item.y.value + halfH > geometry.tabH && item.y.value - halfH < geometry.tabH + geometry.h;
      }
      if (state.front.value < -45) return false;
      return item.y.value + halfH > geometry.frontTop + 4 * geometry.scale && item.x.value + halfW > 0 && item.x.value - halfW < geometry.w;
    };

    const velocityOf = (samples) => {
      if (samples.length < 2) return [0, 0];
      const first = samples[0]; const last = samples[samples.length - 1];
      const span = Math.max(0.016, (last[0] - first[0]) / 1000);
      return [(last[1] - first[1]) / span, (last[2] - first[2]) / span];
    };

    const phaseOf = (s, time) => {
      if (s.open) return 'open';
      if (state.receiving || time < state.receiveUntil) return 'receive';
      if (s.peek && state.hovered && !state.drag?.active) return 'peek';
      return 'rest';
    };

    const place = (rank, inside, phase, s) => {
      if (s.g.book) return placeBook(rank, inside, phase, s.layout, s.g);
      const pointer = state.hovered ? ((state.pointerX + 1) / 2) * s.g.w : null;
      return placeFlap(rank, inside, phase, s.layout, s.g, pointer);
    };

    const approach = (item, slot, s) => {
      const { g: geometry } = s;
      if (item.insertFrom === 'side') return { ...slot, x: Math.max(slot.x, geometry.w + geometry.docW * 0.54 * slot.s) };
      return { ...slot, y: Math.min(slot.y, geometry.frontTop - geometry.docH * 0.5 * slot.s - 8 * geometry.scale) };
    };

    const frame = (now) => {
      state.raf = 0;
      const s = settingsRef.current;
      const { g: geometry } = s;
      ensureItems(s.count);
      const time = now / 1000;
      const dt = state.last ? Math.min(0.05, (now - state.last) / 1000) : 1 / 60;
      state.last = now;
      const zeta = reduce ? 1 : 1 - 0.72 * s.bounce;
      const frontOmega = TAU * (geometry.book ? 1.55 : 2) * s.speed;
      const itemOmega = TAU * 2.1 * s.speed;
      const soft = TAU * 1.6 * s.speed;
      const phase = phaseOf(s, time);
      if (phase !== state.phase) { state.previous = state.phase; state.phase = phase; state.changedAt = now; }
      const elapsed = (now - state.changedAt) / 1000;
      let busy = time < state.receiveUntil;

      const ranks = [];
      state.items.forEach((item, i) => { if (item.place === 'inside') ranks.push(i); });
      const inside = ranks.length;
      ranks.forEach((i, rank) => { state.items[i].rank = rank; });
      if (state.focus >= 0 && phase !== 'open' && state.items[state.focus]?.place === 'inside') state.focus = -1;

      const intro = state.intro;
      if (!state.ready) intro.opening = s.open;
      if (intro.phase === 'run' && !intro.opening && (s.open || state.drag?.active)) intro.phase = 'done';
      const introTime = intro.phase === 'run' ? time - intro.start : 0;
      const staged = intro.phase !== 'done' && !intro.opening;
      const closeAt = (0.16 + inside * 0.085 + 0.3) / s.speed;
      const holding = staged && introTime < closeAt;
      const dropAt = (rank) => (0.16 + (inside - 1 - rank) * 0.085) / s.speed;
      const introPose = (item, slot) =>
        geometry.book
          ? { ...slot, r: slot.r + (item.rank % 2 ? 7 : -6), s: slot.s * 1.12 }
          : { ...slot, y: slot.y - (geometry.h * 0.8 + geometry.docH * 0.5), r: slot.r + (item.rank % 2 ? 9 : -7) };
      if (intro.phase === 'run') { busy = true; if (introTime > (intro.opening ? 1.4 : closeAt + 1) / s.speed) intro.phase = 'done'; }
      const appear = intro.phase === 'wait' ? 0 : intro.phase === 'run' ? clamp(introTime / (0.34 / s.speed), 0, 1) : 1;
      state.appear = 1 - (1 - appear) ** 3;

      const closing = state.previous === 'open' && phase !== 'open';
      const frontDelay = closing && !reduce ? ((geometry.book ? 0.1 : 0.06) + 0.035 * inside) / s.speed : 0;
      const frontPhase = elapsed < frontDelay ? state.previous : phase;
      const frontTarget = holding ? (geometry.book ? -150 : -42) : (geometry.book ? BOOK_ANGLES : FLAP_ANGLES)[frontPhase];

      if (!state.ready) {
        state.ready = true;
        const opening = intro.phase !== 'done' && intro.opening;
        if (opening) { state.phase = 'rest'; state.previous = 'rest'; }
        snap(state.front, opening ? 0 : frontTarget);
        snap(state.anchor, staged ? 1 : 0);
        state.items.forEach((item) => {
          const slot = place(item.rank, inside, opening ? 'rest' : phase, s);
          const target = staged ? introPose(item, slot) : slot;
          snap(item.x, target.x); snap(item.y, target.y); snap(item.z, target.z);
          snap(item.r, target.r); snap(item.ry, target.ry); snap(item.s, target.s);
          snap(item.alpha, staged ? 0 : 1); snap(item.hover, staged && geometry.book ? 3 : 0);
          item.fresh = false;
        });
      }

      if (intro.phase === 'wait') { write(); state.last = 0; return; }

      busy = integrate(state.front, frontTarget, frontOmega, zeta, dt) || busy;
      const restitution = 0.2 + 0.35 * s.bounce;
      if (geometry.book && state.front.value < -180) { state.front.value = -360 - state.front.value; state.front.velocity = -state.front.velocity * restitution; }
      else if (state.front.value > 0) { state.front.value = -state.front.value; state.front.velocity = -state.front.velocity * restitution; }
      if (elapsed < frontDelay) busy = true;
      busy = integrate(state.anchor, staged ? 1 : 0, frontOmega, 1, dt) || busy;

      const engaged = state.hovered && !reduce;
      busy = integrate(state.rx, engaged ? -state.pointerY * 8 * s.tilt : 0, soft, 1, dt) || busy;
      busy = integrate(state.ry, engaged ? state.pointerX * 10 * s.tilt : 0, soft, 1, dt) || busy;
      busy = integrate(state.lift, state.hovered && phase !== 'open' ? 1 : 0, soft, 1, dt) || busy;
      busy = integrate(state.squash, state.pressed ? 0.975 : 1, TAU * 3.2, 0.6, dt) || busy;

      const opening = phase === 'open' && state.previous !== 'open';
      const drag = state.drag?.active ? state.drag : null;
      const hover = state.hoveredItem;
      const hovering = !drag && hover >= 0 && state.items[hover] ? state.items[hover] : null;
      const lead = hovering && hovering.place === 'inside' && phase === 'open' ? place(hovering.rank, inside, 'open', s) : null;
      const focusScale = clamp(((geometry.tabH + geometry.h) * 1.18) / geometry.docH, 1.2, 2.2);
      const focusY = geometry.book ? geometry.tabH + geometry.h / 2 : geometry.tabH + geometry.h * 0.36;

      state.items.forEach((item, index) => {
        if (item.fresh) { const start = place(item.rank, inside, 'rest', s); snap(item.x, start.x); snap(item.y, start.y); snap(item.r, start.r); item.fresh = false; }
        let target; let omega = itemOmega; let damping = zeta; let lift = 0; let fade = 1; let magnet = false;
        if (state.focus === index) {
          target = { x: geometry.w / 2, y: focusY, z: 0, r: 0, ry: 0, s: focusScale }; lift = 2.4; item.layer = 'focus';
        } else if (drag && drag.index === index) {
          const [vx] = velocityOf(drag.samples);
          target = { x: state.deskX + drag.grabX, y: state.deskY + drag.grabY, z: 0, r: clamp(vx * 0.012, -14, 14), ry: 0, s: drag.scale * 1.05 };
          omega = TAU * 5; damping = 0.78; lift = 1.4;
          if (!item.elevated && !inPocket(item)) item.elevated = true;
          item.layer = item.elevated ? 'drag' : 'inside';
        } else if (item.place === 'out') {
          target = { x: item.outX, y: item.outY, z: 0, r: item.outR, ry: 0, s: item.outS };
          lift = hover === index ? 1 : 0.15; magnet = hover === index; item.layer = 'out';
        } else {
          const order = opening ? (geometry.book ? inside - 1 - item.rank : item.rank) : item.rank;
          const delay = reduce ? 0 : opening ? ((geometry.book ? 0.16 : 0.05) + order * (geometry.book ? 0.055 : 0.045)) / s.speed : (order * 0.03) / s.speed;
          const active = elapsed >= delay ? phase : state.previous;
          target = place(item.rank, inside, active, s);
          if (elapsed < delay) busy = true;
          if (staged && introTime < dropAt(item.rank)) { target = introPose(item, target); fade = 0; lift = geometry.book ? 3 : 0; item.layer = 'inside'; }
          else if (item.insertUntil > time) { busy = true; target = approach(item, target, s); item.layer = 'drag'; lift = 0.6; }
          else {
            item.insertUntil = 0; item.elevated = false; item.layer = 'inside';
            if (lead && active === 'open') {
              if (hover === index) { target = { ...target, y: target.y - 6 * geometry.scale, r: target.r * 0.2, ry: 0, s: target.s * 1.05 }; lift = 1; magnet = true; }
              else {
                const distance = target.x - lead.x;
                target = { ...target, x: target.x + Math.sign(distance) * 12 * geometry.scale * Math.max(0, 1 - Math.abs(distance) / (geometry.w * 1.1)) };
                lift = 0.2;
              }
            } else if (active === 'open') { lift = 0.2; }
          }
        }
        busy = integrate(item.x, target.x, omega, damping, dt) || busy;
        busy = integrate(item.y, target.y, omega, damping, dt) || busy;
        if (!geometry.book && item.layer === 'inside') {
          const tilt = (item.r.value * Math.PI) / 180;
          const reach = ((geometry.docW * Math.abs(Math.sin(tilt)) + geometry.docH * Math.abs(Math.cos(tilt))) * item.s.value) / 2;
          const floor = geometry.tabH + geometry.h - 2 * geometry.scale - reach;
          if (item.y.value > floor) { item.y.value = floor; if (item.y.velocity > 0) item.y.velocity *= -0.25; }
        }
        busy = integrate(item.z, target.z, itemOmega, zeta, dt) || busy;
        busy = integrate(item.r, target.r, omega, damping, dt) || busy;
        busy = integrate(item.ry, target.ry, itemOmega, zeta, dt) || busy;
        busy = integrate(item.s, target.s, itemOmega, zeta, dt) || busy;
        busy = integrate(item.hover, lift, itemOmega, zeta, dt) || busy;
        busy = integrate(item.alpha, fade, TAU * 3 * s.speed, 1, dt) || busy;
        busy = integrate(item.mx, magnet ? item.localX * 7 * geometry.scale : 0, soft, 0.85, dt) || busy;
        busy = integrate(item.my, magnet ? item.localY * 7 * geometry.scale : 0, soft, 0.85, dt) || busy;
      });

      write();
      if (busy || drag) state.raf = requestAnimationFrame(frame);
      else state.last = 0;
    };

    const refreshContent = (renderer, s) => {
      if (state.content.key === s.content && state.content.entries === s.entries && state.content.renderer === renderer) return;
      state.content = { key: s.content, entries: s.entries, renderer };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const keys = new Set(['back']);
      renderer.upload('back', paintBack(s.g, s.insideTop, s.insideBottom, dpr));
      itemRefs.current.slice(0, s.count).forEach((node, index) => {
        if (!node) return;
        const key = `item-${index}`; keys.add(key);
        let result = rasterize(node, dpr, false);
        try { renderer.upload(key, result.canvas); } catch { result = rasterize(node, dpr, true); renderer.upload(key, result.canvas); }
        result.pending.forEach((image) => image.addEventListener('load', invalidate, { once: true }));
      });
      renderer.prune(keys);
    };

    const write = () => {
      const s = settingsRef.current;
      const { w, h, tabH, frontTop, frontH, docW, docH, scale, book: isBook } = s.g;
      const pivotX = w / 2; const pivotY = tabH + h / 2;
      const theta = state.front.value;
      const angle = (theta * Math.PI) / 180;
      const unfold = isBook ? clamp(-theta / 180, 0, 1) : 0;
      const shift = (w / 2) * unfold * (1 - state.anchor.value);
      const zoom = (1 + state.lift.value * 0.012) * state.squash.value * (0.94 + 0.06 * state.appear);
      root.style.opacity = state.appear < 0.999 ? state.appear.toFixed(3) : '';
      const desk = chain(move(pivotX, pivotY), turnX(state.rx.value), turnY(state.ry.value), stretch(zoom, zoom), move(-pivotX, -pivotY));
      const folder = multiply(desk, move(shift, 0));
      const flipped = isBook && theta < -90;
      const frontZ = flipped ? '3' : '40';

      if (backRef.current) {
        backRef.current.style.transform = toCss(folder);
        backRef.current.style.setProperty('--folder-gutter', unfold.toFixed(3));
        backRef.current.style.setProperty('--folder-label', (isBook ? 1 : 1 - clamp((-theta - 18) / 26, 0, 1)).toFixed(3));
      }

      const frontMatrix = isBook
        ? chain(folder, move(0, frontTop, 2 * scale * (1 - unfold)), turnY(theta))
        : chain(folder, move(0, tabH + h, 2 * scale), turnX(theta), move(0, -frontH));
      const facing = isBook ? Math.sin(angle) * -0.42 + Math.cos(angle) * 0.9 : Math.sin(angle) * 0.5 + Math.cos(angle) * 0.86;
      const light = (flipped ? -facing : facing) / (isBook ? 0.9 : 0.86);
      const glint = clamp((light - 1) * 0.9, 0, 0.18);
      const dim = clamp((1 - light) * (isBook ? 0.5 : 0.22), 0, 0.5);

      const front = frontRef.current;
      if (front) {
        front.style.transform = toCss(frontMatrix);
        front.style.zIndex = frontZ;
        front.dataset.face = flipped ? 'inner' : 'outer';
        front.style.setProperty('--folder-glint', glint.toFixed(3));
        front.style.setProperty('--folder-dim', dim.toFixed(3));
      }

      const rise = isBook ? Math.max(0, Math.sin(-angle)) : 0;
      if (groundRef.current) {
        groundRef.current.style.transform = toCss(multiply(folder, move(0, isBook ? tabH : tabH + h)));
        groundRef.current.style.opacity = (0.75 + state.lift.value * 0.25).toFixed(3);
      }
      if (castRef.current) {
        castRef.current.style.transform = toCss(chain(folder, move(w * rise * 0.12, frontTop + h * rise * 0.04), stretch(Math.cos(angle), 1)));
        castRef.current.style.opacity = (flipped ? 1 - rise * 0.7 : 0).toFixed(3);
      }
      if (shadeRef.current) {
        const edge = w * Math.cos(angle) + w * rise * 0.36;
        shadeRef.current.style.transform = toCss(chain(folder, move(0, frontTop + h * rise * 0.03), stretch(edge / w, 1)));
        shadeRef.current.style.zIndex = edge > 0 ? '39' : '2';
        shadeRef.current.style.opacity = (clamp(rise * 4, 0, 1) * (1 - rise * 0.45)).toFixed(3);
      }

      const outs = state.items.map((item, index) => [item, index]).filter(([item]) => item.layer === 'out').sort((a, b) => a[0].outOrder - b[0].outOrder).map(([, index]) => index);
      const matrices = [];
      state.items.forEach((item, index) => {
        const node = itemRefs.current[index];
        const z = 3 * scale + item.z.value + item.hover.value * 26 * scale;
        const matrix = chain(desk, move(item.x.value + item.mx.value, item.y.value + item.my.value, z), turnY(item.ry.value), turnZ(item.r.value), stretch(item.s.value, item.s.value), move(-docW / 2, -docH / 2));
        let layer = 10 + s.count - item.rank;
        if (item.layer === 'inside' && state.phase === 'open' && state.hoveredItem === index) layer = 30;
        if (item.layer === 'out') layer = LAYERS.out + outs.indexOf(index);
        if (item.layer === 'drag') layer = LAYERS.drag;
        if (item.layer === 'focus') layer = LAYERS.focus;
        matrices.push({ index, matrix, layer, alpha: clamp(item.alpha.value, 0, 1), inside: item.layer === 'inside' });
        if (!node) return;
        node.style.transform = toCss(matrix);
        node.style.zIndex = String(layer);
        node.style.setProperty('--folder-lift', clamp(item.hover.value, 0, 2.4).toFixed(3));
        node.style.opacity = item.alpha.value < 0.995 ? Math.max(0, item.alpha.value).toFixed(3) : '';
      });

      const canvas = glassRef.current;
      const renderer = rendererRef.current;
      if (!canvas || !renderer || !s.glass) return;
      canvas.style.zIndex = frontZ;
      refreshContent(renderer, s);
      const layers = [];
      if (!flipped) {
        layers.push({ key: 'back', matrix: folder, width: w, height: tabH + h, alpha: 1 });
        matrices.filter((entry) => entry.inside).sort((a, b) => a.layer - b.layer).forEach((entry) => layers.push({ key: `item-${entry.index}`, matrix: entry.matrix, width: docW, height: docH, alpha: entry.alpha }));
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.render({
        dpr, depth: s.depth, origin: [pivotX, pivotY], view: s.view, layers,
        glass: {
          matrix: frontMatrix, width: w, height: frontH,
          radii: isBook ? [0, s.g.r, s.g.r, 0] : [s.g.r, s.g.r, s.g.r, s.g.r],
          spine: isBook ? w * 2 : 0, bleed: flipped ? 2 : 0,
          morph: isBook ? clamp((unfold - 0.55) / 0.45, 0, 1) ** 2 : 0,
          insideTop: s.insideTone[0], insideBottom: s.insideTone[1],
          tabRatio: tabH / (tabH + h), gutter: [12 * scale, isBook ? 0.12 * unfold : 0],
          bevel: 12 * scale, strength: 14 * scale, split: 0.26, lens: 0.02,
          frost: s.frost * 6 * scale,
          tint: [s.tint[0] / 255, s.tint[1] / 255, s.tint[2] / 255, s.light ? 0.1 : 0.14],
          haze: 0.04 + s.frost * 0.1, dim: dim * 0.8, glint,
          shine: s.light ? 0.72 : 0.85, light: flipped ? [0.55, -0.83] : [-0.55, -0.83],
        },
      });
    };

    const wake = () => { if (!state.raf) state.raf = requestAnimationFrame(frame); };
    const beginIntro = () => { if (state.intro.phase !== 'wait') return; state.intro.phase = 'run'; state.intro.start = performance.now() / 1000; wake(); };
    const invalidate = () => { state.content.key = ''; wake(); };
    const updateReceiving = () => {
      const drag = state.drag;
      const item = drag ? state.items[drag.index] : null;
      state.receiving = Boolean(drag?.active && item && (item.place === 'out' || item.elevated) && overFolder(state.deskX, state.deskY));
    };

    const startDrag = (drag) => {
      const item = state.items[drag.index];
      if (!item) return;
      drag.active = true;
      drag.grabX = item.x.value - drag.downX;
      drag.grabY = item.y.value - drag.downY;
      drag.scale = item.place === 'out' ? item.outS : item.s.value;
      drag.clip = clipBounds();
      state.suppressClick = true;
      if (state.focus === drag.index) state.focus = -1;
      item.elevated = item.place === 'out' || !inPocket(item);
      root.dataset.dragging = '';
    };

    const drop = (drag, cancelled) => {
      const s = settingsRef.current;
      const item = state.items[drag.index];
      state.receiving = false;
      delete root.dataset.dragging;
      if (!item) return;
      const time = performance.now() / 1000;
      const [vx, vy] = cancelled ? [0, 0] : velocityOf(drag.samples);
      if (overFolder(state.deskX, state.deskY)) {
        const entering = item.place === 'out' || item.elevated;
        item.place = 'inside';
        if (entering && !reduce) {
          item.insertUntil = time + 0.24 / s.speed;
          item.insertFrom = s.g.book ? (state.front.value < -90 ? null : 'side') : 'top';
          if (!item.insertFrom) item.insertUntil = 0;
          state.receiveUntil = item.insertUntil ? item.insertUntil + 0.14 / s.speed : 0;
        }
        item.elevated = false;
        syncOutside();
        s.onItemDrop?.(s.entries[drag.index], drag.index, true);
        return;
      }
      const clip = drag.clip ?? clipBounds();
      const halfW = (s.g.docW * drag.scale) / 2;
      const halfH = (s.g.docH * drag.scale) / 2;
      const x = state.deskX + drag.grabX + clamp(vx, -2400, 2400) * 0.09;
      const y = state.deskY + drag.grabY + clamp(vy, -2400, 2400) * 0.09;
      item.place = 'out';
      item.elevated = true;
      const margin = 8 * s.g.scale;
      const reachX = halfW * 1.08 + margin;
      const reachY = halfH * 1.08 + margin;
      item.outX = clamp(x, clip.left + reachX, Math.max(clip.left + reachX, clip.right - reachX));
      item.outY = clamp(y, clip.top + reachY, Math.max(clip.top + reachY, clip.bottom - reachY));
      item.outR = clamp(item.r.value * 0.5 + clamp(vx, -2400, 2400) * 0.003 + DROP_TURN[drag.index % 6] * 0.6, -12, 12);
      item.outS = drag.scale;
      state.dropCount += 1;
      item.outOrder = state.dropCount;
      syncOutside();
      s.onItemDrop?.(s.entries[drag.index], drag.index, false);
    };

    const onMove = (event) => {
      const drag = state.drag;
      if (drag && event.pointerId === drag.id) {
        const [x, y] = toDesk(event.clientX, event.clientY);
        state.deskX = x; state.deskY = y;
        const now = performance.now();
        drag.samples.push([now, x, y]);
        while (drag.samples.length > 2 && now - drag.samples[0][0] > 100) drag.samples.shift();
        if (!drag.active) {
          const threshold = event.pointerType === 'touch' ? 8 : 4;
          if (Math.hypot(event.clientX - drag.clientX, event.clientY - drag.clientY) > threshold) startDrag(drag);
        }
        if (drag.active) updateReceiving();
        wake();
      }
      if (event.pointerType === 'touch') return;
      const box = root.getBoundingClientRect();
      state.pointerX = clamp(((event.clientX - box.left) / box.width) * 2 - 1, -1.5, 1.5);
      state.pointerY = clamp(((event.clientY - box.top) / box.height) * 2 - 1, -1.5, 1.5);
      const target = event.target.closest?.('[data-folder-item]');
      const index = target && root.contains(target) ? Number(target.getAttribute('data-folder-item')) : -1;
      state.hoveredItem = index;
      if (target && index >= 0 && !state.drag?.active) {
        const rect = target.getBoundingClientRect();
        const item = state.items[index];
        if (item) {
          item.localX = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
          item.localY = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
        }
      }
      if (!state.hovered) { state.hovered = true; if (settingsRef.current.openOn === 'hover') setOpenRef.current(true); }
      wake();
    };

    const onLeave = (event) => {
      if (event.pointerType === 'touch' || state.drag?.active) return;
      state.hovered = false; state.pressed = false; state.hoveredItem = -1;
      if (settingsRef.current.openOn === 'hover') setOpenRef.current(false);
      wake();
    };

    const onDown = (event) => {
      if (event.button > 0) return;
      state.suppressClick = false;
      const target = event.target.closest?.('[data-folder-item]');
      if (target && root.contains(target) && settingsRef.current.draggable) {
        const [x, y] = toDesk(event.clientX, event.clientY);
        state.deskX = x; state.deskY = y;
        state.drag = { index: Number(target.getAttribute('data-folder-item')), id: event.pointerId, clientX: event.clientX, clientY: event.clientY, downX: x, downY: y, grabX: 0, grabY: 0, scale: 1, clip: null, active: false, samples: [[performance.now(), x, y]] };
        try { target.setPointerCapture(event.pointerId); } catch { state.drag.id = event.pointerId; }
      } else { state.pressed = true; }
      wake();
    };

    const onUp = (event) => {
      state.pressed = false;
      const drag = state.drag;
      if (drag && event.pointerId === drag.id) { state.drag = null; if (drag.active) drop(drag, event.type === 'pointercancel'); }
      wake();
    };

    const onDocumentDown = (event) => {
      if (root.contains(event.target)) return;
      const s = settingsRef.current;
      if (state.focus >= 0) { state.focus = -1; wake(); }
      if (s.open && s.closeOnOutsideClick) setOpenRef.current(false);
    };

    const onKey = (event) => {
      if (event.key !== 'Escape') return;
      if (state.focus >= 0) { state.focus = -1; wake(); return; }
      const s = settingsRef.current;
      if (s.open && s.closeOnOutsideClick) setOpenRef.current(false);
    };

    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    document.addEventListener('pointerdown', onDocumentDown);
    document.addEventListener('keydown', onKey);
    document.fonts?.ready.then(invalidate);

    let observer = null;
    if (settingsRef.current.intro && !reduce) {
      state.intro.phase = 'wait';
      root.style.opacity = '0';
      if (typeof IntersectionObserver === 'undefined') beginIntro();
      else {
        observer = new IntersectionObserver((entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          observer?.disconnect();
          beginIntro();
        }, { threshold: 0.2 });
        observer.observe(root);
      }
    }

    engineRef.current = {
      wake, invalidate,
      consumeClick: () => { if (!state.suppressClick) return false; state.suppressClick = false; return true; },
      interactive: (index) => settingsRef.current.open || state.items[index]?.place === 'out' || state.focus === index,
      select: (index) => {
        const s = settingsRef.current;
        if (s.zoomOnClick) state.focus = state.focus === index ? -1 : index;
        s.onItemClick?.(s.entries[index], index);
        wake();
      },
      blur: () => { if (state.focus < 0) return false; state.focus = -1; wake(); return true; },
    };
    wake();

    return () => {
      cancelAnimationFrame(state.raf);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      document.removeEventListener('pointerdown', onDocumentDown);
      document.removeEventListener('keydown', onKey);
      observer?.disconnect();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!glass) return undefined;
    const canvas = glassRef.current;
    if (!canvas) return undefined;
    const renderer = createGlassRenderer(canvas);
    if (!renderer) return undefined;
    rendererRef.current = renderer;
    setGpu(true);
    const onLost = (event) => { event.preventDefault(); rendererRef.current = null; setGpu(false); };
    canvas.addEventListener('webglcontextlost', onLost);
    engineRef.current?.invalidate();
    return () => {
      canvas.removeEventListener('webglcontextlost', onLost);
      renderer.dispose();
      if (rendererRef.current === renderer) rendererRef.current = null;
      setGpu(false);
    };
  }, [glass]);

  useEffect(() => { engineRef.current?.wake(); });

  const toggle = () => {
    if (engineRef.current?.blur()) return;
    if (openOn === 'hover') return;
    setOpen(!isOpen);
  };

  const onItemActivate = (event, index) => {
    const engine = engineRef.current;
    if (!engine) return;
    if (engine.consumeClick()) { event.stopPropagation(); return; }
    if (!engine.interactive(index)) return;
    event.stopPropagation();
    engine.select(index);
  };

  const skin = SKINS[variant] ?? SKINS.solid;
  const vars = {
    ...(FOLDER_THEMES[theme] ?? FOLDER_THEMES.dark),
    '--folder-rgb': rgb.join(', '),
    '--folder-base': rgbString(rgb),
    '--folder-front-top': rgbString(mixRgb(rgb, [255, 255, 255], 0.12)),
    '--folder-front-bottom': rgbString(mixRgb(rgb, [0, 0, 0], 0.06)),
    '--folder-inside-top': insideTop,
    '--folder-inside-bottom': insideBottom,
    '--folder-tab-ink': luma(backTone) > 0.6 ? 'rgba(0, 0, 0, 0.72)' : 'rgba(255, 255, 255, 0.92)',
    '--folder-paper': rgbString(paper),
    '--folder-paper-ink': rgbString(mixRgb(paper, [0, 0, 0], 0.11)),
    '--folder-paper-ink-strong': rgbString(mixRgb(paper, [0, 0, 0], 0.28)),
    '--folder-paper-text': rgbString(mixRgb(paper, [0, 0, 0], 0.72)),
    '--folder-w': `${g.w}px`,
    '--folder-h': `${g.h}px`,
    '--folder-tab-h': `${g.tabH}px`,
    '--folder-front-y': `${g.frontTop}px`,
    '--folder-front-h': `${g.frontH}px`,
    '--folder-r': `${g.r}px`,
    '--folder-front-radius': book ? `0 ${g.r}px ${g.r}px 0` : `${g.r}px`,
    '--folder-doc-w': `${g.docW}px`,
    '--folder-doc-h': `${g.docH}px`,
    '--folder-frost': `${(1.5 + clamp(frost, 0, 1) * 10) * scale}px`,
    '--folder-depth': `${settingsRef.current.depth}px`,
    '--folder-scale': scale,
    width: 'var(--folder-w)',
    height: 'calc(var(--folder-tab-h) + var(--folder-h))',
    ...style,
  };

  const shape = backPath(g);

  return (
    <div
      ref={rootRef}
      className={`group/folder relative inline-block align-middle select-none [-webkit-tap-highlight-color:transparent] [&[data-dragging]]:cursor-grabbing [&[data-dragging]_*]:cursor-grabbing! ${className}`.trim()}
      data-mode={book ? 'book' : 'flap'}
      data-variant={variant}
      data-theme={theme === 'light' ? 'light' : 'dark'}
      data-open={isOpen ? '' : undefined}
      data-gl={glass && gpu ? '' : undefined}
      data-draggable={draggable ? '' : undefined}
      style={vars}
    >
      <div
        className="group/stage absolute inset-0 isolate cursor-pointer outline-none"
        style={{ perspective: 'var(--folder-depth)', perspectiveOrigin: 'calc(var(--folder-w) / 2) calc(var(--folder-tab-h) + var(--folder-h) / 2)' }}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-label={label ? `${label} folder` : 'Folder'}
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
        }}
      >
        <span
          ref={groundRef}
          className={`${LAYER} pointer-events-none z-[1]`}
          style={
            book
              ? { width: 'var(--folder-w)', height: 'var(--folder-h)', borderRadius: 'var(--folder-front-radius)', boxShadow: RECT_SHADOW }
              : { width: 'var(--folder-w)', height: 'calc(var(--folder-h) * 0.14)', marginTop: 'calc(var(--folder-h) * -0.07)', borderRadius: '50%', background: 'var(--folder-ground)', filter: 'blur(calc(var(--folder-h) * 0.05))' }
          }
          aria-hidden="true"
        />
        {book && (
          <span ref={castRef} className={`${LAYER} pointer-events-none z-[1]`} style={{ width: 'var(--folder-w)', height: 'calc(var(--folder-h) - var(--folder-front-y) + var(--folder-tab-h))', borderRadius: 'var(--folder-front-radius)', boxShadow: RECT_SHADOW }} aria-hidden="true" />
        )}

        <div ref={backRef} className={`${LAYER} z-[4]`} style={{ width: 'var(--folder-w)', height: 'calc(var(--folder-tab-h) + var(--folder-h))' }} aria-hidden="true">
          <div className="absolute inset-0" style={{ clipPath: `path('${shape}')`, background: skin.back }}>
            {book && (
              <span className="absolute bottom-0 left-0" style={{ top: 'var(--folder-tab-h)', width: 'calc(12px * var(--folder-scale))', background: GUTTER, opacity: 'var(--folder-gutter, 0)' }} />
            )}
          </div>
          <svg className="pointer-events-none absolute inset-0 overflow-visible" width={g.w} height={total} viewBox={`0 0 ${g.w} ${total}`}>
            <path d={shape} fill="none" className="group-focus-visible/stage:[stroke-width:2px] group-focus-visible/stage:[stroke:var(--folder-focus)]" />
          </svg>
          {label && (
            <span className={TAB_TEXT} style={{ ...TAB_STYLE, left: g.tabX, width: g.tabW, opacity: 'var(--folder-label, 1)' }}>{label}</span>
          )}
        </div>

        {entries.map((item, index) => {
          const interactive = isOpen || outside.includes(index);
          return (
            <div
              key={isValidElement(item) && item.key != null ? item.key : index}
              ref={(node) => { itemRefs.current[index] = node; }}
              className={`${LAYER} z-[10] overflow-hidden outline-none focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-solid focus-visible:[outline-color:var(--folder-focus)]`}
              style={{ width: 'var(--folder-doc-w)', height: 'var(--folder-doc-h)', borderRadius: 'calc(7px * var(--folder-scale))', background: 'var(--folder-paper)', boxShadow: PAPER_SHADOW, cursor: draggable ? 'grab' : isOpen ? 'pointer' : undefined, touchAction: draggable ? 'none' : undefined }}
              data-folder-item={index}
              role={interactive ? 'button' : undefined}
              tabIndex={interactive ? 0 : -1}
              onClick={(event) => onItemActivate(event, index)}
              onKeyDown={(event) => {
                if (!interactive || (event.key !== 'Enter' && event.key !== ' ')) return;
                event.preventDefault(); event.stopPropagation();
                engineRef.current?.select(index);
              }}
            >
              {renderFolderItem(item)}
            </div>
          );
        })}

        {book && (
          <span ref={shadeRef} className={`${LAYER} pointer-events-none z-[39] opacity-0`} style={{ width: 'var(--folder-w)', height: 'var(--folder-front-h)', borderRadius: 'var(--folder-front-radius)', background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.34), rgba(0, 0, 0, 0.16))', filter: 'blur(calc(6px * var(--folder-scale)))' }} aria-hidden="true" />
        )}

        <div ref={frontRef} className={`group/front ${LAYER} z-[40]`} style={{ width: 'var(--folder-w)', height: 'var(--folder-front-h)' }} data-face="outer" aria-hidden="true">
          <div className={`${FACE} group-data-[face=inner]/front:invisible group-data-[gl]/folder:invisible!`} style={{ ...skin.outer, borderRadius: 'var(--folder-front-radius)' }}>
            <span className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: FACE_LIGHT }} />
          </div>
          {book && (
            <div className={`${FACE} invisible group-data-[face=inner]/front:visible group-data-[gl]/folder:invisible!`} style={{ ...skin.inner, borderRadius: 'var(--folder-front-radius)', left: -1 }}>
              <span className="absolute top-0 bottom-0 left-0" style={{ width: 'calc(12px * var(--folder-scale))', background: GUTTER }} />
              <span className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: FACE_LIGHT }} />
            </div>
          )}
        </div>

        {glass && (
          <canvas ref={glassRef} className="pointer-events-none absolute z-[40]" aria-hidden="true" style={{ left: view.x, top: view.y, width: view.width, height: view.height }} />
        )}
      </div>

      {label && (
        <span ref={measureRef} className={`${TAB_TEXT} pointer-events-none invisible`} style={{ ...TAB_STYLE, left: 0, padding: 0 }} aria-hidden="true">
          {label}
        </span>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   MAGIC BENTO
═══════════════════════════════════════════════════════════════════════ */
const THEMES = {
  dark: {
    '--mb-surface': 'linear-gradient(180deg, #1a1820 0%, #121116 100%)',
    '--mb-edge': 'rgba(255, 255, 255, 0.07)',
    '--mb-highlight': 'rgba(255, 255, 255, 0.06)',
    '--mb-shadow': '0 24px 48px -28px rgba(0, 0, 0, 0.85), 0 8px 18px -12px rgba(0, 0, 0, 0.6)',
    '--mb-tile': 'linear-gradient(180deg, #3a3644 0%, #27242f 100%)',
    '--mb-tile-edge': 'rgba(255, 255, 255, 0.07)',
    '--mb-tile-highlight': 'rgba(255, 255, 255, 0.12)',
    '--mb-tile-shadow': '0 4px 10px -4px rgba(0, 0, 0, 0.7)',
    '--mb-well': 'rgba(255, 255, 255, 0.03)',
    '--mb-well-edge': 'rgba(255, 255, 255, 0.06)',
    '--mb-ink': '#f4f4f5',
    '--mb-muted': 'rgba(244, 244, 245, 0.6)',
    '--mb-faint': 'rgba(244, 244, 245, 0.3)',
    '--mb-line': 'rgba(244, 244, 245, 0.1)',
    '--mb-secondary': '#a1a1aa',
    '--mb-secondary-ink': '#121016',
    '--mb-cursor-stroke': 'rgba(18, 16, 22, 0.9)',
    '--mb-ring': 'rgba(18, 16, 22, 0.85)',
    '--mb-focus': 'rgba(244, 244, 245, 0.5)',
    '--mb-glow-alpha': 0.85,
    '--mb-spot-alpha': 0.07
  },
  light: {
    '--mb-surface': 'linear-gradient(180deg, #ffffff 0%, #f7f7f9 100%)',
    '--mb-edge': 'rgba(24, 24, 27, 0.08)',
    '--mb-highlight': 'rgba(255, 255, 255, 1)',
    '--mb-shadow': '0 24px 48px -30px rgba(24, 24, 27, 0.28), 0 8px 18px -14px rgba(24, 24, 27, 0.16)',
    '--mb-tile': 'linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)',
    '--mb-tile-edge': 'rgba(24, 24, 27, 0.08)',
    '--mb-tile-highlight': 'rgba(255, 255, 255, 1)',
    '--mb-tile-shadow': '0 4px 10px -5px rgba(24, 24, 27, 0.22)',
    '--mb-well': 'rgba(24, 24, 27, 0.025)',
    '--mb-well-edge': 'rgba(24, 24, 27, 0.06)',
    '--mb-ink': '#18181b',
    '--mb-muted': 'rgba(24, 24, 27, 0.6)',
    '--mb-faint': 'rgba(24, 24, 27, 0.3)',
    '--mb-line': 'rgba(24, 24, 27, 0.08)',
    '--mb-secondary': '#71717a',
    '--mb-secondary-ink': '#ffffff',
    '--mb-cursor-stroke': '#ffffff',
    '--mb-ring': '#ffffff',
    '--mb-focus': 'rgba(24, 24, 27, 0.4)',
    '--mb-glow-alpha': 0.5,
    '--mb-spot-alpha': 0.035
  }
};

const INK = { dark: [244, 244, 245], light: [24, 24, 27] };
const MIN_CELL = 150;
const MIN_PAIR = 200;
const STAGGER = 80;
const TILT = 6;
const MAGNET = 6;

const ROOT_CLASS =
  'magic-bento relative box-border grid w-full [grid-auto-flow:row_dense] text-[color:var(--mb-ink)] [-webkit-tap-highlight-color:transparent]';
const CELL_CLASS = 'magic-bento__cell relative min-h-0 min-w-0 [--mb-delay:0ms]';
const CARD_CLASS =
  'magic-bento__card relative box-border isolate flex h-full w-full select-none flex-col overflow-hidden rounded-[var(--mb-radius)] text-[color:var(--mb-ink)] no-underline outline-none [background:var(--mb-surface)] [box-shadow:var(--mb-shadow)] [transform:perspective(900px)_translate3d(var(--mb-tx,0px),var(--mb-ty,0px),0)_rotateX(var(--mb-rx,0deg))_rotateY(var(--mb-ry,0deg))_scale(var(--mb-press,1))] data-[clickable]:cursor-pointer focus-visible:[box-shadow:var(--mb-shadow),0_0_0_2px_var(--mb-focus)]';
const IMAGE_CLASS = 'pointer-events-none absolute inset-0 z-0 h-full w-full object-cover';
const SCRIM_CLASS = 'pointer-events-none absolute inset-0 z-0';
const LIGHT_CLASS = 'pointer-events-none absolute inset-0 z-[1] rounded-[inherit]';
const STARS_CLASS = 'pointer-events-none absolute inset-0 z-[1] block h-full w-full';
const RIM_CLASS =
  'pointer-events-none absolute inset-0 z-[3] rounded-[inherit] [box-shadow:inset_0_0_0_1px_var(--mb-edge),inset_0_1px_0_var(--mb-highlight)]';
const BORDER_CLASS = 'pointer-events-none absolute inset-0 z-[4] box-border rounded-[inherit] p-px';
const CONTENT_CLASS = 'relative z-[2] box-border flex min-h-0 flex-1 flex-col gap-3 p-[var(--mb-pad)]';
const HEADER_CLASS =
  'flex min-w-0 items-center gap-2 text-[12px] leading-4 font-medium text-[color:var(--mb-muted)] [[data-image]_&]:text-[rgba(244,244,245,0.72)]';
const ICON_CLASS =
  'grid h-4 w-4 flex-none place-items-center text-[color:var(--mb-ink)] [[data-image]_&]:text-[#f4f4f5]';
const LABEL_CLASS = 'overflow-hidden text-ellipsis whitespace-nowrap';
const VISUAL_CLASS = 'relative flex min-h-0 flex-1 flex-col justify-center [container-type:size]';
const TEXT_CLASS = 'mt-auto flex flex-col gap-1';
const TITLE_CLASS =
  'm-0 text-[15px] leading-5 font-semibold tracking-[-0.01em] text-[color:var(--mb-ink)] [[data-image]_&]:text-[#f4f4f5] [[data-autohide]_&]:line-clamp-1';
const DESCRIPTION_CLASS =
  'm-0 text-[13px] leading-[1.45] text-[color:var(--mb-muted)] [[data-image]_&]:text-[rgba(244,244,245,0.72)] [[data-autohide]_&]:line-clamp-2';
const CHART_CLASS = 'magic-bento__chart flex min-h-0 flex-1 touch-pan-y flex-col';
const FIGURE_CLASS = 'flex min-w-0 items-baseline gap-1.5 whitespace-nowrap';
const FIGURE_VALUE_CLASS =
  'text-[15px] leading-[18px] font-semibold tracking-[-0.02em] text-[color:var(--mb-ink)] tabular-nums';
const FIGURE_NOTE_CLASS =
  'min-w-0 overflow-hidden text-ellipsis text-[11.5px] leading-[14px] text-[color:var(--mb-muted)] tabular-nums';
const PLOT_CLASS =
  'relative mt-1.5 min-h-0 flex-1 [&_svg]:absolute [&_svg]:inset-0 [&_svg]:block [&_svg]:h-full [&_svg]:w-full [&_svg]:overflow-visible';
const CHART_AREA_CLASS = 'magic-bento__chart-area [fill:rgba(var(--mb-accent-rgb),0.14)]';
const CHART_LINE_CLASS =
  'magic-bento__chart-line fill-none [stroke:rgb(var(--mb-accent-rgb))] [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.6]';
const SCRUB_CLASS =
  'pointer-events-none absolute top-0 bottom-0 left-0 w-px opacity-0 transition-opacity duration-[180ms] [background:linear-gradient(to_bottom,rgba(var(--mb-accent-rgb),0),rgba(var(--mb-accent-rgb),0.35))] [[data-scrub]_&]:opacity-100';
const SCRUB_DOT_CLASS =
  'absolute top-0 left-0 -mt-[3.5px] -ml-[3px] h-[7px] w-[7px] rounded-full [background:rgb(var(--mb-accent-rgb))] [box-shadow:0_0_0_3px_var(--mb-ring)]';
const BARS_CLASS = 'magic-bento__bars flex min-h-0 flex-1 flex-col';
const BARS_PLOT_CLASS = 'mt-2 flex min-h-0 flex-1 items-end gap-[5px]';
const BAR_CLASS =
  'magic-bento__bar relative h-[calc(var(--h)*100%)] min-h-[3px] flex-1 origin-bottom rounded-[3px_3px_2px_2px] bg-[rgba(var(--mb-accent-rgb),0.18)] transition-[background-color,filter] duration-200 hover:bg-[rgba(var(--mb-accent-rgb),0.42)] data-[peak]:bg-[rgb(var(--mb-accent-rgb))] data-[peak]:hover:brightness-110';
const FLOW_CLASS = 'relative flex min-h-0 flex-col gap-2';
const FLOW_TRIGGER_CLASS =
  "relative box-border flex items-center gap-2.5 rounded-[var(--mb-inner-radius)] py-2 pr-3 pl-2 [background:var(--mb-tile)] [box-shadow:var(--mb-tile-shadow)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:content-[''] after:[box-shadow:inset_0_0_0_1px_var(--mb-tile-edge),inset_0_1px_0_var(--mb-tile-highlight)]";
const FLOW_GLYPH_CLASS =
  'grid h-7 w-7 flex-none place-items-center rounded-[calc(var(--mb-inner-radius)-2px)] text-[color:var(--mb-ink)] [background:var(--mb-well)]';
const FLOW_COPY_CLASS = 'flex min-w-0 flex-col';
const FLOW_NAME_CLASS =
  'overflow-hidden text-ellipsis whitespace-nowrap text-[13px] leading-[17px] font-semibold text-[color:var(--mb-ink)]';
const FLOW_HASH_CLASS =
  'overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[11px] leading-[15px] text-[color:var(--mb-muted)]';
const STEPS_CLASS =
  'magic-bento__steps relative m-0 flex list-none flex-col gap-[2px] p-0 pt-[2px] rounded-[var(--mb-inner-radius)] [background:var(--mb-well)] [box-shadow:inset_0_0_0_1px_var(--mb-well-edge)]';
const RAIL_CLASS = 'absolute top-4 bottom-4 left-[21px] w-px [background:var(--mb-line)]';
const RAIL_FILL_CLASS = 'magic-bento__rail-fill absolute inset-0 origin-top bg-[rgba(var(--mb-accent-rgb),0.55)]';
const STEP_CLASS =
  'relative flex h-[33px] items-center gap-2.5 pr-3 pl-3.5 text-[13px] leading-4 text-[color:var(--mb-ink)]';
const STATUS_CLASS = 'relative grid h-4 w-4 flex-none place-items-center [&>*]:[grid-area:1/1]';
const PENDING_CLASS =
  'magic-bento__pending box-border h-3 w-3 rounded-full border-[1.5px] border-dashed border-[color:var(--mb-faint)] opacity-0';
const SPINNER_CLASS =
  'magic-bento__spinner box-border h-3.5 w-3.5 rounded-full border-[1.5px] border-solid border-[rgba(var(--mb-accent-rgb),0.22)] border-t-[rgb(var(--mb-accent-rgb))] opacity-0';
const DONE_CLASS =
  'magic-bento__done grid h-4 w-4 place-items-center rounded-full text-[color:var(--mb-accent-ink)] [background:rgb(var(--mb-accent-rgb))]';
const STEP_TIME_CLASS = 'magic-bento__step-time ml-auto text-[12px] text-[color:var(--mb-muted)] tabular-nums';
const HUB_CLASS = 'magic-bento__hub relative mx-auto min-h-0 w-full max-w-[240px] flex-1';
const HUB_LINKS_CLASS =
  'magic-bento__hub-links absolute inset-0 h-full w-full overflow-visible [&_line]:[stroke:var(--mb-line)] [&_line]:[stroke-width:1] [&_line]:[vector-effect:non-scaling-stroke]';
const HUB_NODE_CLASS =
  "magic-bento__hub-node absolute top-[var(--y)] left-[var(--x)] -mt-[calc(var(--size)*0.5)] -ml-[calc(var(--size)*0.5)] box-border grid h-[var(--size)] w-[var(--size)] place-items-center rounded-[calc(var(--size)*0.3)] text-[color:var(--mb-ink)] [--size:min(var(--s),30cqh)] [background:var(--mb-tile)] [box-shadow:var(--mb-tile-shadow)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:content-[''] after:[box-shadow:inset_0_0_0_1px_var(--mb-tile-edge),inset_0_1px_0_var(--mb-tile-highlight)]";
const PACKET_CLASS =
  'magic-bento__packet absolute top-[var(--y)] left-[var(--x)] -mt-[2px] -ml-[2px] h-1 w-1 rounded-full opacity-0 [background:rgb(var(--mb-accent-rgb))]';
const SHIELD_CLASS = 'magic-bento__shield flex min-h-0 w-full max-w-[320px] flex-1 flex-col justify-center gap-2';
const SETTING_CLASS =
  "magic-bento__setting relative box-border flex h-8 flex-none items-center gap-2 rounded-[var(--mb-inner-radius)] pr-2 pl-2.5 text-[12.5px] leading-4 font-medium text-[color:var(--mb-ink)] [background:var(--mb-tile)] [box-shadow:var(--mb-tile-shadow)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:content-[''] after:[box-shadow:inset_0_0_0_1px_var(--mb-tile-edge),inset_0_1px_0_var(--mb-tile-highlight)]";
const SETTING_LABEL_CLASS = 'overflow-hidden text-ellipsis whitespace-nowrap';
const SWITCH_CLASS = 'magic-bento__switch relative ml-auto h-4 w-[26px] flex-none rounded-lg';

const SCRIM_STYLE = {
  background:
    'linear-gradient(to top, rgba(10, 9, 13, 0.82) 0%, rgba(10, 9, 13, 0.7) 14%, rgba(10, 9, 13, 0.46) 30%, rgba(10, 9, 13, 0.2) 46%, rgba(10, 9, 13, 0.05) 60%, rgba(10, 9, 13, 0) 72%)'
};

const FALLOFF = [1, 0.973, 0.837, 0.593, 0.317, 0.104, 0.009];

const glowStops = (alpha, weight) =>
  `${FALLOFF.map(
    (fall, index) => `rgba(var(--mb-glow-rgb), calc(var(${alpha}) * var(${weight}, 0) * ${fall})) ${index * 15}%`
  ).join(', ')}, rgba(var(--mb-glow-rgb), 0) 100%`;

const LIGHT_STYLE = {
  background: `radial-gradient(var(--mb-spot-size) circle at var(--mb-x, -999px) var(--mb-y, -999px), ${glowStops('--mb-spot-alpha', '--mb-hot')})`
};

const WAVE = [
  ['0', '110px'],
  ['0.1', '80px'],
  ['0.32', '52px'],
  ['0.68', '28px'],
  ['0.94', '10px'],
  ['1', '3px']
];

const BORDER_STYLE = {
  background: `radial-gradient(var(--mb-border-size) circle at var(--mb-x, -999px) var(--mb-y, -999px), ${glowStops('--mb-glow-alpha', '--mb-near')}), radial-gradient(circle at var(--mb-wx, -999px) var(--mb-wy, -999px), ${WAVE.map(
    ([alpha, offset]) =>
      `rgba(var(--mb-glow-rgb), calc(var(--mb-glow-alpha) * var(--mb-wa, 0) * ${alpha})) calc(var(--mb-wr, 0px) - ${offset})`
  ).join(', ')}, rgba(var(--mb-glow-rgb), 0) var(--mb-wr, 0px))`,
  WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
  WebkitMaskComposite: 'xor',
  mask: 'linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)'
};

const STYLE = `
.magic-bento{--mb-spring:cubic-bezier(0.34, 1.4, 0.64, 1)}
@supports (transition-timing-function: linear(0,1)){.magic-bento{--mb-spring: linear( 0,0.0603,0.2033,0.3821,0.5633,0.7258,0.8584,0.9574,1.0242,1.0634,1.0809,1.0828,1.0747,1.0613,1.046,1.0313,1.0186,1.0085,1.0012,0.9965,0.994,0.9931,0.9933,0.9941,0.9953,0.9966,0.9978,0.9988,1 )}}
.magic-bento[data-intro] .magic-bento__cell{opacity: 0;transform: translate3d(0,16px,0) scale(0.97)}
.magic-bento[data-intro] .magic-bento__cell[data-state='in']{opacity: 1;transform: none;transition: opacity 420ms cubic-bezier(0.22,1,0.36,1) var(--mb-delay),transform 760ms var(--mb-spring) var(--mb-delay)}
@container (max-height: 78px){.magic-bento__setting ~ .magic-bento__setting{display: none}}
@container (max-height: 60px){.magic-bento__hub{display: none}}
@container (max-height: 38px){.magic-bento__shield,.magic-bento__chart,.magic-bento__bars{visibility: hidden}}
.magic-bento__switch{position: relative;width: 26px;height: 16px;flex: none;margin-left: auto;border-radius: 8px;background: rgb(var(--mb-accent-rgb));transition: background-color 220ms ease}
.magic-bento__switch::after{content: '';position: absolute;top: 2px;left: 2px;width: 12px;height: 12px;border-radius: 50%;background: var(--mb-accent-ink);box-shadow: 0 1px 2px rgba(0,0,0,0.3);transform: translateX(10px);transition: transform 320ms var(--mb-spring)}
.magic-bento__switch[data-off]{background: var(--mb-line)}
.magic-bento__switch[data-off]::after{background: var(--mb-ink);transform: none}
.magic-bento[data-motion] .magic-bento__chart-line{stroke-dasharray: 1;animation: magic-bento-draw 1100ms cubic-bezier(0.65,0,0.35,1) calc(var(--mb-delay) + 220ms) both paused}
.magic-bento[data-motion] .magic-bento__chart-area{animation: magic-bento-fade 700ms ease calc(var(--mb-delay) + 700ms) both paused}
.magic-bento[data-motion] .magic-bento__bar{animation: magic-bento-grow 760ms var(--mb-spring) calc(var(--mb-delay) + 200ms + var(--i) * 55ms) both paused}
.magic-bento[data-motion] .magic-bento__pending{animation: magic-bento-wait 1ms linear calc(var(--mb-delay) + 360ms + var(--i) * 520ms) both paused}
.magic-bento[data-motion] .magic-bento__spinner{animation: magic-bento-run 520ms linear calc(var(--mb-delay) + 360ms + var(--i) * 520ms) both paused,magic-bento-spin 700ms linear infinite paused}
.magic-bento[data-motion] .magic-bento__done{animation: magic-bento-check 420ms var(--mb-spring) calc(var(--mb-delay) + 880ms + var(--i) * 520ms) both paused}
.magic-bento[data-motion] .magic-bento__step-time{animation: magic-bento-fade 300ms ease calc(var(--mb-delay) + 880ms + var(--i) * 520ms) both paused}
.magic-bento[data-motion] .magic-bento__rail-fill{animation: magic-bento-rail calc(var(--n) * 520ms) linear calc(var(--mb-delay) + 360ms) both paused}
.magic-bento[data-motion] .magic-bento__hub-node{animation: magic-bento-pop 520ms var(--mb-spring) calc(var(--mb-delay) + 200ms + var(--i) * 70ms) both paused}
.magic-bento[data-motion] .magic-bento__hub-links line{stroke-dasharray: 1;animation: magic-bento-draw 700ms cubic-bezier(0.65,0,0.35,1) calc(var(--mb-delay) + 360ms) both paused}
.magic-bento[data-motion] .magic-bento__card[data-active] .magic-bento__packet{animation: magic-bento-packet 1.8s cubic-bezier(0.45,0,0.55,1) calc(var(--i) * 0.45s) infinite}
.magic-bento[data-motion] .magic-bento__switch{animation: magic-bento-switch-track 420ms ease calc(var(--mb-delay) + 520ms + var(--i) * 200ms) both paused}
.magic-bento[data-motion] .magic-bento__switch::after{animation: magic-bento-switch-knob 520ms var(--mb-spring) calc(var(--mb-delay) + 520ms + var(--i) * 200ms) both paused}
.magic-bento[data-motion] .magic-bento__switch[data-off],.magic-bento[data-motion] .magic-bento__switch[data-off]::after{animation: none}
.magic-bento[data-motion] .magic-bento__cell[data-state='in'] :is( .magic-bento__chart-line,.magic-bento__chart-area,.magic-bento__bar,.magic-bento__pending,.magic-bento__spinner,.magic-bento__done,.magic-bento__step-time,.magic-bento__rail-fill,.magic-bento__hub-node,.magic-bento__hub-links line,.magic-bento__switch ){animation-play-state: running}
.magic-bento[data-motion] .magic-bento__cell[data-state='in'] .magic-bento__switch::after{animation-play-state: running}
.magic-bento[data-motion] .magic-bento__cell[data-state='in'] .magic-bento__spinner{animation-play-state: running,running}
@keyframes magic-bento-draw{from{stroke-dashoffset: 1}to{stroke-dashoffset: 0}}
@keyframes magic-bento-fade{from{opacity: 0}to{opacity: 1}}
@keyframes magic-bento-grow{from{transform: scaleY(0)}to{transform: scaleY(1)}}
@keyframes magic-bento-pop{from{opacity: 0;scale: 0.6}to{opacity: 1;scale: 1}}
@keyframes magic-bento-wait{from{opacity: 1}to{opacity: 0}}
@keyframes magic-bento-run{0%{opacity: 0}1%,92%{opacity: 1}100%{opacity: 0}}
@keyframes magic-bento-spin{to{rotate: 360deg}}
@keyframes magic-bento-check{from{opacity: 0;scale: 0.4}to{opacity: 1;scale: 1}}
@keyframes magic-bento-rail{from{transform: scaleY(0)}to{transform: scaleY(1)}}
@keyframes magic-bento-packet{0%{top: var(--y);left: var(--x);opacity: 0}15%{opacity: 1}80%{opacity: 1}100%{top: 50%;left: 50%;opacity: 0}}
@keyframes magic-bento-switch-track{from{background-color: var(--mb-line)}to{background-color: rgb(var(--mb-accent-rgb))}}
@keyframes magic-bento-switch-knob{from{background: var(--mb-ink);transform: none}to{background: var(--mb-accent-ink);transform: translateX(10px)}}
`;

const vars = (values) => values;

const parseRgb = (value) => {
  if (!value) return null;
  const text = String(value).trim();
  const hex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text);
  if (hex) {
    const full = hex[1].length === 3 ? hex[1].replace(/./g, (digit) => digit + digit) : hex[1];
    return [0, 2, 4].map((index) => parseInt(full.slice(index, index + 2), 16));
  }
  const numbers = text.match(/[\d.]+/g);
  if (numbers && numbers.length >= 3 && /^(rgba?\(|[\d.\s,]+$)/i.test(text)) {
    return numbers.slice(0, 3).map((channel) => clamp(Math.round(parseFloat(channel)), 0, 255));
  }
  return null;
};

const inkFor = (rgb) => {
  const [r, g, b] = rgb.map((channel) => channel / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55 ? '#121016' : '#ffffff';
};

const CHART = [3.1, 3.8, 3.5, 4.9, 4.4, 5.8, 5.3, 6.9, 6.5, 8.2, 9.4, 12.4];

const curve = (values, width, height) => {
  const top = 6;
  const bottom = 2;
  const low = Math.min(...values) * 0.7;
  const high = Math.max(...values);
  const points = values.map((value, index) => [
    (index / (values.length - 1)) * width,
    top + (1 - (value - low) / (high - low)) * (height - top - bottom)
  ]);
  const count = points.length;
  const slopes = [];
  for (let i = 0; i < count - 1; i++) {
    slopes.push((points[i + 1][1] - points[i][1]) / (points[i + 1][0] - points[i][0]));
  }
  const tangents = points.map((_, i) => {
    if (i === 0) return slopes[0];
    if (i === count - 1) return slopes[count - 2];
    return slopes[i - 1] * slopes[i] > 0 ? (slopes[i - 1] + slopes[i]) / 2 : 0;
  });
  for (let i = 0; i < count - 1; i++) {
    if (slopes[i] === 0) {
      tangents[i] = 0;
      tangents[i + 1] = 0;
      continue;
    }
    const a = tangents[i] / slopes[i];
    const b = tangents[i + 1] / slopes[i];
    const length = a * a + b * b;
    if (length > 9) {
      const scale = 3 / Math.sqrt(length);
      tangents[i] = scale * a * slopes[i];
      tangents[i + 1] = scale * b * slopes[i];
    }
  }
  let line = `M${points[0][0].toFixed(2)},${points[0][1].toFixed(2)}`;
  const samples = [];
  for (let i = 0; i < count - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const third = (x1 - x0) / 3;
    const c1 = [x0 + third, y0 + tangents[i] * third];
    const c2 = [x1 - third, y1 - tangents[i + 1] * third];
    line += ` C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${x1.toFixed(2)},${y1.toFixed(2)}`;
    for (let step = 0; step < 12; step++) {
      const t = step / 12;
      const u = 1 - t;
      samples.push([
        u * u * u * x0 + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * x1,
        u * u * u * y0 + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * y1
      ]);
    }
  }
  samples.push(points[count - 1]);
  const area = `${line} L${width.toFixed(2)},${height.toFixed(2)} L0,${height.toFixed(2)} Z`;
  return { line, area, samples };
};

const sampleAt = (samples, x) => {
  let index = 1;
  while (index < samples.length - 1 && samples[index][0] < x) index++;
  const [x0, y0] = samples[index - 1];
  const [x1, y1] = samples[index];
  const t = x1 === x0 ? 0 : clamp((x - x0) / (x1 - x0), 0, 1);
  return y0 + (y1 - y0) * t;
};

const AnalyticsVisual = () => {
  const chartRef = useRef(null);
  const plotRef = useRef(null);
  const scrubRef = useRef(null);
  const dotRef = useRef(null);
  const valueRef = useRef(null);
  const noteRef = useRef(null);
  const [size, setSize] = useState(null);

  useIsomorphicLayoutEffect(() => {
    const plot = plotRef.current;
    if (!plot) return;
    const update = () => {
      const next = { width: plot.clientWidth, height: plot.clientHeight };
      setSize((previous) =>
        previous && previous.width === next.width && previous.height === next.height ? previous : next
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(plot);
    return () => observer.disconnect();
  }, []);

  const shape = useMemo(
    () => (size && size.width > 4 && size.height > 4 ? curve(CHART, size.width, size.height) : null),
    [size]
  );

  const scrub = (event) => {
    const plot = plotRef.current;
    const chart = chartRef.current;
    const line = scrubRef.current;
    const dot = dotRef.current;
    const label = valueRef.current;
    const note = noteRef.current;
    if (!shape || !plot || !chart || !line || !dot || !label || !note) return;
    const rect = plot.getBoundingClientRect();
    const x = clamp(event.clientX - rect.left, 0, rect.width);
    const y = sampleAt(shape.samples, x);
    const position = (x / Math.max(1, rect.width)) * (CHART.length - 1);
    const index = Math.floor(position);
    const next = Math.min(CHART.length - 1, index + 1);
    const value = CHART[index] + (CHART[next] - CHART[index]) * (position - index);
    chart.dataset.scrub = '';
    line.style.transform = `translateX(${x.toFixed(1)}px)`;
    dot.style.transform = `translateY(${y.toFixed(1)}px)`;
    label.textContent = `${value.toFixed(1)}`;
    note.textContent = `Oct ${Math.round(position) + 1}`;
  };

  const rest = () => {
    if (chartRef.current) delete chartRef.current.dataset.scrub;
    if (valueRef.current) valueRef.current.textContent = `${CHART[CHART.length - 1].toFixed(1)}`;
    if (noteRef.current) noteRef.current.textContent = '+18%';
  };

  return (
    <div ref={chartRef} className={CHART_CLASS} onPointerMove={scrub} onPointerDown={scrub} onPointerLeave={rest}>
      <div className={FIGURE_CLASS}>

      </div>
      <div ref={plotRef} className={PLOT_CLASS}>
        {shape && size && (
          <svg viewBox={`0 0 ${size.width} ${size.height}`} aria-hidden="true">
            <path className={CHART_AREA_CLASS} d={shape.area} />
            <path className={CHART_LINE_CLASS} d={shape.line} pathLength="1" />
          </svg>
        )}
        <span ref={scrubRef} className={SCRUB_CLASS}>
          <span ref={dotRef} className={SCRUB_DOT_CLASS} />
        </span>
      </div>
    </div>
  );
};

const BARS = [86, 87, 83, 79, 82, 81, 83];

const DashboardVisual = () => (
  <div className={BARS_CLASS}>
    <div className={FIGURE_CLASS}>
      <span className={FIGURE_VALUE_CLASS}>8.3</span>
      <span className={FIGURE_NOTE_CLASS}>Overall CGPA</span>
    </div>
    <div className={BARS_PLOT_CLASS}>
      {BARS.map((height, index) => (
        <span
          key={index}
          className={BAR_CLASS}
          data-peak={height === Math.max(...BARS) ? '' : undefined}
          style={vars({ '--h': height / 100, '--i': index })}
        />
      ))}
    </div>
  </div>
);

const STEPS = [
  { label: 'Install', time: '8s' },
  { label: 'Build', time: '12s' },
  { label: 'Test', time: '48s' },
  { label: 'Deploy', time: '9s' }
];

const AutomationVisual = () => (
  <div className={FLOW_CLASS} style={vars({ '--n': STEPS.length })}>
    <div className={FLOW_TRIGGER_CLASS}>
      <span className={FLOW_GLYPH_CLASS}>
        <GitBranchIcon size={15} strokeWidth={1.8} />
      </span>
      <span className={FLOW_COPY_CLASS}>
        <span className={FLOW_NAME_CLASS}>Push to main</span>
        <span className={FLOW_HASH_CLASS}>a1c9f3e</span>
      </span>
    </div>
    <ol className={STEPS_CLASS}>
      <span className={RAIL_CLASS} aria-hidden="true">
        <span className={RAIL_FILL_CLASS} />
      </span>
      {STEPS.map((step, index) => (
        <li key={step.label} className={STEP_CLASS} style={vars({ '--i': index })}>
          <span className={STATUS_CLASS}>
            <span className={PENDING_CLASS} />
            <span className={SPINNER_CLASS} />
            <span className={DONE_CLASS}>
              <TickIcon size={11} strokeWidth={2.6} />
            </span>
          </span>
          {step.label}
          <span className={STEP_TIME_CLASS}>{step.time}</span>
        </li>
      ))}
    </ol>
  </div>
);

const APPS = [
  { Glyph: SlackIcon, x: '17%', y: '24%' },
  { Glyph: GithubIcon, x: '83%', y: '24%' },
  { Glyph: FigmaIcon, x: '17%', y: '78%' },
  { Glyph: NotionIcon, x: '83%', y: '78%' }
];

const IntegrationVisual = () => (
  <div className={HUB_CLASS}>
    <svg className={HUB_LINKS_CLASS} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {APPS.map((app) => (
        <line key={app.x + app.y} x1={parseFloat(app.x)} y1={parseFloat(app.y)} x2="50" y2="51" pathLength="1" />
      ))}
    </svg>
    {APPS.map((app, index) => (
      <span
        key={`packet-${index}`}
        className={PACKET_CLASS}
        style={vars({ '--x': app.x, '--y': app.y, '--i': index })}
      />
    ))}
    {APPS.map((app, index) => (
      <span
        key={app.x + app.y}
        className={HUB_NODE_CLASS}
        style={vars({ '--x': app.x, '--y': app.y, '--s': '26px', '--i': index + 1 })}
      >
        <app.Glyph size={14} strokeWidth={1.8} />
      </span>
    ))}
    <span className={HUB_NODE_CLASS} style={vars({ '--x': '50%', '--y': '51%', '--s': '34px', '--i': 0 })}>
      <SparklesIcon size={17} strokeWidth={1.8} />
    </span>
  </div>
);

const SETTINGS = [
  { Glyph: KeyIcon, label: 'SSO' },
  { Glyph: FingerPrintIcon, label: '2FA' }
];

const SecurityVisual = () => (
  <div className={SHIELD_CLASS}>
    {SETTINGS.map((setting, index) => (
      <div key={setting.label} className={SETTING_CLASS}>
        <setting.Glyph size={14} strokeWidth={1.8} />
        <span className={SETTING_LABEL_CLASS}>{setting.label}</span>
        <span className={SWITCH_CLASS} style={vars({ '--i': index })} />
      </div>
    ))}
  </div>
);

const VISUALS = {
  analytics: AnalyticsVisual,
  dashboard: DashboardVisual,
  automation: AutomationVisual,
  integration: IntegrationVisual,
  security: SecurityVisual
};

const REPLAY = new Set([
  'magic-bento-draw',
  'magic-bento-fade',
  'magic-bento-grow',
  'magic-bento-pop',
  'magic-bento-wait',
  'magic-bento-run',
  'magic-bento-check',
  'magic-bento-rail',
  'magic-bento-switch-track',
  'magic-bento-switch-knob'
]);

const FLOW = new Set([
  'magic-bento-wait',
  'magic-bento-run',
  'magic-bento-check',
  'magic-bento-rail',
  'magic-bento-fade'
]);

const finite = (animation) => {
  const timing = animation.effect?.getTiming?.();
  return timing ? timing.iterations !== Infinity : false;
};

const nameOf = (animation) => animation.animationName || '';

const MagicBento = ({
  items,
  columns = 4,
  rowHeight = 200,
  gap = 12,
  radius = 20,
  theme = 'dark',
  glowColor,
  textAutoHide = true,
  enableBorderGlow = true,
  enableSpotlight = true,
  spotlightRadius = 300,
  enableStars = false,
  particleCount = 24,
  enableTilt = false,
  enableMagnetism = false,
  clickEffect = true,
  intro = true,
  disableAnimations = false,
  onItemClick,
  className = '',
  style
}) => {
  const rootRef = useRef(null);
  const cellRefs = useRef([]);
  const cardRefs = useRef([]);
  const starRefs = useRef([]);
  const engineRef = useRef(null);
  const [cols, setCols] = useState(Math.max(1, Math.round(columns)));

  const palette = theme === 'light' ? 'light' : 'dark';
  const glow = parseRgb(glowColor) ?? INK[palette];
  const settings = {
    items,
    columns: Math.max(1, Math.round(columns)),
    gap: Math.max(0, gap),
    enableBorderGlow,
    enableSpotlight,
    spotlightRadius: Math.max(40, spotlightRadius),
    enableStars,
    particleCount: clamp(Math.round(particleCount), 0, 120),
    enableTilt,
    enableMagnetism,
    clickEffect,
    intro,
    disableAnimations,
    onItemClick,
    glow
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motion = !settingsRef.current.disableAnimations && !reduced;
    const playIntro = motion && settingsRef.current.intro;
    if (motion) root.dataset.motion = '';
    else delete root.dataset.motion;
    if (playIntro) root.dataset.intro = '';
    else delete root.dataset.intro;

    const pointer = { x: -1e5, y: -1e5, inside: false, down: -1 };
    const light = { x: -1e5, y: -1e5, near: 0, ready: false };
    const states = [];
    const wave = { x: 0, y: 0, t: -1, duration: 1.1, reach: 800 };
    let rects = [];
    let bounds = null;
    let dirty = true;
    let raf = 0;
    let last = 0;
    let visible = true;
    let entered = !playIntro;
    let settleTimer = 0;
    let introTimer = 0;
    const lastFlow = [];

    const stateFor = (index) => {
      if (!states[index]) {
        states[index] = {
          hot: 0,
          rx: 0,
          ry: 0,
          tx: 0,
          ty: 0,
          vrx: 0,
          vry: 0,
          vtx: 0,
          vty: 0,
          press: 1,
          vpress: 0,
          stars: 0,
          particles: null,
          active: false,
          written: {}
        };
      }
      return states[index];
    };

    const write = (element, state, name, value) => {
      if (state.written[name] === value) return;
      state.written[name] = value;
      element.style.setProperty(name, value);
    };

    const measure = () => {
      dirty = false;
      bounds = root.getBoundingClientRect();
      rects = cellRefs.current.map((cell) => (cell ? cell.getBoundingClientRect() : null));
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      starRefs.current.forEach((canvas, index) => {
        const rect = rects[index];
        if (!canvas || !rect) return;
        const width = Math.max(1, Math.round(rect.width * ratio));
        const height = Math.max(1, Math.round(rect.height * ratio));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
      });
    };

    const seed = (index, rect) => {
      const count = settingsRef.current.particleCount;
      const state = stateFor(index);
      if (state.particles && state.particles.length === count) return state.particles;
      state.particles = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 6,
        vy: -4 - Math.random() * 10,
        size: 0.6 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
        rate: 1.2 + Math.random() * 2.4
      }));
      return state.particles;
    };

    const drawStars = (index, rect, state, lx, ly, dt, now) => {
      const canvas = starRefs.current[index];
      if (!canvas) return;
      const context = canvas.getContext('2d');
      if (!context) return;
      const ratio = canvas.width / Math.max(1, rect.width);
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (state.stars < 0.004) return;
      const s = settingsRef.current;
      const particles = seed(index, rect);
      const reach = s.spotlightRadius * 0.75;
      const [r, g, b] = s.glow;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      for (const particle of particles) {
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        if (particle.y < -4) {
          particle.y = rect.height + 4;
          particle.x = Math.random() * rect.width;
        }
        if (particle.x < -4) particle.x = rect.width + 4;
        if (particle.x > rect.width + 4) particle.x = -4;
        const distance = Math.hypot(particle.x - lx, particle.y - ly) / reach;
        if (distance >= 1) continue;
        const falloff = 1 - distance * distance * (3 - 2 * distance);
        const twinkle = 0.55 + 0.45 * Math.sin(now * 0.001 * particle.rate + particle.phase);
        const alpha = state.stars * falloff * twinkle;
        if (alpha < 0.01) continue;
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }
    };

    const replay = (card, filter) => {
      if (!motion || !card.getAnimations) return;
      for (const animation of card.getAnimations({ subtree: true })) {
        if (!filter.has(nameOf(animation)) || !finite(animation)) continue;
        animation.currentTime = 0;
        animation.play();
      }
    };

    const startWave = (x, y, duration) => {
      if (!motion || !bounds) return;
      wave.x = x;
      wave.y = y;
      wave.t = 0;
      wave.duration = duration;
      wave.reach =
        Math.max(
          Math.hypot(x - bounds.left, y - bounds.top),
          Math.hypot(x - bounds.right, y - bounds.top),
          Math.hypot(x - bounds.left, y - bounds.bottom),
          Math.hypot(x - bounds.right, y - bounds.bottom)
        ) + 140;
    };

    const frame = (now) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      if (dirty) measure();
      const s = settingsRef.current;
      const cards = cardRefs.current;
      let busy = false;

      const margin = s.spotlightRadius * 0.5;
      const near =
        pointer.inside &&
        bounds &&
        pointer.x > bounds.left - margin &&
        pointer.x < bounds.right + margin &&
        pointer.y > bounds.top - margin &&
        pointer.y < bounds.bottom + margin
          ? 1
          : 0;
      if (!light.ready && near) {
        light.x = pointer.x;
        light.y = pointer.y;
        light.ready = true;
      }
      const follow = 1 - Math.exp(-dt / 0.05);
      light.x += (pointer.x - light.x) * follow;
      light.y += (pointer.y - light.y) * follow;
      const fade = 1 - Math.exp(-dt / (near > light.near ? 0.12 : 0.4));
      light.near += (near - light.near) * fade;
      if (Math.abs(near - light.near) < 0.002) light.near = near;
      else busy = true;
      if (Math.abs(pointer.x - light.x) + Math.abs(pointer.y - light.y) > 0.3) busy = true;

      let waveRadius = 0;
      let waveAlpha = 0;
      if (wave.t >= 0) {
        wave.t += dt;
        const progress = Math.min(1, wave.t / wave.duration);
        waveRadius = wave.reach * (1 - Math.pow(1 - progress, 2.2));
        waveAlpha = Math.pow(1 - progress, 1.3);
        if (progress >= 1) {
          wave.t = -1;
          waveAlpha = 0;
        } else busy = true;
      }

      cards.forEach((card, index) => {
        const rect = rects[index];
        if (!card || !rect) return;
        const state = stateFor(index);
        const lx = light.x - rect.left;
        const ly = light.y - rect.top;
        const px = pointer.x - rect.left;
        const py = pointer.y - rect.top;
        const inside = pointer.inside && entered && px >= 0 && py >= 0 && px <= rect.width && py <= rect.height;

        if (inside !== state.active) {
          state.active = inside;
          if (inside) {
            card.dataset.active = '';
            if (now - (lastFlow[index] || -1e9) > 3200 && card.querySelector('.magic-bento__steps')) {
              lastFlow[index] = now;
              replay(card, FLOW);
            }
          } else delete card.dataset.active;
        }

        const hotTarget = inside && s.enableSpotlight ? 1 : 0;
        state.hot += (hotTarget - state.hot) * (1 - Math.exp(-dt / (hotTarget > state.hot ? 0.14 : 0.32)));
        if (Math.abs(hotTarget - state.hot) < 0.002) state.hot = hotTarget;
        else busy = true;

        const u = clamp(px / Math.max(1, rect.width), 0, 1) - 0.5;
        const v = clamp(py / Math.max(1, rect.height), 0, 1) - 0.5;
        const tilt = inside && s.enableTilt && motion;
        const magnet = inside && s.enableMagnetism && motion;
        const targets = [
          tilt ? -v * 2 * TILT : 0,
          tilt ? u * 2 * TILT : 0,
          magnet ? u * 2 * MAGNET : 0,
          magnet ? v * 2 * MAGNET : 0
        ];
        const keys = [
          ['rx', 'vrx'],
          ['ry', 'vry'],
          ['tx', 'vtx'],
          ['ty', 'vty']
        ];
        const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
        const h = dt / steps;
        keys.forEach(([key, velocity], k) => {
          for (let step = 0; step < steps; step++) {
            state[velocity] += (170 * (targets[k] - state[key]) - 20 * state[velocity]) * h;
            state[key] += state[velocity] * h;
          }
          if (Math.abs(targets[k] - state[key]) < 0.002 && Math.abs(state[velocity]) < 0.01) {
            state[key] = targets[k];
            state[velocity] = 0;
          } else busy = true;
        });
        const pressTarget = pointer.down === index && s.clickEffect && motion ? 0.985 : 1;
        for (let step = 0; step < steps; step++) {
          state.vpress += (420 * (pressTarget - state.press) - 28 * state.vpress) * h;
          state.press += state.vpress * h;
        }
        if (Math.abs(pressTarget - state.press) < 0.0002 && Math.abs(state.vpress) < 0.001) {
          state.press = pressTarget;
          state.vpress = 0;
        } else busy = true;

        write(card, state, '--mb-x', `${lx.toFixed(1)}px`);
        write(card, state, '--mb-y', `${ly.toFixed(1)}px`);
        write(card, state, '--mb-near', (s.enableBorderGlow ? light.near : 0).toFixed(3));
        write(card, state, '--mb-hot', state.hot.toFixed(3));
        write(card, state, '--mb-rx', `${state.rx.toFixed(3)}deg`);
        write(card, state, '--mb-ry', `${state.ry.toFixed(3)}deg`);
        write(card, state, '--mb-tx', `${state.tx.toFixed(2)}px`);
        write(card, state, '--mb-ty', `${state.ty.toFixed(2)}px`);
        write(card, state, '--mb-press', state.press.toFixed(4));
        write(card, state, '--mb-wx', `${(wave.x - rect.left).toFixed(1)}px`);
        write(card, state, '--mb-wy', `${(wave.y - rect.top).toFixed(1)}px`);
        write(card, state, '--mb-wr', `${waveRadius.toFixed(1)}px`);
        write(card, state, '--mb-wa', waveAlpha.toFixed(3));

        if (s.enableStars && starRefs.current[index]) {
          const starTarget = inside && motion ? 1 : 0;
          state.stars += (starTarget - state.stars) * (1 - Math.exp(-dt / (starTarget ? 0.3 : 0.5)));
          if (state.stars < 0.004 && !starTarget) state.stars = 0;
          if (state.stars > 0 || starTarget) {
            drawStars(index, rect, state, lx, ly, dt, now);
            state.drawn = true;
            busy = true;
          } else if (state.drawn) {
            drawStars(index, rect, state, lx, ly, dt, now);
            state.drawn = false;
          }
        }
      });

      if (busy && visible) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (raf || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const cardIndex = (target) => {
      if (!(target instanceof Element)) return -1;
      const card = target.closest('.magic-bento__card');
      return card instanceof HTMLElement ? cardRefs.current.indexOf(card) : -1;
    };

    const onPointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.inside = true;
      wake();
    };

    const onPointerOut = (event) => {
      if (event.relatedTarget) return;
      pointer.inside = false;
      pointer.down = -1;
      wake();
    };

    const onPointerDown = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.inside = true;
      pointer.down = cardIndex(event.target);
      wake();
    };

    const release = () => {
      if (pointer.down < 0) return;
      pointer.down = -1;
      wake();
    };

    const activate = (index, x, y) => {
      const s = settingsRef.current;
      const card = cardRefs.current[index];
      if (!card) return;
      if (s.clickEffect) {
        if (dirty) measure();
        startWave(x, y, 1.1);
        replay(card, REPLAY);
        lastFlow[index] = performance.now();
      }
      wake();
    };

    const onClick = (event) => {
      const index = cardIndex(event.target);
      const card = cardRefs.current[index];
      if (!card) return;
      if (event.detail === 0) {
        const rect = card.getBoundingClientRect();
        activate(index, rect.left + rect.width / 2, rect.top + rect.height / 2);
      } else activate(index, event.clientX, event.clientY);
    };

    const onKeyDown = (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const card = cardRefs.current[cardIndex(event.target)];
      if (!card || event.target !== card || card.tagName === 'A') return;
      event.preventDefault();
      card.click();
    };

    const onScroll = () => {
      dirty = true;
      wake();
    };

    const resizeObserver = new ResizeObserver(() => {
      const s = settingsRef.current;
      const width = root.clientWidth;
      const cell = (count) => (width - s.gap * (count - 1)) / count;
      const next = cell(s.columns) >= MIN_CELL ? s.columns : s.columns >= 2 && cell(2) >= MIN_PAIR ? 2 : 1;
      setCols(next);
      dirty = true;
      wake();
    });
    resizeObserver.observe(root);

    const enter = () => {
      entered = true;
      let order = 0;
      cellRefs.current.forEach((cell) => {
        if (!cell) return;
        cell.style.setProperty('--mb-delay', `${order++ * STAGGER}ms`);
        cell.dataset.state = 'in';
      });
      if (dirty) measure();
      introTimer = window.setTimeout(() => {
        if (bounds) startWave(bounds.left, bounds.top, 1.7);
        wake();
      }, 260);
      settleTimer = window.setTimeout(
        () => {
          cellRefs.current.forEach((cell) => cell?.style.setProperty('--mb-delay', '0ms'));
        },
        order * STAGGER + 2600
      );
      wake();
    };

    let gate = null;
    if (playIntro && typeof IntersectionObserver !== 'undefined') {
      gate = new IntersectionObserver(
        (entries, observer) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer.disconnect();
          enter();
        },
        { threshold: 0.15 }
      );
      gate.observe(root);
    } else {
      cellRefs.current.forEach((cell) => {
        if (!cell) return;
        cell.style.setProperty('--mb-delay', '0ms');
        cell.dataset.state = 'in';
      });
      if (motion) {
        for (const animation of root.getAnimations ? root.getAnimations({ subtree: true }) : []) {
          if (REPLAY.has(nameOf(animation)) && finite(animation)) animation.finish();
        }
      }
    }

    const visibility = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) {
        dirty = true;
        wake();
      }
    });
    visibility.observe(root);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', release, { passive: true });
    window.addEventListener('pointercancel', release, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', onScroll, { passive: true });
    document.addEventListener('pointerout', onPointerOut);
    root.addEventListener('click', onClick);
    root.addEventListener('keydown', onKeyDown);

    engineRef.current = {
      sync: () => {
        cellRefs.current.forEach((cell) => {
          if (!cell || (!entered && playIntro)) return;
          if (cell.dataset.state !== 'in') {
            cell.style.setProperty('--mb-delay', '0ms');
            cell.dataset.state = 'in';
          }
        });
        dirty = true;
        wake();
      }
    };

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settleTimer);
      window.clearTimeout(introTimer);
      gate?.disconnect();
      visibility.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      window.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('pointerout', onPointerOut);
      root.removeEventListener('click', onClick);
      root.removeEventListener('keydown', onKeyDown);
      engineRef.current = null;
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    engineRef.current?.sync();
  }, [items, cols, rowHeight, gap, radius, enableStars, enableSpotlight, enableBorderGlow]);

  const ink = INK[palette];
  const accent = parseRgb(glowColor) ?? ink;
  const corner = Math.max(0, radius);
  const span = Math.max(1, cols);

  cellRefs.current.length = items.length;
  cardRefs.current.length = items.length;
  starRefs.current.length = items.length;

  return (
    <div
      ref={rootRef}
      className={`${ROOT_CLASS} ${className}`.trim()}
      data-autohide={textAutoHide ? '' : undefined}
      data-motion={disableAnimations ? undefined : ''}
      data-intro={intro && !disableAnimations ? '' : undefined}
      style={{
        ...vars({
          ...THEMES[palette],
          '--mb-glow-rgb': glow.join(', '),
          '--mb-accent-rgb': accent.join(', '),
          '--mb-accent-ink': inkFor(accent),
          '--mb-radius': `${corner}px`,
          '--mb-inner-radius': `${Math.round(clamp(corner * 0.5, 6, 12))}px`,
          '--mb-pad': `${Math.round(clamp(corner * 0.85, 14, 20))}px`,
          '--mb-spot-size': `${Math.max(40, spotlightRadius)}px`,
          '--mb-border-size': `${Math.round(Math.max(40, spotlightRadius) * 0.75)}px`
        }),
        gridTemplateColumns: `repeat(${span}, minmax(0, 1fr))`,
        gridAutoRows: span === 1 ? `minmax(${rowHeight}px, auto)` : `${rowHeight}px`,
        gap: `${Math.max(0, gap)}px`,
        ...style
      }}
    >
      <style>{STYLE}</style>
      {items.map((item, index) => {
        const entry = item ?? {};
        const Visual = typeof entry.visual === 'string' ? VISUALS[entry.visual] : null;
        const visual = Visual ? <Visual /> : typeof entry.visual === 'string' ? null : entry.visual;
        const clickable = Boolean(entry.href || entry.onClick || onItemClick);
        const handleClick = (event) => {
          entry.onClick?.(event);
          onItemClick?.(entry, index);
        };
        const cardProps = {
          ref: (element) => {
            cardRefs.current[index] = element;
          },
          className: CARD_CLASS,
          'data-clickable': clickable ? '' : undefined,
          'data-image': entry.image ? '' : undefined,
          onClick: clickable ? handleClick : undefined
        };
        const body = (
          <>
            {entry.image && <img className={IMAGE_CLASS} src={entry.image} alt="" draggable={false} />}
            {entry.image && <span className={SCRIM_CLASS} style={SCRIM_STYLE} />}
            {enableSpotlight && <span className={LIGHT_CLASS} style={LIGHT_STYLE} />}
            {enableStars && (
              <canvas
                ref={(element) => {
                  starRefs.current[index] = element;
                }}
                className={STARS_CLASS}
                aria-hidden="true"
              />
            )}
            <div className={CONTENT_CLASS}>
              {entry.content ?? (
                <>
                  {(entry.icon || entry.label) && (
                    <div className={HEADER_CLASS}>
                      {entry.icon && <span className={ICON_CLASS}>{entry.icon}</span>}
                      {entry.label && <span className={LABEL_CLASS}>{entry.label}</span>}
                    </div>
                  )}
                  {visual && (
                    <div className={VISUAL_CLASS} aria-hidden={entry.interactive ? undefined : 'true'}>
                      {visual}
                    </div>
                  )}
                  {(entry.title || entry.description) && (
                    <div className={TEXT_CLASS}>
                      {entry.title && <h3 className={TITLE_CLASS}>{entry.title}</h3>}
                      {entry.description && <p className={DESCRIPTION_CLASS}>{entry.description}</p>}
                    </div>
                  )}
                </>
              )}
            </div>
            <span className={RIM_CLASS} />
            <span className={BORDER_CLASS} style={BORDER_STYLE} />
          </>
        );

        return (
          <div
            key={entry.id ?? index}
            ref={(element) => {
              cellRefs.current[index] = element;
            }}
            className={CELL_CLASS}
            style={{
              gridColumn: `span ${Math.min(span, Math.max(1, Math.round(entry.colSpan ?? 1)))}`,
              gridRow: `span ${Math.max(1, Math.round(entry.rowSpan ?? 1))}`
            }}
          >
            {entry.href ? (
              <a {...cardProps} href={entry.href} target={entry.target} rel={entry.rel}>
                {body}
              </a>
            ) : (
              <div
                {...cardProps}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
                aria-label={clickable ? entry.title : undefined}
              >
                {body}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   RESUME FOLDER  — replaces the old "Collaboration" tile
   Six paper sheets (from the resume) live inside the folder.
   Click folder → sheets fan out · click a sheet → zoom · drag to pull out.
═══════════════════════════════════════════════════════════════════════ */
const px = (n) => `calc(${n}px * var(--folder-scale))`;

const ResumeSheet = ({ kicker, title, lines }) => (
  <div className="box-border flex h-full flex-col overflow-hidden" style={{ padding: `${px(11)} ${px(10)}`, gap: px(3.5) }}>
    <span
      className="font-bold uppercase leading-none"
      style={{ fontSize: px(5.2), letterSpacing: '0.16em', color: 'var(--folder-paper-ink-strong)' }}
    >
      {kicker}
    </span>
    <span
      className="font-bold tracking-tight"
      style={{ fontSize: px(9.6), lineHeight: 1.15, color: 'var(--folder-paper-text)' }}
    >
      {title}
    </span>
    <span
      className="flex-none rounded-full"
      style={{ height: px(1.4), width: px(20), background: '#18181b', margin: `${px(1)} 0 ${px(2)}` }}
    />
    {lines.map((line) => (
      <span key={line} style={{ fontSize: px(6.2), lineHeight: 1.38, color: '#3f3f46' }}>
        {line}
      </span>
    ))}
  </div>
);

const RESUME_SHEETS = [
  <ResumeSheet
    key="profile"
    kicker="Profile"
    title="Beereshkumar B C"
    lines={[
      'Final-year CSE student and freelance full-stack developer.',
      'MERN, Java and Web3 — scalable, user-centric apps.',
      'Davanagere, Karnataka',
      'bcbeereshkumar@gmail.com',
      '+91 63609 95219',
    ]}
  />,
  <ResumeSheet
    key="education"
    kicker="Education"
    title="GM Institute of Technology"
    lines={[
      'B.E. Computer Science · CGPA 8.3/10 · Jun 2027',
      'RTES PU College · Science · 92% · 2023',
      'Govt. High School, Hulikatti · SSLC · 98% · 2021',
    ]}
  />,
  <ResumeSheet
    key="skills"
    kicker="Skills"
    title="Technical Stack"
    lines={[
      'JavaScript, Java, Python, Solidity, DSA',
      'React, Node, Express, Spring Boot, MongoDB',
      'Vercel, Render, Cloudinary, Git, Tailwind, Figma',
      'Ethereum, Hedera, Hardhat, Ethers.js, IPFS',
    ]}
  />,
  <ResumeSheet
    key="experience"
    kicker="Experience"
    title="Developer & Organizer"
    lines={[
      'Software Developer, GMIT CSE (2026–now): 500+ users, 60% less admin work via Gemini API.',
      'Freelance Full-Stack: 5+ apps deployed.',
      'Lead Organizer, InterConnect 26.0: 200+ users, 100% uptime.',
    ]}
  />,
  <ResumeSheet
    key="projects"
    kicker="Projects"
    title="Selected Work"
    lines={[
      'PDMS — AI curriculum management',
      'GMU-CSE Community Platform',
      'TejasDairy — dairy management',
      'Influancaa — influencer–brand matchmaking',
      'More on GitHub: beereshbc',
    ]}
  />,
  <ResumeSheet
    key="achievements"
    kicker="Achievements"
    title="Recognition"
    lines={[
      'JEE Main 2023 · AIR 94,007 (NTA 76.06)',
      'NATA 2023 · Score 94 · State Rank 311',
      'NMMS 2018 · Top 4.26% statewide',
      'Tech Lead & Organizer, InterConnect 26.0',
    ]}
  />,
];

const DOWNLOAD_CLASS =
  'absolute right-0 top-0 z-10 inline-flex items-center gap-1.5 rounded-[9px] px-2.5 py-1.5 text-[11px] leading-none font-semibold text-[color:var(--mb-ink)] no-underline [background:var(--mb-tile)] [box-shadow:var(--mb-tile-shadow),inset_0_0_0_1px_var(--mb-tile-edge)] transition-transform duration-150 hover:-translate-y-px active:scale-[0.97]';

const ResumeFolderVisual = () => {
  const wrapRef = useRef(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useIsomorphicLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const update = () =>
      setBox((prev) => (prev.w === el.clientWidth && prev.h === el.clientHeight ? prev : { w: el.clientWidth, h: el.clientHeight }));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const size = box.w > 0 && box.h > 0
    ? Math.round(clamp(Math.min(box.w / (224 * 2.1), box.h / (196 * 1.5)), 0.5, 1.6) * 20) / 20
    : 0;

  return (
    <div
      ref={wrapRef}
      className="relative flex h-full w-full items-center justify-center"
      style={{ paddingTop: Math.round(size * 30) }}
    >
      {size > 0 && (
        <Folder
          mode="flap"
          variant="solid"
          layout="spread"
          color="#f2b84b"
          paperColor="#ffffff"
          tabPosition="right"
          openOn="click"
          size={size}
          tilt={0.35}
          bounce={0.4}
          speed={1}
          peek
          intro={false}
          draggable
          zoomOnClick
          theme="dark"
          label="Resume"
          items={RESUME_SHEETS}
        />
      )}
      <a href={RESUME_FILE} download className={DOWNLOAD_CLASS} aria-label="Download resume">
        <DownloadIcon size={13} strokeWidth={2.2} />
        <span>Resume</span>
      </a>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   BENTO ITEMS — identical to the original set, with Collaboration
   swapped for the resume folder (same 2×2 footprint & position).
═══════════════════════════════════════════════════════════════════════ */
const BENTO_ITEMS = [
  { title: 'Analytics', description: 'Skill', visual: 'analytics' },
  { title: 'Dashboard', description: 'Centralized GPA view', visual: 'dashboard' },
  {
    title: 'Resume & Credentials',
    description: 'Open the folder to browse my story',
    visual: <ResumeFolderVisual />,
    interactive: true,
    colSpan: 2,
    rowSpan: 2
  },
  { title: 'Automation', description: 'Streamline workflows', visual: 'automation', colSpan: 2, rowSpan: 2 },
  { title: 'Integration', description: 'Connect favorite tools', visual: 'integration' },
  { title: 'Security', description: 'Enterprise-grade protection', visual: 'security' }
];

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════ */
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const Me = () => {
  const isMobile = useMobileDetection();
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="me"
      ref={sectionRef}
      className="relative w-full min-h-[100dvh] bg-[#fafafa] text-zinc-900 flex flex-col items-center pt-24 pb-2 px-5 sm:px-10 lg:px-20 overflow-hidden z-20"
    >
      {/* Grid background */}
  

      {/* Top scrolling ribbon */}
      <div className="w-full mb-16 sm:mb-24 overflow-hidden font-clash relative z-10">
        <TextLoop text="Creative Developer ✦ Full Stack ✦ Web3 ✦ " speed={50} fontSize={isMobile ? 44 : 76} />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto">
        {/* Header */}
        <div
          className="flex flex-col mb-10 sm:mb-14"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'none' : 'translateY(20px)',
            transition: `opacity 700ms ${EASE}, transform 700ms ${EASE}`,
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 md:w-12 bg-zinc-900" />
            <span className="font-primary text-[10px] sm:text-xs uppercase tracking-[0.4em] text-zinc-900 font-bold">
              Behind the Code
            </span>
          </div>
          <h2 className="font-secondary font-light  text-[44px] sm:text-[64px] md:text-[84px] text-zinc-900 leading-[0.9]">
            The Architect.
          </h2>
        </div>

        {/* Magic Bento grid (Collaboration tile → Resume folder) */}
        <div
          className="w-full"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'none' : 'translateY(24px)',
            transition: `opacity 800ms ${EASE} 150ms, transform 800ms ${EASE} 150ms`,
          }}
        >
          <MagicBento
            items={BENTO_ITEMS}
            columns={4}
            rowHeight={200}
            gap={12}
            radius={20}
            enableBorderGlow
            enableSpotlight
            spotlightRadius={300}
            clickEffect
            enableStars={false}
            particleCount={24}
            enableTilt={false}
            enableMagnetism={false}
            textAutoHide
            intro
          />
        </div>
      </div>
    </section>
  );
};

export default Me;