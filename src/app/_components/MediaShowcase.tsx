"use client";

import { useEffect, useRef } from "react";

const VIDEO_SRC =
  "https://res.cloudinary.com/didwvcwit/video/upload/q_auto/f_auto/v1776537111/superbuilt_complete_1_tulget.mp4";

export function MediaShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.intersectionRatio >= 0.5) {
          void video.play();
          return;
        }
        video.pause();
      },
      { threshold: [0, 0.5, 1] },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative mx-auto w-full  ">
      <div className="relative mx-auto h-[51.75vw] w-[92vw] min-h-[220px] max-h-[956px] max-w-[1700px] overflow-hidden rounded-2xl bg-black md:rounded-3xl">
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          className="h-full w-full object-cover"
          playsInline
          muted
          loop
          controls
          preload="metadata"
        />
      </div>
    </div>
  );
}
