import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Twitter / X", href: "https://x.com/BBchatrad?s=08" },
    { name: "Instagram", href: "https://www.instagram.com/_mr___scarface___/" },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/beereshkumar-b-c-004397341",
    },
    { name: "GitHub", href: "https://github.com/beereshbc/" },
  ];

  return (
    <footer className="w-full pt-20 pb-8 px-4 mt-20 relative flex justify-center bg-background overflow-hidden">
      {/* --- Image Pop-out Overlay with Light Rays --- */}
      <div className="absolute top-[80px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <motion.div
          whileHover={{ y: -5, scale: 1.05 }}
          className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1.5 bg-white border border-black/5 shadow-xl"
        >
          {/* Light Rays / Glow Effect reflecting onto the card below */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[120%] h-full bg-themeBrown/20 blur-[30px] rounded-full pointer-events-none" />

          <img
            src={assets.footerImage}
            alt="Beereshkumar B C"
            className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500 relative z-10"
          />

          {/* Subtle themeBrown Glow Ring */}
          <div className="absolute inset-0 rounded-full border border-themeBrown/20 animate-pulse pointer-events-none z-20" />
        </motion.div>
      </div>

      {/* --- Compact Footer Card --- */}
      <div className="w-full max-w-5xl bg-white/60 backdrop-blur-2xl border border-black/5 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.06)] relative mt-8">
        {/* Rim Light (Top Edge Glow) */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

        <div className="flex flex-col items-center gap-8 mt-10">
          {/* Main Typography Signature */}
          <div className="flex flex-col items-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 leading-none"
            >
              <span className="font-humane text-7xl sm:text-9xl md:text-[120px] text-themeBlack tracking-tighter uppercase leading-[0.8]">
                BEERESH
              </span>
              <span className="font-season text-5xl sm:text-7xl md:text-[90px] italic text-themeBrown lowercase tracking-normal pb-2">
                Kumar.
              </span>
            </motion.h2>
            <p className="text-[10px] sm:text-xs font-geist uppercase tracking-[0.3em] text-themeBlack/50 mt-4 font-bold">
              Software Architect • Davanagere
            </p>
          </div>

          {/* Social & Portfolio Links */}
          <div className="flex flex-wrap justify-center gap-x-6 sm:gap-x-10 gap-y-4">
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative text-[10px] sm:text-xs font-geist font-bold tracking-[0.2em] uppercase text-themeBlack/60 hover:text-themeBrown transition-all duration-300 group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-themeBrown transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}
          </div>

          {/* Contact Details Row */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12 py-6 border-y border-black/5 w-full justify-center">
            <div className="flex flex-col items-center sm:items-start gap-1">
              <span className="text-[9px] font-geist text-themeBlack/40 uppercase tracking-widest font-bold">
                Phone
              </span>
              <a
                href="tel:+916360995219"
                className="text-xs font-mono font-bold text-themeBlack/80 hover:text-themeBrown transition-colors"
              >
                +91 63609 95219
              </a>
            </div>
            <div className="hidden sm:block h-8 w-px bg-black/5" />
            <div className="flex flex-col items-center sm:items-start gap-1">
              <span className="text-[9px] font-geist text-themeBlack/40 uppercase tracking-widest font-bold">
                Email
              </span>
              <a
                href="mailto:bcbeereshkumar@gmail.com"
                className="text-xs font-mono font-bold text-themeBlack/80 hover:text-themeBrown transition-colors"
              >
                bcbeereshkumar@gmail.com
              </a>
            </div>
            <div className="hidden sm:block h-8 w-px bg-black/5" />
            <div className="flex flex-col items-center sm:items-start gap-1">
              <span className="text-[9px] font-geist text-themeBlack/40 uppercase tracking-widest font-bold">
                Location
              </span>
              <span className="text-xs font-mono font-bold text-themeBlack/80">
                Karnataka, India
              </span>
            </div>
          </div>

          {/* Bottom Copyright & Tech Stack Row */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
            <p className="text-[10px] font-geist font-semibold tracking-widest uppercase text-themeBlack/40">
              &copy; {currentYear} Beereshkumar B C
            </p>

            <div className="flex items-center gap-3 sm:gap-4 text-[10px] font-geist tracking-[0.15em] uppercase text-themeBlack/60">
              <span className="font-bold">MERN Stack</span>
              <div className="w-1.5 h-1.5 rounded-full bg-themeBrown/40" />
              <span className="font-bold">Web3</span>
              <div className="w-1.5 h-1.5 rounded-full bg-themeBrown/40" />
              <span className="font-bold">AI Integrated</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
