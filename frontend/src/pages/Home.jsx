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
  // Parallax refs attached to each incoming section
  const meRef = useRef(null);
  const worksRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);

  // ── SCROLL PROGRESS TRACKERS ──
  // These track exactly when a section starts sliding up from the bottom of the screen
  // until it reaches the top, allowing us to perfectly animate the section *underneath* it.

  const { scrollYProgress: meProgress } = useScroll({
    target: meRef,
    offset: ["start end", "start start"],
  });

  const { scrollYProgress: worksProgress } = useScroll({
    target: worksRef,
    offset: ["start end", "start start"],
  });

  const { scrollYProgress: skillsProgress } = useScroll({
    target: skillsRef,
    offset: ["start end", "start start"],
  });

  const { scrollYProgress: contactProgress } = useScroll({
    target: contactRef,
    offset: ["start end", "start start"],
  });

  // ── PARALLAX TRANSFORMS (Scale Down & Darken) ──
  // As the new section slides over, the old section scales to 0.9 and dims for realistic 3D depth

  const heroScale = useTransform(meProgress, [0, 1], [1, 0.9]);
  const heroBrightness = useTransform(meProgress, [0, 1], [1, 0.5]);

  const meScale = useTransform(worksProgress, [0, 1], [1, 0.9]);
  const meBrightness = useTransform(worksProgress, [0, 1], [1, 0.5]);

  const worksScale = useTransform(skillsProgress, [0, 1], [1, 0.9]);
  const worksBrightness = useTransform(skillsProgress, [0, 1], [1, 0.5]);

  const skillsScale = useTransform(contactProgress, [0, 1], [1, 0.9]);
  const skillsBrightness = useTransform(contactProgress, [0, 1], [1, 0.5]);

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
      <div className="relative bg-background text-themeBlack selection:bg-accent selection:text-white min-h-screen overflow-x-hidden">
        <Navbar />

        {/* The main wrapper allows native sticky stacking */}
        <main className="relative w-full flex flex-col">
          {/* ── 1. HERO LAYER ── */}
          <motion.div
            style={{
              scale: heroScale,
              filter: useTransform(heroBrightness, (b) => `brightness(${b})`),
            }}
            className="sticky top-0 w-full h-[100dvh] z-[10] overflow-hidden bg-background origin-top will-change-transform"
          >
            <Hero />
          </motion.div>

          {/* ── 2. ME LAYER ── */}
          <motion.div
            ref={meRef}
            style={{
              scale: meScale,
              filter: useTransform(meBrightness, (b) => `brightness(${b})`),
            }}
            className="sticky top-0 w-full h-[100dvh] z-[20] overflow-hidden rounded-t-[2.5rem] md:rounded-t-[4rem] bg-background origin-top shadow-[0_-20px_50px_rgba(0,0,0,0.08)] border-t border-black/5 will-change-transform"
          >
            <Me />
          </motion.div>

          {/* ── 3. WORKS LAYER ── */}
          <motion.div
            ref={worksRef}
            style={{
              scale: worksScale,
              filter: useTransform(worksBrightness, (b) => `brightness(${b})`),
            }}
            className="sticky top-0 w-full h-full z-[30] overflow-hidden rounded-t-[2.5rem] md:rounded-t-[4rem] bg-background origin-top shadow-[0_-20px_50px_rgba(0,0,0,0.08)] border-t border-black/5 will-change-transform"
          >
            <Works />
          </motion.div>

          {/* ── 4. SKILLS LAYER ── */}
          <motion.div
            ref={skillsRef}
            style={{
              scale: skillsScale,
              filter: useTransform(skillsBrightness, (b) => `brightness(${b})`),
            }}
            className="sticky top-0 w-full h-full z-[40] overflow-hidden rounded-t-[2.5rem] md:rounded-t-[4rem] bg-background origin-top shadow-[0_-20px_50px_rgba(0,0,0,0.08)] border-t border-black/5 will-change-transform"
          >
            <Skills />
          </motion.div>

          {/* ── 5. CONTACT LAYER ── */}
          {/* Contact does not need to scale down because it is the final main section */}
          <motion.div
            ref={contactRef}
            className="sticky top-0 w-full h-full z-[50] overflow-hidden rounded-t-[2.5rem] md:rounded-t-[4rem] bg-background origin-top shadow-[0_-20px_50px_rgba(0,0,0,0.08)] border-t border-black/5 will-change-transform"
          >
            <Contact />
          </motion.div>
        </main>

        {/* ── FOOTER ── */}
        {/* Slides natively over the Contact section at the very end of the scroll */}
        <div className="relative z-[60] w-full h-full bg-background rounded-t-[2.5rem] md:rounded-t-[4rem] shadow-[0_-20px_50px_rgba(0,0,0,0.05)] border-t border-black/5">
          <Footer />
        </div>
      </div>
    </ReactLenis>
  );
};

export default Home;
