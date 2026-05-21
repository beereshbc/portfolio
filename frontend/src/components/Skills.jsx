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
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   SKILLS DATA — Complete with optimized images and colors
═══════════════════════════════════════════════════════════ */
const skillsCarouselData = [
  {
    id: 1,
    title: "MERN Stack Mastery",
    subtitle: "Full-Scale Web Engineering",
    description:
      "Production-grade applications with React, Node, Express, MongoDB. Integrated JWT, REST APIs, real-time features, and payment gateways. Delivered 10+ live systems for enterprise and academic clients.",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=600&fit=crop",
    icon: <Globe size={28} />,
    skills: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Tailwind CSS",
      "JWT Auth",
      "REST APIs",
      "Socket.io",
    ],
    color: "#f45b26",
    bgGradient: "from-orange-500/20 to-red-500/20",
  },
  {
    id: 2,
    title: "Web3 & Blockchain",
    subtitle: "Decentralized Innovation",
    description:
      "Smart contract development with Solidity, Hardhat, Ethers.js. Integrated MetaMask, IPFS, and Hedera. Built secure dApps and token systems for real-world use cases.",
    imageUrl:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&h=600&fit=crop",
    icon: <Hexagon size={28} />,
    skills: [
      "Solidity",
      "Hardhat",
      "Ethers.js",
      "Web3.js",
      "MetaMask",
      "IPFS",
      "Hedera",
    ],
    color: "#6c5ce7",
    bgGradient: "from-purple-500/20 to-indigo-500/20",
  },
  {
    id: 3,
    title: "AI & Machine Learning",
    subtitle: "Intelligent Systems",
    description:
      "Python-based AI solutions using TensorFlow, Scikit-learn, Gemini & OpenAI APIs. Built NLP pipelines, predictive models, and AI-integrated curriculum management systems.",
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=600&fit=crop",
    icon: <Brain size={28} />,
    skills: [
      "Python",
      "TensorFlow/Keras",
      "Scikit-learn",
      "Gemini API",
      "OpenAI API",
      "NLP",
      "Pandas",
    ],
    color: "#00cec9",
    bgGradient: "from-cyan-500/20 to-teal-500/20",
  },
  {
    id: 4,
    title: "Core CS & DSA",
    subtitle: "Algorithmic Foundation",
    description:
      "Strong grasp of Data Structures, Algorithms, OOP, and time/space complexity. Active LeetCode solver with Java, C, and JavaScript. Built efficient, scalable backends.",
    imageUrl:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=500&h=600&fit=crop",
    icon: <Cpu size={28} />,
    skills: [
      "Java",
      "C",
      "JavaScript (ES6+)",
      "DSA",
      "OOP Design Patterns",
      "Complexity Analysis",
    ],
    color: "#0984e3",
    bgGradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: 5,
    title: "DevOps & Tools",
    subtitle: "Streamlined CI/CD",
    description:
      "Containerization with Docker, version control with Git/GitHub, CI/CD pipelines, and deployment on cloud platforms. Experienced with Postman, Cloudinary, and Razorpay.",
    imageUrl:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=500&h=600&fit=crop",
    icon: <Server size={28} />,
    skills: [
      "Docker",
      "Git/GitHub",
      "CI/CD",
      "Postman",
      "Cloudinary",
      "Razorpay",
      "Vercel",
    ],
    color: "#e17055",
    bgGradient: "from-orange-500/20 to-rose-500/20",
  },
  {
    id: 6,
    title: "UI/UX & Prototyping",
    subtitle: "Design + Development",
    description:
      "Crafting modern, responsive interfaces with Figma, Canva, and Eraser.io. Focus on micro-interactions, accessibility, and pixel-perfect implementation.",
    imageUrl:
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500&h=600&fit=crop",
    icon: <Paintbrush size={28} />,
    skills: [
      "Figma",
      "Canva",
      "Eraser.io",
      "Wireframing",
      "Prototyping",
      "UI/UX Principles",
    ],
    color: "#fd79a8",
    bgGradient: "from-pink-500/20 to-rose-500/20",
  },
  {
    id: 7,
    title: "Academic Systems",
    subtitle: "University-Scale Platforms",
    description:
      "Official developer for GM University's CSE portal and AI-integrated Curriculum Management System (PDMS). Built for 200+ active users with 100% uptime during events.",
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=600&fit=crop",
    icon: <Award size={28} />,
    skills: [
      "MERN",
      "Gemini API",
      "Event Management",
      "Scalability",
      "User Analytics",
    ],
    color: "#a29bfe",
    bgGradient: "from-purple-400/20 to-pink-400/20",
  },
  {
    id: 8,
    title: "Freelance & Leadership",
    subtitle: "Client-Driven Solutions",
    description:
      "Delivered end-to-end projects for diverse clients, leading cross-functional teams. Organized Interconnect 26.0, a university-wide open-source program inspired by GSoC.",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=600&fit=crop",
    icon: <Sparkles size={28} />,
    skills: [
      "Project Management",
      "Client Communication",
      "Team Coordination",
      "Agile",
      "Mentoring",
    ],
    color: "#fdcb6e",
    bgGradient: "from-yellow-500/20 to-orange-500/20",
  },
];

/* ═══════════════════════════════════════════════════════════
   3D CAROUSEL HELPER FUNCTIONS
═══════════════════════════════════════════════════════════ */
const getZIndex = (total, index, active) => {
  return total - Math.abs(index - active);
};

const getItemStyle = (index, active, total) => {
  const relativeIndex = (index - active) / total;
  const x = relativeIndex * 800;
  const y = relativeIndex * 200;
  const rot = relativeIndex * 120;
  const zIndex = getZIndex(total, index, active);

  let opacity = 1;
  const distance = Math.abs(index - active);

  if (distance > 2) opacity = 0;
  else if (distance === 2) opacity = 0.4;
  else if (distance === 1) opacity = 0.8;

  return {
    transform: `translate(${x}%, ${y}%) rotate(${rot}deg)`,
    zIndex,
    opacity,
    transition:
      "transform 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.1), opacity 0.5s ease",
  };
};

/* ═══════════════════════════════════════════════════════════
   ANIMATED BACKGROUND COMPONENT
═══════════════════════════════════════════════════════════ */
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -100, 100, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-500 to-red-500 rounded-full blur-3xl opacity-20"
      />

      <motion.div
        animate={{
          x: [0, -100, 100, 0],
          y: [0, 100, -100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20"
      />

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40" />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   SKILL CARD COMPONENT
═══════════════════════════════════════════════════════════ */
const SkillCard = ({ skill, isActive, onClick, style }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          onClick();
        }
      }}
      aria-label={`${skill.title} skill card, ${isActive ? "active" : "inactive"}`}
      style={style}
      className="absolute cursor-pointer will-change-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
      whileHover={{ scale: isActive ? 1.05 : 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={`
          relative w-[280px] sm:w-[320px] md:w-[380px] lg:w-[420px] 
          h-[420px] sm:h-[460px] md:h-[500px] lg:h-[540px]
          rounded-2xl overflow-hidden transition-all duration-300
          ${isActive ? "scale-105" : "scale-100"}
          hover:shadow-2xl
        `}
        style={{
          boxShadow: isActive
            ? `0 25px 50px -12px ${skill.color}80`
            : "0 10px 30px -15px rgba(0,0,0,0.3)",
        }}
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          {imageError ? (
            <div
              className={`w-full h-full bg-gradient-to-br ${skill.bgGradient} flex items-center justify-center`}
            >
              <Code size={48} className="text-white/50" />
            </div>
          ) : (
            <>
              <img
                src={skill.imageUrl}
                alt={skill.title}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                loading="lazy"
              />
              {!imageLoaded && (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${skill.bgGradient}`}
                />
              )}
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />
        </div>

        {/* Content Container */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 text-white z-10 flex flex-col gap-3 h-auto">
          {/* Icon + Title Row */}
          <div className="flex items-start gap-3">
            <div
              className="p-2.5 rounded-lg bg-white/10 backdrop-blur-sm flex-shrink-0 border border-white/20"
              style={{ color: skill.color }}
            >
              {skill.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-clash font-bold text-lg md:text-2xl tracking-tight leading-tight break-words">
                {skill.title}
              </h3>
              <p className="font-outfit text-xs opacity-80 mt-1">
                {skill.subtitle}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="font-outfit text-xs sm:text-sm text-white/90 line-clamp-3 leading-relaxed">
            {skill.description}
          </p>

          {/* Skills Pills */}
          <div className="flex flex-wrap gap-2 mt-2">
            {skill.skills.slice(0, 5).map((tech, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="font-mono text-[9px] sm:text-[10px] font-bold px-2.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 whitespace-nowrap"
              >
                {tech}
              </motion.span>
            ))}
            {skill.skills.length > 5 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
                className="font-mono text-[9px] sm:text-[10px] font-bold px-2.5 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
              >
                +{skill.skills.length - 5}
              </motion.span>
            )}
          </div>
        </div>

        {/* Active Indicator */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute top-4 right-4 w-3 h-3 rounded-full"
            style={{ background: skill.color }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN SKILLS CAROUSEL COMPONENT
═══════════════════════════════════════════════════════════ */
const Skills = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const totalItems = skillsCarouselData.length;

  // Auto-advance carousel with pause on interaction
  useEffect(() => {
    if (!isAutoplay) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalItems);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoplay, totalItems]);

  // Handle card click with proper cleanup
  const handleCardClick = useCallback((idx) => {
    setActiveIndex(idx);
    setIsAutoplay(false);

    // Resume autoplay after 10 seconds of inactivity
    const resumeTimer = setTimeout(() => {
      setIsAutoplay(true);
    }, 10000);

    return () => clearTimeout(resumeTimer);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
        setIsAutoplay(false);
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % totalItems);
        setIsAutoplay(false);
      }
    },
    [totalItems],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <section
      className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 overflow-hidden rounded-t-3xl md:rounded-t-[4rem] flex flex-col items-center justify-center pt-20 sm:pt-24 md:pt-32"
      role="region"
      aria-label="Skills carousel section"
    >
      <AnimatedBackground />

      {/* Header Section */}
      <div className="absolute top-8 sm:top-12 md:top-16 left-0 right-0 z-20 text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center items-center gap-3 mb-4 flex-wrap px-4"
        >
          <div className="h-px w-8 sm:w-12 bg-orange-500/50" />
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.5em] text-orange-500 font-bold font-mono">
            The Arsenal
          </span>
          <div className="h-px w-8 sm:w-12 bg-orange-500/50" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-tight px-4"
        >
          Technical
          <br />
          Expertise
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm sm:text-base text-slate-400 mt-4 px-4 max-w-2xl mx-auto"
        >
          Master of full-stack development, Web3 innovation, and intelligent
          systems
        </motion.p>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full h-full flex items-center justify-center overflow-visible px-4 sm:px-8 py-12 sm:py-16 md:py-20">
        <div className="relative w-full max-w-7xl h-[500px] sm:h-[550px] md:h-[650px] lg:h-[700px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {skillsCarouselData.map((skill, idx) => {
              const style = getItemStyle(idx, activeIndex, totalItems);
              const isActive = idx === activeIndex;

              return (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  isActive={isActive}
                  onClick={() => handleCardClick(idx)}
                  style={style}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Dots */}
      <nav
        className="absolute bottom-6 sm:bottom-10 md:bottom-14 left-0 right-0 z-20 flex justify-center gap-3 px-4"
        aria-label="Slide navigation"
      >
        {skillsCarouselData.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => handleCardClick(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={idx === activeIndex ? "page" : undefined}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
              idx === activeIndex
                ? "w-8 h-2 bg-orange-500"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </nav>

      {/* Keyboard Navigation Hint */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute bottom-2 sm:bottom-4 left-0 right-0 text-center text-xs sm:text-sm text-slate-500 pointer-events-none"
      >
        ← Use arrow keys or click dots to navigate →
      </motion.div>

      {/* Decorative Left/Right Gradient Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none z-10" />

      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

        .font-clash {
          font-family: 'Clash Display', sans-serif;
          font-weight: 600;
        }

        .font-outfit {
          font-family: 'Outfit', sans-serif;
        }

        .font-mono {
          font-family: 'Courier New', monospace;
        }

        html {
          scroll-behavior: smooth;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: #f45b26;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #e44b1d;
        }

        *:focus-visible {
          outline: 2px solid #f45b26;
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Skills;
