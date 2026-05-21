import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Hexagon,
  Brain,
  Cpu,
  Paintbrush,
  Code,
  Award,
  Server,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
          SKILLS DATA
═══════════════════════════════════════════════════════════ */
const skillsCarouselData = [
  {
    id: 1,
    title: "MERN Stack Mastery",
    subtitle: "Full-Scale Web Engineering",
    description:
      "Production-grade applications with React, Node, Express, MongoDB. Integrated JWT, REST APIs, real-time features, and payment gateways. Delivered 10+ live systems.",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=600&fit=crop",
    icon: <Globe size={24} />,
    skills: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    color: "#F45B26",
  },
  {
    id: 2,
    title: "Web3 & Blockchain",
    subtitle: "Decentralized Innovation",
    description:
      "Smart contract development with Solidity, Hardhat, Ethers.js. Integrated MetaMask, IPFS, and Hedera. Built secure dApps and token systems.",
    imageUrl:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&h=600&fit=crop",
    icon: <Hexagon size={24} />,
    skills: ["Solidity", "Hardhat", "Ethers.js", "Web3.js", "MetaMask"],
    color: "#6c5ce7",
  },
  {
    id: 3,
    title: "AI & Machine Learning",
    subtitle: "Intelligent Systems",
    description:
      "Python-based AI solutions using TensorFlow, Scikit-learn, Gemini & OpenAI APIs. Built NLP pipelines, predictive models, and AI systems.",
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=600&fit=crop",
    icon: <Brain size={24} />,
    skills: ["Python", "TensorFlow", "Scikit-learn", "Gemini API", "Pandas"],
    color: "#00cec9",
  },
  {
    id: 4,
    title: "Core CS & DSA",
    subtitle: "Algorithmic Foundation",
    description:
      "Strong grasp of Data Structures, Algorithms, OOP, and time/space complexity. Active LeetCode solver with Java, C, and JavaScript.",
    imageUrl:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=500&h=600&fit=crop",
    icon: <Cpu size={24} />,
    skills: ["Java", "C", "JavaScript", "DSA", "OOP Patterns"],
    color: "#0984e3",
  },
  {
    id: 5,
    title: "DevOps & Tools",
    subtitle: "Streamlined CI/CD",
    description:
      "Containerization with Docker, version control with Git/GitHub, CI/CD pipelines, and deployment on modern cloud platforms.",
    imageUrl:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=500&h=600&fit=crop",
    icon: <Server size={24} />,
    skills: ["Docker", "Git/GitHub", "CI/CD", "Postman", "Vercel"],
    color: "#e17055",
  },
  {
    id: 6,
    title: "UI/UX & Prototyping",
    subtitle: "Design + Development",
    description:
      "Crafting modern, responsive interfaces with Figma, Canva, and Eraser.io. Focus on micro-interactions, accessibility, and pixel-perfect implementation.",
    imageUrl:
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500&h=600&fit=crop",
    icon: <Paintbrush size={24} />,
    skills: ["Figma", "Canva", "Wireframing", "Prototyping", "UI/UX"],
    color: "#fd79a8",
  },
  {
    id: 7,
    title: "Academic Systems",
    subtitle: "University-Scale Platforms",
    description:
      "Official developer for GM University's CSE portal and AI-integrated Curriculum Management System (PDMS). Built for 200+ active users.",
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=600&fit=crop",
    icon: <Award size={24} />,
    skills: ["MERN", "Event Management", "Scalability", "Analytics"],
    color: "#a29bfe",
  },
  {
    id: 8,
    title: "Freelance & Leadership",
    subtitle: "Client-Driven Solutions",
    description:
      "Delivered end-to-end projects for diverse clients, leading cross-functional teams. Organized Interconnect 26.0, an open-source program.",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=600&fit=crop",
    icon: <Sparkles size={24} />,
    skills: ["Project Management", "Agile", "Team Coordination", "Mentoring"],
    color: "#fdcb6e",
  },
];

/* ═══════════════════════════════════════════════════════════
          HELPER: CALCULATE CIRCULAR OFFSET
═══════════════════════════════════════════════════════════ */
// Determines how far a card is from the center (0 = center, 1 = right, -1 = left, etc.)
const getOffset = (index, activeIndex, total) => {
  let diff = index - activeIndex;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
};

/* ═══════════════════════════════════════════════════════════
          MAIN SKILLS COMPONENT
═══════════════════════════════════════════════════════════ */
const Skills = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const totalItems = skillsCarouselData.length;

  // Check screen size for responsive 3D spacing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <section
      id="skills"
      className="relative w-full min-h-[100dvh] h-auto bg-background flex flex-col items-center justify-center py-20 sm:py-24 md:py-32 overflow-hidden"
    >
      {/* ── ATMOSPHERIC GLOWS ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 100, -50, 0], y: [0, -50, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-themeBrown/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -100, 50, 0], y: [0, 100, -50, 0] }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[100px]"
        />
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ── HEADER ── */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-5 text-center mb-10 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center items-center gap-3 mb-4"
        >
          <div className="h-px w-8 sm:w-12 bg-themeBrown" />
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.5em] text-themeBrown font-bold font-geist">
            The Arsenal
          </span>
          <div className="h-px w-8 sm:w-12 bg-themeBrown" />
        </motion.div>

        <motion.h2
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-humane font-black text-6xl sm:text-8xl md:text-[130px] text-themeBlack tracking-tighter leading-[0.8] uppercase"
        >
          Technical <span className="text-themeBrown">Expertise</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs sm:text-sm text-themeBlack/60 mt-6 max-w-xl mx-auto font-primary uppercase tracking-[0.2em] font-bold"
        >
          Master of full-stack engineering & Web3 innovation
        </motion.p>
      </div>

      {/* ── 3D CAROUSEL STAGE ── */}
      <div className="relative z-20 w-full max-w-[1400px] h-[450px] sm:h-[550px] md:h-[600px] flex items-center justify-center perspective-[1200px]">
        <AnimatePresence mode="popLayout">
          {skillsCarouselData.map((skill, index) => {
            const offset = getOffset(index, activeIndex, totalItems);
            const absOffset = Math.abs(offset);
            const isActive = offset === 0;

            // Only render cards that are relatively close to save DOM performance
            if (absOffset > 2) return null;

            // Calculate 3D spatial properties
            const xBase = isMobile ? 160 : 350;
            const x = offset * xBase;
            const scale = isActive ? 1 : 1 - absOffset * 0.15;
            const rotateY = offset * -20; // Tilts side cards towards the center
            const zIndex = 20 - absOffset;
            const opacity = isActive ? 1 : 1 - absOffset * 0.35;

            return (
              <motion.div
                key={skill.id}
                onClick={() => !isActive && setActiveIndex(index)}
                initial={{ opacity: 0, scale: 0.8, x: offset > 0 ? 200 : -200 }}
                animate={{
                  opacity,
                  scale,
                  x,
                  rotateY,
                  zIndex,
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 1,
                }}
                className={`absolute w-[280px] sm:w-[340px] md:w-[400px] h-[400px] sm:h-[480px] md:h-[540px] rounded-[2rem] bg-white/80 backdrop-blur-2xl border border-black/5 flex flex-col p-4 shadow-xl cursor-pointer will-change-transform ${
                  isActive
                    ? "shadow-[0_20px_60px_rgba(0,0,0,0.1)] ring-1 ring-themeBrown/20"
                    : "shadow-md hover:bg-white"
                }`}
              >
                {/* Top Image Section */}
                <div className="relative w-full h-[45%] rounded-[1.25rem] overflow-hidden bg-black/5 shrink-0">
                  <img
                    src={skill.imageUrl}
                    alt={skill.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Floating Icon */}
                  <div
                    className="absolute bottom-3 left-3 p-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 text-white shadow-lg"
                    style={{ color: skill.color }}
                  >
                    {skill.icon}
                  </div>
                </div>

                {/* Bottom Content Section */}
                <div className="pt-5 px-2 flex-1 flex flex-col">
                  <h3 className="font-clash text-2xl md:text-3xl font-bold text-themeBlack tracking-tight leading-none mb-1">
                    {skill.title}
                  </h3>
                  <p className="font-geist text-[9px] text-themeBrown uppercase tracking-[0.2em] font-bold mb-4">
                    {skill.subtitle}
                  </p>

                  <p className="font-primary text-xs md:text-sm text-themeBlack/70 line-clamp-3 leading-relaxed mb-4">
                    {skill.description}
                  </p>

                  {/* Skill Pills */}
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {skill.skills.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1.5 bg-black/5 border border-black/5 rounded-full text-[9px] md:text-[10px] font-bold text-themeBlack/80 uppercase tracking-wider"
                      >
                        {s}
                      </span>
                    ))}
                    {skill.skills.length > 4 && (
                      <span className="px-2 py-1.5 bg-themeBrown/10 text-themeBrown rounded-full text-[9px] md:text-[10px] font-bold uppercase">
                        +{skill.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Active Highlight Glow */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-[2rem] pointer-events-none"
                    style={{ boxShadow: `inset 0 0 0 1px ${skill.color}40` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── NAVIGATION CONTROLS ── */}
      <div className="relative z-20 mt-10 md:mt-16 flex flex-col items-center gap-6">
        <div className="flex gap-4">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full bg-white border border-black/10 flex items-center justify-center text-themeBlack shadow-sm hover:bg-themeBrown hover:text-white hover:border-themeBrown transition-all duration-300"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-white border border-black/10 flex items-center justify-center text-themeBlack shadow-sm hover:bg-themeBrown hover:text-white hover:border-themeBrown transition-all duration-300"
          >
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex gap-2">
          {skillsCarouselData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`transition-all duration-300 rounded-full h-1.5 ${
                idx === activeIndex
                  ? "w-6 bg-themeBrown"
                  : "w-1.5 bg-black/20 hover:bg-black/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
