"use client";

import { useEffect, useRef, useState } from "react";

type Step = {
  title: string;
  description: string;
  mediaSrc: string;
};

const STEPS: Step[] = [
  {
    title: "Plug-in",
    description:
      "Connect your email, chats, and project tools in minutes. SuperBuilt syncs everything and actively manages tasks, priorities, and coordination across teams.",
    mediaSrc:
      "https://res.cloudinary.com/didwvcwit/image/upload/v1776747359/ai-task-management-communication-automation-aec-workflow-assistant_sbxc7u.gif",
  },
  {
    title: "Goes to work",
    description:
      "A network of specialized AI agents gets to work — across drawings, compliance, and coordination. They manage tasks, align teams, and keep the project moving without you stepping in.",
    mediaSrc:
      "https://res.cloudinary.com/didwvcwit/image/upload/v1776747360/ai-aec-project-dashboard-task-tracking-workflow-visibility_dcx8bj.gif",
  },
  {
    title: "Stay focused",
    description:
      "Stay focused on what you’re great at—creativity, design, and shaping the built environment.",
    mediaSrc:
      "https://res.cloudinary.com/didwvcwit/video/upload/q_auto/f_auto/v1776533289/4K%20VIDEOS/How%20to%20work%20-%2003/ai-for-architects-creative-workflow-human-ai-collaboration-design-focus_hubxjx.mp4",
  },
];

export function StickyVideoSteps() {
  const [activeStep, setActiveStep] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0) return;

    const setClosestCardAsActive = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        const cardIndex = Number(card.getAttribute("data-step"));

        if (!Number.isNaN(cardIndex) && distance < closestDistance) {
          closestDistance = distance;
          closestIndex = cardIndex;
        }
      });

      setActiveStep(closestIndex);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const hasVisibleCard = entries.some((entry) => entry.isIntersecting);
        if (hasVisibleCard) setClosestCardAsActive();
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75],
        rootMargin: "-10% 0px -10% 0px",
      },
    );

    cards.forEach((card) => observer.observe(card));
    setClosestCardAsActive();

    return () => observer.disconnect();
  }, []);

  return (
    <section className="mx-auto w-full  py-8 md:pl-10 p-0  ">
      <div className="flex justify-between items-center my-10 mb-15 mx-2">
        <h2 className="text-5xl font-bold  text-white md:text-7xl">
          <span className="text-[#8a8a8a] mx-[-5]">.</span>Design without <br />{" "}
          <span className="text-[#8a8a8a] text-6xl ml-h-90 mx-[5]">
            the busywork
          </span>
        </h2>
        <button className="cursor-pointer rounded-full font-bold text-lg bg-white px-6 py-2 text-black shadow-[10px_9px_29px_9px_rgba(0,21,50)] transition-opacity hover:opacity-90">
        <li className="list-none p-0 m-0">
          <a href="/PeerStoriesPage">
            Peer stories
          </a>
          </li>  
        </button>
      </div>
      <div className="flex w-full flex-col gap-10 md:flex-row md:gap-10 mb-10">
        <div className="w-full md:w-[30%] pl-5">
          <div className="md:sticky md:top-5">
            <div className="mt-10 space-y-3">
              {STEPS.map((step, index) => (
                <div key={step.title}>
                  <button
                    type="button"
                    onClick={() =>
                      cardRefs.current[index]?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      })
                    }
                    className={`block w-full border-b pb-3 text-left text-s font-semibold transition-colors md:text-2xl ${
                      activeStep === index
                        ? "border-[#5f5f5f] text-white"
                        : "border-[#303030] text-[#c4c4c4] hover:text-white"
                    }`}
                  >
                    {step.title}
                  </button>

                  <div
                    className={`max-w-sm overflow-hidden transition-all duration-700 ease-out ${
                      activeStep === index
                        ? "mt-4 max-h-48 opacity-100"
                        : "mt-0 max-h-0 opacity-0"
                    }`}
                  >
                    <div>
                      <p className="text-sm leading-tight text-[#9b9b9b] [font-family:var(--font-myfont)]">
                        {step.description}
                      </p>
                      <button
                        type="button"
                        className="mt-4  font-medium text-white transition-opacity hover:opacity-80 md:text-2xl"
                      >
                        Learn more &gt;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full  rounded-lg object-covermax-w-sm ">
          <div className="space-y-12">
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                data-step={index}
                className="rounded-3xl"
              >
                <div className="relative aspect-18/10 min-h-90 overflow-hidden rounded-2xl rounded-br-none rounded-tr-none md:min-h-115">
                  {step.mediaSrc.endsWith(".mp4") ? (
                    <video
                      src={step.mediaSrc}
                      className="h-full w-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={step.mediaSrc}
                      alt={step.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-linear-to-l from-black/70 to-transparent md:w-18" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
