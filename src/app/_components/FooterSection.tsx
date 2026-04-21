import Image from "next/image";

export function FooterSection() {
  return (
    <section className="pb-8">
      <div className="relative mx-auto mt-20 mb-20 w-full overflow-hidden">
        <Image
          src="/icons/Untitled-1-01.png"
          alt="superbuilt ai"
          width={1300}
          height={160}
          className="h-[70%] w-auto object-contain mx-auto"
          priority
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-linear-to-r from-black to-transparent md:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-linear-to-l from-black to-transparent md:w-40" />
      </div>

      <div className="mx-auto mt-8 max-w-[1600px] bg-black px-6 py-10 md:px-10 md:py-14">
        <div className="flex flex-col justify-between gap-12 md:flex-row md:gap-8">
          <div className="max-w-md">
            <div className="flex items-start gap-4">
              <Image
                src="/icons/LOGONEW-01.png"
                alt="antigravitee"
                width={130}
                height={130}
                className="object-cover"
              />
              <div>
                <p className="pl-1 text-[18px] font-black uppercase tracking-[0.2em] text-white">
                  Powered by
                </p>
                <p className="text-4xl font-semibold leading-none text-[#8f8f8f]">
                  Antigravitee
                </p>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#9f9f9f]">
                  Disclaimer: This platform does not support fully autonomous
                  operation. Human oversight is required at all stages.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 md:gap-16">
            <div>
              <h3 className="text-xl font-black text-white">Company</h3>
              <ul className="mt-5 space-y-1 text-lg font-semibold text-[#ffffff]">
                <li>
                  <a href="#" className="transition-opacity hover:opacity-70">
                    Career
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-opacity hover:opacity-70">
                    Research
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-opacity hover:opacity-70">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-opacity hover:opacity-70">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-opacity hover:opacity-70">
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Contact</h3>
              <ul className="mt-5 space-y-1 text-lg font-semibold text-[#ffffff]">
                <li>
                  <a href="#" className="transition-opacity hover:opacity-70">
                    Linkedin
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-opacity hover:opacity-70">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-opacity hover:opacity-70">
                    Twitter/x
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-opacity hover:opacity-70">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#3a3a3a] pt-5 text-sm text-[#d8d8d8] md:mt-14 md:flex-row md:items-center md:justify-between">
          <p className="text-[18px] font-black text-white">
            Copyright © 2026 Superbuilt AI. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-[#8f8f8f]">
            <a href="#" className="transition-opacity hover:opacity-70">
              Privacy
            </a>
            <a href="#" className="transition-opacity hover:opacity-70">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
