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
    <div>
      <Navbar/>
      <Hero/>
      <Me/>
      <Works/>
      <Skills/>
      <Contact/>
      <Footer/>
    </div>
  );
};

export default Home;
