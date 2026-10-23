"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  Trash2,
  Briefcase,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import JobFilters from "./JobFilters";
import JobCard from "./JobCard";
import ScrollReveal from "@/components/common/ScrollReveal";

const PAGE_SIZE = 4;

/**
 * JobListings Component
 * 
 * Manages job filtering, sorting, pagination, and includes:
 * - State A: Dedicated centered card when 0 active jobs exist globally
 * - State B: Results toolbar + compact empty state when filters match none
 * - Error State: Clear error alert with retry button when API/DB fails
 * - Two-column layout with Filter Sidebar and Job Cards on light lavender-grey surface
 * - "Didn't find the right role?" Full-width purple CTA panel connecting to general application
 */
export default function JobListings({
  allJobs = [],
  searchQuery = "",
  onSearchChange,
  error = null,
  onRetry,
}) {
  const [selectedTeam, setSelectedTeam] = useState("All teams");
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [sortBy, setSortBy] = useState("Most Recent");
  const [currentPage, setCurrentPage] = useState(1);

  // Extract unique teams from active jobs for dynamic filter options
  const availableTeams = useMemo(() => {
    const teams = new Set();
    (allJobs || []).forEach((job) => {
      if (job.team) teams.add(job.team);
    });
    return Array.from(teams);
  }, [allJobs]);

  const handleTeamChange = (team) => {
    setSelectedTeam(team);
    setCurrentPage(1);
  };

  const handleJobTypeToggle = (type) => {
    setSelectedJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  const handleExperienceToggle = (level) => {
    setSelectedExperience((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedTeam("All teams");
    setSelectedJobTypes([]);
    setSelectedExperience([]);
    setCurrentPage(1);
    if (onSearchChange) {
      onSearchChange("");
    }
  };

  // Active filter chips (Team, Job Type, Experience, and Search Query)
  const activeChips = useMemo(() => {
    const chips = [];

    const isAll = selectedTeam === "All teams" || selectedTeam === "All Teams";
    if (selectedTeam && !isAll) {
      chips.push({
        id: `team-${selectedTeam}`,
        label: selectedTeam,
        onRemove: () => handleTeamChange("All teams"),
      });
    }

    selectedJobTypes.forEach((type) => {
      chips.push({
        id: `type-${type}`,
        label: type,
        onRemove: () => handleJobTypeToggle(type),
      });
    });

    selectedExperience.forEach((level) => {
      chips.push({
        id: `exp-${level}`,
        label: level,
        onRemove: () => handleExperienceToggle(level),
      });
    });

    if (searchQuery && searchQuery.trim() !== "") {
      chips.push({
        id: `search-${searchQuery.trim()}`,
        label: `"${searchQuery.trim()}"`,
        onRemove: () => {
          if (onSearchChange) onSearchChange("");
        },
      });
    }

    return chips;
  }, [selectedTeam, selectedJobTypes, selectedExperience, searchQuery, onSearchChange]);

  // Reset page when searchQuery prop changes externally
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);
  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    setCurrentPage(1);
  }

  // Active jobs filter
  const activeJobsList = useMemo(() => {
    return (allJobs || []).filter(
      (job) => (job.status || "active").toLowerCase() === "active"
    );
  }, [allJobs]);

  const hasActiveJobs = activeJobsList.length > 0;
  const isGlobalZeroOpenings = !error && !hasActiveJobs;

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  // Filter and Sort Jobs
  const filteredAndSortedJobs = useMemo(() => {
    if (isGlobalZeroOpenings) return [];

    let result = activeJobsList.filter((job) => {
      // Search query filter (matches title, team, location, description, or tags)
      if (searchQuery && searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = job.title?.toLowerCase().includes(q);
        const matchesTeam = job.team?.toLowerCase().includes(q);
        const matchesLocation = job.location?.toLowerCase().includes(q);
        const matchesDesc = job.description?.toLowerCase().includes(q);
        const matchesTags =
          Array.isArray(job.tags) &&
          job.tags.some((t) => t.toLowerCase().includes(q));

        if (!matchesTitle && !matchesTeam && !matchesLocation && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      // Team filter
      const isAllTeams = selectedTeam === "All teams" || selectedTeam === "All Teams";
      if (!isAllTeams && job.team !== selectedTeam) {
        return false;
      }

      // Job Type filter
      if (
        selectedJobTypes.length > 0 &&
        !selectedJobTypes.includes(job.type)
      ) {
        return false;
      }

      // Experience Level filter
      if (
        selectedExperience.length > 0 &&
        !selectedExperience.includes(job.experience)
      ) {
        return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "Most Recent") {
        return (a.postedDays ?? a.daysAgo ?? 0) - (b.postedDays ?? b.daysAgo ?? 0);
      }
      if (sortBy === "Oldest") {
        return (b.postedDays ?? b.daysAgo ?? 0) - (a.postedDays ?? a.daysAgo ?? 0);
      }
      if (sortBy === "Job Title (A–Z)") {
        return (a.title || "").localeCompare(b.title || "");
      }
      if (sortBy === "Job Title (Z–A)") {
        return (b.title || "").localeCompare(a.title || "");
      }
      return 0;
    });

    return result;
  }, [activeJobsList, isGlobalZeroOpenings, searchQuery, selectedTeam, selectedJobTypes, selectedExperience, sortBy]);

  // Pagination calculations: 4 jobs per page by default
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedJobs.length / PAGE_SIZE));

  // If filtered job count decreases and currentPage is out of bounds, automatically adjust during render
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedJobs = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredAndSortedJobs.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredAndSortedJobs, safeCurrentPage]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === safeCurrentPage) return;
    setCurrentPage(newPage);
    const openingsEl = document.getElementById("openings");
    if (openingsEl) {
      openingsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="openings"
      className="w-full bg-[#F8F7FC] py-10 sm:py-14 lg:py-18 border-b border-slate-200/60"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="sr-only">Available Job Positions</h2>

        {/* ============================================================
            1. MAIN CONTENT: ERROR vs NO OPENINGS (STATE A) vs LISTING (STATE B)
           ============================================================ */}
        {error ? (
          /* Error State: Failed to load jobs (Scenario 4) */
          <div className="w-full max-w-[680px] mx-auto bg-white rounded-2xl sm:rounded-3xl border border-red-100 p-8 sm:p-12 md:p-14 text-center shadow-[0_4px_24px_rgba(220,38,38,0.04)] my-4 sm:my-8">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-5 shadow-2xs">
              <AlertCircle className="w-6 h-6 text-red-600" aria-hidden="true" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#11152F] tracking-tight">
              Unable to load job openings
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] mt-2.5 mb-7 max-w-md mx-auto leading-relaxed">
              We encountered an issue retrieving the latest opportunities. Please check your connection and try again.
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center justify-center gap-2 bg-[#5929D6] hover:bg-[#4D20BE] active:bg-[#3F189F] active:scale-[0.98] text-white text-sm sm:text-base font-semibold px-6 sm:px-7 py-3 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-2"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>Try again</span>
            </button>
          </div>
        ) : isGlobalZeroOpenings ? (
          /* State A: Genuinely zero active jobs exist (Screenshot 1) */
          <div className="w-full max-w-[700px] mx-auto bg-white rounded-2xl sm:rounded-3xl border border-[#E8E3F2] p-8 sm:p-12 md:p-14 text-center shadow-[0_4px_24px_rgba(89,41,214,0.04)] my-4 sm:my-8">
            <div className="w-14 h-14 rounded-2xl bg-[#F0EBFF] text-[#5929D6] flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-2xs">
              <Briefcase className="w-6 h-6 text-[#5929D6]" aria-hidden="true" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#11152F] tracking-tight">
              No open positions right now
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] mt-3 mb-8 max-w-lg mx-auto leading-relaxed">
              We don&apos;t have any open roles at the moment. You can still share your resume and we&apos;ll keep you in mind for future opportunities.
            </p>
            <Link
              href="/jobs/general-application"
              className="inline-flex items-center justify-center gap-2 bg-[#4D2BD6] hover:bg-[#3F1FA8] active:bg-[#351890] active:scale-[0.98] text-white text-sm sm:text-base font-bold px-7 py-3.5 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4D2BD6] focus-visible:ring-offset-2"
            >
              <span>Submit Your Resume</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        ) : (
          /* Normal Listing / State B (Screenshot 2): Jobs exist in database */
          <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Filter Sidebar */}
          <ScrollReveal variant="fade-up" className="w-full lg:w-auto">
            <JobFilters
              selectedTeam={selectedTeam}
              selectedJobTypes={selectedJobTypes}
              selectedExperience={selectedExperience}
              availableTeams={availableTeams}
              onTeamChange={handleTeamChange}
              onJobTypeToggle={handleJobTypeToggle}
              onExperienceToggle={handleExperienceToggle}
              onResetFilters={handleResetFilters}
            />
          </ScrollReveal>

          {/* Right Column: Results Area */}
          <div className="flex-1 w-full min-w-0">
            {/* Top Toolbar: Count + Sort */}
            <ScrollReveal variant="fade-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:min-h-10">
                <p className="text-sm font-medium text-[#64748B]">
                  <strong className="text-[#11152F] font-bold">
                    {filteredAndSortedJobs.length} {filteredAndSortedJobs.length === 1 ? "job" : "jobs"}
                  </strong>{" "}
                  found
                </p>

                {/* Sort by dropdown */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <label
                    htmlFor="job-sort-select"
                    className="text-xs sm:text-sm text-[#64748B] font-medium whitespace-nowrap"
                  >
                    Sort by
                  </label>
                  <div className="relative">
                    <select
                      id="job-sort-select"
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="h-10 pl-3 pr-8 rounded-xl border border-[#E8E3F2] text-xs sm:text-sm bg-white text-[#11152F] font-medium outline-none cursor-pointer focus:border-[#5929D6] focus:ring-2 focus:ring-[#5929D6]/15 appearance-none shadow-2xs"
                    >
                      <option value="Most Recent">Most recent</option>
                      <option value="Oldest">Oldest</option>
                      <option value="Job Title (A–Z)">Job Title (A–Z)</option>
                      <option value="Job Title (Z–A)">Job Title (Z–A)</option>
                    </select>
                    <svg
                      className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Active Filter Chips */}
            {activeChips.length > 0 && (
              <div
                className="flex flex-wrap items-center gap-2 mb-5"
                aria-label="Active filters"
              >
                {activeChips.map((chip) => (
                  <span
                    key={chip.id}
                    className="inline-flex items-center gap-1.5 bg-[#F0EBFF] border border-[#DDD6FE] text-[#5929D6] text-xs font-semibold px-2.5 py-1 rounded-full shadow-2xs transition-all duration-150"
                  >
                    <span>{chip.label}</span>
                    <button
                      type="button"
                      onClick={chip.onRemove}
                      aria-label={`Remove filter ${chip.label}`}
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[#5929D6]/80 hover:bg-[#5929D6] hover:text-white transition-colors cursor-pointer focus:outline-none"
                    >
                      <X className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </span>
                ))}

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5929D6] hover:text-[#4D20BE] hover:underline transition-colors cursor-pointer py-1 px-1 focus:outline-none"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Clear all</span>
                </button>
              </div>
            )}

            {/* Job Cards or Zero Results State */}
            {filteredAndSortedJobs.length > 0 ? (
              <div className="flex flex-col gap-4 sm:gap-5">
                {paginatedJobs.map((job, idx) => (
                  <ScrollReveal key={job.id} variant="fade-up" delay={idx * 50}>
                    <JobCard job={job} />
                  </ScrollReveal>
                ))}

                {/* Pagination Controls: displayed only if matching jobs exceed PAGE_SIZE (4) */}
                {filteredAndSortedJobs.length > PAGE_SIZE && (
                  <nav
                    className="mt-8 pt-3 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap"
                    aria-label="Job listings pagination"
                  >
                    {/* Previous Button */}
                    <button
                      type="button"
                      disabled={safeCurrentPage === 1}
                      onClick={() => handlePageChange(safeCurrentPage - 1)}
                      aria-label="Previous page"
                      className={
                        safeCurrentPage === 1
                          ? "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-300 text-xs sm:text-sm font-semibold cursor-not-allowed select-none transition-colors"
                          : "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E8E3F2] bg-white text-slate-700 hover:bg-[#F0EBFF] hover:text-[#5929D6] hover:border-[#D5CAFA] text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-1"
                      }
                      aria-disabled={safeCurrentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Previous</span>
                    </button>

                    {/* Numbered Page Buttons */}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                        const isActive = p === safeCurrentPage;
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => handlePageChange(p)}
                            aria-current={isActive ? "page" : undefined}
                            aria-label={`Page ${p}`}
                            className={
                              isActive
                                ? "w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#5929D6] text-white text-xs sm:text-sm font-bold flex items-center justify-center shadow-xs border border-[#5929D6] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-1"
                                : "w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-[#E8E3F2] bg-white text-slate-700 hover:bg-[#F0EBFF] hover:text-[#5929D6] hover:border-[#D5CAFA] text-xs sm:text-sm font-semibold flex items-center justify-center transition-all duration-150 cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-1"
                            }
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      type="button"
                      disabled={safeCurrentPage === totalPages}
                      onClick={() => handlePageChange(safeCurrentPage + 1)}
                      aria-label="Next page"
                      className={
                        safeCurrentPage === totalPages
                          ? "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-300 text-xs sm:text-sm font-semibold cursor-not-allowed select-none transition-colors"
                          : "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E8E3F2] bg-white text-slate-700 hover:bg-[#F0EBFF] hover:text-[#5929D6] hover:border-[#D5CAFA] text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-1"
                      }
                      aria-disabled={safeCurrentPage === totalPages}
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                    </button>
                  </nav>
                )}
              </div>
            ) : (
              /* Compact Redesigned Empty State */
              <div className="bg-white rounded-2xl border border-[#E8E3F2] p-8 sm:p-10 text-center shadow-xs max-w-md mx-auto">
                <div className="w-12 h-12 rounded-full bg-[#F0EBFF] text-[#5929D6] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-5 h-5 text-[#5929D6]" aria-hidden="true" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#11152F] tracking-tight">
                  No matching jobs found
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 mb-6 max-w-sm mx-auto leading-relaxed">
                  Try removing a filter or changing your search to discover more opportunities.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="w-full sm:w-auto inline-flex items-center justify-center bg-[#5929D6] hover:bg-[#4D20BE] active:bg-[#3F189F] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-2"
                  >
                    Clear all filters
                  </button>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs sm:text-sm font-semibold text-[#5929D6] hover:text-[#4D20BE] hover:underline transition-colors py-2 px-3 cursor-pointer focus:outline-none"
                  >
                    Browse all jobs
                  </button>
                </div>
              </div>
            )}

            {/* Resume Submission CTA (Aligned with Job Listing Cards) */}
            <div className="mt-8 sm:mt-10 lg:mt-12">
              <div className="w-full bg-[#4D2BD6] rounded-2xl sm:rounded-3xl p-7 sm:p-9 lg:p-11 shadow-[0_12px_36px_rgba(77,43,214,0.25)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1.5 sm:space-y-2 max-w-xl text-left">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Didn&apos;t find the right role?
                  </h2>
                  <p className="text-sm sm:text-base text-white/85 font-normal leading-relaxed">
                    Share your resume and we&apos;ll reach out when a fit opens up.
                  </p>
                </div>

                <div className="shrink-0">
                  <Link
                    href="/jobs/general-application"
                    className="inline-flex items-center justify-center bg-white hover:bg-slate-50 text-[#4D2BD6] text-sm sm:text-base font-bold px-6 sm:px-7 py-3 rounded-xl shadow-xs transition-all duration-200 active:scale-95"
                  >
                    <span>Submit your resume</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </section>
  );
}
