import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
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
          border-top: 2px solid #18181B;
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
   PARTICLE IMAGE — Interactive mouse-reactive particle field
───────────────────────────────────────────────────────────────── */
const ParticleImage = ({
  src,
  className = "",
  particleGap = 3,
  maxSampleDim = 3000,
  mouseRadius = 85,
  repelStrength = 1.6,
  easing = 12,
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: null, y: null, radius: mouseRadius });
  const rafRef = useRef(null);
  const [ready, setReady] = useState(false);

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
        console.error("ParticleImage: CORS error", err);
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

          if (a < 100) continue;
          if (r > 240 && g > 240 && b > 240) continue; // Drop white bg

          const baseX = x * scaleX;
          const baseY = y * scaleY;

          particles.push({
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
    img.crossOrigin = "anonymous";

    const init = () => {
      if (cancelled) return;
      particlesRef.current = buildParticles(img, canvas);
      setReady(true);
    };

    img.onload = init;
    img.onerror = () => console.error("Failed to load", src);
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

  // Depth layers
  const bgTxtX = useTransform(mx, [-0.5, 0.5], ["20px", "-20px"]);
  const bgTxtY = useTransform(my, [-0.5, 0.5], ["10px", "-10px"]);

  const onMove = useCallback(
    (e) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      rawX.set((e.clientX - rect.left) / rect.width - 0.5);
      rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [rawX, rawY],
  );

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <AnimatePresence>{isLoading && <Loader />}</AnimatePresence>

      <section
        ref={sectionRef}
        onMouseMove={onMove}
        className="relative min-h-[100dvh] w-full overflow-hidden bg-[#FAFAFA] text-zinc-900 flex flex-col items-center justify-start pt-24 sm:pt-32"
      >
        {/* ── 1. ABSTRACT BLACK & WHITE BACKGROUND ── */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/bg1.jpg"
            alt="Abstract monochrome background"
            className="w-full h-full object-cover opacity-60 mix-blend-multiply"
          />
          {/* Subtle center fade to push the text forward */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA]/80 via-transparent to-[#FAFAFA]" />
        </div>

    

        {/* ── 3. MAIN CONTENT (Typography & CTA) ── */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl mx-auto mt-6 sm:mt-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight text-zinc-900"
             // Or your preferred serif/sans
          >
           The InF!n!ty<br className="hidden sm:block" />
            <span className="italic font-normal"> Mind$et</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-2 text-sm sm:text-base text-zinc-800 font-medium max-w-full mx-auto leading-relaxed"
          >
              Things happen where they can, and where they can’t, let’s make them happen.
          </motion.p>

          
        </div>

        {/* ── 4. PARTICLE PORTRAIT (Bottom Center) ── */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full opacity-80 max-w-4xl flex justify-center z-10 pointer-events-none">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <ParticleImage
              src={assets.footerImage}
              className="h-[45vh] sm:h-[55vh] md:h-[65vh]"
              particleGap={3}
              mouseRadius={85}
              repelStrength={1.6}
              easing={12}
            />
          </motion.div>
          
          {/* Soft gradient fade at the bottom to blend with the section */}
          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#FAFAFA] to-transparent z-20" />
        </div>

        {/* Decorative subtle grain overlay */}
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none z-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </section>
    </>
  );
};

export default Hero;