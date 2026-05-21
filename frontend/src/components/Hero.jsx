import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
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
   CURSOR GLOW — Soft accent radial follows the mouse
───────────────────────────────────────────────────────────────── */
const CursorGlow = () => {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { damping: 25, stiffness: 150 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 150 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      style={{
        left: springX,
        top: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      className="fixed pointer-events-none z-[100] w-[500px] h-[500px] rounded-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 bg-gradient-radial from-accent/40 via-accent/5 to-transparent rounded-full blur-3xl" />
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   ATMOSPHERIC DUST — Cinematic floating particles (Canvas)
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
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.4 + 0.1;
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
        ctx.fillStyle = `rgba(94, 0, 6, ${this.opacity * 0.6})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      const particleCount = Math.min(120, Math.floor((width * height) / 8000));
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
   LOADER COMPONENT — Rotating rings animation (Updated colors)
───────────────────────────────────────────────────────────────── */
const Loader = () => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background">
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
          border-top: 2px solid #5E0006;
        }
        .rotate-two {
          top: -10px;
          left: 30px;
          border-left: 2px solid #5E0006;
        }
        .rotate-three {
          top: -10px;
          right: 30px;
          border-right: 2px solid #5E0006;
        }
        @keyframes rotate {
          0% { transform: rotateZ(0deg); }
          100% { transform: rotateZ(360deg); }
        }
      `}</style>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   MAIN HERO COMPONENT — Enhanced with parallax & animations
───────────────────────────────────────────────────────────────── */
const Hero = () => {
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const cfg = { damping: 30, stiffness: 120 };
  const mx = useSpring(rawX, cfg);
  const my = useSpring(rawY, cfg);

  const textX = useTransform(mx, [-0.5, 0.5], ["-20px", "20px"]);
  const textY = useTransform(my, [-0.5, 0.5], ["-10px", "10px"]);
  const bgTxtX = useTransform(mx, [-0.5, 0.5], ["30px", "-30px"]);
  const rotateZ = useTransform(mx, [-0.5, 0.5], [-1.5, 1.5]);

  const onMove = useCallback(
    (e) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      rawX.set((e.clientX - rect.left) / rect.width - 0.5);
      rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [rawX, rawY],
  );

  // Simulate loading (image preload + minimum display time)
  useEffect(() => {
    const img = new Image();
    img.src = assets.footerImage;
    img.onload = () => {
      setTimeout(() => setIsLoading(false), 800);
    };
    const timeout = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <AnimatePresence>{isLoading && <Loader />}</AnimatePresence>

      <CursorGlow />

      <section
        ref={sectionRef}
        onMouseMove={onMove}
        className="relative min-h-[100dvh] w-full overflow-x-hidden flex items-start pt-20 md:pt-0 md:items-center justify-center md:justify-end bg-background"
      >
        {/* GRAIN TEXTURE OVERLAY - Light theme optimized */}
        <div
          className="absolute inset-0 z-[20] opacity-[0.04] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* BACKGROUND EDITORIAL TEXT */}
        <motion.div
          style={{ x: bgTxtX }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[1] overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.9, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="text-[20vw] sm:text-[20vw] md:text-[16vw] font-humane font-black text-themeBlack leading-none whitespace-nowrap tracking-tighter"
          >
            <JellyText text="BEERESH" />
          </motion.div>
        </motion.div>

        {/* PREMIUM CONIC GRADIENT LIGHTING - Light theme */}
        <div className="absolute inset-0 z-[2] pointer-events-none bg-gradient-conic from-themeBrown/3 via-transparent to-themeBrown/3 opacity-90" />

        <DustParticles />

        {/* HERO IMAGE - Responsive sizing & positioning */}
        <div className="absolute inset-x-0 bottom-0 z-[4] flex justify-center md:justify-start pointer-events-none md:pl-8 lg:pl-20 overflow-hidden">
          <motion.img
            src={assets.footerImage}
            alt="Beeresh Kumar"
            transition={{
              duration: 1.5,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.2,
            }}
            whileInView={{
              y: [0, -12, 0],
            }}
            viewport={{ once: true }}
            className="h-[55vh] sm:h-[60vh] md:h-[85vh] lg:h-[92vh] w-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* GRADIENT SHIELDS - Light theme overlays */}
        <div className="absolute inset-0 z-[6] pointer-events-none bg-gradient-to-l from-background via-background/80 to-transparent opacity-70 md:opacity-90" />
        <div className="absolute inset-0 z-[6] pointer-events-none bg-gradient-to-t from-background via-background/40 to-transparent" />

        {/* STATS PANEL - Left side, hidden on mobile/tablet */}
        <div className="absolute left-4 md:left-8 bottom-[15%] md:bottom-[10%]  z-[11] hidden lg:flex flex-col gap-8">
          {[
            { num: "8.6/10", label: "CGPA" },
            { num: "40+", label: "MERN Projects" },
            { num: "10+", label: "Live Deployments" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -25, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{
                delay: 1.2 + idx * 0.15,
                duration: 0.7,
                ease: "easeOut",
              }}
              whileHover={{ x: 8 }}
              className="group flex flex-col items-start cursor-pointer"
            >
              <span className="font-epilogue font-black text-2xl lg:text-3xl  text-themeBlack group-hover:text-themeBrown transition-colors duration-300">
                {stat.num}
              </span>
              <span className="font-epilogue text-[10xl] sm:text-[10px]  tracking-[0.2em] text-textTertiary group-hover:text-themeBrown transition-colors font-bold">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* MAIN TEXT CONTENT - Responsive alignment */}
        <motion.div
          style={{ x: textX, y: textY }}
          className="relative z-[11] w-full max-w-[1440px] px-5 sm:px-8 md:px-12 lg:px-24 flex flex-col items-center md:items-end text-center md:text-right"
        >
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 items-center md:items-end max-w-xl lg:max-w-3xl mt-[-2vh] md:mt-0">
            {/* SECTION LABEL */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-3 justify-center md:justify-end"
            >
              <span className="font-primary text-[9px] sm:text-[10px] uppercase tracking-[0.5em] text-themeBrown font-bold">
                Full-Stack Architect
              </span>
              <div className="h-px w-8 md:w-12 bg-themeBrown" />
            </motion.div>

            {/* HEADLINE */}
            <div className="overflow-hidden pb-2 w-full flex justify-center md:justify-end">
              <motion.h2
                initial={{ opacity: 0, y: 50, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  delay: 0.6,
                  duration: 1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ rotateZ }}
                className="font-humane font-black text-themeBlack leading-[0.85] sm:leading-[0.95] tracking-tighter text-5xl sm:text-6xl md:text-7xl lg:text-[100px]"
              >
                <JellyText text="Building the" />
                <br />
                <motion.span
                  className="font-humane italic font-medium text-themeBrown inline-block"
                  animate={{
                    textShadow: [
                      "0 0 8px rgba(94,0,6,0.2)",
                      "0 0 16px rgba(94,0,6,0.4)",
                      "0 0 8px rgba(94,0,6,0.2)",
                    ],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <JellyText text="Future Today" />
                </motion.span>
              </motion.h2>
            </div>

            {/* SUBTITLE / BIO */}
            <motion.p
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 1, duration: 0.7 }}
              className="text-textSecondary font-primary text-xs sm:text-sm md:text-sm font-medium tracking-wide leading-relaxed max-w-xs sm:max-w-md md:max-w-lg"
            >
              Full-Stack Developer | MERN Specialist | Web3 Pioneer | AI
              Integration Expert
            </motion.p>

            {/* CTA SECTION */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-2"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg border border-themeBrown bg-themeBrown text-white font-primary font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:shadow-lg"
              >
                Let's Collaborate
              </motion.button>
              <motion.a
                href="#me"
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg border border-borderLight bg-white text-themeBlack font-primary font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:border-themeBrown hover:shadow-md"
              >
                Learn More ↓
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Hero;
