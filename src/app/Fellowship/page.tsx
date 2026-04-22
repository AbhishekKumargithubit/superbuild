"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ─────────── CONSTANTS ─────────── */
const APPLY_URL = "https://superbuilt.ai/fellowship/apply";
const CANONICAL_URL = "https://superbuilt.ai/fellowship";
const OG_IMAGE = "https://superbuilt.ai/og-fellowship.jpg";
const MAX_SEATS = 150;

const COLORS = {
  blue: "#007FFF",
  blueAlpha8: "rgba(0,127,255,0.08)",
  blueAlpha18: "rgba(0,127,255,0.18)",
  blueAlpha20: "rgba(0,127,255,0.2)",
  white: "#fff",
  black: "#000",
  text: "#d4d4d4",
  muted: "#8b8b8b",
  faint: "#555",
  border: "#1c1c1c",
  borderHover: "#2e2e2e",
  surface: "#0d0d0d",
  dim: "#333",
  dimmer: "#3a3a3a",
};

const FONTS = {
  display: "Red Hat Display, sans-serif",
  body: "Nunito, sans-serif",
};

const WEEKS = [
  {
    w: "Week 1–2",
    t: "Ideation & Scoping",
    d: "Define your problem. Pick your stack. Get expert sign-off before writing a single line.",
  },
  {
    w: "Week 3–5",
    t: "Build Sprint",
    d: "Work with real tools, APIs, and datasets. No toy examples, no handholding.",
  },
  {
    w: "Week 6",
    t: "Expert Review I",
    d: "Live session with an industry mentor. Real feedback, not encouragement theater.",
  },
  {
    w: "Week 7",
    t: "Iterate & Harden",
    d: "Fix what broke. Document like an engineer. Prepare for showcase.",
  },
  {
    w: "Week 8",
    t: "Ship & Showcase",
    d: "Publish your project. Receive your certificate, letter, and portfolio assets.",
  },
];

const DOMAINS = [
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Data Analytics",
];

const TRACKS = [
  {
    id: "core",
    badge: "Core Track",
    price: "₹499",
    headline: "The full fellowship experience.",
    bullets: [
      "Premium offer letter",
      "Completion certificate",
      "Letter of recommendation (merit-based)",
      "Free access to AI / ML / Data courses",
      "Goodies for top performers",
    ],
    accent: false,
  },
  {
    id: "pro",
    badge: "Pro Track",
    price: "₹999",
    headline: "For those who want the career edge.",
    bullets: [
      "Everything in Core",
      "1-on-1 mock interview — real-world simulation",
      "Resume review and improvement",
      "Featured on the Superbuilt website",
      "Referral opportunities to partner companies",
    ],
    accent: true,
  },
];

const PAIN_CARDS = [
  {
    t: "No real projects",
    d: "Coursework doesn't build portfolios that land interviews.",
  },
  {
    t: "No industry exposure",
    d: "Knowing theory and knowing what teams actually use are different things.",
  },
  {
    t: "No feedback loop",
    d: "You can't grow without someone who's shipped real products telling you where you're wrong.",
  },
];

const STEPS = [
  { n: "01", t: "Pick a real problem" },
  { n: "02", t: "Build a complete solution" },
  { n: "03", t: "Get expert feedback" },
  { n: "04", t: "Ship something you can show" },
];

const OUTCOMES = [
  {
    n: "01",
    t: "A real-world project",
    d: "Built from scratch with real tools, datasets, and decisions.",
  },
  {
    n: "02",
    t: "A portfolio piece",
    d: "Something you can link to, demo, and walk through in any interview.",
  },
  {
    n: "03",
    t: "Industry-facing experience",
    d: "Expert reviews that mirror what engineering teams actually care about.",
  },
  {
    n: "04",
    t: "Resume & interview readiness",
    d: "Pro track adds a mock interview and direct resume feedback.",
  },
];

const STATS = [
  { value: 8, suffix: " weeks", label: "Program duration" },
  { value: MAX_SEATS, suffix: "", label: "Maximum seats" },
  { value: 2, suffix: "", label: "Expert review sessions" },
  { value: 4, suffix: "", label: "Domains covered" },
];

const FOR_YOU = [
  "You're a student or recent graduate in tech",
  "You want a real project, not another certificate",
  "You're building toward placements and want to stand out",
];

const NOT_FOR_YOU = [
  "You're looking for just a certificate to add to LinkedIn",
  "You won't commit time to actually building something",
  "You're expecting to be spoon-fed through the whole thing",
];

const FAQ_SCHEMA = [
  {
    "@type": "Question",
    name: "Who can apply for the Superbuilt Fellowship Cohort?",
    acceptedAnswer: {
      "@type": "Answer",
      text: `Students and recent graduates in AI, ML, Data Science, and Data Analytics. Open to the first ${MAX_SEATS} applicants — first come, first served.`,
    },
  },
  {
    "@type": "Question",
    name: "How long is the Superbuilt Fellowship?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "8 weeks, fully remote and flexible, project-based commitment.",
    },
  },
  {
    "@type": "Question",
    name: "What do fellows receive on completion?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Offer letter, completion certificate, merit-based letter of recommendation, and AI/ML/Data Science course access. Pro track adds mock interview and resume review.",
    },
  },
  {
    "@type": "Question",
    name: "How much does the Superbuilt Fellowship cost?",
    acceptedAnswer: {
      "@type": "Answer",
      text: "Core Track ₹499, Pro Track ₹999 — one-time. Comparable programs charge ₹10,000–₹25,000.",
    },
  },
];

/* ─────────── HOOKS ─────────── */
function useInView(ref, threshold = 0.12) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Skip animation if user prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return visible;
}

function useCounter(target, active, duration = 1600) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(target);
      return;
    }
    let startTime = null;
    let rafId;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [active, target, duration]);
  return count;
}

function useTilt(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Only on non-touch, non-reduced-motion devices
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${
        -y * 7
      }deg) scale(1.01)`;
    };
    const onLeave = () => {
      el.style.transform =
        "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);
}

/* ─────────── SEO ─────────── */
function useSEO() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title =
      "Superbuilt Fellowship Cohort — Build Real AI, ML & Data Projects in 8 Weeks";

    const setMeta = (name, content, isProp = false) => {
      const selector = isProp
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        isProp
          ? el.setAttribute("property", name)
          : el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const desc =
      "The Superbuilt Fellowship Cohort is an 8-week, project-driven virtual fellowship for students and recent graduates in AI, ML, Data Science, and Data Analytics. Build a real portfolio project, get expert reviews, and earn an industry-recognized certificate. Limited to 150 seats.";

    setMeta("description", desc);
    setMeta(
      "keywords",
      "AI fellowship India, ML fellowship students, data science virtual internship, AI internship 2025, machine learning project fellowship, data analytics fellowship, superbuilt fellowship cohort, tech fellowship students India, portfolio building program, AI project for students"
    );
    setMeta("robots", "index, follow");
    setMeta("author", "Superbuilt AI");

    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", CANONICAL_URL);

    setMeta("og:type", "website", true);
    setMeta(
      "og:title",
      "Superbuilt Fellowship Cohort — Become a Tech Builder",
      true
    );
    setMeta("og:description", desc, true);
    setMeta("og:url", CANONICAL_URL, true);
    setMeta("og:site_name", "Superbuilt AI", true);
    setMeta("og:image", OG_IMAGE, true);
    setMeta("twitter:card", "summary_large_image");
    setMeta(
      "twitter:title",
      "Superbuilt Fellowship Cohort — Become a Tech Builder"
    );
    setMeta(
      "twitter:description",
      "8-week project-driven fellowship. AI, ML, Data Science & Analytics. 150 seats. Apply now."
    );
    setMeta("twitter:image", OG_IMAGE);
    setMeta("twitter:site", "@superbuiltai");

    const oldScript = document.querySelector("#sb-jsonld");
    if (oldScript) oldScript.remove();

    const schema = document.createElement("script");
    schema.id = "sb-jsonld";
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "Course",
        name: "Superbuilt Fellowship Cohort",
        description:
          "An 8-week project-driven virtual fellowship for students and recent graduates in AI, ML, Data Science, and Data Analytics.",
        provider: {
          "@type": "Organization",
          name: "Superbuilt AI",
          sameAs: "https://superbuilt.ai",
        },
        educationalLevel: "Undergraduate, Graduate, Recent Graduate",
        timeRequired: "PT8W",
        courseMode: "online",
        offers: TRACKS.map((t) => ({
          "@type": "Offer",
          name: t.badge,
          price: t.id === "core" ? "499" : "999",
          priceCurrency: "INR",
          availability: "https://schema.org/LimitedAvailability",
          url: CANONICAL_URL,
        })),
        teaches: DOMAINS,
        inLanguage: "en",
        url: CANONICAL_URL,
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Superbuilt AI",
        url: "https://superbuilt.ai",
        description:
          "Superbuilt AI builds agentic AI tools for the AEC industry.",
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ_SCHEMA,
      },
    ]);
    document.head.appendChild(schema);

    return () => {
      document.title = prevTitle;
      const s = document.querySelector("#sb-jsonld");
      if (s) s.remove();
    };
  }, []);
}

/* ─────────── PRIMITIVES ─────────── */
const FadeUp = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const visible = useInView(ref);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(28px)",
        transition: `opacity 0.68s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.68s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

const Eyebrow = ({ children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 18,
    }}
  >
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: 24,
        height: 1,
        background: COLORS.borderHover,
      }}
    />
    <span
      style={{
        fontFamily: FONTS.display,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.18em",
        color: COLORS.muted,
      }}
    >
      {children}
    </span>
  </div>
);

const PulseDot = () => (
  <span
    aria-hidden="true"
    style={{
      position: "relative",
      display: "inline-flex",
      width: 8,
      height: 8,
      marginRight: 8,
      flexShrink: 0,
    }}
  >
    <span
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        background: COLORS.blue,
        opacity: 0.5,
        animation: "pulse-ring 2s ease-in-out infinite",
      }}
    />
    <span
      style={{
        position: "relative",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: COLORS.blue,
      }}
    />
  </span>
);

const StatusPill = ({ label = "Applications Active" }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 11,
      color: COLORS.blue,
      background: COLORS.blueAlpha8,
      border: `1px solid ${COLORS.blueAlpha18}`,
      padding: "4px 12px",
      borderRadius: 999,
    }}
  >
    <PulseDot />
    {label}
  </span>
);

const CheckItem = ({ children, dim = false }) => (
  <li
    style={{
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
      fontSize: 14,
      color: dim ? COLORS.muted : COLORS.text,
      lineHeight: 1.78,
    }}
  >
    <span
      aria-hidden="true"
      style={{
        flexShrink: 0,
        marginTop: 3,
        width: 16,
        height: 16,
        borderRadius: "50%",
        border: `1px solid ${dim ? COLORS.border : COLORS.blue}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {dim ? (
        <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
          <line
            x1="2"
            y1="2"
            x2="6"
            y2="6"
            stroke="#555"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="6"
            y1="2"
            x2="2"
            y2="6"
            stroke="#555"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
          <polyline
            points="1,4 3,6 7,2"
            fill="none"
            stroke={COLORS.blue}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
    {children}
  </li>
);

/* ─────────── APPLY BUTTON ─────────── */
const ApplyBtn = ({
  size = "md",
  label = "Apply Now — Free",
  full = false,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    } else {
      window.open(APPLY_URL, "_blank", "noopener,noreferrer");
    }
  }, [onClick]);

  const padding = size === "lg" ? "14px 36px" : "11px 24px";
  const fontSize = size === "lg" ? 14 : 13;

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      aria-label={label}
      style={{
        fontFamily: FONTS.display,
        fontWeight: 600,
        fontSize,
        letterSpacing: "-0.01em",
        border: "none",
        borderRadius: 999,
        background: COLORS.white,
        color: COLORS.black,
        cursor: "pointer",
        padding,
        width: full ? "100%" : "auto",
        transform: pressed ? "scale(0.97)" : hovered ? "scale(1.04)" : "scale(1)",
        transition:
          "transform 0.18s cubic-bezier(0.16,1,0.3,1), box-shadow 0.18s",
        boxShadow: hovered ? "0 0 0 1px rgba(255,255,255,0.25)" : "none",
      }}
    >
      {label}
    </button>
  );
};

/* ─────────── GHOST BUTTON ─────────── */
const GhostBtn = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = COLORS.borderHover;
      e.currentTarget.style.color = COLORS.text;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = COLORS.border;
      e.currentTarget.style.color = COLORS.muted;
    }}
    style={{
      fontFamily: FONTS.display,
      fontSize: 14,
      color: COLORS.muted,
      background: "transparent",
      border: `1px solid ${COLORS.border}`,
      padding: "14px 28px",
      borderRadius: 999,
      cursor: "pointer",
      transition: "border-color 0.2s, color 0.2s",
    }}
  >
    {label}
  </button>
);

/* ─────────── TILT CARD ─────────── */
const TiltCard = ({ children, style = {}, accent = false }) => {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  useTilt(ref);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: COLORS.surface,
        border: `1px solid ${hovered ? COLORS.borderHover : COLORS.border}`,
        borderRadius: 14,
        padding: 28,
        position: "relative",
        overflow: "hidden",
        transition:
          "border-color 0.22s, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
        willChange: "transform",
        ...style,
      }}
    >
      {/* Top accent line */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 1,
          width: hovered ? 0 : "40%",
          background: accent
            ? `linear-gradient(90deg, ${COLORS.blueAlpha18}, transparent)`
            : "linear-gradient(90deg, rgba(255,255,255,0.08), transparent)",
          transition: "width 0.3s",
        }}
      />
      {/* Shimmer on hover */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />
      {children}
    </div>
  );
};

/* ─────────── STAT ─────────── */
const Stat = ({ value, suffix, label }) => {
  const ref = useRef(null);
  const visible = useInView(ref);
  const count = useCounter(value, visible);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span
        aria-live="polite"
        style={{
          fontFamily: FONTS.display,
          fontWeight: 600,
          fontSize: 36,
          color: COLORS.white,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        {count}
        {suffix}
      </span>
      <span
        style={{
          fontSize: 12,
          color: COLORS.muted,
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </div>
  );
};

/* ─────────── STICKY BAR ─────────── */
const StickyBar = ({ visible }) => (
  <div
    role="complementary"
    aria-label="Apply for the fellowship"
    style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 200,
      background: "rgba(0,0,0,0.92)",
      backdropFilter: "blur(24px)",
      borderTop: `1px solid ${COLORS.border}`,
      padding: "14px 6vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 12,
      transform: visible ? "translateY(0)" : "translateY(100%)",
      transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span
        style={{
          fontFamily: FONTS.display,
          fontWeight: 600,
          fontSize: 15,
          color: COLORS.white,
        }}
      >
        Superbuilt Fellowship Cohort
      </span>
      <StatusPill />
    </div>
    <ApplyBtn size="md" label="Apply Now →" />
  </div>
);

/* ─────────── LEARN MORE MODAL ─────────── */
const LearnMoreModal = ({ onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    // Focus trap
    const el = modalRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    // Prevent body scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Initial focus
    first?.focus();

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(0,0,0,0.82)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5vw",
      }}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 18,
          padding: 36,
          maxWidth: 540,
          width: "100%",
          position: "relative",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: `1px solid ${COLORS.border}`,
            color: COLORS.muted,
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            borderRadius: "50%",
            width: 30,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = COLORS.borderHover;
            e.currentTarget.style.color = COLORS.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = COLORS.border;
            e.currentTarget.style.color = COLORS.muted;
          }}
        >
          ×
        </button>

        <Eyebrow>About This Program</Eyebrow>
        <h3
          id="modal-title"
          style={{
            fontFamily: FONTS.display,
            fontWeight: 600,
            fontSize: 22,
            color: COLORS.white,
            marginBottom: 16,
            letterSpacing: "-0.02em",
          }}
        >
          What makes this different?
        </h3>

        {[
          "Most virtual programs give you videos to watch. This fellowship gives you a real project to build — and puts it in front of people who have actually shipped products in the industry.",
          "You propose your own problem. You pick your own stack. You build, get reviewed, and iterate — exactly the way it works in real engineering teams.",
          `The fellowship spans 8 weeks, is fully remote, and is capped at ${MAX_SEATS} students. Seats are first come, first served — apply early.`,
        ].map((text, i) => (
          <p
            key={i}
            style={{
              fontSize: 14,
              color: COLORS.muted,
              lineHeight: 1.85,
              marginBottom: i < 2 ? 16 : 28,
            }}
          >
            {text}
          </p>
        ))}

        <ApplyBtn size="lg" label="Apply for the Fellowship →" full />
      </div>
    </div>
  );
};

/* ─────────── PAGE ─────────── */
export default function FellowshipPage() {
  useSEO();

  const [scrolled, setScrolled] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [heroScrollY, setHeroScrollY] = useState(0);

  const openLearnMore = useCallback(() => setShowLearnMore(true), []);
  const closeLearnMore = useCallback(() => setShowLearnMore(false), []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 120);
      setHeroScrollY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const heroParallax = Math.min(heroScrollY * 0.3, 60);
  const heroOpacity = Math.max(1 - heroScrollY / 480, 0.1);

  // Marquee items memoized to avoid recreation every render
  const marqueeItems = useMemo(
    () => [...DOMAINS, ...DOMAINS, ...DOMAINS, ...DOMAINS],
    []
  );

  return (
    <div
      style={{
        background: COLORS.black,
        color: COLORS.text,
        minHeight: "100vh",
        fontFamily: FONTS.body,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #1c1c1c; border-radius: 2px; }
        ::selection { background: rgba(255,255,255,0.1); }
        
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes word-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        .nav-btn:hover { transform: scale(1.04); }
        .nav-btn:active { transform: scale(0.97); }
        .word-in { animation: word-in 0.65s cubic-bezier(0.16,1,0.3,1) both; }

        @media (max-width: 640px) {
          .hero-headline { font-size: 40px !important; }
          .track-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* ─── STICKY APPLY BAR ─── */}
      <StickyBar visible={scrolled} />

      {/* ─── LEARN MORE MODAL ─── */}
      {showLearnMore && <LearnMoreModal onClose={closeLearnMore} />}

      {/* ─── SKIP LINK (accessibility) ─── */}
      <a
        href="#main-content"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
        onFocus={(e) => {
          e.currentTarget.style.position = "static";
          e.currentTarget.style.width = "auto";
          e.currentTarget.style.height = "auto";
        }}
        onBlur={(e) => {
          e.currentTarget.style.position = "absolute";
          e.currentTarget.style.left = "-9999px";
          e.currentTarget.style.width = "1px";
          e.currentTarget.style.height = "1px";
        }}
      >
        Skip to main content
      </a>

      {/* ─── NAV ─── */}
      <header>
        <nav
          aria-label="Main navigation"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            height: 60,
            background: "rgba(0,0,0,0.96)",
            backdropFilter: "blur(24px)",
            borderBottom: "1px solid #0e0e0e",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 5vw",
          }}
        >
          <a
            href="https://superbuilt.ai"
            aria-label="Superbuilt AI — Home"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: COLORS.white,
                animation: "blink 3s ease-in-out infinite",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: FONTS.display,
                fontWeight: 600,
                fontSize: 14,
                color: COLORS.white,
                letterSpacing: "-0.02em",
              }}
            >
              Superbuilt{" "}
              <span style={{ fontWeight: 300, color: "#444" }}>AI</span>
            </span>
          </a>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              onClick={openLearnMore}
              className="nav-btn"
              style={{
                fontFamily: FONTS.display,
                fontSize: 12,
                color: COLORS.muted,
                background: "transparent",
                border: `1px solid ${COLORS.border}`,
                padding: "7px 16px",
                borderRadius: 999,
                cursor: "pointer",
                transition: "transform 0.15s, border-color 0.15s",
              }}
            >
              Learn More
            </button>
            <button
              type="button"
              onClick={() =>
                window.open(APPLY_URL, "_blank", "noopener,noreferrer")
              }
              className="nav-btn"
              style={{
                fontFamily: FONTS.display,
                fontWeight: 600,
                fontSize: 13,
                background: COLORS.white,
                color: COLORS.black,
                border: "none",
                padding: "8px 20px",
                borderRadius: 999,
                cursor: "pointer",
                transition: "transform 0.15s",
              }}
            >
              Apply Now
            </button>
          </div>
        </nav>
      </header>

      {/* ─── MAIN ─── */}
      <main id="main-content">
        {/* ─── HERO ─── */}
        <section
          aria-labelledby="hero-heading"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "120px 6vw 100px",
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              transform: `translateY(${heroParallax}px)`,
              opacity: heroOpacity,
            }}
          >
            {/* Status */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 32,
                flexWrap: "wrap",
              }}
            >
              <StatusPill />
              <span
                style={{
                  fontSize: 11,
                  color: COLORS.faint,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                Cohort 1 · {MAX_SEATS} seats max
              </span>
            </div>

            {/* Headline */}
            <h1
              id="hero-heading"
              className="hero-headline"
              style={{
                fontFamily: FONTS.display,
                fontWeight: 600,
                fontSize: "clamp(40px, 6.5vw, 76px)",
                color: COLORS.white,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                marginBottom: 6,
              }}
            >
              {["Become", "a"].map((word, i) => (
                <span
                  key={word + i}
                  className="word-in"
                  style={{
                    display: "inline-block",
                    marginRight: "0.22em",
                    animationDelay: `${0.1 + i * 0.07}s`,
                  }}
                >
                  {word}
                </span>
              ))}
              <br />
              {["Tech", "Builder."].map((word, i) => (
                <span
                  key={word + i}
                  className="word-in"
                  style={{
                    display: "inline-block",
                    marginRight: "0.22em",
                    animationDelay: `${0.24 + i * 0.07}s`,
                    color: i === 1 ? COLORS.dim : COLORS.white,
                    fontWeight: i === 1 ? 300 : 600,
                  }}
                >
                  {word}
                </span>
              ))}
            </h1>

            <p
              style={{
                fontSize: "clamp(14px, 1.8vw, 17px)",
                color: COLORS.muted,
                lineHeight: 1.85,
                maxWidth: 520,
                marginBottom: 40,
                marginTop: 20,
              }}
            >
              The Superbuilt Fellowship Cohort. Build real-world projects across
              AI, ML, Data Science and Analytics — guided by practitioners — in
              8 weeks.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                alignItems: "center",
              }}
            >
              <ApplyBtn size="lg" label="Apply for the Fellowship →" />
              <GhostBtn label="Learn More" onClick={openLearnMore} />
            </div>

            <p
              style={{
                fontSize: 12,
                color: COLORS.dim,
                marginTop: 18,
              }}
            >
              First come, first served · Limited to {MAX_SEATS} students &
              recent graduates
            </p>
          </div>
        </section>

        {/* ─── DOMAIN MARQUEE ─── */}
        <div
          aria-hidden="true"
          style={{
            borderTop: "1px solid #111",
            borderBottom: "1px solid #111",
            padding: "13px 0",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 60,
              whiteSpace: "nowrap",
              animation: "marquee 24s linear infinite",
              width: "max-content",
            }}
          >
            {marqueeItems.map((domain, i) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  color: i % 2 === 0 ? COLORS.muted : COLORS.dim,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                }}
              >
                {domain}
              </span>
            ))}
          </div>
        </div>

        {/* ─── STATS ─── */}
        <section
          aria-label="Fellowship statistics"
          style={{ padding: "80px 6vw", maxWidth: 960, margin: "0 auto" }}
        >
          <div
            className="stats-grid"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 32,
              justifyContent: "space-around",
            }}
          >
            {STATS.map((stat) => (
              <Stat key={stat.label} {...stat} />
            ))}
          </div>
        </section>

        {/* ─── PAIN SECTION ─── */}
        <section
          aria-labelledby="pain-heading"
          style={{ padding: "80px 6vw", borderTop: "1px solid #111" }}
        >
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <FadeUp>
              <Eyebrow>The Real Problem</Eyebrow>
              <h2
                id="pain-heading"
                style={{
                  fontFamily: FONTS.display,
                  fontWeight: 600,
                  fontSize: "clamp(26px, 4vw, 44px)",
                  color: COLORS.white,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  marginBottom: 16,
                  maxWidth: 600,
                }}
              >
                Most students don't lack skills.
                <br />
                <span style={{ color: "#444", fontWeight: 300 }}>
                  They lack proof of work.
                </span>
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: COLORS.muted,
                  lineHeight: 1.85,
                  maxWidth: 500,
                  marginBottom: 48,
                }}
              >
                No real projects. No industry exposure. No feedback from people
                who've actually built things. So their resume looks exactly like
                everyone else's.
              </p>
            </FadeUp>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 13,
              }}
            >
              {PAIN_CARDS.map((card, i) => (
                <FadeUp key={card.t} delay={i * 0.08}>
                  <TiltCard>
                    <div
                      style={{
                        fontFamily: FONTS.display,
                        fontWeight: 500,
                        color: COLORS.white,
                        fontSize: 15,
                        marginBottom: 10,
                      }}
                    >
                      {card.t}
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: COLORS.muted,
                        lineHeight: 1.78,
                      }}
                    >
                      {card.d}
                    </p>
                  </TiltCard>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WHAT IS THIS ─── */}
        <section
          aria-labelledby="what-heading"
          style={{ padding: "80px 6vw", borderTop: "1px solid #111" }}
        >
          <div
            style={{
              maxWidth: 960,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 60,
            }}
          >
            <FadeUp>
              <Eyebrow>What This Is</Eyebrow>
              <h2
                id="what-heading"
                style={{
                  fontFamily: FONTS.display,
                  fontWeight: 600,
                  fontSize: "clamp(24px, 3.5vw, 38px)",
                  color: COLORS.white,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.12,
                  marginBottom: 20,
                }}
              >
                Not a course.
                <br />
                Not an internship.
                <br />
                <span style={{ color: "#444", fontWeight: 300 }}>
                  A project-driven fellowship.
                </span>
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: COLORS.muted,
                  lineHeight: 1.85,
                }}
              >
                You come with intent. You leave with proof. Propose your own
                problem, build a complete solution, get expert feedback, and
                ship something you can actually show.
              </p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <ol
                aria-label="Fellowship process steps"
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 13,
                }}
              >
                {STEPS.map((step) => (
                  <li
                    key={step.n}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "16px 20px",
                      background: COLORS.surface,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 10,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        fontFamily: FONTS.display,
                        fontWeight: 300,
                        fontSize: 22,
                        color: COLORS.dimmer,
                        letterSpacing: "-0.04em",
                        minWidth: 30,
                      }}
                    >
                      {step.n}
                    </span>
                    <span
                      style={{
                        fontFamily: FONTS.display,
                        fontWeight: 500,
                        fontSize: 14,
                        color: COLORS.text,
                      }}
                    >
                      {step.t}
                    </span>
                  </li>
                ))}
              </ol>
            </FadeUp>
          </div>
        </section>

        {/* ─── TIMELINE ─── */}
        <section
          aria-labelledby="timeline-heading"
          style={{ padding: "80px 6vw", borderTop: "1px solid #111" }}
        >
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <FadeUp>
              <Eyebrow>8-Week Structure</Eyebrow>
              <h2
                id="timeline-heading"
                style={{
                  fontFamily: FONTS.display,
                  fontWeight: 600,
                  fontSize: "clamp(22px, 3.5vw, 36px)",
                  color: COLORS.white,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.12,
                  marginBottom: 40,
                }}
              >
                What the 8 weeks actually look like.
              </h2>
            </FadeUp>

            <ol aria-label="Weekly schedule" style={{ listStyle: "none" }}>
              {WEEKS.map((week, i) => (
                <FadeUp key={week.w} delay={i * 0.06}>
                  <li
                    style={{
                      display: "flex",
                      gap: 24,
                      alignItems: "flex-start",
                      padding: "22px 0",
                      borderBottom: "1px solid #111",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONTS.display,
                        fontWeight: 500,
                        fontSize: 11,
                        color: COLORS.blue,
                        minWidth: 56,
                        paddingTop: 2,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        flexShrink: 0,
                      }}
                    >
                      {week.w}
                    </span>
                    <div>
                      <div
                        style={{
                          fontFamily: FONTS.display,
                          fontWeight: 500,
                          color: COLORS.white,
                          fontSize: 15,
                          marginBottom: 5,
                        }}
                      >
                        {week.t}
                      </div>
                      <p
                        style={{
                          fontSize: 13,
                          color: COLORS.muted,
                          lineHeight: 1.78,
                        }}
                      >
                        {week.d}
                      </p>
                    </div>
                  </li>
                </FadeUp>
              ))}
            </ol>
          </div>
        </section>

        {/* ─── TRACKS ─── */}
        <section
          aria-labelledby="tracks-heading"
          style={{ padding: "80px 6vw", borderTop: "1px solid #111" }}
        >
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <FadeUp>
              <Eyebrow>What You Get</Eyebrow>
              <h2
                id="tracks-heading"
                style={{
                  fontFamily: FONTS.display,
                  fontWeight: 600,
                  fontSize: "clamp(22px, 3.5vw, 36px)",
                  color: COLORS.white,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.12,
                  marginBottom: 8,
                }}
              >
                Two tracks. One goal.
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: COLORS.muted,
                  lineHeight: 1.85,
                  marginBottom: 40,
                  maxWidth: 480,
                }}
              >
                Both tracks are priced to be accessible. Pick the one that
                matches where you want to go.
              </p>
            </FadeUp>

            <div
              className="track-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 13,
              }}
            >
              {TRACKS.map((track, i) => (
                <FadeUp key={track.id} delay={i * 0.1}>
                  <TiltCard
                    accent={track.accent}
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 16,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: 5,
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          background: track.accent
                            ? COLORS.blueAlpha8
                            : "#111",
                          color: track.accent ? COLORS.blue : COLORS.muted,
                          border: `1px solid ${
                            track.accent ? COLORS.blueAlpha20 : COLORS.border
                          }`,
                        }}
                      >
                        {track.badge}
                      </span>
                      <span
                        style={{
                          fontFamily: FONTS.display,
                          fontWeight: 600,
                          fontSize: 18,
                          color: COLORS.white,
                        }}
                      >
                        {track.price}
                      </span>
                    </div>

                    <div
                      style={{
                        fontFamily: FONTS.display,
                        fontWeight: 600,
                        fontSize: 17,
                        color: COLORS.white,
                        marginBottom: 6,
                      }}
                    >
                      {track.headline}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        borderTop: `1px solid ${COLORS.border}`,
                        paddingTop: 20,
                        marginTop: 16,
                      }}
                    >
                      <ul
                        aria-label={`${track.badge} benefits`}
                        style={{
                          listStyle: "none",
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                        }}
                      >
                        {track.bullets.map((bullet, j) => (
                          <CheckItem key={j}>{bullet}</CheckItem>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        window.open(
                          `${APPLY_URL}?track=${track.id}`,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                      style={{
                        marginTop: 24,
                        width: "100%",
                        padding: "12px 0",
                        borderRadius: 999,
                        fontFamily: FONTS.display,
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                        border: "none",
                        background: track.accent ? COLORS.blue : COLORS.white,
                        color: COLORS.black,
                        transition: "transform 0.15s, opacity 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.03)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                      onMouseDown={(e) =>
                        (e.currentTarget.style.transform = "scale(0.97)")
                      }
                      onMouseUp={(e) =>
                        (e.currentTarget.style.transform = "scale(1.03)")
                      }
                    >
                      Apply — {track.badge}
                    </button>
                  </TiltCard>
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={0.15}>
              <p
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  color: COLORS.dim,
                  marginTop: 20,
                }}
              >
                Comparable programs cost ₹10,000–₹25,000. This fellowship is
                priced for access — not because it lacks value.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* ─── WHO IT'S FOR ─── */}
        <section
          aria-labelledby="who-heading"
          style={{ padding: "80px 6vw", borderTop: "1px solid #111" }}
        >
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <FadeUp>
              <Eyebrow>Who It's For</Eyebrow>
              <h2
                id="who-heading"
                style={{
                  fontFamily: FONTS.display,
                  fontWeight: 600,
                  fontSize: "clamp(22px, 3.5vw, 36px)",
                  color: COLORS.white,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.12,
                  marginBottom: 32,
                }}
              >
                Be honest with yourself.
              </h2>
            </FadeUp>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 13,
              }}
            >
              <FadeUp>
                <TiltCard>
                  <div
                    style={{
                      fontFamily: FONTS.display,
                      fontWeight: 600,
                      color: COLORS.white,
                      fontSize: 15,
                      marginBottom: 20,
                    }}
                  >
                    This is for you if —
                  </div>
                  <ul
                    aria-label="Fellowship is a good fit if"
                    style={{
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    {FOR_YOU.map((text, i) => (
                      <CheckItem key={i}>{text}</CheckItem>
                    ))}
                  </ul>
                </TiltCard>
              </FadeUp>

              <FadeUp delay={0.1}>
                <TiltCard>
                  <div
                    style={{
                      fontFamily: FONTS.display,
                      fontWeight: 600,
                      color: COLORS.white,
                      fontSize: 15,
                      marginBottom: 20,
                    }}
                  >
                    This is not for you if —
                  </div>
                  <ul
                    aria-label="Fellowship is not a good fit if"
                    style={{
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    {NOT_FOR_YOU.map((text, i) => (
                      <CheckItem key={i} dim>
                        {text}
                      </CheckItem>
                    ))}
                  </ul>
                </TiltCard>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ─── OUTCOMES ─── */}
        <section
          aria-labelledby="outcomes-heading"
          style={{ padding: "80px 6vw", borderTop: "1px solid #111" }}
        >
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <FadeUp>
              <Eyebrow>What You'll Leave With</Eyebrow>
              <h2
                id="outcomes-heading"
                style={{
                  fontFamily: FONTS.display,
                  fontWeight: 600,
                  fontSize: "clamp(22px, 3.5vw, 36px)",
                  color: COLORS.white,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.12,
                  marginBottom: 8,
                }}
              >
                By the end of 8 weeks.
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: COLORS.muted,
                  marginBottom: 40,
                }}
              >
                Not a course badge. Actual proof you can point to.
              </p>
            </FadeUp>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 13,
              }}
            >
              {OUTCOMES.map((item, i) => (
                <FadeUp key={item.n} delay={i * 0.07}>
                  <TiltCard style={{ height: "100%" }}>
                    <div
                      aria-hidden="true"
                      style={{
                        fontFamily: FONTS.display,
                        fontWeight: 300,
                        fontSize: 22,
                        color: COLORS.dimmer,
                        letterSpacing: "-0.04em",
                        marginBottom: 10,
                      }}
                    >
                      {item.n}
                    </div>
                    <div
                      style={{
                        fontFamily: FONTS.display,
                        fontWeight: 500,
                        color: COLORS.white,
                        fontSize: 14,
                        marginBottom: 7,
                      }}
                    >
                      {item.t}
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: COLORS.muted,
                        lineHeight: 1.78,
                      }}
                    >
                      {item.d}
                    </p>
                  </TiltCard>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section
          aria-labelledby="cta-heading"
          style={{
            padding: "100px 6vw 160px",
            borderTop: "1px solid #111",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <FadeUp>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginBottom: 24,
                }}
              >
                <PulseDot />
                <span
                  style={{
                    fontSize: 11,
                    color: COLORS.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                  }}
                >
                  Cohort 1 · Applications Active
                </span>
              </div>

              <h2
                id="cta-heading"
                style={{
                  fontFamily: FONTS.display,
                  fontWeight: 600,
                  fontSize: "clamp(30px, 5vw, 58px)",
                  color: COLORS.white,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.08,
                  marginBottom: 16,
                }}
              >
                Stop collecting certificates.
                <br />
                <span style={{ color: COLORS.dim, fontWeight: 300 }}>
                  Start building proof.
                </span>
              </h2>

              <p
                style={{
                  fontSize: 15,
                  color: COLORS.muted,
                  lineHeight: 1.85,
                  marginBottom: 36,
                }}
              >
                The Superbuilt Fellowship Cohort is open to the first{" "}
                {MAX_SEATS} students and recent graduates who apply. No
                waitlists, no selections — seats are filled in the order
                applications come in.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  justifyContent: "center",
                }}
              >
                <ApplyBtn size="lg" label="Apply for the Fellowship →" />
                <GhostBtn label="Learn More" onClick={openLearnMore} />
              </div>
            </FadeUp>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer
        style={{
          borderTop: "1px solid #111",
          padding: "24px 6vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 64,
        }}
      >
        <a
          href="https://superbuilt.ai"
          aria-label="Superbuilt AI"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: COLORS.white,
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: FONTS.display,
              fontWeight: 600,
              fontSize: 13,
              color: COLORS.white,
            }}
          >
            Superbuilt <span style={{ fontWeight: 300, color: COLORS.dim }}>AI</span>
          </span>
        </a>
        <span style={{ fontSize: 11, color: COLORS.dim }}>
          © 2025 Superbuilt AI · Fellowship Cohort 1
        </span>
      </footer>
    </div>
  );
}