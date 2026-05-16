import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { assets } from "../assets/assets";

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

    let _raf;
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
        _raf = requestAnimationFrame(tick);
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
      cancelAnimationFrame(_raf);
    };
  }, []);

  return (
    <span ref={containerRef} className={`inline-flex flex-wrap ${className}`}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="char-hover inline-block whitespace-pre cursor-default"
        >
          {char}
        </span>
      ))}
    </span>
  );
};

/* ─────────────────────────────────────────────────────────────────
   CURSOR GLOW — Soft accent radial follows the mouse
───────────────────────────────────────────────────────────────── */
const CursorGlow = () => {
  const cx = useMotionValue(-400);
  const cy = useMotionValue(-400);
  const sx = useSpring(cx, { damping: 25, stiffness: 150 });
  const sy = useSpring(cy, { damping: 25, stiffness: 150 });

  useEffect(() => {
    const fn = (e) => {
      cx.set(e.clientX - 200);
      cy.set(e.clientY - 200);
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [cx, cy]);

  return (
    <motion.div
      className="hidden md:block fixed w-[400px] h-[400px] rounded-full pointer-events-none z-0 gpu-accelerate"
      style={{
        x: sx,
        y: sy,
        background:
          "radial-gradient(circle, rgba(244,91,38,0.08) 0%, transparent 60%)",
      }}
    />
  );
};

/* ─────────────────────────────────────────────────────────────────
   ATMOSPHERIC DUST — Cinematic floating particles
───────────────────────────────────────────────────────────────── */
const DustParticles = () => {
  const [particles] = useState(() =>
    Array.from({ length: 20 }).map(() => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 80,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 6 + 6,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.6 + 0.2,
    })),
  );

  return (
    <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-themeBrown/40 blur-sm gpu-accelerate"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [p.opacity * 0.2, p.opacity, p.opacity * 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   MAIN HERO COMPONENT — Enhanced with parallax & animations
───────────────────────────────────────────────────────────────── */
const Hero = () => {
  const sectionRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const cfg = { damping: 30, stiffness: 100 };
  const mx = useSpring(rawX, cfg);
  const my = useSpring(rawY, cfg);

  const textX = useTransform(mx, [-0.5, 0.5], ["-30px", "30px"]);
  const textY = useTransform(my, [-0.5, 0.5], ["-15px", "15px"]);
  const bgTxtX = useTransform(mx, [-0.5, 0.5], ["40px", "-40px"]);
  const rotateZ = useTransform(mx, [-0.5, 0.5], [-2, 2]);

  const onMove = (e) => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <>
      <CursorGlow />

      <section
        ref={sectionRef}
        onMouseMove={onMove}
        className="relative min-h-[100dvh] w-full overflow-hidden flex items-start pt-32 md:pt-0 md:items-center justify-center md:justify-end bg-background"
      >
        {/* GRAIN TEXTURE */}
        <div
          className="absolute inset-0 z-[20] pointer-events-none opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* BACKGROUND EDITORIAL TEXT */}
        <motion.div
          style={{ x: bgTxtX }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[1]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.45, scale: 1 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="text-[20vw] md:text-[16vw] font-clash font-black text-black leading-none whitespace-nowrap tracking-tighter"
            style={{
              filter: "drop-shadow(0 0 50px rgba(0,0,0,0.04))",
            }}
          >
            <JellyText text="BEERESH" />
          </motion.div>
        </motion.div>

        {/* PREMIUM LIGHTING & GLOWS */}
        <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              opacity: [0.25, 0.5, 0.25],
              scale: [1, 1.08, 1],
              x: [-20, 20, -20],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-accent/15 blur-[130px] gpu-accelerate"
          />
          <motion.div
            animate={{
              opacity: [0.15, 0.3, 0.15],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute -bottom-20 -right-32 w-[600px] h-[600px] rounded-full bg-themeBrown/10 blur-[120px] gpu-accelerate"
          />
        </div>

        {/* PREMIUM CONIC GRADIENT LIGHTING */}
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
          <div
            className="absolute -top-20 -left-20 w-[150%] h-[150%] opacity-[0.15]"
            style={{
              background:
                "conic-gradient(from 135deg at 0% 0%, transparent 0%, rgba(244,91,38,0.25) 15%, transparent 25%, rgba(244,91,38,0.1) 40%, transparent 55%)",
              filter: "blur(70px)",
            }}
          />
        </div>

        <DustParticles />

        {/* HERO IMAGE */}
        <div className="absolute inset-x-0 bottom-0 z-[4] flex justify-center md:justify-start pointer-events-none md:pl-20 overflow-hidden">
          <motion.img
            src={assets.footerImage}
            alt="Beeresh Kumar"
            initial={{ opacity: 0, y: 120, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 1.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.2,
            }}
            whileInView={{
              y: [0, -15, 0],
            }}
            viewport={{ once: true }}
            className="h-[75vh] sm:h-[65vh] md:h-[90vh] lg:h-[95vh] w-auto object-contain object-bottom sm:drop-shadow-[0_30px_60px_rgba(0,0,0,0.15)] gpu-accelerate"
          />
        </div>

        {/* GRADIENT SHIELDS */}
        <div className="absolute inset-0 z-[6] pointer-events-none bg-gradient-to-l from-background via-background/60 md:via-background/20 to-transparent" />
        <div className="absolute inset-0 z-[6] pointer-events-none bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute inset-0 top-0 z-[6] pointer-events-none bg-gradient-to-b from-background/95 via-background/30 md:from-transparent to-transparent h-[50vh] md:h-0" />

        {/* STATS */}
        <div className="absolute left-8 bottom-[-10%] -translate-y-1/2 z-[11] hidden xl:flex flex-col gap-8">
          {[
            { num: "Freelancer", label: "MERN Solutions" },
            { num: "Student", label: "Computer Science Eng" },
            { num: "MERN", label: "MERN + WEB 3.O Dev" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, x: -25, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{
                delay: 1.5 + i * 0.2,
                duration: 0.8,
                ease: "easeOut",
              }}
              whileHover={{ x: 8 }}
              className="group flex flex-col items-start cursor-pointer"
            >
              <span className="font-clash text-3xl font-bold leading-none text-textPrimary group-hover:text-accent transition-colors duration-300 gpu-accelerate">
                {s.num}
              </span>
              <span className="font-outfit text-xs-tiny uppercase tracking-[0.3em] text-textTertiary group-hover:text-accent mt-2 transition-colors">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* MAIN TEXT CONTENT */}
        <motion.div
          style={{ x: textX, y: textY }}
          className="relative z-[11] w-full max-w-[1440px] px-6 sm:px-12 lg:px-24 flex flex-col items-center md:items-end text-center md:text-right gpu-accelerate"
        >
          <div className="flex flex-col gap-6 sm:gap-8 items-center md:items-end max-w-2xl lg:max-w-3xl mt-[-5vh] md:mt-0">
            {/* HEADLINE */}
            <div className="overflow-hidden pb-4 w-full flex justify-center md:justify-end perspective">
              <motion.h2
                initial={{ opacity: 0, y: 60, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  delay: 0.8,
                  duration: 1.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ rotateZ }}
                className="font-clash font-bold text-textPrimary leading-[0.9] tracking-tighter text-5xl sm:text-6xl md:text-7xl lg:text-[90px] gpu-accelerate"
              >
                <JellyText text="Reality Is Just" />
                <br />
                <motion.span
                  className="font-clash italic font-medium text-accent drop-shadow-[0_12px_30px_rgba(244,91,38,0.25)]"
                  animate={{
                    opacity: [0.9, 1, 0.9],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <JellyText text="The Beginning" />
                </motion.span>
              </motion.h2>
            </div>

            {/* SUBTITLE */}
            <motion.p
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-textSecondary font-outfit text-xs-small sm:text-sm font-semibold tracking-[0.25em] max-w-md uppercase"
            >
              Software Architect & Web3 Pioneer
            </motion.p>

            {/* CTA BUTTON */}
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="mt-8 md:mt-10"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden text-textPrimary px-7 py-4 sm:px-10 sm:py-5 rounded-full font-outfit font-bold text-xs-small sm:text-xs uppercase tracking-[0.2em] bg-white/70 backdrop-blur-md border border-textPrimary/10 transition-all duration-300 hover:border-accent/30 shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(244,91,38,0.15)]"
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative z-10 flex items-center gap-3 group-hover:text-accent transition-colors duration-300">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-accent"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  Explore Portfolio
                </span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Hero;
