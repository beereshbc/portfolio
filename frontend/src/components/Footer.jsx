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
    <footer className="w-full pt-24 pb-12 px-6 relative bg-[#FAFAFA] text-themeBlack">
         <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), 
                           linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
      {/* --- Floating Portrait --- */}
      <div className="absolute -top-12 left-1/2  -translate-x-1/2 z-20">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
          className="relative w-28 h-28 z-10 rounded-full p-1 bg-[#FAFAFA] border border-black/5 shadow-xl"
        >
          <img
            src={assets.footerImage}
            alt="Beereshkumar B C"
            className="w-full h-full rounded-full object-cover"
          />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* --- Main Signature --- */}
        <div className="flex flex-col items-center mb-16 mt-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 leading-none"
          >
            <span className="font-clash text-7xl sm:text-9xl text-themeBlack tracking-tighter uppercase font-black">
              BEERESH
            </span>
            <span className="font-season text-5xl sm:text-7xl italic text-themeBrown lowercase pb-2">
              Kumar.
            </span>
          </motion.h2>
          <p className="font-epilogue text-[10px] sm:text-xs uppercase tracking-[0.4em] text-themeBlack/40 mt-6 font-bold">
            Software Architect • Davanagere, IN
          </p>
        </div>

        {/* --- Social Links Grid --- */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mb-16">
          {socialLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ color: "#d97706" }}
              className="font-epilogue text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-themeBlack/60 hover:text-themeBrown transition-colors"
            >
              {link.name}
            </motion.a>
          ))}
        </div>

        {/* --- Contact Details Row --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-10 border-y border-black/5 w-full max-w-4xl text-center">
          {[
            {
              label: "Phone",
              value: "+91 63609 95219",
              href: "tel:+916360995219",
            },
            {
              label: "Email",
              value: "bcbeereshkumar@gmail.com",
              href: "mailto:bcbeereshkumar@gmail.com",
            },
            { label: "Location", value: "Davanagere, Karnataka", href: "#" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="text-[9px] font-geist text-themeBlack/30 uppercase tracking-widest font-bold">
                {item.label}
              </span>
              <a
                href={item.href}
                className="text-xs font-mono font-bold text-themeBlack/70 hover:text-themeBrown transition-colors"
              >
                {item.value}
              </a>
            </div>
          ))}
        </div>

        {/* --- Copyright & Tech Footer --- */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-6 pt-12">
          <p className="text-[10px] font-geist font-bold tracking-widest uppercase text-themeBlack/40">
            &copy; {currentYear} Beereshkumar B C
          </p>

          <div className="flex items-center gap-4 text-[10px] font-geist tracking-[0.2em] uppercase text-themeBlack/40 font-bold">
            <span>MERN</span>
            <span className="w-1 h-1 rounded-full bg-themeBrown/30" />
            <span>Web3</span>
            <span className="w-1 h-1 rounded-full bg-themeBrown/30" />
            <span>AI Powered</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
