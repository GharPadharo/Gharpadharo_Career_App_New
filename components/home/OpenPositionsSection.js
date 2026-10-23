import Link from "next/link";
import {
  Code2,
  Boxes,
  PencilRuler,
  ChartNoAxesCombined,
  Settings,
  Building2,
  MapPin,
  Clock,
  Calendar,
  ArrowRight,
} from "lucide-react";
import SectionBadge from "@/components/common/SectionBadge";
import ScrollReveal from "@/components/common/ScrollReveal";

/**
 * Maps job category / team name to consistent Lucide outline icons.
 * All categories use the unified purple icon (#5929D6) on a soft lavender background (#EEE9FF).
 */
function getCategoryConfig(team = "", title = "") {
  const combined = `${team} ${title}`.toLowerCase();
  const teamLower = team.toLowerCase();

  // Design / UI/UX / Creative / Brand (check title & team so UI/UX roles get PencilRuler)
  if (
    teamLower.includes("design") ||
    combined.includes("ui/ux") ||
    combined.includes("designer") ||
    teamLower.includes("creative") ||
    teamLower.includes("brand")
  ) {
    return {
      name: team || "Design",
      Icon: PencilRuler,
    };
  }

  // Product / Product Management
  if (teamLower.includes("product") || combined.includes("product manager")) {
    return {
      name: team || "Product",
      Icon: Boxes,
    };
  }

  // Growth & Marketing / Content
  if (
    teamLower.includes("growth") ||
    teamLower.includes("market") ||
    teamLower.includes("content") ||
    combined.includes("marketing") ||
    combined.includes("content creator")
  ) {
    return {
      name: team || "Growth & Marketing",
      Icon: ChartNoAxesCombined,
    };
  }

  // Operations / Sales / Business Development / HR
  if (
    teamLower.includes("operation") ||
    teamLower.includes("sales") ||
    teamLower.includes("business") ||
    teamLower.includes("communit") ||
    teamLower.includes("people") ||
    teamLower.includes("hr")
  ) {
    return {
      name: team || "Operations",
      Icon: Settings,
    };
  }

  // Engineering / Technology / Developer (default)
  return {
    name: team || "Engineering",
    Icon: Code2,
  };
}

/**
 * Styling for employment type badges (Internship, Full-time, Contract, etc.)
 */
function getEmploymentTypeBadge(type = "") {
  const norm = type.toLowerCase();
  if (norm.includes("intern")) {
    return "bg-[#E7F8F0] text-[#0D8A52] border-[#C6F0DC]";
  }
  if (norm.includes("full")) {
    return "bg-[#FEF3EB] text-[#D97706] border-[#FDE0C6]";
  }
  if (norm.includes("contract")) {
    return "bg-[#EEF4FF] text-[#2563EB] border-[#C7DDFD]";
  }
  return "bg-[#F3EEFF] text-[#5929D6] border-[#DDD6FE]";
}

/**
 * Safely extracts milliseconds timestamp from a job object.
 * Prioritizes canonical `postedAt`, falls back to `createdAt`, and safely handles missing or invalid dates.
 */
function getJobTimestamp(job) {
  if (!job) return 0;
  if (job.postedAt) {
    const time = new Date(job.postedAt).getTime();
    if (!Number.isNaN(time)) return time;
  }
  if (job.createdAt) {
    const time = new Date(job.createdAt).getTime();
    if (!Number.isNaN(time)) return time;
  }
  return 0;
}

export default function OpenPositionsSection({ jobs = [] }) {
  // 1. Filter only active jobs (case-insensitive check)
  const activeJobs = (jobs || []).filter((j) =>
    j?.status ? j.status.toLowerCase() === "active" : true
  );

  // 2. Sort by canonical posting date (postedAt, fallback createdAt), from newest to oldest
  const sortedJobs = [...activeJobs].sort(
    (a, b) => getJobTimestamp(b) - getJobTimestamp(a)
  );

  // 3. Show only the 3 latest active jobs on the landing page (if fewer than 3 exist, display all)
  const displayJobs = sortedJobs.slice(0, 3);

  return (
    <section
      id="open-positions"
      className="w-full py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/60 scroll-mt-20 relative overflow-x-clip"
    >
      {/* Component-scoped styles for responsive grid & polished purple hover state */}
      <style>{`
        .open-positions-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          width: 100%;
          align-items: stretch;
        }
        @media (min-width: 1024px) {
          .open-positions-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        .gp-job-card {
          background: linear-gradient(180deg, #FFFFFF 0%, #FDFCFF 100%);
          border: 1.5px solid #E7E2FF;
          border-radius: 24px;
          box-shadow: 0 4px 18px rgba(89, 41, 214, 0.035);
          transition:
            border-color 300ms cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1),
            transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gp-job-card:hover,
        .gp-job-card:focus-within {
          border-color: #713BFF;
          box-shadow:
            0 12px 32px -6px rgba(113, 59, 255, 0.18),
            0 0 18px 0 rgba(113, 59, 255, 0.10);
          transform: translateY(-2px);
        }

        .gp-card-top-highlight {
          background: linear-gradient(
            180deg,
            rgba(113, 59, 255, 0.18) 0%,
            rgba(113, 59, 255, 0.05) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          opacity: 0;
          transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gp-job-card:hover .gp-card-top-highlight,
        .gp-job-card:focus-within .gp-card-top-highlight {
          opacity: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .gp-job-card,
          .gp-card-top-highlight {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal variant="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-10 lg:mb-12">
            <div>
              <SectionBadge className="mb-3.5">
                OPEN POSITIONS
              </SectionBadge>
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-extrabold text-[#11152F] tracking-tight leading-[1.12]">
                Find <span className="text-[#5929D6]">your place</span> at GharPadharo.
              </h2>
              <p className="text-sm sm:text-base lg:text-[16.5px] text-[#64748B] mt-3 sm:mt-3.5 font-normal leading-relaxed max-w-2xl">
                Explore opportunities to learn, build, and make an impact.
              </p>
            </div>

            {activeJobs.length > 0 && (
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#5929D6] hover:text-[#4D20BE] hover:underline transition-colors shrink-0 self-end sm:self-auto"
              >
                <span>View all jobs</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </div>
        </ScrollReveal>

        {/* Jobs Grid or Graceful Empty State */}
        {displayJobs.length === 0 ? (
          <div className="w-full bg-[#F8FAFC] rounded-[24px] border border-[#E7E2FF] p-7 sm:p-9 lg:p-11 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 min-h-[180px]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 max-w-3xl">
              <div
                className="w-16 h-16 rounded-2xl bg-[#EEE9FF] text-[#5929D6] flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <Code2 className="w-7 h-7 text-[#5929D6]" strokeWidth={2} />
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-[#11152F] tracking-tight">
                  No open positions right now.
                </h3>
                <p className="text-sm sm:text-[15px] text-[#64748B] leading-relaxed font-normal">
                  We&apos;re always interested in meeting thoughtful people. Submit your resume and we&apos;ll keep you in mind for future opportunities.
                </p>
              </div>
            </div>

            <div className="shrink-0 w-full sm:w-auto pt-2 md:pt-0">
              <Link
                href="/jobs/general-application"
                className="hero-cta-sweep group w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow-md shadow-[#5929D6]/20 hover:shadow-lg hover:shadow-[#4D20BE]/35 active:scale-[0.98] active:shadow-sm transition-all duration-300 ease-out text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC]"
              >
                <span className="relative z-1">Submit Your Resume</span>
                <span
                  aria-hidden="true"
                  className="relative z-1 text-base leading-none transition-transform duration-300 ease-out group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="open-positions-grid gap-4 sm:gap-5 lg:gap-7">
            {displayJobs.map((job, idx) => {
              const categoryConfig = getCategoryConfig(job.team, job.title);
              const CategoryIcon = categoryConfig.Icon;
              const typeBadgeClass = getEmploymentTypeBadge(job.type);
              const locationStr = job.location || job.workMode || "Dehradun, India";
              const experienceStr = job.experience || "All levels";
              const departmentStr = job.team || categoryConfig.name;
              const postedStr = job.postedText || "Recently posted";
              const detailUrl = `/jobs/${job.id || job.slug}`;
              const descriptionText =
                job.description ||
                "Join our team and help build technology that makes finding homes simpler, smarter, and more transparent.";

              return (
                <ScrollReveal
                  key={job.id || job.slug || job._id}
                  variant="fade-up"
                  delay={idx * 100}
                  className="h-full w-full"
                >
                  <article
                    className="gp-job-card group relative overflow-hidden h-full w-full min-w-0"
                  >
                  {/* Soft purple highlight along top edge on hover */}
                  <div
                    className="gp-card-top-highlight absolute top-0 left-0 right-0 h-10 pointer-events-none z-1"
                    aria-hidden="true"
                  />

                  {/* Soft decorative lavender shapes in the top-right corner */}
                  <svg
                    className="absolute top-0 right-0 w-36 h-32 sm:w-44 sm:h-36 pointer-events-none z-0"
                    viewBox="0 0 176 144"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M44 0C58 42 94 70 136 88C154 96 168 116 176 144V0H44Z"
                      fill="#F3EFFF"
                    />
                    <path
                      d="M88 0C98 28 122 48 152 60C164 65 172 78 176 96V0H88Z"
                      fill="#EBE4FF"
                      fillOpacity="0.6"
                    />
                  </svg>

                  {/* ============================================================
                      1. DESKTOP LAYOUT (>= 1024px): 3 Vertical Cards in One Row
                     ============================================================ */}
                  <div className="hidden lg:flex lg:flex-col lg:justify-between lg:h-full p-7 relative z-2">
                    <div className="flex-1 flex flex-col">
                      {/* Top row: Category Icon (64-68px) on left + Employment badge on right */}
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="w-[68px] h-[68px] rounded-[18px] bg-[#EEE9FF] text-[#5929D6] flex items-center justify-center shrink-0"
                          aria-hidden="true"
                        >
                          <CategoryIcon className="w-8 h-8 text-[#5929D6]" strokeWidth={2} />
                        </div>

                        <span
                          className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold border ${typeBadgeClass} mt-1 shrink-0`}
                        >
                          {job.type || "Full-time"}
                        </span>
                      </div>

                      {/* Job Title: Bold dark navy (#11152F), wraps naturally onto 2 lines */}
                      <h3 className="text-[21px] font-extrabold text-[#11152F] mt-5 group-hover:text-[#5929D6] group-focus-within:text-[#5929D6] transition-colors duration-300 tracking-tight leading-snug">
                        <Link
                          href={detailUrl}
                          className="focus:outline-none focus-visible:underline"
                        >
                          {job.title}
                        </Link>
                      </h3>

                      {/* Job Metadata: 3 separate readable lines with outline icons */}
                      <div className="mt-4 space-y-2 text-[13.5px] text-[#64748B] font-medium">
                        <div className="flex items-center gap-2">
                          <Building2
                            className="w-4 h-4 text-[#64748B] shrink-0"
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                          <span>{departmentStr}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin
                            className="w-4 h-4 text-[#64748B] shrink-0"
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                          <span>{locationStr}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock
                            className="w-4 h-4 text-[#64748B] shrink-0"
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                          <span>{experienceStr}</span>
                        </div>
                      </div>

                      {/* Description: Muted slate-gray, maximum 2 lines on desktop */}
                      <p className="text-[14px] text-[#64748B] leading-relaxed mt-4 line-clamp-2 font-normal">
                        {descriptionText}
                      </p>
                    </div>

                    {/* Card Footer: Thin light-lavender divider, Posted date on left, "View details →" on right */}
                    <div className="border-t border-[#ECE8FF] mt-6 pt-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
                      <div className="flex items-center gap-2 text-[13.5px] text-[#64748B] font-medium">
                        <Calendar
                          className="w-4 h-4 text-[#64748B] shrink-0"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                        <span>{postedStr}</span>
                      </div>

                      <Link
                        href={detailUrl}
                        className="inline-flex items-center gap-1.5 text-[15px] font-bold text-[#5929D6] hover:text-[#4D20BE] transition-colors duration-300 focus:outline-none focus-visible:underline ml-auto"
                        aria-label={`View details for ${job.title}`}
                      >
                        <span>View details</span>
                        <ArrowRight
                          className="w-4 h-4 stroke-[2.2] transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </div>

                  {/* ============================================================
                      2. TABLET LAYOUT (640px – 1023px): Stacked Horizontal List Cards
                     ============================================================ */}
                  <div className="hidden sm:flex lg:hidden flex-col p-6 relative z-2">
                    {/* Top Row: Icon + Job Title on left, Employment Badge on right */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className="w-13 h-13 rounded-2xl bg-[#EEE9FF] text-[#5929D6] flex items-center justify-center shrink-0"
                          aria-hidden="true"
                        >
                          <CategoryIcon className="w-6 h-6 text-[#5929D6]" strokeWidth={2} />
                        </div>

                        <h3 className="text-[18px] font-extrabold text-[#11152F] group-hover:text-[#5929D6] group-focus-within:text-[#5929D6] transition-colors duration-300 tracking-tight leading-snug">
                          <Link
                            href={detailUrl}
                            className="focus:outline-none focus-visible:underline"
                          >
                            {job.title}
                          </Link>
                        </h3>
                      </div>

                      <span
                        className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold border ${typeBadgeClass} shrink-0`}
                      >
                        {job.type || "Full-time"}
                      </span>
                    </div>

                    {/* Middle Metadata Row */}
                    <div className="mt-3.5 text-[13px] text-[#64748B] font-medium">
                      <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1">
                        <span className="inline-flex items-center gap-1.5">
                          <Building2
                            className="w-3.5 h-3.5 text-[#64748B] shrink-0"
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                          <span>{departmentStr}</span>
                        </span>

                        <span className="text-[#CBD5E1]" aria-hidden="true">
                          |
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <MapPin
                            className="w-3.5 h-3.5 text-[#64748B] shrink-0"
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                          <span>{locationStr}</span>
                        </span>

                        <span className="text-[#CBD5E1]" aria-hidden="true">
                          |
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <Clock
                            className="w-3.5 h-3.5 text-[#64748B] shrink-0"
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                          <span>{experienceStr}</span>
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-[13.5px] text-[#64748B] leading-relaxed line-clamp-2 font-normal">
                      {descriptionText}
                    </p>

                    {/* Card Footer: Divider, Posted date on left, "View details →" on right */}
                    <div className="border-t border-[#ECE8FF] mt-4 pt-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
                      <div className="flex items-center gap-1.5 text-[13px] text-[#64748B] font-medium">
                        <Calendar
                          className="w-3.5 h-3.5 text-[#64748B] shrink-0"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                        <span>{postedStr}</span>
                      </div>

                      <Link
                        href={detailUrl}
                        className="inline-flex items-center gap-1.5 text-[14.5px] font-bold text-[#5929D6] hover:text-[#4D20BE] transition-colors duration-300 focus:outline-none focus-visible:underline ml-auto"
                        aria-label={`View details for ${job.title}`}
                      >
                        <span>View details</span>
                        <ArrowRight
                          className="w-4 h-4 stroke-[2.2] transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </div>

                  {/* ============================================================
                      3. MOBILE LAYOUT (< 640px): Compact Stacked Card Layout
                     ============================================================ */}
                  <div className="flex sm:hidden flex-col p-5 relative z-2">
                    {/* Top Row: Icon on left + Badge and Job Title stacked on right */}
                    <div className="flex items-start gap-3.5">
                      <div
                        className="w-12 h-12 rounded-2xl bg-[#EEE9FF] text-[#5929D6] flex items-center justify-center shrink-0 mt-0.5"
                        aria-hidden="true"
                      >
                        <CategoryIcon className="w-6 h-6 text-[#5929D6]" strokeWidth={2} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${typeBadgeClass}`}
                        >
                          {job.type || "Full-time"}
                        </span>

                        <h3 className="text-[16px] font-extrabold text-[#11152F] mt-1.5 group-hover:text-[#5929D6] group-focus-within:text-[#5929D6] transition-colors duration-300 tracking-tight leading-snug">
                          <Link
                            href={detailUrl}
                            className="focus:outline-none focus-visible:underline"
                          >
                            {job.title}
                          </Link>
                        </h3>
                      </div>
                    </div>

                    {/* Metadata on separate lines */}
                    <div className="mt-3.5 space-y-1.5 text-[12.5px] text-[#64748B] font-medium min-w-0">
                      <div className="flex items-center gap-2">
                        <Building2
                          className="w-3.5 h-3.5 text-[#64748B] shrink-0"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                        <span className="truncate">{departmentStr}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin
                          className="w-3.5 h-3.5 text-[#64748B] shrink-0"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                        <span className="truncate">{locationStr}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock
                          className="w-3.5 h-3.5 text-[#64748B] shrink-0"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                        <span className="truncate">{experienceStr}</span>
                      </div>
                    </div>

                    {/* Card Footer: Divider, Posted date on left, "View details →" on right */}
                    <div className="border-t border-[#ECE8FF] mt-4 pt-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
                      <div className="flex items-center gap-1.5 text-[12.5px] text-[#64748B] font-medium">
                        <Calendar
                          className="w-3.5 h-3.5 text-[#64748B] shrink-0"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                        <span>{postedStr}</span>
                      </div>

                      <Link
                        href={detailUrl}
                        className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#5929D6] hover:text-[#4D20BE] transition-colors duration-300 focus:outline-none focus-visible:underline ml-auto"
                        aria-label={`View details for ${job.title}`}
                      >
                        <span>View details</span>
                        <ArrowRight
                          className="w-4 h-4 stroke-[2.2] transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
          </div>
        )}
      </div>
    </section>
  );
}
