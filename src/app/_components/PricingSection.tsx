"use client";

import Image from "next/image";

type PricingPlan = {
  price: string;
  includes: string;
  details: string[];
};

const PRICING_PLANS: PricingPlan[] = [
  {
    price: "$5/mo",
    includes: "1,000 tokens / month",
    details: ["2 active projects", "Core AI tools (design + compliance)"],
  },
  {
    price: "$20/mo",
    includes: "5,000 tokens / month",
    details: [
      "4 active projects",
      "All core + advanced AI tools",
      "Image generation",
      "Voice Assistant",
      "Connected workspace (email, drive, calendar, etc.)",
    ],
  },
  {
    price: "$100/mo",
    includes: "20,000 tokens / month",
    details: [
      "10 active projects",
      "Everything in Plus",
      "4K image generation",
      "Batch processing",
      "Faster processing",
      "AI-powered call assistant",
    ],
  },
];

export function PricingSection() {
  return (
    <section className="mt-20 px-2 pb-8 md:mt-36   mx-auto max-w-[1500px] border-none">
      <div className="text-center">
        <h3 className="text-[35px] font-semibold tracking-tight text-white md:text-[82px]">
          <span className="text-[#8a8a8a]">.</span>Unlock Your{" "}
          <span className="text-[#6e6e6e]">Potential</span>
        </h3>
        <button
          type="button"
          className="mt-8 text-[20px] rounded-full bg-[#6a6a6a] px-10 py-2.5 text-base font-medium text-[#f3f3f3] transition-colors hover:bg-[#7b7b7b]"
        >
          See Full Breakdown
        </button>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-8 md:mt-20 md:grid-cols-3 md:gap-28">
        {PRICING_PLANS.map((plan) => (
          <article key={plan.price} className="flex h-full flex-col text-white">
            <p className="text-4xl font-bold tracking-tight md:text-[35px]">
              {plan.price}
            </p>
            <button
              type="button"
              className="mt-8 w-full rounded-full bg-[#f2f2f2] px-6 py-2 text-base font-semibold text-black transition-opacity hover:opacity-90"
            >
              Get Started
            </button>

            <div className="mt-6 border-t border-[#a4a4a4]/70 pt-4">
              <div className="flex flex-col gap-2">
                <p className="mt-2 flex items-center gap-0 text-3xl font-semibold leading-none text-[#f3f3f3] md:text-[22px]">
                  <span className="-ml-10 inline-flex shrink-0 items-center justify-center">
                    <Image
                      src="/icons/icontick-01.svg"
                      alt="Image Generation"
                      width={40}
                      height={40}
                      className="block h-10 w-10 object-contain object-left"
                    />
                  </span>
                  Includes:
                </p>
                <p className="mt-3 text-base font-semibold text-[#ececec] md:text-[16px]">
                  {plan.includes}
                </p>
              </div>
            </div>

            <div className="mb-10 mt-6 border-t border-[#a4a4a4]/70 pt-6">
              <ul className="list-disc space-y-1 pl-5 text-base text-[#ffffff] marker:text-[#e8e8e8] md:text-[17px]">
                {plan.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>

            <div className="mt-10 border-y border-[#a4a4a4]/70 py-3 md:mt-auto">
              <button
                type="button"
                className="text-[20px] font-bold text-[#f2f2f2] transition-opacity hover:opacity-80 md:text-[22px]"
              >
                View All Features
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 flex justify-end">
        <button
          type="button"
          className="text-base font-medium text-[#8f8f8f] transition-colors hover:text-[#b9b9b9] md:text-lg"
        >
          Contact For Enterprise &gt;
        </button>
      </div>
    </section>
  );
}
