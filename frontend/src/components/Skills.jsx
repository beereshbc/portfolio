import React from "react";
import { motion } from "framer-motion";

// ── CUSTOM INLINE ICONS (Zero Dependencies) ──
const WebIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const BlockchainIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const AiIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2v20" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const CoreIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

// ── SKILLS DATA (Consolidated to 4 Pillars for a sleek layout) ──
// Data sourced accurately from your CV [cite: 23, 24, 25, 26, 27, 28, 30, 31]
const skillsData = [
  {
    title: "MERN Stack & Web",
    icon: <WebIcon size={28} />,
    skills: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Tailwind CSS",
      "JWT Auth",
      "REST APIs",
    ],
  },
  {
    title: "Web3 & Blockchain",
    icon: <BlockchainIcon size={28} />,
    skills: [
      "Solidity",
      "Hardhat",
      "Ethers.js",
      "Web3.js",
      "MetaMask",
      "IPFS",
      "Hedera",
    ],
  },
  {
    title: "AI & Machine Learning",
    icon: <AiIcon size={28} />,
    skills: [
      "Python",
      "TensorFlow / Keras",
      "Scikit-learn",
      "Gemini API",
      "OpenAI API",
      "NLP",
      "Pandas",
    ],
  },
  {
    title: "Core CS & DevOps",
    icon: <CoreIcon size={28} />,
    skills: [
      "Java (OOP)",
      "C",
      "JavaScript (ES6+)",
      "DSA",
      "Docker",
      "Git/GitHub",
      "CI/CD",
    ],
  },
];

// ── ANIMATION VARIANTS ──
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 60, damping: 15 },
  },
};

const pillVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const titleLetterVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", damping: 15, stiffness: 100 },
  },
};

// ── BACKGROUND MARQUEE COMPONENT ──
const BackgroundMarquee = () => {
  return (
    <div className="absolute inset-0 z-0 flex flex-col justify-center items-center pointer-events-none overflow-hidden opacity-[0.07] select-none">
      {/* Row 1: Left to Right */}
      <div className="flex w-full whitespace-nowrap animate-marquee-left">
        <span
          className="font-humane text-[180px] md:text-[250px] leading-none tracking-tight text-transparent font-black mx-4"
          style={{ WebkitTextStroke: "2px #000" }}
        >
          REACT NODE MONGODB EXPRESS TAILWIND JAVASCRIPT REACT NODE MONGODB
          EXPRESS TAILWIND JAVASCRIPT
        </span>
      </div>
      {/* Row 2: Right to Left */}
      <div className="flex w-full whitespace-nowrap animate-marquee-right mt-[-40px] md:mt-[-80px]">
        <span className="font-humane text-[180px] md:text-[250px] leading-none tracking-tight text-themeBlack font-black mx-4">
          SOLIDITY ETHERS HARDHAT WEB3 IPFS METAMASK SOLIDITY ETHERS HARDHAT
          WEB3 IPFS METAMASK
        </span>
      </div>
      {/* Row 3: Left to Right */}
      <div className="flex w-full whitespace-nowrap animate-marquee-left mt-[-40px] md:mt-[-80px]">
        <span
          className="font-humane text-[180px] md:text-[250px] leading-none tracking-tight text-transparent font-black mx-4"
          style={{ WebkitTextStroke: "2px #000" }}
        >
          PYTHON TENSORFLOW GEMINI SCiKIT PANDAS NLP PYTHON TENSORFLOW GEMINI
          SCiKIT PANDAS NLP
        </span>
      </div>
    </div>
  );
};

const Skills = () => {
  const headerText = "TECHNICAL".split("");

  return (
    <section
      id="skills"
      // STRICT H-SCREEN: Rounded corners, matches Hero bg-background
      className="relative w-full h-[100dvh] bg-background rounded-t-[2.5rem] md:rounded-t-[4rem] flex flex-col items-center pt-10 sm:pt-16 md:pt-20 pb-6 overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.05)] z-10"
    >
      {/* ── GRAIN TEXTURE ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── CINEMATIC MARQUEE BACKGROUND ── */}
      <BackgroundMarquee />

      {/* ── ATMOSPHERIC GLOWS ── */}
      <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-themeBrown/10 blur-[150px] rounded-full pointer-events-none z-[2]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-white/80 blur-[120px] rounded-full pointer-events-none z-[2]" />

      {/* Inner Container: flex-1 ensures it respects h-screen constraints */}
      <div className="relative z-10 w-full max-w-[1400px] px-5 sm:px-12 lg:px-24 h-full flex flex-col">
        {/* ── HEADER SECTION ── */}
        <div className="flex flex-col mb-6 md:mb-10 w-full shrink-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-1 sm:mb-2"
          >
            <div className="h-px w-8 md:w-12 bg-themeBrown" />
            <span className="font-geist text-[9px] sm:text-[10px] uppercase tracking-[0.5em] text-themeBrown font-bold">
              The Architecture
            </span>
          </motion.div>

          {/* Staggered Title Animation */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-0 sm:gap-6 overflow-hidden perspective-[1000px]">
            <motion.h2
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05, delayChildren: 0.1 },
                },
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex font-humane text-[5rem] sm:text-9xl md:text-[140px] text-themeBlack leading-[0.8] tracking-tighter drop-shadow-sm uppercase"
            >
              {headerText.map((char, index) => (
                <motion.span
                  key={index}
                  variants={titleLetterVariants}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </motion.h2>

            <motion.span
              initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="font-season italic text-4xl sm:text-6xl md:text-[80px] text-themeBrown lowercase tracking-normal pb-1 sm:pb-4 drop-shadow-[0_4px_15px_rgba(94,0,6,0.15)]"
            >
              Arsenal.
            </motion.span>
          </div>
        </div>

        {/* ── PILLAR GRID (Horizontal Scroll on Mobile, 4-Cols on Desktop) ── */}
        <div className="w-full flex-1 min-h-0 overflow-y-auto hide-scrollbar pb-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 h-full"
          >
            {skillsData.map((category, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="relative flex flex-col p-6 sm:p-8 rounded-[1.5rem] bg-white/70 border border-black/5 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:bg-white h-full"
              >
                {/* Top Inner Glow */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-themeBrown/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Card Header & Icon */}
                <div className="flex flex-col gap-5 mb-8 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-black/[0.03] border border-black/5 flex items-center justify-center text-themeBlack/40 group-hover:bg-themeBrown group-hover:text-white group-hover:border-themeBrown group-hover:rotate-6 transition-all duration-500 shadow-sm group-hover:shadow-[0_0_20px_rgba(94,0,6,0.4)]">
                    {category.icon}
                  </div>
                  <h3 className="font-primary font-black text-xl lg:text-2xl text-themeBlack tracking-tight leading-tight group-hover:text-themeBrown transition-colors duration-300">
                    {category.title}
                  </h3>
                </div>

                {/* Skills List (Staggered Pills) */}
                <motion.div
                  className="flex flex-wrap gap-2 relative z-10 mt-auto"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05, delayChildren: 0.3 },
                    },
                  }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  {category.skills.map((skill, i) => (
                    <motion.span
                      key={i}
                      variants={pillVariants}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "#5E0006",
                        color: "#FFFFFF",
                      }}
                      className="font-mono text-[10px] sm:text-xs text-themeBlack/80 font-bold px-3 py-1.5 rounded-lg bg-white border border-black/10 shadow-sm transition-colors duration-300 cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Massive Background Watermark Icon */}
                <div className="absolute -bottom-8 -right-8 opacity-[0.02] group-hover:opacity-[0.04] transition-all duration-700 pointer-events-none transform group-hover:scale-[3] scale-[2.5] group-hover:-rotate-12 text-themeBlack">
                  {category.icon}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Global Style for Keyframes and Scrollbar Hiding */}
      <style
        dangerouslySetInlineStyle={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left 40s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 40s linear infinite;
        }
      `,
        }}
      />
    </section>
  );
};

export default Skills;
