import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   CONTACT DATA
───────────────────────────────────────────────────────────────── */
const CONTACT_LINKS = [
  {
    id: 1,
    name: "Email",
    value: "bcbeereshkumar@gmail.com",
    desc: "For formal inquiries, project proposals, and architectural discussions.",
    href: "mailto:bcbeereshkumar@gmail.com",
    color: "text-zinc-900",
  },
  {
    id: 2,
    name: "WhatsApp",
    value: "+91 63609 95219",
    desc: "Skip the formalities. Send a direct message for an instant connection.",
    href: "https://wa.me/916360995219",
    color: "text-[#25D366]",
  },
  {
    id: 3,
    name: "LinkedIn",
    value: "Beereshkumar B C",
    desc: "Connect with my professional network and view my career trajectory.",
    href: "https://www.linkedin.com/in/beereshkumar-b-c-004397341",
    color: "text-[#0A66C2]",
  },
  {
    id: 4,
    name: "GitHub",
    value: "@beereshbc",
    desc: "Explore my open-source repositories, smart contracts, and source code.",
    href: "https://github.com/beereshbc",
    color: "text-zinc-900",
  },
  {
    id: 5,
    name: "Twitter / X",
    value: "@BBchatrad",
    desc: "Follow my thoughts on Web3, AI integrations, and full-stack development.",
    href: "https://x.com/BBchatrad?s=08",
    color: "text-zinc-900",
  },
  {
    id: 6,
    name: "Instagram",
    value: "@_mr___scarface___",
    desc: "A glimpse into my life beyond the IDE. Moments, travels, and stories.",
    href: "https://www.instagram.com/_mr___scarface___/",
    color: "text-[#E1306C]",
  },
];

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
const Contact = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-swapping logic (mimicking the dynamic video feel)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % CONTACT_LINKS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isHovered]);

  const activeLink = CONTACT_LINKS[activeIdx];

  return (
    <section
      id="contact"
      className="relative w-full min-h-[100dvh]  bg-[#FAFAFA] flex flex-col pt-20 sm:pt-32 pb-16 overflow-hidden z-10 border-t border-black/5 shadow-[0_-20px_60px_rgba(0,0,0,0.05)]"
    >
      {/* ── GRAIN TEXTURE ── */}
      <div
        className="absolute inset-0 z-[0] pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-24 flex-1 flex flex-col">
        {/* ── CINEMATIC HEADER ── */}
        <div className="relative w-full flex flex-col items-center text-center mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full"
          >
            <span className="font-season italic text-6xl sm:text-8xl md:text-[140px] text-themeBrown/20 lowercase tracking-normal whitespace-nowrap select-none pointer-events-none">
              Looking for our stories
            </span>
          </motion.div>

          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative font-clash font-black text-5xl sm:text-7xl md:text-8xl text-themeBlack uppercase tracking-tighter z-10"
          >
            Initiate <br />
            <span className="text-themeBrown">Connection</span>
          </motion.h2>
        </div>

        {/* ── SPLIT LAYOUT FOR SOCIAL SWAPPING ── */}
        <div className="flex flex-col lg:flex-row w-full flex-1 gap-16 lg:gap-8">
          {/* LEFT: Dynamic Swapping Display */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center lg:sticky lg:top-40 h-auto lg:h-[500px]">
            <div className="relative h-[250px] sm:h-[300px] w-full flex flex-col justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  <h3 className="font-humane font-black text-[100px] sm:text-[140px] md:text-[180px] leading-[0.8] tracking-tighter text-themeBrown mb-4">
                    (0{activeLink.id})
                  </h3>
                  <div className="pl-2">
                    <p
                      className={`font-mono text-sm sm:text-base font-bold uppercase tracking-widest mb-3 ${activeLink.color}`}
                    >
                      {activeLink.value}
                    </p>
                    <p className="font-epilogue text-sm sm:text-base text-zinc-500 max-w-md leading-relaxed">
                      {activeLink.desc}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: Editorial Interactive List */}
          <div
            className="w-full lg:w-1/2 flex flex-col border-t border-black/10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {CONTACT_LINKS.map((link, i) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setActiveIdx(i)}
                className="group relative flex items-center justify-between w-full py-8 sm:py-10 border-b border-black/10 transition-colors hover:bg-black/[0.02] cursor-pointer overflow-hidden"
              >
                <div className="flex items-center gap-6 sm:gap-10 relative z-10 w-full pr-10">
                  <span className="font-mono text-xs sm:text-sm font-bold text-zinc-300 group-hover:text-themeBrown transition-colors duration-300">
                    (0{link.id})
                  </span>

                  <span className="font-clash text-4xl sm:text-5xl md:text-6xl font-black uppercase text-zinc-800 transition-all duration-500 ease-out transform group-hover:translate-x-4 group-hover:text-themeBrown group-hover:italic">
                    {link.name}
                  </span>
                </div>

                {/* Animated Arrow */}
                <div className="absolute right-4 overflow-hidden flex items-center justify-center">
                  <ArrowUpRight
                    size={36}
                    strokeWidth={1.5}
                    className="text-themeBrown transform translate-y-full -translate-x-full opacity-0 group-hover:translate-y-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-[0.16,1,0.3,1]"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
