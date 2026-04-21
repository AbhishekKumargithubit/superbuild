import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
import { MediaShowcase } from "./MediaShowcase";

const PARTNER_LOGOS = [
  { src: "/icons/Jacobs_logo-01.png", alt: "Jacobs", width: 80, height: 26 },
  { src: "/icons/AECOM LOGO-01.png", alt: "aecom", width: 80, height: 26 },
  { src: "/icons/DLF%20LOGO-01.png", alt: "DLF", width: 80, height: 26 },
  {
    src: "/icons/skets%20studio%20logo-01.png",
    alt: "Skets Studio",
    width: 80,
    height: 26,
  },
  { src: "/icons/wsp%20logo-01.png", alt: "WSP", width: 80, height: 26 },
  {
    src: "/more%20logos/logo-etereo-white-01.png",
    alt: "Etereo",
    width: 80,
    height: 36,
  },
  {
    src: "/more%20logos/PW-logo-white-01.png",
    alt: "PW",
    width: 80,
    height: 36,
  },
  {
    src: "/more%20logos/media_olsonkundig_logo-01.png",
    alt: "Olson Kundig",
    width: 80,
    height: 36,
  },
  {
    src: "/more%20logos/Trifold%20%282%29.png",
    alt: "Trifold",
    width: 80,
    height: 26,
  },
  {
    src: "/more%20logos/Z-Logo-White-2048x1469.png",
    alt: "Z Logo",
    width: 80,
    height: 26,
  },
] as const;

export function MediaPartnersSection() {
  return (
    <section className=" px-4 pb-16 pt-10 md:px-8 md:pb-24 md:pt-14">
      <MediaShowcase />
      <p className="mx-auto mt-12 max-w-3xl text-center tracking-wider italic text-[18px] font-semibold text-[#545454] md:mt-16 md:text-base">
        &ldquo;Used by professionals from leading global AEC firms and
        studios&rdquo;
      </p>
      <Marquee
        reverse
        repeat={2}
        className="mx-auto mt-10 max-w-[1500px] [--duration:30s] [--gap:1.5rem] md:mt-14 gap-[50px]"
      >
        {PARTNER_LOGOS.map((logo) => (
          <div
            key={logo.src}
            className={`relative ml-[100px] shrink-0 ${logo.alt === "Skets Studio" ? "mt-[-20px] h-32 w-36" : "h-20 w-24"} ${logo.alt === "WSP" ? "mt-[11px]" : ""}`}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              fill
              sizes="144px"
              className="object-contain opacity-20"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
