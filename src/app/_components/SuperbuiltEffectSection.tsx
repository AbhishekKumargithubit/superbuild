import Image from "next/image";

export function SuperbuiltEffectSection() {
  return (
    <section className="mx-auto my-20 mb-10 ">
      <h2 className="mb-2 text-right text-5xl font-bold leading-[50px] text-white md:text-[77px] mr-5">
        <span className="text-[#8a8a8a]">.</span>
        <span className="font-normal">The</span> Superbuilt
        <br />
        <span className="text-right text-[54px] text-[#8a8a8a]">Effect</span>
      </h2>
      <div className="relative h-screen overflow-hidden">
        <Image
          src="https://res.cloudinary.com/didwvcwit/image/upload/v1776747360/Reclaim_52_of_your_time_1_v4yuzn.gif"
          alt="Reclaim 52 percent of your time"
          fill
          unoptimized
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow: "inset 20px 10px 50px 20px rgba(0, 0, 0, 0.95)",
          }}
        />
      </div>
    </section>
  );
}
