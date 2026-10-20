// Contact.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Copy, Check, MapPin, Sparkles, Globe } from "lucide-react";
import OptionWheel from "./OptionWheel";

/* ─────────────────────────────────────────────────────────────────
   BRAND ICONS
───────────────────────────────────────────────────────────────── */
const IconMail = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const IconWhatsApp = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const IconLinkedIn = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const IconGitHub = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const IconX = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const IconInstagram = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const IconPortfolio = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────
   CONTACT DATA
───────────────────────────────────────────────────────────────── */
const CONTACT_LINKS = [
  {
    id: 1,
    name: "Portfolio",
    value: "beereshkumarbc.me",
    desc: "Explore my full body of work — case studies, live projects, and design systems.",
    href: "https://beereshkumarbc.me",
    accent: "#18181b",
    Icon: IconPortfolio,
  },
  {
    id: 2,
    name: "Email",
    value: "bcbeereshkumar@gmail.com",
    desc: "For formal inquiries, project proposals, and architectural discussions.",
    href: "mailto:bcbeereshkumar@gmail.com",
    accent: "#18181b",
    Icon: IconMail,
  },
  {
    id: 3,
    name: "WhatsApp",
    value: "+91 63609 95219",
    desc: "Skip the formalities. Send a direct message for an instant connection.",
    href: "https://wa.me/916360995219",
    accent: "#25D366",
    Icon: IconWhatsApp,
  },
  {
    id: 4,
    name: "LinkedIn",
    value: "Beereshkumar B C",
    desc: "Connect with my professional network and view my career trajectory.",
    href: "https://www.linkedin.com/in/beereshkumar-b-c-004397341",
    accent: "#0A66C2",
    Icon: IconLinkedIn,
  },
  {
    id: 5,
    name: "GitHub",
    value: "@beereshbc",
    desc: "Explore my open-source repositories, smart contracts, and source code.",
    href: "https://github.com/beereshbc",
    accent: "#18181b",
    Icon: IconGitHub,
  },
  {
    id: 6,
    name: "Twitter / X",
    value: "@BBchatrad",
    desc: "Follow my thoughts on Web3, AI integrations, and full-stack development.",
    href: "https://x.com/BBchatrad?s=08",
    accent: "#18181b",
    Icon: IconX,
  },
  {
    id: 7,
    name: "Instagram",
    value: "@_mr___scarface___",
    desc: "A glimpse into my life beyond the IDE. Moments, travels, and stories.",
    href: "https://www.instagram.com/_mr___scarface___/",
    accent: "#E1306C",
    Icon: IconInstagram,
  },
];

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
const Contact = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);
  const copyTimerRef = useRef(null);

  const activeContact = CONTACT_LINKS[activeIndex];
  const wheelItems = useMemo(() => CONTACT_LINKS.map((l) => l.name), []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => clearTimeout(copyTimerRef.current), []);

  const handleWheelChange = useCallback((index) => setActiveIndex(index), []);

  const handleCopy = useCallback((text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 1800);
    });
  }, []);

  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  };

  const { Icon: ActiveIcon, accent } = activeContact;
  const indexLabel = String(activeContact.id).padStart(2, "0");

  return (
    <section
      id="contact"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen bg-[#FAFAFA] text-zinc-900 overflow-hidden flex flex-col"
    >


      {/* Mouse Glow */}
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{ left: springX, top: springY, transform: "translate(-50%, -50%)" }}
      >
        <div className="w-[28rem] h-[28rem] rounded-full bg-zinc-900/[0.04] blur-3xl" />
      </motion.div>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 flex flex-col flex-1 py-16 sm:py-20 lg:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 lg:mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 md:w-12 bg-zinc-900" />
            <span className="font-primary text-[10px] sm:text-xs uppercase tracking-[0.4em] text-zinc-900 font-bold">
              Get In Touch
            </span>
          </div>
          <h2 className="font-clash font-black text-[48px] sm:text-[72px] md:text-[96px] text-zinc-900 leading-[0.85] tracking-tighter uppercase">
            Let's Connect<span className="text-zinc-400">.</span>
          </h2>
          <p className="font-primary text-zinc-500 text-sm md:text-base max-w-md mt-4 leading-relaxed">
            Choose your preferred channel. I'm always open to new opportunities and collaborations.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">
          {/* Left: Circular OptionWheel */}
          <div className="flex flex-col gap-6 justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full h-[320px] sm:h-[380px] lg:h-[360px]"
            >
              <OptionWheel
                items={wheelItems}
                defaultSelected={0}
                onChange={handleWheelChange}
                textColor="#a1a1aa"
                activeColor="#18181b"
                side="left"
                fontSize={isMobile ? 2.2 : 3}
                spacing={1.35}
                curve={1}
                tilt={6}
                blur={2}
                fade={0.28}
                minOpacity={0.04}
                smoothing={200}
                inset={isMobile ? 16 : 56}
                draggable
              />
            </motion.div>
          </div>

          {/* Right: Vertical free-flowing typographic detail panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full flex flex-col justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeContact.id}
                initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -24, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-6"
              >
                {/* Big typographic index */}
                <div className="flex items-start gap-4">
                  <span
                    className="font-clash font-black text-[64px] sm:text-[88px] leading-none tracking-tighter text-zinc-200 select-none"
                    aria-hidden="true"
                  >
                    {indexLabel}
                  </span>
                  <div
                    className="mt-3"
                    style={{ color: accent }}
                    aria-hidden="true"
                  >
                    <ActiveIcon size={22} />
                  </div>
                </div>

                {/* Display name */}
                <h3 className="font-clash font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight leading-[0.95] text-zinc-900 -mt-2">
                  {activeContact.name}
                </h3>

                {/* Mono value + copy */}
                <div className="flex items-center gap-3 flex-wrap">
                  <a
                    href={activeContact.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-sm sm:text-base font-semibold tracking-tight text-zinc-700 hover:text-zinc-900 hover:underline underline-offset-4 decoration-1 transition-colors break-all"
                  >
                    {activeContact.value}
                  </a>

                  {(activeContact.name === "Email" || activeContact.name === "WhatsApp") && (
                    <button
                      onClick={() => handleCopy(activeContact.value)}
                      className="p-1.5 -m-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-all active:scale-90"
                      title="Copy to clipboard"
                      aria-label="Copy to clipboard"
                    >
                      {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
                    </button>
                  )}
                </div>

                {/* Description — Epilogue body */}
                <p className="font-primary text-sm sm:text-[15px] text-zinc-500 max-w-md leading-relaxed">
                  {activeContact.desc}
                </p>

                {/* Inline CTA — text link only, no box */}
                <a
                  href={activeContact.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group/btn inline-flex items-center gap-2 w-fit mt-2 font-secondary text-xs font-bold uppercase tracking-[0.2em] text-zinc-900 hover:text-zinc-500 transition-colors"
                >
                  <span className="border-b border-zinc-900 group-hover/btn:border-zinc-500 pb-0.5 transition-colors">
                    Open {activeContact.name}
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                  />
                </a>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom Info Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2 text-zinc-400">
            <MapPin size={14} />
            <span className="font-secondary text-xs font-semibold uppercase tracking-wider">
              Davanagere, Karnataka, India
            </span>
          </div>
          <a
            href="https://beereshkumarbc.me"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors group"
          >
            <Globe size={14} />
            <span className="font-secondary text-xs font-semibold uppercase tracking-wider">
              beereshkumarbc.me
            </span>
            <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <div className="flex items-center gap-2 text-zinc-400">
            <Sparkles size={14} />
            <span className="font-secondary text-xs font-semibold uppercase tracking-wider">
              Response within 24 hours
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;