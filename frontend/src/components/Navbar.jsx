import React, { useRef, useState, useCallback, useEffect, useMemo } from "react";
import {
  User,
  Briefcase,
  Zap,
  Mail,
  Home,
  Moon,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   CONFIGURATION
   ───────────────────────────────────────────────────────────── */
const FALLOFF_CURVES = {
  linear: (p) => p,
  smooth: (p) => p * p * (3 - 2 * p),
  sharp: (p) => p * p * p,
};

const NOTES = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];

const NAV_ITEMS = [
  { name: "Home", icon: Home, id: "hero" },
  { name: "Me", icon: User, id: "me" },
  { name: "Works", icon: Briefcase, id: "works" },
  { name: "Skills", icon: Zap, id: "skills" },
  { name: "Contact", icon: Mail, id: "contact" },
];

/* ─────────────────────────────────────────────────────────────
   AUDIO ENGINE
   ───────────────────────────────────────────────────────────── */
const usePianoAudio = (enabled = true) => {
  const ctxRef = useRef(null);

  const playNote = useCallback(
    (index, velocity = 0.3) => {
      if (!enabled) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!ctxRef.current) ctxRef.current = new AudioCtx();
        const ctx = ctxRef.current;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const freq = NOTES[index % NOTES.length];

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(velocity, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.55);
      } catch (e) {
        /* AudioContext blocked */
      }
    },
    [enabled]
  );

  return { playNote };
};

/* ─────────────────────────────────────────────────────────────
   THEME HOOK
   ───────────────────────────────────────────────────────────── */
const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return [isDark, setIsDark];
};

/* ─────────────────────────────────────────────────────────────
   NAVBAR — Minimalist Piano Key Navigation
   ───────────────────────────────────────────────────────────── */
const Navbar = ({
  proximityRadius = 90,
  smoothing = 90,
  falloff = "smooth",
  soundEnabled: soundProp = true,
}) => {
  const [isDark, setIsDark] = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(soundProp);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { playNote } = usePianoAudio(soundEnabled);

  const allItems = useMemo(
    () => [
      ...NAV_ITEMS,
    
      {
        name: soundEnabled ? "Mute" : "Sound",
        icon: soundEnabled ? Volume2 : VolumeX,
        id: "sound-toggle",
      },
    ],
    [isDark, soundEnabled]
  );

  /* ── Refs ── */
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const targetsRef = useRef([]);
  const currentRef = useRef([]);
  const rafRef = useRef(null);
  const lastRef = useRef(0);
  const activeRef = useRef(0);
  const smoothingRef = useRef(smoothing);
  const [activeIndex, setActiveIndex] = useState(0);

  activeRef.current = activeIndex;
  smoothingRef.current = smoothing;

  /* ── Reduced Motion ── */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ── rAF Animation Loop ── */
  const runFrame = useCallback(
    (now) => {
      const dt = Math.min((now - lastRef.current) / 1000, 0.05);
      lastRef.current = now;
      const tau = Math.max(smoothingRef.current, 1) / 1000;
      const k = reducedMotion ? 1 : 1 - Math.exp(-dt / tau);

      let moving = false;
      const items = itemRefs.current;

      for (let i = 0; i < items.length; i++) {
        const el = items[i];
        if (!el) continue;

        const isUtility = ["theme-toggle", "sound-toggle"].includes(
          allItems[i].id
        );
        const target = Math.max(
          targetsRef.current[i] || 0,
          !isUtility && activeRef.current === i ? 1 : 0
        );

        const cur = currentRef.current[i] || 0;
        const next = cur + (target - cur) * k;
        const settled = Math.abs(target - next) < 0.0015;
        const value = settled ? target : next;

        currentRef.current[i] = value;
        el.style.setProperty("--effect", value.toFixed(4));

        if (!settled) moving = true;
      }

      rafRef.current = moving ? requestAnimationFrame(runFrame) : null;
    },
    [allItems, reducedMotion]
  );

  const startLoop = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  /* ── Pointer Proximity ── */
  const handlePointerMove = useCallback(
    (e) => {
      const list = listRef.current;
      if (!list) return;
      const rect = list.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      const ease = FALLOFF_CURVES[falloff] ?? FALLOFF_CURVES.linear;

      const items = itemRefs.current;
      let maxEffect = 0;
      let maxIndex = -1;

      for (let i = 0; i < items.length; i++) {
        const el = items[i];
        if (!el) continue;
        const center = el.offsetLeft + el.offsetWidth / 2;
        const distance = Math.abs(pointerX - center);
        const raw = Math.max(0, 1 - distance / proximityRadius);
        const val = ease(raw);
        targetsRef.current[i] = val;

        if (val > maxEffect) {
          maxEffect = val;
          maxIndex = i;
        }
      }

      if (maxEffect > 0.5 && maxIndex !== handlePointerMove.lastPlayed) {
        playNote(maxIndex, maxEffect * 0.3);
        handlePointerMove.lastPlayed = maxIndex;
      } else if (maxEffect < 0.12) {
        handlePointerMove.lastPlayed = -1;
      }

      startLoop();
    },
    [falloff, proximityRadius, startLoop, playNote]
  );
  handlePointerMove.lastPlayed = -1;

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = targetsRef.current.map(() => 0);
    handlePointerMove.lastPlayed = -1;
    startLoop();
  }, [startLoop]);

  /* ── Scroll Spy ── */
  const handleScroll = useCallback(() => {
    let ticking = false;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollPosition = window.scrollY + window.innerHeight * 0.3;
        NAV_ITEMS.forEach((item, index) => {
          const element = document.getElementById(item.id);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (
              scrollPosition >= offsetTop &&
              scrollPosition < offsetTop + offsetHeight
            ) {
              setActiveIndex(index);
            }
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    startLoop();
  }, [activeIndex, startLoop]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  /* ── Keyboard Navigation ── */
  const handleKeyDown = useCallback(
    (e) => {
      const max = allItems.length - 1;
      let next = focusedIndex;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        next = focusedIndex >= max ? 0 : focusedIndex + 1;
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        next = focusedIndex <= 0 ? max : focusedIndex - 1;
      } else if (e.key === "Home") {
        e.preventDefault();
        next = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        next = max;
      } else if (e.key === "Enter" && focusedIndex !== -1) {
        e.preventDefault();
        handleNavigation(allItems[focusedIndex].id, focusedIndex);
        return;
      } else {
        return;
      }

      setFocusedIndex(next);
      itemRefs.current[next]?.focus();
    },
    [focusedIndex, allItems]
  );

  const handleNavigation = (id, index) => {
    if (id === "theme-toggle") {
      setIsDark((prev) => !prev);
      playNote(index, 0.35);
      return;
    }
    if (id === "sound-toggle") {
      setSoundEnabled((prev) => !prev);
      playNote(index, 0.35);
      return;
    }

    setActiveIndex(index);
    playNote(index, 0.35);
    const element = document.getElementById(id);
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  /* ── Piano key type helper ── */
  const isBlackKey = (index) => [1, 3, 5].includes(index);

  /* ─────────────────────────────────────────────────────────
     RENDER
     ───────────────────────────────────────────────────────── */
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none px-2 sm:px-4 pt-0"
    >
      {/* Mounting Rail + Keys */}
      <nav
        ref={listRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onKeyDown={handleKeyDown}
        role="tablist"
        aria-label="Main navigation"
        className="pointer-events-auto relative flex items-start gap-0"
      >
        {/* Horizontal rail line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-text-primary z-20" />

        {allItems.map((item, index) => {
          const Icon = item.icon;
          const isActive =
            activeIndex === index &&
            !["theme-toggle", "sound-toggle"].includes(item.id);
          const isUtility = ["theme-toggle", "sound-toggle"].includes(item.id);
          const black = isBlackKey(index);
          const effect = "var(--effect, 0)";

          return (
            <div
              key={item.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              onClick={() => handleNavigation(item.id, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(-1)}
              tabIndex={0}
              role="tab"
              aria-selected={isActive}
              aria-label={
                isUtility ? `${item.name} mode` : `Navigate to ${item.name}`
              }
              className="relative group outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-text-primary/40 rounded-b-md sm:rounded-b-lg mt-[-8px]"
            >
              {/* Piano Key Body */}
              <div
                className={`
                  relative flex flex-col items-center justify-between overflow-hidden
                  rounded-b-md sm:rounded-b-lg
                  transition-colors duration-300
                  ${black
                    ? "z-10 w-6 sm:w-8 md:w-9 h-16 sm:h-20 md:h-24 bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900 shadow-md"
                    : "z-0 w-8 sm:w-8 md:w-12 h-20 sm:h-28 md:h-32 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                  }
                  ${isActive && !black
                    ? "bg-zinc-100 dark:bg-zinc-700"
                    : isActive && black
                    ? "bg-zinc-800 dark:bg-zinc-300"
                    : ""
                  }
                `}
                style={{
                  transform: `translateY(calc(${isActive ? 4 : 0}px + ${effect} * ${black ? 4 : 6}px))`,
                }}
              >
                {/* Top notch / contact line */}
                <div
                  className={`
                    w-full h-[2px] sm:h-[3px]
                    ${black
                      ? "bg-white/20 dark:bg-black/10"
                      : "bg-zinc-200 dark:bg-white/10"
                    }
                  `}
                />

          

                {/* Icon */}
                <div className="flex-1 flex items-center justify-center py-1">
                  <Icon
                    size={black ? 12 : 14}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className="transition-transform duration-200"
                    style={{
                      transform: `scale(calc(0.9 + ${effect} * 0.15))`,
                    }}
                  />
                </div>

                {/* Vertical Label */}
                <div className="flex-1 flex items-center justify-center pb-2">
                  <span
                    className={`
                      font-semibold uppercase tracking-[0.2em] leading-none
                      ${black ? "text-[7px] sm:text-[8px]" : "text-[8px] sm:text-[9px]"}
                    `}
                    style={{
                      writingMode: "vertical-rl",
                      textOrientation: "mixed",
                      transform: "rotate(180deg)",
                      opacity: `calc(0.6 + ${effect} * 0.4)`,
                    }}
                  >
                    {item.name}
                  </span>
                </div>

                {/* Bottom indicator */}
                <div className="pb-1.5 sm:pb-2">
                  <div
                    className={`
                      w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all duration-300
                      ${isActive
                        ? black
                          ? "bg-white dark:bg-zinc-900 scale-110"
                          : "bg-zinc-900 dark:bg-white scale-110"
                        : "scale-50 opacity-40"
                      }
                    `}
                    style={{
                      backgroundColor: isActive
                        ? undefined
                        : black
                        ? "rgba(255,255,255,0.3)"
                        : "rgba(0,0,0,0.15)",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </nav>
    </motion.header>
  );
};

export default Navbar;