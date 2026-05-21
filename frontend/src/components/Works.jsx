import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Mousewheel } from "swiper/modules";
import { worksData } from "../assets/assets";

// Swiper Styles
import "swiper/css";
import "swiper/css/effect-cards";

// --- Icons ---
const ArrowIcon = ({ className }) => (
  <svg
    className={`w-6 h-6 ${className}`}
    viewBox="0 0 32 32"
    fill="currentColor"
  >
    <path d="M31.296 14.336l-9.888-9.888c-0.896-0.896-2.432-0.896-3.328 0s-0.896 2.432 0 3.328l5.824 5.856h-21.536c-1.312 0-2.368 1.056-2.368 2.368s1.056 2.368 2.368 2.368h21.568l-5.856 5.824c-0.896 0.896-0.896 2.432 0 3.328 0.48 0.48 1.088 0.704 1.696 0.704s1.216-0.224 1.696-0.704l9.824-9.824c0.448-0.448 0.704-1.056 0.704-1.696s-0.224-1.248-0.704-1.664z"></path>
  </svg>
);

const HeartIcon = ({ isActive }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-5 h-5 transition-colors duration-300 ${isActive ? "fill-red-500 text-red-500" : "fill-transparent text-gray-400"}`}
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const Works = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [liked, setLiked] = useState({});

  const project = worksData[activeIdx];
  const isFirst = activeIdx === 0;
  const isLast = activeIdx === worksData.length - 1;

  const nextProject = () => !isLast && setActiveIdx((p) => p + 1);
  const prevProject = () => !isFirst && setActiveIdx((p) => p - 1);

  const toggleLike = () => {
    setLiked((prev) => ({ ...prev, [activeIdx]: !prev[activeIdx] }));
  };

  // Keyboard navigation for Projects
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextProject();
      if (e.key === "ArrowLeft") prevProject();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIdx]);

  // Staggered variants for text content
  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.5, ease: "easeOut" },
    }),
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    // Unified Theme Background
    <section
      id="works"
      className="relative w-full h-full bg-background overflow-hidden py-20 flex items-center font-sans"
    >
      {/* Animated Floating Particles/Circles (From Movie Night Design) */}
      <ul className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-30">
        {[...Array(10)].map((_, i) => (
          <motion.li
            key={i}
            className="absolute bottom-[-150px] bg-gradient-to-tr from-themeBrown to-themeBlack/20 rounded-full"
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

      <div className="relative w-full max-w-[1300px] h-auto lg:h-[700px] mx-auto px-4 lg:px-12 flex flex-col lg:flex-row items-center justify-center z-10 gap-10 lg:gap-0">
        {/* 1. LEFT COLORED SHAPE (Desktop Only) */}
        <motion.div
          layout
          className="hidden lg:flex absolute top-0 left-4 h-full w-[45%] rounded-r-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.1)] z-0 items-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${project.accentColor} 0%, ${project.accentColor}dd 100%)`,
          }}
        >
          <motion.div
            key={`bg-text-${activeIdx}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            className="absolute -left-20 text-[180px] font-black uppercase tracking-tighter text-white transform -rotate-90 origin-center whitespace-nowrap pointer-events-none"
          >
            {project.category}
          </motion.div>
        </motion.div>

        {/* 2. STACKED CARDS GALLERY (SWIPER) */}
        <div className="relative lg:absolute lg:left-[15%] lg:top-1/2 lg:-translate-y-1/2 z-30 w-[260px] h-[380px] sm:w-[320px] sm:h-[480px] lg:w-[380px] lg:h-[520px]">
          {/* Key ensures Swiper re-initializes when switching projects */}
          <Swiper
            key={project.id}
            effect={"cards"}
            grabCursor={true}
            cardsEffect={{ rotate: true }}
            speed={600}
            loop={project.images.length > 2} // Loop only if enough images
            mousewheel={{ invert: false }}
            modules={[EffectCards, Mousewheel]}
            className="w-full h-full"
          >
            {project.images.map((img, i) => (
              <SwiperSlide
                key={i}
                className="rounded-2xl overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.4)] bg-surface border-2 border-white/10"
              >
                {/* Browser Mac Dots for app feel */}
                <div className="absolute top-0 w-full h-8 bg-black/50 backdrop-blur-md flex items-center px-4 gap-2 z-10">
                  <div className="w-3 h-3 rounded-full bg-red-500/90" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/90" />
                  <div className="w-3 h-3 rounded-full bg-green-500/90" />
                </div>
                {/* Image */}
                <img
                  src={img}
                  alt={`${project.title} screenshot ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover object-top pt-8"
                />
                {/* Gradient Overlay & Counter */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest shadow-lg">
                  {i + 1} / {project.images.length}
                </span>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 3. RIGHT DETAILS CARD */}
        <div className="relative lg:absolute lg:right-4 w-full lg:w-[75%] h-auto lg:h-[90%] bg-zinc-900 rounded-[30px] lg:rounded-[40px] shadow-2xl overflow-hidden flex flex-col justify-center z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${activeIdx}`}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full h-full flex flex-col justify-center p-8 lg:p-0"
            >
              {/* Subtle background glow */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none transition-colors duration-700"
                style={{
                  background: `radial-gradient(circle at right, ${project.accentColor}, transparent 70%)`,
                }}
              />

              <div className="relative z-10 w-full lg:pl-[40%] lg:pr-16 pt-4 lg:pt-0">
                {/* Title */}
                <motion.h1
                  variants={contentVariants}
                  custom={0}
                  className="text-4xl sm:text-5xl lg:text-6xl font-primary font-black text-white leading-tight uppercase tracking-tight mb-2"
                >
                  {project.title}
                </motion.h1>

                {/* Subtitle */}
                <motion.span
                  variants={contentVariants}
                  custom={1}
                  className="block text-lg sm:text-2xl text-white/70 font-medium mb-6"
                >
                  {project.projectType}
                </motion.span>

                <motion.p
                  variants={contentVariants}
                  custom={1.5}
                  className="text-sm sm:text-base text-white/60 mb-8 leading-relaxed line-clamp-3 lg:line-clamp-none"
                >
                  {project.shortDescription}
                </motion.p>

                {/* Info Center Area (Tags & Details) */}
                <motion.div
                  variants={contentVariants}
                  custom={2}
                  className="flex flex-col sm:flex-row gap-8 sm:items-center border-t border-white/10 pt-6"
                >
                  {/* Tech Stack */}
                  <div className="flex-1">
                    <div className="text-[10px] font-bold tracking-[3px] text-white/40 mb-3 uppercase">
                      Technologies
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.softwareUsed.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest text-white bg-white/5 border border-white/10 uppercase"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="hidden sm:block w-px h-[60px] bg-white/10" />

                  {/* Year Display */}
                  <div className="flex flex-col items-start sm:items-center justify-center shrink-0">
                    <div className="relative w-[60px] h-[60px] mb-2 flex items-center justify-center">
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
                          strokeWidth="4"
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
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="text-white font-bold text-sm tracking-wider">
                        {project.year.split(" ")[0]}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold tracking-[2px] text-white/40 uppercase">
                      Timeline
                    </span>
                  </div>
                </motion.div>

                {/* Bottom Actions */}
                <motion.div
                  variants={contentVariants}
                  custom={3}
                  className="flex flex-col sm:flex-row items-center gap-4 mt-8"
                >
                  <a
                    href={project.links?.live || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full text-white font-bold text-xs tracking-widest uppercase transition-transform hover:scale-105 flex justify-center items-center shadow-lg"
                    style={{
                      background: `linear-gradient(-45deg, ${project.accentColor} 0%, #111 200%)`,
                    }}
                  >
                    View Project
                  </a>

                  {project.links?.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full text-white font-bold text-xs tracking-widest uppercase transition-transform hover:scale-105 flex justify-center items-center border border-white/20 hover:bg-white/5"
                    >
                      Source Code
                    </a>
                  )}

                  <button
                    onClick={toggleLike}
                    className="ml-auto w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <HeartIcon isActive={liked[activeIdx]} />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 4. PROJECT NAVIGATION BUTTONS (Outside the card) */}
        <div className="absolute top-[35%] lg:top-1/2 -translate-y-1/2 w-full flex justify-between px-2 lg:-mx-6 z-40 pointer-events-none">
          <button
            onClick={prevProject}
            disabled={isFirst}
            className={`pointer-events-auto w-[45px] h-[45px] lg:w-[60px] lg:h-[60px] rounded-full bg-white text-black flex items-center justify-center shadow-xl transition-all ${isFirst ? "opacity-0" : "opacity-100 hover:scale-110"}`}
          >
            <ArrowIcon className="transform rotate-180 w-5 lg:w-6" />
          </button>

          <button
            onClick={nextProject}
            disabled={isLast}
            className={`pointer-events-auto w-[45px] h-[45px] lg:w-[60px] lg:h-[60px] rounded-full bg-white text-black flex items-center justify-center shadow-xl transition-all ${isLast ? "opacity-0" : "opacity-100 hover:scale-110"}`}
          >
            <ArrowIcon className="w-5 lg:w-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Works;
