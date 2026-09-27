"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { mockJobs as defaultMockJobs } from "@/lib/mockJobs";
import JobFilters from "./JobFilters";
import JobCard from "./JobCard";

const PAGE_SIZE = 4;

/**
 * JobListings Component
 * 
 * Manages job filtering, sorting, client-side pagination, and distinct empty states:
 * - State A: Search/Filter returns zero matches (Clear Filters CTA)
 * - State B: Global zero available openings (Explore Life at GharPadharo CTA)
 */
export default function JobListings({
  allJobs = defaultMockJobs,
  searchQuery = "",
  onSearchChange,
}) {
  const [selectedTeam, setSelectedTeam] = useState("All Teams");
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [sortBy, setSortBy] = useState("Most Recent");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination to page 1 on any filter, search, or sort modification
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
    setSelectedTeam("All Teams");
    setSelectedJobTypes([]);
    setSelectedExperience([]);
    setCurrentPage(1);
    if (onSearchChange) {
      onSearchChange("");
    }
  };

  // Reset page when searchQuery prop changes externally
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Global Zero Openings Check (Only active jobs are publicly visible)
  const activeJobsList = useMemo(() => {
    return (allJobs || []).filter((job) => (job.status || "active").toLowerCase() === "active");
  }, [allJobs]);

  const isGlobalZeroOpenings = activeJobsList.length === 0;

  // Filter and Sort Jobs (Applied before pagination)
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
      if (selectedTeam !== "All Teams" && job.team !== selectedTeam) {
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
  }, [allJobs, isGlobalZeroOpenings, searchQuery, selectedTeam, selectedJobTypes, selectedExperience, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedJobs.length / PAGE_SIZE);

  // Guard against invalid current page if filtered results shrank
  const activePage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));

  const paginatedJobs = useMemo(() => {
    const startIndex = (activePage - 1) * PAGE_SIZE;
    return filteredAndSortedJobs.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredAndSortedJobs, activePage]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === activePage) return;
    setCurrentPage(newPage);
    const openingsEl = document.getElementById("openings");
    if (openingsEl) {
      openingsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ========================================================
  // STATE B: GLOBAL ZERO OPENINGS STATE (Dataset empty)
  // ========================================================
  if (isGlobalZeroOpenings) {
    return (
      <section
        id="openings"
        className="w-full bg-slate-50/50 py-16 lg:py-24 border-b border-slate-200/60"
      >
        <div className="container-custom">
          <div className="w-full max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-14 shadow-xs space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#525599]/10 text-primary mx-auto flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-[#525599]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-heading tracking-tight">
                No open positions right now
              </h2>

              <p className="text-sm sm:text-base text-body leading-relaxed max-w-lg mx-auto font-normal">
                We don&apos;t have any open positions at the moment, but we&apos;re always looking for great people to join GharPadharo.
              </p>

              <div className="pt-2 flex justify-center">
                <Link
                  href="/life-at-gharpadharo"
                  className="inline-flex items-center gap-2 bg-[#525599] hover:bg-[#46477f] text-white text-sm sm:text-base font-semibold px-6 py-3.5 rounded-xl shadow-xs transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <span>Explore Life at GharPadharo</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ========================================================
  // NORMAL LAYOUT: FILTER SIDEBAR + RESULTS / PAGINATION
  // ========================================================
  return (
    <section
      id="openings"
      className="w-full bg-slate-50/50 py-10 lg:py-14 border-b border-slate-200/60"
    >
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Filter Sidebar */}
          <JobFilters
            selectedTeam={selectedTeam}
            selectedJobTypes={selectedJobTypes}
            selectedExperience={selectedExperience}
            onTeamChange={handleTeamChange}
            onJobTypeToggle={handleJobTypeToggle}
            onExperienceToggle={handleExperienceToggle}
            onResetFilters={handleResetFilters}
          />

          {/* Results Area */}
          <div className="flex-1 w-full min-w-0">
            <h2 className="sr-only">Available Job Positions</h2>

            {/* Top Toolbar: Count + Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <p className="text-sm font-bold text-slate-800">
                {filteredAndSortedJobs.length > 0
                  ? `${filteredAndSortedJobs.length} job(s) available`
                  : "0 jobs found"}
              </p>

              {/* Sort by dropdown */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <label
                  htmlFor="job-sort-select"
                  className="text-xs text-slate-500 font-medium whitespace-nowrap"
                >
                  Sort by:
                </label>
                <div className="relative">
                  <select
                    id="job-sort-select"
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="h-9 pl-3 pr-8 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white text-slate-700 font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer shadow-2xs"
                  >
                    <option value="Most Recent">Most Recent</option>
                    <option value="Oldest">Oldest</option>
                    <option value="Job Title (A–Z)">Job Title (A–Z)</option>
                    <option value="Job Title (Z–A)">Job Title (Z–A)</option>
                  </select>
                  <svg
                    className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
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

            {/* Job Cards or STATE A: Zero Matches after Filtering */}
            {filteredAndSortedJobs.length > 0 ? (
              <div className="flex flex-col gap-4">
                {paginatedJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}

                {/* Pagination UI — Visible only when more than 1 page exists */}
                {totalPages > 1 && (
                  <nav
                    className="mt-10 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap"
                    aria-label="Job listings pagination"
                  >
                    {/* Previous button */}
                    <button
                      type="button"
                      disabled={activePage === 1}
                      onClick={() => handlePageChange(activePage - 1)}
                      className={
                        activePage === 1
                          ? "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 text-xs font-semibold cursor-not-allowed select-none shadow-2xs"
                          : "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-primary text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                      }
                      aria-disabled={activePage === 1}
                    >
                      <span aria-hidden="true">&lt;</span>
                      <span>Prev</span>
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                      const isActive = p === activePage;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePageChange(p)}
                          aria-current={isActive ? "page" : undefined}
                          className={
                            isActive
                              ? "w-8 h-8 rounded-lg bg-[#525599] hover:bg-[#46477f] text-white text-xs font-bold flex items-center justify-center shadow-xs border border-[#525599] transition-colors"
                              : "w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                          }
                        >
                          {p}
                        </button>
                      );
                    })}

                    {/* Next button */}
                    <button
                      type="button"
                      disabled={activePage === totalPages}
                      onClick={() => handlePageChange(activePage + 1)}
                      className={
                        activePage === totalPages
                          ? "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 text-xs font-semibold cursor-not-allowed select-none shadow-2xs"
                          : "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-primary text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                      }
                      aria-disabled={activePage === totalPages}
                    >
                      <span>Next</span>
                      <span aria-hidden="true">&gt;</span>
                    </button>
                  </nav>
                )}
              </div>
            ) : (
              /* STATE A: Search / Filter Zero Results State */
              <div className="bg-white rounded-2xl border border-slate-200/80 p-10 sm:p-14 text-center shadow-xs">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  No jobs found
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your search or filters to explore all available
                  opportunities.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-5 inline-flex items-center gap-2 bg-[#525599] hover:bg-[#46477f] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
