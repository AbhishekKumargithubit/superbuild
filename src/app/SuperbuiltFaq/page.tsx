"use client";

import { useState, useEffect, useRef, useCallback, FC, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BookingForm {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  location: string;
  teamSize: string;
  wantsDemo: boolean;
}

type FormErrors = Partial<Record<keyof BookingForm, string>>;

interface FaqItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FAQ_DATA: FaqItem[] = [
  {
    id: 1,
    category: "Platform",
    question: "How is Superbuilt AI different from ChatGPT or Copilot for AEC work?",
    answer:
      "ChatGPT answers questions. Superbuilt AI takes action. General LLMs have no awareness of your project files, your Revit model, your vendor list, or your local building codes. Our agents are purpose-trained on AEC workflows — they can run a clash detection pass, generate a BOQ from your drawings, draft an RFI response, and email it to the contractor. That's the gap: from conversation to execution, inside the tools you already use.",
  },
  {
    id: 2,
    category: "Platform",
    question: "What does 'agentic AI' actually mean for my firm's day-to-day work?",
    answer:
      "Agentic means the AI doesn't wait for you to prompt it step-by-step. You give it a goal — 'check this submittal package against the IBC 2021 and flag non-compliances' — and it breaks the task down, runs the checks across your documents, and returns a structured report. It's the difference between a chatbot and a junior consultant who actually gets things done.",
  },
  {
    id: 3,
    category: "Integration",
    question: "Will this plug into Revit, AutoCAD, and the tools we already use, or do we have to migrate?",
    answer:
      "No migration. Superbuilt AI connects to your existing stack — Revit, AutoCAD, Navisworks, Procore, Google Drive, Microsoft 365, email, and more. Our agents operate across these tools as a coordination layer, not a replacement. You keep your workflows; we eliminate the friction between them.",
  },
  {
    id: 4,
    category: "Integration",
    question: "Can the platform read and understand our existing drawing sets and BIM models?",
    answer:
      "Yes. The Drawing Review Agent and Clash Detection Agent can ingest DWG, RVT, IFC, and PDF drawing sets. They parse geometry, annotations, and embedded metadata. For BIM models, the agents extract element data, run coordination checks, and flag conflicts — without requiring you to manually export or reformat anything.",
  },
  {
    id: 5,
    category: "Compliance",
    question: "How does the Code Compliance Agent handle local building codes that keep changing?",
    answer:
      "The agent is trained on a live, versioned code library covering NBC, IBC, local municipal codes, and energy standards. When a code updates, the library updates — your projects are checked against the applicable version for their jurisdiction and permit stage. You can also specify the exact code edition for a project if required by the AHJ.",
  },
  {
    id: 6,
    category: "Compliance",
    question: "Can Superbuilt AI help with green certification — LEED, GRIHA, IGBC?",
    answer:
      "The Green Certification Agent maps your design decisions against the credit requirements for LEED v4.1, GRIHA, and IGBC ratings. It tracks documentation gaps, flags missing prerequisites, and generates the compliance narratives typically required for submissions. It won't stamp your drawings, but it will do 80% of the paperwork and checklist grind.",
  },
  {
    id: 7,
    category: "Compliance",
    question: "Does the platform support Vastu compliance checks alongside standard building codes?",
    answer:
      "Yes — we built a dedicated Vastu Compliance Agent specifically for the South Asian market where client briefs routinely include Vastu requirements alongside NBC compliance. It checks orientation, room placement, entry directions, and zone relationships, and produces a Vastu report you can present to the client alongside your standard compliance documentation.",
  },
  {
    id: 8,
    category: "Design",
    question: "How does the Sketch-to-CAD agent actually work — can it produce construction-ready drawings?",
    answer:
      "Upload a hand sketch, whiteboard photo, or rough diagram. The Sketch-to-CAD Agent interprets the geometry, infers wall thicknesses and relationships, and generates a clean DWG floor plan. Output is construction-intent quality for early stage — it's not replacing your CD set, but it compresses the concept-to-first-drawing cycle from days to minutes. You refine from there.",
  },
  {
    id: 9,
    category: "Design",
    question: "Can the AI generate moodboards and concept options without replacing my design direction?",
    answer:
      "The Moodboard and Concept Design agents take your brief — programme, site context, client personality, references — and generate visual directions for client presentations. You control the creative parameters. Think of it as a junior designer who can produce twelve options overnight so you walk into the client meeting with real choices, not one direction to defend.",
  },
  {
    id: 10,
    category: "Operations",
    question: "Our coordination still runs on WhatsApp and email chains. How does this fix that without disrupting the team?",
    answer:
      "The Email Agent, Meeting Agent, and Slack Agent surface inside the tools your team already uses. They don't demand a new app — they read your threads, summarize action items, flag outstanding RFIs, and log decisions. The Vendor Calling Agent can even make follow-up calls to contractors and transcribe outcomes back into your project log. The coordination happens; you just stop chasing it.",
  },
  {
    id: 11,
    category: "Operations",
    question: "Can the AI attend meetings on our behalf or just summarize them after the fact?",
    answer:
      "Both. The Meeting Agent can join a scheduled call, take structured notes keyed to agenda items, extract action items with owners and deadlines, and post the summary to your drive or Slack channel within minutes of the call ending. For routine vendor coordination or progress calls, it can represent your position using briefing notes you prepare beforehand.",
  },
  {
    id: 12,
    category: "Operations",
    question: "How accurate are the BOQs it generates, and can we trust them for actual procurement?",
    answer:
      "The BOQ Agent extracts quantities directly from your drawing set or BIM model — it's not estimating, it's measuring. Accuracy is bounded by the quality of your model or drawings. On a well-developed design, quantity accuracy lands within 3–5% of a manually produced BOQ. We recommend a single quantity surveyor review pass before procurement, which takes a fraction of the time a full manual takeoff would.",
  },
  {
    id: 13,
    category: "Security",
    question: "Our project data is confidential. Who can see it, and how is it protected?",
    answer:
      "Your project data is encrypted at rest and in transit. It is never used to train our models. Each firm gets isolated data environments — no project data is shared across organizations. We are SOC 2 Type II compliant and follow ISO 27001-aligned security practices. For government or sensitive institutional projects, we offer private deployment options.",
  },
  {
    id: 14,
    category: "Security",
    question: "What happens to our drawings and models when we stop using the platform?",
    answer:
      "You own your data, always. On contract termination, we provide a full export of all project data and documents, and purge our systems within 30 days per your written instruction. There is no lock-in on your files — they're yours in their original formats.",
  },
  {
    id: 15,
    category: "Adoption",
    question: "We've tried other 'AI tools' that required months of onboarding. What's the actual time to value here?",
    answer:
      "Most firms have their first agent running useful tasks within one week. The productivity layer — email, calendar, meeting summaries — activates on day one. Compliance and drawing review agents typically take two to three weeks to calibrate to your firm's standards and project types. We assign an onboarding specialist, not a PDF guide.",
  },
  {
    id: 16,
    category: "Adoption",
    question: "Will junior architects lose learning opportunities if AI handles documentation and coordination?",
    answer:
      "This is the most honest question in the industry right now. Superbuilt AI removes the grunt work, not the learning. Junior architects still make design decisions, manage consultant relationships, and develop judgment — they just stop spending 40% of their time on formatting schedules and chasing RFI responses. Firms using AI tools report juniors moving faster to complex tasks, not fewer complex tasks.",
  },
  {
    id: 17,
    category: "Platform",
    question: "How many agents run simultaneously, and can they work across multiple active projects at once?",
    answer:
      "The platform supports concurrent multi-project operation. Each active project maintains its own context — agents working on Project A have no access to Project B's data. You can set agent priority queues and resource allocation per project. There is no hard cap on simultaneous agent operations; limits are set by your subscription tier.",
  },
  {
    id: 18,
    category: "Adoption",
    question: "We're a small 8-person firm. Is this built for large firms only, or does it work for us?",
    answer:
      "The ROI case is actually stronger for smaller firms. An 8-person firm running Superbuilt AI can handle the coordination load of a 20-person firm without adding headcount. The productivity layer alone — email management, meeting summaries, document organization — saves 6–10 hours per person per week. That's roughly one full-time equivalent recovered before you even touch the design automation agents.",
  },
  {
    id: 19,
    category: "Platform",
    question: "Who is legally responsible when the AI makes an error on a compliance check or drawing review?",
    answer:
      "The licensed architect or engineer of record remains legally responsible — as they always have been. Superbuilt AI is a professional tool, not a licensed professional. Every agent output includes a confidence level and flags its own uncertainty. The platform is designed to augment professional judgment, not override it. Think of it like a very thorough intern: you still stamp and sign.",
  },
  {
    id: 20,
    category: "Integration",
    question: "Does the Site Intelligence Agent work with real location data, zoning maps, and FSI regulations?",
    answer:
      "Yes. The Site Intelligence Agent pulls from GIS databases, municipal zoning maps, FAR/FSI regulations, setback rules, and site-specific environmental constraints. For Indian projects, it covers DTCP, CMDA, RERA, and local development control regulations. Input a site address or coordinates and it returns a full developability summary before your client has finished the site visit.",
  },
];

const CATEGORIES = [
  "All",
  "Platform",
  "Integration",
  "Compliance",
  "Design",
  "Operations",
  "Security",
  "Adoption",
] as const;

type Category = (typeof CATEGORIES)[number];

// ─── JSON-LD helper ───────────────────────────────────────────────────────────

function generateStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

// ─── BookingModal ─────────────────────────────────────────────────────────────

const INITIAL_FORM: BookingForm = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  role: "",
  location: "",
  teamSize: "",
  wantsDemo: false,
};

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState<BookingForm>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const overlayRef = useRef<HTMLDivElement>(null);

  // Reset form when modal reopens
  useEffect(() => {
    if (isOpen) {
      setForm(INITIAL_FORM);
      setSubmitted(false);
      setErrors({});
    }
  }, [isOpen]);

  // Escape key + body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const validate = useCallback((): FormErrors => {
    const e: FormErrors = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Valid email required";
    if (!form.company.trim()) e.company = "Required";
    if (!form.role.trim()) e.role = "Required";
    return e;
  }, [form]);

  const handleSubmit = useCallback(() => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setSubmitted(true);
  }, [validate]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose]
  );

  const setField = useCallback(
    <K extends keyof BookingForm>(key: K, value: BookingForm[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    []
  );

  if (!isOpen) return null;

  const inputCls = (field: keyof BookingForm) =>
    [
      "modal-input w-full bg-white/5 rounded-lg px-3.5 py-[11px] text-[13.5px] text-white outline-none",
      "transition-[border-color,background] duration-200 placeholder:text-white/20",
      errors[field]
        ? "border border-red-500/70"
        : "border border-white/10 focus:border-white/30 focus:bg-white/8",
    ].join(" ");

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-1000 flex items-center justify-center p-5"
      style={{
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        animation: "backdropIn 0.25s ease both",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Apply for access"
    >
      <style>{`
        @keyframes backdropIn { from { opacity:0 } to { opacity:1 } }
        @keyframes panelIn   { from { opacity:0; transform:translateY(24px) scale(0.96) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes checkDraw { from { stroke-dashoffset:40 } to { stroke-dashoffset:0 } }
        .modal-panel::-webkit-scrollbar { display:none }
        .modal-panel { scrollbar-width:none; -ms-overflow-style:none }
        .modal-input:focus { border-color:rgba(255,255,255,0.28)!important; background:rgba(255,255,255,0.08)!important }
        .modal-select { color-scheme:dark }
        .modal-select option { background:#1a1a1a; color:#fff }
        .book-btn:hover { background:rgba(255,255,255,0.13)!important }
        .book-btn:active { transform:scale(0.97)!important }
      `}</style>

      <div
        className="modal-panel relative w-full overflow-y-auto"
        style={{
          maxWidth: 480,
          maxHeight: "90vh",
          background: "rgba(16,16,16,0.85)",
          backdropFilter: "blur(28px) saturate(1.4)",
          WebkitBackdropFilter: "blur(28px) saturate(1.4)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          boxShadow: "0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
          animation: "panelIn 0.4s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        {submitted ? (
          <SuccessState onClose={onClose} />
        ) : (
          <div style={{ padding: "32px 32px 28px" }}>
            {/* Header */}
            <div className="flex justify-between items-start mb-7">
              <div>
                <h2
                  style={{ fontFamily: "'Red Hat Display', sans-serif" }}
                  className="font-bold text-[22px] text-white leading-tight mb-1.5"
                >
                  Apply for Access.
                </h2>
                <p className="text-[12.5px] text-white/40 leading-relaxed">
                  Tell us about your firm and we&apos;ll be in touch.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/35 hover:text-white/70 transition-colors p-1 shrink-0 ml-4"
                aria-label="Close modal"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M2 2l14 14M16 2L2 16"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="h-px bg-white/7 mb-6" />

            {/* Fields */}
            <div className="flex flex-col gap-4">
              {/* Full Name */}
              <FieldGroup label="Full Name" required error={errors.fullName}>
                <input
                  className={inputCls("fullName")}
                  type="text"
                  placeholder="Jane Smith"
                  value={form.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  autoComplete="name"
                />
              </FieldGroup>

              {/* Email */}
              <FieldGroup label="Email Address" required error={errors.email}>
                <input
                  className={inputCls("email")}
                  type="email"
                  placeholder="jane@firm.com"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  autoComplete="email"
                />
              </FieldGroup>

              {/* Phone */}
              <FieldGroup label="Phone Number" optional>
                <input
                  className={inputCls("phone")}
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  autoComplete="tel"
                />
              </FieldGroup>

              {/* Company + Role */}
              <div className="grid grid-cols-2 gap-3">
                <FieldGroup label="Organization" required error={errors.company}>
                  <input
                    className={inputCls("company")}
                    type="text"
                    placeholder="Firm name"
                    value={form.company}
                    onChange={(e) => setField("company", e.target.value)}
                    autoComplete="organization"
                  />
                </FieldGroup>
                <FieldGroup label="Role / Title" required error={errors.role}>
                  <input
                    className={inputCls("role")}
                    type="text"
                    placeholder="Architect"
                    value={form.role}
                    onChange={(e) => setField("role", e.target.value)}
                    autoComplete="organization-title"
                  />
                </FieldGroup>
              </div>

              {/* Location + Team Size */}
              <div className="grid grid-cols-2 gap-3">
                <FieldGroup label="Location" optional>
                  <input
                    className={inputCls("location")}
                    type="text"
                    placeholder="City, Country"
                    value={form.location}
                    onChange={(e) => setField("location", e.target.value)}
                  />
                </FieldGroup>
                <FieldGroup label="Team Size" optional>
                  <select
                    className={`${inputCls("teamSize")} modal-select appearance-none cursor-pointer pr-8`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23666' stroke-width='1.4' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      color: form.teamSize ? "#ffffff" : "rgba(255,255,255,0.25)",
                    }}
                    value={form.teamSize}
                    onChange={(e) => setField("teamSize", e.target.value)}
                  >
                    <option value="" disabled>
                      Select size
                    </option>
                    <option value="1-5">1–5 people</option>
                    <option value="6-15">6–15 people</option>
                    <option value="16-50">16–50 people</option>
                    <option value="51-200">51–200 people</option>
                    <option value="200+">200+ people</option>
                  </select>
                </FieldGroup>
              </div>

              {/* Demo checkbox */}
              <label className="flex items-center gap-2.5 cursor-pointer pt-1 select-none">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={form.wantsDemo}
                  onClick={() => setField("wantsDemo", !form.wantsDemo)}
                  className="shrink-0 w-4.5 h-4.5rounded flex items-center justify-center transition-all duration-200"
                  style={{
                    border: `1.5px solid ${form.wantsDemo ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)"}`,
                    background: form.wantsDemo ? "rgba(255,255,255,0.12)" : "transparent",
                  }}
                >
                  {form.wantsDemo && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4l3 3 5-6"
                        stroke="#fff"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
                <span className="text-[13px] text-white/45">
                  I&apos;d like to book a live demo
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="button"
              className="book-btn w-full mt-6 text-white rounded-[10px] py-3.5 font-semibold text-[14px] tracking-[0.01em] transition-all duration-200 cursor-pointer"
              style={{
                fontFamily: "'Red Hat Display', sans-serif",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
              onClick={handleSubmit}
            >
              Get in Touch →
            </button>

            <p className="text-center mt-3.5 text-[11px] text-white/20 leading-relaxed">
              No spam. We respond within one business day.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── SuccessState (extracted sub-component) ───────────────────────────────────

const SuccessState: FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="px-10 py-13 text-center">
    <div
      className="w-14 h-14 rounded-full mx-auto mb-6 flex items-center justify-center"
      style={{
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <polyline
          points="4,12 9,17 20,6"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="40"
          strokeDashoffset="40"
          style={{ animation: "checkDraw 0.45s ease 0.1s both" }}
        />
      </svg>
    </div>
    <h3
      style={{ fontFamily: "'Red Hat Display', sans-serif" }}
      className="font-semibold text-[22px] text-white mb-2.5"
    >
      You&apos;re on the list.
    </h3>
    <p className="text-[14px] text-white/45 leading-[1.75] mb-8 max-w-70 mx-auto">
      We&apos;ll reach out within one business day and set up a time that works
      for your team.
    </p>
    <button
      onClick={onClose}
      className="text-white rounded-full px-7 py-3 font-semibold text-[13px] transition-opacity hover:opacity-80 cursor-pointer"
      style={{
        fontFamily: "'Red Hat Display', sans-serif",
        background: "rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      Close
    </button>
  </div>
);

// ─── FieldGroup helper ────────────────────────────────────────────────────────

const FieldGroup: FC<{
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}> = ({ label, required, optional, error, children }) => (
  <div>
    <label className="block text-[12px] text-white/45 mb-1.5 tracking-[0.02em]">
      {label}{" "}
      {required && <span className="text-white/30">*</span>}
      {optional && <span className="text-white/20 font-normal">(Optional)</span>}
    </label>
    {children}
    {error && (
      <p className="text-[11px] text-red-400 mt-1">{error}</p>
    )}
  </div>
);

// ─── FAQItem ──────────────────────────────────────────────────────────────────

interface FAQItemProps {
  faq: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItemComponent: FC<FAQItemProps> = ({ faq, index, isOpen, onToggle }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    // Use ResizeObserver so height stays correct if content reflows
    const ro = new ResizeObserver(() => {
      if (isOpen) setHeight(el.scrollHeight);
    });
    ro.observe(el);
    setHeight(isOpen ? el.scrollHeight : 0);
    return () => ro.disconnect();
  }, [isOpen]);

  return (
    <article
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
      className="faq-card overflow-hidden transition-[border-color] duration-300"
      style={{
        background: "#0d0d0d",
        border: `1px solid ${isOpen ? "#2e2e2e" : "#1c1c1c"}`,
        borderRadius: 14,
        animationDelay: `${(index % 3) * 0.07}s`,
      }}
    >
      {/* Top accent */}
      <div
        aria-hidden
        className="h-px transition-[width] duration-400ms"
        style={{
          width: isOpen ? "0%" : "38%",
          background:
            "linear-gradient(90deg, rgba(180,180,180,0.14) 0%, transparent 100%)",
        }}
      />

      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-start justify-between gap-5 text-left transition-colors"
        style={{ padding: "22px 24px", background: "transparent", border: "none", cursor: "pointer" }}
      >
        <div className="flex-1 min-w-0">
          {/* Category badge */}
          <span
            className="inline-block text-[11px] uppercase tracking-[0.08em] px-2 py-0.5 rounded mb-2.5"
            style={{
              background: "#111",
              color: "#333",
              border: "1px solid #1c1c1c",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            {faq.category}
          </span>
          <h3
            itemProp="name"
            className="m-0 font-medium leading-[1.45] transition-colors duration-250 tracking-[-0.01em]"
            style={{
              fontFamily: "'Red Hat Display', sans-serif",
              fontSize: "clamp(14px, 1.6vw, 16px)",
              color: isOpen ? "#ffffff" : "#d4d4d4",
            }}
          >
            {faq.question}
          </h3>
        </div>

        {/* +/× toggle */}
        <div
          aria-hidden
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 transition-[border-color,background] duration-300"
          style={{
            border: `1px solid ${isOpen ? "#2e2e2e" : "#1c1c1c"}`,
            background: isOpen ? "rgba(180,180,180,0.06)" : "transparent",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style={{
              transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <line x1="6" y1="0" x2="6" y2="12" stroke={isOpen ? "#a0a0a0" : "#8b8b8b"} strokeWidth="1.5" />
            <line x1="0" y1="6" x2="12" y2="6" stroke={isOpen ? "#a0a0a0" : "#8b8b8b"} strokeWidth="1.5" />
          </svg>
        </div>
      </button>

      {/* Animated answer */}
      <div
        itemScope
        itemProp="acceptedAnswer"
        itemType="https://schema.org/Answer"
        style={{
          height: `${height}px`,
          overflow: "hidden",
          transition: "height 0.45s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div ref={contentRef} style={{ padding: "0 24px 24px" }}>
          <div className="w-full h-px mb-4.5" style={{ background: "#1c1c1c" }} />
          <p
            itemProp="text"
            className="m-0 text-[14px] leading-[1.82]"
            style={{ fontFamily: "'Nunito', sans-serif", color: "#8b8b8b" }}
          >
            {faq.answer}
          </p>
        </div>
      </div>
    </article>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SuperbuiltFAQ() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [openId, setOpenId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  // Inject JSON-LD + fonts once on mount
  useEffect(() => {
    // JSON-LD
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(generateStructuredData());
    document.head.appendChild(script);

    // Google Fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@300;500;600&family=Nunito:wght@400;500&display=swap";
    document.head.appendChild(link);

    // Meta description (only add if not already present)
    if (!document.querySelector('meta[name="description"]')) {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Frequently asked questions about Superbuilt AI — the unified agentic AI platform for architecture, engineering, and construction. Learn how AI agents handle clash detection, code compliance, BOQ generation, Vastu compliance, and more.";
      document.head.appendChild(meta);
    }

    return () => {
      // Clean up injected script on unmount to avoid duplicates in dev HMR
      script.remove();
    };
  }, []);

  // Filtered FAQ list
  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesCategory =
      activeCategory === "All" || faq.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleToggle = (id: number) =>
    setOpenId((prev) => (prev === id ? null : id));

  return (
    <div
      className="min-h-screen"
      style={{ background: "#080808", color: "#d4d4d4" }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .faq-card { animation: fadeUp 0.4s ease both; }
        .cat-btn { transition: color 0.2s, background 0.2s, border-color 0.2s; }
        .cat-btn:hover { border-color: #2e2e2e !important; color: #d4d4d4 !important; }
      `}</style>

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 h-14"
        style={{
          background: "rgba(8,8,8,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid #111",
        }}
      >
        <span
          className="font-semibold text-[15px] text-white tracking-[-0.02em]"
          style={{ fontFamily: "'Red Hat Display', sans-serif" }}
        >
          Superbuilt <span className="font-light text-white/30">AI</span>
        </span>
        <button
          onClick={openModal}
          className="text-[12px] font-semibold text-white rounded-full px-4 py-2 transition-all hover:opacity-80 cursor-pointer"
          style={{
            fontFamily: "'Red Hat Display', sans-serif",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          Apply for Access →
        </button>
      </header>

      {/* ── Hero ── */}
      <section className="px-6 md:px-12 pt-20 pb-14 max-w-215 mx-auto">
        <p
          className="text-[11px] uppercase tracking-[0.2em] text-white/25 mb-5"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          Knowledge Base
        </p>
        <h1
          className="font-semibold text-white leading-[1.08] tracking-[-0.03em] mb-5"
          style={{
            fontFamily: "'Red Hat Display', sans-serif",
            fontSize: "clamp(36px, 5vw, 64px)",
          }}
        >
          Everything you want
          <br />
          <span className="text-white/25 font-light">to know about the platform.</span>
        </h1>
        <p
          className="text-[15px] text-white/40 leading-[1.8] max-w-140"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          {FAQ_DATA.length} questions answered. If yours isn&apos;t here, reach
          out — we respond within one business day.
        </p>

        {/* Search */}
        <div className="relative mt-8 max-w-120">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
          >
            <circle cx="6.5" cy="6.5" r="5" stroke="#444" strokeWidth="1.4" />
            <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#444" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search questions…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setOpenId(null); // collapse all when searching
            }}
            className="w-full pl-10 pr-4 py-3 text-[13.5px] text-white rounded-xl outline-none transition-[border-color] duration-200"
            style={{
              fontFamily: "'Nunito', sans-serif",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid #1c1c1c",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2e2e2e")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#1c1c1c")}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              aria-label="Clear search"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </section>

      {/* ── Category filter ── */}
      <div
        className="sticky top-14 z-40 px-6 md:px-12 py-3 overflow-x-auto"
        style={{
          background: "rgba(8,8,8,0.96)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #111",
        }}
      >
        <div className="flex gap-2 w-max">
          {CATEGORIES.map((cat) => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenId(null);
                }}
                className="cat-btn text-[11.5px] px-3.5 py-1.5 rounded-full whitespace-nowrap font-medium cursor-pointer"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  background: active ? "rgba(255,255,255,0.10)" : "transparent",
                  border: `1px solid ${active ? "#2e2e2e" : "#1c1c1c"}`,
                  color: active ? "#ffffff" : "#555",
                }}
              >
                {cat}
                {cat !== "All" && (
                  <span className="ml-1.5 text-[10px] opacity-50">
                    {FAQ_DATA.filter((f) => f.category === cat).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FAQ list ── */}
      <main
        className="px-6 md:px-12 py-10 max-w-215 mx-auto"
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        {filteredFaqs.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filteredFaqs.map((faq, i) => (
              <FAQItemComponent
                key={faq.id}
                faq={faq}
                index={i}
                isOpen={openId === faq.id}
                onToggle={() => handleToggle(faq.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p
              className="text-[15px] text-white/20"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              No results for &ldquo;{searchQuery}&rdquo;
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-4 text-[13px] text-white/40 hover:text-white/70 transition-colors underline underline-offset-4 cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>

      {/* ── CTA footer ── */}
      <footer
        className="px-6 md:px-12 py-16 max-w-215 mx-auto mt-4"
        style={{ borderTop: "1px solid #111" }}
      >
        <p
          className="text-[11px] uppercase tracking-[0.16em] text-white/20 mb-4"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          Still have questions?
        </p>
        <h2
          className="font-semibold text-white text-[26px] tracking-[-0.02em] mb-3"
          style={{ fontFamily: "'Red Hat Display', sans-serif" }}
        >
          Talk to the team.
        </h2>
        <p
          className="text-[14px] text-white/35 leading-[1.75] max-w-100 mb-7"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          We&apos;ll walk you through the platform, answer your specific use
          cases, and help you decide if this is the right fit for your firm.
        </p>
        <button
          onClick={openModal}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-white rounded-full px-6 py-3 transition-all hover:opacity-80 cursor-pointer"
          style={{
            fontFamily: "'Red Hat Display', sans-serif",
            background: "rgba(255,255,255,0.09)",
            border: "1px solid rgba(255,255,255,0.14)",
          }}
        >
          Apply for Access
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </footer>

      {/* ── Modal ── */}
      <BookingModal isOpen={showModal} onClose={closeModal} />
    </div>
  );
}