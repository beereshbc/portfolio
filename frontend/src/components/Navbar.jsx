import React, { useState, useEffect, useCallback } from "react";
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

  // Optimized Scroll Spy
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + 200; // Offset for better detection

    navItems.forEach((item, index) => {
      const element = document.getElementById(item.id);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          setActiveIndex(index);
        }
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleNavigation = (id, index) => {
    setActiveIndex(index);
    const element = document.getElementById(id);
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 sm:top-6 left-0 w-full z-[100] flex justify-center px-4"
    >
      <nav className="flex items-center gap-1 sm:gap-1.5 p-1.5 bg-white/80 backdrop-blur-lg border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full w-full max-w-[360px] sm:max-w-fit overflow-x-auto hide-scrollbar">
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
              className={`relative flex items-center justify-center rounded-full h-10 sm:h-11 transition-all duration-300 outline-none ${
                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-900"
              }`}
              style={{
                paddingLeft: isExpanded ? "1rem" : "0.75rem",
                paddingRight: isExpanded ? "1rem" : "0.75rem",
              }}
            >
              {/* Active Pill Pill */}
              {isActive && (
                <motion.div
                  layoutId="navPill"
                  className="absolute inset-0 bg-themeBrown rounded-full shadow-sm"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}

              {/* Hover Pill Pill */}
              {!isActive && isHovered && (
                <motion.div
                  layoutId="navPill"
                  className="absolute inset-0 bg-zinc-100 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-2">
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap font-bold text-[10px] uppercase tracking-widest origin-left"
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

      {/* Hide Scrollbar Helper */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </motion.header>
  );
};

export default Navbar;
