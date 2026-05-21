import React, { useState } from "react";
import { motion } from "framer-motion";

// ── CUSTOM INLINE ICONS (Zero Dependencies) ──
const MailIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
    <path d="m2 22 7-7" />
    <path d="M2 4l10 8 10-8" />
  </svg>
);

const MapPinIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const GithubIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.48-1.54 6.48-7.89a5.07 5.07 0 0 0-1.38-3.5 4.7 4.7 0 0 0-.13-3.4s-1.1-.35-3.5 1.3a11.6 11.6 0 0 0-6.3 0c-2.4-1.65-3.5-1.3-3.5-1.3a4.7 4.7 0 0 0-.13 3.4 5.07 5.07 0 0 0-1.38 3.5c0 6.35 3.34 7.54 6.48 7.89a4.8 4.8 0 0 0-1 3.02V22" />
    <path d="M9 20.5 3 16" />
  </svg>
);

const LinkedinIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const WhatsAppIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const ArrowUpRightIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

// ── ANIMATION VARIANTS ──
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30, filter: "blur(5px)" },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 70, damping: 15 },
  },
};

const titleLetterVariants = {
  hidden: { opacity: 0, y: 50, rotateX: -90, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { type: "spring", damping: 12, stiffness: 100 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const Contact = () => {
  const [isHovered, setIsHovered] = useState(false);

  const headerText = "INITIATE".split("");
  const descriptionText =
    "Whether you're looking to architect a decentralized system, integrate AI into your workflow, or just want to collaborate—I'm ready.".split(
      " ",
    );

  return (
    <section
      id="contact"
      // STRICT H-SCREEN: Rounded corners, matches Hero bg-background
      className="relative w-full h-[100dvh] bg-background rounded-t-[2.5rem] md:rounded-t-[4rem] flex flex-col items-center pt-8 sm:pt-16 md:pt-20 pb-4 overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.05)] z-10"
    >
      {/* ── GRAIN TEXTURE ── */}
      <div
        className="absolute inset-0 z-[0] pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── ATMOSPHERIC GLOWS (Animated) ── */}

      {/* Inner Container: flex-1 ensures it respects h-screen constraints */}
      <div className="relative z-10 w-full max-w-[1400px] px-5 sm:px-12 lg:px-24 h-full flex flex-col">
        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col mb-6 md:mb-12 w-full shrink-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-1 sm:mb-4"
          >
            <div className="h-px w-6 sm:w-12 bg-themeBrown" />
            <span className="font-geist text-[8px] sm:text-[10px] uppercase tracking-[0.5em] text-themeBrown font-bold">
              Let's Connect
            </span>
          </motion.div>

          {/* Staggered Title Animation */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-0 sm:gap-6 overflow-hidden perspective-[1000px]">
            <motion.h2
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05, delayChildren: 0.1 },
                },
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex font-humane text-[5rem] leading-[0.8] sm:text-9xl md:text-[140px] text-themeBlack sm:leading-[0.8] tracking-tighter drop-shadow-sm uppercase"
            >
              {headerText.map((char, index) => (
                <motion.span
                  key={index}
                  variants={titleLetterVariants}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </motion.h2>

            <motion.span
              initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="font-season italic text-4xl sm:text-6xl md:text-[80px] text-themeBrown lowercase tracking-normal pb-1 sm:pb-4 drop-shadow-[0_4px_10px_rgba(94,0,6,0.15)]"
            >
              Contact.
            </motion.span>
          </div>
        </div>

        {/* ── CONTENT GRID (Scrollable on small screens) ── */}
        <div className="w-full flex-1 min-h-0 overflow-y-auto hide-scrollbar pb-10 pt-2 sm:pt-0">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 h-full items-start lg:items-center"
          >
            {/* Left Column: Animated Text & Bento Boxes */}
            <div className="lg:col-span-6 flex flex-col gap-6 lg:gap-8">
              {/* Animated Paragraph */}
              <div className="mb-2">
                <motion.h3
                  variants={cardVariants}
                  className="font-primary text-2xl sm:text-4xl text-themeBlack mb-3 sm:mb-4 leading-tight font-bold"
                >
                  Have an idea? Let's build something{" "}
                  <span className="font-season italic text-themeBrown font-medium">
                    extraordinary.
                  </span>
                </motion.h3>

                <motion.div className="font-secondary text-themeBlack/70 font-medium text-sm sm:text-base leading-relaxed max-w-md flex flex-wrap gap-x-1">
                  {descriptionText.map((word, i) => (
                    <motion.span
                      key={i}
                      variants={wordVariants}
                      className="inline-block"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              {/* Bento Grid for Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Card */}
                <motion.a
                  variants={cardVariants}
                  href="mailto:bcbeereshkumar@gmail.com"
                  className="group flex flex-col justify-between p-5 sm:p-6 rounded-lg bg-white border border-borderLight shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-background border border-borderLight flex items-center justify-center text-themeBlack/50 group-hover:bg-themeBrown group-hover:text-white group-hover:border-themeBrown transition-all duration-300 mb-4">
                    <MailIcon size={20} />
                  </div>
                  <div>
                    <span className="block font-primary text-[9px] uppercase tracking-widest text-themeBlack/50 font-bold mb-1">
                      Email
                    </span>
                    <span className="block font-secondary font-bold text-xs sm:text-sm tracking-wide text-themeBlack truncate">
                      bcbeereshkumar
                      <br className="hidden lg:block" />
                      @gmail.com
                    </span>
                  </div>
                </motion.a>

                {/* Location Card */}
                <motion.div
                  variants={cardVariants}
                  className="group flex flex-col justify-between p-5 sm:p-6 rounded-lg bg-white border border-borderLight shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-background border border-borderLight flex items-center justify-center text-themeBlack/50 group-hover:bg-themeBrown group-hover:text-white group-hover:border-themeBrown transition-all duration-300 mb-4">
                    <MapPinIcon size={20} />
                  </div>
                  <div>
                    <span className="block font-primary text-[9px] uppercase tracking-widest text-themeBlack/50 font-bold mb-1">
                      Location
                    </span>
                    <span className="block font-secondary font-bold text-xs sm:text-sm tracking-wide text-themeBlack truncate">
                      Davanagere,
                      <br className="hidden lg:block" /> Karnataka, IN
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Socials & Status Row */}
              <motion.div
                variants={cardVariants}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full"
              >
                {/* Socials */}
                <div className="flex items-center gap-3">
                  {[
                    {
                      icon: <GithubIcon size={16} />,
                      link: "https://github.com/beereshbc/",
                    },
                    {
                      icon: <LinkedinIcon size={16} />,
                      link: "https://www.linkedin.com/in/beereshkumar-b-c-004397341",
                    },
                    {
                      icon: <TwitterIcon size={16} />,
                      link: "https://x.com/BBchatrad?s=08",
                    },
                    {
                      icon: <InstagramIcon size={16} />,
                      link: "https://www.instagram.com/_mr___scarface___/",
                    },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.link}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-black/5 flex items-center justify-center text-themeBlack/50 hover:text-white hover:bg-themeBrown hover:border-themeBrown transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>

                {/* Status Pill */}
                <div className="flex items-center gap-2 w-fit px-4 py-2 sm:py-3 rounded-full border border-borderLight bg-white shadow-sm">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]"></span>
                  </div>
                  <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-themeBlack/70 font-bold">
                    Available for Work
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Massive WhatsApp CTA */}
            <motion.div
              variants={cardVariants}
              className="lg:col-span-6 w-full h-full flex flex-col justify-center mt-4 lg:mt-0"
            >
              <div className="relative p-8 md:p-12 lg:p-16 rounded-xl bg-white border border-borderLight shadow-sm flex flex-col items-center text-center gap-5 sm:gap-6 group hover:shadow-md transition-all duration-300 overflow-hidden">
                <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-background border border-borderLight flex items-center justify-center text-[#25D366] mb-2 group-hover:scale-110 group-hover:bg-[#25D366] group-hover:text-white transition-all duration-300">
                  <WhatsAppIcon size={32} className="sm:w-[36px] sm:h-[36px]" />
                </div>

                <h4 className="relative z-10 font-primary text-3xl md:text-4xl text-themeBlack font-black tracking-tight">
                  Instant Connection
                </h4>

                <p className="relative z-10 font-secondary text-themeBlack/60 font-medium text-xs sm:text-sm md:text-base leading-relaxed max-w-xs">
                  Skip the emails and contact forms. Let's discuss your project,
                  timelines, and tech stack directly.
                </p>

                <a
                  href="https://wa.me/916360995219"
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="relative z-10 overflow-hidden w-full max-w-xs mt-2 sm:mt-4 text-white px-6 py-4 sm:px-8 sm:py-5 rounded-lg font-primary font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] bg-[#25D366] border border-[#25D366] transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-lg hover:-translate-y-1"
                >
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: isHovered ? "0%" : "-100%" }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                    className="absolute inset-0 bg-white z-0"
                  />
                  <span
                    className={`relative z-10 flex items-center gap-2 transition-colors duration-300 ${isHovered ? "text-themeBlack" : "text-white"}`}
                  >
                    Message on WhatsApp <ArrowUpRightIcon size={16} />
                  </span>
                </a>

                {/* Number Display */}
                <p className="relative z-10 font-mono text-themeBlack/50 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest mt-1 sm:mt-2">
                  +91 63609 95219
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Global Style to hide scrollbar in the internal view */}
      <style
        dangerouslySetInlineStyle={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </section>
  );
};

export default Contact;
