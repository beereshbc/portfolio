// Contact.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowUpRight,
  Mail,
  MessageCircle,
  Copy,
  Check,
  GitCommitHorizontal,
  Phone,
  MapPin,
  Sparkles,
  Zap,
} from "lucide-react";
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
    icon: GitCommitHorizontal,
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
   SOUND ENGINE (Tick/Click Feedback)
───────────────────────────────────────────────────────────────── */
const useTickSound = () => {
  const audioCtxRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playTick = useCallback((type = 'tick') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      if (type === 'tick') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      }
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {}
  }, [soundEnabled]);

  return { playTick, soundEnabled, setSoundEnabled };
};

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
const Contact = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);
  const { playTick, soundEnabled, setSoundEnabled } = useTickSound();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  const activeContact = CONTACT_LINKS[activeIndex];
  const wheelItems = useMemo(() => CONTACT_LINKS.map((link) => link.name), []);

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

  const handleWheelChange = useCallback((index) => {
    setActiveIndex(index);
    playTick('tick');
  }, [playTick]);

  const handleCopy = useCallback((text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      playTick('success');
      setTimeout(() => setCopied(false), 2000);
    });
  }, [playTick]);

  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  };

  const ActiveIcon = activeContact.icon;

  return (
    <section
      id="contact"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen bg-[#FAFAFA] text-zinc-900 overflow-hidden flex flex-col"
    >
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), 
                           linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Mouse Follow Glow */}
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{
          left: springX,
          top: springY,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-96 h-96 rounded-full bg-zinc-900/5 blur-3xl" />
      </motion.div>

      {/* Sound Toggle */}
      <button
        onClick={() => {
          setSoundEnabled(!soundEnabled);
          if (soundEnabled) playTick('click');
        }}
        className="absolute top-6 right-6 z-20 p-3 rounded-full bg-white shadow-lg hover:bg-zinc-50 transition-colors border border-zinc-200"
        title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
      >
        {soundEnabled ? <Zap size={16} className="text-zinc-600" /> : <Zap size={16} className="text-zinc-300" />}
      </button>

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
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-zinc-900 font-bold">
              Get In Touch
            </span>
          </div>
          <h2 className="font-clash font-black text-[48px] sm:text-[72px] md:text-[96px] text-zinc-900 leading-[0.85] tracking-tighter uppercase">
            Let's Connect<span className="text-zinc-400">.</span>
          </h2>
          <p className="text-zinc-500 font-primary text-sm md:text-base max-w-md mt-4 leading-relaxed">
            Choose your preferred channel. I'm always open to new opportunities and collaborations.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-stretch">
          
          {/* Left: OptionWheel & Details */}
          <div className="flex flex-col gap-6 justify-center">
            
            {/* Option Wheel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full h-[280px] sm:h-[340px] lg:h-[300px]"
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
                loop={false}
                draggable={true}
              />
            </motion.div>


          </div>

               {/* Details Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full bg-white rounded-3xl border border-zinc-100 px-6 sm:px-8 py-6 sm:py-8 shadow-xl"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeContact.id}
                  initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex flex-col gap-4"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                      (0{activeContact.id}) / {activeContact.name}
                    </span>
                    <div className={`p-2.5 rounded-xl bg-zinc-50 ${activeContact.color}`}>
                      <ActiveIcon size={18} strokeWidth={2} />
                    </div>
                  </div>

                  {/* Value with Copy */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <a
                      href={activeContact.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`font-mono text-base sm:text-lg font-bold uppercase tracking-widest hover:underline underline-offset-4 decoration-2 ${activeContact.color} transition-all`}
                    >
                      {activeContact.value}
                    </a>

                    {(activeContact.name === "Email" || activeContact.name === "WhatsApp") && (
                      <button
                        onClick={() => handleCopy(activeContact.value)}
                        className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-all active:scale-90"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    )}
                  </div>

                  {/* Description */}
                  <p className="font-primary text-sm text-zinc-500 max-w-sm leading-relaxed">
                    {activeContact.desc}
                  </p>

                  {/* CTA Button */}
                  <a
                    href={activeContact.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => playTick('click')}
                    className="group/btn flex items-center gap-2 w-fit mt-2 bg-zinc-900 rounded-full px-6 py-3 hover:bg-zinc-700 transition-all duration-300 active:scale-95"
                  >
                    <span className="font-primary text-xs font-bold uppercase text-white tracking-wider">
                      Connect via {activeContact.name}
                    </span>
                    <ArrowUpRight
                      size={15}
                      className="text-white group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
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
            <span className="text-xs font-primary font-semibold uppercase tracking-wider">
              Davanagere, Karnataka, India
            </span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <Phone size={14} />
            <span className="text-xs font-primary font-semibold uppercase tracking-wider">
              Available for freelance & full-time
            </span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <Sparkles size={14} />
            <span className="text-xs font-primary font-semibold uppercase tracking-wider">
              Response within 24 hours
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;