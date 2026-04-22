"use client";

import Image from "next/image";
import Link from "next/link"; 

import { useEffect, useState } from "react";
import { MessageSquareHeart, GraduationCap, BriefcaseBusiness, Users,CircleHelp, Menu, X } from "lucide-react";

type MenuItem = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  href: string; 
};

const moreItems: MenuItem[] = [
  { title: "Peer Stories", subtitle: "Real teams, real result", icon: <MessageSquareHeart size={18} />, href: "/PeerStoriesPage" },
  { title: "For Students", subtitle: "Learn, build, get hired", icon: <GraduationCap size={18} />, href: "/Fellowship" },
  { title: "Careers", subtitle: "Work on what matters", icon: <BriefcaseBusiness size={18} />, href: "/Career" },
  { title: "Investors", subtitle: "Back the next category leader", icon: <Users size={18} />, href: "/InvestorPage_final" },
  { title: "FAQ", subtitle: "Everything you need to know", icon: <CircleHelp size={18} />, href: "/SuperbuiltFaq" },
];

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
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setShow(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 pt-24 pb-10">

      {/* NAVBAR */}
      <nav className="fixed inset-x-0 top-4 z-50 flex items-center justify-between px-4 sm:px-6">
        <Image src="/icons/LOGONEW-01.png" alt="logo" width={120} height={120} />

        {/* Desktop Nav */}
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-8 rounded-full border border-white/35 bg-white/12 px-8 py-2 text-[20px] font-semibold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_10px_30px_rgba(0,21,50,0.28), ] backdrop-blur-2xl
        shadow-lg shadow-blue-950">
          <a href="#">About</a>
          <a href="#">Pricing</a>
          <a href="#">Agent Directory</a>

          {/* dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMore(true)}
            onMouseLeave={() => setOpenMore(false)}
          >
            <span className="cursor-pointer">More</span>

            {openMore && (
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-60 rounded-3xl bg-black p-4 shadow-xl border border-white/30">
 {moreItems.map((item) => (
                  <Link key={item.title} href={item.href} className="flex items-center gap-5 p-3 hover:bg-white/10 rounded-xl transition-colors">
                    <div className="text-white fill-white shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-white leading-tight">{item.title}</p>
                      <p className="text-gray-400 text-sm">{item.subtitle}</p>
                    </div>
                  </Link>
                ))}
</div>

            )}
          </div>
        </div>

        {/* Right buttons */}
        <div className="flex items-center gap-6 text-[15px] font-semibold">
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

        {/* Mobile menu button */}
        <button className="lg:hidden text-white" onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="fixed inset-0 bg-black z-40 pt-32 px-6 text-center space-y-6 text-xl">
          <p>About</p>
          <p>Pricing</p>
          <p>Agent Directory</p>
          <p>Login</p>
          <button className="bg-white text-black px-6 py-3 rounded-full">
            Try free
          </button>
        </div>
      )}

      {/* HERO */}
      <section className="flex flex-col items-center text-center mt-[-250]">
        <Image
          src="/icons/logo-superbuilt-01.png"
          alt="superbuilt"
           width={1991}
            height={152}
          className="w-[85%] sm:w-[70%] lg:w-[85%]"
        />

        <p
          className={`mt-[-270] max-w-xl text-white text-sm sm:text-lg transition-all duration-500 ${
            show ? "opacity-100" : "opacity-0"
          }`}
        >
          {texts[currentIndex]}
        </p>

        {/* INPUT BAR */}
        <div className="relative mt-12 w-120 max-w-xl">
          <div className="relative flex w-full items-center gap-3 rounded-full bg-[#e6e6e6] px-4 py-3.5 shadow-[10px_9px_109px_30px_rgba(0,21,50)] md:px-5 md:py-2.5">
            <PaperclipIcon className="-rotate-45 shrink-0 text-[#6b6b6b]" />
            <input
              type="text"
              placeholder="One AI to run every AEC project"
              className="min-w-0 flex-1 bg-transparent text-base text-[#1a1a1a] placeholder:text-[#7a7a7a] outline-none md:text-[15px]"
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

        <p className="mt-10 text-gray-300 text-sm">
          Available in 29+ countries.
        </p>
      </section>
    </div>
  );
}