"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

function PaperclipIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroHeaderSection() {
  const texts = [
    <>
      Architects and designers lose 52% of their workweek to coordination
      <br />
      and admin leaving less than half their time for actual design
    </>,
    <>
      Meet Superbuilt — your AI project architect that handles RFIs, emails,
      <br /> coordination, compliance, and drawings… so you can focus on design.
    </>,
    <>
      AI that handles the non-creative work so
      <br />
      architects and designers don’t have to.
    </>,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setShow(true);
      }, 500); // fade out duration
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="mx-auto w-full px-6 pb-8 pt-28">
      <nav className="fixed inset-x-0 top-4 z-50 flex w-full items-center justify-between px-6">
        <div>
          <Image
            src="/icons/LOGONEW-01.png"
            alt="logo"
            width={130}
            height={130}
          />
        </div>
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-8 rounded-full border border-white/35 bg-white/12 px-8 py-2 text-[20px] font-semibold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_10px_30px_rgba(0,21,50,0.28)] backdrop-blur-2xl">
          <a href="#" className="transition-opacity hover:opacity-85">
            About
          </a>
          <a href="#" className="transition-opacity hover:opacity-85">
            Pricing
          </a>
          <a href="#" className="transition-opacity hover:opacity-85">
            Agent Directory
          </a>
          <a href="#" className="transition-opacity hover:opacity-85">
            More
          </a>
        </div>

        <div className="flex items-center gap-6 text-[20px] font-semibold">
          <button className="cursor-pointer text-white transition-opacity hover:opacity-80">
            Login
          </button>
          <button
            className={`cursor-pointer rounded-full bg-white px-6 py-2 text-black transition-opacity hover:opacity-90 ${
              isScrolled
                ? "shadow-none"
                : "shadow-[10px_9px_29px_9px_rgba(0,21,50)]"
            }`}
          >
            Try for free
          </button>
        </div>
      </nav>

      <section className="relative mt-16 flex flex-col items-center px-4 pb-16 text-center md:mt-[70px] md:pb-24">
        <div className="max-w-[1800px] h-[182px] absolute top-[-400px]">
          <Image
            src="/icons/logo-superbuilt-01.png"
            alt="superbuilt ai"
            width={1791}
            height={182}
            className=""
          />
        </div>
        <p
          className={`mt-[245px] lg:mt-[455px] max-w-2xl text-[16px] font-medium text-white leading-snug transition-all duration-500 ease-in-out ${
            show ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
          style={{
            minHeight: "3.2em",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {texts[currentIndex]}
        </p>
        <div className="relative mt-12 w-full max-w-xl">
          <div className="relative flex w-full items-center gap-3 rounded-full bg-[#e6e6e6] px-4 py-3.5 shadow-[10px_9px_109px_30px_rgba(0,21,50)] md:px-5 md:py-2.5">
            <PaperclipIcon className="-rotate-45 shrink-0 text-[#6b6b6b]" />
            <input
              type="text"
              placeholder="One AI to run every AEC project"
              className="min-w-0 flex-1 bg-transparent text-base text-[#1a1a1a] placeholder:text-[#7a7a7a] outline-none md:text-[17px]"
            />
            <button
              type="button"
              className="flex shrink-0 items-center justify-center rounded-full p-1 text-[#1a1a1a] transition-opacity hover:opacity-70"
              aria-label="Send"
            >
              <SendIcon className="rotate-45" />
            </button>
          </div>
        </div>

        <p className="mt-[65px] text-sm text-[#F2F2F2] md:text-[15px]">
          Available in 29+ countries.
        </p>
      </section>
    </div>
  );
}
