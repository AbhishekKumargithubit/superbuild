"use client";
import Image from 'next/image';

import { useState, useEffect, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

type RoleType = "ENG" | "AEC" | "CONTENT" | "QA" | "DATA";
type Category = "ENGINEERING" | "AEC DOMAIN" | "CONTENT & GROWTH" | "DATA";
type FilterCat = "ALL" | Category;
type View = "listing" | "detail" | "form";

interface Role {
  id: string;
  jobId: string;
  category: Category;
  type: RoleType;
  title: string;
  experience: string;
  ctc: string;
  location: string;
  mode: string;
  degree: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const ROLES: Role[] = [
  {
    id: "founding-ai-engineer",
    jobId: "SB-2025-ENG-001",
    category: "ENGINEERING",
    type: "ENG",
    title: "Founding AI Engineer",
    experience: "2–4 Years",
    ctc: "₹40 LPA CTC",
    location: "Gurugram, Haryana",
    mode: "Hybrid",
    degree:
      "B.Tech / M.Tech — Computer Science, AI/ML, or equivalent. IIT / NIT / BITS / IIIT preferred.",
    overview:
      "You are one of the first engineers at Superbuilt AI. You will design and build the orchestration engine that coordinates 100+ specialized AI agents across architecture, engineering, and construction workflows. This is not a feature-ship role. You will make foundational decisions about how our agents reason, route, and act — decisions that will define the platform for the next decade.",
    responsibilities: [
      "Design and implement the multi-agent orchestration layer using LangGraph, CrewAI, or equivalent agentic frameworks",
      "Build agent reasoning pipelines that process AEC-specific inputs: IFC files, PDF drawings, building codes, BOQs, and coordinate plans",
      "Architect memory and context management systems that persist state across long-running agentic workflows",
      "Implement tool-use, function-calling, and structured output layers for domain-specific agent actions",
      "Define evaluation frameworks and benchmarks for agent output quality in AEC domain contexts",
      "Own the LLM provider abstraction layer — model selection, fallback logic, cost optimization",
      "Write production-quality Python and TypeScript with comprehensive testing and documentation",
    ],
    requirements: [
      "Demonstrated experience building production LLM-powered applications — verified GitHub portfolio required",
      "Deep familiarity with at least one agentic framework: LangGraph, LangChain, CrewAI, AutoGen, or DSPy",
      "Strong Python proficiency — async, concurrency, performance optimization at scale",
      "Experience with RAG pipelines and vector databases: Pinecone, Weaviate, Chroma, or pgvector",
      "Minimum CGPA 8.0/10 — verified at background check stage. No exceptions.",
      "At least one open-source AI project with meaningful external usage or GitHub stars",
    ],
    niceToHave: [
      "Prior founding-stage startup experience (Seed or Series A)",
      "Published research in AI/ML, NLP, or multi-agent systems",
      "Familiarity with AEC data formats: IFC schema, Revit API, speckle.systems",
    ],
  },
  {
    id: "ic-manager",
    jobId: "SB-2025-ENG-002",
    category: "ENGINEERING",
    type: "ENG",
    title: "IC Agentic Engineering Manager",
    experience: "3+ Years",
    ctc: "₹50 LPA CTC",
    location: "Gurugram, Haryana",
    mode: "Hybrid",
    degree:
      "B.Tech / M.Tech — Computer Science or related. Postgraduate strongly preferred.",
    overview:
      "You are an individual contributor who also leads. You write code every day and manage a small, elite engineering team building agentic infrastructure. You own the technical roadmap from orchestration to deployment. We expect 60% of your time in the code — this is not a people-management-only role.",
    responsibilities: [
      "Lead architectural decisions for the agentic platform while maintaining 60% active engineering contribution",
      "Manage 2–4 senior engineers: sprint planning, code review, technical mentorship, and unblocking",
      "Own the agent evaluation and QA framework — define what correct output means across 100+ agents",
      "Drive integration between the AI layer and third-party AEC tools via APIs and data pipelines",
      "Define engineering standards, code review norms, and release processes for an AI-native product",
    ],
    requirements: [
      "3+ years software engineering with at least 1 year in a tech lead or engineering lead capacity",
      "Proven experience building and shipping LLM-integrated production systems at scale",
      "Strong understanding of distributed systems, async architectures, and cloud-native deployment",
      "Minimum CGPA 8.5/10 — verified. Track record of mentoring engineers is required.",
    ],
    niceToHave: [
      "Open-source project maintainership with active contributor community",
      "Prior experience at an AI-first startup (Series A or earlier)",
    ],
  },
  {
    id: "ai-deployment",
    jobId: "SB-2025-ENG-003",
    category: "ENGINEERING",
    type: "ENG",
    title: "AI Deployment Engineer",
    experience: "1–2 Years",
    ctc: "₹18 LPA CTC",
    location: "Gurugram, Haryana",
    mode: "Hybrid",
    degree: "B.Tech — Computer Science, DevOps, or Cloud Engineering.",
    overview:
      "You own the pipeline that takes our agents from code to production. You will design, build, and maintain deployment infrastructure for 100+ specialized AI agents — ensuring zero-downtime releases, reliable scaling, and observability at every layer.",
    responsibilities: [
      "Build and maintain CI/CD pipelines for continuous agent deployment to cloud environments",
      "Design containerization and orchestration architecture using Docker and Kubernetes",
      "Implement infrastructure-as-code (Terraform, Pulumi) for reproducible cloud environments",
      "Set up comprehensive observability: distributed tracing, log aggregation, agent-specific dashboards",
      "Manage LLM API cost optimization, rate limiting, and failover across model providers",
    ],
    requirements: [
      "Hands-on cloud experience with AWS, GCP, or Azure — certifications are a strong differentiator",
      "Working knowledge of Docker, Kubernetes, and container orchestration patterns",
      "Experience with CI/CD: GitHub Actions, GitLab CI, or equivalent",
      "Minimum CGPA 7.5/10 — verified",
    ],
    niceToHave: [
      "Experience deploying LLM inference servers: vLLM, Ollama, or TGI",
      "Prior DevOps or MLOps experience at a SaaS or AI startup",
    ],
  },
  {
    id: "fullstack",
    jobId: "SB-2025-ENG-004",
    category: "ENGINEERING",
    type: "ENG",
    title: "Full-Stack Software Engineer",
    experience: "1–2 Years",
    ctc: "₹20 LPA CTC",
    location: "Gurugram, Haryana",
    mode: "Hybrid",
    degree:
      "B.Tech — Computer Science or any discipline with verifiable engineering proficiency.",
    overview:
      "You build the product surface that architects and construction directors interact with daily. Complex real-time dashboards, workflow builders, document viewers handling IFC models and drawing sets. You care as much about 60fps as API response times.",
    responsibilities: [
      "Build and own the frontend: agent dashboards, workflow UIs, document management, notification systems",
      "Develop REST and WebSocket APIs handling real-time agent state streaming",
      "Implement authentication, authorisation, and multi-tenancy for enterprise AEC clients",
      "Integrate third-party AEC APIs: Autodesk Platform Services, BIM 360, Procore",
    ],
    requirements: [
      "Proficiency in React (18+), TypeScript, and modern JavaScript — portfolio of shipped applications required",
      "Strong state management: Zustand, Jotai, or Redux Toolkit",
      "Solid backend skills: Python (FastAPI/Django) or Node.js (Express/Hono)",
      "Minimum CGPA 7.5/10 — verified",
    ],
    niceToHave: [
      "Experience with Three.js or WebGL for 3D construction model visualization",
      "Familiarity with Autodesk Platform Services APIs",
    ],
  },
  {
    id: "ai-support",
    jobId: "SB-2025-ENG-005",
    category: "ENGINEERING",
    type: "ENG",
    title: "AI Support Engineer",
    experience: "1–2 Years",
    ctc: "₹15 LPA CTC",
    location: "Gurugram, Haryana",
    mode: "Hybrid",
    degree:
      "B.Tech — Computer Science, AI/ML, or Information Technology.",
    overview:
      "You are the first line of technical intelligence when our agentic system behaves unexpectedly. You diagnose why the Compliance Agent returned a wrong result or why the BOQ Agent misinterpreted a specification. This requires understanding multi-agent architectures, LLM output patterns, and AEC workflows simultaneously.",
    responsibilities: [
      "Triage, diagnose, and resolve complex issues in multi-agent pipelines by reading traces, logs, and LLM outputs",
      "Develop internal tooling for log analysis, agent replay, and failure classification",
      "Write detailed incident reports and root-cause analyses that directly inform engineering",
      "Monitor production agent health dashboards and respond to threshold alerts",
    ],
    requirements: [
      "Strong Python proficiency — comfortable reading production logs and LLM API responses",
      "Understanding of LLM API behaviour: token limits, tool call failures, hallucination patterns",
      "Minimum CGPA 7.5/10 — verified",
    ],
    niceToHave: [
      "Prior experience supporting AI/ML systems in production",
      "Basic understanding of AEC workflows and terminology",
    ],
  },
  {
    id: "qa",
    jobId: "SB-2025-ENG-006",
    category: "ENGINEERING",
    type: "QA",
    title: "QA / Testing Engineer",
    experience: "0–1 Year / Fresher",
    ctc: "₹14 LPA CTC",
    location: "Gurugram, Haryana",
    mode: "Hybrid",
    degree: "B.Tech — Computer Science or IT. Exceptional freshers welcome.",
    overview:
      "You own quality on a platform where errors are not UX bugs — they can trigger compliance failures or construction rework costing crores. You will invent test methodologies for probabilistic AI systems for which no existing playbook exists.",
    responsibilities: [
      "Design automated test suites for 100+ AI agents — functional, regression, and adversarial",
      "Develop strategies for probabilistic LLM outputs: semantic correctness, hallucination detection, format validation",
      "Build test fixture datasets using real AEC documents: IFC models, PDFs, BOQs",
      "Own the CI/CD quality gate — define pass/fail criteria for all agent deployments",
    ],
    requirements: [
      "Strong logical and analytical thinking — verifiable through your academic record and demonstrated output",
      "Python proficiency: write test scripts, parse JSON outputs, automate validation",
      "Minimum CGPA 8.0/10 — the highest academic bar proportional to seniority on the team",
    ],
    niceToHave: [
      "Familiarity with pytest, Selenium, or Playwright",
      "Any exposure to LLM APIs or agentic systems",
    ],
  },
  {
    id: "data-analyst",
    jobId: "SB-2025-DAT-001",
    category: "DATA",
    type: "DATA",
    title: "Data Analyst",
    experience: "0–1 Year",
    ctc: "₹14 LPA CTC",
    location: "Gurugram, Haryana",
    mode: "Hybrid",
    degree:
      "B.Tech / B.Sc — Computer Science, Statistics, Mathematics, or Data Science.",
    overview:
      "You will be our first dedicated analytics hire — building the entire analytics layer from scratch: event schema, data warehouse, ETL pipelines, and the culture of data-driven decisions across the company.",
    responsibilities: [
      "Design the company's core data infrastructure: event tracking schema, data warehouse, ETL pipelines",
      "Build dashboards providing real-time visibility into agent performance for all teams",
      "Define and track key product metrics: agent accuracy, task completion, token economics, user satisfaction",
      "Produce weekly analytics reports with actionable insights — not just charts",
    ],
    requirements: [
      "Strong SQL — complex analytical queries without reference material",
      "Python for data manipulation: Pandas, NumPy, visualisation libraries",
      "Statistical fundamentals: distributions, hypothesis testing, confidence intervals",
      "Minimum CGPA 8.0/10 — verified",
    ],
    niceToHave: [
      "Experience with dbt, Airflow, or data pipeline tools",
      "Familiarity with BigQuery, Snowflake, or Redshift",
    ],
  },
  {
    id: "aec-advisor",
    jobId: "SB-2025-AEC-001",
    category: "AEC DOMAIN",
    type: "AEC",
    title: "AEC Domain Advisor",
    experience: "8–15 Years",
    ctc: "₹28 LPA CTC",
    location: "Gurugram, Haryana",
    mode: "Hybrid",
    degree:
      "B.Arch / B.E. Civil / M.Arch / M.Tech Structures. Council of Architecture registration preferred.",
    overview:
      "You are the domain expert whose knowledge we encode into our agents. You have spent 8–15 years navigating the real complexity of AEC projects — coordination failures, code misinterpretations, last-minute design changes that cascade into site rework. You define what our agents know and how they reason.",
    responsibilities: [
      "Define the domain knowledge architecture for Core Design & Compliance agents",
      "Review and validate all agent outputs against real-world AEC standards before every production release",
      "Author structured knowledge bases: codes, coordination protocols, material specifications",
      "Track NBC India, IGBC, and BIS regulatory updates and maintain agent knowledge currency",
    ],
    requirements: [
      "8–15 years hands-on AEC experience — verifiable with direct references",
      "Deep familiarity with NBC India 2016 across minimum 3 parts",
      "Experience on projects above ₹50 Crore or 10,000 sqm — scale must be verifiable",
      "Council of Architecture registration or equivalent professional body preferred",
    ],
    niceToHave: [
      "LEED / IGBC Accredited Professional certification",
      "Computational design experience: Grasshopper or Dynamo",
      "Published work in AEC journals or conference proceedings",
    ],
  },
  {
    id: "building-code",
    jobId: "SB-2025-AEC-002",
    category: "AEC DOMAIN",
    type: "AEC",
    title: "Principal Director — Building Code",
    experience: "4+ Years",
    ctc: "₹32 LPA CTC",
    location: "Gurugram, Haryana",
    mode: "Hybrid",
    degree:
      "B.Arch or B.E. Civil. Postgraduate specialisation in planning, structures, or building science strongly preferred.",
    overview:
      "You own the accuracy of our Code Compliance Agent — the most technically demanding and highest-stakes agent on the platform. When an architect trusts our agent to validate a hospital layout against NBC fire egress requirements, your knowledge is what stands between a correct output and a construction error that costs lives.",
    responsibilities: [
      "Own the Code Compliance Agent knowledge layer: structure, accuracy, update cadence, and coverage",
      "Define validation protocols for agent outputs against NBC India 2016, local bylaws, and BIS standards",
      "Build structured code knowledge bases: clause mapping, condition trees, cross-references between codes",
      "Work with the AI team to translate regulatory text into agent-interpretable structures",
      "Sign off on all compliance agent outputs before new feature releases",
    ],
    requirements: [
      "Minimum 4 years specifically in code compliance, plan approvals, or regulatory consulting",
      "Deep expertise in NBC India 2016 across at least 3 parts — interpretable without reference material",
      "Experience in plan approval with GMDA, DDA, RERA, or equivalent municipal authorities",
      "Exceptional written clarity — you author documents that AI systems process directly",
      "Minimum CGPA 7.5/10 — verified",
    ],
    niceToHave: [
      "Experience with IBC or ASHRAE standards",
      "IGBC / LEED professional certification",
    ],
  },
  {
    id: "bim-expert",
    jobId: "SB-2025-AEC-003",
    category: "AEC DOMAIN",
    type: "AEC",
    title: "BIM / Tech Integration Expert",
    experience: "3–6 Years",
    ctc: "₹24 LPA CTC",
    location: "Gurugram, Haryana",
    mode: "Hybrid",
    degree:
      "B.Arch / B.E. Civil / M.Tech — with strong computational or BIM specialisation.",
    overview:
      "You are the bridge between AEC and our AI platform. You understand both the IFC schema and Python scripting. You know what data lives inside a Revit model and how to extract it programmatically. You own the data extraction, transformation, and validation layer that feeds our agents.",
    responsibilities: [
      "Own the BIM data pipeline: IFC parsing, Revit API extraction, model validation, structured agent input",
      "Develop integrations with Autodesk Platform Services, BIM 360, Speckle, and Procore",
      "Build data extraction scripts converting BIM models into structured, agent-readable formats",
      "Define data quality standards and validation rules for BIM inputs entering agent pipelines",
    ],
    requirements: [
      "3–6 years BIM experience — professional proficiency in Revit and at least one other BIM tool",
      "Experience with IFC schema — able to parse and manipulate IFC files programmatically",
      "Python scripting ability: Dynamo, pyRevit, or standalone scripts",
      "Autodesk Certified Professional (Revit or APS) strongly preferred",
      "Minimum CGPA 7.0/10 — verified",
    ],
    niceToHave: [
      "Grasshopper / Rhino 3D experience for computational design",
      "Knowledge of Solibri, Tekla, or Bentley MicroStation",
    ],
  },
  {
    id: "b2b-content",
    jobId: "SB-2025-CGR-001",
    category: "CONTENT & GROWTH",
    type: "CONTENT",
    title: "B2B Content Executive",
    experience: "1–2 Years",
    ctc: "₹15 LPA CTC",
    location: "Gurugram, Haryana",
    mode: "Hybrid",
    degree:
      "Any discipline with a verifiable published writing portfolio demonstrating B2B content capability.",
    overview:
      "You are the voice of Superbuilt AI to the AEC industry. You translate highly technical agentic AI capabilities into credible, authoritative content that senior architects and construction directors trust. Our audience has seen more generic AI content than they can tolerate — the only content that works is specific, precise, and informed.",
    responsibilities: [
      "Own the content calendar: LinkedIn, long-form blog, technical case studies, whitepapers",
      "Write content that earns trust from senior AEC professionals — no hype, no generic AI narratives",
      "Interview internal domain experts and engineers to extract technically accurate publishable content",
      "Build an SEO strategy targeting high-intent AEC professional search queries",
      "Ghost-write thought leadership content for the founding team",
    ],
    requirements: [
      "Exceptional written English — formal, precise, credible. Your cover letter is your writing test.",
      "1–2 years B2B content experience — deep tech, SaaS, or AEC preferred",
      "Portfolio of published B2B content — not academic essays or general-audience posts",
      "Minimum CGPA 7.0/10",
    ],
    niceToHave: [
      "Prior content experience in AEC, PropTech, or construction technology",
      "Familiarity with Ahrefs, Semrush, or Google Search Console",
    ],
  },
];

// ─── Small atoms ─────────────────────────────────────────────────────────────

const ArrowDiag = () => (
  <svg width={14} height={14} viewBox="0 0 16 16" fill="none">
    <path
      d="M3 13L13 3M13 3H5M13 3v8"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowRight = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 10 10" fill="none" width={9} height={9}>
    <path
      d="M1.5 5l2.5 2.5 4.5-4.5"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── RatingRow ───────────────────────────────────────────────────────────────

function RatingRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-3 py-2.5 mb-0.5 border border-[#111] bg-[#080808]">
      <div className="flex-1 min-w-35 text-[13px] text-[#8b8b8b]">
        {label}
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`w-6 h-6 rounded-full border text-[10px] flex items-center justify-center transition-all
              ${value >= n
                ? "bg-white border-white text-black"
                : "border-[#1c1c1c] text-[#2e2e2e] hover:border-[#444] hover:text-[#444]"
              }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── FileUpload ──────────────────────────────────────────────────────────────

function FileUpload({
  label,
  hint,
  accept,
  required,
}: {
  label: string;
  hint: string;
  accept: string;
  required?: boolean;
}) {
  const [filename, setFilename] = useState<string | null>(null);

  return (
    <div className="mb-4">
      <label className="block text-[10px] uppercase tracking-widset text-[#777] mb-2 font-['Nunito',sans-serif]">
        {label}
        {required && <span className="text-[#666] text-[9px] ml-1">*</span>}
      </label>
      <label
        className={`border border-dashed border-[#1c1c1c] bg-[#060606] p-5 text-center cursor-pointer block transition-colors hover:border-[#2e2e2e] ${filename ? "border-solid border-[#2e2e2e]" : ""}`}
      >
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => {
            if (e.target.files?.[0]) setFilename(e.target.files[0].name);
          }}
        />
        {filename ? (
          <span className="text-[11.5px] text-[#8b8b8b]">✓ {filename}</span>
        ) : (
          <span className="text-[11.5px] text-[#333]">
            Click to upload{required ? " (Required)" : " (Optional)"}
          </span>
        )}
        <div className="text-[10px] text-[#222] mt-1">{hint}</div>
      </label>
    </div>
  );
}

// ─── FormSection ─────────────────────────────────────────────────────────────

function FormSection({
  num,
  title,
  sub,
  children,
}: {
  num: string;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-12 pb-12 border-b border-[#111] last:border-b-0">
      <div className="text-[9px] uppercase tracking-[0.16em] text-[#333] mb-1.5 font-['Nunito',sans-serif]">
        {num}
      </div>
      <div className="text-[18px] font-semibold text-white tracking-[-0.015em] mb-1.5 font-['Red_Hat_Display',sans-serif]">
        {title}
      </div>
      <div className="text-[13px] text-[#666] leading-[1.7] max-w-135 mb-5">{sub}</div>
      {children}
    </div>
  );
}

function FLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-[10px] uppercase tracking- text-[#777] mb-2 font-['Nunito',sans-serif]">
      {children}
      {required && <span className="text-[#666] text-[9px] ml-1">*</span>}
    </label>
  );
}

const inputCls =
  "w-full bg-[#080808] border border-[#111] text-[#d4d4d4] text-[14px] font-['Nunito',sans-serif] px-[13px] py-[10px] outline-none transition-colors focus:border-[#2e2e2e] placeholder-[#3a3a3a] rounded-none appearance-none";

function FInput({
  placeholder,
  type = "text",
}: {
  placeholder?: string;
  type?: string;
}) {
  return <input type={type} placeholder={placeholder} className={inputCls} />;
}

function FSelect({ children }: { children: React.ReactNode }) {
  return (
    <select
      className={`${inputCls} bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23333' d='M5 7L0 2h10z'/%3E%3C/svg%3E")] bg-no-repeat bg-position-[right_12px_center] pr-8 cursor-pointer`}
    >
      {children}
    </select>
  );
}

function FTextarea({
  rows = 4,
  placeholder,
}: {
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      rows={rows}
      placeholder={placeholder}
      className={`${inputCls} resize-y min-h-24`}
    />
  );
}

// ─── ApplicationForm ──────────────────────────────────────────────────────────

function ApplicationForm({
  role,
  onBack,
}: {
  role: Role;
  onBack: () => void;
}) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [checks, setChecks] = useState({ c1: false, c2: false, c3: false });
  const [submitted, setSubmitted] = useState(false);

  const setRating = (key: string, val: number) =>
    setRatings((prev) => ({ ...prev, [key]: val }));

  const isEng = role.type === "ENG";
  const isAEC = role.type === "AEC";
  const isContent = role.type === "CONTENT";
  const isQA = role.type === "QA";
  const isData = role.type === "DATA";

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-10">
        <div className="max-w-120 text-center">
          <div className="w-12 h-12 border border-[#2e2e2e] rounded-full flex items-center justify-center mx-auto mb-8">
            <svg viewBox="0 0 24 24" fill="none" width={20} height={20}>
              <path
                d="M5 12l5 5L19 7"
                stroke="white"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-[9px] uppercase tracking-[0.16em] text-[#333] mb-3 font-['Nunito',sans-serif]">
            Application Received
          </div>
          <div className="text-[28px] font-semibold text-white tracking-[-0.02em] font-['Red_Hat_Display',sans-serif] mb-4">
            Thank you for applying.
          </div>
          <p className="text-[14px] text-[#666] leading-[1.85] mb-6">
            Your application for <strong className="text-[#888]">{role.title}</strong> has been
            received. Our team reviews every application personally. Shortlisted candidates will
            be contacted within <strong className="text-[#888]">5 business days</strong>.
          </p>
          <div className="border border-[#111] p-4 text-[10.5px] text-[#333] leading-[1.75] mb-8">
            Your data will be retained securely for 6 months per the consent you provided. You may
            request deletion at careers@superbuilt.ai at any time.
          </div>
          <button
            onClick={onBack}
            className="text-[10px] uppercase tracking-widest text-[#444] hover:text-white transition-colors font-['Nunito',sans-serif]"
          >
            ← Back to All Roles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-180 mx-auto px-6 pt-14 pb-28 md:px-[6vw]">
      {/* Header */}
      <div className="mb-11 pb-7 border-b border-[#111]">
        <div className="text-[22px] font-semibold text-white tracking-[-0.02em] mb-2 font-['Red_Hat_Display',sans-serif]">
          {role.title}
        </div>
        <div className="flex flex-wrap gap-3.5 text-[11px] text-[#666] uppercase tracking-[0.06em] font-['Nunito',sans-serif]">
          <span>{role.location}</span>
          <span>{role.mode}</span>
          <span>{role.experience}</span>
          <span>{role.ctc}</span>
          <span>6-Month Probation</span>
        </div>
        <div className="text-[10px] text-[#444] mt-1 font-['Nunito',sans-serif] uppercase tracking-[0.12em]">
          Job ID: {role.jobId}
        </div>
        <div className="mt-4 p-3 border border-[#111] text-[11px] text-[#666] leading-[1.75]">
          <strong className="text-[#444]">DATA RETENTION NOTICE — </strong>
          By proceeding, you provide explicit consent for Superbuilt AI to collect, store, and
          process all information submitted for a period of{" "}
          <strong className="text-[#444]">six (6) calendar months</strong> from date of submission.
          Deletion requests: careers@superbuilt.ai.
        </div>
      </div>

      {/* Section 01 */}
      <FormSection
        num="Section 01"
        title="PERSONAL INFORMATION"
        sub="All fields marked * are mandatory. Discrepancies discovered at any stage — including post-offer — are grounds for immediate disqualification."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          <div>
            <FLabel required>FULL LEGAL NAME</FLabel>
            <FInput placeholder="As per government-issued ID" />
          </div>
          <div>
            <FLabel>PREFERRED NAME</FLabel>
            <FInput placeholder="What should we call you?" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          <div>
            <FLabel required>EMAIL ADDRESS</FLabel>
            <FInput type="email" placeholder="your@email.com" />
          </div>
          <div>
            <FLabel required>PHONE WITH COUNTRY CODE</FLabel>
            <FInput type="tel" placeholder="+91 98XXX XXXXX" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          <div>
            <FLabel required>CITY & STATE OF RESIDENCE</FLabel>
            <FInput placeholder="e.g. Bengaluru, Karnataka" />
          </div>
          <div>
            <FLabel required>NATIONALITY</FLabel>
            <FInput placeholder="e.g. Indian" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          <div>
            <FLabel required>DATE OF BIRTH</FLabel>
            <FInput type="date" />
          </div>
          <div>
            <FLabel required>GENDER</FLabel>
            <FSelect>
              <option disabled value="">— Select —</option>
              <option>Male</option>
              <option>Female</option>
              <option>Non-binary / Gender non-conforming</option>
              <option>Prefer not to disclose</option>
            </FSelect>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          <div>
            <FLabel required>PREFERRED START DATE</FLabel>
            <FSelect>
              <option disabled value="">— Select —</option>
              <option>Immediate (within 1 week)</option>
              <option>Within 2 weeks</option>
              <option>Within 30 days</option>
              <option>Within 60 days</option>
              <option>60+ days</option>
            </FSelect>
          </div>
          <div>
            <FLabel required>CURRENT EMPLOYMENT STATUS</FLabel>
            <FSelect>
              <option disabled value="">— Select —</option>
              <option>Employed — serving notice period</option>
              <option>Employed — not on notice</option>
              <option>Self-employed / Freelancing</option>
              <option>Unemployed / Between roles</option>
              <option>Student / Final year</option>
            </FSelect>
          </div>
        </div>
        <div className="mb-4">
          <FLabel>HOW DID YOU HEAR ABOUT THIS OPENING?</FLabel>
          <FSelect>
            <option disabled value="">— Select —</option>
            <option>LinkedIn</option>
            <option>X (Twitter)</option>
            <option>Referral from team member</option>
            <option>Job board</option>
            <option>Company website</option>
            <option>Other</option>
          </FSelect>
        </div>
      </FormSection>

      {/* Section 02 */}
      <FormSection
        num="Section 02"
        title="DOCUMENTS & ONLINE PROFILES"
        sub="All uploads reviewed in full. Incomplete or placeholder documents disqualify your application."
      >
        <div className="border border-[#111] bg-[#080808] p-3.5 text-[12.5px] text-[#666] leading-[1.75] mb-5">
          <strong className="text-[#444]">COVER LETTER REQUIREMENT — </strong>
          Your cover letter must address three specific points: (1) Why agentic AI for AEC specifically?
          (2) What specific Superbuilt AI agent or capability excites you and why? (3) What unique expertise
          do you bring that no other candidate does? Failing to address all three results in rejection.
        </div>
        <FileUpload label="RESUME / CURRICULUM VITAE (PDF)" hint="PDF only · Max 10MB" accept=".pdf" required />
        <FileUpload label="COVER LETTER (PDF, MAXIMUM 1 PAGE)" hint="PDF only · Strictly 1 page" accept=".pdf" required />
        <FileUpload label="PORTFOLIO / WORK SAMPLES" hint="PDF or ZIP · Max 25MB · Optional but significantly weighted" accept=".pdf,.zip" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          <div>
            <FLabel required>GITHUB / GITLAB PROFILE URL</FLabel>
            <FInput type="url" placeholder="https://github.com/yourusername" />
          </div>
          <div>
            <FLabel>LEETCODE / HACKERRANK PROFILE URL</FLabel>
            <FInput type="url" placeholder="https://leetcode.com/u/..." />
          </div>
        </div>
      </FormSection>

      {/* Section 03 */}
      <FormSection
        num="Section 03"
        title="EDUCATIONAL BACKGROUND"
        sub="We verify all academic records against originals. Provide exact values — rounded numbers trigger a background check hold."
      >
        <div className="border border-[#111] bg-[#080808]  p-4 mb-5">
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-5 h-5 rounded-full border border-[#1c1c1c] flex items-center justify-center text-[9px] text-[#888] font-['Red_Hat_Display',sans-serif] font-semibold">
              UG
            </div>
            <div className="text-[10px] uppercase tracking-widset text-[#666] font-['Nunito',sans-serif]">
              UNDERGRADUATE / BACHELOR&apos;S DEGREE
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
            <div>
              <FLabel required>DEGREE & MAJOR</FLabel>
              <FInput placeholder="e.g. B.Arch / B.Tech Computer Science" />
            </div>
            <div>
              <FLabel required>UNIVERSITY / INSTITUTION</FLabel>
              <FInput placeholder="e.g. IIT Bombay / NIT Trichy" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <FLabel required>YEAR OF GRADUATION</FLabel>
              <FInput placeholder="e.g. 2022" />
            </div>
            <div>
              <FLabel required>CGPA / PERCENTAGE (SPECIFY SCALE)</FLabel>
              <FInput placeholder="e.g. 8.7 / 10 — or 81.4%" />
            </div>
          </div>
        </div>
      </FormSection>

      {/* Section 05 — AEC Domain Knowledge */}
      <FormSection
        num="Section 05"
        title="AEC DOMAIN KNOWLEDGE"
        sub="Required for every role without exception. We build for AEC. Everyone on this team understands the domain they are building for."
      >
        <div className="mb-4">
          <FLabel required>
            WHAT DOES BIM STAND FOR, AND WHY IS IT CRITICAL IN MODERN CONSTRUCTION WORKFLOWS?
          </FLabel>
          <FTextarea
            rows={6}
            placeholder="150–250 words. Explain LOD 100–500, coordination value, clash detection integration, and lifecycle impact."
          />
        </div>
        <div className="mb-4">
          <FLabel required>
            EXPLAIN THE DIFFERENCE BETWEEN CLASH DETECTION AND CODE COMPLIANCE CHECKING.
          </FLabel>
          <FTextarea
            rows={5}
            placeholder="100–200 words. Reference RFI costs, rework rates, or real coordination failures from your experience."
          />
        </div>
        <div className="mb-4">
          <FLabel required>
            HOW WOULD YOU APPLY A SPECIFIC SUPERBUILT AI AGENT TO SOLVE A REAL AEC PAIN POINT?
          </FLabel>
          <FTextarea
            rows={7}
            placeholder="200–300 words. Be specific about the pain point, the agent behavior, and the measurable outcome."
          />
        </div>
      </FormSection>

      {/* Section 06 — AI & Technical */}
      <FormSection
        num="Section 06"
        title="AI & TECHNICAL PROFICIENCY"
        sub="Required for all roles. Expected depth scales with role seniority. An honest fresher scores higher than a bluffing senior candidate."
      >
        <div className="mb-4">
          <FLabel>OVERALL AGENTIC AI FAMILIARITY (1–5)</FLabel>
          <div className="text-[12px] text-[#555] mb-2.5 leading-[1.6]">
            1 = Heard the term. 3 = Built a simple agent with LangChain. 5 = Designed multi-agent orchestration in production.
          </div>
          <RatingRow
            label="Agentic AI Systems Familiarity"
            value={ratings["agentic"] || 0}
            onChange={(v) => setRating("agentic", v)}
          />
        </div>
        <div className="mb-4">
          <FLabel required>AI / LLM FRAMEWORKS & TOOLS WITH HANDS-ON EXPERIENCE</FLabel>
          <FInput placeholder="e.g. LangChain, LangGraph, CrewAI, OpenAI API, Anthropic Claude API, LlamaIndex" />
          <div className="text-[12px] text-[#555] mt-1.5 leading-[1.6]">
            Do not list tools you have only read about.
          </div>
        </div>
        <div className="mb-4">
          <FLabel required>
            DESCRIBE A PROJECT WHERE YOU BUILT OR DEPLOYED AN AI-POWERED SYSTEM.
          </FLabel>
          <FTextarea
            rows={6}
            placeholder="200 words. Specify: problem, model/framework/infra, what the system did, before/after in numbers."
          />
        </div>

        {isEng && (
          <div className="border border-[#111] p-4 mt-4">
            <span className="text-[9px] uppercase tracking-[0.12em] text-[#666] block mb-3.5 font-['Nunito',sans-serif]">
              Engineering Roles — Technical Depth
            </span>
            <div className="mb-4">
              <FLabel>TECHNICAL PROFICIENCY SELF-ASSESSMENT</FLabel>
              <div className="text-[12px] text-[#555] mb-2.5 leading-[1.6]">
                Overrating is penalised more than underrating — ratings are tested in the interview.
              </div>
              {[
                ["Python — async, concurrency, performance optimization", "py"],
                ["TypeScript / JavaScript / React", "ts"],
                ["Cloud Deployment & Scaling — AWS / GCP / Azure", "cloud"],
                ["Vector Databases / RAG Pipelines — Pinecone, Weaviate, Chroma", "rag"],
                ["System Design & Distributed Systems Architecture", "sysdesign"],
                ["DevOps / CI-CD / Infra as Code — Terraform, Docker, K8s", "devops"],
                ["SQL & Database Engineering — PostgreSQL, Redis", "sql"],
              ].map(([label, key]) => (
                <RatingRow
                  key={key}
                  label={label}
                  value={ratings[key] || 0}
                  onChange={(v) => setRating(key, v)}
                />
              ))}
            </div>
            <div className="mb-4">
              <FLabel required>
                DESCRIBE A TIME YOU DEBUGGED OR SCALED A COMPLEX MULTI-AGENT SYSTEM.
              </FLabel>
              <FTextarea
                rows={6}
                placeholder="Failure mode, diagnostic approach, what you found, before/after in concrete numbers."
              />
            </div>
          </div>
        )}
      </FormSection>

      {/* Section 09 — Strategic Fit */}
      <FormSection
        num="Section 09"
        title="STRATEGIC FIT & INTELLECTUAL CALIBRE"
        sub="These questions have no correct answer — only honest and shallow ones. We read every response personally."
      >
        <div className="mb-4">
          <FLabel required>
            WHY DO YOU WANT TO JOIN A FUNDED EARLY-REVENUE STARTUP BUILDING THE FIRST UNIFIED AGENTIC AI PLATFORM FOR AEC?
          </FLabel>
          <FTextarea
            rows={6}
            placeholder="150–250 words. Not what you think we want to hear — what is actually true for you."
          />
        </div>
        <div className="mb-4">
          <FLabel required>
            DESCRIBE A TIME YOU IDENTIFIED AND ACTED ON A COMPLEX, AMBIGUOUS PROBLEM NOBODY ASKED YOU TO SOLVE.
          </FLabel>
          <FTextarea
            rows={6}
            placeholder="STAR format preferred. 200 words. Specificity matters."
          />
        </div>
        <div className="mb-4">
          <FLabel required>
            WHAT IS ONE AI-NATIVE WORKFLOW THAT WILL BE STANDARD IN EVERY LARGE ARCHITECTURE FIRM BY 2030?
          </FLabel>
          <FTextarea
            rows={5}
            placeholder="Be specific and bold about where the deepest leverage point is."
          />
        </div>
        <div className="mb-4">
          <FLabel>ADDITIONAL INFORMATION, CONTEXT, OR QUESTIONS FOR US</FLabel>
          <FTextarea
            rows={4}
            placeholder="Optional. Links to things you have built, context about resume gaps, or a specific question for us."
          />
        </div>
      </FormSection>

      {/* Section 10 — Declarations */}
      <FormSection
        num="Section 10"
        title="DECLARATIONS & CONSENT"
        sub="Read each declaration carefully. These are legally binding statements."
      >
        {(["c1", "c2", "c3"] as const).map((key, i) => {
          const texts = [
            "I CONFIRM THAT ALL INFORMATION PROVIDED IN THIS APPLICATION IS ACCURATE, COMPLETE, AND NOT MISLEADING IN ANY MATERIAL RESPECT. I UNDERSTAND THAT MISREPRESENTATION DISCOVERED AT ANY STAGE — INCLUDING AFTER AN OFFER HAS BEEN EXTENDED — IS GROUNDS FOR IMMEDIATE DISQUALIFICATION OR TERMINATION WITHOUT NOTICE OR COMPENSATION.",
            "I PROVIDE EXPLICIT AND INFORMED CONSENT FOR SUPERBUILT AI TO COLLECT, STORE, AND PROCESS ALL INFORMATION IN THIS APPLICATION FOR A PERIOD OF SIX (6) CALENDAR MONTHS FROM DATE OF SUBMISSION, IRRESPECTIVE OF OUTCOME. MY DATA WILL NOT BE SOLD OR SHARED WITH THIRD PARTIES OUTSIDE OF BACKGROUND VERIFICATION PARTNERS.",
            "I AUTHORISE SUPERBUILT AI TO CONDUCT EMPLOYMENT VERIFICATION, ACADEMIC RECORD VERIFICATION, AND DIRECT REFERENCE CALLS WITH FORMER EMPLOYERS OR SUPERVISORS I HAVE LISTED, SHOULD MY CANDIDACY PROGRESS TO THE OFFER STAGE.",
          ];
          return (
            <div
              key={key}
              className="flex gap-3 items-start mb-3.5 cursor-pointer"
              onClick={() => setChecks((p) => ({ ...p, [key]: !p[key] }))}
            >
              <div
                className={`w-3.75 h-3.75 border shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                  checks[key] ? "bg-white border-white" : "border-[#2e2e2e] bg-[#080808]"
                }`}
              >
                {checks[key] && <Check />}
              </div>
              <div className="text-[12.5px] text-[#666] leading-[1.75]">{texts[i]}</div>
            </div>
          );
        })}

        <div className="mt-5 mb-5 p-3.5 border border-[#111] text-[10.5px] text-[#2e2e2e] leading-[1.75]">
          SUPERBUILT AI IS AN EQUAL OPPORTUNITY EMPLOYER. ALL APPLICATIONS ARE EVALUATED SOLELY ON
          MERIT — DOMAIN EXPERTISE, TECHNICAL ABILITY, INTELLECTUAL CALIBRE, AND DEMONSTRATED
          CONTRIBUTION. SHORTLISTED CANDIDATES WILL BE CONTACTED WITHIN 5 BUSINESS DAYS.
        </div>

        <button
          onClick={() => {
            if (!checks.c1 || !checks.c2 || !checks.c3) {
              alert("Please confirm all three declarations before submitting your application.");
              return;
            }
            setSubmitted(true);
            window.scrollTo(0, 0);
          }}
          className="inline-flex items-center gap-2.5 bg-white text-black font-['Red_Hat_Display',sans-serif] font-semibold text-[12.5px] rounded-full px-6 py-3 transition-all hover:scale-[1.02] active:scale-[0.97] hover:bg-[#e5e5e5] mt-5"
        >
          Submit Application <ArrowRight />
        </button>
      </FormSection>
    </div>
  );
}

// ─── RoleDetail ───────────────────────────────────────────────────────────────

function RoleDetail({
  role,
  onApply,
}: {
  role: Role;
  onApply: () => void;
}) {
  return (
    <div className="max-w-215 mx-auto px-6 pt-16 pb-24 md:px-[6vw]">
      <div className="text-[9px] uppercase tracking-[0.16em] text-[#333] mb-3.5 font-['Nunito',sans-serif]">
        {role.category}
      </div>
      <div className="text-[10px] uppercase tracking-[0.12em] text-[#333] mb-2.5 font-['Nunito',sans-serif]">
        Job ID — {role.jobId}
      </div>
      <h1 className="text-[clamp(28px,4vw,48px)] font-semibold text-white tracking-[-0.025em] leading-[1.08] mb-7 font-['Red_Hat_Display',sans-serif]">
        {role.title}
      </h1>

      {/* Meta grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 border border-[#111] mb-0">
        {[
          ["Location", role.location],
          ["Work Mode", role.mode],
          ["Experience", role.experience],
          ["Probation", "6 Months"],
        ].map(([label, val], i) => (
          <div
            key={label}
            className={`px-4 py-3.5 ${i < 3 ? "border-r border-[#111]" : ""} ${
              i >= 2 ? "border-t border-[#111] md:border-t-0" : ""
            }`}
          >
            <div className="text-[9px] uppercase tracking-[0.12em] text-[#666] mb-1 font-['Nunito',sans-serif]">
              {label}
            </div>
            <div className="text-[12.5px] text-[#d4d4d4] font-medium">{val}</div>
          </div>
        ))}
      </div>
      <div className="border border-t-0 border-[#111]  px-4 py-3.5 flex items-baseline justify-between mb-10">
        <div className="text-[9px] uppercase tracking-[0.12em] text-[#666] font-['Nunito',sans-serif]">
          Total Compensation
        </div>
        <div className="text-[18px] font-semibold text-white tracking-[-0.02em] font-['Red_Hat_Display',sans-serif]">
          {role.ctc}
        </div>
      </div>

      {/* Qualification */}
      <div className="mb-9">
        <div className="flex items-center gap-2.5 text-[9px] uppercase tracking-[0.16em] text-[#333] mb-4 font-['Nunito',sans-serif] after:flex-1 after:h-px after:bg-[#111]">
          Minimum Qualification
        </div>
        <div className="bg-[#0a0a0a] border border-[#111] px-4 py-3 text-[12.5px] text-[#8b8b8b] leading-[1.7]">
          {role.degree}
        </div>
      </div>

      {/* Overview */}
      <div className="mb-9">
        <div className="flex items-center gap-2.5 text-[9px] uppercase tracking-[0.16em] text-[#333] mb-4 font-['Nunito',sans-serif] after:flex-1 after:h-px after:bg-[#111]">
          Role Overview
        </div>
        <p className="text-[14px] text-[#8b8b8b] leading-[1.85]">{role.overview}</p>
      </div>

      {/* Responsibilities */}
      <div className="mb-9">
        <div className="flex items-center gap-2.5 text-[9px] uppercase tracking-[0.16em] text-[#333] mb-4 font-['Nunito',sans-serif] after:flex-1 after:h-px after:bg-[#111]">
          Key Responsibilities
        </div>
        <ul className="flex flex-col gap-2.25">
          {role.responsibilities.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-[13.5px] text-[#8b8b8b] leading-[1.75]">
              <span className="text-[#2e2e2e] font-['Red_Hat_Display',sans-serif] font-semibold text-[10px] shrink-0 min-w-4.5 pt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Requirements */}
      <div className="mb-9">
        <div className="flex items-center gap-2.5 text-[9px] uppercase tracking-[0.16em] text-[#333] mb-4 font-['Nunito',sans-serif] after:flex-1 after:h-px after:bg-[#111]">
          Mandatory Requirements
        </div>
        <ul className="flex flex-col gap-2.25">
          {role.requirements.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-[13.5px] text-[#8b8b8b] leading-[1.75]">
              <span className="text-[#2e2e2e] shrink-0 pt-0.5">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Nice to have */}
      {role.niceToHave && (
        <div className="mb-9">
          <div className="flex items-center gap-2.5 text-[9px] uppercase tracking-[0.16em] text-[#333] mb-4 font-['Nunito',sans-serif] after:flex-1 after:h-px after:bg-[#111]">
            Preferred Qualifications
          </div>
          <ul className="flex flex-col gap-2.25">
            {role.niceToHave.map((item, i) => (
              <li key={i} className="flex gap-2.5 text-[13.5px] text-[#333] leading-[1.75]">
                <span className="text-[#2e2e2e] shrink-0 pt-0.5">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Privacy notice */}
      <div className="border border-[#111] px-4 py-3.5 text-[11.5px] text-[#666] leading-[1.75] mt-7 mb-7">
        <strong className="text-[#444]">Data & Privacy Notice — </strong>
        By submitting your application, you provide informed consent for Superbuilt AI to collect,
        store, and process your personal data for a period of{" "}
        <strong className="text-[#444]">six (6) calendar months</strong> from date of submission,
        regardless of outcome. Governed by IT (Amendment) Act, 2008. You may request deletion at
        careers@superbuilt.ai at any time.
      </div>

      <div className="flex items-center gap-3.5 flex-wrap">
        <button
          onClick={onApply}
          className="inline-flex items-center gap-2.5 bg-white text-black font-['Red_Hat_Display',sans-serif] font-semibold text-[12.5px] rounded-full px-6 py-3 transition-all hover:scale-[1.02] active:scale-[0.97] hover:bg-[#e5e5e5]"
        >
          Apply for This Position <ArrowRight />
        </button>
        <span className="text-[11px] text-[#2e2e2e] max-w-70 leading-[1.7]">
          Shortlisted candidates contacted within 5 business days.
        </span>
      </div>
    </div>
  );
}

// ─── RoleCard ─────────────────────────────────────────────────────────────────

function RoleCard({
  role,
  onClick,
}: {
  role: Role;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-black hover:bg-[#080808] px-6 py-7 cursor-pointer transition-colors relative flex flex-col gap-0"
    >
      <div className="text-[9px] uppercase tracking-[0.14em] text-[#555] mb-3 font-['Nunito',sans-serif]">
        {role.jobId}
      </div>
      <div className="text-[9px] uppercase tracking-[0.14em] text-[#555] mb-3 font-['Nunito',sans-serif]">
        {role.category}
      </div>
      <div className="text-[15px] font-medium text-white leading-[1.3] mb-2.5 font-['Red_Hat_Display',sans-serif]">
        {role.title}
      </div>
      <div className="text-[13px] text-[#666] leading-[1.7] flex-1 line-clamp-3 mb-4">
        {role.overview.substring(0, 140)}...
      </div>
      <div className="border-t border-[#111] pt-3.5 flex flex-col gap-2">
        <div className="text-[14px] font-medium text-[#d4d4d4] font-['Red_Hat_Display',sans-serif]">
          {role.ctc}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {[role.experience, role.mode, "6-Mo Probation"].map((tag) => (
            <span
              key={tag}
              className="text-[9px] text-[#555] border border-[#111] px-2 py-0.5 rounded-full tracking-[0.05em]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute top-6 right-6 text-[#222] transition-all group-hover:text-[#555]">
        <ArrowDiag />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CareersPage() {
  const [view, setView] = useState<View>("listing");
  const [filterCat, setFilterCat] = useState<FilterCat>("ALL");
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const pct = Math.min(
        100,
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      setScrollPct(pct);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showView = useCallback((v: View) => {
    setView(v);
    window.scrollTo(0, 0);
  }, []);

  const openRole = (id: string) => {
    const role = ROLES.find((r) => r.id === id);
    if (role) {
      setCurrentRole(role);
      showView("detail");
    }
  };

  const openForm = () => showView("form");

  const handleBack = () => {
    if (view === "form") showView("detail");
    else {
      setCurrentRole(null);
      showView("listing");
    }
  };

  const filtered = filterCat === "ALL" ? ROLES : ROLES.filter((r) => r.category === filterCat);

  return (
    <div
      className="min-h-screen bg-black text-[#d4d4d4] font-['Nunito',sans-serif] text-[14px] leading-[1.8] antialiased"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      {/* Scrollbar styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@300;400;500;600;700&family=Nunito:wght@400;500;600&display=swap');
        *,:before,:after{box-sizing:border-box}
        ::selection{background:rgba(255,255,255,0.12)}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:#000}
        ::-webkit-scrollbar-thumb{background:#1c1c1c;border-radius:2px}
        select option{background:#080808;color:#d4d4d4}
        .line-clamp-3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
        .after-line::after{content:'';flex:1;height:1px;background:#111}
      `}</style>

      {/* Progress */}
      <div className="fixed top-0 left-0 right-0 z-200 h-px bg-transparent">
        <div
          className="h-full bg-white opacity-50 transition-all duration-300"
          style={{ width: `${scrollPct}%` }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-100 h-16 bg-black/97 backdrop-blur-2xl border-b border-[#111] flex items-center justify-between px-[5vw]">
        <button
          onClick={() => { setCurrentRole(null); showView("listing"); }}
          className="flex items-center gap-2.5 bg-transparent border-0 cursor-pointer"
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-white"
            style={{ animation: "pdot 3s ease-in-out infinite" }}
          />
          <style>{`@keyframes pdot{0%,100%{opacity:1}50%{opacity:0.35}}`}</style>
          <span className="font-['Red_Hat_Display',sans-serif] font-semibold text-[15px] text-white tracking-[-0.02em]">
            Superbuilt <span className="font-light text-[#444]">AI</span>
          </span>
        </button>
        <div className="flex items-center gap-3.5">
          {view !== "listing" && (
            <button
              onClick={handleBack}
              className="text-[10px] uppercase tracking-widest text-[#444] hover:text-white transition-colors cursor-pointer bg-transparent border-0 flex items-center gap-1.5 font-['Nunito',sans-serif]"
            >
              <svg viewBox="0 0 12 12" fill="none" width={11} height={11}>
                <path
                  d="M8 1L3 6l5 5"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {view === "form" ? "Back to Role" : "All Roles"}
            </button>
          )}
          <span className="text-[10px] uppercase tracking-widest text-[#333] border border-[#111] px-3 py-1 rounded-full font-['Nunito',sans-serif] hidden sm:inline">
            Gurugram, Haryana
          </span>
        </div>
      </header>

      {/* Views */}
      <div className="pt-16">
        {/* ─ LISTING ─ */}
        {view === "listing" && (
          <div>
            {/* Hero */}
            <div className="w-full px-[6vw] pt-22 pb-14">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-5 h-px bg-[#2e2e2e]" />
                <span className="text-[11px] uppercase tracking-[0.16em] text-[#444] font-['Nunito',sans-serif]">
                  Open Positions — 2025
                </span>
              </div>
              <h1
                className="font-['Red_Hat_Display',sans-serif] font-semibold text-white tracking-[-0.03em] leading-[1.05] mb-6"
                style={{ fontSize: "clamp(44px,7vw,88px)" }}
              >
                We don&apos;t hire
                <br />
                candidates.
                <br />
                <span className="font-light text-[#333]">We choose pioneers.</span>
              </h1>
              <p className="text-[15px] text-[#888] leading-[1.85] max-w-140">
                Superbuilt AI is building the infrastructure that will run the construction
                industry&apos;s future. A seat at this table is rare. The people we hire don&apos;t
                just work here — they shape what this platform becomes. If you&apos;re reading this,
                you already know whether you qualify.
              </p>
            </div>

            {/* Hero image placeholder */}
            <div className="w-full overflow-hidden" style={{ height: "clamp(260px,40vw,520px)" }}>
              
              <div className="w-full h-full bg-[#0a0a0a] relative">
                
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#080808]/20 to-black/60" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#1c1c1c] font-['Nunito',sans-serif]">
<Image 
    src="/pictures/career.jpg" 
    alt="Gurugram Office" 
    width={2000} // Add necessary width
    height={400} // Add necessary height
  />                  Gurugram Office
                    
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="w-full px-[6vw] py-7 flex flex-wrap gap-1.5 border-b border-t border-[#111]">
              {(["ALL", "ENGINEERING", "AEC DOMAIN", "DATA", "CONTENT & GROWTH"] as FilterCat[]).map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCat(cat)}
                    className={`text-[10px] uppercase tracking-[0.08em] px-3.5 py-1.5 rounded-full border transition-all font-['Nunito',sans-serif]
                      ${
                        filterCat === cat
                          ? "bg-white border-white text-black"
                          : "border-[#1c1c1c] bg-transparent text-[#444] hover:border-[#2e2e2e] hover:text-[#d4d4d4]"
                      }`}
                  >
                    {cat === "ALL" ? "All Roles" : cat}
                  </button>
                )
              )}
            </div>

            {/* Grid */}
            <div
              className="w-full grid gap-px bg-[#111]"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(min(320px, 100%), 1fr))",
              }}
            >
              {filtered.map((role) => (
                <RoleCard key={role.id} role={role} onClick={() => openRole(role.id)} />
              ))}
            </div>

            {/* Footer */}
            <div className="w-full px-[6vw] py-8 border-t border-[#111] text-center">
              <p className="text-[12px] text-[#555] leading-[1.75] max-w-150 mx-auto">
                Superbuilt AI is an equal opportunity employer. Applications are reviewed personally. We do not offer
                 pre-interview informal calls before reviewing your application.
              </p>
            </div>
          </div>
        )}

        {/* ─ DETAIL ─ */}
        {view === "detail" && currentRole && (
          <RoleDetail role={currentRole} onApply={openForm} />
        )}

        {/* ─ FORM ─ */}
        {view === "form" && currentRole && (
          <ApplicationForm role={currentRole} onBack={() => showView("detail")} />
        )}
      </div>
    </div>
  );
}