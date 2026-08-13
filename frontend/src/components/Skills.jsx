// Skills.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Matter from 'matter-js';
import {
  Globe,
  Hexagon,
  Brain,
  Cpu,
  Server,
  Paintbrush,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   FALLING TEXT COMPONENT (Integrated)
═══════════════════════════════════════════════════════════ */
const FallingText = ({
  text = '',
  highlightWords = [],
  trigger = 'auto',
  backgroundColor = 'transparent',
  wireframes = false,
  gravity = 0.56,
  mouseConstraintStiffness = 0.2,
  fontSize = '1rem',
  className = ''
}) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const [effectStarted, setEffectStarted] = useState(false);

  useEffect(() => {
    if (!textRef.current) return;
    const words = text.split(' ');

    const newHTML = words
      .map(word => {
        const cleanWord = word.replace(/[.,!?;:]/g, '');
        const isHighlighted = highlightWords.some(hw => cleanWord.startsWith(hw));
        return `<span
          class="inline-block mx-[2px] select-none ${isHighlighted ? 'text-zinc-900 font-bold' : 'text-zinc-600'}"
        >
          ${word}
        </span>`;
      })
      .join(' ');

    textRef.current.innerHTML = newHTML;
  }, [text, highlightWords]);

  useEffect(() => {
    if (trigger === 'auto') {
      setEffectStarted(true);
      return;
    }
    if (trigger === 'scroll' && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setEffectStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [trigger]);

  useEffect(() => {
    if (!effectStarted) return;

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;

    const containerRect = containerRef.current.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    if (width <= 0 || height <= 0) return;

    const engine = Engine.create();
    engine.world.gravity.y = gravity;

    const render = Render.create({
      element: canvasContainerRef.current,
      engine,
      options: {
        width,
        height,
        background: backgroundColor,
        wireframes
      }
    });

    const boundaryOptions = {
      isStatic: true,
      render: { fillStyle: 'transparent' }
    };
    const floor = Bodies.rectangle(width / 2, height + 25, width, 50, boundaryOptions);
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, boundaryOptions);
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, boundaryOptions);
    const ceiling = Bodies.rectangle(width / 2, -25, width, 50, boundaryOptions);

    const wordSpans = textRef.current.querySelectorAll('span');
    const wordBodies = [...wordSpans].map(elem => {
      const rect = elem.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;

      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        render: { fillStyle: 'transparent' },
        restitution: 0.8,
        frictionAir: 0.01,
        friction: 0.2
      });
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 5,
        y: 0
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);

      return { elem, body };
    });

    wordBodies.forEach(({ elem, body }) => {
      elem.style.position = 'absolute';
      elem.style.left = `${body.position.x}px`;
      elem.style.top = `${body.position.y}px`;
      elem.style.transform = 'translate(-50%, -50%)';
    });

    const mouse = Mouse.create(containerRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: mouseConstraintStiffness,
        render: { visible: false }
      }
    });
    render.mouse = mouse;

    World.add(engine.world, [floor, leftWall, rightWall, ceiling, mouseConstraint, ...wordBodies.map(wb => wb.body)]);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    const updateLoop = () => {
      wordBodies.forEach(({ body, elem }) => {
        const { x, y } = body.position;
        elem.style.left = `${x}px`;
        elem.style.top = `${y}px`;
        elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
      });
      Matter.Engine.update(engine);
      requestAnimationFrame(updateLoop);
    };
    updateLoop();

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas && canvasContainerRef.current) {
        canvasContainerRef.current.removeChild(render.canvas);
      }
      World.clear(engine.world);
      Engine.clear(engine);
    };
  }, [effectStarted, gravity, wireframes, backgroundColor, mouseConstraintStiffness]);

  return (
    <div
      ref={containerRef}
      className={`relative z-[1] w-full h-full overflow-hidden ${className}`}
    >
      <div
        ref={textRef}
        className="inline-block"
        style={{
          fontSize,
          lineHeight: 1.4
        }}
      />
      <div className="absolute top-0 left-0 z-0" ref={canvasContainerRef} />
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   DECRYPTED TEXT COMPONENT (Integrated)
═══════════════════════════════════════════════════════════ */
const DecryptedText = ({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'view',
  ...props
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  const availableChars = useMemo(() => {
    return useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter(char => char !== ' ')
      : characters.split('');
  }, [useOriginalCharsOnly, text, characters]);

  const shuffleText = useCallback(
    (originalText, currentRevealed) => {
      return originalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (currentRevealed.has(i)) return originalText[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join('');
    },
    [availableChars]
  );

  const triggerDecrypt = useCallback(() => {
    setRevealedIndices(new Set());
    setIsAnimating(true);
  }, []);

  useEffect(() => {
    if (!isAnimating) return;

    let currentIteration = 0;

    intervalRef.current = setInterval(() => {
      setRevealedIndices(prevRevealed => {
        setDisplayText(shuffleText(text, prevRevealed));
        currentIteration++;
        
        if (currentIteration >= maxIterations) {
          clearInterval(intervalRef.current);
          setIsAnimating(false);
          setDisplayText(text);
          setRevealedIndices(new Set(Array.from({ length: text.length }, (_, i) => i)));
        }
        return prevRevealed;
      });
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [isAnimating, text, speed, maxIterations, shuffleText]);

  useEffect(() => {
    if (animateOn !== 'view') return;

    const observerCallback = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          triggerDecrypt();
          setHasAnimated(true);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [animateOn, hasAnimated, triggerDecrypt]);

  return (
    <motion.span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap ${parentClassName}`}
      {...props}
    >
      <span className="sr-only">{displayText}</span>
      <span aria-hidden="true">
        {displayText.split('').map((char, index) => (
          <span key={index} className={className}>
            {char}
          </span>
        ))}
      </span>
    </motion.span>
  );
};

/* ═══════════════════════════════════════════════════════════
   SKILLS DATA
═══════════════════════════════════════════════════════════ */
const skillsData = [
  {
    id: 1,
    title: "MERN Stack",
    subtitle: "Full-Scale Web Engineering",
    description:
      "Production-grade applications with React, Node, Express, MongoDB. Integrated JWT, REST APIs, real-time features, and payment gateways.",
    icon: Globe,
    skills: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "Redux"],
    color: "#18181B",
  },
  {
    id: 2,
    title: "Web3 & Blockchain",
    subtitle: "Decentralized Innovation",
    description:
      "Smart contract development with Solidity, Hardhat, Ethers.js. Integrated MetaMask, IPFS, and Hedera. Built secure dApps and token systems.",
    icon: Hexagon,
    skills: ["Solidity", "Hardhat", "Ethers.js", "Web3.js", "MetaMask", "IPFS"],
    color: "#3F3F46",
  },
  {
    id: 3,
    title: "AI & ML",
    subtitle: "Intelligent Systems",
    description:
      "Python-based AI solutions using TensorFlow, Scikit-learn, Gemini & OpenAI APIs. Built NLP pipelines, predictive models, and AI systems.",
    icon: Brain,
    skills: ["Python", "TensorFlow", "Scikit-learn", "Gemini API", "Pandas"],
    color: "#52525B",
  },
  {
    id: 4,
    title: "Core CS & DSA",
    subtitle: "Algorithmic Foundation",
    description:
      "Strong grasp of Data Structures, Algorithms, OOP, and time/space complexity. Active competitive programmer and problem solver.",
    icon: Cpu,
    skills: ["Java", "C", "JavaScript", "DSA", "OOP Patterns", "System Design"],
    color: "#71717A",
  },
  {
    id: 5,
    title: "DevOps & Tools",
    subtitle: "Streamlined CI/CD",
    description:
      "Containerization with Docker, version control with Git/GitHub, CI/CD pipelines, and seamless deployment on modern cloud platforms.",
    icon: Server,
    skills: ["Docker", "Git/GitHub", "CI/CD", "Postman", "Vercel", "AWS"],
    color: "#A1A1AA",
  },
  {
    id: 6,
    title: "UI/UX & Prototyping",
    subtitle: "Design + Development",
    description:
      "Crafting modern, responsive interfaces with Figma, Canva, and Eraser.io. Focus on micro-interactions, accessibility, and pixel-perfect UI.",
    icon: Paintbrush,
    skills: ["Figma", "Canva", "Wireframing", "Prototyping", "Tailwind"],
    color: "#D4D4D8",
  },
];

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT - Minimalist Advanced UI/UX
═══════════════════════════════════════════════════════════ */
const Skills = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const activeSkill = skillsData[activeIdx];

  const handleNext = () => {
    setDirection(1);
    setActiveIdx((prev) => (prev + 1) % skillsData.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIdx((prev) => (prev - 1 + skillsData.length) % skillsData.length);
  };

  return (
    <section
      id="skills"
      className="relative w-full h-screen bg-[#FAFAFA] text-zinc-900 overflow-hidden flex flex-col"
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

      <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 flex flex-col">
        
        {/* Header */}
        <div className="shrink-0 pt-8 lg:pt-12 mb-8 lg:mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-3"
          >
            <div className="h-px w-10 bg-zinc-900" />
            <DecryptedText
              text="The Arsenal"
              speed={60}
              maxIterations={8}
              animateOn="view"
              className="font-primary text-[10px] uppercase tracking-[0.4em] text-zinc-900 font-bold"
            />
          </motion.div>

          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="font-clash font-black text-4xl sm:text-5xl lg:text-6xl text-zinc-900 leading-[0.9] tracking-tighter uppercase"
          >
            <DecryptedText
              text="Technical"
              speed={40}
              maxIterations={12}
              animateOn="view"
              className="inline-block"
            />{" "}
            <DecryptedText
              text="Expertise"
              speed={40}
              maxIterations={12}
              animateOn="view"
              className="inline-block text-zinc-500"
            />
          </motion.h2>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeSkill.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-4xl"
            >
              {/* Skill Display Card */}
              <div className="relative rounded-3xl p-8 lg:p-12 shadow-xl border border-zinc-100">
                {/* Top Bar */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center">
                      <activeSkill.icon size={28} strokeWidth={1.5} className="text-white" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                        Skill {String(activeSkill.id).padStart(2, '0')}
                      </span>
                      <p className="font-clash font-bold text-lg text-zinc-900">
                        {activeSkill.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-4xl font-clash font-black text-zinc-200">
                    {String(activeSkill.id).padStart(2, '0')}
                  </span>
                </div>

                {/* Title with DecryptedText */}
                <h3 className="font-clash font-black text-4xl sm:text-5xl lg:text-6xl text-zinc-900 leading-[1.05] mb-6">
                  <DecryptedText
                    key={`title-${activeSkill.id}`}
                    text={activeSkill.title}
                    speed={30}
                    maxIterations={15}
                    animateOn="view"
                    className="inline-block"
                  />
                </h3>

                {/* Description with FallingText */}
                <div className="relative h-40 lg:h-48 mb-8">
                  <FallingText
                    key={`falling-${activeSkill.id}`}
                    text={activeSkill.description}
                    highlightWords={activeSkill.skills.slice(0, 3)}
                    trigger="auto"
                    backgroundColor="transparent"
                    wireframes={false}
                    gravity={0.2}
                    fontSize="1rem"
                    mouseConstraintStiffness={0.1}
                    className="absolute inset-0"
                  />
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {activeSkill.skills.map((tech, i) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 + i * 0.04 }}
                      className="px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-mono font-bold text-zinc-800 uppercase tracking-wider hover:bg-zinc-100 hover:border-zinc-300 transition-all"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>

                {/* Bottom Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-600 hover:text-zinc-900"
                  >
                    <ChevronLeft size={20} />
                    <span className="text-sm font-semibold">Prev</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {skillsData.map((skill, idx) => (
                      <button
                        key={skill.id}
                        onClick={() => setActiveIdx(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === activeIdx 
                            ? 'w-8 bg-zinc-900' 
                            : 'w-1.5 bg-zinc-300 hover:bg-zinc-400'
                        }`}
                        aria-label={`Go to skill ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-600 hover:text-zinc-900"
                  >
                    <span className="text-sm font-semibold">Next</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Progress */}
        <div className="shrink-0 pb-8 lg:pb-12 mt-8">
          <div className="flex items-center justify-center gap-3">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              {String(activeSkill.id).padStart(2, '0')} / {String(skillsData.length).padStart(2, '0')}
            </span>
            <div className="h-px w-24 bg-zinc-200">
              <div 
                className="h-full bg-zinc-900 transition-all duration-500"
                style={{ width: `${((activeIdx + 1) / skillsData.length) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              {activeSkill.skills.length} Technologies
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;