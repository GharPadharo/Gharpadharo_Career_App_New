"use client";

import { useState, useRef, useCallback } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import SectionBadge from "@/components/common/SectionBadge";

const STORY_VIDEOS = [
  {
    id: "3xj12H2vu5I",
    title: "Welcome to GharPadharo – Finding PGs, Hostels & Rental Rooms",
    embedUrl: "https://www.youtube-nocookie.com/embed/3xj12H2vu5I?rel=0&modestbranding=1",
    url: "https://www.youtube.com/shorts/3xj12H2vu5I",
  },
  {
    id: "oWhdA1ynASw",
    title: "DAY 1: The Gharpadharo Story Begins",
    embedUrl: "https://www.youtube-nocookie.com/embed/oWhdA1ynASw?rel=0&modestbranding=1",
    url: "https://www.youtube.com/shorts/oWhdA1ynASw",
  },
  {
    id: "wYGmlOWf7Vk",
    title: "We are officially open! Our first office",
    embedUrl: "https://www.youtube-nocookie.com/embed/wYGmlOWf7Vk?rel=0&modestbranding=1",
    url: "https://www.youtube.com/shorts/wYGmlOWf7Vk",
  },
];

export default function OurStoriesSection({ className = "" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const el = scrollContainerRef.current;
    const card = el.firstElementChild;
    if (!card) return;
    const cardWidth = card.offsetWidth;
    const gap = 16; // gap-4 is 16px
    const scrollPos = el.scrollLeft;
    const index = Math.round(scrollPos / (cardWidth + gap));
    const safeIndex = Math.min(Math.max(index, 0), STORY_VIDEOS.length - 1);
    setCurrentIndex(safeIndex);
  }, []);

  const scrollToSlide = useCallback((idx) => {
    if (!scrollContainerRef.current) return;
    const el = scrollContainerRef.current;
    const card = el.firstElementChild;
    if (!card) return;
    const cardWidth = card.offsetWidth;
    const gap = 16;
    el.scrollTo({
      left: idx * (cardWidth + gap),
      behavior: "smooth",
    });
    setCurrentIndex(idx);
  }, []);

  const handlePrev = useCallback(() => {
    const nextIdx = Math.max(currentIndex - 1, 0);
    scrollToSlide(nextIdx);
  }, [currentIndex, scrollToSlide]);

  const handleNext = useCallback(() => {
    const nextIdx = Math.min(currentIndex + 1, STORY_VIDEOS.length - 1);
    scrollToSlide(nextIdx);
  }, [currentIndex, scrollToSlide]);

  return (
    <section
      id="our-stories"
      className={`scroll-mt-24 w-full py-14 sm:py-18 lg:py-22 bg-gradient-to-b from-[#FAF8FF] via-[#F6F2FF] to-[#FAF8FF] border-b border-[#E8E2FA]/60 overflow-hidden ${className}`}
      aria-label="Our Stories"
    >
      {/* Component-scoped styles for CTA sweep effect, no-scrollbar, and reduced motion */}
      <style>{`
        .hero-cta-sweep {
          position: relative;
          overflow: hidden;
          background-color: #5929D6;
        }
        .hero-cta-sweep::before {
          content: '';
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background-color: #4D20BE;
          transform: translateX(-100%);
          transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
          pointer-events-none;
        }
        .hero-cta-sweep:hover::before {
          transform: translateX(0);
        }
        .hero-cta-sweep:active::before {
          background-color: #3F189F;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-cta-sweep::before,
          .hero-cta-sweep span {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-10 xl:gap-14">
          {/* ========================================================
              LEFT COLUMN: Introduction & Action
          ======================================================== */}
          <div className="w-full lg:w-[28%] xl:w-[26%] shrink-0 text-left space-y-4 sm:space-y-5">
            {/* Eyebrow badge matching the rest of the page */}
            <SectionBadge className="mb-1">
              OUR STORIES
            </SectionBadge>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-extrabold tracking-tight leading-[1.12]">
              <span className="text-[#11152F] block">Inside</span>
              <span className="text-[#5929D6] block">GharPadharo.</span>
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed font-normal max-w-sm">
              Get a glimpse of our team, culture, events, and the work we do — straight from the people who make it happen.
            </p>

            {/* Watch more button */}
            <div className="pt-1">
              <a
                href="https://www.youtube.com/@gharpadharo"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-cta-sweep group inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-white font-semibold text-sm shadow-md shadow-[#5929D6]/20 hover:shadow-lg hover:shadow-[#4D20BE]/35 active:scale-[0.98] active:shadow-sm transition-all duration-300 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-2 focus-visible:ring-offset-white select-none"
                aria-label="Watch more on GharPadharo YouTube channel"
              >
                <span className="relative z-1 w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Play className="w-3 h-3 fill-current ml-0.5 text-white" aria-hidden="true" />
                </span>
                <span className="relative z-1 text-white">Watch more</span>
                <span
                  aria-hidden="true"
                  className="relative z-1 text-white transition-transform duration-300 ease-out group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </a>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Video Cards (Horizontal Carousel on Mobile, Grid on Tablet/Desktop)
          ======================================================== */}
          <div className="w-full lg:w-[72%] xl:w-[74%] grow min-w-0">
            {/* Scrollable Track on Mobile, 3-column Grid on Tablet/Desktop */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-4.5 xl:gap-5 overflow-x-auto sm:overflow-visible snap-x snap-mandatory no-scrollbar -mr-4 pr-4 sm:mr-0 sm:pr-0 py-1"
            >
              {STORY_VIDEOS.map((video) => (
                <div
                  key={video.id}
                  className="snap-start shrink-0 w-[80%] max-w-[290px] sm:w-auto sm:max-w-none relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 border border-[#E8E2FA] shadow-[0_4px_20px_rgba(89,41,214,0.06)] hover:border-[#C4B5FD] hover:shadow-[0_12px_32px_rgba(89,41,214,0.14)] hover:-translate-y-1 transition-all duration-300 ease-out [isolation:isolate] transform-gpu"
                >
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="w-full h-full border-0 absolute inset-0"
                  />
                </div>
              ))}
            </div>

            {/* Mobile Carousel Controls (Indicator Dots + Arrow Buttons) */}
            <div className="flex sm:hidden items-center justify-between mt-4 px-1">
              {/* Pagination Dots */}
              <div
                className="flex items-center gap-2"
                role="tablist"
                aria-label="Story videos pagination"
              >
                {STORY_VIDEOS.map((video, idx) => {
                  const isActive = currentIndex === idx;
                  return (
                    <button
                      key={video.id}
                      type="button"
                      onClick={() => scrollToSlide(idx)}
                      aria-label={`Go to video ${idx + 1}`}
                      aria-selected={isActive}
                      role="tab"
                      className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] ${
                        isActive
                          ? "w-6 bg-[#5929D6]"
                          : "w-2 bg-[#E4DCFF] hover:bg-[#D5C7FE] cursor-pointer"
                      }`}
                    />
                  );
                })}
              </div>

              {/* Prev / Next Circular Arrow Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  aria-label="Previous video"
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] ${
                    currentIndex > 0
                      ? "bg-[#EDE7FE] text-[#5929D6] hover:bg-[#E2D8FD] cursor-pointer active:scale-95 shadow-2xs"
                      : "bg-[#F8F6FD] text-[#A792E5]/50 border border-[#EDE7FA] cursor-not-allowed pointer-events-none"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentIndex === STORY_VIDEOS.length - 1}
                  aria-label="Next video"
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] ${
                    currentIndex < STORY_VIDEOS.length - 1
                      ? "bg-[#EDE7FE] text-[#5929D6] hover:bg-[#E2D8FD] cursor-pointer active:scale-95 shadow-2xs"
                      : "bg-[#F8F6FD] text-[#A792E5]/50 border border-[#EDE7FA] cursor-not-allowed pointer-events-none"
                  }`}
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
