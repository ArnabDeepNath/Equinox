"use client";

import { useEffect, useRef } from "react";

interface BgVideoProps {
  /** Absolute path to the MP4 loop, e.g. /videos/hero.mp4 */
  mp4: string;
  /** Optional WebM variant served first for browsers that support it */
  webm?: string;
  /** Poster frame shown instantly and used as the full fallback */
  poster: string;
  /** Extra classes for the absolute-positioned wrapper */
  className?: string;
  /** Hero videos preload eagerly; below-fold loops use metadata only */
  eager?: boolean;
  /** Accessible label (decorative by default) */
  ariaLabel?: string;
}

/**
 * Premium background video loop.
 *
 * - The poster image renders underneath immediately, so the layout never
 *   flashes blank — even if the video file is missing or still buffering.
 * - The <video> is always mounted but inert: playback is only triggered by an
 *   IntersectionObserver, and never when the user prefers reduced motion or
 *   has Data Saver enabled (poster remains in those cases).
 * - Pauses automatically when scrolled out of view to save bandwidth.
 */
export function BgVideo({
  mp4,
  webm,
  poster,
  className = "",
  eager = false,
  ariaLabel,
}: BgVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (prefersReducedMotion || connection?.saveData === true) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* autoplay blocked — poster remains visible */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        loading={eager ? "eager" : "lazy"}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsInline
        autoPlay={eager}
        preload={eager ? "auto" : "none"}
        poster={poster}
        onError={(event) => {
          // Missing/corrupt file — hide the element so the poster shows through
          event.currentTarget.style.display = "none";
        }}
      >
        {webm ? <source src={webm} type="video/webm" /> : null}
        <source src={mp4} type="video/mp4" />
      </video>
    </div>
  );
}
