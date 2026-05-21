import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Mousewheel } from "swiper/modules";
import { worksData } from "../assets/assets";
import {
  ExternalLink,
  Heart,
  ChevronRight,
  ChevronLeft,
  GitBranch,
  Info,
  X,
} from "lucide-react";

// Swiper Styles
import "swiper/css";
import "swiper/css/effect-cards";

const Works = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [liked, setLiked] = useState({});
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [showDetails, setShowDetails] = useState(false); // State for Details Modal

  const project = worksData[activeIdx];
  const isFirst = activeIdx === 0;
  const isLast = activeIdx === worksData.length - 1;

  const nextProject = () => !isLast && setActiveIdx((p) => p + 1);
  const prevProject = () => !isFirst && setActiveIdx((p) => p - 1);

  const toggleLike = () => {
    setLiked((prev) => ({ ...prev, [activeIdx]: !prev[activeIdx] }));
  };

  // Close details modal when changing projects
  useEffect(() => {
    setShowDetails(false);
  }, [activeIdx]);

  // Keyboard navigation for Projects
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't navigate projects if the modal is open
      if (showDetails) {
        if (e.key === "Escape") setShowDetails(false);
        return;
      }
      if (e.key === "ArrowRight") nextProject();
      if (e.key === "ArrowLeft") prevProject();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIdx, isFirst, isLast, showDetails]);

  // Staggered variants for text content
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.08, duration: 0.5, ease: "easeOut" },
    }),
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <section
      id="works"
      className="relative w-full min-h-[100dvh] bg-background overflow-hidden py-16 sm:py-24 flex items-center font-sans"
    >
      {/* ── 1. Animated Floating Particles ── */}
      <ul className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-30">
        {[...Array(10)].map((_, i) => (
          <motion.li
            key={i}
            className="absolute bottom-[-150px] bg-gradient-to-tr from-themeBrown to-themeBlack/10 rounded-full"
            initial={{ y: 0, rotate: 0, opacity: 1, borderRadius: "0%" }}
            animate={{ y: -1200, rotate: 720, opacity: 0, borderRadius: "50%" }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 20}px`,
              height: `${Math.random() * 100 + 20}px`,
            }}
          />
        ))}
      </ul>

      {/* ── 2. Main Content Container ── */}
      <div className="relative w-full max-w-[1300px] h-auto lg:h-[700px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center justify-center z-10 gap-8 lg:gap-0">
        {/* LEFT COLORED SHAPE (Desktop Only) */}
        <motion.div
          layout
          className="hidden lg:flex absolute top-0 left-4 h-full w-[45%] rounded-r-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.1)] z-0 items-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${project.accentColor} 0%, ${project.accentColor}cc 100%)`,
          }}
        >
          <motion.div
            key={`bg-text-${activeIdx}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            className="absolute -left-24 text-[200px] font-clash font-black uppercase tracking-tighter text-white transform -rotate-90 origin-center whitespace-nowrap pointer-events-none"
          >
            {project.category}
          </motion.div>
        </motion.div>

        {/* STACKED CARDS GALLERY (SWIPER) */}
        <div className="relative lg:absolute lg:left-[15%] lg:top-1/2 lg:-translate-y-1/2 z-30 w-[260px] h-[360px] sm:w-[320px] sm:h-[460px] lg:w-[380px] lg:h-[500px] shrink-0 mt-4 lg:mt-0">
          <Swiper
            key={project.id}
            onSwiper={setSwiperInstance}
            effect={"cards"}
            grabCursor={true}
            allowTouchMove={false} // Disable dragging manually
            onClick={() => swiperInstance?.slideNext()} // Swipe ONLY on click
            cardsEffect={{ rotate: true }}
            speed={600}
            loop={project.images.length > 2}
            mousewheel={{ invert: false }}
            modules={[EffectCards, Mousewheel]}
            className="w-full h-full cursor-pointer group"
          >
            {project.images.map((img, i) => (
              <SwiperSlide
                key={i}
                className="rounded-3xl overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.5)] bg-[#111] border border-white/10"
              >
                {/* Browser Mac Dots */}
                <div className="absolute top-0 w-full h-8 bg-black/60 backdrop-blur-md flex items-center px-4 gap-2 z-10 transition-colors group-hover:bg-black/80">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="ml-auto text-[8px] text-white/50 font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    CLICK TO SLIDE
                  </span>
                </div>
                {/* Image */}
                <img
                  src={img}
                  alt={`${project.title} screenshot ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover object-top pt-8 transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest border border-white/10">
                  {i + 1} / {project.images.length}
                </span>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* RIGHT DETAILS CARD */}
        <div className="relative lg:absolute lg:right-4 w-full lg:w-[75%] h-auto lg:h-[88%] bg-zinc-900 rounded-[2rem] lg:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col justify-center z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${activeIdx}`}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full h-full flex flex-col justify-center p-6 sm:p-10 lg:p-0"
            >
              {/* Subtle background glow */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none transition-colors duration-700"
                style={{
                  background: `radial-gradient(circle at top right, ${project.accentColor}, transparent 70%)`,
                }}
              />

              <div className="relative z-10 w-full lg:pl-[42%] lg:pr-14 pt-2 lg:pt-0">
                {/* Title */}
                <motion.h1
                  variants={contentVariants}
                  custom={0}
                  className="text-3xl sm:text-4xl lg:text-[54px] font-clash font-black text-white leading-[1] uppercase tracking-tight mb-2"
                >
                  {project.title}
                </motion.h1>

                {/* Subtitle */}
                <motion.span
                  variants={contentVariants}
                  custom={1}
                  className="block text-xs sm:text-sm lg:text-base text-white/70 font-epilogue font-medium mb-4"
                >
                  {project.projectType}
                </motion.span>

                {/* Short Description (Cleaned up for the main card) */}
                <motion.p
                  variants={contentVariants}
                  custom={1.5}
                  className="text-[11px] sm:text-xs lg:text-sm text-white/60 mb-5 leading-[1.6] sm:leading-relaxed line-clamp-3 sm:line-clamp-4 font-epilogue"
                >
                  {project.shortDescription}
                </motion.p>

                {/* Info Center Area (Tags & Details) */}
                <motion.div
                  variants={contentVariants}
                  custom={2}
                  className="flex flex-col sm:flex-row gap-5 sm:gap-6 lg:items-center border-t border-white/10 pt-5"
                >
                  {/* Tech Stack */}
                  <div className="flex-1">
                    <div className="text-[9px] font-bold tracking-[0.2em] text-white/40 mb-2 uppercase font-epilogue">
                      Technologies
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {project.softwareUsed.slice(0, 6).map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-md text-[8px] sm:text-[9px] font-bold tracking-wider text-white bg-white/5 border border-white/10 uppercase font-mono shadow-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="hidden sm:block w-px h-[50px] bg-white/10 shrink-0" />

                  {/* Year Display */}
                  <div className="flex flex-row sm:flex-col items-center gap-3 sm:gap-0 shrink-0">
                    <div className="relative w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] sm:mb-1 flex items-center justify-center">
                      <svg
                        className="absolute inset-0 w-full h-full transform -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="46"
                          fill="none"
                          stroke="rgba(255,255,255,0.05)"
                          strokeWidth="5"
                        />
                        <motion.circle
                          initial={{ strokeDasharray: "0 300" }}
                          animate={{ strokeDasharray: "240 300" }}
                          transition={{ delay: 0.5, duration: 1 }}
                          cx="50"
                          cy="50"
                          r="46"
                          fill="none"
                          stroke={project.accentColor}
                          strokeWidth="5"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="text-white font-bold text-[10px] sm:text-xs tracking-wider font-mono">
                        {project.year.split(" ")[0]}
                      </span>
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] text-white/40 uppercase font-epilogue">
                      Timeline
                    </span>
                  </div>
                </motion.div>

                {/* ── 3 BUTTONS: Live, Source Code, Details ── */}
                <motion.div
                  variants={contentVariants}
                  custom={3}
                  className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-6 sm:mt-8"
                >
                  {project.links?.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative overflow-hidden px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-white font-bold text-[9px] sm:text-[10px] tracking-widest uppercase transition-all hover:scale-105 hover:-translate-y-0.5 flex justify-center items-center gap-2 shadow-lg flex-1 sm:flex-none"
                      style={{
                        background: `linear-gradient(-45deg, ${project.accentColor} 0%, #111 200%)`,
                        boxShadow: `0 8px 20px -8px ${project.accentColor}`,
                      }}
                    >
                      <span className="relative z-10 font-epilogue">Live</span>
                      <ExternalLink
                        size={14}
                        className="relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      />
                    </a>
                  )}

                  {project.links?.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="group px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-white font-bold text-[9px] sm:text-[10px] tracking-widest uppercase transition-all hover:scale-105 flex justify-center items-center gap-2 border border-white/20 hover:bg-white/10 backdrop-blur-md flex-1 sm:flex-none"
                    >
                      <span className="font-epilogue">Code</span>
                      <GitBranch
                        size={14}
                        className="group-hover:scale-110 transition-transform"
                      />
                    </a>
                  )}

                  {/* Details Button triggers the Modal */}
                  <button
                    onClick={() => setShowDetails(true)}
                    className="group px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-white font-bold text-[9px] sm:text-[10px] tracking-widest uppercase transition-all hover:scale-105 flex justify-center items-center gap-2 border border-white/20 hover:bg-white/10 backdrop-blur-md flex-1 sm:flex-none"
                  >
                    <span className="font-epilogue">Details</span>
                    <Info
                      size={14}
                      className="group-hover:scale-110 transition-transform"
                    />
                  </button>

                  <button
                    onClick={toggleLike}
                    className="ml-auto w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all shrink-0 group"
                  >
                    <Heart
                      size={18}
                      className={`transition-colors duration-300 ${liked[activeIdx] ? "fill-red-500 text-red-500" : "fill-transparent text-white/50 group-hover:text-white"}`}
                    />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── PROJECT NAVIGATION BUTTONS ── */}
        <div className="absolute top-[32%] sm:top-[38%] lg:top-1/2 -translate-y-1/2 w-full flex justify-between px-2 sm:px-4 lg:-mx-6 z-40 pointer-events-none">
          <button
            onClick={prevProject}
            disabled={isFirst}
            className={`pointer-events-auto w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] lg:w-[56px] lg:h-[56px] rounded-full bg-white text-themeBlack flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all ${isFirst ? "opacity-0" : "opacity-100 hover:scale-110 hover:bg-themeBrown hover:text-white"}`}
          >
            <ChevronLeft size={20} strokeWidth={3} />
          </button>

          <button
            onClick={nextProject}
            disabled={isLast}
            className={`pointer-events-auto w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] lg:w-[56px] lg:h-[56px] rounded-full bg-white text-themeBlack flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all ${isLast ? "opacity-0" : "opacity-100 hover:scale-110 hover:bg-themeBrown hover:text-white"}`}
          >
            <ChevronRight size={20} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* ── 3. FULL DETAILS MODAL (Text Only) ── */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-themeBlack/70 backdrop-blur-md"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} // Prevent clicking inside from closing
              className="relative w-full max-w-3xl max-h-[85vh] bg-zinc-900 border border-white/10 rounded-3xl p-6 sm:p-10 overflow-y-auto shadow-2xl custom-scrollbar"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="pr-8">
                {/* Modal Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: project.accentColor }}
                  />
                  <span className="text-[10px] sm:text-xs text-white/60 font-bold uppercase tracking-[0.3em] font-epilogue">
                    {project.projectType}
                  </span>
                </div>

                <h2 className="text-3xl sm:text-5xl md:text-6xl font-clash font-black text-white leading-[1] uppercase tracking-tight mb-6">
                  {project.title}
                </h2>

                <div className="w-full h-px bg-white/10 mb-6" />

                {/* Modal Full Description */}
                <div className="text-sm sm:text-base text-white/80 leading-[1.8] sm:leading-loose font-epilogue whitespace-pre-wrap">
                  {project.fullDescription}
                </div>

                {/* Modal Tech Stack (Repeated for clarity in detailed view) */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="text-[10px] font-bold tracking-[0.2em] text-white/40 mb-4 uppercase font-epilogue">
                    Complete Tech Stack
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.softwareUsed.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-bold tracking-wider text-white bg-white/5 border border-white/10 uppercase font-mono shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollbar styling specifically for the modal */}
      <style
        dangerouslySetInlineStyle={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `,
        }}
      />
    </section>
  );
};

export default Works;
