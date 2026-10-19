// Navbar.jsx
import React, {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useId,
  useMemo,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import {
  User,
  Briefcase,
  Zap,
  Mail,
  Home,
  ArrowUpRight,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   CONFIGURATION
   ───────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  {
    name: "Home",
    icon: Home,
    id: "hero",
    description: "Welcome to my portfolio and creative space.",
    links: [
      { label: "Overview", href: "#hero" },
      { label: "Highlights", href: "#highlights" },
    ],
  },
  {
    name: "Me",
    icon: User,
    id: "me",
    description: "The person behind the pixels and code.",
    links: [
      { label: "About", href: "#me" },
      { label: "Journey", href: "#journey" },
    ],
  },
  {
    name: "Works",
    icon: Briefcase,
    id: "works",
    description: "Selected projects and case studies.",
    links: [
      { label: "Featured", href: "#works" },
      { label: "Case studies", href: "#case-studies" },
    ],
  },
  {
    name: "Skills",
    icon: Zap,
    id: "skills",
    description: "Tools, technologies and capabilities.",
    links: [
      { label: "Stack", href: "#skills" },
      { label: "Services", href: "#services" },
    ],
  },
  {
    name: "Contact",
    icon: Mail,
    id: "contact",
    description: "Let's build something together.",
    links: [
      { label: "Email", href: "mailto:hello@example.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
    ],
  },
];

const NARROW_BREAKPOINT = 640;
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const easeOut = (t) => 1 - (1 - t) ** 3;

/* ─────────────────────────────────────────────────────────────
   CLASS STRINGS (Black & White)
   ───────────────────────────────────────────────────────────── */
const ROOT =
  "group/cn relative mx-auto h-[var(--cn-bar)] w-full max-w-[var(--cn-max)] text-[14px] leading-[1.4] [-webkit-tap-highlight-color:transparent]";

const PANEL =
  "absolute inset-x-0 top-0 z-10 h-[var(--cn-bar)] overflow-hidden rounded-[var(--cn-radius)] [background:var(--cn-panel)] [box-shadow:var(--cn-shadow)] [-webkit-backdrop-filter:var(--cn-blur)] [backdrop-filter:var(--cn-blur)]";

const RIM =
  "pointer-events-none absolute inset-0 z-[3] rounded-[inherit] [box-shadow:inset_0_0_0_1px_var(--cn-edge),inset_0_1px_0_var(--cn-highlight)]";

const BAR =
  "relative z-[2] box-border grid h-[var(--cn-bar)] grid-cols-[1fr_auto_1fr] items-center px-[var(--cn-inset)] group-data-[narrow]/cn:grid-cols-[auto_1fr_auto]";

const MENU =
  "inline-flex h-[calc(var(--cn-bar)_-_var(--cn-inset)*2)] cursor-pointer items-center gap-[10px] justify-self-start rounded-[calc(var(--cn-radius)_-_var(--cn-inset))] border-0 pl-[16px] pr-[14px] [background:none] [font-family:inherit] [font-size:inherit] font-medium text-[var(--cn-text)] outline-none transition-[background-color] duration-200 ease-[ease] hover:[background:var(--cn-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cn-ring)] data-[icon-only]:w-[calc(var(--cn-bar)_-_var(--cn-inset)*2)] data-[icon-only]:justify-center data-[icon-only]:p-0 group-data-[narrow]/cn:col-[3] group-data-[narrow]/cn:row-[1] group-data-[narrow]/cn:justify-self-end";

const LOGO =
  "inline-flex h-[var(--cn-logo)] items-center justify-self-center text-[var(--cn-text)] no-underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cn-ring)] [&_img]:block [&_img]:h-full [&_img]:w-auto [&_svg]:block [&_svg]:h-full [&_svg]:w-auto group-data-[narrow]/cn:col-[1] group-data-[narrow]/cn:row-[1] group-data-[narrow]/cn:justify-self-start group-data-[narrow]/cn:pl-[14px]";

const CTA =
  "inline-flex h-[calc(var(--cn-bar)_-_var(--cn-inset)*2)] justify-self-end cursor-pointer items-center justify-center whitespace-nowrap rounded-[calc(var(--cn-radius)_-_var(--cn-inset))] border-0 px-[16px] [background:var(--cn-cta)] [box-shadow:var(--cn-cta-shadow)] [font-family:inherit] [font-size:inherit] font-semibold text-[var(--cn-cta-ink)] no-underline outline-none transition-[filter] duration-200 ease-[ease] hover:[filter:var(--cn-cta-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cn-ring)]";

const CTA_WIDE =
  "flex h-[44px] w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-[calc(var(--cn-radius)_-_var(--cn-inset))] border-0 px-[16px] [background:var(--cn-cta)] [box-shadow:var(--cn-cta-shadow)] [font-family:inherit] [font-size:inherit] font-semibold text-[var(--cn-cta-ink)] no-underline outline-none transition-[filter] duration-200 ease-[ease] hover:[filter:var(--cn-cta-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cn-ring)]";

const CONTENT =
  "invisible absolute inset-x-0 top-[var(--cn-bar)] box-border flex flex-col gap-[var(--cn-gap)] px-[var(--cn-inset)] pb-[var(--cn-inset)] [perspective:900px] group-data-[shown]/cn:visible";

const CARDS = "flex gap-[var(--cn-gap)] group-data-[narrow]/cn:flex-col";

const CARD =
  "group/card relative box-border flex min-h-[var(--cn-card)] min-w-0 flex-[1_1_0] origin-top flex-col gap-[18px] rounded-[calc(var(--cn-radius)_-_var(--cn-inset))] px-[16px] pb-[14px] pt-[16px] [background:var(--cn-tile)] [box-shadow:var(--cn-tile-rim)] text-[var(--cn-text)] will-change-[transform,opacity] group-data-[narrow]/cn:min-h-0 group-data-[narrow]/cn:flex-none group-data-[narrow]/cn:gap-[10px] group-data-[narrow]/cn:px-[14px] group-data-[narrow]/cn:pb-[12px] group-data-[narrow]/cn:pt-[14px]";

const CARD_HEAD = "flex flex-col gap-[4px]";
const LABEL = "text-[17px] font-semibold tracking-[-0.015em]";
const DESCRIPTION = "m-0 text-[13px] leading-[1.45] text-[var(--cn-muted)]";

const LINKS =
  "m-0 mt-auto flex list-none flex-col gap-[2px] p-0 group-data-[narrow]/cn:flex-row group-data-[narrow]/cn:flex-wrap group-data-[narrow]/cn:gap-x-[16px] group-data-[narrow]/cn:gap-y-[2px]";

const LINK =
  "group/link inline-flex cursor-pointer items-center gap-[8px] rounded-[6px] border-0 px-0 py-[3px] [background:none] [font-family:inherit] text-[14px] font-medium text-inherit no-underline opacity-[0.82] outline-none transition-opacity duration-200 ease-[ease] hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cn-ring)]";

const ARROW = "relative inline-block h-[14px] w-[14px] flex-none overflow-hidden";

const ARROW_OUT =
  "absolute inset-0 h-full w-full transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:translate-x-[110%] group-hover/link:-translate-y-[110%] group-focus-visible/link:translate-x-[110%] group-focus-visible/link:-translate-y-[110%] motion-reduce:transition-none";

const ARROW_IN =
  "absolute inset-0 h-full w-full -translate-x-[110%] translate-y-[110%] transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:translate-x-0 group-hover/link:translate-y-0 group-focus-visible/link:translate-x-0 group-focus-visible/link:translate-y-0 motion-reduce:transition-none";

/* ─────────────────────────────────────────────────────────────
   BLACK & WHITE THEME
   ───────────────────────────────────────────────────────────── */
const THEME = {
  dark: {
    "--cn-panel": "rgba(20, 20, 22, 0.82)",
    "--cn-solid": "#141416",
    "--cn-edge": "rgba(255, 255, 255, 0.08)",
    "--cn-highlight": "rgba(255, 255, 255, 0.07)",
    "--cn-shadow":
      "0 24px 48px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)",
    "--cn-text": "#fafafa",
    "--cn-muted": "rgba(250, 250, 250, 0.56)",
    "--cn-hover": "rgba(255, 255, 255, 0.06)",
    "--cn-ring": "rgba(250, 250, 250, 0.55)",
    "--cn-tile": "linear-gradient(180deg, #1e1e21 0%, #141416 100%)",
    "--cn-tile-rim":
      "inset 0 0 0 1px rgba(255, 255, 255, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 4px 10px -4px rgba(0, 0, 0, 0.6)",
    "--cn-cta": "linear-gradient(180deg, #fafafa 0%, #e4e4e7 100%)",
    "--cn-cta-ink": "#09090b",
    "--cn-cta-shadow":
      "inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 6px 16px -6px rgba(0, 0, 0, 0.6)",
    "--cn-cta-hover": "brightness(0.92)",
  },
  light: {
    "--cn-panel": "rgba(250, 250, 250, 0.86)",
    "--cn-solid": "#fafafa",
    "--cn-edge": "rgba(9, 9, 11, 0.07)",
    "--cn-highlight": "rgba(255, 255, 255, 0.95)",
    "--cn-shadow":
      "0 24px 48px -24px rgba(9, 9, 11, 0.25), 0 6px 16px -10px rgba(9, 9, 11, 0.12)",
    "--cn-text": "#09090b",
    "--cn-muted": "rgba(9, 9, 11, 0.56)",
    "--cn-hover": "rgba(9, 9, 11, 0.05)",
    "--cn-ring": "rgba(9, 9, 11, 0.45)",
    "--cn-tile": "linear-gradient(180deg, #ffffff 0%, #f4f4f5 100%)",
    "--cn-tile-rim":
      "inset 0 0 0 1px rgba(9, 9, 11, 0.06), inset 0 1px 0 rgba(255, 255, 255, 1), 0 4px 10px -5px rgba(9, 9, 11, 0.18)",
    "--cn-cta": "linear-gradient(180deg, #18181b 0%, #09090b 100%)",
    "--cn-cta-ink": "#fafafa",
    "--cn-cta-shadow":
      "inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 6px 14px -6px rgba(9, 9, 11, 0.45)",
    "--cn-cta-hover": "brightness(1.25)",
  },
};

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────── */
const Navbar = ({
  items = NAV_ITEMS,
  cta = { label: "Get started", href: "#contact" },
  theme = "dark",
  surface = "glass",
  openOn = "click",
  cardEffect = "rise",
  stagger = 0.12,
  bounce = 0.2,
  speed = 1,
  cardHeight = 176,
  maxWidth = 860,
  menuLabel = true,
  defaultOpen = false,
  ariaLabel = "Main navigation",
  onNavigate,
  className = "",
  style,
}) => {
  const contentId = useId();
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const contentRef = useRef(null);
  const menuRef = useRef(null);
  const cardRefs = useRef([]);
  const engineRef = useRef(null);
  const leaveRef = useRef(0);
  const barRef = useRef(null);
  const [open, setOpen] = useState(defaultOpen);
  const [narrow, setNarrow] = useState(false);
  const [shown, setShown] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState(-1);

  const hasCta = Boolean(cta);
  const palette = THEME[theme] ?? THEME.dark;

  const settingsRef = useRef({ open, cardEffect, stagger, bounce, speed });
  settingsRef.current = { open, cardEffect, stagger, bounce, speed };

  const vars = useMemo(() => {
    const v = {
      ...palette,
      "--cn-max": `${maxWidth}px`,
      "--cn-bar": "60px",
      "--cn-inset": "8px",
      "--cn-gap": "8px",
      "--cn-radius": "18px",
      "--cn-logo": "24px",
      "--cn-card": `${cardHeight}px`,
    };
    if (surface === "glass") v["--cn-blur"] = "blur(20px) saturate(1.6)";
    if (surface === "solid") {
      v["--cn-panel"] = palette["--cn-solid"];
      v["--cn-blur"] = "none";
    }
    return v;
  }, [palette, maxWidth, surface, cardHeight]);

  /* ── Spring animation engine ── */
  useEffect(() => {
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!panel || !content) return undefined;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const state = {
      p: settingsRef.current.open ? 1 : 0,
      v: 0,
      height: content.offsetHeight,
      bar: 60,
    };
    let raf = 0;
    let last = 0;

    const render = () => {
      const s = settingsRef.current;
      state.bar =
        parseFloat(getComputedStyle(panel).getPropertyValue("--cn-bar")) || 60;
      panel.style.height = `${state.bar + Math.max(0, state.p) * state.height}px`;

      const cards = cardRefs.current.filter(Boolean);
      const count = cards.length;
      const lag = count > 1 ? Math.min(s.stagger, 0.7 / (count - 1)) : 0;
      const span = 1 - lag * (count - 1);

      cards.forEach((card, index) => {
        const local = clamp(
          (state.p - index * lag) / Math.max(span, 0.05),
          0,
          1
        );
        const e = easeOut(local);

        if (s.cardEffect === "unfold") {
          card.style.transform = `translateY(${(1 - e) * -10}px) rotateX(${
            (1 - e) * -72
          }deg)`;
          card.style.opacity = `${clamp(local * 1.8, 0, 1)}`;
          card.style.filter = "";
        } else if (s.cardEffect === "fade") {
          card.style.transform = `translateY(${(1 - e) * 6}px)`;
          card.style.opacity = `${e}`;
          card.style.filter = e < 0.999 ? `blur(${(1 - e) * 6}px)` : "";
        } else {
          card.style.transform = `translateY(${(1 - e) * 26}px) scale(${
            0.97 + 0.03 * e
          })`;
          card.style.opacity = `${e}`;
          card.style.filter = "";
        }
      });
    };

    const tick = (now) => {
      raf = 0;
      const s = settingsRef.current;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const target = s.open ? 1 : 0;

      if (reduce) {
        state.p = target;
        state.v = 0;
      } else {
        const k = 160 * s.speed * s.speed;
        const zeta = s.open ? 1 - 0.68 * s.bounce : 1;
        const steps = Math.ceil(dt / (1 / 240));
        const h = dt / steps;
        for (let i = 0; i < steps; i++) {
          state.v +=
            (-k * (state.p - target) - 2 * zeta * Math.sqrt(k) * state.v) * h;
          state.p += state.v * h;
        }
      }

      const done =
        Math.abs(state.p - target) < 0.0005 && Math.abs(state.v) < 0.002;
      if (done) {
        state.p = target;
        state.v = 0;
      }
      render();
      if (done && target === 0) setShown(false);
      if (!done) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    engineRef.current = {
      wake,
      refresh: () => {
        state.height = content.offsetHeight;
        render();
      },
    };

    render();
    const observer = new ResizeObserver(() => {
      state.height = content.offsetHeight;
      render();
    });
    observer.observe(content);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      engineRef.current = null;
    };
  }, [items.length, hasCta, narrow]);

  useLayoutEffect(() => {
    if (open) setShown(true);
    engineRef.current?.refresh();
    engineRef.current?.wake();
  }, [open]);

  useEffect(() => {
    engineRef.current?.refresh();
  });

  /* ── Responsive detection ── */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const measure = () => setNarrow(root.offsetWidth < NARROW_BREAKPOINT);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  /* ── Outside click + Escape ── */
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      const target = event.target;
      if (target instanceof Node && rootRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(leaveRef.current), []);

  /* ── Intro animation ── */
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const bar = barRef.current;
    if (!panel || !bar) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const width = panel.offsetWidth;
    const height = panel.offsetHeight;
    const radius =
      parseFloat(getComputedStyle(panel).borderTopLeftRadius) || 18;

    panel.animate(
      [
        {
          clipPath: `inset(0px ${Math.max(0, (width - height) / 2)}px round ${
            height / 2
          }px)`,
          opacity: 0,
        },
        { clipPath: `inset(0px 0px round ${radius}px)`, opacity: 1 },
      ],
      { duration: 820, easing: EASE_OUT, fill: "backwards" }
    );

    Array.from(bar.children).forEach((child, index) => {
      child.animate(
        [
          { opacity: 0, transform: "translateY(-8px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 560,
          delay: 220 + index * 70,
          easing: EASE_OUT,
          fill: "backwards",
        }
      );
    });
  }, []);

  /* ── Hover open ── */
  const hover = openOn === "hover";
  const onPointerEnter = (event) => {
    if (!hover || event.pointerType === "touch") return;
    window.clearTimeout(leaveRef.current);
    setOpen(true);
  };
  const onPointerLeave = (event) => {
    if (!hover || event.pointerType === "touch") return;
    window.clearTimeout(leaveRef.current);
    leaveRef.current = window.setTimeout(() => setOpen(false), 160);
  };

  /* ── Navigation handler ── */
  const handleNavigate = useCallback(
    (item, link, event) => {
      event?.preventDefault?.();
      if (item) setActiveIndex(items.indexOf(item));
      setOpen(false);
      onNavigate?.(item, link);

      const targetId = link.href?.replace("#", "");
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        } else if (link.href?.startsWith("#")) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    },
    [items, onNavigate]
  );

  const isActive = (item) => activeIndex === items.indexOf(item);

  /* ── Render ── */
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none px-2 sm:px-4 pt-2 sm:pt-3"
    >
      <div
        ref={rootRef}
        className={[ROOT, "pointer-events-auto", className]
          .filter(Boolean)
          .join(" ")}
        data-open={open ? "" : undefined}
        data-shown={shown || open ? "" : undefined}
        data-narrow={narrow ? "" : undefined}
        style={{ ...vars, ...style }}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <nav ref={panelRef} className={PANEL} aria-label={ariaLabel}>
          {/* ── Top Bar ── */}
          <div ref={barRef} className={BAR}>
            {/* Menu toggle */}
            <button
              ref={menuRef}
              type="button"
              className={MENU}
              data-icon-only={menuLabel ? undefined : ""}
              aria-expanded={open}
              aria-controls={contentId}
              aria-label={
                menuLabel ? undefined : open ? "Close menu" : "Open menu"
              }
              onClick={() => setOpen((v) => !v)}
            >
              <span className="relative h-[12px] w-[18px]" aria-hidden="true">
                <span
                  className={`absolute left-0 top-[2.25px] h-[1.5px] w-full rounded-[2px] bg-current transition-[top,rotate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    open ? "top-[5.25px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[8.25px] h-[1.5px] w-full rounded-[2px] bg-current transition-[top,rotate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    open ? "top-[5.25px] -rotate-45" : ""
                  }`}
                />
              </span>
              {menuLabel && (
                <span className="relative inline-grid overflow-hidden">
                  <span
                    className={`[grid-area:1/1] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                      open ? "-translate-y-[110%]" : ""
                    }`}
                    aria-hidden={open}
                  >
                    Menu
                  </span>
                  <span
                    className={`[grid-area:1/1] translate-y-[110%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                      open ? "translate-y-0" : ""
                    }`}
                    aria-hidden={!open}
                  >
                    Close
                  </span>
                </span>
              )}
            </button>

            {/* Center — Logo / Brand */}
            <div className={LOGO} aria-label="Brand">
              <span className="text-[15px] font-light font-clash tracking-[-0.02em] sm:text-[16px]">
                Beereshkumar B C
              </span>
            </div>

            {/* Right — CTA (desktop) */}
            {cta && !narrow && (
              <a
                href={cta.href}
                className={CTA}
                onClick={(e) => handleNavigate(null, cta, e)}
              >
                {cta.label}
              </a>
            )}
          </div>

          {/* ── Expandable Content (drops down from top) ── */}
          <div
            ref={contentRef}
            id={contentId}
            className={CONTENT}
            aria-hidden={!open}
          >
            <div className={CARDS}>
              {items.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <div
                    key={item.id}
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    className={CARD}
                    style={{
                      opacity: 0,
                      transform: "translateY(-26px) scale(0.97)",
                    }}
                  >
                    <div className={CARD_HEAD}>
                      <div className="flex items-center gap-2">
                        {Icon && (
                          <Icon
                            size={18}
                            strokeWidth={active ? 2.5 : 1.8}
                            className={`transition-colors duration-300 ${
                              active ? "opacity-100" : "opacity-60"
                            }`}
                          />
                        )}
                        <span
                          className={`${LABEL} ${active ? "" : "opacity-80"}`}
                        >
                          {item.name}
                        </span>
                        {active && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                        )}
                      </div>
                      {item.description && (
                        <p className={DESCRIPTION}>{item.description}</p>
                      )}
                    </div>
                    <ul className={LINKS}>
                      {(item.links ?? []).map((link, li) => (
                        <li key={`${link.label}-${li}`}>
                          <a
                            href={link.href}
                            className={LINK}
                            tabIndex={open ? undefined : -1}
                            onClick={(e) => handleNavigate(item, link, e)}
                          >
                            <span className={ARROW} aria-hidden="true">
                              <ArrowUpRight
                                className={ARROW_OUT}
                                size={14}
                                strokeWidth={2}
                              />
                              <ArrowUpRight
                                className={ARROW_IN}
                                size={14}
                                strokeWidth={2}
                              />
                            </span>
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* CTA on mobile */}
            {cta && narrow && (
              <div
                ref={(el) => {
                  cardRefs.current[items.length] = el;
                }}
                style={{ opacity: 0 }}
              >
                <a
                  href={cta.href}
                  className={CTA_WIDE}
                  tabIndex={open ? undefined : -1}
                  onClick={(e) => {
                    handleNavigate(null, cta, e);
                    setOpen(false);
                  }}
                >
                  {cta.label}
                </a>
              </div>
            )}
          </div>

          <span className={RIM} />
        </nav>
      </div>
    </motion.header>
  );
};

export default Navbar;  