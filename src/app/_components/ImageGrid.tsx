"use client";
import { cn } from "@/lib/utils";
import { Marquee } from "../../components/ui/marquee";

type GridImage = {
  id: string;
  title: string;
  src: string;
};

const imageSources = [
  "/pictures/ai-architecture-design-floor-plan-visualization-modern-house-3d-model-superbuilt-ai.jpg",

  "/pictures/circular-concrete-house-island-minimal-architecture-ocean-retreat-courtyard-design.jpg",
  "/pictures/cliffside-vertical-architecture-modern-house-stacked-levels-glass-concrete-coastal-design.jpg",
  "/pictures/modern-luxury-house-night-view-hillside-glass-facade-contemporary-residential-architecture.jpg",

  "/pictures/luxury-waterfront-villa-night-modern-house-lake-view-glass-architecture-resort-style-home.jpg",
  "/pictures/luxury-modern-cliff-house-ocean-view-concrete-glass-villa-infinity-pool-design.jpg",
  "/pictures/modern-forest-house-retreat-geometric-architecture-luxury-villa-biophilic-design-pool.jpg",
  "/pictures/futuristic-urban-housing-parametric-architecture-megastructure-sustainable-city-design-ai.jpg",
  "/pictures/modern-coastal-house-cliffside-home-ocean-view-glass-concrete-architecture-landscape-design.jpg",
  "/pictures/organic-modern-house-curved-architecture-nature-integrated-mountain-residence-design.jpg",

  "/pictures/cliffside-vertical-architecture-modern-house-stacked-levels-glass-concrete-coastal-design.jpg",
  "/pictures/modern-concrete-house-wood-facade-hillside-architecture-glass-house-nature-integration.jpg",
  "/pictures/organic-architecture-public-building-landscape-integration-urban-design-campus-plan.jpg",
] as const;

const uniqueImageSources = Array.from(new Set(imageSources));

const allImages: GridImage[] = uniqueImageSources.map((src, index) => {
  const filename = src.split("/").pop() ?? `image-${index + 1}`;
  const baseName = filename.replace(/\.[^/.]+$/, "");
  const title = baseName
    .split("-")
    .filter(Boolean)
    .slice(0, 5)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return { id: `${baseName}-${index}`, title, src };
});

const imageRow1 = allImages.filter((_, index) => index % 5 === 0);
const imageRow2 = allImages.filter((_, index) => index % 5 === 1);
const imageRow3 = allImages.filter((_, index) => index % 5 === 2);

const imageRow4 = allImages.filter((_, index) => index % 5 === 3);
const imageRow5 = allImages.filter((_, index) => index % 5 === 4);
const ImageCard = ({ src, title }: { src: string; title: string }) => {
  return (
    <figure
      className={cn(
        "relative  min-w-[220px] max-w-[360px] cursor-pointer overflow-hidden rounded-2xl",
      )}
    >
      <img
        className="h-[36vw] min-h-[320px] max-h-[520px] w-full rounded-lg object-cover"
        src={src}
        alt={title}
        loading="lazy"
      />
    </figure>
  );
};

const ImageCardVertical = ({
  src,
  title,
  companionSrc,
  bottomSrc,
}: {
  src: string;
  title: string;
  companionSrc: string;
  bottomSrc: string;
}) => {
  return (
    <figure
      className={cn(
        "relative  min-w-[420px] max-w-[760px] cursor-pointer overflow-hidden rounded-2xl",
      )}
    >
      <div className="flex h-[30vw] min-h-[320px] max-h-[520px] w-full flex-row gap-2 rounded-lg object-cover">
        <img
          className="h-full w-1/2 rounded-lg object-cover"
          src={src}
          alt={title}
          loading="lazy"
        />
        <img
          className="h-full w-1/2 rounded-lg object-cover"
          src={companionSrc}
          alt={title}
          loading="lazy"
        />
      </div>
      <div className="mt-3 h-[150px] min-h-[320px] max-h-[520px] w-full rounded-xl object-cover">
        <img
          className="h-full w-full rounded-xl object-cover"
          src={bottomSrc}
          alt={title}
          loading="lazy"
        />
      </div>
    </figure>
  );
};

export function MarqueeDemoVertical() {
  return (
    <div className="relative flex  w-full flex-row items-center justify-center gap-2 overflow-hidden h-screen rounded-3xl">
      <Marquee vertical className="[--duration:185s]">
        {imageRow1.map((image) => (
          <ImageCard key={image.id} {...image} />
        ))}
      </Marquee>
      <Marquee reverse vertical className="[--duration:185s]">
        {imageRow2.map((image, index) => {
          const companionImage = imageRow3[index % imageRow3.length] ?? image;
          const bottomImage =
            imageRow3[(index + 1) % imageRow3.length] ?? companionImage;

          return (
            <ImageCardVertical
              key={image.id}
              {...image}
              companionSrc={companionImage.src}
              bottomSrc={bottomImage.src}
            />
          );
        })}
      </Marquee>

      <Marquee vertical className="[--duration:185s]">
        {imageRow4.map((image) => (
          <ImageCard key={image.id} {...image} />
        ))}
      </Marquee>
      <Marquee reverse vertical className="[--duration:185s]">
        {imageRow5.map((image) => (
          <ImageCard key={image.id} {...image} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl shadow-[inset_0_120px_120px_rgba(0,0,0,0.99),inset_0_-100px_120px_rgba(0,0,0,0.99)]" />
    </div>
  );
}
