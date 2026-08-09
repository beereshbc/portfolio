import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  Code2,
  CodeSquare,
  CupSoda,
  Palette,
  Smile,
  TerminalSquare,
} from "lucide-react";
import { assets } from "../assets/assets";

/* ─────────────────────────────────────────────────────────────────
   LOADER COMPONENT (Monochrome Theme)
───────────────────────────────────────────────────────────────── */
const Loader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#FAFAFA]"
    >
      <div id="loader">
        <div className="inner rotate-one"></div>
        <div className="inner rotate-two"></div>
        <div className="inner rotate-three"></div>
      </div>
      <style>{`
        #loader {
          width: 100px;
          height: 80px;
          position: relative;
          top: auto;
          left: auto;
          margin: 0;
        }
        .inner {
          animation: rotate 0.8s linear infinite;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          position: absolute;
        }
        .rotate-one {
          left: 50%;
          margin-left: -25px;
          border-top: 2px solid #18181B; /* zinc-900 */
        }
        .rotate-two {
          top: -10px;
          left: 30px;
          border-left: 2px solid #18181B;
        }
        .rotate-three {
          top: -10px;
          right: 30px;
          border-right: 2px solid #18181B;
        }
        @keyframes rotate {
          0% { transform: rotateZ(0deg); }
          100% { transform: rotateZ(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   JELLY TEXT HOVER — Custom Spring Physics (Squash + Stretch)
───────────────────────────────────────────────────────────────── */
const JellyText = ({ text, className = "" }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const chars = Array.from(container.querySelectorAll(".char-hover"));
    const st = chars.map(() => ({ sx: 1, svx: 0, sy: 1, svy: 0 }));
    chars.forEach((ch) => {
      ch.style.transformOrigin = "50% 80%";
    });
    let rafId;
    let isAnimating = false;
    const tick = () => {
      let settled = true;
      chars.forEach((ch, i) => {
        const s = st[i];
        s.svx += (1 - s.sx) * 0.14;
        s.svx *= 0.58;
        s.sx += s.svx;
        s.svy += (1 - s.sy) * 0.14;
        s.svy *= 0.58;
        s.sy += s.svy;
        ch.style.transform = `scaleX(${s.sx}) scaleY(${s.sy})`;
        if (
          Math.abs(1 - s.sx) > 0.001 ||
          Math.abs(s.svx) > 0.001 ||
          Math.abs(1 - s.sy) > 0.001 ||
          Math.abs(s.svy) > 0.001
        ) {
          settled = false;
        }
      });
      if (!settled) {
        rafId = requestAnimationFrame(tick);
      } else {
        isAnimating = false;
      }
    };
    const onMouseOver = (e) => {
      const idx = chars.indexOf(e.target);
      if (idx < 0) return;
      st[idx].svx = -0.12;
      st[idx].svy = 0.12;
      if (!isAnimating) {
        isAnimating = true;
        tick();
      }
    };
    container.addEventListener("mouseover", onMouseOver);
    return () => {
      container.removeEventListener("mouseover", onMouseOver);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
  return (
    <span ref={containerRef} className={`inline-flex flex-wrap ${className}`}>
      {text.split("").map((char, idx) => (
        <span
          key={idx}
          className="char-hover inline-block whitespace-pre cursor-default"
        >
          {char}
        </span>
      ))}
    </span>
  );
};

/* ─────────────────────────────────────────────────────────────────
   ATMOSPHERIC DUST — Dark particles for Light Theme
───────────────────────────────────────────────────────────────── */
const DustParticles = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.15;
        this.opacity = Math.random() * 0.3 + 0.05;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }
      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // Black particles for light background
        ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      const particleCount = Math.min(80, Math.floor((width * height) / 10000));
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      particlesRef.current.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    animate();
    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[5] w-full h-full"
    />
  );
};

/* ─────────────────────────────────────────────────────────────────
   PARTICLE IMAGE — converts a raster photo into a cursor-reactive
   particle field. Pixels are sampled from an off-screen canvas,
   near-white / transparent background pixels are dropped, and the
   surviving pixels retain their original RGB color so the subject
   still reads naturally (not tinted or monochrome).
───────────────────────────────────────────────────────────────── */
const ParticleImage = ({
  src,
  className = "",
  particleGap = 1, // smaller = denser field, more particles
  maxSampleDim = 3000, // caps the off-screen sampling resolution for perf
  mouseRadius = 35,
  repelStrength = 1.6,
  easing = 98, // higher = slower/softer return to base position
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: null, y: null, radius: mouseRadius });
  const rafRef = useRef(null);
  const imgRef = useRef(null);
  const [ready, setReady] = useState(false);

  // Sample the image into a particle array sized to fit the container height
  const buildParticles = useCallback(
    (img, canvas) => {
      const container = containerRef.current;
      if (!container || !img.naturalWidth) return [];

      const displayHeight = container.clientHeight;
      const displayWidth = Math.round(
        (img.naturalWidth / img.naturalHeight) * displayHeight
      );

      canvas.width = displayWidth;
      canvas.height = displayHeight;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      // Off-screen canvas at a capped resolution — this is what we
      // repeatedly call getImageData on, so willReadFrequently helps here.
      const scaleDown = Math.min(
        1,
        maxSampleDim / Math.max(img.naturalWidth, img.naturalHeight)
      );
      const sw = Math.max(1, Math.round(img.naturalWidth * scaleDown));
      const sh = Math.max(1, Math.round(img.naturalHeight * scaleDown));

      const off = document.createElement("canvas");
      off.width = sw;
      off.height = sh;
      const offCtx = off.getContext("2d", { willReadFrequently: true });
      offCtx.drawImage(img, 0, 0, sw, sh);

      let pixels;
      try {
        pixels = offCtx.getImageData(0, 0, sw, sh).data;
      } catch (err) {
        // Likely a CORS-tainted canvas — image must be same-origin or served
        // with proper CORS headers for pixel sampling to work.
        console.error("ParticleImage: could not read pixel data (CORS?)", err);
        return [];
      }

      const scaleX = displayWidth / sw;
      const scaleY = displayHeight / sh;
      const particles = [];

      for (let y = 0; y < sh; y += particleGap) {
        for (let x = 0; x < sw; x += particleGap) {
          const i = (y * sw + x) * 4;
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          if (a < 100) continue; // transparent background
          if (r > 240 && g > 240 && b > 240) continue; // flattened white background

          const baseX = x * scaleX;
          const baseY = y * scaleY;

          particles.push({
            // start scattered so the portrait assembles on load
            x: Math.random() * displayWidth,
            y: Math.random() * displayHeight,
            baseX,
            baseY,
            size: Math.random() * 1.3 + 1,
            color: `rgb(${r},${g},${b})`,
            density: Math.random() * 3 + 1,
          });
        }
      }
      return particles;
    },
    [particleGap, maxSampleDim]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    let cancelled = false;

    const img = new Image();
    imgRef.current = img;
    img.crossOrigin = "anonymous";

    const init = () => {
      if (cancelled) return;
      particlesRef.current = buildParticles(img, canvas);
      setReady(true);
    };

    img.onload = init;
    img.onerror = () => console.error("ParticleImage: failed to load", src);
    img.src = src;

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    let resizeTimeout;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (img.complete && img.naturalWidth) init();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mouse.x !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const fx = (dx / dist) * force * p.density * repelStrength;
            const fy = (dy / dist) * force * p.density * repelStrength;
            p.x -= fx;
            p.y -= fy;
          } else {
            p.x -= (p.x - p.baseX) / easing;
            p.y -= (p.y - p.baseY) / easing;
          }
        } else {
          p.x -= (p.x - p.baseX) / easing;
          p.y -= (p.y - p.baseY) / easing;
        }

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      clearTimeout(resizeTimeout);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, buildParticles]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className={`block transition-opacity duration-700 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   MAIN HERO COMPONENT
───────────────────────────────────────────────────────────────── */
const Hero = () => {
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef(null);

  // Mouse Parallax Setup
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const cfg = { damping: 40, stiffness: 100 };
  const mx = useSpring(rawX, cfg);
  const my = useSpring(rawY, cfg);

  // Transform values for different layers to create depth
  const bgTxtX = useTransform(mx, [-0.5, 0.5], ["20px", "-20px"]);
  const bgTxtY = useTransform(my, [-0.5, 0.5], ["10px", "-10px"]);
  const fgTxtX = useTransform(mx, [-0.5, 0.5], ["-30px", "30px"]);
  const cardsX = useTransform(mx, [-0.5, 0.5], ["-15px", "15px"]);
  const cardsY = useTransform(my, [-0.5, 0.5], ["-10px", "10px"]);

  const onMove = useCallback(
    (e) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      rawX.set((e.clientX - rect.left) / rect.width - 0.5);
      rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [rawX, rawY],
  );

  // Simulate loading screen
  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {/* Loading Screen Overlay */}
      <AnimatePresence>{isLoading && <Loader />}</AnimatePresence>

      <section
        ref={sectionRef}
        onMouseMove={onMove}
        // Light theme background
        className="relative min-h-[100dvh] w-full overflow-hidden bg-[#FAFAFA] text-zinc-900 flex items-center justify-center font-primary"
      >
        <DustParticles />

        <div className="text-3xl md:text-7xl mb-40 md:mb-96 font-medium">
          <p className="inline-flex items-baseline gap-2">
            <p className="  text-orange-600"> I CoDe</p>, Not v!be CoDe.
            <Smile size={20} />
          </p>
        </div>

        {/* 1. BACKGROUND HUGE TEXT (Behind Image) */}
        <motion.div
          style={{ x: bgTxtX, y: bgTxtY }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[2]"
        >
          <h1 className="text-[22vw] md:text-[20vw] font-humane font-black leading-none whitespace-nowrap tracking-tighter text-zinc-900 opacity-90 mix-blend-multiply">
            <JellyText text="BEERESH" />
          </h1>
        </motion.div>

        {/* 2. TOP NAVBAR */}
        <div className="absolute top-0 w-full px-5 sm:px-6 md:px-12 pt-6 md:pt-8 z-[20] flex justify-between items-center font-medium">
          <div className="font-display font-black text-xl sm:text-2xl tracking-wide uppercase text-zinc-900">
            Beeresh B C
          </div>
          <div className="hidden md:flex gap-8 text-zinc-600 text-sm">
            <a href="#about" className="hover:text-black transition-colors">
              About
            </a>
            <a href="#works" className="hover:text-black transition-colors">
              Projects
            </a>
            <a href="#skills" className="hover:text-black transition-colors">
              Skills
            </a>
          </div>
        </div>

        {/* 3. LEFT STATS (Responsive text sizing) */}
        <div className="absolute left-6 bottom-[-100px] md:left-12  -translate-y-1/2 z-[10] hidden lg:flex flex-col gap-10">
          {[
            { num: "8.6", label: "CGPA Score" },
            { num: "40+", label: "MERN Projects" },
            { num: "100%", label: "Client Satisfaction" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 + idx * 0.2, duration: 0.8 }}
              className="flex flex-col"
            >
              <span className="font-display font-black text-2xl xl:text-4xl tracking-tight text-zinc-900">
                {stat.num}
              </span>
              <span className="text-[10px] xl:text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* 4. MAIN CENTER SUBJECT — now an interactive particle portrait */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl flex justify-center z-[5] pointer-events-none">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <ParticleImage
              src={assets.footerImage}
              className="h-[65vh] sm:h-[75vh] md:h-[85vh] drop-shadow-2xl"
              particleGap={3}
              mouseRadius={85}
              repelStrength={1.6}
              easing={12}
            />
          </motion.div>
          {/* Soft gradient fade at the bottom of the image for light theme */}
          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#FAFAFA] to-transparent z-[6]" />
        </div>

        {/* 6. RIGHT SIDE GLASSMORPHISM CARDS (Light Theme widgets) */}
        <motion.div
          style={{ x: cardsX, y: cardsY }}
          className="absolute right-6 xl:right-12 top-1/2 -translate-y-1/2 z-[15] hidden xl:flex flex-col gap-4 w-[280px]"
        >
          {/* Top Highlight Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
            className="bg-white/80 backdrop-blur-2xl border border-zinc-200/60 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-zinc-900"
          >
            <div className="flex justify-between items-center mb-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <span>Current Focus</span>
              <button className="bg-zinc-100 p-2 rounded-full hover:bg-zinc-200 transition">
                <ArrowRight size={12} className="text-zinc-600" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white opacity-10 font-bold text-xl shadow-lg">
                <TerminalSquare size={20} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-base leading-tight">
                Full-Stack
                <br />
                Development
              </span>
            </div>
          </motion.div>

          {/* Secondary Cards mapping using Lucide Icons */}
          {[
            { date: "MERN Stack", title: "React & Node.js", icon: Code2 },
            { date: "DSA", title: "Java(OOP) + DSA", icon: CupSoda },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.7 + idx * 0.15 }}
              className="group bg-white/60 backdrop-blur-xl border border-zinc-200/50 hover:bg-white/90 transition-all duration-300 rounded-3xl p-5 cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="flex justify-between items-center mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                <span>{card.date}</span>
                <ArrowRight
                  size={12}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-900"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300">
                  <card.icon size={18} strokeWidth={2.5} />
                </div>
                <span className="font-bold text-[13px] tracking-wide text-zinc-800">
                  {card.title}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
};

export default Hero;