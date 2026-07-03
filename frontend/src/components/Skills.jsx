import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Hexagon,
  Brain,
  Cpu,
  Paintbrush,
  Server,
  Award,
  Sparkles,
  ArrowRight,
  Code2,
} from "lucide-react";

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
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    icon: Globe,
    skills: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Tailwind CSS",
      "Redux",
    ],
    color: "#F45B26",
    bgLight: "bg-orange-50",
  },
  {
    id: 2,
    title: "Web3 & Blockchain",
    subtitle: "Decentralized Innovation",
    description:
      "Smart contract development with Solidity, Hardhat, Ethers.js. Integrated MetaMask, IPFS, and Hedera. Built secure dApps and token systems.",
    imageUrl:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    icon: Hexagon,
    skills: ["Solidity", "Hardhat", "Ethers.js", "Web3.js", "MetaMask", "IPFS"],
    color: "#6c5ce7",
    bgLight: "bg-indigo-50",
  },
  {
    id: 3,
    title: "AI & Machine Learning",
    subtitle: "Intelligent Systems",
    description:
      "Python-based AI solutions using TensorFlow, Scikit-learn, Gemini & OpenAI APIs. Built NLP pipelines, predictive models, and AI systems.",
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    icon: Brain,
    skills: ["Python", "TensorFlow", "Scikit-learn", "Gemini API", "Pandas"],
    color: "#00cec9",
    bgLight: "bg-teal-50",
  },
  {
    id: 4,
    title: "Core CS & DSA",
    subtitle: "Algorithmic Foundation",
    description:
      "Strong grasp of Data Structures, Algorithms, OOP, and time/space complexity. Active competitive programmer and problem solver.",
    imageUrl:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
    icon: Cpu,
    skills: ["Java", "C", "JavaScript", "DSA", "OOP Patterns", "System Design"],
    color: "#0984e3",
    bgLight: "bg-blue-50",
  },
  {
    id: 5,
    title: "DevOps & Tools",
    subtitle: "Streamlined CI/CD",
    description:
      "Containerization with Docker, version control with Git/GitHub, CI/CD pipelines, and seamless deployment on modern cloud platforms.",
    imageUrl:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80",
    icon: Server,
    skills: ["Docker", "Git/GitHub", "CI/CD", "Postman", "Vercel", "AWS"],
    color: "#e17055",
    bgLight: "bg-orange-50",
  },
  {
    id: 6,
    title: "UI/UX & Prototyping",
    subtitle: "Design + Development",
    description:
      "Crafting modern, responsive interfaces with Figma, Canva, and Eraser.io. Focus on micro-interactions, accessibility, and pixel-perfect UI.",
    imageUrl:
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80",
    icon: Paintbrush,
    skills: ["Figma", "Canva", "Wireframing", "Prototyping", "Tailwind"],
    color: "#fd79a8",
    bgLight: "bg-pink-50",
  },
];

/* ═══════════════════════════════════════════════════════════
          MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const Skills = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeSkill = skillsData[activeIdx];

  // Auto-cycle feature (Optional, can be removed if you want pure manual click)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % skillsData.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="skills"
      className="relative w-full min-h-[100dvh] bg-[#FAFAFA] text-zinc-900 py-20 sm:py-24 md:py-32 overflow-hidden flex items-center"
    >
      {/* ── Subtle Grain Background ── */}
      <div
        className="absolute inset-0 z-[0] pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* ── LEFT COLUMN: Navigation & Info ── */}
        <div className="lg:col-span-4 flex flex-col pt-4 lg:sticky lg:top-32">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
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
            className="font-clash font-black text-5xl sm:text-6xl md:text-7xl text-themeBlack leading-[0.9] tracking-tighter uppercase mb-10"
          >
            Technical <br /> <span className="text-themeBrown">Expertise</span>
          </motion.h2>

          {/* Interactive Navigation List */}
          <div className="flex flex-col gap-2 relative">
            {/* Animated Active Indicator Line */}
            <div className="absolute left-0 top-0 w-1 h-full bg-black/5 rounded-full overflow-hidden hidden sm:block">
              <motion.div
                className="w-full bg-themeBrown rounded-full"
                initial={false}
                animate={{
                  height: `${100 / skillsData.length}%`,
                  y: `${activeIdx * 100}%`,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>

            {skillsData.map((skill, idx) => {
              const isActive = activeIdx === idx;
              const Icon = skill.icon;
              return (
                <button
                  key={skill.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`relative flex items-center justify-between w-full p-4 sm:pl-8 rounded-2xl transition-all duration-300 text-left group ${
                    isActive
                      ? "bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5"
                      : "hover:bg-black/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        isActive
                          ? skill.bgLight
                          : "bg-black/5 group-hover:bg-white"
                      }`}
                      style={{ color: isActive ? skill.color : "#71717A" }}
                    >
                      <Icon size={18} strokeWidth={2.5} />
                    </div>
                    <span
                      className={`font-clash text-lg sm:text-xl font-bold transition-colors duration-300 ${
                        isActive
                          ? "text-themeBlack"
                          : "text-themeBlack/50 group-hover:text-themeBlack"
                      }`}
                    >
                      {skill.title}
                    </span>
                  </div>
                  {isActive && (
                    <motion.div layoutId="arrow" className="text-themeBrown">
                      <ArrowRight size={20} />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT COLUMN: Dynamic Showcase Graphic ── */}
        <div className="lg:col-span-8 relative w-full h-[550px] sm:h-[650px] lg:h-[750px] rounded-[2rem] sm:rounded-[3rem] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSkill.id}
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full bg-white shadow-[0_20px_80px_rgba(0,0,0,0.06)] border border-black/5 flex flex-col overflow-hidden"
            >
              {/* Top: Massive Image Graphic */}
              <div className="relative w-full h-1/2 sm:h-[55%] overflow-hidden bg-zinc-100">
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  src={activeSkill.imageUrl}
                  alt={activeSkill.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />

                {/* Floating Tech Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute top-6 right-6 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-black/5 flex items-center gap-2"
                >
                  <Code2 size={14} style={{ color: activeSkill.color }} />
                  <span className="font-geist text-[10px] font-bold uppercase tracking-widest text-themeBlack">
                    {activeSkill.skills[0]} Centric
                  </span>
                </motion.div>
              </div>

              {/* Bottom: Content & Floating Nodes */}
              <div className="relative flex-1 p-8 sm:p-12 flex flex-col">
                {/* Icon Hub (Connects Top and Bottom) */}
                <div className="absolute -top-10 left-8 sm:left-12 w-20 h-20 rounded-2xl bg-white shadow-xl border border-black/5 flex items-center justify-center z-10">
                  <activeSkill.icon
                    size={36}
                    style={{ color: activeSkill.color }}
                    strokeWidth={2}
                  />
                </div>

                <div className="mt-8 sm:mt-6 max-w-2xl">
                  <h3 className="font-clash text-3xl sm:text-4xl lg:text-5xl font-black text-themeBlack leading-tight mb-2">
                    {activeSkill.title}
                  </h3>
                  <p
                    className="font-epilogue font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mb-6"
                    style={{ color: activeSkill.color }}
                  >
                    {activeSkill.subtitle}
                  </p>
                  <p className="font-epilogue text-sm sm:text-base text-themeBlack/70 leading-relaxed mb-8">
                    {activeSkill.description}
                  </p>
                </div>

                {/* Node Graph / Tech Pills Layout */}
                <div className="mt-auto">
                  <div className="text-[10px] font-bold tracking-[0.3em] text-themeBlack/30 mb-4 uppercase font-geist">
                    Ecosystem & Tools
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {activeSkill.skills.map((tech, i) => (
                      <motion.div
                        key={tech}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
                        className="px-4 py-2.5 rounded-xl bg-white border border-black/10 shadow-sm flex items-center gap-2 hover:shadow-md hover:border-black/20 transition-all cursor-default"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: activeSkill.color }}
                        />
                        <span className="font-mono text-[10px] sm:text-xs font-bold text-themeBlack uppercase">
                          {tech}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative Progress Bar inside card */}
              <motion.div
                key={`progress-${activeSkill.id}`}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 8, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1"
                style={{ backgroundColor: activeSkill.color }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Skills;
