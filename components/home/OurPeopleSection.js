"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { WEBSITE_IMAGES } from "@/lib/websiteImages";
import SectionBadge from "@/components/common/SectionBadge";
import ScrollReveal from "@/components/common/ScrollReveal";

export default function OurPeopleSection() {
  const testimonials = [
    {
      name: "Anshika Bisht",
      designation: "HR & Business Growth",
      department: "Growth & Marketing",
      image: WEBSITE_IMAGES.people.anshikaBisht,
      imagePosition: "object-[center_20%]",
      quote:
        "What I enjoy most about GharPadharo is the opportunity to work closely with people while contributing to the growth of the business. Every day brings something new to learn, and the collaborative environment makes it exciting to take ownership and build things together.",
    },
    {
      name: "Dipanshu Sandhaki",
      designation: "Full Stack Engineer",
      department: "Engineering",
      image: WEBSITE_IMAGES.people.dipanshuSandhaki,
      imagePosition: "object-[center_25%]",
      quote:
        "Working at GharPadharo has given me the opportunity to build real products, take ownership of meaningful technical challenges, and learn alongside a supportive team. I enjoy seeing the work we build turn into experiences that genuinely help people.",
    },
    {
      name: "Rica Rai",
      designation: "Digital Marketing & Business Development",
      department: "Growth & Marketing",
      image: WEBSITE_IMAGES.people.ricaRai,
      imagePosition: "object-[center_25%]",
      quote:
        "GharPadharo gives me the freedom to experiment, learn from real challenges, and turn ideas into meaningful growth. Working across digital marketing and business development has helped me understand the business better while collaborating with a team that is always open to new ideas.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeDot, setActiveDot] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop && currentIndex > 1) {
        setCurrentIndex(1);
        setActiveDot(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex]);

  const maxIndex = isDesktop ? 1 : 2;
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < maxIndex;

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const nextIdx = Math.max(prev - 1, 0);
      setActiveDot(nextIdx);
      return nextIdx;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const nextIdx = Math.min(prev + 1, maxIndex);
      setActiveDot(isDesktop ? 1 : nextIdx);
      return nextIdx;
    });
  };

  const handleDot = (idx) => {
    setActiveDot(idx);
    if (isDesktop) {
      setCurrentIndex(idx === 0 ? 0 : 1);
    } else {
      setCurrentIndex(idx);
    }
  };

  return (
    <section
      id="our-people"
      className="w-full py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#FAF8FF] via-[#F6F2FF] to-[#FAF8FF] border-b border-slate-200/60 relative overflow-hidden"
    >
      {/* Component-scoped styles for card hover and reduced motion */}
      <style>{`
        .testimonial-card {
          transition:
            border-color 280ms cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1),
            transform 280ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .testimonial-card:hover {
          border-color: #D8CCFD;
          box-shadow: 0 12px 28px -4px rgba(89, 41, 214, 0.08);
          transform: translateY(-2px);
        }

        @media (prefers-reduced-motion: reduce) {
          .testimonial-card {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Soft background organic lavender shapes */}
      <div
        className="absolute -top-32 -right-32 w-[520px] h-[520px] bg-purple-100/35 rounded-full blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-32 w-[480px] h-[480px] bg-purple-100/30 rounded-full blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-8 lg:gap-12 xl:gap-16 w-full">
          {/* ============================================================
              1. LEFT COLUMN (~30% width on Desktop, vertically centered with cards)
             ============================================================ */}
          <div className="w-full md:w-[35%] lg:w-[30%] shrink-0 text-left">
            <ScrollReveal variant="fade-up">
              <SectionBadge className="mb-9 sm:mb-10 lg:mb-11">
                OUR PEOPLE
              </SectionBadge>

              <h2 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-extrabold text-[#11152F] tracking-tight leading-[1.12]">
                What our <span className="text-[#5929D6]">team</span>
                <br />
                says.
              </h2>

              <p className="text-sm sm:text-base lg:text-[16.5px] text-[#64748B] font-normal leading-relaxed mt-5 sm:mt-6 max-w-[320px] sm:max-w-[360px]">
                Real experiences from people building at GharPadharo.
              </p>
            </ScrollReveal>
          </div>

          {/* ============================================================
              2. RIGHT COLUMN: TESTIMONIAL CAROUSEL (~70% width on Desktop)
             ============================================================ */}
          <div className="w-full md:w-[61%] lg:w-[68%] grow min-w-0">
            <ScrollReveal variant="fade-up" delay={120}>
              {/* Carousel Viewport */}
              <div className="overflow-hidden w-full">
              <div
                className="flex gap-6 transition-transform duration-500 ease-out items-stretch"
                style={{
                  transform: isDesktop
                    ? `translateX(calc(-${currentIndex} * (50% + 12px)))`
                    : `translateX(calc(-${currentIndex} * (100% + 24px)))`,
                }}
              >
                {testimonials.map((t, idx) => (
                  <article
                    key={idx}
                    className="testimonial-card w-full lg:w-[calc((100%-24px)/2)] shrink-0 relative bg-white rounded-[24px] border border-[#E8E2FA] p-7 sm:p-8 xl:p-9 shadow-[0_4px_24px_rgba(89,41,214,0.04)] flex flex-col justify-between overflow-hidden min-h-[360px] sm:min-h-[380px] lg:min-h-[400px]"
                  >
                    {/* Soft organic lavender shape in bottom-right corner */}
                    <div
                      className="absolute -bottom-10 -right-10 w-36 h-36 bg-gradient-to-tl from-[#F2ECFF]/90 via-[#F7F3FF]/50 to-transparent rounded-full pointer-events-none z-0"
                      aria-hidden="true"
                    />

                    {/* Pale-lavender Quotation Mark Decoration in Upper-Right */}
                    <div
                      className="absolute top-7 right-7 sm:top-8 sm:right-8 select-none pointer-events-none z-0"
                      aria-hidden="true"
                    >
                      <svg
                        className="w-10 h-10 sm:w-11 sm:h-11 text-[#EDE7FE]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>

                    <div className="relative z-10 flex-1">
                      {/* Employee Identity Header */}
                      <div className="flex items-center gap-3.5 sm:gap-4 pr-10">
                        {/* Circular Avatar */}
                        <div className="relative w-14 h-14 sm:w-[58px] sm:h-[58px] aspect-square rounded-full overflow-hidden shrink-0 bg-slate-100">
                          <Image
                            src={t.image}
                            alt={t.name}
                            fill
                            className={`object-cover ${t.imagePosition || "object-center"}`}
                            sizes="64px"
                          />
                        </div>

                        {/* Name, Designation & Department Badge */}
                        <div className="flex flex-col items-start min-w-0">
                          <h3 className="text-[17px] sm:text-[18px] xl:text-[19px] font-bold text-[#11152F] tracking-tight leading-snug truncate w-full">
                            {t.name}
                          </h3>
                          <p className="text-xs sm:text-[13px] text-[#64748B] font-medium mt-0.5 leading-normal truncate w-full">
                            {t.designation}
                          </p>
                          <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-[11.5px] font-medium bg-[#F0EBFF] text-[#5929D6]">
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-[#5929D6]"
                              aria-hidden="true"
                            />
                            <span>{t.department}</span>
                          </span>
                        </div>
                      </div>

                      {/* Testimonial Quote */}
                      <p className="mt-6 text-[13.5px] sm:text-[14px] xl:text-[14.5px] text-[#475569] font-normal leading-[1.65]">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>

                    {/* Visual 5-Star Rating (Bottom of Card) */}
                    <div
                      className="mt-auto pt-6 flex items-center gap-1.5 relative z-10"
                      role="img"
                      aria-label="5 out of 5 stars"
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-4 h-4 sm:w-[17px] sm:h-[17px] text-[#F5A623] fill-[#F5A623] shrink-0"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
        </div>

        {/* ============================================================
            3. CAROUSEL CONTROLS: 3 Pagination Dots + Circular Arrows (Aligned Right)
           ============================================================ */}
        <div className="flex items-center justify-end gap-5 sm:gap-6 mt-6 sm:mt-8">
          {/* 3 Pagination Indicator Dots */}
          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label="Testimonial pagination"
          >
            {[0, 1, 2].map((idx) => {
              const isActive = isDesktop
                ? (currentIndex === 0 ? idx === 0 : (activeDot === 2 ? idx === 2 : idx === 1))
                : currentIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDot(idx)}
                  aria-label={`Go to testimonial slide ${idx + 1}`}
                  aria-selected={isActive}
                  role="tab"
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] ${
                    isActive
                      ? "bg-[#5929D6]"
                      : "bg-[#E4DCFF] hover:bg-[#D5C7FE] cursor-pointer"
                  }`}
                />
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2.5">
            {/* Previous Button */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={!canPrev}
              aria-label="Previous testimonial"
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-2 ${
                canPrev
                  ? "bg-[#EDE7FE] text-[#5929D6] hover:bg-[#E2D8FD] cursor-pointer active:scale-95 shadow-2xs"
                  : "bg-[#F8F6FD] text-[#A792E5]/50 border border-[#EDE7FA] cursor-not-allowed pointer-events-none"
              }`}
            >
              <svg
                className="w-4 h-4 sm:w-4.5 sm:h-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={!canNext}
              aria-label="Next testimonial"
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-2 ${
                canNext
                  ? "bg-[#EDE7FE] text-[#5929D6] hover:bg-[#E2D8FD] cursor-pointer active:scale-95 shadow-2xs"
                  : "bg-[#F8F6FD] text-[#A792E5]/50 border border-[#EDE7FA] cursor-not-allowed pointer-events-none"
              }`}
            >
              <svg
                className="w-4 h-4 sm:w-4.5 sm:h-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
