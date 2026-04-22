"use client";

import { useState } from "react";

type AgentCard = {
  title: string;
  gifSrc: string;
};

type AgentTab = {
  id: string;
  label: string;
  description: string;
  cards: AgentCard[];
};

const AGENT_TABS: AgentTab[] = [
  {
    id: "design-creation",
    label: "Design & Creation",
    description:
      "We unify your most critical tools into a single platform each powered by specialized AI agents designed for specific tasks.",
    cards: [
      {
        title: "Concept Generation",
        gifSrc:
          "https://res.cloudinary.com/didwvcwit/image/upload/v1776750047/concept_generation_agent_pesslb.gif",
      },
      {
        title: "Rendering Agent",
        gifSrc:
          "https://res.cloudinary.com/didwvcwit/image/upload/q_auto/f_auto/v1776750042/BOQ_oeu6l0.gif",
      },
      {
        title: "Sketch to CAD",
        gifSrc:
          "https://res.cloudinary.com/didwvcwit/image/upload/v1776750055/ai-sketch-to-cad-dwg-generation-autocad-architectural-drawings_iu8cm6.gif",
      },
    ],
  },
  {
    id: "analysis-intelligence",
    label: "Analysis & Intelligence",
    description:
      "We unify your most critical tools into a single platform each powered by specialized AI agents designed for specific tasks.",
    cards: [
      {
        title: "Drawing review",
        gifSrc:
          "https://res.cloudinary.com/didwvcwit/image/upload/v1776747362/ai-architectural-drawing-review-error-detection-design-validation_jbsd1u.gif",
      },
      {
        title: "code compliance",
        gifSrc:
          "https://res.cloudinary.com/didwvcwit/image/upload/q_auto/f_auto/v1776747362/ai-building-code-compliance-check-architectural-drawings_sgdr1y.gif",
      },
      {
        title: "green building certificate videos",
        gifSrc:
          "https://res.cloudinary.com/didwvcwit/image/upload/v1776747360/green_agnets_ghwgoj.gif",
      },
    ],
  },
  {
    id: "project-execution",
    label: "Project & Execution",
    description:
      "We unify your most critical tools into a single platform each powered by specialized AI agents designed for specific tasks.",
    cards: [
      {
        title: "BOQs",
        gifSrc:
          "https://res.cloudinary.com/didwvcwit/image/upload/v1776750042/BOQ_oeu6l0.gif",
      },
      {
        title: "vendor calling videos",
        gifSrc:
          "https://res.cloudinary.com/didwvcwit/image/upload/v1776747363/ai-construction-procurement-vendor-comparison-facade-materials_kfgbdt.gif",
      },
    ],
  },
  {
    id: "productivity-layer",
    label: "Productivity Layer",
    description:
      "Automate repetitive communication, follow-ups, and handoffs so teams stay focused on high-value work.",
    cards: [
      {
        title: "Task Automation Agent",
        gifSrc:
          "https://res.cloudinary.com/didwvcwit/image/upload/v1776747359/ai-task-management-communication-automation-aec-workflow-assistant_sbxc7u.gif",
      },
    ],
  },
];

export function AgentDirectoryTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const tab = AGENT_TABS[activeTab];

  return (
    <section className="mx-auto w-full  px-14 py-14 md:px-8 md:py-20 max-w-[1700px]">
      <div className="text-center mb-30 ">
        <h2 className="text-5xl font-bold tracking-tight text-white md:text-[77px] mt-12">
          <span className="text-[#8a8a8a]">.</span>Agents{" "}
          <span className="text-[#8a8a8a]">Directory</span>
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-[16px] leading-relaxed text-[#8c8c8c] font-family-[var(--font-myfont)]">
          We unify your most critical tools into a single platform each powered
          by specialized AI agents designed for specific tasks.
        </p>
      </div>

      <div className="mt-14 border-t border-[white] pt-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-8">
          {AGENT_TABS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`text-center text-[20px] font-medium transition-colors ${
                activeTab === index
                  ? "text-[#ffffff] font-semibold"
                  : "text-[#ffffff] hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[#8c8c8c] mb-20 pl-15">
          {tab.description}
        </p>
      </div>

      <div className="mt-10 -mx-4 overflow-x-auto whitespace-nowrap px-4 pb-4 md:mx-0 md:px-0 md:pb-5 [scrollbar-width:none] hover:[scrollbar-color:#4a4a4a_#141414] hover:[scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#4a4a4a] [&::-webkit-scrollbar-thumb]:hover:bg-[#5c5c5c] [&::-webkit-scrollbar-track]:bg-[#141414] [&::-webkit-scrollbar]:h-0 hover:[&::-webkit-scrollbar]:h-2.5">
        {tab.cards.map((card) => (
          <div
            key={card.title}
            className="inline-block w-[86vw] max-w-[560px] align-top pr-4 md:w-[46%] md:pr-6"
          >
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#101010]">
              <img
                src={card.gifSrc}
                alt={card.title}
                className="aspect-video h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="mt-3 text-[21px] font-medium text-white tracking-wider">
              {card.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
