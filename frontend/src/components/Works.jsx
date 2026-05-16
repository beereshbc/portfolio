import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";

// ── IMPORT DATA FROM ASSETS ──
import { worksData } from "../assets/assets";

// ── CUSTOM INLINE ICONS ──
const GithubIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.48-1.54 6.48-7.89a5.07 5.07 0 0 0-1.38-3.5 4.7 4.7 0 0 0-.13-3.4s-1.1-.35-3.5 1.3a11.6 11.6 0 0 0-6.3 0c-2.4-1.65-3.5-1.3-3.5-1.3a4.7 4.7 0 0 0-.13 3.4 5.07 5.07 0 0 0-1.38 3.5c0 6.35 3.34 7.54 6.48 7.89a4.8 4.8 0 0 0-1 3.02V22" />
    <path d="M9 20.5 3 16" />
  </svg>
);

const ExternalLinkIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const ArrowRight = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const ArrowLeft = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const CloseIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

// ── ADVANCED TEXT REVEAL COMPONENT ──
const AnimatedText = ({ text, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.015, delayChildren: 0.1 },
    },
  };
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
    hidden: {
      opacity: 0,
      y: 15,
      filter: "blur(4px)",
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
  };

  return (
    <motion.p
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          key={index}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
};

// ── 3-LINE TOOLS MARQUEE ──
const TechMarquee = ({ tools }) => {
  const belt = [...tools, ...tools, ...tools, ...tools, ...tools, ...tools];
  return (
    <div className="relative w-full py-6 overflow-hidden flex flex-col gap-3">
      <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div className="flex w-max animate-marquee-left gap-3">
        {belt.map((tool, i) => (
          <span
            key={i}
            className="font-mono text-themeBlack/80 font-bold text-[10px] sm:text-xs px-5 py-2.5 rounded-full border border-black/10 bg-white shadow-sm whitespace-nowrap"
          >
            {tool}
          </span>
        ))}
      </div>
      <div className="flex w-max animate-marquee-right gap-3 ml-[-100px]">
        {belt.map((tool, i) => (
          <span
            key={i}
            className="font-mono text-white font-bold text-[10px] sm:text-xs px-5 py-2.5 rounded-full border border-themeBrown bg-themeBrown shadow-md whitespace-nowrap"
          >
            {tool}
          </span>
        ))}
      </div>
      <div className="flex w-max animate-marquee-left gap-3 ml-[-50px]">
        {belt.map((tool, i) => (
          <span
            key={i}
            className="font-mono text-themeBlack/80 font-bold text-[10px] sm:text-xs px-5 py-2.5 rounded-full border border-black/10 bg-white shadow-sm whitespace-nowrap"
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
};

// ── DENSE CATALOG GRID (For Images inside Modal) ──
const ProjectGalleryGrid = ({ images, title }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="mt-20 w-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-1.5 bg-themeBrown rounded-full" />
        <h5 className="font-primary text-themeBlack/50 text-[10px] uppercase tracking-[0.2em] font-bold">
          Visual Catalog
        </h5>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] md:auto-rows-[300px] grid-flow-dense gap-4 sm:gap-6">
        {images.map((img, i) => {
          // Algorithmic spanning for dense bento layout
          const isLarge = i % 4 === 0;
          const isWide = i % 3 === 0 && !isLarge;
          const spanClasses = isLarge
            ? "col-span-1 sm:col-span-2 row-span-1 md:row-span-2"
            : isWide
              ? "col-span-1 sm:col-span-2 row-span-1"
              : "col-span-1 row-span-1";

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`${spanClasses} relative rounded-[1.5rem] overflow-hidden group border border-black/5 bg-white shadow-sm`}
            >
              <img
                src={img}
                alt={`${title} screenshot ${i}`}
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />

              {/* Hover Overlay & Caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-full p-6 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex flex-col gap-1">
                <span className="font-secondary text-themeBrown text-[9px] uppercase font-bold tracking-[0.2em]">
                  Artifact 0{i + 1}
                </span>
                <h3 className="font-primary font-black text-white text-xl sm:text-2xl uppercase tracking-tight">
                  {title}
                </h3>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ── PORTAL FULL SCREEN MODAL ──
const FullScreenProjectModal = ({ project, onClose, onNext, onPrev }) => {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacityImage = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  useEffect(() => {
    setMounted(true);
    // Lock background scroll when modal opens
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!mounted) return null;

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      // Fixed absolute overlay with 30px margins on desktop, blurred backdrop
      className="fixed inset-0 z-[99999] bg-themeBlack/30 backdrop-blur-xl flex items-center justify-center p-0 sm:p-[20px] md:p-[30px]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative w-full h-full bg-background sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-white/20"
      >
        {/* Top Navbar */}
        <div className="absolute top-0 left-0 w-full z-50 flex justify-between items-center px-4 sm:px-8 py-5 bg-gradient-to-b from-background via-background/90 to-transparent pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-3">
            <span className="font-primary font-bold text-themeBlack tracking-[0.2em] text-[9px] sm:text-[10px] uppercase bg-white/60 px-4 py-2 rounded-full border border-black/10 backdrop-blur-md shadow-sm hidden sm:block">
              Case Study
            </span>
            <div className="flex gap-2">
              <button
                onClick={onPrev}
                className="w-10 h-10 rounded-full border border-black/10 bg-white/80 backdrop-blur-md flex items-center justify-center text-themeBlack hover:bg-themeBrown hover:text-white hover:border-themeBrown transition-all shadow-sm"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={onNext}
                className="w-10 h-10 rounded-full border border-black/10 bg-white/80 backdrop-blur-md flex items-center justify-center text-themeBlack hover:bg-themeBrown hover:text-white hover:border-themeBrown transition-all shadow-sm"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="pointer-events-auto flex items-center gap-3 px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-full border border-black/10 text-themeBlack hover:bg-themeBrown hover:text-white transition-all shadow-sm group"
          >
            <span className="font-primary font-bold text-[10px] uppercase tracking-[0.2em] hidden sm:block">
              Close
            </span>
            <motion.div
              group-hover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <CloseIcon size={18} />
            </motion.div>
          </button>
        </div>

        {/* Scrollable Content */}
        {/* Crucial Fix: onWheel stops Lenis from hijacking the scroll */}
        <div
          ref={containerRef}
          className="overflow-y-auto w-full h-full hide-scrollbar overscroll-contain pointer-events-auto"
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={project.id}
              initial={{ opacity: 0, filter: "blur(5px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(5px)" }}
              transition={{ duration: 0.4 }}
            >
              {/* Hero Image */}
              <div className="relative w-full h-[55vh] md:h-[70vh] overflow-hidden bg-white shrink-0 border-b border-black/5">
                <motion.img
                  style={{
                    y: yImage,
                    scale: scaleImage,
                    opacity: opacityImage,
                  }}
                  src={project.images[0]}
                  alt={project.title}
                  className="w-full h-full object-cover origin-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
              </div>

              <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 sm:px-10 pb-20 -mt-20 md:-mt-32">
                {/* Main Info Card */}
                <div className="bg-white/80 backdrop-blur-3xl border border-black/5 rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-10 md:p-14 shadow-[0_20px_80px_rgba(0,0,0,0.06)]">
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-12 sm:mb-16">
                    <div className="flex flex-col">
                      <h4 className="font-secondary text-themeBrown font-bold text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                        <div className="w-2 h-2 bg-themeBrown rounded-full animate-pulse" />{" "}
                        {project.projectType}
                      </h4>
                      <h3 className="font-humane font-black text-6xl sm:text-8xl md:text-[110px] text-themeBlack uppercase tracking-tighter leading-[0.85]">
                        {project.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-3 shrink-0">
                      {project.links.live && (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-themeBrown text-white px-6 py-3.5 sm:px-8 sm:py-4 rounded-full font-primary font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-themeBlack hover:-translate-y-1 transition-all shadow-md"
                        >
                          Live App <ExternalLinkIcon size={16} />
                        </a>
                      )}
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-black/5 border border-black/10 text-themeBlack px-6 py-3.5 sm:px-8 sm:py-4 rounded-full font-primary font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-white hover:-translate-y-1 transition-all shadow-sm"
                        >
                          Source <GithubIcon size={16} />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="w-full h-px bg-black/10 mb-12 sm:mb-16" />

                  {/* Project Overview */}
                  <div className="w-full">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-1.5 h-1.5 bg-themeBrown rounded-full" />
                      <h5 className="font-primary text-themeBlack/50 text-[10px] uppercase tracking-[0.2em] font-bold">
                        Project Overview
                      </h5>
                    </div>
                    <AnimatedText
                      text={project.fullDescription}
                      className="font-secondary text-themeBlack/80 text-base sm:text-lg md:text-xl leading-[1.8] sm:leading-[1.9] font-medium max-w-4xl"
                    />
                  </div>
                </div>

                {/* 3-Line Tech Stack Marquee */}
                <div className="mt-16 sm:mt-20">
                  <div className="flex items-center gap-3 mb-2 px-2 sm:px-6">
                    <div className="w-1.5 h-1.5 bg-themeBrown rounded-full" />
                    <h5 className="font-primary text-themeBlack/50 text-[10px] uppercase tracking-[0.2em] font-bold">
                      Architecture Stack
                    </h5>
                  </div>
                  <TechMarquee tools={project.softwareUsed} />
                </div>

                {/* Dense Masonry Image Grid */}
                <ProjectGalleryGrid
                  images={project.images}
                  title={project.title}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );

  // Render outside standard DOM hierarchy to overlay Parallax
  return createPortal(modalContent, document.body);
};

// ── MAIN WORKS COMPONENT (Carousel) ──
const Works = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleNext = () =>
    setCurrentIndex((prev) => (prev === worksData.length - 1 ? 0 : prev + 1));
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? worksData.length - 1 : prev - 1));

  const currentProject = worksData[currentIndex];
  const progress = ((currentIndex + 1) / worksData.length) * 100;

  return (
    <>
      <section
        id="works"
        className="relative w-full h-[100dvh] bg-background overflow-hidden  rounded-t-[2.5rem] md:rounded-t-[4rem] flex flex-col items-center justify-center shadow-[0_-20px_50px_rgba(0,0,0,0.05)] z-10 pt-12 md:pt-0"
      >
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 w-full max-w-[1400px] px-5 sm:px-12 lg:px-24 h-full flex flex-col justify-center">
          {/* Header */}
          <div className="flex justify-between items-end mb-6 sm:mb-12 shrink-0">
            <div>
              <div className="flex items-center gap-3 mb-1 sm:mb-2">
                <div className="h-px w-6 sm:w-8 bg-themeBrown" />
                <span className="font-geist text-[8px] sm:text-[10px] uppercase tracking-[0.5em] text-themeBrown font-bold">
                  Featured
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end gap-0 sm:gap-6 overflow-hidden">
                <h2 className="font-humane text-[5rem] leading-[0.8] sm:text-9xl md:text-[140px] text-themeBlack sm:leading-[0.8] tracking-tighter uppercase">
                  SELECTED
                </h2>
                <span className="font-season italic text-4xl sm:text-5xl md:text-7xl text-themeBrown lowercase tracking-normal pb-1 sm:pb-4 drop-shadow-sm">
                  Works.
                </span>
              </div>
            </div>
            <div className="hidden sm:flex font-mono text-themeBlack/40 text-sm tracking-widest font-bold">
              <span className="text-themeBlack">
                {String(currentIndex + 1).padStart(2, "0")}
              </span>
              <span className="mx-2">/</span>
              {String(worksData.length).padStart(2, "0")}
            </div>
          </div>

          {/* Carousel Body */}
          <div className="relative w-full flex-1 min-h-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50, filter: "blur(5px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -50, filter: "blur(5px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-16 items-center"
              >
                {/* Image Side */}
                <motion.div
                  className="w-full lg:w-3/5 h-[35vh] sm:h-[45vh] lg:h-[60vh] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden relative cursor-pointer group shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-black/5 bg-white"
                  onClick={() => setSelectedProject(currentProject)}
                >
                  <img
                    src={currentProject.images[0]}
                    alt={currentProject.title}
                    className="w-full h-full object-cover origin-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />

                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex gap-2 flex-wrap z-10 pointer-events-none">
                    {currentProject.tags.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="bg-white/90 backdrop-blur-md border border-black/10 text-themeBlack font-mono font-bold text-[8px] sm:text-[10px] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-full uppercase shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <span className="bg-themeBrown text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-primary font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(94,0,6,0.3)] flex items-center gap-3">
                      Inspect Project <ArrowRight size={14} />
                    </span>
                  </div>
                </motion.div>

                {/* Text Side */}
                <div className="w-full lg:w-2/5 flex flex-col justify-center h-full">
                  <h4 className="font-secondary text-themeBrown font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.3em] mb-2 sm:mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-themeBrown rounded-full animate-pulse" />{" "}
                    {currentProject.projectType}
                  </h4>
                  <h3 className="font-primary font-black text-3xl sm:text-4xl lg:text-6xl text-themeBlack mb-3 sm:mb-6 uppercase tracking-tight leading-[0.9]">
                    {currentProject.title}
                  </h3>
                  <p className="font-secondary text-themeBlack/60 font-medium text-xs sm:text-sm lg:text-base leading-relaxed mb-6 sm:mb-8 lg:mb-12 line-clamp-3">
                    {currentProject.shortDescription}
                  </p>
                  <button
                    onClick={() => setSelectedProject(currentProject)}
                    className="w-fit text-themeBlack px-6 py-3.5 sm:px-8 sm:py-4 rounded-full font-primary font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.2em] border border-black/10 bg-white shadow-sm hover:bg-themeBrown hover:text-white hover:border-themeBrown transition-all duration-300 group"
                  >
                    <span className="flex items-center gap-3">
                      View Case Study{" "}
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between w-full mt-4 sm:mt-8 pb-4 sm:pb-6 shrink-0">
            <div className="flex gap-3 sm:gap-4">
              <button
                onClick={handlePrev}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-black/10 bg-white flex items-center justify-center text-themeBlack hover:bg-themeBrown hover:text-white transition-all shadow-sm"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-black/10 bg-white flex items-center justify-center text-themeBlack hover:bg-themeBrown hover:text-white transition-all shadow-sm"
              >
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="flex-1 max-w-[150px] sm:max-w-[200px] ml-auto mr-0 sm:mr-6 h-[2px] bg-black/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-themeBrown"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex sm:hidden font-mono font-bold text-themeBlack/40 text-[10px] tracking-widest ml-3">
              <span className="text-themeBlack">
                {String(currentIndex + 1).padStart(2, "0")}
              </span>
              <span className="mx-1">/</span>
              {String(worksData.length).padStart(2, "0")}
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <FullScreenProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </AnimatePresence>

      <style
        dangerouslySetInlineStyle={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marquee-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .animate-marquee-left { animation: marquee-left 35s linear infinite; }
        .animate-marquee-right { animation: marquee-right 35s linear infinite; }
      `,
        }}
      />
    </>
  );
};

export default Works;
