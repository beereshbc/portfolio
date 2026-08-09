import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Mail,
  MessageCircle,
  Copy,
  Check,
  GitCommitHorizontalIcon,
} from "lucide-react";
import Lanyard from "./Lanyard";
import OptionWheel from "./OptionWheel";
import { assets } from "../assets/assets.js";

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
    bg: "bg-zinc-900",
    icon: Mail,
  },
  {
    id: 2,
    name: "WhatsApp",
    value: "+91 63609 95219",
    desc: "Skip the formalities. Send a direct message for an instant connection.",
    href: "https://wa.me/916360995219",
    color: "text-[#25D366]",
    bg: "bg-[#25D366]",
    icon: MessageCircle,
  },
  {
    id: 3,
    name: "LinkedIn",
    value: "Beereshkumar B C",
    desc: "Connect with my professional network and view my career trajectory.",
    href: "https://www.linkedin.com/in/beereshkumar-b-c-004397341",
    color: "text-[#0A66C2]",
    bg: "bg-[#0A66C2]",
    icon: MessageCircle,
  },
  {
    id: 4,
    name: "GitHub",
    value: "@beereshbc",
    desc: "Explore my open-source repositories, smart contracts, and source code.",
    href: "https://github.com/beereshbc",
    color: "text-zinc-900",
    bg: "bg-zinc-900",
    icon: GitCommitHorizontalIcon,
  },
  {
    id: 5,
    name: "Twitter / X",
    value: "@BBchatrad",
    desc: "Follow my thoughts on Web3, AI integrations, and full-stack development.",
    href: "https://x.com/BBchatrad?s=08",
    color: "text-zinc-900",
    bg: "bg-zinc-900",
    icon: MessageCircle,
  },
  {
    id: 6,
    name: "Instagram",
    value: "@_mr___scarface___",
    desc: "A glimpse into my life beyond the IDE. Moments, travels, and stories.",
    href: "https://www.instagram.com/_mr___scarface___/",
    color: "text-[#E1306C]",
    bg: "bg-[#E1306C]",
    icon: MessageCircle,
  },
];


/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
const Contact = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeContact = CONTACT_LINKS[activeIndex];
  const wheelItems = useMemo(() => CONTACT_LINKS.map((link) => link.name), []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleWheelChange = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const handleCopy = useCallback((text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const ActiveIcon = activeContact.icon;

  return (
    <section
      id="contact"
      className="relative w-full bg-[#FAFAFA] py-20 sm:py-24 lg:py-32 overflow-hidden"
    >
      {/* ── GRAIN TEXTURE ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
    
      />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">


        {/* ═════════════════════════════════════════════════════════
            SPLIT LAYOUT — Auto height, no overlap
        ═════════════════════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              LEFT: OptionWheel & Dynamic Details
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6 order-2 lg:order-1">

            {/* Wheel — explicit height prevents collapse & overlap */}
            <div className="relative w-full h-[300px] sm:h-[360px] lg:h-[420px]  pt-4 overflow-hidden">
              <OptionWheel
                items={wheelItems}
                defaultSelected={0}
                onChange={handleWheelChange}
                textColor="#a1a1aa"
                activeColor="#18181b"
                side="left"
                fontSize={isMobile ? 2.4 : 3.2}
                spacing={1.35}
                curve={1}
                tilt={6}
                blur={2}
                fade={0.28}
                minOpacity={0.04}
                smoothing={200}
                inset={isMobile ? 16 : 56}
                loop={false}
                draggable={true}
              />
            </div>

            {/* Selected Item Details Panel */}
            <div className="w-full backdrop-blur-md rounded-2xl border border-black/5 px-5 sm:px-6 py-5 sm:py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeContact.id}
                  initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex flex-col gap-3 sm:gap-4"
                >
                  {/* Header Row: ID + Icon */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                      (0{activeContact.id}) / {activeContact.name}
                    </span>
                    <div className={`p-2 rounded-full bg-zinc-100 ${activeContact.color}`}>
                      <ActiveIcon size={16} strokeWidth={2} />
                    </div>
                  </div>

                  {/* Value with Copy */}
                  <div className="flex items-center gap-3">
                    <a
                      href={activeContact.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`font-mono text-sm sm:text-base font-bold uppercase tracking-widest hover:underline underline-offset-4 decoration-1 ${activeContact.color} transition-all`}
                    >
                      {activeContact.value}
                    </a>

                    {(activeContact.name === "Email" || activeContact.name === "WhatsApp") && (
                      <button
                        onClick={() => handleCopy(activeContact.value)}
                        className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    )}
                  </div>

                  {/* Description */}
                  <p className="font-sans text-sm text-zinc-500 max-w-sm leading-relaxed">
                    {activeContact.desc}
                  </p>

                  {/* CTA Button */}
                  <a
                    href={activeContact.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group/btn flex items-center gap-2 w-fit mt-1 border border-black/10 rounded-full px-5 py-2.5 hover:bg-themeBlack hover:border-themeBlack transition-all duration-300 active:scale-95"
                  >
                    <span className="font-mono text-[11px] sm:text-xs font-bold uppercase text-zinc-800 group-hover/btn:text-[#FAFAFA] transition-colors">
                      Connect via {activeContact.name}
                    </span>
                    <ArrowUpRight
                      size={15}
                      className="text-zinc-800 group-hover/btn:text-[#FAFAFA] transition-colors"
                    />
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              RIGHT: 3D Lanyard Interactive
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="w-full lg:w-1/2 h-[420px] sm:h-[520px] lg:h-auto lg:min-h-[560px] relative order-1 lg:order-2 rounded-2xl overflow-hidden  touch-none">
            <Lanyard
              position={[0, 0, isMobile ? 26 : 20]}
              gravity={[0, -40, 0]}
              fov={20}
              transparent={true}
              lanyardWidth={1}
              position={[0, 0, isMobile ? 26 : 20]}
              frontImage={assets.footerImage}   
              backImage={assets.footerImage}    
              imageFit="cover"
            />

            {/* Vignette for depth */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.03)] rounded-2xl" />

            {/* Mobile drag hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 lg:hidden pointer-events-none">
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 bg-white/70 backdrop-blur-md px-3 py-1 rounded-full">
                Drag the card
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;