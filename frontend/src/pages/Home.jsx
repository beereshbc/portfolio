import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ReactLenis } from "lenis/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Me from "../components/Me";
import Works from "../components/Works";
import Skills from "../components/Skills";
import Contact from "../components/Contact";

const Home = () => {
  // Parallax refs for each section
  const heroRef = useRef(null);
  const meRef = useRef(null);
  const worksRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);

  // Scroll Progress Trackers with enhanced offsets
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const { scrollYProgress: meProgress } = useScroll({
    target: meRef,
    offset: ["start center", "end start"],
  });

  const { scrollYProgress: worksProgress } = useScroll({
    target: worksRef,
    offset: ["start center", "end start"],
  });

  const { scrollYProgress: skillsProgress } = useScroll({
    target: skillsRef,
    offset: ["start center", "end start"],
  });

  const { scrollYProgress: contactProgress } = useScroll({
    target: contactRef,
    offset: ["start center", "end start"],
  });

  // Enhanced Parallax Transforms with smooth easing
  const heroY = useTransform(heroProgress, [0, 1], ["0vh", "35vh"]);
  const heroOpacity = useTransform(heroProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.93]);

  const meY = useTransform(meProgress, [0, 1], ["50px", "-30vh"]);
  const meOpacity = useTransform(meProgress, [0, 1], [0, 1]);
  const meScale = useTransform(meProgress, [0, 1], [0.95, 1]);

  const worksY = useTransform(worksProgress, [0, 1], ["50px", "-25vh"]);
  const worksOpacity = useTransform(worksProgress, [0, 1], [0, 1]);
  const worksScale = useTransform(worksProgress, [0, 1], [0.95, 1]);

  const skillsY = useTransform(skillsProgress, [0, 1], ["50px", "-20vh"]);
  const skillsOpacity = useTransform(skillsProgress, [0, 1], [0, 1]);
  const skillsScale = useTransform(skillsProgress, [0, 1], [0.95, 1]);

  const contactY = useTransform(contactProgress, [0, 1], ["50px", "-15vh"]);
  const contactOpacity = useTransform(contactProgress, [0, 1], [0, 1]);
  const contactScale = useTransform(contactProgress, [0, 1], [0.95, 1]);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.5,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      }}
    >
      <div className="relative bg-background text-textPrimary selection:bg-accent selection:text-white min-h-screen overflow-x-hidden">
        <Navbar />

        <main className="relative w-full flex flex-col">
          {/* ── 1. HERO LAYER ── */}
          <div
            ref={heroRef}
            className="relative w-full h-[100vh]"
          >
            <motion.div
              style={{
                y: heroY,
                opacity: heroOpacity,
                scale: heroScale,
                willChange: "transform, opacity",
              }}
              className="sticky top-0 w-full h-screen z-[1] overflow-hidden bg-background gpu-accelerate"
            >
              <Hero />
            </motion.div>
          </div>

          {/* ── 2. ME LAYER ── */}
          <div
            ref={meRef}
            className="relative w-full h-[100vh] z-[2]"
          >
            <motion.div
              style={{
                y: meY,
                opacity: meOpacity,
                scale: meScale,
                willChange: "transform, opacity",
              }}
              className="sticky top-0 w-full h-screen z-[2] overflow-hidden rounded-t-[2.5rem] md:rounded-t-[4rem] bg-background gpu-accelerate"
            >
              <Me />
            </motion.div>
          </div>

          {/* ── 3. WORKS LAYER ── */}
          <div
            ref={worksRef}
            className="relative w-full h-[100vh] z-[3]"
          >
            <motion.div
              style={{
                y: worksY,
                opacity: worksOpacity,
                scale: worksScale,
                willChange: "transform, opacity",
              }}
              className="sticky top-0 w-full h-screen z-[3] overflow-hidden rounded-t-[2.5rem] md:rounded-t-[4rem] bg-background gpu-accelerate"
            >
              <Works />
            </motion.div>
          </div>

          {/* ── 4. SKILLS LAYER ── */}
          <div
            ref={skillsRef}
            className="relative w-full h-[100vh] z-[4]"
          >
            <motion.div
              style={{
                y: skillsY,
                opacity: skillsOpacity,
                scale: skillsScale,
                willChange: "transform, opacity",
              }}
              className="sticky top-0 w-full h-screen z-[4] overflow-hidden rounded-t-[2.5rem] md:rounded-t-[4rem] bg-background gpu-accelerate"
            >
              <Skills />
            </motion.div>
          </div>

          {/* ── 5. CONTACT LAYER ── */}
          <div
            ref={contactRef}
            className="relative w-full h-auto z-[5]"
          >
            <motion.div
              style={{
                y: contactY,
                opacity: contactOpacity,
                scale: contactScale,
                willChange: "transform, opacity",
              }}
              className="w-full bg-background rounded-t-[2.5rem] md:rounded-t-[4rem] overflow-hidden gpu-accelerate"
            >
              <Contact />
            </motion.div>
          </div>
        </main>

        {/* ── FOOTER ── */}
        <div className="relative z-20 w-full bg-background">
          <Footer />
        </div>
      </div>
    </ReactLenis>
  );
};

export default Home;
