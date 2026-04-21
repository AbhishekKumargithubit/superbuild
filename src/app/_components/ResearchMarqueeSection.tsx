import { MarqueeDemoVertical } from "./ImageGrid";

export function ResearchMarqueeSection() {
  return (
    <section className="mx-auto pb-16 pt-10  md:pb-24">
      <div className="mb-20 text-center">
        <h2 className="mt-10 text-2xl font-semibold tracking-tight text-white md:text-[77px] ">
          .One AI to Run
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg font-normal text-[#8a8a8a] md:text-[49px] mt-[-3px]">
          Every AEC project
        </p>
        <button className="mt-6 cursor-pointer rounded-full bg-white px-6 py-2 font-bold text-black shadow-[0px_0px_79px_39px_rgba(0,21,50)] transition-opacity hover:opacity-90">
          View Research
        </button>
      </div>
      <div>
        <MarqueeDemoVertical />
      </div>
    </section>
  );
}
