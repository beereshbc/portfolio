import React from "react";
import { ReactLenis } from "lenis/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Me from "../components/Me";
import Works from "../components/Works";
import Skills from "../components/Skills";
import Contact from "../components/Contact";

const Home = () => {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.07,
        duration: 1.5,
        smoothWheel: true,
      }}
    >
      <div className="relative bg-background text-themeBlack selection:bg-accent selection:text-white min-h-screen overflow-x-hidden">
        <Navbar />

        <main className="w-full flex flex-col">
          {/* HERO SECTION */}
          <section className="w-full h-auto min-h-[100dvh]">
            <Hero />
          </section>

          {/* ME SECTION */}
          <section className="w-full h-auto min-h-[100dvh] bg-background">
            <Me />
          </section>

          {/* WORKS SECTION */}
          <section className="w-full h-auto min-h-[100dvh] bg-background">
            <Works />
          </section>

          {/* SKILLS SECTION */}
          <section className="w-full h-auto min-h-[100dvh] bg-background">
            <Skills />
          </section>

          {/* CONTACT SECTION */}
          <section className="w-full h-auto bg-background">
            <Contact />
          </section>
        </main>

        {/* FOOTER */}
        <footer className="w-full bg-background">
          <Footer />
        </footer>
      </div>
    </ReactLenis>
  );
};

export default Home;
