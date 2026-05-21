import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  GitBranch,
  Link2,
  BirdIcon,
  Camera,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";

const Contact = () => {
  const [isHovered, setIsHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="contact"
      className="relative w-full min-h-[100dvh] bg-background py-24 px-6 sm:px-12 lg:px-24 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── GRAIN TEXTURE ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-themeBrown" />
            <span className="font-geist text-[10px] uppercase tracking-[0.4em] text-themeBrown font-bold">
              Initiate Connection
            </span>
          </div>
          <h2 className="font-clash text-5xl sm:text-7xl lg:text-8xl font-black text-themeBlack uppercase tracking-tight">
            Let's Build
          </h2>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          {/* Info & Socials */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <motion.p
              variants={itemVariants}
              className="font-epilogue text-lg text-themeBlack/70 max-w-sm"
            >
              Whether you're looking to architect a decentralized system,
              integrate AI into your workflow, or just want to collaborate—I'm
              ready.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "bcbeereshkumar@gmail.com",
                  href: "mailto:bcbeereshkumar@gmail.com",
                },
                {
                  icon: MapPin,
                  label: "Location",
                  value: "Davanagere, Karnataka, IN",
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="p-5 rounded-2xl bg-white border border-black/5 shadow-sm hover:border-themeBrown/20 transition-colors"
                >
                  <card.icon className="text-themeBrown mb-4" size={24} />
                  <span className="block text-[9px] font-bold tracking-[0.2em] text-themeBlack/40 uppercase mb-1">
                    {card.label}
                  </span>
                  <a
                    href={card.href}
                    className="font-epilogue font-bold text-sm text-themeBlack"
                  >
                    {card.value}
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Socials */}
            <motion.div variants={itemVariants} className="flex gap-4">
              {[GitBranch, Link2, BirdIcon, Camera].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-12 h-12 rounded-full bg-white border border-black/5 flex items-center justify-center text-themeBlack hover:bg-themeBrown hover:text-white transition-all shadow-sm"
                >
                  <Icon size={20} />
                </a>
              ))}
            </motion.div>
          </div>

          {/* WhatsApp CTA Bento Box */}
          <motion.div variants={itemVariants} className="lg:col-span-7">
            <div className="relative p-10 sm:p-16 rounded-[2rem] bg-white border border-black/5 shadow-xl flex flex-col items-center text-center gap-6 group">
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform duration-500">
                <MessageCircle size={40} />
              </div>
              <h3 className="font-clash text-3xl font-black text-themeBlack">
                Instant Connection
              </h3>
              <p className="font-epilogue text-themeBlack/60 max-w-xs">
                Skip the emails. Let's discuss your project timelines and tech
                stack directly on WhatsApp.
              </p>

              <a
                href="https://wa.me/916360995219"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative overflow-hidden w-full max-w-xs text-white px-8 py-5 rounded-full font-primary font-bold text-xs uppercase tracking-[0.2em] bg-[#25D366] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-emerald-500/20"
              >
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ x: "-100%" }}
                  animate={{ x: isHovered ? "0%" : "-100%" }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                />
                <span
                  className={`relative z-10 flex items-center gap-2 transition-colors ${isHovered ? "text-[#25D366]" : "text-white"}`}
                >
                  Message on WhatsApp <ArrowUpRight size={16} />
                </span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
