"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Flag,
  Code2,
  Box,
  PenTool,
  ChartNoAxesCombined,
  Settings,
} from "lucide-react";
import { WEBSITE_IMAGES } from "@/lib/websiteImages";
import SectionBadge from "@/components/common/SectionBadge";

const TEAMS = [
  {
    id: "engineering",
    name: "Engineering",
    description: "Build the technology that powers GharPadharo.",
    image: WEBSITE_IMAGES.teams.engineering,
    imageAlt: "GharPadharo developers collaborating on code",
    Icon: Code2,
    accentColor: "#3B82F6",
    ringColor: "ring-[#3B82F6]",
    glowColor: "rgba(59, 130, 246, 0.24)",
    iconBg: "bg-[#E0EDFD]",
    iconColor: "text-[#2563EB]",
    cardBg: "bg-white",
    borderColor: "border-[#DCE9FE]",
    photoPosition: "right",
    desktopPositionClass: "left-[2%] top-[70px] w-[355px] xl:w-[370px] h-[98px]",
    paddingClass: "pl-4 pr-3 py-3",
    entranceDelay: 350,
  },
  {
    id: "product",
    name: "Product",
    description: "Turn real problems into simple experiences.",
    image: WEBSITE_IMAGES.teams.product,
    imageAlt: "GharPadharo teammates discussing product ideas around a laptop",
    Icon: Box,
    accentColor: "#8B5CF6",
    ringColor: "ring-[#8B5CF6]",
    glowColor: "rgba(139, 92, 246, 0.24)",
    iconBg: "bg-[#EAE4FC]",
    iconColor: "text-[#7C3AED]",
    cardBg: "bg-white",
    borderColor: "border-[#ECE5FB]",
    photoPosition: "left",
    desktopPositionClass: "right-[2%] top-[70px] w-[355px] xl:w-[370px] h-[98px]",
    paddingClass: "pl-3 pr-4 py-3",
    entranceDelay: 420,
  },
  {
    id: "operations",
    name: "Operations",
    description: "Make things happen behind the scenes.",
    image: WEBSITE_IMAGES.teams.operations,
    imageAlt: "GharPadharo team coordinating work in an office",
    Icon: Settings,
    accentColor: "#10B981",
    ringColor: "ring-[#10B981]",
    glowColor: "rgba(16, 185, 129, 0.24)",
    iconBg: "bg-[#DBF3E5]",
    iconColor: "text-[#059669]",
    cardBg: "bg-white",
    borderColor: "border-[#D1F2DF]",
    photoPosition: "right",
    desktopPositionClass: "left-[0%] top-[295px] w-[355px] xl:w-[370px] h-[98px]",
    paddingClass: "pl-4 pr-3 py-3",
    entranceDelay: 490,
  },
  {
    id: "design",
    name: "Design",
    description: "Shape how people experience our platforms.",
    image: WEBSITE_IMAGES.teams.design,
    imageAlt: "GharPadharo designer working on interface designs",
    Icon: PenTool,
    accentColor: "#F43F5E",
    ringColor: "ring-[#F43F5E]",
    glowColor: "rgba(244, 63, 94, 0.24)",
    iconBg: "bg-[#FCE7ED]",
    iconColor: "text-[#E85D75]",
    cardBg: "bg-white",
    borderColor: "border-[#FCE3E8]",
    photoPosition: "left",
    desktopPositionClass: "right-[0%] top-[295px] w-[355px] xl:w-[370px] h-[98px]",
    paddingClass: "pl-3 pr-4 py-3",
    entranceDelay: 560,
  },
  {
    id: "growth",
    name: "Growth & Marketing",
    description: "Help more people discover GharPadharo.",
    image: WEBSITE_IMAGES.teams.growth,
    imageAlt: "GharPadharo teammates collaborating on marketing or growth",
    Icon: ChartNoAxesCombined,
    accentColor: "#F59E0B",
    ringColor: "ring-[#F59E0B]",
    glowColor: "rgba(245, 158, 11, 0.24)",
    iconBg: "bg-[#FEF2D6]",
    iconColor: "text-[#D97706]",
    cardBg: "bg-white",
    borderColor: "border-[#F8ECCB]",
    photoPosition: "left",
    desktopPositionClass: "left-1/2 bottom-[10px] -translate-x-1/2 w-[390px] xl:w-[410px] h-[98px]",
    paddingClass: "pl-3 pr-5 py-3",
    entranceDelay: 630,
  },
];

const TEAM_CONNECTORS = {
  engineering: {
    x1: 520,
    y1: 255,
    x2: 425,
    y2: 190,
    dotX: 425,
    dotY: 190,
    defaultStroke: "#BFDBFE",
    ringStroke: "#93C5FD",
  },
  product: {
    x1: 660,
    y1: 255,
    x2: 755,
    y2: 190,
    dotX: 755,
    dotY: 190,
    defaultStroke: "#DDD6FE",
    ringStroke: "#C4B5FD",
  },
  operations: {
    x1: 500,
    y1: 310,
    x2: 375,
    y2: 345,
    dotX: 375,
    dotY: 345,
    defaultStroke: "#A7F3D0",
    ringStroke: "#6EE7B7",
  },
  design: {
    x1: 680,
    y1: 310,
    x2: 805,
    y2: 345,
    dotX: 805,
    dotY: 345,
    defaultStroke: "#FECDD3",
    ringStroke: "#FDA4AF",
  },
  growth: {
    x1: 590,
    y1: 400,
    x2: 590,
    y2: 445,
    dotX: 590,
    dotY: 445,
    defaultStroke: "#FDE68A",
    ringStroke: "#FCD34D",
  },
};

export default function ExploreTeamsSection() {
  const sectionRef = useRef(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [hoveredTeam, setHoveredTeam] = useState(null);
  const [focusedTeam, setFocusedTeam] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  // Entrance observer respecting prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      const raf = requestAnimationFrame(() => {
        setIsVisible(true);
        setHasEntered(true);
      });
      return () => cancelAnimationFrame(raf);
    }

    if (!("IntersectionObserver" in window)) {
      const raf = requestAnimationFrame(() => {
        setIsVisible(true);
        setHasEntered(true);
      });
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          const timer = setTimeout(() => {
            setHasEntered(true);
          }, 950);
          observer.disconnect();
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Compute active team id
  const activeTeamId = hoveredTeam || focusedTeam || selectedTeam || null;
  const hasActive = activeTeamId !== null;

  // Toggle selection on click or keyboard
  const handleSelectTeam = (teamId) => {
    setSelectedTeam((prev) => (prev === teamId ? null : teamId));
  };

  const handleKeyDown = (e, teamId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelectTeam(teamId);
    }
  };

  // Safe transform generator preserving Growth center translate
  const getCardTransform = (teamId, isActive) => {
    const isCentered = teamId === "growth";
    if (!hasEntered) {
      if (!isVisible) {
        return isCentered
          ? "translateX(-50%) translateY(16px)"
          : "translateY(16px)";
      }
      return isCentered
        ? "translateX(-50%) translateY(0)"
        : "translateY(0)";
    }
    if (isCentered) {
      return isActive
        ? "translateX(-50%) translateY(-4px)"
        : "translateX(-50%) translateY(0)";
    }
    return isActive ? "translateY(-4px)" : "translateY(0)";
  };

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/60 relative overflow-hidden"
    >
      {/* Component-scoped CSS for orbits, breathing animation & reduced motion */}
      <style>{`
        .orbital-card {
          border-width: 1.5px;
          border-radius: 24px;
          box-shadow: 0 6px 22px rgba(89, 41, 214, 0.05);
          transition:
            border-color 300ms cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1),
            transform 300ms cubic-bezier(0.4, 0, 0.2, 1),
            opacity 300ms cubic-bezier(0.4, 0, 0.2, 1),
            filter 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Slow continuous orbital rotation */
        @keyframes orbitSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .orbital-spin {
          transform-origin: 590px 310px;
          animation: orbitSpin 80s linear infinite;
        }

        /* Central One Mission breathing animation */
        @keyframes missionHubBreathe {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow:
              0 16px 40px -8px rgba(89, 41, 214, 0.44),
              0 0 28px rgba(113, 59, 255, 0.24);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.025);
            box-shadow:
              0 22px 50px -6px rgba(89, 41, 214, 0.58),
              0 0 38px rgba(113, 59, 255, 0.38);
          }
        }

        .mission-hub-breathe {
          animation: missionHubBreathe 4.6s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .orbital-spin,
          .mission-hub-breathe {
            animation: none !important;
          }
          .orbital-card,
          .orbital-card-photo,
          .orbital-card-icon {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Soft background ambient gradient shapes */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] bg-purple-100/35 rounded-full blur-3xl pointer-events-none z-0"
        aria-hidden="true"
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header (Centered with subtle entrance) */}
        <div
          className={`max-w-3xl mx-auto mb-10 sm:mb-14 lg:mb-16 text-center transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <SectionBadge className="mb-3.5">
            EXPLORE OUR TEAMS
          </SectionBadge>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-extrabold text-[#11152F] tracking-tight leading-[1.12]">
            Different <span className="text-[#5929D6]">skills.</span> Same{" "}
            <span className="text-[#5929D6]">mission.</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-[16.5px] text-[#64748B] mt-3 sm:mt-4 font-normal leading-relaxed max-w-2xl mx-auto">
            From product and engineering to growth and operations, every team at
            GharPadharo plays a part in making finding a place simpler.
          </p>
        </div>

        {/* ============================================================
            1. DESKTOP VIEW (>= 1024px): Orbital Team Infographic
           ============================================================ */}
        <div className="hidden lg:block relative w-full h-[580px] xl:h-[610px] max-w-[1180px] mx-auto select-none">
          {/* Orbital SVG Tracks & Connecting Nodes */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 1180 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Center = (590, 310) */}

            {/* Rotating Layer: Concentric dashed circular orbits & aesthetic satellite dots */}
            <g className="orbital-spin" style={{ transformOrigin: "590px 310px" }}>
              {/* Inner concentric dotted orbit (radius 135) */}
              <circle
                cx="590"
                cy="310"
                r="135"
                stroke="#D8CCFE"
                strokeWidth="1.5"
                strokeDasharray="4 5"
                opacity="0.85"
              />

              {/* Mid concentric dotted orbit (radius 265) */}
              <circle
                cx="590"
                cy="310"
                r="265"
                stroke="#E4DCFF"
                strokeWidth="1.4"
                strokeDasharray="5 6"
                opacity="0.9"
              />

              {/* Outer subtle orbital ring (radius 400) */}
              <circle
                cx="590"
                cy="310"
                r="400"
                stroke="#EFEBFF"
                strokeWidth="1.2"
                strokeDasharray="6 7"
                opacity="0.75"
              />

              {/* Orbiting satellite dots along circular tracks */}
              <circle cx="590" cy="175" r="4.5" fill="#8B5CF6" />
              <circle cx="325" cy="310" r="4" fill="#A78BFA" opacity="0.85" />
              <circle cx="855" cy="310" r="4" fill="#C4B5FD" opacity="0.85" />
              <circle cx="590" cy="445" r="3.5" fill="#93C5FD" opacity="0.75" />
            </g>

            {/* Static & Interactive Layer: Connecting Lines and Nodes */}
            <g
              className={`transition-opacity duration-700 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "260ms" }}
            >
              {Object.entries(TEAM_CONNECTORS).map(([id, conn]) => {
                const team = TEAMS.find((t) => t.id === id);
                const isConnActive = activeTeamId === id;
                const isConnSubdued = hasActive && !isConnActive;

                return (
                  <g key={id} className="transition-all duration-300">
                    {/* Radial Connector Line */}
                    <line
                      x1={conn.x1}
                      y1={conn.y1}
                      x2={conn.x2}
                      y2={conn.y2}
                      stroke={isConnActive ? team.accentColor : conn.defaultStroke}
                      strokeWidth={isConnActive ? 2.5 : 1.5}
                      strokeDasharray={isConnActive ? "none" : "3 4"}
                      strokeOpacity={isConnSubdued ? 0.25 : isConnActive ? 1 : 0.85}
                      className="transition-all duration-300"
                    />

                    {/* Outer Connection Pulse Ring */}
                    <circle
                      cx={conn.dotX}
                      cy={conn.dotY}
                      r={isConnActive ? 12 : 9}
                      stroke={isConnActive ? team.accentColor : conn.ringStroke}
                      strokeWidth={isConnActive ? 2 : 1.5}
                      opacity={isConnSubdued ? 0.25 : isConnActive ? 0.95 : 0.6}
                      fill={isConnActive ? `${team.accentColor}20` : "none"}
                      className="transition-all duration-300"
                    />

                    {/* Center Connection Dot */}
                    <circle
                      cx={conn.dotX}
                      cy={conn.dotY}
                      r={isConnActive ? 6.5 : 5.5}
                      fill={team.accentColor}
                      opacity={isConnSubdued ? 0.35 : 1}
                      className="transition-all duration-300"
                    />
                  </g>
                );
              })}
            </g>
          </svg>

          {/* ============================================================
              CENTRAL MISSION HUB
             ============================================================ */}
          <div
            className={`absolute left-1/2 top-[310px] w-44 h-44 rounded-full bg-gradient-to-br from-[#6835F9] via-[#5929D6] to-[#451AB8] text-white flex flex-col items-center justify-center text-center p-4 z-20 border-[3px] border-white/40 mission-hub-breathe transition-opacity duration-700 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "150ms" }}
            role="region"
            aria-label="One Mission"
          >
            <div
              className="w-9 h-9 rounded-full bg-white/18 flex items-center justify-center shrink-0 mb-1.5"
              aria-hidden="true"
            >
              <Flag className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <h3 className="text-[19px] font-extrabold text-white tracking-tight leading-tight">
              One Mission
            </h3>
            <p className="text-[12px] text-white/85 font-normal leading-tight mt-1 max-w-[120px]">
              Making finding a place simpler.
            </p>
          </div>

          {/* ============================================================
              FIVE FLOATING TEAM CARDS (Desktop Orbit)
             ============================================================ */}
          {TEAMS.map((t) => {
            const Icon = t.Icon;
            const isSelected = selectedTeam === t.id;
            const isHovered = hoveredTeam === t.id || focusedTeam === t.id;
            const isActive = isSelected || isHovered;
            const isSubdued = hasActive && !isActive;

            return (
              <article
                key={t.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`${t.name} team. ${
                  isSelected ? "Selected." : "Click to select."
                } ${t.description}`}
                onClick={() => handleSelectTeam(t.id)}
                onKeyDown={(e) => handleKeyDown(e, t.id)}
                onMouseEnter={() => setHoveredTeam(t.id)}
                onMouseLeave={() => setHoveredTeam(null)}
                onFocus={() => setFocusedTeam(t.id)}
                onBlur={() => setFocusedTeam(null)}
                style={{
                  borderColor: isActive ? t.accentColor : undefined,
                  boxShadow: isActive
                    ? `0 16px 36px -6px ${t.glowColor}, 0 0 20px ${t.glowColor}`
                    : undefined,
                  transform: getCardTransform(t.id, isActive),
                  transitionDelay: !hasEntered && isVisible ? `${t.entranceDelay}ms` : "0ms",
                }}
                className={`orbital-card absolute ${t.desktopPositionClass} bg-white flex items-center justify-between ${
                  t.paddingClass
                } z-10 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-2 transition-all duration-300 ${
                  isSubdued ? "opacity-65 grayscale-[15%]" : "opacity-100"
                } ${
                  !hasEntered
                    ? isVisible
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                    : ""
                }`}
              >
                {/* Photo on left when photoPosition === "left" */}
                {t.photoPosition === "left" && (
                  <div
                    className={`orbital-card-photo relative w-[76px] h-[76px] aspect-square rounded-full overflow-hidden shrink-0 shadow-sm bg-slate-100 transition-all duration-300 -ml-6 ${
                      isActive
                        ? "ring-[4px] scale-105 ring-offset-2 ring-offset-white"
                        : "ring-[3px]"
                    } ${t.ringColor}`}
                  >
                    <Image
                      src={t.image}
                      alt={t.imageAlt}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                )}

                {/* Team Information & Category Icon */}
                <div
                  className={`flex items-center gap-3 min-w-0 ${
                    t.photoPosition === "left" ? "pl-2 flex-1" : "pr-2"
                  }`}
                >
                  <div
                    className={`orbital-card-icon w-11 h-11 rounded-[14px] ${
                      t.iconBg
                    } flex items-center justify-center shrink-0 shadow-2xs transition-all duration-300 ${
                      isActive ? "scale-110" : "scale-100"
                    }`}
                    aria-hidden="true"
                  >
                    <Icon className={`w-5 h-5 ${t.iconColor}`} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[16px] font-extrabold text-[#11152F] tracking-tight leading-snug">
                      {t.name}
                    </h4>
                    <p className="text-[12px] text-[#64748B] leading-[1.4] font-normal mt-0.5 line-clamp-2">
                      {t.description}
                    </p>
                  </div>
                </div>

                {/* Photo on right when photoPosition === "right" */}
                {t.photoPosition === "right" && (
                  <div
                    className={`orbital-card-photo relative w-[76px] h-[76px] aspect-square rounded-full overflow-hidden shrink-0 shadow-sm bg-slate-100 transition-all duration-300 -mr-6 ${
                      isActive
                        ? "ring-[4px] scale-105 ring-offset-2 ring-offset-white"
                        : "ring-[3px]"
                    } ${t.ringColor}`}
                  >
                    <Image
                      src={t.image}
                      alt={t.imageAlt}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* ============================================================
            2. TABLET & MOBILE VIEW (< 1024px): Stacked Team Cards
           ============================================================ */}
        <div className="lg:hidden w-full max-w-xl mx-auto">
          {/* 5 Stacked Team Cards */}
          <div className="flex flex-col gap-3.5 sm:gap-4 w-full">
            {TEAMS.map((t) => {
              const Icon = t.Icon;
              const isSelected = selectedTeam === t.id;
              const isHovered = hoveredTeam === t.id || focusedTeam === t.id;
              const isActive = isSelected || isHovered;
              const isSubdued = hasActive && !isActive;

              return (
                <article
                  key={t.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`${t.name} team. ${
                    isSelected ? "Selected." : "Click to select."
                  } ${t.description}`}
                  onClick={() => handleSelectTeam(t.id)}
                  onKeyDown={(e) => handleKeyDown(e, t.id)}
                  onMouseEnter={() => setHoveredTeam(t.id)}
                  onMouseLeave={() => setHoveredTeam(null)}
                  onFocus={() => setFocusedTeam(t.id)}
                  onBlur={() => setFocusedTeam(null)}
                  style={{
                    borderColor: isActive ? t.accentColor : undefined,
                    boxShadow: isActive
                      ? `0 12px 30px -6px ${t.glowColor}, 0 0 16px ${t.glowColor}`
                      : undefined,
                    transform: isActive ? "translateY(-3px)" : undefined,
                  }}
                  className={`orbital-card cursor-pointer w-full ${t.cardBg} ${
                    t.borderColor
                  } rounded-[22px] p-3.5 sm:p-4 flex items-center gap-3.5 sm:gap-4 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-2 select-none ${
                    isSubdued ? "opacity-65 grayscale-[15%]" : "opacity-100"
                  }`}
                >
                  {/* Circular Team Photo */}
                  <div
                    className={`orbital-card-photo relative w-16 h-16 sm:w-18 sm:h-18 aspect-square rounded-full overflow-hidden shrink-0 ring-[3px] ${
                      t.ringColor
                    } shadow-sm bg-slate-100 transition-all duration-300 ${
                      isActive ? "scale-105 ring-[4px] ring-offset-2 ring-offset-white" : ""
                    }`}
                  >
                    <Image
                      src={t.image}
                      alt={t.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 70px, 80px"
                    />
                  </div>

                  {/* Category Icon */}
                  <div
                    className={`orbital-card-icon w-10 h-10 sm:w-11 sm:h-11 rounded-[13px] ${
                      t.iconBg
                    } flex items-center justify-center shrink-0 shadow-2xs transition-all duration-300 ${
                      isActive ? "scale-110" : "scale-100"
                    }`}
                    aria-hidden="true"
                  >
                    <Icon className={`w-5 h-5 ${t.iconColor}`} strokeWidth={2} />
                  </div>

                  {/* Team Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] sm:text-[16px] font-extrabold text-[#11152F] tracking-tight leading-snug">
                      {t.name}
                    </h4>
                    <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed mt-0.5">
                      {t.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
