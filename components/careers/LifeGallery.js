"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { WEBSITE_IMAGES } from "@/lib/websiteImages";

const galleryImages = [
  {
    src: WEBSITE_IMAGES.life.galleryTeamGifts,
    alt: "GharPadharo team celebrating together with gifts",
    position: "object-[center_35%]",
  },
  {
    src: WEBSITE_IMAGES.life.galleryHavan,
    alt: "GharPadharo team cultural havan ceremony celebration",
    position: "object-[center_40%]",
  },
  {
    src: WEBSITE_IMAGES.life.galleryCoworking,
    alt: "Colleagues working together in modern coworking space",
    position: "object-[center_60%]",
  },
  {
    src: WEBSITE_IMAGES.life.galleryTeamGathering,
    alt: "GharPadharo team gathered together in the conference room",
    position: "object-[center_35%]",
  },
  {
    src: WEBSITE_IMAGES.life.galleryTeamWorking,
    alt: "GharPadharo team members collaborating at work along the mission wall",
    position: "object-[center_55%]",
  },
];

export default function LifeGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [translateX, setTranslateX] = useState(0);

  const containerRef = useRef(null);
  const slideRefs = useRef([]);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  }, []);

  const goToSlide = (idx) => {
    setCurrentIndex(idx);
  };

  // Center active slide within carousel bounds (100% on mobile, centered 70% on tablet/desktop)
  const updateOffset = useCallback(() => {
    if (!containerRef.current || !slideRefs.current[currentIndex]) return;
    const container = containerRef.current;
    const activeSlide = slideRefs.current[currentIndex];
    const offset =
      activeSlide.offsetLeft - (container.offsetWidth - activeSlide.offsetWidth) / 2;
    setTranslateX(-offset);
  }, [currentIndex]);

  useEffect(() => {
    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, [updateOffset]);

  // Autoplay (4.5s) with pause on hover / focus and reduced-motion support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) return;
    }

    if (isHovered || isFocused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(timer);
  }, [isHovered, isFocused, handleNext]);

  // Touch/swipe navigation
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <section
      id="our-life"
      aria-roledescription="carousel"
      aria-label="Life at GharPadharo gallery"
      className="scroll-mt-24 w-full py-12 sm:py-14 lg:py-16 bg-white border-b border-slate-200/60 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsFocused(false);
        }
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="container-custom max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-5 sm:mb-6 text-center sm:text-left">
          <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-1.5 sm:mb-2">
            OUR LIFE
          </span>
          <h2 className="text-2xl sm:text-[30px] lg:text-[32px] font-extrabold text-heading tracking-tight leading-snug">
            A glimpse of the people and moments behind the work.
          </h2>
          <p className="text-sm sm:text-base text-body mt-1.5 sm:mt-2 leading-relaxed font-normal max-w-2xl">
            See some of the moments, spaces, and people that make life at GharPadharo what it is.
          </p>
        </div>

        {/* Carousel Visual Frame */}
        <div className="relative w-full max-w-[940px] mx-auto">
          {/* Track Container */}
          <div
            ref={containerRef}
            className="w-full overflow-hidden py-1"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex items-center gap-3 sm:gap-4 lg:gap-5 transition-transform duration-500 ease-out will-change-transform"
              style={{
                transform: `translateX(${translateX}px)`,
              }}
            >
              {galleryImages.map((item, idx) => {
                const isActive = currentIndex === idx;
                return (
                  <div
                    key={idx}
                    ref={(el) => (slideRefs.current[idx] = el)}
                    className={`shrink-0 w-full sm:w-[70%] transition-all duration-500 ease-out ${
                      isActive
                        ? "opacity-100 scale-100"
                        : "opacity-40 hover:opacity-60 scale-[0.97] cursor-pointer"
                    }`}
                    onClick={() => {
                      if (!isActive) goToSlide(idx);
                    }}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${idx + 1} of ${galleryImages.length}`}
                    aria-hidden={!isActive}
                  >
                    <div className="relative aspect-[16/9] sm:aspect-[16/8.5] w-full rounded-[18px] sm:rounded-[20px] overflow-hidden border border-slate-200/70 bg-slate-100 shadow-sm">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 680px"
                        className={`object-cover ${item.position || "object-center"}`}
                        priority={idx === 0}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls: Overlapping featured image edges on desktop, comfortably inset on mobile */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous image"
            className="group absolute left-2.5 sm:left-[calc(15%+5px)] top-1/2 -translate-y-1/2 sm:-translate-x-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 border border-slate-200 shadow-md hover:bg-primary hover:border-primary hover:scale-[1.04] active:scale-[0.96] transition-all duration-200 flex items-center justify-center focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 cursor-pointer backdrop-blur-xs"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 -ml-0.5 text-slate-700 group-hover:text-white transition-colors duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            className="group absolute right-2.5 sm:right-[calc(15%+5px)] top-1/2 -translate-y-1/2 sm:translate-x-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 border border-slate-200 shadow-md hover:bg-primary hover:border-primary hover:scale-[1.04] active:scale-[0.96] transition-all duration-200 flex items-center justify-center focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 cursor-pointer backdrop-blur-xs"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 -mr-0.5 text-slate-700 group-hover:text-white transition-colors duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Pagination Dots */}
        <div
          className="flex items-center justify-center gap-2 mt-4 sm:mt-[18px]"
          role="tablist"
          aria-label="Gallery pagination"
        >
          {galleryImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={currentIndex === idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-300 ease-out rounded-full cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 ${
                currentIndex === idx
                  ? "w-[22px] sm:w-[24px] h-[6px] bg-primary shadow-2xs"
                  : "w-[7px] h-[7px] sm:w-[8px] sm:h-[8px] bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
