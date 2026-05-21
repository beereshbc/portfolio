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
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const socialLinks = [
    { icon: GitBranch, label: "GitHub", href: "#" },
    { icon: Link2, label: "LinkedIn", href: "#" },
    { icon: BirdIcon, label: "Twitter", href: "#" },
    { icon: Camera, label: "Instagram", href: "#" },
  ];

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen bg-background py-5 sm:py-6 md:py-8 px-6 sm:px-12 lg:px-24 flex flex-col items-center justify-center overflow-hidden rounded-t-3xl md:rounded-t-[4rem]"
    >
      {/* ── GRAIN TEXTURE (unified) ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── SOFT BACKGROUND GLOWS ── */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-themeBrown/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Decorative floating circle */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 right-[5%] w-32 h-32 rounded-full border border-themeBrown/10 bg-white/30 blur-xl pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mb-12 md:mb-20"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 mb-4"
          >
            <div className="h-px w-10 bg-themeBrown" />
            <span className="font-secondary text-[10px] uppercase tracking-[0.4em] text-themeBrown font-bold">
              Initiate Connection
            </span>
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="font-display text-5xl sm:text-7xl lg:text-8xl font-black text-themeBlack uppercase tracking-tight leading-[1.1]"
          >
            Let's Build
            <span className="text-themeBrown/30 block text-3xl sm:text-4xl mt-2">
              something legendary
            </span>
          </motion.h2>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16"
        >
          {/* Info & Socials */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <motion.p
              variants={itemVariants}
              className="font-primary text-base sm:text-lg text-textSecondary leading-relaxed max-w-md"
            >
              Whether you're looking to architect a decentralized system,
              integrate AI into your workflow, or just want to collaborate —
              <span className="text-themeBrown font-semibold"> I'm ready.</span>
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                  href: "#",
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group p-5 rounded-2xl bg-white border border-borderLight shadow-sm hover:shadow-md hover:border-themeBrown/30 transition-all duration-300"
                >
                  <card.icon className="text-themeBrown mb-4" size={24} />
                  <span className="block font-secondary text-[9px] font-bold tracking-[0.2em] text-textTertiary uppercase mb-1">
                    {card.label}
                  </span>
                  <a
                    href={card.href}
                    className="font-primary font-semibold text-sm text-themeBlack hover:text-themeBrown transition-colors break-all"
                  >
                    {card.value}
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Socials with hover tooltip effect */}
            <motion.div variants={itemVariants} className="flex gap-4">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ y: -4, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group w-12 h-12 rounded-full bg-white border border-borderLight flex items-center justify-center text-textSecondary hover:bg-themeBrown hover:text-white hover:border-themeBrown transition-all duration-300 shadow-sm"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-secondary font-bold text-themeBlack/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {social.label}
                  </span>
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* WhatsApp CTA Bento Box */}
          <motion.div variants={itemVariants} className="lg:col-span-7">
            <div className="relative p-8 sm:p-12 md:p-16 rounded-[2rem] bg-white border border-borderLight shadow-lg flex flex-col items-center text-center gap-6 group hover:shadow-xl transition-all duration-500">
              {/* Decorative corner lines */}
              <div className="absolute top-6 left-6 w-12 h-px bg-themeBrown/20" />
              <div className="absolute top-6 left-6 w-px h-12 bg-themeBrown/20" />
              <div className="absolute bottom-6 right-6 w-12 h-px bg-themeBrown/20" />
              <div className="absolute bottom-6 right-6 w-px h-12 bg-themeBrown/20" />

              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-[#25D366] shadow-md"
              >
                <MessageCircle size={40} />
              </motion.div>

              <div>
                <h3 className="font-display text-3xl sm:text-4xl font-black text-themeBlack mb-2">
                  Instant Connection
                </h3>
                <p className="font-primary text-textSecondary max-w-xs mx-auto">
                  Skip the emails. Let's discuss your project timelines and tech
                  stack directly on WhatsApp.
                </p>
              </div>

              <motion.a
                href="https://wa.me/916360995219"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative overflow-hidden w-full max-w-xs text-white px-6 py-4 rounded-full font-primary font-bold text-xs uppercase tracking-[0.2em] bg-[#25D366] transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-emerald-500/30"
              >
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ x: "-100%" }}
                  animate={{ x: isHovered ? "0%" : "-100%" }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                />
                <span
                  className={`relative z-10 flex items-center gap-2 transition-colors duration-300 ${
                    isHovered ? "text-[#25D366]" : "text-white"
                  }`}
                >
                  Message on WhatsApp <ArrowUpRight size={16} />
                </span>
              </motion.a>

              <p className="font-secondary text-[9px] text-textTertiary uppercase tracking-wider">
                Response within 24 hours
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
