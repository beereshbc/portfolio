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

  // Performance-optimized scroll listener using requestAnimationFrame
  const handleScroll = useCallback(() => {
    let ticking = false;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Use a more dynamic offset based on viewport height (e.g., top 30% of screen)
        const scrollPosition = window.scrollY + window.innerHeight * 0.3;

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
        ticking = false;
      });
      ticking = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount to set initial active state
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleNavigation = (id, index) => {
    setActiveIndex(index);
    const element = document.getElementById(id);

    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (element) {
      // Adjusted scroll alignment to account for the fixed navbar height
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      // Fixed positioning, properly centered for all screen sizes
      className="fixed top-4 sm:top-6 left-1/4 -translate-x-1/2 z-[100] w-full px-4 flex justify-center pointer-events-none"
    >
      <nav
        aria-label="Main Navigation"
        className="pointer-events-auto flex items-center gap-1 sm:gap-2 p-1 bg-white/80 backdrop-blur-md border border-zinc-200 shadow-lg shadow-zinc-800/5 rounded-full w-max max-w-full overflow-x-auto hide-scrollbar"
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
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
              aria-current={isActive ? "page" : undefined}
              aria-label={`Maps to ${item.name}`}
              className={`relative flex items-center justify-center rounded-full h-10  transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${
                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-900"
              }`}
              style={{
                paddingLeft: isExpanded ? "1.25rem" : "0.875rem",
                paddingRight: isExpanded ? "1.25rem" : "0.875rem",
              }}
            >
              {/* Active Pill - Unique layoutId */}
              {isActive && (
                <motion.div
                  layoutId="activeNavPill"
                  className="absolute inset-0 bg-themeBrown rounded-full shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {/* Hover Pill - Unique layoutId */}
              {!isActive && isHovered && (
                <motion.div
                  layoutId="hoverNavPill"
                  className="absolute inset-0 bg-zinc-100 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-2">
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="whitespace-nowrap font-bold text-[11px] sm:text-xs uppercase tracking-widest origin-left overflow-hidden"
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
