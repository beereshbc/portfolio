import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, Zap, Mail, Home } from "lucide-react";

const navItems = [
  { name: "Home", icon: Home, id: "hero" },
  { name: "Me", icon: User, id: "me" },
  { name: "Works", icon: Briefcase, id: "works" },
  { name: "Skills", icon: Zap, id: "skills" },
  { name: "Contact", icon: Mail, id: "contact" },
];

const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      navItems.forEach((item, index) => {
        const element = document.getElementById(item.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveIndex(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (id, index) => {
    setActiveIndex(index);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ y: -120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.3,
      }}
      className="fixed top-6 sm:top-8 left-1/2 z-[100] flex items-center justify-center w-full max-w-[90vw] sm:max-w-max pointer-events-none"
    >
      <nav
        className={`relative flex items-center gap-1 sm:gap-2 p-2 sm:p-2.5 rounded-full border backdrop-blur-2xl pointer-events-auto overflow-x-auto hide-scrollbar transition-all duration-500 ${
          scrolled
            ? "bg-white/60 border-white/30 shadow-[0_15px_40px_rgba(0,0,0,0.1)]"
            : "bg-white/50 border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
        }`}
      >
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === activeIndex;
          const isHovered = index === hoveredIndex;
          const isExpanded = isActive || isHovered;

          return (
            <motion.button
              key={item.id}
              layout
              onClick={() => handleNavigation(item.id, index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileTap={{ scale: 0.95 }}
              className={`relative flex items-center justify-center rounded-full h-11 sm:h-12 outline-none group transition-all duration-300 ${
                isActive
                  ? "text-white"
                  : "text-textSecondary hover:text-textPrimary"
              }`}
              style={{
                paddingLeft: isExpanded ? "1.25rem" : "0.75rem",
                paddingRight: isExpanded ? "1.25rem" : "0.75rem",
              }}
            >
              {/* Active Background Pill */}
              {isActive && (
                <motion.div
                  layoutId="activeNavBackground"
                  className="absolute inset-0 bg-gradient-to-r from-themeBrown to-accent rounded-full shadow-[0_8px_20px_rgba(244,91,38,0.3)]"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}

              {/* Hover Background Pill */}
              {!isActive && isHovered && (
                <motion.div
                  layoutId="hoverNavBackground"
                  className="absolute inset-0 bg-black/5 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-2 sm:gap-2.5 gpu-accelerate">
                {/* Icon */}
                <motion.div layout>
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`transition-colors duration-300 sm:w-[20px] sm:h-[20px] ${
                      isActive ? "text-white" : ""
                    }`}
                  />
                </motion.div>

                {/* Expanding Text Label */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.span
                      layout
                      initial={{ opacity: 0, width: 0, filter: "blur(6px)" }}
                      animate={{
                        opacity: 1,
                        width: "auto",
                        filter: "blur(0px)",
                      }}
                      exit={{ opacity: 0, width: 0, filter: "blur(6px)" }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                        opacity: { duration: 0.2 },
                      }}
                      className="overflow-hidden whitespace-nowrap font-primary font-bold text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.2em] uppercase origin-left mt-0.5"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </nav>

      <style
        dangerouslySetInlineStyle={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </motion.header>
  );
};

export default Navbar;
