// Works.jsx
import React, { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { worksData } from "../assets/assets";
import {
  ArrowUpRight,
  X,
  ExternalLink,
  Calendar,
  Tag,
  ChevronRight,
  Layers,
  Code2,
  Sparkles,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Project from "./Project";

/* ═════════════════════════════════════════════════════════════
   CONFIGURATION
   ═════════════════════════════════════════════════════════════ */
const FALLOFF_CURVES = {
  linear: (p) => p,
  smooth: (p) => p * p * (3 - 2 * p),
  sharp: (p) => p * p * p,
};

const NOTES = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];

const CATEGORIES = ["All", "Web App", "Mobile", "Web3", "AI/ML"];

/* ═════════════════════════════════════════════════════════════
   AUDIO ENGINE
   ═════════════════════════════════════════════════════════════ */
const usePianoAudio = (enabled = true) => {
  const ctxRef = useRef(null);

  const playNote = useCallback((index, velocity = 0.25) => {
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
      gain.gain.linearRampToValueAtTime(velocity, ctx.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {}
  }, [enabled]);

  return { playNote };
};

/* ═════════════════════════════════════════════════════════════
   SMOOTH SCROLL HOOK
   ═════════════════════════════════════════════════════════════ */
const useSmoothScroll = () => {
  useEffect(() => {
    const html = document.documentElement;
    const original = html.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";
    return () => {
      html.style.scrollBehavior = original;
    };
  }, []);
};

/* ═════════════════════════════════════════════════════════════
   PIANO KEY GALLERY - Standard Width, Vertical Scroll on Mobile
   ═════════════════════════════════════════════════════════════ */
const PianoKeyGallery = ({
  items,
  activeIndex,
  setActiveIndex,
  onSelect,
  soundEnabled = true,
}) => {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const targetsRef = useRef([]);
  const currentRef = useRef([]);
  const rafRef = useRef(null);
  const lastRef = useRef(0);
  const lastPlayedRef = useRef(-1);
  const { playNote } = usePianoAudio(soundEnabled);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const runFrame = useCallback((now) => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    const tau = 0.09;
    const k = reducedMotion ? 1 : 1 - Math.exp(-dt / tau);

    let moving = false;
    const refs = itemRefs.current;

    for (let i = 0; i < refs.length; i++) {
      const el = refs[i];
      if (!el) continue;
      const target = Math.max(targetsRef.current[i] || 0, activeIndex === i ? 1 : 0);
      const cur = currentRef.current[i] || 0;
      const next = cur + (target - cur) * k;
      const settled = Math.abs(target - next) < 0.002;
      const value = settled ? target : next;
      currentRef.current[i] = value;
      el.style.setProperty("--effect", value.toFixed(4));
      if (!settled) moving = true;
    }

    rafRef.current = moving ? requestAnimationFrame(runFrame) : null;
  }, [activeIndex, reducedMotion]);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const handlePointerMove = useCallback((e) => {
    const list = containerRef.current;
    if (!list) return;
    const rect = list.getBoundingClientRect();
    
    // Check if mobile - use vertical positioning
    const pointerPos = isMobile ? e.clientY - rect.top : e.clientX - rect.left;
    const ease = FALLOFF_CURVES.smooth;
    const refs = itemRefs.current;
    let maxEffect = 0;
    let maxIndex = -1;

    for (let i = 0; i < refs.length; i++) {
      const el = refs[i];
      if (!el) continue;
      const center = isMobile 
        ? el.offsetTop + el.offsetHeight / 2 
        : el.offsetLeft + el.offsetWidth / 2;
      const distance = Math.abs(pointerPos - center);
      const raw = Math.max(0, 1 - distance / (isMobile ? 100 : 140));
      const val = ease(raw);
      targetsRef.current[i] = val;
      if (val > maxEffect) {
        maxEffect = val;
        maxIndex = i;
      }
    }

    if (maxEffect > 0.5 && maxIndex !== lastPlayedRef.current) {
      playNote(maxIndex, maxEffect * 0.25);
      lastPlayedRef.current = maxIndex;
    } else if (maxEffect < 0.1) {
      lastPlayedRef.current = -1;
    }
    startLoop();
  }, [startLoop, playNote, isMobile]);

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = targetsRef.current.map(() => 0);
    lastPlayedRef.current = -1;
    startLoop();
  }, [startLoop]);

  useEffect(() => {
    startLoop();
  }, [activeIndex, startLoop]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleKeyDown = useCallback((e) => {
    const max = items.length - 1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev >= max ? 0 : prev + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? max : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      onSelect?.(items[activeIndex]);
    }
  }, [items, activeIndex, onSelect, setActiveIndex]);

  const isBlackKey = (index) => [1, 3, 5].includes(index % 6);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
      className={`relative w-full h-full overflow-y-auto overflow-x-hidden ${
        isMobile ? "flex flex-col" : "flex items-start"
      }`}
      style={{ 
        gap: isMobile ? "8px" : "4px",
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
      role="list"
      aria-label="Project gallery"
    >
      {/* Mounting Rail - Horizontal for desktop, Vertical for mobile */}
      {!isMobile && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-zinc-900/20 z-20" />
      )}
      {isMobile && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-zinc-900/20 z-20" />
      )}

      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {items.map((item, i) => {
        const isActive = i === activeIndex;
        const black = isBlackKey(i);
        const effect = "var(--effect, 0)";

        return (
          <motion.div
            key={item.id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={`relative group outline-none cursor-pointer ${
              isMobile 
                ? "w-full h-[80px] min-h-[80px] flex-shrink-0" 
                : "flex-1 h-full"
            }`}
            initial={false}
            animate={{
              x: !isMobile && isActive ? 4 : 0,
              y: isMobile && isActive ? 4 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: reducedMotion ? 300 : 200,
              damping: reducedMotion ? 30 : 25,
            }}
            onMouseEnter={() => {
              setHoveredIndex(i);
              setActiveIndex(i);
            }}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => {
              setActiveIndex(i);
              onSelect?.(item);
            }}
            onFocus={() => setActiveIndex(i)}
            tabIndex={0}
            role="listitem"
            aria-label={item.title}
            aria-current={isActive ? "true" : undefined}
          >
            {/* Piano Key Body */}
            <div
              className={`
                relative flex overflow-hidden h-full w-full
                transition-colors duration-500
                ${isMobile ? "flex-row items-center rounded-r-xl" : "flex-col items-center justify-between rounded-b-xl"}
                ${black ? "bg-zinc-900 text-white" : "bg-white text-zinc-900"}
              `}
              style={{
                transform: isMobile 
                  ? `translateX(calc(${isActive ? 3 : 0}px + ${effect} * ${black ? 4 : 6}px))`
                  : `translateY(calc(${isActive ? 3 : 0}px + ${effect} * ${black ? 4 : 6}px))`,
                boxShadow: isActive
                  ? "0 25px 50px -12px rgba(0,0,0,0.15)"
                  : "0 4px 6px -1px rgba(0,0,0,0.05)",
                border: isActive 
                  ? black 
                    ? "2px solid rgba(255,255,255,0.3)" 
                    : "2px solid rgba(0,0,0,0.15)"
                  : "1px solid rgba(0,0,0,0.05)",
              }}
            >
              {/* Top contact line - Desktop */}
              {!isMobile && (
                <div className={`w-full ${black ? "h-[2px] bg-white/15" : "h-[3px] bg-zinc-200"}`} />
              )}
              {/* Left contact line - Mobile */}
              {isMobile && (
                <div className={`h-full ${black ? "w-[2px] bg-white/15" : "w-[3px] bg-zinc-200"}`} />
              )}

              {/* Index Number */}
              <span className={`font-mono font-bold tracking-tighter ${
                isMobile ? "px-3" : "pt-3"
              } ${black ? "text-[8px] sm:text-[9px] text-white/40" : "text-[9px] sm:text-[10px] text-zinc-400"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Title - Vertical on desktop, Horizontal on mobile */}
              <div className={`flex items-center justify-center overflow-hidden ${
                isMobile ? "flex-1 px-3" : "flex-1 w-full px-1"
              }`}>
                <span
                  className={`font-clash font-bold whitespace-nowrap ${
                    black ? "text-white/90" : "text-zinc-800"
                  }`}
                  style={isMobile ? {
                    letterSpacing: "0.08em",
                    fontSize: "14px",
                    opacity: isActive ? 1 : `calc(0.7 + ${effect} * 0.3)`,
                  } : {
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    letterSpacing: "0.12em",
                    fontSize: "14px",
                    opacity: isActive ? 1 : `calc(0.7 + ${effect} * 0.3)`,
                  }}
                >
                  {item.title}
                </span>
              </div>

              {/* Category Badge */}
              <div className={isMobile ? "px-3" : "pb-3 px-1"}>
                <span
                  className={`text-[7px] sm:text-[8px] font-semibold uppercase tracking-widest ${
                    black ? "text-zinc-400" : "text-zinc-500"
                  }`}
                  style={isMobile ? {
                    opacity: isActive ? 0.9 : 0.5,
                  } : {
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    opacity: isActive ? 0.9 : 0.5,
                  }}
                >
                  {item.category}
                </span>
              </div>

              {/* Indicator Dot */}
              <div className={isMobile ? "px-3" : "pb-2"}>
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                    isActive
                      ? black
                        ? "bg-white scale-110"
                        : "bg-zinc-900 scale-110"
                      : "scale-50 opacity-30"
                  }`}
                  style={{
                    backgroundColor: !isActive
                      ? black
                        ? "rgba(255,255,255,0.3)"
                        : "rgba(0,0,0,0.15)"
                      : undefined,
                  }}
                />
              </div>

              {/* Proximity Glow */}
              <div
                className={`absolute inset-0 pointer-events-none ${
                  isMobile ? "rounded-r-xl" : "rounded-b-xl"
                }`}
                style={{
                  opacity: `calc(${effect} * 0.06)`,
                  background: `radial-gradient(circle at ${isMobile ? "30% 50%" : "50% 30%"}, ${
                    black ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.15)"
                  }, transparent 70%)`,
                }}
              />

              {/* Hover Overlay */}
              <AnimatePresence>
                {hoveredIndex === i && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 pointer-events-none ${
                      isMobile ? "rounded-r-xl" : "rounded-b-xl"
                    } ${black ? "bg-white/5" : "bg-zinc-900/5"}`}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

/* ═════════════════════════════════════════════════════════════
   MAIN WORKS COMPONENT
   ═════════════════════════════════════════════════════════════ */
const Works = () => {
  useSmoothScroll();

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredItems = useMemo(() => {
    const base = worksData.map((work, index) => ({
      id: work.id,
      title: work.title,
      category: work.category,
      shortDescription: work.shortDescription,
      fullDescription: work.fullDescription,
      thumbnail: work.thumbnail,
      images: work.images,
      techStack: work.techStack,
      softwareUsed: work.softwareUsed || work.techStack,
      liveUrl: work.liveUrl,
      githubUrl: work.githubUrl,
      links: {
        live: work.liveUrl || work.links?.live,
        github: work.githubUrl || work.links?.github,
      },
      year: work.year,
      accentColor: work.accentColor,
      projectType: work.projectType || work.category,
      originalIndex: index,
    }));

    if (filter === "All") return base;
    return base.filter((item) => item.category === filter);
  }, [filter]);

  useEffect(() => {
    setActiveIndex(0);
  }, [filter]);

  const handleSelect = (item) => {
    setSelectedProject(item);
    setIsProjectOpen(true);
  };

  const handleCloseProject = () => {
    setIsProjectOpen(false);
    setTimeout(() => setSelectedProject(null), 500);
  };

  return (
    <>
      <section
        id="works"
        ref={sectionRef}
        className="relative w-full h-auto bg-[#FAFAFA] text-zinc-900 flex flex-col font-primary scroll-mt-24 overflow-hidden"
      >
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), 
                             linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Header */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 pt-16 md:pt-20 pb-6 shrink-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 md:w-12 bg-zinc-900" />
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-zinc-900 font-bold">
                  Selected Projects
                </span>
              </div>
              <h2 className="font-clash font-black text-[40px] sm:text-[60px] md:text-[80px] text-zinc-900 leading-[0.85] tracking-tighter">
                Works.
              </h2>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`
                    px-3 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300
                    ${
                      filter === cat
                        ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
                        : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400"
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Piano Key Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 flex-1 min-h-0 pb-6"
          style={{ minHeight: '300px' }}
        >
          <PianoKeyGallery
            items={filteredItems}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onSelect={handleSelect}
            soundEnabled={true}
          />
        </motion.div>

        {/* Bottom Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 py-4 flex items-center justify-between shrink-0"
        >
          <p className="text-[9px] sm:text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-semibold">
            Click any key to explore
          </p>
          <div className="flex items-center gap-2 text-zinc-400">
            <ChevronRight size={12} />
            <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider">
              {filteredItems.length} Projects
            </span>
          </div>
        </motion.div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {isProjectOpen && selectedProject && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-[#FAFAFA] overflow-y-auto"
          >
            <Project 
              project={selectedProject} 
              onClose={handleCloseProject}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Works;