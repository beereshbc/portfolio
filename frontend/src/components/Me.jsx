import React from "react";
import { motion } from "framer-motion";
import {
  User,
  GraduationCap,
  Target,
  Rocket,
  BrainCircuit,
  Compass,
} from "lucide-react";

/* ─────────────────────────── ANIMATION VARIANTS ─────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ─────────────────────────── BENTO GRID DATA ─────────────────────────── */
const BENTO_ITEMS = [
  {
    id: "identity",
    title: "Identity & Focus",
    description:
      "Pre-Final year CS Engineering student at GMIT. Crafting scalable architectures, full-stack applications, and decentralized Web3 systems.",
    icon: <User size={80} strokeWidth={1} />,
    bgColor: "bg-[#F3F0FF]", // Lavender
    span: "md:col-span-1 md:row-span-2",
    textColor: "text-indigo-950",
    descColor: "text-indigo-950/70",
    iconColor: "text-indigo-300",
  },
  {
    id: "education",
    title: "Academic Journey",
    description:
      "Pursuing B.E. in Computer Science & Engineering. Expected graduation in Jan 2027. Building a strong foundation in Data Structures, Algorithms, and Object-Oriented Design.",
    icon: <GraduationCap size={70} strokeWidth={1} />,
    bgColor: "bg-[#FCE7F3]", // Soft Pink
    span: "md:col-span-2 md:row-span-1",
    textColor: "text-pink-950",
    descColor: "text-pink-950/70",
    iconColor: "text-pink-300",
  },
  {
    id: "goals",
    title: "CGPA Score",
    description: "Maintaining an academic score of 8.6 / 10.",
    icon: <Target size={50} strokeWidth={1.5} />,
    bgColor: "bg-[#FEF3C7]", // Soft Yellow
    span: "md:col-span-1 md:row-span-1 flex flex-col justify-between",
    textColor: "text-amber-950",
    descColor: "text-amber-950/70",
    iconColor: "text-amber-400",
  },
  {
    id: "projects",
    title: "Deployments",
    description: "40+ MERN Projects & 10+ Live systems deployed.",
    icon: <Rocket size={50} strokeWidth={1.5} />,
    bgColor: "bg-[#DCFCE7]", // Soft Green
    span: "md:col-span-1 md:row-span-1 flex flex-col justify-between",
    textColor: "text-emerald-950",
    descColor: "text-emerald-950/70",
    iconColor: "text-emerald-400",
  },
  {
    id: "philosophy",
    title: "Development Philosophy",
    description:
      "Bridging heavy-duty backend logic with immersive front-end experiences. Code is the closest thing we have to magic, and I build systems that feel inherently human and highly scalable.",
    icon: <BrainCircuit size={90} strokeWidth={1} />,
    bgColor: "bg-[#FFEDD5]", // Soft Peach
    span: "md:col-span-2 md:row-span-1",
    textColor: "text-orange-950",
    descColor: "text-orange-950/70",
    iconColor: "text-orange-300",
  },
  {
    id: "interests",
    title: "Beyond the IDE",
    description:
      "Reading tech & fiction, analyzing cinema, tracking global tech news, and building open-source tools.",
    icon: <Compass size={60} strokeWidth={1} />,
    bgColor: "bg-[#F1F5F9]", // Light Blue/Grey
    span: "md:col-span-1 md:row-span-1",
    textColor: "text-slate-900",
    descColor: "text-slate-700",
    iconColor: "text-slate-300",
  },
];

const Me = () => {
  return (
    <section
      id="me"
      className="relative w-full min-h-[100dvh] bg-[#FAFAFA] text-zinc-900 flex flex-col items-center pt-24 pb-20 px-5 sm:px-12 lg:px-24 overflow-hidden z-20"
    >
      {/* ── GRAIN TEXTURE ── */}
      <div
        className="absolute inset-0 z-[0] pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto">
        {/* ── HEADER ── */}
        <div className="flex flex-col mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-3"
          >
            <div className="h-px w-8 md:w-12 bg-zinc-900" />
            <span className="font-primary text-[10px] sm:text-xs uppercase tracking-[0.4em] text-zinc-900 font-bold">
              Behind the Code
            </span>
          </motion.div>

          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-clash font-black text-[50px] sm:text-[70px] md:text-[90px] text-zinc-900 leading-[0.9] tracking-tighter uppercase"
          >
            The Architect.
          </motion.h2>
        </div>

        {/* ── BENTO GRID ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 auto-rows-[minmax(220px,auto)]"
        >
          {BENTO_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`relative overflow-hidden rounded-[2rem] p-8 sm:p-10 cursor-default ${item.bgColor} ${item.span} shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-black/5 group`}
            >
              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
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

              {/* Decorative Icon (Bottom Right Positioned) */}
              <div
                className={`absolute -bottom-4 -right-4 md:bottom-2 md:right-4 opacity-50 group-hover:scale-110 transition-transform duration-500 ${item.iconColor}`}
              >
                {item.icon}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Me;
