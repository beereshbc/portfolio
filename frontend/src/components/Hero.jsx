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

        {/* 4. MAIN CENTER SUBJECT IMAGE */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl flex justify-center z-[5] pointer-events-none">
          <motion.img
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            src={assets.footerImage}
            alt="Beeresh Kumar"
            className="h-[65vh] sm:h-[75vh] md:h-[85vh] w-auto object-cover object-bottom drop-shadow-2xl"
          />
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
