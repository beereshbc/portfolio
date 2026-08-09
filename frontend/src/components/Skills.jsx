import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Hexagon,
  Brain,
  Cpu,
  Server,
  Paintbrush,
} from "lucide-react";

import CardSwap, { Card } from "./CardSwap";

/* ═══════════════════════════════════════════════════════════
          SKILLS DATA
═══════════════════════════════════════════════════════════ */
const skillsData = [
  {
    id: 1,
    title: "MERN Stack Mastery",
    subtitle: "Full-Scale Web Engineering",
    description:
      "Production-grade applications with React, Node, Express, MongoDB. Integrated JWT, REST APIs, real-time features, and payment gateways. Delivered 10+ live systems.",
    icon: Globe,
    skills: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "Redux"],
    color: "#F45B26",
  },
  {
    id: 2,
    title: "Web3 & Blockchain",
    subtitle: "Decentralized Innovation",
    description:
      "Smart contract development with Solidity, Hardhat, Ethers.js. Integrated MetaMask, IPFS, and Hedera. Built secure dApps and token systems.",
    icon: Hexagon,
    skills: ["Solidity", "Hardhat", "Ethers.js", "Web3.js", "MetaMask", "IPFS"],
    color: "#6c5ce7",
  },
  {
    id: 3,
    title: "AI & Machine Learning",
    subtitle: "Intelligent Systems",
    description:
      "Python-based AI solutions using TensorFlow, Scikit-learn, Gemini & OpenAI APIs. Built NLP pipelines, predictive models, and AI systems.",
    icon: Brain,
    skills: ["Python", "TensorFlow", "Scikit-learn", "Gemini API", "Pandas"],
    color: "#00cec9",
  },
  {
    id: 4,
    title: "Core CS & DSA",
    subtitle: "Algorithmic Foundation",
    description:
      "Strong grasp of Data Structures, Algorithms, OOP, and time/space complexity. Active competitive programmer and problem solver.",
    icon: Cpu,
    skills: ["Java", "C", "JavaScript", "DSA", "OOP Patterns", "System Design"],
    color: "#0984e3",
  },
  {
    id: 5,
    title: "DevOps & Tools",
    subtitle: "Streamlined CI/CD",
    description:
      "Containerization with Docker, version control with Git/GitHub, CI/CD pipelines, and seamless deployment on modern cloud platforms.",
    icon: Server,
    skills: ["Docker", "Git/GitHub", "CI/CD", "Postman", "Vercel", "AWS"],
    color: "#e17055",
  },
  {
    id: 6,
    title: "UI/UX & Prototyping",
    subtitle: "Design + Development",
    description:
      "Crafting modern, responsive interfaces with Figma, Canva, and Eraser.io. Focus on micro-interactions, accessibility, and pixel-perfect UI.",
    icon: Paintbrush,
    skills: ["Figma", "Canva", "Wireframing", "Prototyping", "Tailwind"],
    color: "#fd79a8",
  },
];

/* ═══════════════════════════════════════════════════════════
          MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const Skills = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const activeSkill = skillsData[activeIdx];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-cycle content every 6s to match CardSwap timing
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % skillsData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="skills"
      className="relative w-full h-screen bg-[#FAFAFA] text-zinc-900 overflow-hidden"
    >
      {/* ── Subtle Grain Background ── */}
      <div
        className="absolute inset-0 z-[0] pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 flex flex-col py-8 lg:py-12">
        {/* ── HEADER ── */}
        <div className="shrink-0 mb-6 lg:mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-3"
          >
            <div className="h-px w-10 bg-themeBrown" />
            <span className="font-geist text-[10px] uppercase tracking-[0.4em] text-themeBrown font-bold">
              The Arsenal
            </span>
          </motion.div>

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="font-clash font-black text-4xl sm:text-5xl lg:text-6xl text-themeBlack leading-[0.9] tracking-tighter uppercase"
          >
            Technical <span className="text-themeBrown">Expertise</span>
          </motion.h2>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 min-h-0">
          
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              LEFT: Dynamic Skill Content
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="flex flex-col justify-center min-h-0 overflow-y-auto lg:overflow-visible pr-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSkill.id}
                initial={{ opacity: 0, x: -30, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 30, filter: "blur(6px)" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col gap-4 lg:gap-5"
              >
                {/* Skill Meta */}
                <span className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                  (0{activeSkill.id}) / {activeSkill.skills.length} Technologies
                </span>

                {/* Title */}
                <h3 className="font-clash font-black text-3xl sm:text-4xl lg:text-[3.25rem] text-themeBlack leading-[1.05]">
                  {activeSkill.title}
                </h3>

                {/* Subtitle */}
                <p
                  className="font-epilogue font-bold text-xs uppercase tracking-[0.2em] w-fit"
                  style={{ color: activeSkill.color }}
                >
                  {activeSkill.subtitle}
                </p>

                {/* Description */}
                <p className="text-zinc-600 text-sm sm:text-base leading-relaxed max-w-lg">
                  {activeSkill.description}
                </p>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 mt-1">
                  {activeSkill.skills.map((tech, i) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="px-3.5 py-2 rounded-xl bg-white border border-black/5 shadow-sm text-[11px] font-mono font-bold text-themeBlack uppercase tracking-wider"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>

                {/* Decorative divider */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-px flex-1 bg-black/5" />
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
                    Beeresh BC
                  </span>
                  <div className="h-px flex-1 bg-black/5" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              RIGHT: 3D CardSwap (Smaller Cards)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="relative flex items-center justify-center min-h-0 mb-20 pl-30">
            <CardSwap
              width={isMobile ? 260 : 400}
              height={isMobile ? 220 : 320}
              cardDistance={isMobile ? 28 : 44}
              verticalDistance={isMobile ? 36 : 56}
              delay={6000}
              pauseOnHover={true}
              skewAmount={6}
              easing="elastic"
              onCardClick={(idx) => setActiveIdx(idx)}
            >
              {skillsData.map((skill) => {
                const Icon = skill.icon;
                return (
                  <Card
                    key={skill.id}
                    customClass="overflow-hidden shadow-2xl ring-1 ring-white/10 cursor-pointer"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-900 to-black text-white p-5 sm:p-6 flex flex-col relative select-none">
                      {/* Top accent bar */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1.5"
                        style={{ backgroundColor: skill.color }}
                      />

                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10">
                          <Icon
                            size={20}
                            style={{ color: skill.color }}
                            strokeWidth={1.5}
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-clash font-bold text-lg leading-tight truncate">
                            {skill.title}
                          </h4>
                          <p className="text-zinc-500 text-[9px] font-mono uppercase tracking-[0.15em] mt-0.5">
                            {skill.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-zinc-400 text-xs leading-relaxed mb-4 line-clamp-3">
                        {skill.description}
                      </p>

                      {/* Tech Tags */}
                      <div className="mt-auto flex flex-wrap gap-1.5">
                        {skill.skills.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-300 uppercase tracking-wider"
                          >
                            {tech}
                          </span>
                        ))}
                        {skill.skills.length > 4 && (
                          <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-mono text-zinc-500">
                            +{skill.skills.length - 4}
                          </span>
                        )}
                      </div>

                      {/* Footer ID */}
                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
                          Skill ID
                        </span>
                        <span
                          className="text-[8px] font-mono font-bold uppercase tracking-widest"
                          style={{ color: skill.color }}
                        >
                          0{skill.id}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </CardSwap>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Skills;