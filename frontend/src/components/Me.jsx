import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ─────────────────────────── DATA ─────────────────────────── */
const STATS = [
  { value: "8.6", unit: "/10", label: "CGPA" }, // Updated based on your CV
  { value: "40+", unit: "", label: "MERN Projects" },
  { value: "10+", unit: "", label: "Live Deployments" },
  { value: "3+", unit: " yrs", label: "Building" },
];

const EDUCATION = [
  {
    degree: "B.E — Computer Science & Engineering",
    institution: "GM Institute of Technology",
    location: "Davanagere",
    year: "Expected Jan 2027",
    score: "CGPA 8.6 / 10",
    current: true,
  },
  {
    degree: "Pre-University (Science — PCMB)",
    institution: "RTES PU College",
    location: "Ranebennur",
    year: "March 2023",
    score: "92%",
    current: false,
  },
  {
    degree: "SSLC",
    institution: "Government High School",
    location: "Hulikatti",
    year: "July 2021",
    score: "98%",
    current: false,
  },
];

const INTERESTS = [
  { icon: "📖", label: "Reading Tech & Fiction" },
  { icon: "🎬", label: "Analysing Cinema" },
  { icon: "🌐", label: "Global Tech News" },
  { icon: "⚡", label: "Open-Source Building" },
];

/* ─────────────────────── SUB-COMPONENTS ────────────────────── */

/** Animated counter */
const CountUp = ({ value }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return <span ref={ref}>{inView ? value : "0"}</span>;
};

/** Single stat card (Light Theme Optimized) */
const StatCard = ({ value, unit, label, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.1 * index, ease: "easeOut" }}
    whileHover={{ y: -4, scale: 1.03 }}
    className="relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl
               border border-borderLight bg-white shadow-sm
               hover:border-themeBrown hover:shadow-md transition-all duration-300
               cursor-default group overflow-hidden"
  >
    <p className="font-primary font-black text-2xl sm:text-3xl text-themeBlack leading-none tracking-tighter">
      <CountUp value={value} />
      <span className="text-themeBrown text-xl sm:text-2xl">{unit}</span>
    </p>
    <p className="font-themeBrown text-themeBlack/50 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mt-1 text-center font-semibold">
      {label}
    </p>
  </motion.div>
);

/** Single education row (Light Theme Optimized) */
const EduRow = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.55, delay: 0.15 * index, ease: "easeOut" }}
    className={`relative flex items-start gap-4 p-4 sm:p-5 rounded-lg border transition-all duration-300 shadow-sm
      ${
        item.current
          ? "border-themeBrown bg-white hover:shadow-md"
          : "border-borderLight bg-white hover:shadow-md"
      }`}
  >
    <div className="mt-1 flex-shrink-0 flex flex-col items-center gap-1">
      <div
        className={`w-2.5 h-2.5 rounded-full border-2 flex-shrink-0
          ${item.current ? "border-themeBrown bg-themeBrown" : "border-textTertiary bg-transparent"}`}
      />
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-1 mb-0.5">
        <p className="font-primary font-bold text-themeBlack text-xs sm:text-sm leading-tight">
          {item.degree}
        </p>
        {item.current && (
          <span className="font-themeBrown text-[8px] text-themeBrown border border-themeBrown px-2 py-0.5 rounded-full bg-white uppercase tracking-wider flex-shrink-0 font-bold">
            Current
          </span>
        )}
      </div>
      <p className="font-themeBrown text-themeBlack/60 text-[10px] sm:text-xs font-medium">
        {item.institution} · {item.location}
      </p>
      <div className="flex items-center gap-3 mt-1.5">
        <span className="font-themeBrown text-themeBrown font-bold text-[10px] sm:text-xs">
          {item.score}
        </span>
        <span className="w-1 h-1 rounded-full bg-borderLight" />
        <span className="font-themeBrown text-themeBlack/50 text-[9px] sm:text-[10px] font-medium">
          {item.year}
        </span>
      </div>
    </div>
  </motion.div>
);

/** Typewriter Line Component for Terminal */
const TypewriterLine = ({ children, delay }) => (
  <motion.div
    initial={{ width: 0, opacity: 0 }}
    whileInView={{ width: "100%", opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: delay, ease: "easeOut" }}
    className="whitespace-nowrap overflow-hidden block"
  >
    {children}
  </motion.div>
);

/* ──────────────────────── MAIN COMPONENT ─────────────────────── */
const Me = () => {
  return (
    <section
      id="me"
      // STRICT H-SCREEN: Rounded corners to match parallax sliding, background light theme
      className="relative w-full h-[100dvh] bg-background rounded-t-[2.5rem] md:rounded-t-[4rem]  flex flex-col items-center pt-12 sm:pt-20 pb-6 overflow-hidden shadow-secondary z-20"
    >
      {/* ── GRAIN TEXTURE ── */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── BACKGROUND GLOWS (Adapted for Light Theme) ── */}
      <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] pointer-events-none" />

      {/* Inner Container: Scrollable while maintaining section height */}
      <div className="relative z-10 w-full flex-1 overflow-y-auto hide-scrollbar pb-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-12 lg:px-24 flex flex-col gap-12 md:gap-16">
          {/* ── SECTION HEADER (Advanced Typography) ── */}
          <div className="flex flex-col pt-4">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="h-px w-8 md:w-12 bg-themeBrown" />
              <span className="font-geist text-[9px] sm:text-[10px] uppercase tracking-[0.5em] text-themeBrown font-bold">
                Behind the Code
              </span>
            </motion.div>

            {/* Staggered Heading Animation */}
            <div className="overflow-hidden flex items-end flex-wrap gap-x-4">
              <motion.h2
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-humane font-black text-[80px] sm:text-[120px] md:text-[150px] text-themeBlack leading-[0.85] tracking-tighter uppercase"
              >
                THE
              </motion.h2>
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="font-season italic text-5xl sm:text-7xl md:text-[90px] text-themeBrown lowercase tracking-normal pb-2 sm:pb-5 drop-shadow-md"
              >
                Architect.
              </motion.span>
            </div>
          </div>

          {/* ── TOP GRID: Identity + Stats ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LEFT: Identity Block */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Name Card */}
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative rounded-xl border border-borderLight bg-white p-6 sm:p-8 overflow-hidden group shadow-sm"
              >
                <div className="absolute top-0 left-0 w-full h-px bg-themeBrown/20" />

                <div className="relative z-10 flex flex-col gap-1">
                  <p className="font-themeBrown text-themeBrown text-[10px] uppercase tracking-[0.4em] font-bold mb-2">
                    Full Name
                  </p>
                  <h3 className="font-primary font-black text-3xl sm:text-4xl md:text-5xl text-themeBlack leading-tight tracking-tight">
                    Beereshkumar <span className="text-themeBlack/40">B C</span>
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      "Full-Stack Dev",
                      "Web3 Builder",
                      "AI Integrations",
                      "Pre-Final Year",
                    ].map((tag, i) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * i + 0.3 }}
                        className="font-themeBrown text-[9px] sm:text-[10px] uppercase tracking-widest font-bold
                                     px-3 py-1.5 rounded-full border border-borderLight bg-surface
                                     text-themeBlack/70 hover:x1hemeBrown hover:text-themeBrown transition-colors duration-200"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Bio Block */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: 0.15 }}
                className="flex flex-col gap-4"
              >
                <p className="font-themeBrown text-themeBlack/80 text-sm sm:text-base leading-[1.85] tracking-wide font-medium">
                  I am a{" "}
                  <span className="text-themeBlack font-bold">
                    Pre-Final year CS Engineering
                  </span>{" "}
                  student at{" "}
                  <span className="text-themeBrown font-bold">
                    GM Institute of Technology, Davanagere
                  </span>
                  , maintaining a strong{" "}
                  <span className="text-themeBlack font-bold">
                    CGPA of 8.6 / 10
                  </span>
                  . My journey goes beyond writing scripts — it's about crafting{" "}
                  <span className="text-themeBlack font-bold">
                    scalable architectures
                  </span>{" "}
                  and decentralised systems that feel inherently human.
                </p>
                <p className="font-themeBrown text-themeBlack/60 text-xs sm:text-sm leading-[1.8] tracking-wide font-medium">
                  With{" "}
                  <span className="text-themeBlack/90 font-bold">
                    40+ production MERN projects
                  </span>{" "}
                  and{" "}
                  <span className="text-themeBlack/90 font-bold">
                    10+ live deployments
                  </span>{" "}
                  for enterprise and academic clients, I bridge heavy-duty
                  backend logic with immersive front-end experiences — from
                  blockchain dApps to AI-powered platforms.
                </p>
              </motion.div>
            </div>

            {/* RIGHT: Stats Grid & Terminal */}
            <div className="lg:col-span-5 flex flex-col gap-4 mt-4 lg:mt-0">
              {/* 2×2 Stats */}
              <div className="grid grid-cols-2 gap-3">
                {STATS.map((s, i) => (
                  <StatCard key={s.label} {...s} index={i} />
                ))}
              </div>

              {/* Terminal Code Card (Dark Mode for contrast) */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative rounded-xl border border-themeBlack/10 bg-themeBlack p-5 sm:p-6 overflow-hidden shadow-md"
              >
                {/* Traffic lights */}
                <div className="flex gap-1.5 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-themeBrown" />
                </div>

                <div className="font-mono text-white/80 text-[10px] sm:text-xs leading-loose bg-black p-4 rounded-lg border border-white/10">
                  <TypewriterLine delay={0.5}>
                    <span className="text-themeBrown italic">const</span>{" "}
                    <span className="text-white font-semibold">architect</span>{" "}
                    = {"{"}
                  </TypewriterLine>
                  <TypewriterLine delay={0.9}>
                    <span className="pl-4 text-white/50">name:</span>{" "}
                    <span className="text-emerald-400">"Beereshkumar B C"</span>
                    ,
                  </TypewriterLine>
                  <TypewriterLine delay={1.3}>
                    <span className="pl-4 text-white/50">college:</span>{" "}
                    <span className="text-emerald-400">"GMIT, Davanagere"</span>
                    ,
                  </TypewriterLine>
                  <TypewriterLine delay={1.7}>
                    <span className="pl-4 text-white/50">branch:</span>{" "}
                    <span className="text-emerald-400">"CS Engineering"</span>,
                  </TypewriterLine>
                  <TypewriterLine delay={2.1}>
                    <span className="pl-4 text-white/50">cgpa:</span>{" "}
                    <span className="text-orange-300">8.6</span>,
                  </TypewriterLine>
                  <TypewriterLine delay={2.5}>
                    <span className="pl-4 text-white/50">focus:</span>{" "}
                    <span className="text-emerald-400">"MERN · Web3 · AI"</span>
                    ,
                  </TypewriterLine>
                  <TypewriterLine delay={2.9}>
                    <span className="pl-4 text-white/50">graduating:</span>{" "}
                    <span className="text-emerald-400">"Jan 2027"</span>
                  </TypewriterLine>
                  <TypewriterLine delay={3.3}>{"}"};</TypewriterLine>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ── EDUCATION TIMELINE ── */}
          <div className="flex flex-col gap-5 mt-6">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="h-px w-8 bg-black/20" />
              <span className="font-primary text-[9px] sm:text-[10px] uppercase tracking-[0.5em] text-themeBlack/40 font-bold">
                Academic Journey
              </span>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {EDUCATION.map((item, i) => (
                <EduRow key={i} item={item} index={i} />
              ))}
            </div>
          </div>

          {/* ── BOTTOM ROW: Interests + Quote ── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 pb-10 mt-2">
            {/* Interests */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <div className="h-px w-8 bg-black/20" />
                <span className="font-primary text-[9px] sm:text-[10px] uppercase tracking-[0.5em] text-themeBlack/40 font-bold">
                  Beyond the IDE
                </span>
              </motion.div>

              <div className="grid grid-cols-2 gap-3">
                {INTERESTS.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * i }}
                    whileHover={{ scale: 1.04, y: -2 }}
                    className="flex items-center gap-3 p-4 rounded-lg border border-borderLight
                               bg-white hover:border-themeBrown hover:shadow-md
                               transition-all duration-300 cursor-default group"
                  >
                    <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                    <span className="font-themeBrown text-themeBlack/70 font-semibold text-[10px] sm:text-xs uppercase tracking-wider group-hover:text-themeBrown transition-colors duration-200">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quote Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.2 }}
              className="md:col-span-7 relative rounded-xl border border-borderLight bg-white shadow-sm
                         p-6 sm:p-8 overflow-hidden group flex flex-col justify-between gap-6"
            >
              <div className="absolute top-0 right-4 font-primary font-black text-[140px] leading-none text-black/[0.05] pointer-events-none select-none">
                "
              </div>
              <div className="absolute top-0 left-0 w-full h-px bg-themeBrown/30" />

              <p className="relative z-10 font-primary font-light text-2xl sm:text-3xl md:text-4xl text-themeBlack leading-snug tracking-tight">
                "Code is the closest thing we have to{" "}
                <span className="text-themeBrown font-bold">magic</span>."
              </p>

              <div className="relative z-10 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px bg-themeBrown/80" />
                  <div>
                    <p className="font-primary font-black text-themeBlack text-sm sm:text-base">
                      Beereshkumar B C
                    </p>
                    <p className="font-themeBrown text-themeBlack/50 font-bold text-[9px] uppercase tracking-widest">
                      CS Engineer · GMIT '27
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 border border-borderLight px-3 py-1.5 rounded-full bg-white">
                  <div className="w-2 h-2 rounded-full bg-themeBrown animate-pulse" />
                  <span className="font-themeBrown text-themeBlack/70 font-bold text-[9px] uppercase tracking-widest">
                    Available for Internships
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Global Style to hide scrollbar in the internal view */}
      <style
        dangerouslySetInlineStyle={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </section>
  );
};

export default Me;
