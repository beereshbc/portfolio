import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import { worksData } from "../assets/assets";
import { ExternalLink, GitBranch, X, Code2, Box, Layers } from "lucide-react";

// Swiper Styles
import "swiper/css";
import "swiper/css/free-mode";

/* ─────────────────────────────────────────────────────────────────
   ISOMETRIC WIREFRAME GRAPHICS (For the main carousel cards)
───────────────────────────────────────────────────────────────── */
const GraphicDiscovery = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full opacity-60">
    <g transform="translate(100, 120) scale(1, 0.5) rotate(45)">
      <path
        d="M-60,-60 L60,-60 L60,60 L-60,60 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 4"
        strokeOpacity="0.3"
      />
      <path
        d="M-30,-60 L-30,60 M0,-60 L0,60 M30,-60 L30,60"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.1"
      />
      <path
        d="M-60,-30 L60,-30 M-60,0 L60,0 M-60,30 L60,30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.1"
      />
      <path
        d="M-40,-40 L40,-40 L40,40 L-40,40 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="-30"
        y="-30"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="0"
        y="-30"
        width="30"
        height="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="0"
        y="-15"
        width="20"
        height="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="-30"
        y="0"
        width="60"
        height="10"
        fill="currentColor"
        stroke="none"
      />
      <rect
        x="-30"
        y="20"
        width="20"
        height="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="0"
        y="20"
        width="30"
        height="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </g>
    <g transform="translate(120, 80)">
      <circle
        cx="0"
        cy="0"
        r="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="0"
        cy="0"
        r="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1="16"
        y1="16"
        x2="45"
        y2="45"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="16"
        x2="45"
        y2="45"
        stroke="#000"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

const GraphicProduction = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full opacity-60">
    <g transform="translate(100, 140) scale(1, 0.5) rotate(45)">
      <path
        d="M-60,-60 L60,-60 L60,60 L-60,60 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 4"
        strokeOpacity="0.3"
      />
      <path
        d="M-40,-40 L40,-40 L40,40 L-40,40 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="-15"
        cy="-15"
        r="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 2"
        strokeOpacity="0.4"
      />
      <rect
        x="10"
        y="-25"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 2"
        strokeOpacity="0.4"
      />
      <rect
        x="-25"
        y="15"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 2"
        strokeOpacity="0.4"
      />
      <g transform="translate(10, 10)">
        <circle
          cx="-25"
          cy="-25"
          r="12"
          fill="#fff"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </g>
      <g transform="translate(20, 20)">
        <rect
          x="-10"
          y="-45"
          width="20"
          height="20"
          fill="#fff"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </g>
      <g transform="translate(10, 10)">
        <rect
          x="-35"
          y="5"
          width="20"
          height="20"
          fill="#fff"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </g>
      <g transform="translate(15, 15)">
        <rect
          x="15"
          y="-5"
          width="20"
          height="4"
          fill="#fff"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="15"
          y="5"
          width="20"
          height="4"
          fill="#fff"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="15"
          y="15"
          width="20"
          height="4"
          fill="#fff"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </g>
    </g>
  </svg>
);

/* ─────────────────────────────────────────────────────────────────
   MAIN WORKS COMPONENT
───────────────────────────────────────────────────────────────── */
const Works = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  // Lock body scroll when modal is open to prevent double-scrolling
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProject]);

  return (
    <section
      id="works"
      // h-[100dvh] forces the section to be exactly viewport height.
      // overflow-hidden prevents the main page from scrolling.
      className="relative w-full h-[100dvh] bg-[#fff] overflow-hidden flex flex-col font-primary text-zinc-900 pt-16 md:pt-24"
    >
      {/* Header Area */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10 shrink-0">
        <div>
          <span className="text-zinc-500 font-epilogue text-sm uppercase tracking-widest font-bold mb-2 block">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-clash font-medium text-zinc-800 leading-tight">
            Discover the <br />
            <span className="font-bold text-black">structural process.</span>
          </h2>
        </div>
        <p className="text-zinc-500 font-epilogue text-sm md:text-base max-w-sm leading-relaxed">
          These cards provide brief technical blueprints of past projects. Click
          anywhere on a card to uncover full details and visual snaps.
        </p>
      </div>

      {/* ── MAIN AUTO-CAROUSEL ── */}
      <div className="w-full pl-6 md:pl-12 pb-12 z-10 flex-1 flex items-center min-h-0">
        <Swiper
          slidesPerView={1.1}
          spaceBetween={20}
          breakpoints={{
            640: { slidesPerView: 1.8, spaceBetween: 24 },
            1024: { slidesPerView: 2.5, spaceBetween: 32 },
            1440: { slidesPerView: 3.2, spaceBetween: 40 },
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          freeMode={true}
          modules={[Autoplay, FreeMode]}
          className="w-full h-full max-h-[550px]"
        >
          {worksData.map((proj, idx) => {
            const isDark = idx % 2 === 0;

            return (
              <SwiperSlide key={proj.id} className="h-full">
                {/* ENTIRE CARD IS CLICKABLE */}
                <div
                  onClick={() => setSelectedProject(proj)}
                  className={`w-full h-full rounded-[32px] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden transition-transform duration-500 hover:-translate-y-2 cursor-pointer group ${
                    isDark
                      ? "bg-[#0A0A0A] text-white shadow-2xl"
                      : "bg-white text-zinc-900 border border-zinc-200 shadow-xl"
                  }`}
                >
                  {/* Top Text Content */}
                  <div className="z-10 relative">
                    <span
                      className={`text-[10px] uppercase tracking-[0.25em] font-epilogue font-bold mb-5 block ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
                    >
                      {proj.category}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-medium mb-4 leading-tight tracking-tight group-hover:underline decoration-2 underline-offset-4">
                      {proj.title}
                    </h3>
                    <p
                      className={`text-xs md:text-sm font-epilogue leading-relaxed max-w-[85%] ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
                    >
                      {proj.shortDescription}
                    </p>
                  </div>

                  {/* Blueprint Graphic Background */}
                  <div className="absolute bottom-0 right-0 left-0 h-[60%] pointer-events-none flex items-end justify-center transition-transform duration-700 group-hover:scale-105">
                    {isDark ? <GraphicDiscovery /> : <GraphicProduction />}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* ── MODAL: FULL DETAILS & PINTEREST GRID SNAPS ── */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-zinc-900/40 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              // Modal acts as its own scrolling window
              className="relative w-full max-w-[1400px] h-[95vh] bg-[#F8F9FA] rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Floating Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-3 rounded-full bg-white shadow-md hover:bg-zinc-100 text-zinc-900 transition-colors z-50 border border-zinc-200"
              >
                <X size={20} strokeWidth={2.5} />
              </button>

              {/* Scrollable Content Area within Modal */}
              <div className="w-full h-full overflow-y-auto custom-scrollbar">
                {/* TOP SECTION: Project Info (Styled like the reference image) */}
                <div className="w-full bg-white px-8 sm:px-16 pt-20 pb-16 flex flex-col lg:flex-row gap-12 lg:gap-24 relative overflow-hidden">
                  {/* Decorative Elements mimicking the reference image */}
                  <div className="absolute top-10 right-10 opacity-10 pointer-events-none hidden lg:block">
                    <GraphicProduction />
                  </div>

                  <div className="w-full lg:w-1/2 relative z-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: selectedProject.accentColor }}
                      />
                      <span className="text-xs font-epilogue font-bold text-zinc-500 uppercase tracking-widest">
                        {selectedProject.projectType} • {selectedProject.year}
                      </span>
                    </div>

                    <h2 className="text-4xl sm:text-6xl lg:text-7xl font-clash font-bold text-zinc-900 leading-[1.05] mb-6 tracking-tight">
                      {selectedProject.title}
                    </h2>

                    <div className="text-sm sm:text-base font-primary text-zinc-600 leading-relaxed whitespace-pre-wrap mb-10 max-w-xl">
                      {selectedProject.fullDescription}
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-4">
                      {selectedProject.links?.live && (
                        <a
                          href={selectedProject.links.live}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-[#D4F34A] hover:bg-[#c5e638] text-zinc-900 px-8 py-3.5 rounded-full text-sm font-bold font-epilogue tracking-wide flex items-center gap-2 transition-colors shadow-sm"
                        >
                          Explore Live <ExternalLink size={16} />
                        </a>
                      )}
                      {selectedProject.links?.github && (
                        <a
                          href={selectedProject.links.github}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-900 px-8 py-3.5 rounded-full text-sm font-bold font-epilogue tracking-wide flex items-center gap-2 transition-colors"
                        >
                          Source Code <GitBranch size={16} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Tech Stack Widget (Matching the modular block vibe) */}
                  <div className="w-full lg:w-1/2 flex items-center relative z-10">
                    <div className="bg-[#F8F9FA] rounded-[2rem] p-8 border border-zinc-100 w-full shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-2 mb-6 text-zinc-900">
                        <Code2 size={20} />
                        <h3 className="text-lg font-bold font-clash">
                          Technology Stack
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {selectedProject.softwareUsed.map((tech) => (
                          <span
                            key={tech}
                            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide text-zinc-800 bg-white border border-zinc-200 shadow-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM SECTION: Pinterest-style Grid Snaps */}
                <div className="w-full px-8 sm:px-16 py-16 bg-[#F8F9FA]">
                  <div className="flex flex-col items-center text-center mb-12">
                    <h3 className="text-3xl md:text-4xl font-clash font-bold text-zinc-900 mb-4">
                      Project Visuals & Snaps
                    </h3>
                    <p className="text-zinc-500 font-epilogue text-sm max-w-xl">
                      A comprehensive view of the interfaces, dashboards, and
                      visual components engineered for this platform.
                    </p>
                  </div>

                  {/* MASONRY GRID USING CSS COLUMNS */}
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {selectedProject.images.map((img, i) => (
                      <div
                        key={i}
                        className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-zinc-200 border border-zinc-200/60 shadow-sm"
                      >
                        <img
                          src={img}
                          alt={`${selectedProject.title} snap ${i + 1}`}
                          className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                        {/* Subtle hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hide Scrollbar for modal but allow smooth scrolling */}
      <style
        dangerouslySetInlineStyle={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F8F9FA;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D4D4D8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #A1A1AA;
        }
      `,
        }}
      />
    </section>
  );
};

export default Works;
