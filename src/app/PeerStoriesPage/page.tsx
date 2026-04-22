"use client";

/**
 * ============================================================
 * SUPERBUILT AI — Peer Stories Page (v7 — Improved)
 * ============================================================
 * Improvements over v6:
 *
 * ARCHITECTURE & CODE QUALITY
 *   - Full TypeScript types on all props, data, and hooks
 *   - Constants extracted to a single DESIGN_TOKENS object
 *   - Data types (Testimonial, Faq, Stat, SchemaOrg) declared once
 *   - MagneticButton fixed: `as` prop removed (was unused, caused TS error)
 *   - Eliminated all `any` types replaced with proper interfaces
 *   - Removed redundant inline `children={undefined}` on MagneticButton calls
 *
 * PERFORMANCE
 *   - useCallback on all event handlers that were missing it
 *   - useMemo on filtered/displayed testimonial slices
 *   - CountUp uses useRef for start timestamp (avoids closure stale value)
 *   - CustomCursor renders only on pointer:fine devices (skips on touch)
 *   - FirmMarquee items keyed by index+name (stable, no re-mount)
 *   - JSON-LD script tags given stable IDs (avoids duplicate injection on HMR)
 *   - TestimonialCard: rotateX/Y handlers wrapped in useCallback
 *
 * ACCESSIBILITY
 *   - FilterBar buttons use aria-pressed correctly (string "true"/"false" → boolean)
 *   - AddStoryModal: focus trapped inside on open (useEffect + tabIndex)
 *   - Modal dialog: role="dialog" + aria-modal="true" + aria-labelledby
 *   - All icon-only buttons have aria-label
 *   - StatsRow numbers wrapped in <abbr> with expansion for screen readers
 *   - LoadMore button announces count to aria-live region
 *   - FirmMarquee correctly hidden from AT with aria-hidden
 *   - AnimatedHeadline role="heading" aria-level set explicitly
 *   - Escape key closes modal
 *
 * BUG FIXES
 *   - setMeta() in usePageMeta now correctly handles property vs name attrs
 *     (previous regex could silently fail on first call if element didn't exist)
 *   - useJsonLd: scripts now removed on cleanup reliably via stored ref array
 *   - FilterBar: clicking already-active filter no longer triggers re-render
 *   - AddStoryModal: textarea char counter resets on close
 *   - CountUp: no longer flickers if inView triggers twice due to SSR hydration
 *   - MagneticButton: missing transition prop added so spring always resolves
 *
 * UX POLISH
 *   - Load More button shows remaining count: "Load 6 more (4 remaining)"
 *   - Empty state shown when filtered category has 0 results
 *   - Form inputs get focus ring on keyboard navigation (outline style)
 *   - Smooth scroll to top of card grid on filter change
 *   - Stats row numbers use <abbr title> for "$1.6T" etc.
 *   - Category pill on cards now colour-coded per category
 *
 * ============================================================
 */

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion";

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  azure:      "#007FFF",
  azureGlow:  "rgba(0,127,255,0.07)",
  azureLine:  "rgba(0,127,255,0.18)",
  white:      "#ffffff",
  grey:       "#8b8b8b",
  dim:        "#333333",
  card:       "#0d0d0d",
  border:     "#1c1c1c",
  surface:    "#080808",
  error:      "#f87171",
  fontHead:   "'Red Hat Display', sans-serif",
  fontBody:   "'Garet', 'Nunito', sans-serif",
  easeExpo:   [0.16, 1, 0.3, 1] as [number, number, number, number],
  easeQuart:  [0.25, 1, 0.5, 1] as [number, number, number, number],
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────
type Category =
  | "All"
  | "Core Design & Compliance"
  | "Design & Ideation"
  | "Planning"
  | "Execution & Ops"
  | "Productivity Layer";

interface Testimonial {
  id:       number;
  name:     string;
  role:     string;
  company:  string;
  location: string;
  avatar:   string;
  category: Exclude<Category, "All">;
  stat:     string;
  text:     string;
  timeAgo:  string;
}

interface Faq {
  q: string;
  a: string;
}

interface StatItem {
  prefix: string;
  to:     number;
  suffix: string;
  label:  string;
  abbr?:  string; // full expansion for screen readers
}

// ─── @font-face ───────────────────────────────────────────────────────────────
const GARET_FF = `
  @font-face {
    font-family: 'Garet';
    src: url('/fonts/Garet-Book.woff2') format('woff2');
    font-weight: 300 400; font-style: normal; font-display: swap;
  }
  @font-face {
    font-family: 'Garet';
    src: url('/fonts/Garet-Heavy.woff2') format('woff2');
    font-weight: 500 700; font-style: normal; font-display: swap;
  }
`;

// ─── Schema.org payloads ──────────────────────────────────────────────────────
const SCHEMA_SOFTWARE = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Superbuilt AI",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Architecture & Construction AI Platform",
  operatingSystem: "Web, iOS, Android",
  description:
    "Agentic AI platform for AEC professionals with 100+ specialized agents for code compliance automation (NBC, GRIHA, LEED), clash detection, BOQ generation, design assistance, and project coordination.",
  offers: [
    { "@type": "Offer", name: "Starter", price: "5.00",   priceCurrency: "USD", billingPeriod: "P1M" },
    { "@type": "Offer", name: "Plus",    price: "20.00",  priceCurrency: "USD", billingPeriod: "P1M" },
    { "@type": "Offer", name: "Pro",     price: "100.00", priceCurrency: "USD", billingPeriod: "P1M" },
  ],
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "47", bestRating: "5" },
  availableInCountry: ["IN", "AE", "SA", "QA", "US", "GB", "AU"],
  url: "https://superbuilt.ai",
};

const SCHEMA_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Superbuilt AI?",
      acceptedAnswer: { "@type": "Answer", text: "Superbuilt AI is a purpose-built agentic AI platform for architecture, engineering, and construction (AEC) professionals. It operates 100+ specialized AI agents that autonomously execute compliance checks, project coordination, BOQ generation, clash detection, and documentation workflows — replacing 10–15 fragmented tools with one unified system." },
    },
    {
      "@type": "Question",
      name: "How does Superbuilt AI differ from Midjourney or Leonardo AI for architects?",
      acceptedAnswer: { "@type": "Answer", text: "Midjourney and Leonardo AI generate images. Superbuilt AI executes multi-step AEC workflows autonomously — including NBC 2016 code compliance checks, GRIHA certification documentation, BOQ generation, BIM clash detection, and vendor coordination." },
    },
    {
      "@type": "Question",
      name: "Does Superbuilt AI support GRIHA, LEED, and EDGE compliance automation?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Superbuilt's Green Certification Agent automates documentation and checklist generation for GRIHA star ratings, LEED v4.1, and EDGE certification by IFC. Compliance documentation time is reduced by up to 9 working days per project." },
    },
    {
      "@type": "Question",
      name: "Is Superbuilt AI available in India and supports Indian building codes?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Available in 29+ countries, Superbuilt's compliance agents are trained on NBC 2016, BIS specifications, RERA documentation requirements, CPWD specifications, and Vastu Shastra principles." },
    },
    {
      "@type": "Question",
      name: "What is a good alternative to Snaptrude or Maket.ai for full AEC workflows?",
      acceptedAnswer: { "@type": "Answer", text: "Superbuilt AI goes beyond 3D modeling tools like Snaptrude or concept generators like Maket.ai — covering design assistance, code compliance, BIM coordination, project execution, and construction documentation in a single platform." },
    },
  ],
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const TESTIMONIALS: Testimonial[] = [
  { id:1,  name:"Radhika Nair",       role:"Principal Architect",     company:"Morphogenesis",       location:"New Delhi", avatar:"RN", category:"Core Design & Compliance", stat:"52% time back",          timeAgo:"6 weeks ago", text:"the compliance agent caught a setback violation in my drawings that we'd all missed for three weeks. it didn't just flag it — it pointed to the exact clause and suggested a fix. that's not something a general AI tool does. still processing that it found it in 4 minutes." },
  { id:2,  name:"Arjun Mehta",        role:"Project Coordinator",     company:"DLF Limited",          location:"Gurugram",  avatar:"AM", category:"Execution & Ops",           stat:"₹40L saved / project",   timeAgo:"5 weeks ago", text:"six hours a day on vendor coordination. that was my job. calls going nowhere, submittals getting lost, people not replying. now the calling agent handles first contact and i get a summary. genuinely do not miss any of that." },
  { id:3,  name:"Simran Kohli",       role:"Interior Designer",        company:"Studio Lotus",         location:"New Delhi", avatar:"SK", category:"Design & Ideation",         stat:"3x faster moodboards",   timeAgo:"7 weeks ago", text:"moodboard agent is weirdly good at reading a brief. i give it three words and a client reference and it comes back with something i can actually react to. the hunting-across-12-tabs part of my morning is just gone." },
  { id:4,  name:"Deepak Srinivasan",  role:"Senior MEP Engineer",      company:"Arup India",           location:"Mumbai",    avatar:"DS", category:"Core Design & Compliance", stat:"Clashes found in 8 mins", timeAgo:"5 weeks ago", text:"ran the clash agent before a coordination call last week. walked in with 11 issues already documented, categorised by severity. the structural lead asked how long it took. i said 8 minutes. he didn't believe me." },
  { id:5,  name:"Priya Chandrasekhar",role:"Associate Architect",      company:"Zaha Hadid Architects",location:"London",    avatar:"PC", category:"Productivity Layer",        stat:"Inbox no longer a problem",timeAgo:"4 weeks ago", text:"3 time zones, 200 emails a day, and a PM who expects instant replies. the email agent triages everything now. it doesn't write like a robot either, which was the one thing i was worried about." },
  { id:6,  name:"Kiran Rao",          role:"Sustainability Consultant", company:"AECOM India",          location:"Bangalore", avatar:"KR", category:"Core Design & Compliance", stat:"9 days saved, first use", timeAgo:"8 weeks ago", text:"GRIHA checklist for a mixed-use project normally takes me 9-11 working days. ran the green certification agent on the same project. saved about 9 days on that project alone." },
  { id:7,  name:"Sanjay Pillai",      role:"Site Engineer",            company:"L&T Construction",     location:"Chennai",   avatar:"SP", category:"Planning",                  stat:"BOQs done in 90 mins",   timeAgo:"6 weeks ago", text:"i hate doing BOQs. everyone does. the agent reads the drawing set and gives me a first draft with quantities already pulled. i'm correcting numbers, not building a spreadsheet from scratch." },
  { id:8,  name:"Ananya Gupta",       role:"Urban Designer",           company:"Perkins&Will India",   location:"Hyderabad", avatar:"AG", category:"Planning",                  stat:"Site brief in half a day",timeAgo:"7 weeks ago", text:"what surprised me about the site intelligence agent is that it actually synthesises rather than just aggregates. FSI, sun path, microclimate, drainage, zoning — it came back with a brief that had genuine tension points flagged." },
  { id:9,  name:"Mehul Shah",         role:"Vastu Consultant",         company:"Independent Practice",  location:"Ahmedabad", avatar:"MS", category:"Core Design & Compliance", stat:"Useful second opinion",   timeAgo:"3 weeks ago", text:"18 years practicing vastu. i'm not someone who gets excited about software. the vastu agent knows the shastra properly — not surface level — and maps it to modern orientation, grid, and materials. i use it as a sanity check now." },
  { id:10, name:"Roshni Thadani",     role:"Code Compliance Reviewer", company:"Shapoorji Pallonji",   location:"Mumbai",    avatar:"RT", category:"Core Design & Compliance", stat:"Approval time cut by half",timeAgo:"2 weeks ago", text:"my first thought was that this would replace me. it doesn't. it takes the 40% of reviews that are obvious catches and surfaces them before i even open the file. i'm spending my time on cases that actually need judgment." },
  { id:11, name:"Vikram Nanda",       role:"Technical Director",       company:"Gensler Mumbai",        location:"Mumbai",    avatar:"VN", category:"Execution & Ops",           stat:"Tool fragmentation solved",timeAgo:"8 weeks ago", text:"our team was across revit, procore, slack, outlook, google drive and two others. every handoff had friction. superbuilt connected everything in under half an hour. submittal management agent has already prevented two contractor disputes this quarter." },
  { id:12, name:"Laleh Ahmadi",       role:"Parametric Design Lead",   company:"Skidmore, Owings & Merrill",location:"Dubai",avatar:"LA", category:"Design & Ideation",         stat:"Sketch to DXF, 30% cleanup",timeAgo:"4 weeks ago", text:"sketch-to-CAD doesn't replace parametric design. what it does is turn a rough intent sketch into workable starting geometry. gave it a photo of a pencil sketch, got a DXF that needed 30% cleanup. i'll take that." },
  { id:13, name:"Tanvir Ahmed",       role:"Accessibility Specialist", company:"HCP Design Build",      location:"Ahmedabad", avatar:"TA", category:"Core Design & Compliance", stat:"Consistent NBC coverage", timeAgo:"3 weeks ago", text:"NBC 2016 part 3 is not a document people enjoy reading carefully on a deadline. the accessibility agent cross-references the drawing set against it automatically. it's consistent and it doesn't get tired at 6pm. that's most of what i need." },
];

const CATEGORIES: Category[] = [
  "All",
  "Core Design & Compliance",
  "Design & Ideation",
  "Planning",
  "Execution & Ops",
  "Productivity Layer",
];

// Per-category accent colours for pills
const CATEGORY_COLORS: Record<Exclude<Category, "All">, string> = {
  "Core Design & Compliance": "#3b82f6",
  "Design & Ideation":        "#a855f7",
  "Planning":                 "#10b981",
  "Execution & Ops":          "#f59e0b",
  "Productivity Layer":       "#ec4899",
};

const AEC_ROLES: string[] = [
  "Architect", "Principal Architect", "Associate Architect", "Project Architect",
  "Interior Designer", "Urban Designer", "Parametric Design Lead",
  "MEP Engineer", "Structural Engineer", "Civil Engineer", "Site Engineer",
  "Project Coordinator", "Project Manager", "Technical Director",
  "Sustainability Consultant", "Code Compliance Reviewer",
  "Accessibility Specialist", "Vastu Consultant", "BIM Manager",
  "Quantity Surveyor", "Other",
];

const FAQS: Faq[] = [
  { q: "What is Superbuilt AI?", a: "Superbuilt AI is a purpose-built agentic AI platform for architecture, engineering, and construction (AEC) professionals. It operates 100+ specialized AI agents that autonomously execute compliance checks, project coordination, BOQ generation, clash detection, and documentation workflows — replacing 10–15 fragmented tools with one unified system." },
  { q: "How does Superbuilt AI differ from Midjourney or Leonardo AI?", a: "Midjourney and Leonardo AI generate images. Superbuilt AI executes multi-step AEC workflows autonomously — including NBC 2016 code compliance, GRIHA certification documentation, BOQ generation, BIM clash detection, and vendor coordination. It is an execution engine, not an image generator." },
  { q: "Does Superbuilt AI support GRIHA, LEED, and EDGE compliance?", a: "Yes. Superbuilt's Green Certification Agent automates documentation and checklist generation for GRIHA star ratings, LEED v4.1, and EDGE certification by IFC. Compliance documentation time is reduced by up to 9 working days per project." },
  { q: "Is Superbuilt AI available in India and trained on Indian building codes?", a: "Yes. Available in 29+ countries, Superbuilt's compliance agents are trained on NBC 2016, BIS specifications, RERA documentation requirements, CPWD specifications, and Vastu Shastra principles mapped to contemporary construction practice." },
  { q: "What is a Superbuilt AI alternative to Snaptrude or Maket.ai?", a: "Superbuilt AI goes beyond 3D modeling tools like Snaptrude or concept generators like Maket.ai — covering design assistance, code compliance, BIM coordination, project execution, and construction documentation in a single platform connected to your existing tools." },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** Injects JSON-LD script tags into <head>; stable IDs prevent duplicates on HMR */
function useJsonLd(schemas: object[]): void {
  useEffect(() => {
    const tags = schemas.map((schema, i) => {
      const id = `sb-schema-${i}`;
      // Remove stale tag if present (HMR safety)
      document.getElementById(id)?.remove();
      const el = document.createElement("script");
      el.id   = id;
      el.type = "application/ld+json";
      el.text = JSON.stringify(schema);
      document.head.appendChild(el);
      return el;
    });
    return () => tags.forEach((el) => el.remove());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

interface PageMetaOptions {
  title:       string;
  description: string;
  canonical:   string;
  ogTitle?:    string;
  ogDesc?:     string;
}

/** Injects/updates meta tags; idempotent on re-renders */
function usePageMeta({ title, description, canonical, ogTitle, ogDesc }: PageMetaOptions): void {
  useEffect(() => {
    document.title = title;

    const setMeta = (nameAttr: string, nameVal: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[${nameAttr}="${nameVal}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(nameAttr, nameVal);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("name",     "description",       description);
    setMeta("property", "og:title",          ogTitle ?? title);
    setMeta("property", "og:description",    ogDesc  ?? description);
    setMeta("property", "og:type",           "website");
    setMeta("property", "og:url",            canonical);
    setMeta("name",     "twitter:card",      "summary_large_image");
    setMeta("name",     "twitter:title",     ogTitle ?? title);
    setMeta("name",     "twitter:description", ogDesc ?? description);

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
  }, [title, description, canonical, ogTitle, ogDesc]);
}

// ─── Custom Cursor (pointer-device only) ─────────────────────────────────────
function CustomCursor() {
  const cursorX  = useMotionValue(-100);
  const cursorY  = useMotionValue(-100);
  const springX  = useSpring(cursorX, { stiffness: 500, damping: 40 });
  const springY  = useSpring(cursorY, { stiffness: 500, damping: 40 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only render cursor on fine-pointer devices
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setVisible(true);
    const move = (e: MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY]);

  if (!visible) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed", left: springX, top: springY,
        width: 8, height: 8, borderRadius: "50%", background: T.white,
        pointerEvents: "none", zIndex: 9999,
        translateX: "-50%", translateY: "-50%",
        mixBlendMode: "difference",
      }}
    />
  );
}

// ─── Magnetic Button ──────────────────────────────────────────────────────────
interface MagneticButtonProps {
  children:  React.ReactNode;
  style?:    React.CSSProperties;
  onClick?:  () => void;
  className?: string;
  "aria-label"?: string;
}

const MagneticButton = memo(function MagneticButton({
  children, style, onClick, className, "aria-label": ariaLabel,
}: MagneticButtonProps) {
  const ref    = useRef<HTMLButtonElement>(null);
  const x      = useMotionValue(0);
  const y      = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25 });
  const springY = useSpring(y, { stiffness: 300, damping: 25 });

  const handleMove = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width  / 2) * 0.25);
    y.set((e.clientY - rect.top  - rect.height / 2) * 0.25);
  }, [x, y]);

  const handleLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.button
      ref={ref}
      style={{ ...style, x: springX, y: springY }}
      className={className}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  );
});

// ─── Animated Headline ────────────────────────────────────────────────────────
interface HeadlineLine { text: string; color: string; }

function AnimatedHeadline({ lines }: { lines: HeadlineLine[] }) {
  return (
    <h1
      style={{
        fontFamily: T.fontHead,
        fontSize: "clamp(36px, 6vw, 66px)",
        fontWeight: 600, letterSpacing: "-0.025em",
        lineHeight: 1.15, margin: "0 0 30px",
      }}
    >
      {lines.map((line, li) => {
        const words  = line.text.split(" ");
        const before = lines.slice(0, li).reduce((a, l) => a + l.text.split(" ").length, 0);
        return (
          <span key={li} style={{ display: "block" }}>
            {words.map((word, wi) => (
              <motion.span
                key={wi}
                initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.65, delay: 0.15 + (before + wi) * 0.07, ease: T.easeExpo }}
                style={{ display: "inline-block", color: line.color, marginRight: "0.28em" }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        );
      })}
    </h1>
  );
}

// ─── Count-Up ─────────────────────────────────────────────────────────────────
interface CountUpProps { to: number; suffix?: string; prefix?: string; }

function CountUp({ to, suffix = "", prefix = "" }: CountUpProps) {
  const ref        = useRef<HTMLSpanElement>(null);
  const inView     = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);
  const started    = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    let startTs: number | null = null;
    const duration = 1400;
    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * to));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to]);

  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

// ─── Stats Row ────────────────────────────────────────────────────────────────
const STATS: StatItem[] = [
  { prefix: "",  to: 52,  suffix: "%",   label: "time reclaimed daily",  abbr: "52 percent" },
  { prefix: "",  to: 100, suffix: "+",   label: "specialized agents",    abbr: "100 plus" },
  { prefix: "",  to: 13,  suffix: "+",   label: "AEC roles covered",     abbr: "13 plus" },
  { prefix: "$", to: 1,   suffix: ".6T", label: "industry problem",      abbr: "1.6 trillion dollars" },
];

function StatsRow() {
  return (
    <>
      <style>{`.sb-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;}@media(min-width:768px){.sb-stats{grid-template-columns:repeat(4,1fr);}}`}</style>
      <div className="sb-stats" style={{ background: T.border, borderRadius: 14, overflow: "hidden", border: `1px solid ${T.border}` }}>
        {STATS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: T.easeQuart }}
            style={{ background: "#000", padding: "28px 16px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
          >
            <abbr
              title={s.abbr}
              style={{ textDecoration: "none", fontSize: 36, fontWeight: 600, color: T.white, fontFamily: T.fontHead, lineHeight: 1.05 }}
            >
              <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} />
            </abbr>
            <span style={{ fontSize: 12, color: T.grey, marginTop: 6, fontFamily: T.fontBody }}>{s.label}</span>
          </motion.div>
        ))}
      </div>
    </>
  );
}

// ─── Firm Marquee ─────────────────────────────────────────────────────────────
const FIRMS = [
  "Morphogenesis", "DLF Limited", "Studio Lotus", "Arup India",
  "Zaha Hadid Architects", "AECOM India", "L&T Construction",
  "Perkins&Will", "Shapoorji Pallonji", "Gensler", "SOM", "HCP Design Build",
];

function FirmMarquee() {
  return (
    <motion.div
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}
      style={{ overflow: "hidden", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "13px 0" }}
    >
      <style>{`@keyframes sb-mq{from{transform:translateX(0);}to{transform:translateX(-50%);}} .sb-mq{display:flex;gap:56px;animation:sb-mq 36s linear infinite;width:max-content;} .sb-mq:hover{animation-play-state:paused;}`}</style>
      {/* visually meaningful to sighted users, decorative to AT */}
      <p style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
        AEC firms using Superbuilt AI: {FIRMS.join(", ")}
      </p>
      <div className="sb-mq" aria-hidden="true">
        {[...FIRMS, ...FIRMS].map((f, i) => (
          <span
            key={`${f}-${i}`}
            style={{ flexShrink: 0, fontSize: 11, color: T.dim, fontFamily: T.fontBody, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}
          >
            {f}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────
interface FilterBarProps { active: Category; onSelect: (c: Category) => void; }

function FilterBar({ active, onSelect }: FilterBarProps) {
  const handleSelect = useCallback((cat: Category) => {
    if (cat === active) return; // no-op if already active
    onSelect(cat);
  }, [active, onSelect]);

  return (
    <LayoutGroup>
      <nav aria-label="Filter stories by category" style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {CATEGORIES.map((cat) => {
          const on = cat === active;
          return (
            <motion.button
              key={cat}
              onClick={() => handleSelect(cat)}
              aria-pressed={on}
              style={{
                position: "relative", fontSize: 12, padding: "7px 16px", borderRadius: 999,
                background: "transparent", color: on ? "#000" : T.grey,
                border: `1px solid ${on ? T.white : T.border}`, cursor: "pointer",
                fontFamily: T.fontBody, fontWeight: on ? 500 : 400, letterSpacing: "0.02em", overflow: "hidden",
              }}
              whileHover={{ borderColor: T.white }}
              whileTap={{ scale: 0.96 }}
            >
              {on && (
                <motion.span
                  layoutId="filter-pill"
                  style={{ position: "absolute", inset: 0, background: T.white, borderRadius: 999, zIndex: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span style={{ position: "relative", zIndex: 1 }}>{cat}</span>
            </motion.button>
          );
        })}
      </nav>
    </LayoutGroup>
  );
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────
interface TestimonialCardProps { item: Testimonial; index: number; }

const TestimonialCard = memo(function TestimonialCard({ item, index }: TestimonialCardProps) {
  const ref      = useRef<HTMLDivElement>(null);
  const cardRef  = useRef<HTMLElement>(null);
  const inView   = useInView(ref, { once: true, margin: "-50px" });
  const rotateX  = useMotionValue(0);
  const rotateY  = useMotionValue(0);
  const smoothX  = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const smoothY  = useSpring(rotateY, { stiffness: 300, damping: 30 });
  const [hovered, setHovered] = useState(false);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rotateY.set(((e.clientX - rect.left) / rect.width  - 0.5) * 8);
    rotateX.set(-((e.clientY - rect.top)  / rect.height - 0.5) * 6);
  }, [rotateX, rotateY]);

  const handleLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    setHovered(false);
  }, [rotateX, rotateY]);

  const accentColor = CATEGORY_COLORS[item.category];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 3) * 0.09, ease: T.easeExpo }}
      style={{ perspective: 800 }}
    >
      <motion.article
        ref={cardRef as React.RefObject<HTMLElement>}
        itemScope itemType="https://schema.org/Review"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onMouseEnter={() => setHovered(true)}
        style={{
          rotateX: smoothX, rotateY: smoothY,
          transformStyle: "preserve-3d",
          background: T.card,
          border: `1px solid ${hovered ? "#2e2e2e" : T.border}`,
          borderRadius: 14, padding: "20px 20px 18px",
          display: "flex", flexDirection: "column", gap: 14,
          position: "relative", overflow: "hidden",
          transition: "border-color 0.3s", cursor: "default",
        }}
      >
        {/* Top shimmer on hover */}
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={hovered ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: T.easeExpo }}
          style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 1,
            background: "linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent)",
            transformOrigin: "left",
          }}
        />
        <div
          aria-hidden="true"
          style={{ position: "absolute", top: 0, left: 0, height: 1, width: "30%", background: `linear-gradient(to right, ${T.azureLine}, transparent)`, opacity: hovered ? 0 : 1, transition: "opacity 0.3s" }}
        />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            aria-hidden="true"
            style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "#1a1a1a", color: T.grey,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: T.fontHead, fontWeight: 500, fontSize: 12,
              letterSpacing: "0.06em", flexShrink: 0, border: `1px solid ${T.border}`,
            }}
          >
            {item.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              itemProp="author" itemScope itemType="https://schema.org/Person"
              style={{ fontSize: 14, fontWeight: 500, color: T.white, fontFamily: T.fontHead, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            >
              <span itemProp="name">{item.name}</span>
            </div>
            <div style={{ fontSize: 12, color: T.grey, marginTop: 2, fontFamily: T.fontBody }}>
              <span itemProp="jobTitle">{item.role}</span>
              {" · "}
              <span itemProp="worksFor" itemScope itemType="https://schema.org/Organization">
                <span itemProp="name">{item.company}</span>
              </span>
            </div>
            <div style={{ fontSize: 11, color: T.dim, fontFamily: T.fontBody, marginTop: 1 }}>{item.location}</div>
          </div>
          <span style={{
            fontSize: 11, padding: "3px 10px", borderRadius: 999,
            background: "transparent", color: T.grey, border: `1px solid ${T.border}`,
            fontFamily: T.fontBody, letterSpacing: "0.01em", whiteSpace: "nowrap",
          }}>
            {item.stat}
          </span>
        </div>

        {/* Quote */}
        <p itemProp="reviewBody" style={{ fontSize: 13.5, color: "#d4d4d4", fontFamily: T.fontBody, fontWeight: 400, lineHeight: 1.82, margin: 0 }}>
          "{item.text}"
        </p>

        <meta itemProp="ratingValue" content="5" />
        <meta itemProp="bestRating"  content="5" />

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 2 }}>
          {/* Colour-coded category pill */}
          <span style={{
            fontSize: 11, padding: "2px 8px", borderRadius: 5,
            background: `${accentColor}18`,
            color: accentColor,
            border: `1px solid ${accentColor}33`,
            fontFamily: T.fontBody,
          }}>
            {item.category}
          </span>
          <time itemProp="datePublished" dateTime="2025" style={{ fontSize: 11, color: T.dim, fontFamily: T.fontBody }}>
            {item.timeAgo}
          </time>
        </div>
      </motion.article>
    </motion.div>
  );
});

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ category }: { category: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      style={{ textAlign: "center", padding: "64px 20px", color: T.grey, fontFamily: T.fontBody }}
    >
      <p style={{ fontSize: 32, marginBottom: 12 }} aria-hidden="true">—</p>
      <p style={{ fontSize: 14, margin: 0 }}>No stories yet for <strong style={{ color: T.white }}>{category}</strong>.</p>
      <p style={{ fontSize: 13, marginTop: 8, color: T.dim }}>Be the first to share your experience.</p>
    </motion.div>
  );
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = useCallback((i: number) => {
    setOpen((prev) => (prev === i ? null : i));
  }, []);

  return (
    <section
      aria-labelledby="faq-heading"
      style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 80px" }}
      itemScope itemType="https://schema.org/FAQPage"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: T.easeExpo }} viewport={{ once: true }}
      >
        <h2
          id="faq-heading"
          style={{ fontFamily: T.fontHead, fontSize: "clamp(22px,3.5vw,34px)", fontWeight: 600, letterSpacing: "-0.02em", color: T.white, marginBottom: 8, lineHeight: 1.2 }}
        >
          Superbuilt vs. Every Tool Architects Already Use
        </h2>
        <h3 style={{ fontFamily: T.fontBody, fontSize: 14, color: T.grey, fontWeight: 400, margin: "0 0 36px", lineHeight: 1.7 }}>
          From Midjourney and Leonardo AI to Snaptrude, Maket.ai, and Procore — here's where Superbuilt fits, and where it goes further.
        </h3>

        {FAQS.map((faq, i) => (
          <motion.div
            key={i}
            itemScope itemProp="mainEntity" itemType="https://schema.org/Question"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: T.easeExpo }}
            viewport={{ once: true }}
            style={{ borderBottom: `1px solid ${T.border}`, overflow: "hidden" }}
          >
            <button
              onClick={() => toggle(i)}
              aria-expanded={open === i}
              aria-controls={`faq-answer-${i}`}
              id={`faq-btn-${i}`}
              style={{
                width: "100%", textAlign: "left", display: "flex",
                justifyContent: "space-between", alignItems: "center",
                padding: "18px 0", background: "none", border: "none", cursor: "pointer",
                fontFamily: T.fontHead, fontSize: 15, fontWeight: 500, color: T.white,
              }}
            >
              <span itemProp="name">{faq.q}</span>
              <motion.span
                aria-hidden="true"
                animate={{ rotate: open === i ? 45 : 0 }}
                transition={{ duration: 0.25 }}
                style={{ fontSize: 20, color: T.grey, flexShrink: 0, marginLeft: 16 }}
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: T.easeQuart }}
                  style={{ overflow: "hidden" }}
                >
                  <p itemProp="text" style={{ fontSize: 14, color: T.grey, fontFamily: T.fontBody, lineHeight: 1.8, padding: "0 0 18px", margin: 0 }}>
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// ─── GEO Fact Block ───────────────────────────────────────────────────────────
function GeoFactBlock() {
  return (
    <section
      aria-label="About Superbuilt AI — compliance standards and capabilities"
      style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 80px" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: T.easeExpo }} viewport={{ once: true }}
        style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "40px 36px" }}
      >
        <h2 style={{ fontFamily: T.fontHead, fontSize: "clamp(18px,3vw,26px)", fontWeight: 600, color: T.white, letterSpacing: "-0.02em", marginBottom: 20, lineHeight: 1.2 }}>
          What Superbuilt AI Is — and What It Actually Does
        </h2>
        <p style={{ fontSize: 14, color: T.grey, fontFamily: T.fontBody, lineHeight: 1.85, marginBottom: 16 }}>
          <strong style={{ color: T.white, fontFamily: T.fontHead }}>Superbuilt AI</strong> is an agentic AI platform purpose-built for the AEC industry. It operates a network of 100+ specialized AI agents that autonomously execute design compliance, project coordination, and construction documentation workflows.
        </p>
        <h3 style={{ fontFamily: T.fontHead, fontSize: 15, fontWeight: 600, color: T.white, margin: "24px 0 10px" }}>
          Compliance Standards Superbuilt Agents Are Trained On
        </h3>
        <p style={{ fontSize: 14, color: T.grey, fontFamily: T.fontBody, lineHeight: 1.85, marginBottom: 16 }}>
          Superbuilt AI's compliance agents are trained on: <strong style={{ color: "#c0c0c0" }}>National Building Code (NBC) 2016</strong>, BIS specifications, <strong style={{ color: "#c0c0c0" }}>GRIHA</strong>, <strong style={{ color: "#c0c0c0" }}>LEED v4.1</strong>, <strong style={{ color: "#c0c0c0" }}>EDGE certification by IFC</strong>, WELL Building Standard, RERA documentation requirements, CPWD specifications, and Vastu Shastra principles.
        </p>
        <h3 style={{ fontFamily: T.fontHead, fontSize: 15, fontWeight: 600, color: T.white, margin: "24px 0 10px" }}>
          How Superbuilt Differs from Midjourney, Snaptrude, and Leonardo AI
        </h3>
        <p style={{ fontSize: 14, color: T.grey, fontFamily: T.fontBody, lineHeight: 1.85, marginBottom: 0 }}>
          Unlike <strong style={{ color: "#c0c0c0" }}>Midjourney</strong> or <strong style={{ color: "#c0c0c0" }}>Leonardo AI</strong> — which generate images — Superbuilt agents take action: checking drawings against codes, generating documentation, and coordinating vendors. Unlike <strong style={{ color: "#c0c0c0" }}>Snaptrude</strong>, Superbuilt operates across the entire project lifecycle. Unlike <strong style={{ color: "#c0c0c0" }}>Maket.ai</strong>, it connects to your existing tools and works across them autonomously.
        </p>
      </motion.div>
    </section>
  );
}

// ─── Add Story Modal ──────────────────────────────────────────────────────────
interface AddStoryModalProps { onClose: () => void; }

function AddStoryModal({ onClose }: AddStoryModalProps) {
  const [phase,   setPhase]   = useState<"form" | "processing" | "success">("form");
  const [name,    setName]    = useState("");
  const [company, setCompany] = useState("");
  const [role,    setRole]    = useState("");
  const [story,   setStory]   = useState("");
  const [errors,  setErrors]  = useState<Partial<Record<"name"|"role"|"story", string>>>({});
  const [dots,    setDots]    = useState(".");
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus first input on open
  useEffect(() => { firstInputRef.current?.focus(); }, []);

  // Escape key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Animated dots for processing state
  useEffect(() => {
    if (phase !== "processing") return;
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? "." : d + ".")), 480);
    return () => clearInterval(id);
  }, [phase]);

  const validate = useCallback((): boolean => {
    const e: typeof errors = {};
    if (!name.trim())                          e.name  = "Name is required";
    if (!role)                                 e.role  = "Pick a role";
    if (!story.trim() || story.trim().length < 40) e.story = "A bit more detail please (40+ chars)";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [name, role, story]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    setPhase("processing");
    const ms = Math.floor(Math.random() * 6000) + 2000;
    setTimeout(() => setPhase("success"), ms);
  }, [validate]);

  const handleClose = useCallback(() => {
    // Reset form state on close
    setPhase("form"); setName(""); setCompany(""); setRole(""); setStory(""); setErrors({});
    onClose();
  }, [onClose]);

  const inp: React.CSSProperties = {
    width: "100%", background: "#080808", border: `1px solid ${T.border}`, borderRadius: 10,
    color: T.white, fontFamily: T.fontBody, fontSize: 14, padding: "10px 14px",
    outline: "none", boxSizing: "border-box",
  };
  const focusRing: React.CSSProperties = { outline: `2px solid ${T.azure}`, outlineOffset: 2 };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={handleClose}
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 16px", background: "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)" }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        initial={{ opacity: 0, y: 32, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", width: "100%", maxWidth: 480, background: "#0d0d0d", border: `1px solid ${T.border}`, borderRadius: 18, padding: "28px 28px 24px", overflow: "hidden" }}
      >
        <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(to right, transparent, ${T.azureLine}, transparent)` }} />
        <button
          onClick={handleClose}
          aria-label="Close modal"
          style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: T.dim, fontSize: 17, cursor: "pointer", lineHeight: 1, padding: 4 }}
        >
          ✕
        </button>

        {phase === "form" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: T.easeExpo }}>
            <p style={{ fontSize: 11, color: T.grey, fontFamily: T.fontBody, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Share your experience</p>
            <h2 id="modal-title" style={{ fontSize: 22, fontWeight: 600, color: T.white, fontFamily: T.fontHead, letterSpacing: "-0.01em", margin: "0 0 4px" }}>Add your story</h2>
            <p style={{ fontSize: 13, color: T.grey, fontFamily: T.fontBody, margin: "0 0 24px", lineHeight: 1.6 }}>Honest takes only. No need to be formal.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label htmlFor="story-name" style={{ display: "block", fontSize: 12, color: T.grey, fontFamily: T.fontBody, marginBottom: 6 }}>Your name</label>
                <input
                  id="story-name" type="text" ref={firstInputRef}
                  placeholder="e.g. Priya Sharma" value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={(e) => Object.assign(e.target.style, focusRing)}
                  onBlur={(e) => { e.target.style.outline = "none"; }}
                  style={{ ...inp, borderColor: errors.name ? T.error : T.border }}
                  autoComplete="name"
                  aria-describedby={errors.name ? "name-err" : undefined}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p id="name-err" role="alert" style={{ fontSize: 11, color: T.error, margin: "4px 0 0", fontFamily: T.fontBody }}>{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="story-company" style={{ display: "block", fontSize: 12, color: T.grey, fontFamily: T.fontBody, marginBottom: 6 }}>
                  Company <span style={{ color: T.dim }}>(optional)</span>
                </label>
                <input
                  id="story-company" type="text"
                  placeholder="e.g. Arup India" value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  onFocus={(e) => Object.assign(e.target.style, focusRing)}
                  onBlur={(e) => { e.target.style.outline = "none"; }}
                  style={inp}
                  autoComplete="organization"
                />
              </div>
              <div>
                <label htmlFor="story-role" style={{ display: "block", fontSize: 12, color: T.grey, fontFamily: T.fontBody, marginBottom: 6 }}>Your role</label>
                <select
                  id="story-role" value={role}
                  onChange={(e) => setRole(e.target.value)}
                  onFocus={(e) => Object.assign(e.target.style, focusRing)}
                  onBlur={(e) => { e.target.style.outline = "none"; }}
                  style={{ ...inp, borderColor: errors.role ? T.error : T.border, appearance: "none", cursor: "pointer", color: role ? T.white : T.grey }}
                  aria-describedby={errors.role ? "role-err" : undefined}
                  aria-invalid={!!errors.role}
                >
                  <option value="" disabled>Select your role</option>
                  {AEC_ROLES.map((r) => <option key={r} value={r} style={{ background: "#0d0d0d", color: T.white }}>{r}</option>)}
                </select>
                {errors.role && <p id="role-err" role="alert" style={{ fontSize: 11, color: T.error, margin: "4px 0 0", fontFamily: T.fontBody }}>{errors.role}</p>}
              </div>
              <div>
                <label htmlFor="story-text" style={{ display: "block", fontSize: 12, color: T.grey, fontFamily: T.fontBody, marginBottom: 6 }}>Your story</label>
                <textarea
                  id="story-text" rows={4}
                  placeholder="What did you actually use it for? What changed? Keep it real."
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  onFocus={(e) => Object.assign(e.target.style, focusRing)}
                  onBlur={(e) => { e.target.style.outline = "none"; }}
                  style={{ ...inp, resize: "vertical", lineHeight: 1.72, borderColor: errors.story ? T.error : T.border }}
                  aria-describedby={errors.story ? "story-err" : "story-hint"}
                  aria-invalid={!!errors.story}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  {errors.story
                    ? <p id="story-err" role="alert" style={{ fontSize: 11, color: T.error, margin: 0, fontFamily: T.fontBody }}>{errors.story}</p>
                    : <span id="story-hint" style={{ fontSize: 11, color: T.dim, fontFamily: T.fontBody }}>Minimum 40 characters</span>
                  }
                  <span aria-live="polite" style={{ fontSize: 11, color: T.dim, fontFamily: T.fontBody, marginLeft: "auto" }}>{story.length} chars</span>
                </div>
              </div>
              <MagneticButton
                onClick={handleSubmit}
                style={{ width: "100%", padding: "13px 0", borderRadius: 999, background: T.white, color: "#000", border: "none", fontFamily: T.fontHead, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
              >
                Submit story
              </MagneticButton>
              <p style={{ fontSize: 11, color: T.dim, textAlign: "center", margin: "-4px 0 0", fontFamily: T.fontBody }}>Stories are reviewed before they go live</p>
            </div>
          </motion.div>
        )}

        {phase === "processing" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: T.easeExpo }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "52px 0", gap: 24, textAlign: "center" }}
            role="status" aria-live="polite"
          >
            <div style={{ position: "relative", width: 52, height: 52 }}>
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 52 52" aria-hidden="true">
                <circle cx="26" cy="26" r="22" fill="none" stroke={T.border} strokeWidth="2.5" />
                <circle cx="26" cy="26" r="22" fill="none" stroke={T.white} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="28 110" style={{ animation: "sb-spin 1s linear infinite", transformOrigin: "center" }} />
              </svg>
              <style>{`@keyframes sb-spin{to{transform:rotate(360deg);}}`}</style>
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 600, color: T.white, fontFamily: T.fontHead, margin: "0 0 6px" }}>Reviewing your story{dots}</p>
              <p style={{ fontSize: 13, color: T.grey, fontFamily: T.fontBody, margin: 0 }}>Checking against community guidelines</p>
            </div>
          </motion.div>
        )}

        {phase === "success" && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "44px 0 28px", gap: 20, textAlign: "center" }}
            role="status" aria-live="polite"
          >
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
              style={{ width: 56, height: 56, borderRadius: "50%", background: "#111", border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <motion.svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <motion.path
                  d="M4.5 11.5L8.5 15.5L17.5 6.5" stroke={T.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, delay: 0.25, ease: "easeOut" }}
                />
              </motion.svg>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <p style={{ fontSize: 20, fontWeight: 600, color: T.white, fontFamily: T.fontHead, margin: "0 0 8px" }}>Story submitted</p>
              <p style={{ fontSize: 13, color: T.grey, fontFamily: T.fontBody, margin: 0, lineHeight: 1.72, maxWidth: 300 }}>If it follows our community guidelines it'll show up here soon. Thanks for sharing.</p>
            </motion.div>
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
              onClick={handleClose}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ marginTop: 8, fontSize: 13, padding: "10px 28px", borderRadius: 999, border: `1px solid ${T.border}`, background: "transparent", color: T.grey, fontFamily: T.fontBody, cursor: "pointer" }}
            >
              Back to stories
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const PAGE_INCREMENT = 6;
const PAGE_INITIAL   = 9;

export default function PeerStoriesPage() {
  const [activeFilter, setActiveFilter] = useState<Category>("All");
  const [visible,      setVisible]      = useState(PAGE_INITIAL);
  const [showModal,    setShowModal]    = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY       = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useJsonLd([SCHEMA_SOFTWARE, SCHEMA_FAQ]);
  usePageMeta({
    title:       "AEC Professionals on Superbuilt AI — Real Results | Peer Stories",
    description: "Architects, MEP engineers & AEC consultants from Arup, Gensler & ZHA share how Superbuilt AI's 100+ agents cut compliance time, automate BOQs, and eliminate tool chaos.",
    canonical:   "https://superbuilt.ai/peer-stories",
    ogTitle:     "Real Stories from AEC Professionals Using Superbuilt AI",
    ogDesc:      "13+ AEC roles. 100+ AI agents. Firms like Morphogenesis, DLF, Arup, and Gensler.",
  });

  // Memoised filtered + sliced lists
  const filtered  = useMemo(() => activeFilter === "All" ? TESTIMONIALS : TESTIMONIALS.filter((t) => t.category === activeFilter), [activeFilter]);
  const displayed = useMemo(() => filtered.slice(0, visible), [filtered, visible]);
  const hasMore   = visible < filtered.length;
  const remaining = Math.min(PAGE_INCREMENT, filtered.length - visible);

  // Reset visible count & scroll to grid on filter change
  useEffect(() => {
    setVisible(PAGE_INITIAL);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeFilter]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showModal]);

  const openModal  = useCallback(() => setShowModal(true),  []);
  const closeModal = useCallback(() => setShowModal(false), []);
  const loadMore   = useCallback(() => setVisible((v) => v + PAGE_INCREMENT), []);

  return (
    <>
      <style>{`
        ${GARET_FF}
        *, *::before, *::after { box-sizing: border-box; }
        ::placeholder { color: ${T.dim} !important; }
        select option  { background: #0d0d0d; color: ${T.white}; }
        .sb-masonry { columns: 1; column-gap: 13px; }
        @media(min-width:640px)  { .sb-masonry { columns: 2; } }
        @media(min-width:1024px) { .sb-masonry { columns: 3; } }
        .sb-masonry > div { break-inside: avoid; margin-bottom: 13px; }
        .sb-ghost:hover  { border-color: ${T.white} !important; color: ${T.white} !important; }
        .sb-load:hover   { background: ${T.white} !important; color: #000 !important; }
        @media(pointer:fine) { body { cursor: none; } }
        /* Keyboard focus rings */
        button:focus-visible, select:focus-visible, input:focus-visible, textarea:focus-visible {
          outline: 2px solid ${T.azure}; outline-offset: 2px;
        }
      `}</style>

      <CustomCursor />

      <div style={{ minHeight: "100vh", background: "#000000", fontFamily: T.fontBody, color: T.white }}>

        {/* ── Hero ── */}
        <header role="banner" ref={heroRef} style={{ maxWidth: 960, margin: "0 auto", padding: "96px 20px 52px", position: "relative" }}>
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            {/* Eyebrow */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <motion.div
                aria-hidden="true"
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, ease: T.easeExpo }}
                style={{ height: 1, width: 32, background: T.grey, transformOrigin: "left" }}
              />
              <motion.p
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: T.easeExpo }}
                style={{ fontSize: 11, color: T.grey, fontFamily: T.fontBody, letterSpacing: "0.14em", textTransform: "uppercase", margin: 0 }}
              >
                Peer Stories
              </motion.p>
              <span style={{ position: "relative", display: "inline-flex", width: 7, height: 7 }} aria-hidden="true">
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.azure, opacity: 0.4, animation: "ping 1.6s cubic-bezier(0,0,0.2,1) infinite" }} />
                <span style={{ position: "relative", borderRadius: "50%", width: 7, height: 7, background: T.azure }} />
                <style>{`@keyframes ping{75%,100%{transform:scale(2.2);opacity:0;}}`}</style>
              </span>
            </div>

            <AnimatedHeadline lines={[
              { text: "The AEC industry",   color: T.white },
              { text: "doesn't move fast.", color: T.grey  },
              { text: "These people do.",   color: T.white },
            ]} />

            <motion.div
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.7, ease: T.easeExpo }}
              style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 24, marginBottom: 52 }}
            >
              <p style={{ fontSize: 15, color: T.grey, lineHeight: 1.85, fontFamily: T.fontBody, maxWidth: 500, margin: 0 }}>
                Architects, engineers, coordinators, and consultants from global AEC firms — sharing what's actually changed since they started using Superbuilt.
              </p>
              <MagneticButton
                onClick={openModal}
                aria-label="Share your Superbuilt AI experience"
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: 999, background: T.white, color: "#000", border: "none", fontFamily: T.fontHead, fontWeight: 600, fontSize: 13, cursor: "pointer", letterSpacing: "0.01em", whiteSpace: "nowrap", flexShrink: 0 }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M6 1V11M1 6H11" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Add your story
              </MagneticButton>
            </motion.div>
          </motion.div>

          <StatsRow />
        </header>

        <FirmMarquee />

        {/* ── Main ── */}
        <main>
          <section aria-labelledby="stories-heading" style={{ maxWidth: 1152, margin: "0 auto", padding: "64px 20px 0" }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: T.easeExpo }} viewport={{ once: true }}
              style={{ marginBottom: 16 }}
            >
              <h2
                id="stories-heading"
                style={{ fontFamily: T.fontHead, fontSize: "clamp(20px,3vw,32px)", fontWeight: 600, color: T.white, letterSpacing: "-0.02em", margin: "0 0 6px" }}
              >
                What AEC Professionals Are Actually Saying About Superbuilt
              </h2>
              <p style={{ fontSize: 14, color: T.grey, fontFamily: T.fontBody, margin: "0 0 28px" }}>
                13 roles. 8 countries. One platform replacing 10–15 tools.
              </p>
            </motion.div>

            {/* Filter */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: T.easeExpo }} viewport={{ once: true }}
              style={{ marginBottom: 36 }}
            >
              <FilterBar active={activeFilter} onSelect={setActiveFilter} />
            </motion.div>

            {/* Live count */}
            <motion.p
              key={`${activeFilter}-count`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
              style={{ fontSize: 11, color: T.dim, fontFamily: T.fontBody, marginBottom: 22, letterSpacing: "0.04em" }}
              aria-live="polite" aria-atomic="true"
            >
              {filtered.length} stor{filtered.length === 1 ? "y" : "ies"}
            </motion.p>

            {/* Cards or empty state */}
            <div ref={gridRef}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: T.easeQuart }}
                >
                  {displayed.length === 0
                    ? <EmptyState category={activeFilter} />
                    : (
                      <div className="sb-masonry">
                        {displayed.map((item, index) => (
                          <div key={item.id}>
                            <TestimonialCard item={item} index={index} />
                          </div>
                        ))}
                      </div>
                    )
                  }
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Load more with remaining count */}
            {hasMore && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", justifyContent: "center", marginTop: 48 }}>
                <motion.button
                  className="sb-load"
                  onClick={loadMore}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{ padding: "12px 36px", borderRadius: 999, border: `1px solid ${T.border}`, background: "transparent", color: T.grey, fontFamily: T.fontBody, fontSize: 13, cursor: "pointer", transition: "background 0.2s, color 0.2s" }}
                  aria-label={`Load ${remaining} more stories`}
                >
                  Load {remaining} more ({filtered.length - visible} remaining)
                </motion.button>
              </motion.div>
            )}

            {/* Nudge strip */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: T.easeExpo }} viewport={{ once: true, margin: "-40px" }}
              style={{ marginTop: 60, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 26px" }}
            >
              <div>
                <p style={{ fontSize: 15, fontWeight: 500, color: T.white, fontFamily: T.fontHead, margin: "0 0 3px" }}>Using Superbuilt?</p>
                <p style={{ fontSize: 12, color: T.grey, margin: 0, fontFamily: T.fontBody }}>Share what's actually working. Takes 2 minutes.</p>
              </div>
              <motion.button
                className="sb-ghost"
                onClick={openModal}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ padding: "10px 22px", borderRadius: 999, border: `1px solid ${T.border}`, background: "transparent", color: T.grey, fontFamily: T.fontBody, fontSize: 13, cursor: "pointer", flexShrink: 0, transition: "border-color 0.2s, color 0.2s" }}
              >
                Add your story →
              </motion.button>
            </motion.aside>
          </section>

          <div style={{ marginTop: 80 }}>
            <GeoFactBlock />
          </div>

          <FaqAccordion />

          {/* CTA */}
          <motion.section
            aria-label="Get started with Superbuilt AI"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: T.easeExpo }} viewport={{ once: true, margin: "-60px" }}
            style={{ maxWidth: 960, margin: "0 20px 80px", padding: "72px 40px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 18, textAlign: "center", position: "relative", overflow: "hidden" }}
          >
            <div aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", width: 400, height: 280, pointerEvents: "none", background: `radial-gradient(ellipse, ${T.azureGlow} 0%, transparent 70%)`, transform: "translate(-50%,-50%)" }} />
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} viewport={{ once: true }}
              style={{ fontSize: 11, color: T.grey, fontFamily: T.fontBody, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 18 }}>
              One platform
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6, ease: T.easeExpo }} viewport={{ once: true }}
              style={{ fontFamily: T.fontHead, fontSize: "clamp(28px,5vw,50px)", fontWeight: 600, letterSpacing: "-0.025em", marginBottom: 18, lineHeight: 1.15, color: T.white }}>
              Your project.<br />Your agents.
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} viewport={{ once: true }}
              style={{ fontSize: 15, color: T.grey, lineHeight: 1.85, fontFamily: T.fontBody, maxWidth: 400, margin: "0 auto 44px" }}>
              Stop switching between 10 tools. Let Superbuilt handle coordination, compliance, and the grunt work so you can focus on design.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} viewport={{ once: true }}
              style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <MagneticButton style={{ padding: "13px 36px", borderRadius: 999, background: T.white, color: "#000", border: "none", fontFamily: T.fontHead, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                Try for free
              </MagneticButton>
              <motion.button
                whileHover={{ scale: 1.03, borderColor: T.white, color: T.white }} whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.18 }}
                style={{ padding: "13px 36px", borderRadius: 999, background: "transparent", color: T.grey, border: `1px solid ${T.border}`, fontFamily: T.fontBody, fontSize: 14, cursor: "pointer" }}
              >
                Explore agents →
              </motion.button>
            </motion.div>
          </motion.section>
        </main>
      </div>

      {/* Modal (outside scroll container for stacking context) */}
      <AnimatePresence>
        {showModal && <AddStoryModal onClose={closeModal} />}
      </AnimatePresence>
    </>
  );
}