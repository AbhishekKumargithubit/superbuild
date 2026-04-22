import Image from "next/image";

export function FooterSection() {
  const email = "support@antigravitee.com";
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=Support Request&body=Hi Superbuilt AI team,`;

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

      <div className="mx-auto max-w-400 bg-black px-6 py-10 md:px-10 md:py-14">
        <div className="flex flex-col justify-between gap-12 md:flex-row md:gap-8">

          {/* Left: Logo + Social */}
          <div className="max-w-xs flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <Image
                src="/icons/LOGONEW-01.png"
                alt="antigravitee"
                width={120}
                height={120}
                className="object-contain"
              />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white ">
                  Powered by
                </p>
                <p className="text-3xl font-semibold leading-tight text-[#8f8f8f]">
                  Antigravitee
                </p>
              </div>
            </div>

            {/* Get in Touch */}
            <div>
              <h3 className="text-lg font-black text-white mb-4">Get in Touch</h3>
              <div className="flex items-center gap-3">
                {/* Email */}
                <a href={gmailLink} target="_blank" rel="noopener noreferrer" aria-label="Email">
                  <Image src="/socialmediaicons/mail.png" alt="Email" width={40} height={40} className="rounded-full object-cover" />
                </a>
                {/* LinkedIn */}
                <a href="https://www.linkedin.com/company/superbuiltai/posts/?feedView=all&viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Image src="/socialmediaicons/linkedin.png" alt="LinkedIn" width={40} height={40} className="rounded-full object-cover" />
                
                </a>
                {/* Instagram */}
                <a href="https://www.instagram.com/superbuilt.ai/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Image src="/socialmediaicons/instagram.png" alt="Instagram" width={40} height={40} className="rounded-full object-cover" />
                </a>
                {/* Facebook */}
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X">
                  <Image src="/socialmediaicons/twitter.png" alt="X" width={40} height={40} className="rounded-full object-cover" />
                </a>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-[#9f9f9f]">
              Disclaimer: This platform does not support fully autonomous
              operation. Human oversight is required at all stages.
            </p>
          </div>

          {/* Right: Nav Columns */}
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-12">
            {/* Product */}
            <div>
              <h3 className="text-base font-black text-white">Product</h3>
              <ul className="mt-5 space-y-2 text-sm font-semibold text-[#9f9f9f]">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Agent Directory</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Use Cases</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compare</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-base font-black text-white">Resources</h3>
              <ul className="mt-5 space-y-2 text-sm font-semibold text-[#9f9f9f]">
                <li><a href="/PeerStoriesPage" className="hover:text-white transition-colors">Peer Stories</a></li>
                <li><a href="/superbuilt-research" className="hover:text-white transition-colors">Labs & Research</a></li>
                <li><a href="/SuperbuiltFaq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-base font-black text-white">Company</h3>
              <ul className="mt-5 space-y-2 text-sm font-semibold text-[#9f9f9f]">
                <li><a href="/Career" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Investors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Students</a></li>
              </ul>
            </div>

            {/* Our Focus */}
            <div>
              <h3 className="text-base font-black text-white">Our Focus</h3>
              <ul className="mt-5 space-y-2 text-sm font-semibold text-[#9f9f9f]">
                <li><a href="#" className="hover:text-white transition-colors">Architecture</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Engineering</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Construction</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance & Codes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-[#3a3a3a] pt-5 text-sm text-[#d8d8d8] md:mt-14 md:flex-row md:items-center md:justify-between">
          <p className="text-base font-black text-white">
            Copyright © 2026 Superbuilt AI. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-[#8f8f8f]">
            <a href="#" className="hover:opacity-70">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </section>
  );
}