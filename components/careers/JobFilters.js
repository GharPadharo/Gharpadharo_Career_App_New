"use client";

import { useState } from "react";

const TEAMS = [
  "All Teams",
  "Technology",
  "Product Management",
  "Operations",
  "Marketing",
  "Data Science",
];

const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract"];

const EXPERIENCE_LEVELS = [
  "Fresher (0–1 years)",
  "Mid-level (2–5 years)",
  "Senior (5+ years)",
];

export default function JobFilters({
  selectedTeam,
  selectedJobTypes,
  selectedExperience,
  onTeamChange,
  onJobTypeToggle,
  onExperienceToggle,
  onResetFilters,
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const activeFilterCount =
    (selectedTeam !== "All Teams" ? 1 : 0) +
    selectedJobTypes.length +
    selectedExperience.length;

  return (
    <aside className="w-full lg:w-64 shrink-0">
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="w-full flex items-center justify-between p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-xs text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-expanded={isMobileOpen}
          aria-controls="filters-content"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>
          <span className="text-xs text-primary font-semibold">
            {isMobileOpen ? "Hide" : "Show"}
          </span>
        </button>
      </div>

      {/* Filter Sidebar Card */}
      <div
        id="filters-content"
        className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all ${
          isMobileOpen ? "block" : "hidden lg:block"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <h2 className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
            <svg
              className="w-4 h-4 text-slate-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <span>Filters</span>
          </h2>

          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer focus:outline-none focus:underline"
          >
            Clear All
          </button>
        </div>

        {/* Section 1: Team */}
        <div className="mt-4">
          <label
            htmlFor="filter-team"
            className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2"
          >
            Team
          </label>
          <div className="relative">
            <select
              id="filter-team"
              value={selectedTeam}
              onChange={(e) => onTeamChange(e.target.value)}
              className="w-full h-10 pl-3 pr-8 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
            >
              {TEAMS.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
            <svg
              className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
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

        {/* Section 2: Job Type */}
        <fieldset className="mt-6">
          <legend className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
            Job Type
          </legend>
          <div className="space-y-2">
            {JOB_TYPES.map((type) => {
              const isChecked = selectedJobTypes.includes(type);
              const inputId = `filter-job-type-${type.toLowerCase().replace(/\s+/g, "-")}`;
              return (
                <label
                  key={type}
                  htmlFor={inputId}
                  className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer select-none hover:text-slate-900"
                >
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onJobTypeToggle(type)}
                    className="w-4 h-4 rounded border-slate-300 text-primary accent-primary focus:ring-primary/20 cursor-pointer"
                  />
                  <span>{type}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Section 3: Experience Level */}
        <fieldset className="mt-6">
          <legend className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
            Experience Level
          </legend>
          <div className="space-y-2">
            {EXPERIENCE_LEVELS.map((level) => {
              const isChecked = selectedExperience.includes(level);
              const inputId = `filter-exp-${level.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
              return (
                <label
                  key={level}
                  htmlFor={inputId}
                  className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer select-none hover:text-slate-900"
                >
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onExperienceToggle(level)}
                    className="w-4 h-4 rounded border-slate-300 text-primary accent-primary focus:ring-primary/20 cursor-pointer"
                  />
                  <span>{level}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Reset Filters CTA */}
        <button
          type="button"
          onClick={onResetFilters}
          className="w-full mt-6 py-2.5 px-4 rounded-xl border border-primary/30 text-primary hover:bg-primary/5 text-xs sm:text-sm font-semibold transition-colors duration-200 text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          Reset Filters
        </button>
      </div>
    </aside>
  );
}
