// Enhanced animation variants for consistent premium animations

export const fadeInUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -40, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 40, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.85, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const slideDown = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

// Marquee animation setup
export const marqueeVariants = {
  animate: {
    x: [0, -1000],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 40,
        ease: "linear",
      },
    },
  },
};

// Text reveal variants
export const textRevealVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.04,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

// Spring animation configs
export const springConfig = {
  smooth: {
    type: "spring",
    stiffness: 80,
    damping: 20,
    mass: 0.5,
  },
  bouncy: {
    type: "spring",
    stiffness: 300,
    damping: 10,
    mass: 0.5,
  },
  snappy: {
    type: "spring",
    stiffness: 200,
    damping: 15,
    mass: 0.3,
  },
};

// Tab transition
export const tabVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

// Hover lift effect
export const hoverLift = {
  initial: { y: 0 },
  hover: { y: -8 },
};

// Glow effect
export const glowPulse = {
  initial: { boxShadow: "0 0 20px rgba(244, 91, 38, 0.2)" },
  animate: {
    boxShadow: [
      "0 0 20px rgba(244, 91, 38, 0.2)",
      "0 0 40px rgba(244, 91, 38, 0.4)",
      "0 0 20px rgba(244, 91, 38, 0.2)",
    ],
  },
  transition: { duration: 3, repeat: Infinity },
};
