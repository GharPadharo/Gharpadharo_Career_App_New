"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    src: WEBSITE_IMAGES.life.teamWorkingAtDesks,
    alt: "GharPadharo team members working on laptops at their office desks",
    position: "object-[center_35%]",
  },
  {
    src: WEBSITE_IMAGES.life.galleryTeamWorking,
    alt: "GharPadharo team members collaborating at work along the mission wall",
    position: "object-[center_55%]",
  },
];

// Cloned extended array for smooth infinite looping: [3, 4,  0, 1, 2, 3, 4,  0, 1]
const EXTENDED_IMAGES = [
  ...galleryImages.slice(-2).map((item, i) => ({ ...item, realIndex: galleryImages.length - 2 + i })),
  ...galleryImages.map((item, i) => ({ ...item, realIndex: i })),
  ...galleryImages.slice(0, 2).map((item, i) => ({ ...item, realIndex: i })),
];
const CLONE_OFFSET = 2; // Real item 0 starts at index 2

export default function LifeGallery() {
  const [currentIndex, setCurrentIndex] = useState(CLONE_OFFSET);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [translateX, setTranslateX] = useState(0);

  const containerRef = useRef(null);
  const slideRefs = useRef([]);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handlePrev = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const goToSlide = (idx) => {
    setIsTransitioning(true);
    setCurrentIndex(CLONE_OFFSET + idx);
  };

  // Center active slide within carousel bounds
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

  // Seamless boundary wrap when transition completes
  const handleTransitionEnd = (e) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;

    if (currentIndex < CLONE_OFFSET) {
      setIsTransitioning(false);
      setCurrentIndex((prev) => prev + galleryImages.length);
    } else if (currentIndex >= CLONE_OFFSET + galleryImages.length) {
      setIsTransitioning(false);
      setCurrentIndex((prev) => prev - galleryImages.length);
    }
  };

  // Re-enable CSS transitions on next animation frame after silent teleport jump
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

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

  const activeRealIndex = EXTENDED_IMAGES[currentIndex]?.realIndex ?? 0;

  return (
    <section
      id="our-life"
      aria-roledescription="carousel"
      aria-label="Life at GharPadharo gallery"
      className="scroll-mt-24 w-full py-14 sm:py-18 lg:py-22 bg-gradient-to-b from-[#FAF8FF] via-[#F6F2FF] to-[#FAF8FF] border-b border-[#E8E2FA]/60 overflow-hidden"
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Perfectly Centered on All Breakpoints */}
        <div className="max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-10 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#11152F] tracking-tight leading-snug">
            A <span className="text-[#5929D6]">glimpse</span> of the people and moments behind the work.
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] mt-2 sm:mt-2.5 leading-relaxed font-normal max-w-2xl mx-auto">
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
              className={`flex items-center gap-3 sm:gap-4 lg:gap-5 ${
                isTransitioning ? "transition-transform duration-500 ease-out" : ""
              } will-change-transform`}
              style={{
                transform: `translateX(${translateX}px)`,
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {EXTENDED_IMAGES.map((item, trackIdx) => {
                const isActive = currentIndex === trackIdx;
                return (
                  <div
                    key={trackIdx}
                    ref={(el) => {
                      if (el) slideRefs.current[trackIdx] = el;
                    }}
                    className={`shrink-0 w-[82%] sm:w-[70%] ${
                      isTransitioning ? "transition-all duration-500 ease-out" : ""
                    } ${
                      isActive
                        ? "opacity-100 scale-100"
                        : "opacity-40 hover:opacity-60 scale-[0.97] cursor-pointer"
                    }`}
                    onClick={() => {
                      if (trackIdx !== currentIndex) {
                        if (trackIdx === currentIndex - 1) {
                          handlePrev();
                        } else if (trackIdx === currentIndex + 1) {
                          handleNext();
                        } else {
                          goToSlide(item.realIndex);
                        }
                      }
                    }}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${item.realIndex + 1} of ${galleryImages.length}`}
                    aria-hidden={!isActive}
                  >
                    <div className="relative aspect-[16/9] sm:aspect-[16/8.5] w-full rounded-2xl overflow-hidden border border-[#E8E2FA] bg-slate-100 shadow-[0_4px_16px_rgba(89,41,214,0.04)]">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 680px"
                        className={`object-cover ${item.position || "object-center"}`}
                        priority={item.realIndex === 0}
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
            className="group absolute left-1 sm:left-[calc(15%+6px)] top-1/2 -translate-y-1/2 sm:-translate-x-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 border border-[#E8E2FA] shadow-md hover:bg-[#5929D6] hover:border-[#5929D6] hover:scale-[1.04] active:scale-[0.96] transition-all duration-200 flex items-center justify-center focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#5929D6]/30 focus-visible:ring-offset-2 cursor-pointer backdrop-blur-xs"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors duration-200" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            className="group absolute right-1 sm:right-[calc(15%+6px)] top-1/2 -translate-y-1/2 sm:translate-x-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 border border-[#E8E2FA] shadow-md hover:bg-[#5929D6] hover:border-[#5929D6] hover:scale-[1.04] active:scale-[0.96] transition-all duration-200 flex items-center justify-center focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#5929D6]/30 focus-visible:ring-offset-2 cursor-pointer backdrop-blur-xs"
          >
            <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors duration-200" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div
          className="flex items-center justify-center gap-2 mt-5 sm:mt-6"
          role="tablist"
          aria-label="Gallery pagination"
        >
          {galleryImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={activeRealIndex === idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-300 ease-out rounded-full cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#5929D6]/30 focus-visible:ring-offset-2 ${
                activeRealIndex === idx
                  ? "w-[24px] sm:w-[28px] h-[6px] sm:h-[7px] bg-[#5929D6] shadow-xs"
                  : "w-[7px] h-[7px] sm:w-[8px] sm:h-[8px] bg-[#E8E2FA] hover:bg-[#C4B5FD]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
