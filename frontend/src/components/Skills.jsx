// Skills.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Matter from 'matter-js';
import {
  Globe,
  Hexagon,
  Brain,
  Cpu,
  Server,
  Paintbrush,
  ChevronLeft,
  ChevronRight,
  Palette, // Used to replace SiCanva
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   REAL TECH STACK LOGOS
   - Removed: SiCanva (does not exist in react-icons/si)
   - SiOpenai may also be removed in some versions; if an error
     is reported, replace it with Sparkles from lucide
═══════════════════════════════════════════════════════════ */
import {
  SiReact,
  SiJavascript,
  SiTypescript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiMongoose,
  SiTailwindcss,
  SiRedux,
  SiSolidity,
  SiEthereum,
  SiWeb3Dotjs,
  SiIpfs,
  SiPython,
  SiTensorflow,
  SiScikitlearn,
  SiPandas,
  SiGooglegemini,
  SiC,
  SiSpringboot,
  SiApachekafka,
  SiHibernate,
  SiJsonwebtokens,
  SiDocker,
  SiGit,
  SiGithub,
  SiPostman,
  SiVercel,
  SiFigma,
  SiLangchain,
  SiHedera,
} from "react-icons/si";
import { FaAws } from "react-icons/fa6";

/* ═══════════════════════════════════════════════════════════
   FALLING TEXT COMPONENT
═══════════════════════════════════════════════════════════ */
const FallingText = ({
  text = '',
  highlightWords = [],
  trigger = 'auto',
  backgroundColor = 'transparent',
  wireframes = false,
  gravity = 0.56,
  mouseConstraintStiffness = 0.2,
  fontSize = '1rem',
  className = ''
}) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const [effectStarted, setEffectStarted] = useState(false);

  useEffect(() => {
    if (!textRef.current) return;
    const words = text.split(' ');
    const newHTML = words
      .map(word => {
        const cleanWord = word.replace(/[.,!?;:]/g, '');
        const isHighlighted = highlightWords.some(hw => cleanWord.startsWith(hw));
        return `<span class="inline-block mx-[2px] select-none ${isHighlighted ? 'text-zinc-900 font-bold' : 'text-zinc-600'}">${word}</span>`;
      })
      .join(' ');
    textRef.current.innerHTML = newHTML;
  }, [text, highlightWords]);

  useEffect(() => {
    if (trigger === 'auto') { setEffectStarted(true); return; }
    if (trigger === 'scroll' && containerRef.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { setEffectStarted(true); observer.disconnect(); }
      }, { threshold: 0.1 });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [trigger]);

  useEffect(() => {
    if (!effectStarted) return;
    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;
    const containerRect = containerRef.current.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;
    if (width <= 0 || height <= 0) return;

    const engine = Engine.create();
    engine.world.gravity.y = gravity;
    const render = Render.create({
      element: canvasContainerRef.current,
      engine,
      options: { width, height, background: backgroundColor, wireframes }
    });
    const boundaryOptions = { isStatic: true, render: { fillStyle: 'transparent' } };
    const floor = Bodies.rectangle(width / 2, height + 25, width, 50, boundaryOptions);
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, boundaryOptions);
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, boundaryOptions);
    const ceiling = Bodies.rectangle(width / 2, -25, width, 50, boundaryOptions);

    const wordSpans = textRef.current.querySelectorAll('span');
    const wordBodies = [...wordSpans].map(elem => {
      const rect = elem.getBoundingClientRect();
      const cRect = containerRef.current.getBoundingClientRect();
      const x = rect.left - cRect.left + rect.width / 2;
      const y = rect.top - cRect.top + rect.height / 2;
      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        render: { fillStyle: 'transparent' }, restitution: 0.8, frictionAir: 0.01, friction: 0.2
      });
      Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 5, y: 0 });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);
      return { elem, body };
    });
    wordBodies.forEach(({ elem, body }) => {
      elem.style.position = 'absolute';
      elem.style.left = `${body.position.x}px`;
      elem.style.top = `${body.position.y}px`;
      elem.style.transform = 'translate(-50%, -50%)';
    });
    const mouse = Mouse.create(containerRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse, constraint: { stiffness: mouseConstraintStiffness, render: { visible: false } }
    });
    render.mouse = mouse;
    World.add(engine.world, [floor, leftWall, rightWall, ceiling, mouseConstraint, ...wordBodies.map(wb => wb.body)]);
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);
    const updateLoop = () => {
      wordBodies.forEach(({ body, elem }) => {
        elem.style.left = `${body.position.x}px`;
        elem.style.top = `${body.position.y}px`;
        elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
      });
      Matter.Engine.update(engine);
      requestAnimationFrame(updateLoop);
    };
    updateLoop();
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas && canvasContainerRef.current) canvasContainerRef.current.removeChild(render.canvas);
      World.clear(engine.world);
      Engine.clear(engine);
    };
  }, [effectStarted, gravity, wireframes, backgroundColor, mouseConstraintStiffness]);

  return (
    <div ref={containerRef} className={`relative z-[1] w-full h-full overflow-hidden ${className}`}>
      <div ref={textRef} className="inline-block" style={{ fontSize, lineHeight: 1.4 }} />
      <div className="absolute top-0 left-0 z-0" ref={canvasContainerRef} />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   DECRYPTED TEXT COMPONENT
═══════════════════════════════════════════════════════════ */
const DecryptedText = ({
  text, speed = 50, maxIterations = 10,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '', parentClassName = '', animateOn = 'view', ...props
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const availableChars = useMemo(() => characters.split(''), [characters]);

  const shuffleText = useCallback((originalText, currentRevealed) => (
    originalText.split('').map((char, i) => {
      if (char === ' ') return ' ';
      if (currentRevealed.has(i)) return originalText[i];
      return availableChars[Math.floor(Math.random() * availableChars.length)];
    }).join('')
  ), [availableChars]);

  const triggerDecrypt = useCallback(() => {
    setRevealedIndices(new Set());
    setIsAnimating(true);
  }, []);

  useEffect(() => {
    if (!isAnimating) return;
    let currentIteration = 0;
    intervalRef.current = setInterval(() => {
      setRevealedIndices(prevRevealed => {
        setDisplayText(shuffleText(text, prevRevealed));
        currentIteration++;
        if (currentIteration >= maxIterations) {
          clearInterval(intervalRef.current);
          setIsAnimating(false);
          setDisplayText(text);
          setRevealedIndices(new Set(Array.from({ length: text.length }, (_, i) => i)));
        }
        return prevRevealed;
      });
    }, speed);
    return () => clearInterval(intervalRef.current);
  }, [isAnimating, text, speed, maxIterations, shuffleText]);

  useEffect(() => {
    if (animateOn !== 'view') return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          triggerDecrypt();
          setHasAnimated(true);
        }
      });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => { if (containerRef.current) observer.unobserve(containerRef.current); };
  }, [animateOn, hasAnimated, triggerDecrypt]);

  return (
    <motion.span ref={containerRef} className={`inline-block whitespace-pre-wrap ${parentClassName}`} {...props}>
      <span className="sr-only">{displayText}</span>
      <span aria-hidden="true">
        {displayText.split('').map((char, index) => (
          <span key={index} className={className}>{char}</span>
        ))}
      </span>
    </motion.span>
  );
};

/* ═══════════════════════════════════════════════════════════
   LOGO LOOP ENGINE (unchanged)
═══════════════════════════════════════════════════════════ */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : React.useLayoutEffect;
const cx = (...parts) => parts.filter(Boolean).join(' ');
const SMOOTH_TAU = 0.25;
const GLIDE_TAU = 0.8;
const DRAG_THRESHOLD = 6;
const MAX_FLING = 4000;
const INTRO_TIME = 0.7;
const INTRO_STAGGER = 0.45;
const HALF_SQRT_PI = Math.sqrt(Math.PI) / 2;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const toCssLength = value => (typeof value === 'number' ? `${value}px` : (value ?? undefined));
const erf = x => {
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
  return x < 0 ? -y : y;
};
const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = t => 1 - Math.pow(1 - t, 3);
const smootherstep = t => t * t * t * (t * (t * 6 - 15) + 10);
const fadeMask = (size, vertical) => {
  const span = clamp(size, 0, 0.5) * 100;
  if (span <= 0) return undefined;
  const stops = [];
  for (let i = 0; i <= 12; i++) stops.push(`rgba(0,0,0,${smootherstep(i / 12).toFixed(4)}) ${((span * i) / 12).toFixed(3)}%`);
  for (let i = 12; i >= 0; i--) stops.push(`rgba(0,0,0,${smootherstep(i / 12).toFixed(4)}) ${(100 - (span * i) / 12).toFixed(3)}%`);
  return `linear-gradient(${vertical ? 'to bottom' : 'to right'}, ${stops.join(', ')})`;
};
const rotationMatrix = (degX, degY) => {
  const a = (degX * Math.PI) / 180, b = (degY * Math.PI) / 180;
  const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
  return [cb, 0, sb, sa * sb, ca, -sa * cb, -ca * sb, sa, ca * cb];
};
const unproject = (m, depth, sx, sy) => {
  const den = m[8] * depth - m[2] * sx - m[5] * sy;
  if (den <= 1e-6) return null;
  const t = (m[8] * depth) / den;
  if (t <= 0) return null;
  const qx = t * sx, qy = t * sy, qz = depth * (1 - t);
  return [m[0] * qx + m[3] * qy + m[6] * qz, m[1] * qx + m[4] * qy + m[7] * qz];
};
const project = (m, depth, px, py) => {
  const k = depth / (depth - (m[6] * px + m[7] * py));
  return [(m[0] * px + m[1] * py) * k, (m[3] * px + m[4] * py) * k];
};

const createEngine = (root, track, config, setLayout) => {
  const query = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const st = {
    offset: 0, velocity: 0, period: 0, length: 0, box: [0, 0], items: [], snaps: [],
    pitch: 0, crossMax: 0, sizeMax: 0, tipMax: 0, geo: null,
    layout: { copies: 2, primary: 0 }, hovered: false, focused: false,
    pointer: null, pointerInside: false, mag: 0, magU: 0, magReady: false,
    drag: null, glide: false, suppressUntil: 0, pressedAt: -1e9, move: null,
    hold: 0, seek: null, scrollVel: 0, scrollY: window.scrollY, scrollT: 0,
    visible: typeof IntersectionObserver === 'undefined', introStart: -1,
    introDone: !config.current.intro, itemMode: false, active: null,
    raf: 0, last: 0, reduced: !!query?.matches, destroyed: false
  };

  const collect = () => {
    const items = [];
    Array.from(track.children).forEach((list, copy) => {
      Array.from(list.children).forEach((el, index) => {
        items.push({ el, copy, index, content: el.children[0] || null, tip: el.children[1] || null,
          center: 0, size: 0, cross: 0, t: '', o: '', v: '', z: '', s: '', p: '' });
      });
    });
    st.items = items; st.active = null;
  };
  const clearItems = () => {
    for (const it of st.items) {
      it.el.style.transform = ''; it.el.style.opacity = ''; it.el.style.visibility = ''; it.el.style.zIndex = '';
      if (it.content) it.content.style.transform = '';
      if (it.tip) it.tip.style.transform = '';
      it.t = it.o = it.v = it.z = it.s = it.p = '';
    }
  };

  const geometry = () => {
    const cfg = config.current;
    const L = st.length, P = st.period, hc = st.crossMax, w = st.sizeMax;
    const bend = clamp(cfg.bend, -1, 1);
    const geo = {
      mode: cfg.layout, shift: 0, uMin: -L / 2 - w, uMax: L / 2 + w, lead: 0,
      focus: clamp(cfg.focus, 0, 1) * 0.9, focusSigma: Math.max(40, L * 0.18),
      magnify: clamp(cfg.magnify, 0, 1), magSigma: Math.max(hc * 1.4, st.pitch * 1.1),
      amp: 0, k: 0, R: 0, sign: 1, limit: 0, C: 0, alpha: 0, depth: 0, pf: 1,
      tilted: false, tiltX: 0, tiltY: 0, m: [1, 0, 0, 0, 1, 0, 0, 0, 1], persp: 0
    };
    let pad = cfg.scaleOnHover ? hc * 0.1 : 0;
    const lens = (1 + geo.focus) * (1 + geo.magnify) - 1;
    if (geo.mode === 'wave') {
      geo.amp = bend * (hc * 0.6 + L * 0.035);
      geo.k = (2 * Math.PI) / Math.max(1, L / 1.25);
      pad += Math.abs(geo.amp) + (lens * hc) / 2 + hc * 0.08;
    } else if (geo.mode === 'arc' && Math.abs(bend) > 0.005) {
      const edge = Math.abs(bend) * (Math.PI / 4);
      const R = L / 2 / Math.sin(edge);
      const sag = R * (1 - Math.cos(edge));
      geo.R = R; geo.sign = Math.sign(bend); geo.shift = sag / 2; geo.limit = Math.PI * 0.6;
      const reach = R * Math.min(Math.PI / 2, Math.asin(Math.min(1, (L / 2 + w) / R))) + w;
      geo.uMin = -reach; geo.uMax = reach;
      pad += sag / 2 + (w / 2) * Math.sin(edge) + (lens * hc) / 2;
    } else if (geo.mode === 'orbit') {
      const R = Math.max(40, L * 0.43 - w * 0.2);
      const k = Math.max(1, Math.round((2 * Math.PI * R) / P));
      const alpha = Math.sign(bend) * Math.atan2(Math.abs(bend) * Math.max(hc * 2, R * 0.36), R);
      const depth = R * 5;
      const pf = depth / (depth - R * Math.cos(alpha));
      const pb = depth / (depth + R * Math.cos(alpha));
      const yf = R * Math.sin(alpha) * pf, yb = -R * Math.sin(alpha) * pb;
      const grow = (1 + lens) * (cfg.scaleOnHover ? 1.2 : 1);
      const lo = Math.min(yf - (hc * pf * grow) / 2, yb - (hc * pb) / 2);
      const hi = Math.max(yf + (hc * pf * grow) / 2, yb + (hc * pb) / 2);
      geo.R = R; geo.C = k * P; geo.alpha = alpha; geo.depth = depth; geo.pf = pf;
      geo.shift = (lo + hi) / 2; geo.uMin = -geo.C / 2; geo.uMax = geo.C / 2;
      pad = Math.max(0, (hi - lo) / 2 - hc / 2);
    } else {
      pad += (lens * hc) / 2;
    }
    if (cfg.labels === 'hover') pad += cfg.vertical ? st.tipMax : hc * 0.2 + Math.max(11, hc * 0.26) * 1.3;
    const tx = clamp(cfg.tiltX, -60, 60), ty = clamp(cfg.tiltY, -60, 60);
    if (Math.abs(tx) > 0.01 || Math.abs(ty) > 0.01) {
      geo.tilted = true; geo.tiltX = tx; geo.tiltY = ty;
      geo.m = rotationMatrix(tx, ty); geo.persp = Math.max(L, 480) * 1.3;
      const edge = L / 2 + w;
      const along = s => {
        const p = cfg.vertical ? unproject(geo.m, geo.persp, 0, s) : unproject(geo.m, geo.persp, s, 0);
        if (!p) return Math.sign(s) * L * 4;
        return clamp(cfg.vertical ? p[1] : p[0], -L * 4, L * 4);
      };
      const a = along(-edge), b = along(edge);
      geo.uMin = Math.min(geo.uMin, a, b) - w; geo.uMax = Math.max(geo.uMax, a, b) + w;
      const band = hc / 2 + pad;
      let reach = band;
      for (const u of [a, b, 0]) for (const v of [-band, band]) {
        const q = cfg.vertical ? project(geo.m, geo.persp, v, u) : project(geo.m, geo.persp, u, v);
        reach = Math.max(reach, Math.abs(cfg.vertical ? q[0] : q[1]));
      }
      pad = reach - hc / 2;
    }
    const extra = cfg.links ? 2 : 0;
    geo.lead = (Math.max(0, Math.ceil((-geo.uMin - L / 2) / P)) + extra) * P;
    const copies = Math.max(2, Math.ceil((geo.uMax + L / 2 + geo.lead) / P) + 2 + (extra ? 1 : 0));
    const primary = Math.min(copies - 1, Math.floor((geo.lead + L / 2) / P));
    st.geo = geo;
    root.style.setProperty('--logoloop-pad', `${Math.ceil(pad)}px`);
    root.style.perspective = geo.tilted ? `${geo.persp}px` : '';
    track.style.transformOrigin = geo.tilted ? (cfg.vertical ? `50% ${L / 2}px` : `${L / 2}px 50%`) : '';
    if (copies !== st.layout.copies || primary !== st.layout.primary) {
      st.layout = { copies, primary }; setLayout(st.layout);
    }
  };

  const measure = () => {
    const cfg = config.current;
    const lists = track.children;
    if (!lists.length || !st.items.length) { st.period = 0; return; }
    if (cfg.vertical) {
      const parentHeight = root.parentElement?.clientHeight ?? 0;
      if (parentHeight > 0 && root.style.height !== `${Math.ceil(parentHeight)}px`) root.style.height = `${Math.ceil(parentHeight)}px`;
    } else if (root.style.height) root.style.height = '';
    track.style.transform = 'none';
    clearItems();
    const rootRect = root.getBoundingClientRect();
    const k = root.offsetWidth ? rootRect.width / root.offsetWidth || 1 : 1;
    const trackRect = track.getBoundingClientRect();
    const origin = cfg.vertical ? trackRect.top : trackRect.left;
    let crossMax = 0, sizeMax = 0, tipMax = 0;
    for (const it of st.items) {
      const r = it.el.getBoundingClientRect();
      it.center = ((cfg.vertical ? r.top + r.height / 2 : r.left + r.width / 2) - origin) / k;
      it.size = (cfg.vertical ? r.height : r.width) / k;
      it.cross = (cfg.vertical ? r.width : r.height) / k;
      crossMax = Math.max(crossMax, it.cross);
      sizeMax = Math.max(sizeMax, it.size);
      if (it.tip && it.copy === 0) tipMax = Math.max(tipMax, it.tip.offsetWidth);
    }
    const a = lists[0].getBoundingClientRect();
    const b = lists[1] ? lists[1].getBoundingClientRect() : null;
    st.period = (b ? (cfg.vertical ? b.top - a.top : b.left - a.left) : cfg.vertical ? a.height : a.width) / k;
    const cs = getComputedStyle(root);
    st.box = [root.offsetWidth, root.offsetHeight];
    st.length = cfg.vertical
      ? root.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
      : root.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    st.crossMax = crossMax; st.sizeMax = sizeMax; st.tipMax = tipMax + crossMax * 0.25;
    const first = st.items.filter(it => it.copy === 0);
    st.pitch = first.length ? st.period / first.length : st.period;
    st.snaps = first.map(it => it.center);
    st.itemMode = false;
    if (st.period <= 0) return;
    geometry();
  };

  const pointerU = () => {
    const geo = st.geo;
    if (!st.pointer || !geo) return null;
    const cfg = config.current;
    let sx = st.pointer[0] - st.box[0] / 2, sy = st.pointer[1] - st.box[1] / 2;
    if (geo.tilted) {
      const p = unproject(geo.m, geo.persp, sx, sy);
      if (!p) return null;
      sx = p[0]; sy = p[1];
    }
    const s = cfg.vertical ? sy : sx;
    if (geo.mode === 'arc' && geo.R) return geo.R * Math.asin(clamp(s / geo.R, -1, 1));
    if (geo.mode === 'orbit') return Math.asin(clamp(s / (geo.R * geo.pf), -1, 1));
    return s;
  };
  const snapTarget = (from, dir) => {
    const P = st.period, base = st.length / 2 + (st.geo?.lead ?? 0);
    let best = null;
    for (const c of st.snaps) {
      const s = c - base;
      const candidate = dir > 0 ? s + P * Math.ceil((from + 0.5 - s) / P) : s + P * Math.floor((from - 0.5 - s) / P);
      if (best === null || (dir > 0 ? candidate < best : candidate > best)) best = candidate;
    }
    return best ?? from;
  };
  const nearestSnap = value => {
    const P = st.period, base = st.length / 2 + (st.geo?.lead ?? 0);
    let best = value, dist = Infinity;
    for (const c of st.snaps) {
      const s = c - base;
      const candidate = s + P * Math.round((value - s) / P);
      if (Math.abs(candidate - value) < dist) { dist = Math.abs(candidate - value); best = candidate; }
    }
    return best;
  };
  const startMove = (target, duration) => { st.move = { from: st.offset, delta: target - st.offset, t: 0, dur: duration }; };
  const stepTiming = speed => {
    const cycle = st.pitch / Math.max(1, Math.abs(speed));
    const move = clamp(cycle * 0.55, 0.35, 0.9);
    return { move, hold: Math.max(0.35, cycle - move) };
  };
  const write = (it, key, prop, value, target) => {
    if (it[key] !== value) { it[key] = value; target.style[prop] = value; }
  };

  const render = now => {
    const cfg = config.current, geo = st.geo, L = st.length, half = L / 2;
    const T = -st.offset - geo.lead;
    const lineT = cfg.vertical ? `translate3d(0px, ${T.toFixed(2)}px, 0px)` : `translate3d(${T.toFixed(2)}px, 0px, 0px)`;
    track.style.transform = geo.tilted ? `rotateX(${geo.tiltX}deg) rotateY(${geo.tiltY}deg) ${lineT}` : lineT;
    const introRunning = st.introStart >= 0;
    const elapsed = introRunning ? (now - st.introStart) / 1000 : 0;
    const lensFocus = geo.mode === 'orbit' ? clamp(cfg.focus, 0, 1) * 0.9 : geo.focus;
    const lensMag = geo.magnify * st.mag;
    const cursorActive = lensMag > 0 && st.mag > 0.5 && geo.mode !== 'orbit';
    const wantsActive = cfg.focus > 0 || cfg.step || cursorActive;
    const needItems = geo.mode !== 'line' || lensFocus > 0 || lensMag > 0.0005 || introRunning;
    if (!needItems && st.itemMode) clearItems();
    st.itemMode = needItems;
    if (!needItems && !wantsActive) {
      if (st.active) { st.active.el.removeAttribute('data-active'); st.active = null; }
      return;
    }
    let best = null, bestDist = Infinity;
    for (const it of st.items) {
      const u = T + it.center - half;
      let x = u, y = 0, rot = 0, scale = 1, opacity = 1, z = '', hidden = false, dist = Math.abs(u);
      if (geo.mode === 'orbit') {
        if (u < -geo.C / 2 || u >= geo.C / 2) hidden = true;
        else {
          const th = (2 * Math.PI * u) / geo.C;
          const Z = geo.R * Math.cos(th);
          const p = geo.depth / (geo.depth - Z * Math.cos(geo.alpha));
          x = geo.R * Math.sin(th) * p;
          y = Z * Math.sin(geo.alpha) * p - geo.shift;
          scale = p;
          if (lensFocus > 0) scale *= 1 + lensFocus * Math.exp(-((th / 0.55) ** 2));
          if (lensMag > 0) {
            const span = (geo.magSigma * 2 * Math.PI) / geo.C;
            scale *= 1 + lensMag * Math.max(0, Math.cos(th)) * Math.exp(-(((th - st.magU) / span) ** 2));
          }
          const facing = (Math.cos(th) + 1) / 2;
          opacity = 0.25 + 0.75 * facing * facing;
          z = String(Math.round(facing * 1000));
          dist = Math.cos(th) > 0 ? Math.abs(th) * geo.R : Infinity;
        }
      } else {
        let w = u;
        if (lensFocus > 0) {
          const kf = w / geo.focusSigma;
          scale *= 1 + lensFocus * Math.exp(-kf * kf);
          opacity *= 1 - 0.45 * lensFocus * (1 - Math.exp(-((u / (geo.focusSigma * 1.8)) ** 2)));
          w += lensFocus * geo.focusSigma * HALF_SQRT_PI * erf(kf);
        }
        const near = Math.abs(w - st.magU);
        if (lensMag > 0) {
          const km = (w - st.magU) / geo.magSigma;
          scale *= 1 + lensMag * Math.exp(-km * km);
          w += lensMag * geo.magSigma * HALF_SQRT_PI * erf(km);
        }
        x = w;
        if (geo.mode === 'wave') {
          y = geo.amp * Math.sin(geo.k * w);
          rot = (Math.atan(geo.amp * geo.k * Math.cos(geo.k * w)) * 90) / Math.PI;
        } else if (geo.mode === 'arc' && geo.R) {
          const phi = w / geo.R;
          if (Math.abs(phi) > geo.limit) hidden = true;
          x = geo.R * Math.sin(phi);
          y = geo.sign * (geo.R * (1 - Math.cos(phi)) - geo.shift);
          rot = (geo.sign * phi * 180) / Math.PI;
        }
        dist = cursorActive ? near : Math.abs(x);
      }
      if (introRunning && !hidden) {
        const pos = clamp((x + half) / Math.max(1, L), 0, 1);
        const e = easeOut(clamp((elapsed - pos * INTRO_STAGGER) / INTRO_TIME, 0, 1));
        opacity *= e;
        y += (1 - e) * 14;
      }
      if (wantsActive && !hidden && dist < bestDist) { bestDist = dist; best = it; }
      if (!needItems) continue;
      const along = x - u;
      const t = hidden ? '' : `${cfg.vertical ? `translate3d(${y.toFixed(2)}px, ${along.toFixed(2)}px, 0px)` : `translate3d(${along.toFixed(2)}px, ${y.toFixed(2)}px, 0px)`}${rot ? ` rotate(${(cfg.vertical ? -rot : rot).toFixed(2)}deg)` : ''}`;
      write(it, 't', 'transform', t, it.el);
      write(it, 'o', 'opacity', hidden ? '0' : opacity > 0.999 ? '' : opacity.toFixed(3), it.el);
      write(it, 'v', 'visibility', hidden ? 'hidden' : '', it.el);
      write(it, 'z', 'zIndex', z, it.el);
      if (it.content) write(it, 's', 'transform', Math.abs(scale - 1) < 0.0005 ? '' : `scale(${scale.toFixed(4)})`, it.content);
      if (it.tip) {
        const lift = ((scale - 1) * it.cross) / 2;
        write(it, 'p', 'transform', Math.abs(lift) < 0.05 ? '' : cfg.vertical ? `translateX(${lift.toFixed(2)}px)` : `translateY(${lift.toFixed(2)}px)`, it.tip);
      }
    }
    const active = best && bestDist < Math.max(best.size, st.pitch) / 2 + 1 ? best : null;
    if (active !== st.active) {
      st.active?.el.removeAttribute('data-active');
      active?.el.setAttribute('data-active', '');
      st.active = active;
    }
  };

  const frame = now => {
    st.raf = 0;
    if (st.destroyed || !st.geo || st.period <= 0) return;
    const cfg = config.current;
    const dt = st.last ? clamp((now - st.last) / 1000, 0, 0.1) : 0;
    st.last = now;
    const P = st.period;
    let busy = false;
    if (st.introStart === -1 && !st.introDone && st.visible) {
      if (cfg.intro && !st.reduced) st.introStart = now;
      else st.introDone = true;
      root.removeAttribute('data-intro');
    }
    if (st.introStart >= 0) {
      if ((now - st.introStart) / 1000 >= INTRO_TIME + INTRO_STAGGER) { st.introStart = -2; st.introDone = true; }
      else busy = true;
    }
    const travel = Math.sign(cfg.speed) || 1;
    const paused = st.focused || (st.hovered && cfg.hoverValue !== undefined);
    const pausedSpeed = st.focused ? 0 : (cfg.hoverValue ?? 0);
    let target = st.reduced ? 0 : paused ? pausedSpeed * travel * cfg.dirSign : cfg.speed * cfg.dirSign;
    if (cfg.scrollBoost > 0 && !st.reduced) {
      st.scrollVel *= Math.exp(-dt / 0.18);
      if (Math.abs(st.scrollVel) > 1) busy = true;
      target += clamp(st.scrollVel * cfg.scrollBoost, -3000, 3000) * travel * cfg.dirSign;
    }
    if (st.drag?.active) busy = true;
    else if (st.seek) {
      st.seek.t = Math.min(1, st.seek.t + dt / st.seek.dur);
      st.offset = st.seek.from + st.seek.delta * easeInOut(st.seek.t);
      st.velocity = 0;
      if (st.seek.t >= 1) st.seek = null;
      busy = true;
    } else if (st.move) {
      st.move.t = Math.min(1, st.move.t + dt / st.move.dur);
      st.offset = st.move.from + st.move.delta * easeInOut(st.move.t);
      st.velocity = 0;
      busy = true;
      if (st.move.t >= 1) { st.move = null; st.hold = stepTiming(paused ? pausedSpeed : cfg.speed).hold; }
    } else if (cfg.step && !st.reduced) {
      const speed = paused ? pausedSpeed : cfg.speed;
      st.velocity = 0;
      if (speed) {
        busy = true;
        st.hold -= dt;
        if (st.hold <= 0) {
          const dir = Math.sign(speed) * cfg.dirSign;
          startMove(snapTarget(st.offset, dir), stepTiming(speed).move);
        }
      }
    } else {
      const tau = st.glide ? GLIDE_TAU : SMOOTH_TAU;
      st.velocity += (target - st.velocity) * (1 - Math.exp(-dt / tau));
      if (st.glide && Math.abs(st.velocity - target) < 2) st.glide = false;
      if (Math.abs(st.velocity - target) < 0.01) st.velocity = target;
      st.offset += st.velocity * dt;
      if (st.velocity !== 0 || target !== 0) busy = true;
    }
    if (!st.focused && !st.seek && !st.drag?.active) {
      const wrapped = ((st.offset % P) + P) % P;
      if (st.move) st.move.from += wrapped - st.offset;
      st.offset = wrapped;
    }
    const wantMag = cfg.magnify > 0 && st.pointerInside && !st.reduced ? 1 : 0;
    if (st.mag !== wantMag) {
      st.mag += (wantMag - st.mag) * (1 - Math.exp(-dt / (wantMag ? 0.12 : 0.25)));
      if (Math.abs(wantMag - st.mag) < 0.002) st.mag = wantMag;
      busy = true;
    }
    const pu = st.mag > 0 ? pointerU() : null;
    if (pu !== null) {
      if (!st.magReady) { st.magU = pu; st.magReady = true; }
      const next = st.magU + (pu - st.magU) * (1 - Math.exp(-dt / 0.06));
      if (Math.abs(next - pu) > 0.05) busy = true;
      st.magU = Math.abs(next - pu) > 0.05 ? next : pu;
    } else if (st.mag === 0) st.magReady = false;
    render(now);
    if (busy && st.visible && !st.destroyed) st.raf = requestAnimationFrame(frame);
  };

  const wake = () => { if (st.raf || st.destroyed || !st.visible) return; st.last = 0; st.raf = requestAnimationFrame(frame); };
  const local = e => {
    const r = root.getBoundingClientRect();
    const k = root.offsetWidth ? r.width / root.offsetWidth || 1 : 1;
    return [(e.clientX - r.left) / k, (e.clientY - r.top) / k];
  };
  const dragScale = () => {
    const geo = st.geo;
    if (!geo) return 1;
    if (geo.mode === 'orbit') return geo.C / (2 * Math.PI * geo.R * geo.pf);
    const pu = pointerU();
    if (pu === null || geo.focus <= 0) return 1;
    const kf = pu / geo.focusSigma;
    return 1 / (1 + geo.focus * Math.exp(-kf * kf));
  };
  const onEnter = e => {
    st.hovered = true;
    if (e.pointerType !== 'touch') { st.pointerInside = true; st.pointer = local(e); }
    wake();
  };
  const onLeave = () => { st.hovered = false; st.pointerInside = false; wake(); };
  const onDown = e => {
    st.pressedAt = performance.now();
    if (!config.current.draggable || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const [x, y] = local(e);
    if (e.pointerType !== 'touch') st.pointer = [x, y];
    st.drag = { id: e.pointerId, x, y, active: false, samples: [], scale: dragScale(), anchor: 0, offset: 0 };
  };
  const onMove = e => {
    const cfg = config.current;
    if (e.pointerType !== 'touch') { st.pointer = local(e); st.pointerInside = true; }
    const d = st.drag;
    if (d && e.pointerId === d.id) {
      const [x, y] = local(e);
      const along = cfg.vertical ? y - d.y : x - d.x;
      const across = cfg.vertical ? x - d.x : y - d.y;
      if (!d.active) {
        if (Math.abs(along) < DRAG_THRESHOLD) return wake();
        if (Math.abs(across) > Math.abs(along)) { st.drag = null; return wake(); }
        d.active = true; d.anchor = along; d.offset = st.offset;
        st.move = null; st.seek = null; st.glide = false; st.velocity = 0;
        try { root.setPointerCapture(e.pointerId); } catch {}
        root.setAttribute('data-dragging', '');
      }
      const next = d.offset - (along - d.anchor) * d.scale;
      const P = st.period || 1;
      st.offset = ((next % P) + P) % P;
      d.offset += st.offset - next;
      const now = performance.now();
      d.samples.push([now, along]);
      while (d.samples.length > 2 && now - d.samples[0][0] > 100) d.samples.shift();
    }
    wake();
  };
  const endDrag = (e, cancelled) => {
    const d = st.drag;
    if (!d || e.pointerId !== d.id) return;
    st.drag = null;
    if (!d.active) return;
    root.removeAttribute('data-dragging');
    try { root.releasePointerCapture(e.pointerId); } catch {}
    const cfg = config.current;
    const now = performance.now();
    st.suppressUntil = now + 400;
    let v = 0;
    const s = d.samples;
    if (!cancelled && s.length > 1) {
      const [t0, a0] = s[0];
      const [t1, a1] = s[s.length - 1];
      if (t1 > t0 && now - t1 < 80) v = clamp((-(a1 - a0) / (t1 - t0)) * 1000 * d.scale, -MAX_FLING, MAX_FLING);
    }
    if (cfg.step && !st.reduced) {
      const target = nearestSnap(st.offset + v * 0.35);
      startMove(target, clamp(0.3 + Math.abs(target - st.offset) / 1800, 0.3, 0.8));
      st.velocity = 0;
    } else {
      st.velocity = v;
      st.glide = Math.abs(v) > 30;
    }
    wake();
  };
  const onUp = e => endDrag(e, false);
  const onCancel = e => endDrag(e, true);
  const onClick = e => {
    if (performance.now() < st.suppressUntil) {
      e.preventDefault(); e.stopPropagation(); st.suppressUntil = 0;
    }
  };
  const onDragStart = e => { if (config.current.draggable) e.preventDefault(); };
  const onFocusIn = e => {
    const target = e.target;
    if (performance.now() - st.pressedAt < 800) return;
    st.focused = true;
    const it = st.items.find(item => item.el.contains(target));
    if (it && st.geo) {
      const u = -st.offset - st.geo.lead + it.center - st.length / 2;
      const comfortable = st.geo.mode === 'orbit' ? 1 : Math.max(0, st.length / 2 - it.size);
      if (Math.abs(u) > comfortable) {
        st.move = null;
        st.seek = { from: st.offset, delta: u, t: 0, dur: clamp(0.35 + Math.abs(u) / 2000, 0.35, 0.8) };
      }
    }
    wake();
  };
  const onFocusOut = e => { if (root.contains(e.relatedTarget)) return; st.focused = false; wake(); };
  const onRootScroll = () => { if (root.scrollLeft || root.scrollTop) { root.scrollLeft = 0; root.scrollTop = 0; } };
  const onScroll = () => {
    const now = performance.now();
    const y = window.scrollY;
    if (st.scrollT && now > st.scrollT) {
      const v = ((y - st.scrollY) / (now - st.scrollT)) * 1000;
      st.scrollVel += (clamp(v, -6000, 6000) - st.scrollVel) * 0.5;
    }
    st.scrollY = y; st.scrollT = now;
    if (config.current.scrollBoost > 0) wake();
  };
  const onMotion = () => { st.reduced = !!query?.matches; wake(); };

  root.addEventListener('pointerenter', onEnter);
  root.addEventListener('pointerleave', onLeave);
  root.addEventListener('pointerdown', onDown);
  root.addEventListener('pointermove', onMove);
  root.addEventListener('pointerup', onUp);
  root.addEventListener('pointercancel', onCancel);
  root.addEventListener('lostpointercapture', onCancel);
  root.addEventListener('click', onClick, true);
  root.addEventListener('dragstart', onDragStart);
  root.addEventListener('focusin', onFocusIn);
  root.addEventListener('focusout', onFocusOut);
  root.addEventListener('scroll', onRootScroll);
  window.addEventListener('scroll', onScroll, { passive: true });
  query?.addEventListener?.('change', onMotion);

  let resizeObserver = null;
  const observed = new Set();
  const refresh = () => {
    collect(); measure();
    if (resizeObserver) {
      const first = track.children[0];
      for (const el of [root, first]) {
        if (el && !observed.has(el)) { resizeObserver.observe(el); observed.add(el); }
      }
    }
    st.last = 0;
    if (st.raf) cancelAnimationFrame(st.raf);
    st.raf = 0;
    if (st.geo && st.period > 0) frame(performance.now());
  };
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      measure();
      if (st.geo && st.period > 0) render(performance.now());
      wake();
    });
  } else window.addEventListener('resize', refresh);

  let intersection = null;
  if (typeof IntersectionObserver !== 'undefined') {
    intersection = new IntersectionObserver(entries => {
      const entry = entries[entries.length - 1];
      st.visible = entry.isIntersecting;
      if (st.visible) wake();
    }, { threshold: 0.1 });
    intersection.observe(root);
  }
  const onVisibility = () => { if (!document.hidden) wake(); };
  document.addEventListener('visibilitychange', onVisibility);

  const destroy = () => {
    st.destroyed = true;
    if (st.raf) cancelAnimationFrame(st.raf);
    root.removeEventListener('pointerenter', onEnter);
    root.removeEventListener('pointerleave', onLeave);
    root.removeEventListener('pointerdown', onDown);
    root.removeEventListener('pointermove', onMove);
    root.removeEventListener('pointerup', onUp);
    root.removeEventListener('pointercancel', onCancel);
    root.removeEventListener('lostpointercapture', onCancel);
    root.removeEventListener('click', onClick, true);
    root.removeEventListener('dragstart', onDragStart);
    root.removeEventListener('focusin', onFocusIn);
    root.removeEventListener('focusout', onFocusOut);
    root.removeEventListener('scroll', onRootScroll);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', refresh);
    document.removeEventListener('visibilitychange', onVisibility);
    query?.removeEventListener?.('change', onMotion);
    resizeObserver?.disconnect();
    intersection?.disconnect();
  };
  return { refresh, wake, destroy, state: st };
};

const LogoLoop = React.memo(({
  logos, speed = 120, direction = 'left', width = '100%', logoHeight = 28, gap = 32,
  pauseOnHover, hoverSpeed, fadeOut = true, fadeOutWidth = 0.12, scaleOnHover = false,
  layout = 'line', bend = 0.5, focus = 0, magnify = 0, tiltX = 0, tiltY = 0, step = false,
  muted = 0, labels = 'none', draggable = true, scrollBoost = 0, intro = true,
  renderItem, ariaLabel = 'Partner logos', className, style
}) => {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const engineRef = useRef(null);
  const [{ copies, primary }, setLayout] = useState({ copies: 3, primary: 1 });
  const [introPending] = useState(intro);
  const vertical = direction === 'up' || direction === 'down';
  const config = useRef(null);
  config.current = {
    speed,
    dirSign: (vertical ? direction === 'up' : direction !== 'right') ? 1 : -1,
    hoverValue: hoverSpeed !== undefined ? hoverSpeed : pauseOnHover === false ? undefined : 0,
    vertical, layout, bend, focus, magnify, tiltX, tiltY, step, draggable,
    scrollBoost, intro, scaleOnHover, labels,
    links: logos.some(item => item.href)
  };

  useIsomorphicLayoutEffect(() => {
    const engine = createEngine(rootRef.current, trackRef.current, config, setLayout);
    engineRef.current = engine;
    return () => { engine.destroy(); engineRef.current = null; };
  }, []);

  useIsomorphicLayoutEffect(() => {
    engineRef.current?.refresh();
  }, [copies, primary, logos, vertical, logoHeight, gap, labels, layout, bend, focus, magnify, tiltX, tiltY, scaleOnHover]);

  useEffect(() => { engineRef.current?.wake(); });

  const amount = clamp(muted, 0, 1);
  const isMuted = amount > 0;

  const lists = useMemo(() => {
    const itemClass = cx(
      'group/item relative flex-none text-[length:var(--logoloop-logoHeight)] leading-none group-data-[intro]/loop:opacity-0',
      vertical ? 'mb-[var(--logoloop-gap)]' : 'mr-[var(--logoloop-gap)]'
    );
    const contentClass = item => cx(
      'inline-flex items-center rounded text-inherit no-underline transition-[opacity,filter,color] duration-[350ms] ease-[ease] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current motion-reduce:transition-none',
      labels === 'below' ? 'flex-col gap-[calc(var(--logoloop-logoHeight)*0.22)]' : 'gap-[calc(var(--logoloop-logoHeight)*0.3)]',
      isMuted && '[filter:grayscale(var(--logoloop-gray))] opacity-[var(--logoloop-dim)] group-hover/item:[filter:none] group-hover/item:opacity-100 group-focus-within/item:[filter:none] group-focus-within/item:opacity-100 group-data-[active]/item:[filter:none] group-data-[active]/item:opacity-100',
      item.hoverColor && 'group-hover/item:text-[var(--logoloop-item-color)] group-focus-within/item:text-[var(--logoloop-item-color)] group-data-[active]/item:text-[var(--logoloop-item-color)]',
      !isMuted && !item.hoverColor && !!item.href && 'hover:opacity-80'
    );
    const zoomClass = cx(
      'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none',
      scaleOnHover && 'group-hover/item:scale-120'
    );
    const labelClass = labels === 'below'
      ? 'whitespace-nowrap text-[length:max(11px,calc(var(--logoloop-logoHeight)*0.26))] font-medium leading-[1.2] opacity-[0.72]'
      : 'whitespace-nowrap text-[length:max(12px,calc(var(--logoloop-logoHeight)*0.5))] font-semibold leading-[1.2] tracking-[-0.01em]';
    const tipClass = cx(
      'pointer-events-none absolute whitespace-nowrap text-[length:max(11px,calc(var(--logoloop-logoHeight)*0.26))] font-medium leading-[1.2] opacity-0 transition-[opacity,translate] duration-[250ms] ease-[ease] motion-reduce:transition-none group-hover/item:opacity-80 group-focus-within/item:opacity-80 group-data-[active]/item:opacity-80',
      vertical
        ? 'left-full top-1/2 ml-[calc(var(--logoloop-logoHeight)*0.25)] [translate:4px_-50%] group-hover/item:[translate:0_-50%] group-focus-within/item:[translate:0_-50%] group-data-[active]/item:[translate:0_-50%]'
        : 'left-1/2 top-full mt-[calc(var(--logoloop-logoHeight)*0.2)] [translate:-50%_4px] group-hover/item:[translate:-50%_0] group-focus-within/item:[translate:-50%_0] group-data-[active]/item:[translate:-50%_0]'
    );
    return Array.from({ length: copies }, (_, copyIndex) => {
      const isPrimary = copyIndex === primary;
      return (
        <ul className={cx('m-0 flex list-none items-center p-0', vertical && 'flex-col')} key={copyIndex} role="list" aria-hidden={isPrimary ? undefined : true}>
          {logos.map((item, itemIndex) => {
            const key = `${copyIndex}-${itemIndex}`;
            const isNode = 'node' in item;
            const visual = renderItem ? renderItem(item, key) : isNode ? (
              <span className={cx('inline-flex items-center', zoomClass)} aria-hidden={!!item.href && !item.ariaLabel}>
                {item.node}
              </span>
            ) : (
              <img className={cx('pointer-events-none block h-[var(--logoloop-logoHeight)] w-auto object-contain [-webkit-user-drag:none] [image-rendering:-webkit-optimize-contrast]', zoomClass)}
                src={item.src} srcSet={item.srcSet} sizes={item.sizes}
                width={item.width} height={item.height} alt={item.alt ?? ''}
                title={item.title} loading="lazy" decoding="async" draggable={false} />
            );
            const text = (labels === 'inline' || labels === 'below') && item.title ? item.title : null;
            const inner = (<>{visual}{text && <span className={labelClass} aria-hidden={!isNode && !!item.alt}>{text}</span>}</>);
            const name = isNode ? (item.ariaLabel ?? item.title) : (item.alt ?? item.title);
            return (
              <li className={itemClass} key={key} role="listitem"
                data-color={item.hoverColor ? '' : undefined}
                style={item.hoverColor ? { '--logoloop-item-color': item.hoverColor } : undefined}>
                {item.href ? (
                  <a className={contentClass(item)} href={item.href} aria-label={name || 'logo link'}
                    target="_blank" rel="noreferrer noopener" draggable={false}
                    tabIndex={isPrimary ? undefined : -1}>
                    {inner}
                  </a>
                ) : (<div className={contentClass(item)}>{inner}</div>)}
                {labels === 'hover' && item.title && (<span className={tipClass} aria-hidden="true">{item.title}</span>)}
              </li>
            );
          })}
        </ul>
      );
    });
  }, [copies, primary, logos, renderItem, labels, vertical, scaleOnHover, isMuted]);

  const mask = fadeOut ? fadeMask(fadeOutWidth, vertical) : undefined;
  const containerStyle = {
    width: vertical ? toCssLength(width) === '100%' ? undefined : toCssLength(width) : (toCssLength(width) ?? '100%'),
    '--logoloop-gap': `${gap}px`,
    '--logoloop-logoHeight': `${logoHeight}px`,
    ...(amount > 0 && {
      '--logoloop-gray': Math.min(1, amount * 2).toFixed(3),
      '--logoloop-dim': (1 - amount * 0.6).toFixed(3)
    }),
    ...(mask && { WebkitMaskImage: mask, maskImage: mask }),
    ...style
  };
  const rootClassName = cx(
    'group/loop relative overflow-hidden [-webkit-tap-highlight-color:transparent]',
    vertical ? 'inline-block h-full px-[var(--logoloop-pad)]' : 'py-[var(--logoloop-pad)]',
    draggable && 'cursor-grab data-[dragging]:cursor-grabbing [&[data-dragging]_*]:cursor-grabbing',
    draggable && (vertical ? '[touch-action:pan-x_pinch-zoom]' : '[touch-action:pan-y_pinch-zoom]'),
    className
  );

  return (
    <div ref={rootRef} className={rootClassName} style={containerStyle}
      role="region" aria-label={ariaLabel}
      data-intro={introPending ? '' : undefined}
      data-draggable={draggable ? '' : undefined}
      data-muted={amount > 0 ? '' : undefined}
      data-labels={labels !== 'none' ? labels : undefined}>
      <div className={cx('relative z-0 flex select-none will-change-transform [-webkit-user-select:none]',
        vertical ? 'h-max w-full flex-col' : 'w-max')} ref={trackRef}>
        {lists}
      </div>
    </div>
  );
});
LogoLoop.displayName = 'LogoLoop';

/* ═══════════════════════════════════════════════════════════
   SKILLS DATA
   - Canva changed to Lucide Palette
   - Java uses Cpu, Hardhat uses Hexagon
═══════════════════════════════════════════════════════════ */
const skillsData = [
  {
    id: 1,
    title: "MERN Stack",
    subtitle: "Full-Scale Web Engineering",
    description:
      "Production-grade applications with React, Node, Express, MongoDB. Integrated JWT, REST APIs, real-time features, and payment gateways.",
    icon: Globe,
    color: "#18181B",
    skills: [
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
      { name: "Express", icon: SiExpress, color: "#000000" },
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "Mongoose", icon: SiMongoose, color: "#880000" },
      { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Redux", icon: SiRedux, color: "#764ABC" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    ],
  },
  {
    id: 2,
    title: "Web3 & Blockchain",
    subtitle: "Decentralized Innovation",
    description:
      "Smart contract development with Solidity, Hardhat, Ethers.js. Integrated MetaMask, IPFS, and Hedera. Built secure dApps and token systems.",
    icon: Hexagon,
    color: "#3F3F46",
    skills: [
      { name: "Solidity", icon: SiSolidity, color: "#363636" },
      { name: "Hardhat", icon: Hexagon, color: "#FFF100" },
      { name: "Ethereum", icon: SiEthereum, color: "#3C3C3D" },
      { name: "Web3.js", icon: SiWeb3Dotjs, color: "#F16822" },
      { name: "IPFS", icon: SiIpfs, color: "#65C2CB" },
      { name: "Hedera", icon: SiHedera, color: "#222222" },
    ],
  },
  {
    id: 3,
    title: "AI & ML",
    subtitle: "Intelligent Systems",
    description:
      "Python-based AI solutions using TensorFlow, Scikit-learn, Gemini & OpenAI APIs. Built NLP pipelines, predictive models, and AI systems.",
    icon: Brain,
    color: "#52525B",
    skills: [
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "TensorFlow", icon: SiTensorflow, color: "#FF6F00" },
      { name: "Scikit-learn", icon: SiScikitlearn, color: "#F7931E" },
      { name: "Pandas", icon: SiPandas, color: "#150458" },
      { name: "Gemini", icon: SiGooglegemini, color: "#8E75B2" },
      // Note: SiOpenai may have been removed in some versions, causing an error.
      // If it reports an error, replace it with Sparkles from lucide.
      { name: "OpenAI", icon: SiPandas, color: "#412991" },
      { name: "LangChain", icon: SiLangchain, color: "#1C3C3C" },
    ],
  },
  {
    id: 4,
    title: "Core CS & DSA",
    subtitle: "Algorithmic Foundation",
    description:
      "Strong grasp of Data Structures, Algorithms, OOP, and time/space complexity. Active competitive programmer and problem solver.",
    icon: Cpu,
    color: "#71717A",
    skills: [
      { name: "Java", icon: Cpu, color: "#007396" },
      { name: "C", icon: SiC, color: "#A8B9CC" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    ],
  },
  {
    id: 5,
    title: "DevOps & Tools",
    subtitle: "Streamlined CI/CD",
    description:
      "Containerization with Docker, version control with Git/GitHub, CI/CD pipelines, and seamless deployment on modern cloud platforms.",
    icon: Server,
    color: "#A1A1AA",
    skills: [
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub, color: "#181717" },
      { name: "Postman", icon: SiPostman, color: "#FF6C37" },
      { name: "Vercel", icon: SiVercel, color: "#000000" },
      { name: "AWS", icon: FaAws, color: "#FF9900" },
    ],
  },
  {
    id: 6,
    title: "Enterprise & Design",
    subtitle: "Spring Ecosystem + UI/UX",
    description:
      "Spring Boot microservices with JPA & Kafka on the backend, plus Figma-driven pixel-perfect interfaces on the front.",
    icon: Paintbrush,
    color: "#D4D4D8",
    skills: [
      { name: "Spring Boot", icon: SiSpringboot, color: "#6DB33F" },
      { name: "Spring", icon: SiSpringboot, color: "#6DB33F" },
      { name: "Hibernate", icon: SiHibernate, color: "#59666C" },
      { name: "Kafka", icon: SiApachekafka, color: "#231F20" },
      { name: "JWT", icon: SiJsonwebtokens, color: "#D63AFF" },
      { name: "Figma", icon: SiFigma, color: "#F24E1E" },
      // SiCanva does not exist, use Lucide Palette instead
      { name: "Canva", icon: Palette, color: "#00C4CC" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════
   TOP LOGO LOOP STRIP
   - Removed SiCanva, replaced with Palette
   - If SiOpenai reports an error, replace with Sparkles
═══════════════════════════════════════════════════════════ */
const TECH_LOGOS = [
  { node: <SiReact className="text-[#61DAFB]" />, title: "React", hoverColor: "#61DAFB", href: "https://react.dev" },
  { node: <SiJavascript className="text-[#F7DF1E]" />, title: "JavaScript", hoverColor: "#F7DF1E", href: "https://developer.mozilla.org/docs/Web/JavaScript" },
  { node: <SiTypescript className="text-[#3178C6]" />, title: "TypeScript", hoverColor: "#3178C6", href: "https://www.typescriptlang.org" },
  { node: <SiNodedotjs className="text-[#339933]" />, title: "Node.js", hoverColor: "#339933", href: "https://nodejs.org" },
  { node: <SiExpress className="text-zinc-900" />, title: "Express", hoverColor: "#000000", href: "https://expressjs.com" },
  { node: <SiMongodb className="text-[#47A248]" />, title: "MongoDB", hoverColor: "#47A248", href: "https://www.mongodb.com" },
  { node: <SiMongoose className="text-[#880000]" />, title: "Mongoose", hoverColor: "#880000", href: "https://mongoosejs.com" },
  { node: <SiGit className="text-[#F05032]" />, title: "Git", hoverColor: "#F05032", href: "https://git-scm.com" },
  { node: <SiGithub className="text-zinc-900" />, title: "GitHub", hoverColor: "#181717", href: "https://github.com" },
  { node: <SiDocker className="text-[#2496ED]" />, title: "Docker", hoverColor: "#2496ED", href: "https://www.docker.com" },
  { node: <Cpu className="text-[#007396]" />, title: "Java", hoverColor: "#007396", href: "https://www.java.com" },
  { node: <SiSpringboot className="text-[#6DB33F]" />, title: "Spring Boot", hoverColor: "#6DB33F", href: "https://spring.io/projects/spring-boot" },
  { node: <SiApachekafka className="text-zinc-900" />, title: "Apache Kafka", hoverColor: "#231F20", href: "https://kafka.apache.org" },
  { node: <SiJsonwebtokens className="text-[#D63AFF]" />, title: "JWT", hoverColor: "#D63AFF", href: "https://jwt.io" },
  { node: <FaAws className="text-[#FF9900]" />, title: "AWS", hoverColor: "#FF9900", href: "https://aws.amazon.com" },
  { node: <SiPython className="text-[#3776AB]" />, title: "Python", hoverColor: "#3776AB", href: "https://www.python.org" },
  { node: <SiTensorflow className="text-[#FF6F00]" />, title: "TensorFlow", hoverColor: "#FF6F00", href: "https://tensorflow.org" },
  { node: <SiScikitlearn className="text-[#F7931E]" />, title: "Scikit-learn", hoverColor: "#F7931E", href: "https://scikit-learn.org" },
  { node: <SiGooglegemini className="text-[#8E75B2]" />, title: "Gemini AI", hoverColor: "#8E75B2", href: "https://deepmind.google/technologies/gemini/" },
  { node: <SiPandas className="text-zinc-900" />, title: "OpenAI", hoverColor: "#412991", href: "https://openai.com" },
  { node: <SiLangchain className="text-[#1C3C3C]" />, title: "LangChain", hoverColor: "#1C3C3C", href: "https://www.langchain.com" },
  { node: <SiSolidity className="text-zinc-900" />, title: "Solidity", hoverColor: "#363636", href: "https://soliditylang.org" },
  { node: <SiEthereum className="text-[#3C3C3D]" />, title: "Ethereum", hoverColor: "#3C3C3D", href: "https://ethereum.org" },
  { node: <Hexagon className="text-[#FFF100]" />, title: "Hardhat", hoverColor: "#FFF100", href: "https://hardhat.org" },
  { node: <SiIpfs className="text-[#65C2CB]" />, title: "IPFS", hoverColor: "#65C2CB", href: "https://ipfs.tech" },
  { node: <SiHedera className="text-zinc-900" />, title: "Hedera", hoverColor: "#222222", href: "https://hedera.com" },
  { node: <SiTailwindcss className="text-[#06B6D4]" />, title: "Tailwind CSS", hoverColor: "#06B6D4", href: "https://tailwindcss.com" },
  { node: <SiRedux className="text-[#764ABC]" />, title: "Redux", hoverColor: "#764ABC", href: "https://redux.js.org" },
  { node: <SiPostman className="text-[#FF6C37]" />, title: "Postman", hoverColor: "#FF6C37", href: "https://www.postman.com" },
  { node: <SiVercel className="text-zinc-900" />, title: "Vercel", hoverColor: "#000000", href: "https://vercel.com" },
  { node: <SiFigma className="text-[#F24E1E]" />, title: "Figma", hoverColor: "#F24E1E", href: "https://www.figma.com" },
  // SiCanva does not exist, use Palette instead
  { node: <Palette className="text-[#00C4CC]" />, title: "Canva", hoverColor: "#00C4CC", href: "https://www.canva.com" },
];

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const Skills = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const activeSkill = skillsData[activeIdx];

  const handleNext = () => { setDirection(1); setActiveIdx((prev) => (prev + 1) % skillsData.length); };
  const handlePrev = () => { setDirection(-1); setActiveIdx((prev) => (prev - 1 + skillsData.length) % skillsData.length); };

  return (
    <section id="skills" className="relative w-full min-h-screen bg-[#FAFAFA] text-zinc-900 overflow-hidden flex flex-col">
      <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 flex flex-col">
        {/* Header */}
        <div className="shrink-0 pt-8 lg:pt-12 mb-6 lg:mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="flex items-center gap-3 mb-3">
            <div className="h-px w-10 bg-zinc-900" />
            <DecryptedText text="The Arsenal" speed={60} maxIterations={8} animateOn="view"
              className="font-primary text-[10px] uppercase tracking-[0.4em] text-zinc-900 font-bold" />
          </motion.div>
          <motion.h2 initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
            className="font-clash font-black text-4xl sm:text-5xl lg:text-6xl text-zinc-900 leading-[0.9] tracking-tighter uppercase">
            <DecryptedText text="Technical" speed={40} maxIterations={12} animateOn="view" className="inline-block" />{" "}
            <DecryptedText text="Expertise" speed={40} maxIterations={12} animateOn="view" className="inline-block text-zinc-500" />
          </motion.h2>
        </div>

        {/* LOGO LOOP STRIP — full width */}
        <div className="shrink-0 mb-6 lg:mb-8 w-full">
          <div className="relative   backdrop-blur-sm rounded-none">
            <div className="px-4 py-3">
              <LogoLoop
                logos={TECH_LOGOS}
                speed={80}
                direction="left"
                logoHeight={32}
                gap={48}
                hoverSpeed={0}
                scaleOnHover
                fadeOut
                fadeOutWidth={0.08}
                labels="hover"
                draggable
                intro
                ariaLabel="Technology stack and tools"
                className="text-zinc-700"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={activeSkill.id} custom={direction}
              initial={{ opacity: 0, x: direction * 50 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -50 }} transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-4xl">
              <div className="relative rounded-3xl p-8 lg:p-12 ">
                {/* Top Bar */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center">
                      <activeSkill.icon size={28} strokeWidth={1.5} className="text-white" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                        Skill {String(activeSkill.id).padStart(2, '0')}
                      </span>
                      <p className="font-clash font-bold text-lg text-zinc-900">{activeSkill.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-4xl font-clash font-black text-zinc-200">
                    {String(activeSkill.id).padStart(2, '0')}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-clash font-black text-4xl sm:text-5xl lg:text-6xl text-zinc-900 leading-[1.05] mb-6">
                  <DecryptedText key={`title-${activeSkill.id}`} text={activeSkill.title}
                    speed={30} maxIterations={15} animateOn="view" className="inline-block" />
                </h3>

                {/* Description */}
                <div className="relative h-40 lg:h-48 mb-8">
                  <FallingText
                    key={`falling-${activeSkill.id}`}
                    text={activeSkill.description}
                    highlightWords={activeSkill.skills.slice(0, 3).map(s => s.name)}
                    trigger="auto"
                    backgroundColor="transparent"
                    wireframes={false}
                    gravity={0.2}
                    fontSize="1rem"
                    mouseConstraintStiffness={0.1}
                    className="absolute inset-0"
                  />
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {activeSkill.skills.map((tech, i) => {
                    const Icon = tech.icon;
                    return (
                      <motion.span
                        key={tech.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 + i * 0.04 }}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-mono font-bold text-zinc-800 uppercase tracking-wider hover:bg-white hover:border-zinc-300 hover:shadow-sm transition-all"
                      >
                        <Icon size={16} style={{ color: tech.color }} />
                        <span>{tech.name}</span>
                      </motion.span>
                    );
                  })}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button onClick={handlePrev}
                    className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-600 hover:text-zinc-900">
                    <ChevronLeft size={20} />
                    <span className="text-sm font-semibold">Prev</span>
                  </button>
                  <div className="flex items-center gap-1.5">
                    {skillsData.map((skill, idx) => (
                      <button key={skill.id} onClick={() => setActiveIdx(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === activeIdx ? 'w-8 bg-zinc-900' : 'w-1.5 bg-zinc-300 hover:bg-zinc-400'
                        }`}
                        aria-label={`Go to skill ${idx + 1}`} />
                    ))}
                  </div>
                  <button onClick={handleNext}
                    className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-600 hover:text-zinc-900">
                    <span className="text-sm font-semibold">Next</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Progress */}
        <div className="shrink-0 pb-8 lg:pb-12 mt-8">
          <div className="flex items-center justify-center gap-3">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              {String(activeSkill.id).padStart(2, '0')} / {String(skillsData.length).padStart(2, '0')}
            </span>
            <div className="h-px w-24 bg-zinc-200">
              <div className="h-full bg-zinc-900 transition-all duration-500"
                style={{ width: `${((activeIdx + 1) / skillsData.length) * 100}%` }} />
            </div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              {activeSkill.skills.length} Technologies
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;