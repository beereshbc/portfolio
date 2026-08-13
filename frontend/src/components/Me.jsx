import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import {
  User,
  GraduationCap,
  Target,
  Rocket,
  BrainCircuit,
  Compass,
} from "lucide-react";

/* ─────────────────────────── THEME CONSTANTS ─────────────────────────── */
const MOBILE_BREAKPOINT = 768;

/* ─────────────────────────── BENTO DATA (Light Theme) ─────────────────────────── */
const BENTO_ITEMS = [
  {
    id: "identity",
    title: "Identity & Focus",
    description:
      "Pre-Final year CS Engineering student at GMIT. Crafting scalable architectures, full-stack applications, and decentralized Web3 systems.",
    icon: User,
    bgColor: "#F5F5F5",
    span: "md:col-span-1 md:row-span-2",
    textColor: "#18181B",
    descColor: "#52525B",
    iconColor: "#A1A1AA",
  },
  {
    id: "education",
    title: "Academic Journey",
    description:
      "Pursuing B.E. in Computer Science & Engineering. Expected graduation in Jan 2027. Building a strong foundation in Data Structures, Algorithms, and Object-Oriented Design.",
    icon: GraduationCap,
    bgColor: "#FAFAFA",
    span: "md:col-span-2 md:row-span-1",
    textColor: "#18181B",
    descColor: "#52525B",
    iconColor: "#A1A1AA",
  },
  {
    id: "goals",
    title: "CGPA Score",
    description: "Maintaining an academic score of 8.6 / 10.",
    icon: Target,
    bgColor: "#F5F5F5",
    span: "md:col-span-1 md:row-span-1",
    textColor: "#18181B",
    descColor: "#52525B",
    iconColor: "#A1A1AA",
  },
  {
    id: "projects",
    title: "Deployments",
    description: "40+ MERN Projects & 10+ Live systems deployed.",
    icon: Rocket,
    bgColor: "#FAFAFA",
    span: "md:col-span-1 md:row-span-1",
    textColor: "#18181B",
    descColor: "#52525B",
    iconColor: "#A1A1AA",
  },
  {
    id: "philosophy",
    title: "Development Philosophy",
    description:
      "Bridging heavy-duty backend logic with immersive front-end experiences. Code is the closest thing we have to magic, and I build systems that feel inherently human and highly scalable.",
    icon: BrainCircuit,
    bgColor: "#F5F5F5",
    span: "md:col-span-2 md:row-span-1",
    textColor: "#18181B",
    descColor: "#52525B",
    iconColor: "#A1A1AA",
  },
  {
    id: "interests",
    title: "Beyond the IDE",
    description:
      "Reading tech & fiction, analyzing cinema, tracking global tech news, and building open-source tools.",
    icon: Compass,
    bgColor: "#FAFAFA",
    span: "md:col-span-1 md:row-span-1",
    textColor: "#18181B",
    descColor: "#52525B",
    iconColor: "#A1A1AA",
  },
];

/* ─────────────────────────── TEXT LOOP COMPONENT ─────────────────────────── */
const TextLoop = ({ 
  text = "Creative Developer ✦ Full Stack ✦ Web3 ✦", 
  speed = 50,
  fontSize = 64,
  className = "" 
}) => {
  const [offset, setOffset] = useState(0);
  const textRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let animationFrame;
    let startTime;
    const duration = 20000 / (speed / 50);
    const textWidth = textRef.current?.scrollWidth / 2 || 1000;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = ((timestamp - startTime) % duration) / duration;
      setOffset(-progress * textWidth);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [speed]);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden whitespace-nowrap ${className}`}
    >
      <motion.div
        ref={textRef}
        className="inline-block w-full font-clash font-black uppercase tracking-tight"
        style={{ 
          fontSize: `${fontSize}px`,
          transform: `translateX(${offset}px)`,
          color: '#18181B',
        }}
      >
        <span className="inline-block pr-8">{text}</span>
        <span className="inline-block pr-8">{text}</span>
        <span className="inline-block pr-8">{text}</span>
        <span className="inline-block pr-8">{text}</span>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────── BORDER GLOW CARD ─────────────────────────── */
const BorderGlowCard = ({
  children,
  className = "",
  borderRadius = 24,
  glowColor = "40 80 80",
  backgroundColor = "#FFFFFF",
  glowIntensity = 0.6,
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorAngle, setCursorAngle] = useState(45);
  const [edgeProximity, setEdgeProximity] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  const handlePointerMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);
    
    // Calculate edge proximity
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    setEdgeProximity(Math.min(Math.max(1 / Math.min(kx, ky), 0), 1));
    
    // Calculate cursor angle
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    setCursorAngle(degrees);
  };

  const borderOpacity = isHovered ? Math.max(0, (edgeProximity * 100 - 30) / 70) : 0;
  const glowOpacity = isHovered ? Math.max(0, (edgeProximity * 100 - 50) / 50) : 0;

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: backgroundColor,
        borderRadius: `${borderRadius}px`,
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.06)'
          : '0 4px 12px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.3s ease',
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Border glow effect */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at ${springX}px ${springY}px, 
              rgba(24, 24, 27, ${glowOpacity * 0.15}) 0%,
              transparent 70%)
          `,
          opacity: borderOpacity,
        }}
      />
      
      {/* Edge highlight */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          background: `
            conic-gradient(from ${cursorAngle}deg at 50% 50%, 
              transparent 0deg,
              rgba(24, 24, 27, ${glowOpacity * 0.3}) ${edgeProximity * 20}deg,
              transparent ${edgeProximity * 40}deg,
              rgba(24, 24, 27, ${glowOpacity * 0.3}) ${360 - edgeProximity * 40}deg,
              transparent 360deg)
          `,
          opacity: borderOpacity,
          mixBlendMode: 'multiply',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

/* ─────────────────────────── MOBILE DETECTION ─────────────────────────── */
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

/* ─────────────────────────── MAIN COMPONENT ─────────────────────────── */
const Me = () => {
  const isMobile = useMobileDetection();
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="me"
      ref={sectionRef}
      className="relative w-full min-h-[100dvh] bg-[#ffffff] text-zinc-900 flex flex-col items-center pt-16 pb-20 px-5 sm:px-12 lg:px-24 overflow-hidden z-20"
    >
          {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), 
                           linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Text Loop on top */}
      <div className="w-full mb-16 sm:mb-20 overflow-hidden">
        <TextLoop 
          text="Creative Developer ✦ Full Stack ✦ Web3 ✦ " 
          speed={50}
          fontSize={isMobile ? 48 : 80}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col mb-12 sm:mb-16"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 md:w-12 bg-zinc-900" />
            <span className="font-primary text-[10px] sm:text-xs uppercase tracking-[0.4em] text-zinc-900 font-bold">
              Behind the Code
            </span>
          </div>

          <h2 className="font-clash font-black text-[50px] sm:text-[70px] md:text-[90px] text-zinc-900 leading-[0.9] tracking-tighter uppercase">
            The Architect.
          </h2>
        </motion.div>

        {/* Bento Grid with Border Glow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 auto-rows-[minmax(220px,auto)]">
          {BENTO_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut" 
                }}
                className={item.span}
              >
                <BorderGlowCard
                  className={`h-full group ${item.span}`}
                  backgroundColor={item.bgColor}
                  borderRadius={24}
                  glowIntensity={0.6}
                >
                  <div className="relative z-10 flex flex-col h-full p-8 sm:p-10">
                    <h3
                      className={`font-clash text-2xl sm:text-3xl font-bold ${item.textColor} mb-3 tracking-wide`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`font-primary text-sm sm:text-base ${item.descColor} leading-relaxed max-w-[90%]`}
                    >
                      {item.description}
                    </p>
                  </div>

                  {/* Decorative Icon */}
                  <div
                    className={`absolute -bottom-4 -right-4 md:bottom-2 md:right-4 opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500 ${item.iconColor}`}
                  >
                    <Icon size={item.id === "identity" ? 80 : item.id === "philosophy" ? 90 : item.id === "education" ? 70 : item.id === "interests" ? 60 : 50} 
                      strokeWidth={1} 
                    />
                  </div>
                </BorderGlowCard>
              </motion.div>
            );
          })}
        </div>
      </div>

    </section>
  );
};

export default Me;