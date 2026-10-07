"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { WEBSITE_IMAGES } from "@/lib/websiteImages";

export default function OurPeopleSection() {
  const testimonials = [
    {
      name: "Dipanshu Sandhaki",
      designation: "Full Stack Engineer",
      department: "Engineering",
      image: WEBSITE_IMAGES.people.dipanshuSandhaki,
      imagePosition: "object-[center_25%]",
      quote:
        "Working at GharPadharo has given me the opportunity to build real products, take ownership of meaningful technical challenges, and learn alongside a supportive team. I enjoy seeing the work we build turn into experiences that genuinely help people.",
      rating: 5,
      badgeBg: "bg-purple-50",
      badgeText: "text-primary",
      badgeBorder: "border-purple-200/80",
      dotColor: "bg-primary",
      quoteColor: "text-purple-100",
    },
    {
      name: "Anshika Bisht",
      designation: "HR & Business Growth",
      department: "Growth & Marketing",
      image: WEBSITE_IMAGES.people.anshikaBisht,
      imagePosition: "object-[center_20%]",
      quote:
        "What I enjoy most about GharPadharo is the opportunity to work closely with people while contributing to the growth of the business. Every day brings something new to learn, and the collaborative environment makes it exciting to take ownership and build things together.",
      rating: 5,
      badgeBg: "bg-amber-50",
      badgeText: "text-amber-800",
      badgeBorder: "border-amber-200/80",
      dotColor: "bg-amber-500",
      quoteColor: "text-amber-100",
    },
    {
      name: "Rica Rai",
      designation: "Digital Marketing & Business Development",
      department: "Growth & Marketing",
      image: WEBSITE_IMAGES.people.ricaRai,
      imagePosition: "object-[center_25%]",
      quote:
        "GharPadharo gives me the freedom to experiment, learn from real challenges, and turn ideas into meaningful growth. Working across digital marketing and business development has helped me understand the business better while collaborating with a team that is always open to new ideas.",
      rating: 4.5,
      badgeBg: "bg-amber-50",
      badgeText: "text-amber-800",
      badgeBorder: "border-amber-200/80",
      dotColor: "bg-amber-500",
      quoteColor: "text-amber-100",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      const matches = window.innerWidth >= 640;
      setIsDesktop(matches);
      if (matches && currentIndex > 1) {
        setCurrentIndex(1);
      }
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, [currentIndex]);

  const maxIndex = isDesktop ? 1 : 2;
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < maxIndex;

  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const handleDot = (idx) => setCurrentIndex(Math.min(idx, maxIndex));

  return (
    <section id="our-people" className="w-full py-16 sm:py-20 lg:py-24 bg-[#F8FAFC] border-b border-slate-200/60 overflow-hidden">
      <div className="container-custom max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Narrative (4 cols) */}
          <div className="lg:col-span-4 space-y-3 sm:space-y-3.5 text-center lg:text-left">
            <span className="text-xs sm:text-[13px] font-bold text-primary tracking-widest uppercase block mb-2">
              OUR PEOPLE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-heading tracking-tight leading-[1.18]">
              What our team
              <br className="hidden sm:inline" />
              {" "}says.
            </h2>
            <p className="text-base sm:text-lg text-body font-normal leading-relaxed max-w-sm mx-auto lg:mx-0 pt-1">
              Real experiences from people building at GharPadharo.
            </p>
          </div>

          {/* Right Column: 2-Card Testimonial Carousel (8 cols) */}
          <div className="lg:col-span-8 w-full min-w-0">
            {/* Carousel Viewport */}
            <div className="overflow-hidden w-full">
              <div
                className="flex gap-4 sm:gap-6 transition-transform duration-500 ease-out items-stretch"
                style={{
                  transform: isDesktop
                    ? `translateX(calc(-${currentIndex} * (50% + 12px)))`
                    : `translateX(calc(-${currentIndex} * (100% + 16px)))`,
                }}
              >
                {testimonials.map((t, idx) => (
                  <div
                    key={idx}
                    className="w-full sm:w-[calc((100%-24px)/2)] shrink-0 relative bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-7 sm:p-8 xl:p-9 shadow-2xs flex flex-col justify-between overflow-hidden min-h-[320px] sm:min-h-[340px] lg:min-h-[355px]"
                  >
                    {/* Faint Quotation Mark Decoration in Upper-Right */}
                    <div
                      className="absolute top-7 right-7 sm:top-8 sm:right-8 select-none pointer-events-none"
                      aria-hidden="true"
                    >
                      <svg
                        className={`w-10 h-10 sm:w-12 sm:h-12 ${t.quoteColor} opacity-75`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>

                    <div className="flex-1">
                      {/* Employee Identity Header */}
                      <div className="flex items-start gap-4 sm:gap-4.5 pr-12">
                        {/* Circular Avatar */}
                        <div className="relative w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-full overflow-hidden shrink-0 border-[3px] border-white shadow-xs bg-slate-100">
                          <Image
                            src={t.image}
                            alt={t.name}
                            fill
                            className={`object-cover ${t.imagePosition || "object-center"}`}
                            sizes="(max-width: 640px) 64px, 70px"
                          />
                        </div>

                        {/* Name, Designation & Department Badge */}
                        <div className="flex flex-col items-start min-w-0">
                          <h3 className="text-lg sm:text-[20px] font-bold text-heading tracking-tight leading-tight">
                            {t.name}
                          </h3>
                          <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-1 leading-tight">
                            {t.designation}
                          </p>
                          <span
                            className={`mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${t.badgeBg} ${t.badgeText} ${t.badgeBorder}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${t.dotColor}`} aria-hidden="true" />
                            <span>{t.department}</span>
                          </span>
                        </div>
                      </div>

                      {/* Testimonial Quote */}
                      <p className="mt-6 sm:mt-7 text-[15px] sm:text-base text-slate-700 font-normal leading-relaxed">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>

                    {/* Visual Star Rating (Anchored at the bottom of the card) */}
                    <div
                      className="mt-auto pt-5 sm:pt-6 flex items-center gap-1 sm:gap-1.5"
                      role="img"
                      aria-label={`${t.rating} out of 5 stars`}
                    >
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFull = star <= Math.floor(t.rating);
                        const isHalf = !isFull && star - 0.5 === t.rating;
                        const halfGradId = `halfStarGrad-${idx}-${star}`;

                        if (isFull) {
                          return (
                            <svg
                              key={star}
                              className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#FFB400] fill-current shrink-0"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          );
                        }

                        if (isHalf) {
                          return (
                            <svg
                              key={star}
                              className="w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <defs>
                                <linearGradient id={halfGradId} x1="0" y1="0" x2="100%" y2="0">
                                  <stop offset="50%" stopColor="#FFB400" />
                                  <stop offset="50%" stopColor="#E2E8F0" />
                                </linearGradient>
                              </defs>
                              <path
                                fill={`url(#${halfGradId})`}
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                              />
                            </svg>
                          );
                        }

                        return (
                          <svg
                            key={star}
                            className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-300 fill-slate-200/60 shrink-0"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Controls Row: Pagination Dots + Carousel Arrows */}
            <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 pt-3.5 sm:pt-4.5">
              {/* 3 Pagination Indicator Dots */}
              <div
                className="flex items-center gap-2"
                role="tablist"
                aria-label="Testimonial pagination"
              >
                {[0, 1, 2].map((idx) => {
                  const isActive = isDesktop
                    ? (currentIndex === 0 && idx === 0) || (currentIndex === 1 && idx === 1)
                    : currentIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleDot(idx)}
                      aria-label={`Go to testimonial ${idx + 1}`}
                      aria-selected={isActive}
                      role="tab"
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        isActive
                          ? "w-2.5 bg-primary"
                          : "w-2.5 bg-purple-200/50 hover:bg-purple-200"
                      }`}
                    />
                  );
                })}
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={!canPrev}
                  aria-label="Previous testimonial"
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    canPrev
                      ? "bg-white border-slate-200 text-primary hover:border-slate-300 hover:bg-slate-50 shadow-2xs active:scale-95 cursor-pointer"
                      : "bg-white/60 border-slate-100 text-slate-300 cursor-not-allowed opacity-40 pointer-events-none"
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
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    canNext
                      ? "bg-[#ECEEFA] text-primary hover:bg-[#DFE2F7] shadow-2xs active:scale-95 cursor-pointer"
                      : "bg-purple-50 text-purple-300 cursor-not-allowed opacity-40 pointer-events-none"
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
        </div>
      </div>
    </section>
  );
}
