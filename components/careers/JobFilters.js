"use client";

import { useState } from "react";
import { Sliders, ChevronDown } from "lucide-react";

const DEFAULT_TEAMS = [
  "All teams",
  "Technology",
  "Product Management",
  "Design",
  "Operations",
  "Marketing",
  "Sales",
  "Data Science",
];

const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract"];

const EXPERIENCE_LEVELS = [
  "Fresher (0–1 years)",
  "Mid-level (2–5 years)",
  "Senior (5+ years)",
];

export default function JobFilters({
  selectedTeam = "All teams",
  selectedJobTypes = [],
  selectedExperience = [],
  availableTeams = [],
  onTeamChange,
  onJobTypeToggle,
  onExperienceToggle,
  onResetFilters,
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Combine default teams with any unique teams from database
  const teamsList = [
    "All Teams",
    ...Array.from(
      new Set([
        ...(availableTeams.length > 0 ? availableTeams : DEFAULT_TEAMS.slice(1)),
        ...DEFAULT_TEAMS.slice(1),
      ])
    ).filter((t) => t.toLowerCase() !== "all teams"),
  ];

  const isAllTeams = !selectedTeam || selectedTeam === "All teams" || selectedTeam === "All Teams";
  const activeFilterCount =
    (!isAllTeams ? 1 : 0) +
    selectedJobTypes.length +
    selectedExperience.length;

  return (
    <aside className="w-full lg:w-64 xl:w-72 shrink-0">
      {/* Mobile Toggle Button (< 1024px) */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="w-full flex items-center justify-between p-3.5 bg-white border border-[#E8E3F2] rounded-xl shadow-xs text-sm font-bold text-[#11152F] focus:outline-none focus:ring-2 focus:ring-[#5929D6]/20 cursor-pointer"
          aria-expanded={isMobileOpen}
          aria-controls="filters-content"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-700" aria-hidden="true" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-[#5929D6] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>
          <span className="text-xs text-[#5929D6] font-semibold">
            {isMobileOpen ? "Hide" : "Show"}
          </span>
        </button>
      </div>

      {/* Filter Sidebar Card (Matches Reference Image) */}
      <div
        id="filters-content"
        className={`bg-white rounded-2xl border border-[#E8E3F2] p-5 sm:p-6 shadow-[0_2px_12px_rgba(89,41,214,0.03)] ${
          isMobileOpen ? "block" : "hidden lg:block"
        }`}
      >
        {/* Header: Sliders icon + "Filters" and "Clear All" */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-slate-800" aria-hidden="true" />
            <h2 className="text-[#11152F] font-bold text-base tracking-tight">
              Filters
            </h2>
          </div>

          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-[#5929D6] hover:text-[#4D20BE] hover:underline transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6]/30 rounded px-1"
          >
            Clear All
          </button>
        </div>

        {/* Section 1: Team */}
        <div className="mt-5">
          <label
            htmlFor="filter-team"
            className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5"
          >
            TEAM
          </label>
          <div className="relative">
            <select
              id="filter-team"
              value={isAllTeams ? "All Teams" : selectedTeam}
              onChange={(e) =>
                onTeamChange(e.target.value === "All Teams" ? "All teams" : e.target.value)
              }
              className="w-full h-10 pl-3.5 pr-8 rounded-xl border border-[#E8E3F2] text-xs sm:text-sm bg-white text-slate-700 font-medium outline-none focus:border-[#5929D6] focus:ring-2 focus:ring-[#5929D6]/15 appearance-none cursor-pointer"
            >
              {teamsList.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
            <ChevronDown
              className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Section 2: Job Type (Always Expanded) */}
        <div className="mt-6">
          <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            JOB TYPE
          </span>
          <div className="space-y-2.5">
            {JOB_TYPES.map((type) => {
              const isChecked = selectedJobTypes.includes(type);
              const inputId = `filter-job-type-${type.toLowerCase().replace(/\s+/g, "-")}`;
              return (
                <label
                  key={type}
                  htmlFor={inputId}
                  className="flex items-center gap-3 text-sm text-slate-700 hover:text-slate-900 cursor-pointer select-none font-medium transition-colors"
                >
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onJobTypeToggle(type)}
                    className="w-4 h-4 rounded border-slate-300 text-[#5929D6] accent-[#5929D6] focus:ring-[#5929D6]/20 cursor-pointer"
                  />
                  <span>{type}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Section 3: Experience Level (Always Expanded) */}
        <div className="mt-6">
          <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            EXPERIENCE LEVEL
          </span>
          <div className="space-y-2.5">
            {EXPERIENCE_LEVELS.map((level) => {
              const isChecked = selectedExperience.includes(level);
              const inputId = `filter-exp-${level.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
              return (
                <label
                  key={level}
                  htmlFor={inputId}
                  className="flex items-center gap-3 text-sm text-slate-700 hover:text-slate-900 cursor-pointer select-none font-medium transition-colors"
                >
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onExperienceToggle(level)}
                    className="w-4 h-4 rounded border-slate-300 text-[#5929D6] accent-[#5929D6] focus:ring-[#5929D6]/20 cursor-pointer"
                  />
                  <span>{level}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Reset Filters Outlined Button */}
        <button
          type="button"
          onClick={onResetFilters}
          className="w-full mt-6 py-2.5 px-4 rounded-xl border border-[#E8E3F2] bg-white text-[#5929D6] hover:bg-[#F0EBFF] hover:border-[#D5CAFA] text-sm font-semibold transition-all duration-200 text-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6]/30 active:scale-[0.99]"
        >
          Reset Filters
        </button>
      </div>
    </aside>
  );
}
