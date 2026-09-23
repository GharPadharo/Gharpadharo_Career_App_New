"use client";

import { useState, useMemo } from "react";
import { mockJobs } from "@/lib/mockJobs";
import JobFilters from "./JobFilters";
import JobCard from "./JobCard";

export default function JobListings() {
  const [selectedTeam, setSelectedTeam] = useState("All Teams");
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [sortBy, setSortBy] = useState("Most Recent");

  // Toggle helpers
  const handleJobTypeToggle = (type) => {
    setSelectedJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleExperienceToggle = (level) => {
    setSelectedExperience((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleResetFilters = () => {
    setSelectedTeam("All Teams");
    setSelectedJobTypes([]);
    setSelectedExperience([]);
  };

  // Filter and Sort Jobs
  const filteredAndSortedJobs = useMemo(() => {
    let result = mockJobs.filter((job) => {
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
        return (a.postedDays ?? a.daysAgo) - (b.postedDays ?? b.daysAgo);
      }
      if (sortBy === "Oldest") {
        return (b.postedDays ?? b.daysAgo) - (a.postedDays ?? a.daysAgo);
      }
      if (sortBy === "Job Title (A–Z)") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "Job Title (Z–A)") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

    return result;
  }, [selectedTeam, selectedJobTypes, selectedExperience, sortBy]);

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
            onTeamChange={setSelectedTeam}
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
                {filteredAndSortedJobs.length} job(s) available
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
                    onChange={(e) => setSortBy(e.target.value)}
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

            {/* Job Cards or Empty State */}
            {filteredAndSortedJobs.length > 0 ? (
              <div className="flex flex-col gap-4">
                {filteredAndSortedJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}

                {/* Pagination UI */}
                <nav
                  className="mt-10 flex items-center justify-center gap-2"
                  aria-label="Job listings pagination"
                >
                  {/* Previous button */}
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 text-xs font-semibold cursor-not-allowed select-none shadow-2xs"
                    aria-disabled="true"
                  >
                    <span aria-hidden="true">&lt;</span>
                    <span>Prev</span>
                  </button>

                  {/* Page 1 (Active) */}
                  <button
                    type="button"
                    aria-current="page"
                    className="w-8 h-8 rounded-lg bg-[#3b5ae8] text-white text-xs font-bold flex items-center justify-center shadow-xs"
                  >
                    1
                  </button>

                  {/* Page 2 (Inactive) */}
                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center transition-colors shadow-2xs"
                  >
                    2
                  </button>

                  {/* Next button */}
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>Next</span>
                    <span aria-hidden="true">&gt;</span>
                  </button>
                </nav>
              </div>
            ) : (
              /* Clean Empty State */
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
                  No jobs match your filters.
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your filters or clearing them to explore all
                  available opportunities.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn-primary mt-5 text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs"
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
