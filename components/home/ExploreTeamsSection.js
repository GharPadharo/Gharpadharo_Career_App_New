"use client";

import { useState } from "react";

export default function ExploreTeamsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });

  const teams = [
    {
      name: "Engineering",
      description: "Build the technology that powers GharPadharo.",
      bg: "bg-[#F4F8FD]",
      border: "border-[#E2EEFB]",
      hoverBorder: "hover:border-blue-300",
      iconBg: "bg-[#E0EDFD]",
      iconBorder: "border border-blue-200/60",
      icon: (
        <svg
          className="w-6.5 h-6.5 sm:w-7 sm:h-7 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7 8l-4 4 4 4" />
          <path d="M17 8l4 4-4 4" />
          <path d="M14 4l-4 16" />
        </svg>
      ),
      backgroundArt: (
        <div className="absolute -bottom-4 -right-4 pointer-events-none select-none w-[124px] h-[124px] opacity-75" aria-hidden="true">
          <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="85" cy="85" r="45" fill="#DBEAFE" fillOpacity="0.4" />
            <rect x="35" y="45" width="80" height="70" rx="14" fill="#FFFFFF" fillOpacity="0.75" stroke="#BFDBFE" strokeWidth="1.5" strokeOpacity="0.6" />
            <circle cx="50" cy="58" r="2.5" fill="#93C5FD" fillOpacity="0.7" />
            <circle cx="58" cy="58" r="2.5" fill="#93C5FD" fillOpacity="0.7" />
            <circle cx="66" cy="58" r="2.5" fill="#93C5FD" fillOpacity="0.7" />
            <rect x="50" y="70" width="46" height="5" rx="2.5" fill="#60A5FA" fillOpacity="0.45" />
            <rect x="50" y="81" width="34" height="5" rx="2.5" fill="#93C5FD" fillOpacity="0.5" />
            <rect x="50" y="92" width="50" height="5" rx="2.5" fill="#BFDBFE" fillOpacity="0.6" />
          </svg>
        </div>
      ),
    },
    {
      name: "Product",
      description: "Turn real problems into simple experiences.",
      bg: "bg-[#F8F6FD]",
      border: "border-[#ECE5FB]",
      hoverBorder: "hover:border-purple-300",
      iconBg: "bg-[#EAE4FC]",
      iconBorder: "border border-purple-200/60",
      icon: (
        <svg
          className="w-6.5 h-6.5 sm:w-7 sm:h-7 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      backgroundArt: (
        <div className="absolute -bottom-4 -right-4 pointer-events-none select-none w-[124px] h-[124px] opacity-75" aria-hidden="true">
          <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="85" cy="85" r="45" fill="#EDE9FE" fillOpacity="0.4" />
            <rect x="50" y="38" width="70" height="55" rx="12" fill="#DDD6FE" fillOpacity="0.35" stroke="#C4B5FD" strokeWidth="1.2" strokeOpacity="0.5" />
            <rect x="30" y="55" width="75" height="55" rx="12" fill="#FFFFFF" fillOpacity="0.75" stroke="#DDD6FE" strokeWidth="1.5" strokeOpacity="0.6" />
            <circle cx="48" cy="72" r="6" fill="#8B5CF6" fillOpacity="0.45" />
            <rect x="60" y="70" width="32" height="4" rx="2" fill="#C4B5FD" fillOpacity="0.6" />
            <rect x="42" y="84" width="50" height="4" rx="2" fill="#DDD6FE" fillOpacity="0.7" />
            <rect x="42" y="93" width="35" height="4" rx="2" fill="#EDE9FE" fillOpacity="0.8" />
          </svg>
        </div>
      ),
    },
    {
      name: "Design",
      description: "Shape how people experience our platforms.",
      bg: "bg-[#FDF4F6]",
      border: "border-[#FCE3E8]",
      hoverBorder: "hover:border-rose-300",
      iconBg: "bg-[#FCE7ED]",
      iconBorder: "border border-rose-200/60",
      icon: (
        <svg
          className="w-6.5 h-6.5 sm:w-7 sm:h-7 text-[#E85D75]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      ),
      backgroundArt: (
        <div className="absolute -bottom-3 -right-3 pointer-events-none select-none w-[124px] h-[124px]" aria-hidden="true">
          <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="82" cy="82" r="48" fill="#FCE7ED" fillOpacity="0.75" />
            <rect
              x="22"
              y="48"
              width="62"
              height="62"
              rx="18"
              fill="#FFE4E6"
              fillOpacity="0.55"
              transform="rotate(-12 53 79)"
            />
            <rect
              x="38"
              y="34"
              width="72"
              height="76"
              rx="16"
              fill="#FFFFFF"
              fillOpacity="0.92"
              stroke="#FECDD3"
              strokeWidth="1.5"
            />
            <g transform="translate(74, 68) rotate(-35)">
              <rect x="-4.5" y="-24" width="9" height="18" rx="3" fill="#FDA4AF" fillOpacity="0.85" />
              <line x1="0" y1="-22" x2="0" y2="-9" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.6" strokeLinecap="round" />
              <rect x="-5" y="-6" width="10" height="2.5" rx="1" fill="#E85D75" fillOpacity="0.85" />
              <path
                d="M-5 -3.5 C-5 3, -4 6, 0 14 C4 6, 5 3, 5 -3.5 Z"
                fill="#E85D75"
                fillOpacity="0.9"
              />
              <path
                d="M0 -3.5 C0 3, 0 6, 0 14 C4 6, 5 3, 5 -3.5 Z"
                fill="#D94665"
                fillOpacity="0.6"
              />
              <circle cx="0" cy="3.5" r="1.3" fill="#FFFFFF" />
              <line x1="0" y1="3.5" x2="0" y2="12" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
            </g>
            <rect
              x="92"
              y="78"
              width="16"
              height="16"
              rx="5"
              fill="#FB7185"
              fillOpacity="0.85"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            <rect
              x="82"
              y="96"
              width="12"
              height="12"
              rx="4"
              fill="#FDA4AF"
              fillOpacity="0.75"
              stroke="#FFFFFF"
              strokeWidth="1.2"
            />
            <circle cx="106" cy="66" r="3.5" fill="#F43F5E" fillOpacity="0.5" stroke="#FFFFFF" strokeWidth="1" />
          </svg>
        </div>
      ),
    },
    {
      name: "Growth & Marketing",
      description: "Help more people discover GharPadharo.",
      bg: "bg-[#FDFAF3]",
      border: "border-[#F4ECDC]",
      hoverBorder: "hover:border-amber-300",
      iconBg: "bg-[#FEF2D6]",
      iconBorder: "border border-amber-200/40",
      iconContainerClass: "w-11 h-11 sm:w-12 sm:h-12 rounded-2xl",
      icon: (
        <svg
          className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-[#DE9B35]"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <rect x="3.5" y="14" width="3.2" height="7" rx="1.2" />
          <rect x="8.5" y="10.5" width="3.2" height="10.5" rx="1.2" />
          <rect x="13.5" y="6.5" width="3.2" height="14.5" rx="1.2" />
          <path
            d="M3.5 11.5L8.5 7.5L13 9.5L19.5 3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 3.5H19.5V8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      backgroundArt: (
        <div className="absolute bottom-1 right-1 pointer-events-none select-none w-[136px] h-[136px] sm:w-[144px] sm:h-[144px]" aria-hidden="true">
          <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="gmBar1Grad" x1="0" y1="0" x2="0.6" y2="1">
                <stop offset="0%" stopColor="#FFFDF7" />
                <stop offset="100%" stopColor="#FCEFC8" />
              </linearGradient>
              <linearGradient id="gmBar2Grad" x1="0" y1="0" x2="0.6" y2="1">
                <stop offset="0%" stopColor="#FEED96" />
                <stop offset="100%" stopColor="#FABE2F" />
              </linearGradient>
              <linearGradient id="gmBar3Grad" x1="0" y1="0" x2="0.6" y2="1">
                <stop offset="0%" stopColor="#FDD24D" />
                <stop offset="100%" stopColor="#E69620" />
              </linearGradient>
            </defs>
            <circle cx="106" cy="116" r="46" fill="#FEF2D6" fillOpacity="0.55" />
            <circle cx="74" cy="122" r="28" fill="#FFF8E7" fillOpacity="0.7" />
            <rect x="74" y="106" width="13" height="34" rx="5.5" fill="url(#gmBar1Grad)" />
            <rect x="92" y="84" width="13" height="56" rx="5.5" fill="url(#gmBar2Grad)" />
            <rect x="110" y="62" width="13" height="78" rx="5.5" fill="url(#gmBar3Grad)" />
            <path
              d="M48 114 C72 110, 98 90, 124 56"
              stroke="#E89F2A"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <polygon
              points="134,46 119,51 129,61"
              fill="#E89F2A"
            />
          </svg>
        </div>
      ),
    },
    {
      name: "Operations",
      description: "Make things happen behind the scenes.",
      bg: "bg-[#F3FAF6]",
      border: "border-[#DCF2E5]",
      hoverBorder: "hover:border-emerald-300",
      iconBg: "bg-[#DBF3E5]",
      iconBorder: "border border-emerald-200/60",
      icon: (
        <svg
          className="w-6.5 h-6.5 sm:w-7 sm:h-7 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      ),
      backgroundArt: (
        <div className="absolute -bottom-4 -right-4 pointer-events-none select-none w-[124px] h-[124px] opacity-75" aria-hidden="true">
          <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="85" cy="85" r="45" fill="#D1FAE5" fillOpacity="0.4" />
            <rect x="42" y="42" width="72" height="75" rx="14" fill="#FFFFFF" fillOpacity="0.75" stroke="#A7F3D0" strokeWidth="1.5" strokeOpacity="0.6" />
            <circle cx="58" cy="60" r="8" fill="#10B981" fillOpacity="0.6" />
            <path d="M54.5 60L57 62.5L61.5 57.5" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="71" y="58" width="30" height="4" rx="2" fill="#6EE7B7" fillOpacity="0.6" />
            <rect x="52" y="74" width="48" height="4" rx="2" fill="#A7F3D0" fillOpacity="0.6" />
            <rect x="52" y="85" width="38" height="4" rx="2" fill="#D1FAE5" fillOpacity="0.7" />
          </svg>
        </div>
      ),
    },
  ];

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < teams.length - 1;

  const handlePrev = () => {
    if (canPrev) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (canNext) setCurrentIndex((prev) => prev + 1);
  };

  const handleDot = (idx) => {
    setCurrentIndex(idx);
  };

  const minSwipeDistance = 40;

  const onTouchStart = (e) => {
    setTouchEnd({ x: 0, y: 0 });
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart.x || !touchEnd.x) return;
    const diffX = touchStart.x - touchEnd.x;
    const diffY = touchStart.y - touchEnd.y;
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0 && canNext) {
        handleNext();
      } else if (diffX < 0 && canPrev) {
        handlePrev();
      }
    }
  };

  return (
    <section className="w-full py-12 sm:py-16 lg:py-24 bg-white border-b border-slate-200/60 overflow-hidden">
      <div className="container-custom max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-7 sm:mb-9 lg:mb-14 text-left">
          <span className="text-xs sm:text-[13px] font-bold text-primary tracking-widest uppercase block mb-2 sm:mb-2.5">
            EXPLORE OUR TEAMS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[42px] font-extrabold text-heading tracking-tight leading-[1.15]">
            Different skills.
            <br />
            Same mission.
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-body mt-2 sm:mt-3 font-normal leading-relaxed max-w-2xl">
            From product and engineering to growth and operations, every team at GharPadharo plays a part in making finding a place simpler.
          </p>
        </div>

        {/* 1. Desktop Layout: 5 Editorial Team Cards in 1 Row (lg and above) */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-4 sm:gap-4.5 xl:gap-5">
          {teams.map((t, idx) => (
            <div
              key={idx}
              className={`group relative rounded-2xl sm:rounded-3xl border ${t.border} ${t.hoverBorder} ${t.bg} ${
                t.cardClass || "p-6 sm:p-7 xl:p-7.5"
              } shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-start min-h-[270px] sm:min-h-[290px] lg:min-h-[310px] overflow-hidden`}
            >
              {/* Subtle Abstract Background Decoration */}
              {t.backgroundArt}

              {/* Card Foreground Content */}
              <div className="relative z-10">
                {/* Icon Container */}
                <div
                  className={`${
                    t.iconContainerClass || "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl"
                  } ${t.iconBg} ${t.iconBorder} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300`}
                >
                  {t.icon}
                </div>

                {/* Team Name */}
                <h3
                  className={
                    t.titleClass ||
                    "text-lg sm:text-xl font-bold text-heading tracking-tight mt-6 sm:mt-7"
                  }
                >
                  {t.name}
                </h3>

                {/* Description */}
                <p
                  className={
                    t.descClass ||
                    "text-sm sm:text-[15px] text-body font-normal leading-relaxed mt-2 sm:mt-2.5"
                  }
                >
                  {t.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Mobile & Tablet Carousel Viewport (< lg) */}
        <div
          className="lg:hidden w-full"
          role="region"
          aria-roledescription="carousel"
          aria-label="Explore Our Teams"
        >
          {/* Slider Container with Touch Support */}
          <div
            className="overflow-hidden w-full"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="flex transition-transform duration-350 ease-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {teams.map((t, idx) => (
                <div
                  key={idx}
                  className="w-full shrink-0 flex justify-center px-0.5"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${t.name} (Team ${idx + 1} of ${teams.length})`}
                >
                  <div
                    className={`relative w-full max-w-md rounded-2xl sm:rounded-3xl border ${t.border} ${t.bg} ${
                      t.cardClass || "p-6 sm:p-7"
                    } shadow-2xs flex flex-col justify-start min-h-[265px] sm:min-h-[290px] overflow-hidden`}
                  >
                    {/* Subtle Abstract Background Decoration */}
                    {t.backgroundArt}

                    {/* Card Foreground Content */}
                    <div className="relative z-10">
                      {/* Icon Container */}
                      <div
                        className={`${
                          t.iconContainerClass || "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl"
                        } ${t.iconBg} ${t.iconBorder} flex items-center justify-center shrink-0 shadow-2xs`}
                      >
                        {t.icon}
                      </div>

                      {/* Team Name */}
                      <h3
                        className={
                          t.titleClass ||
                          "text-lg sm:text-xl font-bold text-heading tracking-tight mt-5 sm:mt-6"
                        }
                      >
                        {t.name}
                      </h3>

                      {/* Description */}
                      <p
                        className={
                          t.descClass ||
                          "text-sm sm:text-[15px] text-body font-normal leading-relaxed mt-2 max-w-[260px] sm:max-w-none"
                        }
                      >
                        {t.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Pagination Dots & Navigation Buttons */}
          <div className="mt-5 sm:mt-6 flex flex-col items-center gap-3.5">
            {/* Pagination Dots for all 5 departments */}
            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label="Department slides"
            >
              {teams.map((t, idx) => {
                const isActive = currentIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDot(idx)}
                    aria-label={`Go to ${t.name} department`}
                    aria-selected={isActive}
                    role="tab"
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-6 bg-primary"
                        : "w-2.5 bg-purple-200/50 hover:bg-purple-200"
                    }`}
                  />
                );
              })}
            </div>

            {/* Previous and Next Circular Buttons */}
            <div className="flex items-center gap-3">
              {/* Previous Button */}
              <button
                type="button"
                onClick={handlePrev}
                disabled={!canPrev}
                aria-label="Previous department"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 ${
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
                aria-label="Next department"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 ${
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
    </section>
  );
}
