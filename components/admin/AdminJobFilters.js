"use client";

/**
 * AdminJobFilters Component
 * 
 * Coherent, visually balanced filter toolbar for the Job Management workspace:
 * - Search input: [ Search jobs by title or keyword... ] (Flexible / flex-1, h-11 / 44px)
 * - Status filter: [ All Status ▼ ] (Equal 220px fixed desktop width, h-11 / 44px)
 * - Team filter: [ All Teams ▼ ] (Equal 220px fixed desktop width, h-11 / 44px)
 * - Derived job count display with reset action when active
 */
export default function AdminJobFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedTeam,
  onTeamChange,
  teams = [],
  totalCount = 0,
  filteredCount = 0,
  onClearFilters,
}) {
  const isFiltered = Boolean(
    searchTerm.trim() ||
      (selectedStatus && selectedStatus.toLowerCase() !== "all") ||
      (selectedTeam && selectedTeam.toLowerCase() !== "all")
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs space-y-3">
      {/* Controls Row: Responsive 2-column Grid on Mobile, Flex on Desktop */}
      <div className="grid grid-cols-2 md:flex md:items-center gap-3">
        {/* 1. Search Input: Spans 2 cols on mobile (100%), flex-1 on desktop */}
        <div className="col-span-2 md:col-auto md:flex-1 relative">
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search jobs by title or keyword..."
            className="w-full h-11 pl-10 pr-9 bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-200/90 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs transition-colors"
            aria-label="Search jobs by title or keyword"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer"
              aria-label="Clear search input"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* 2. Status Dropdown: 50% width on mobile (col-span-1), 220px on desktop */}
        <div className="col-span-1 md:col-auto relative w-full md:w-[220px] md:shrink-0">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full h-11 appearance-none bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-200/90 rounded-xl pl-3.5 pr-9 text-sm font-medium text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer transition-colors [&::-ms-expand]:hidden"
            aria-label="Filter by Status"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* 3. Team Dropdown: 50% width on mobile (col-span-1), 220px on desktop */}
        <div className="col-span-1 md:col-auto relative w-full md:w-[220px] md:shrink-0">
          <select
            value={selectedTeam}
            onChange={(e) => onTeamChange(e.target.value)}
            className="w-full h-11 appearance-none bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-200/90 rounded-xl pl-3.5 pr-9 text-sm font-medium text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer transition-colors [&::-ms-expand]:hidden truncate"
            aria-label="Filter by Team"
          >
            <option value="All">All Teams</option>
            {teams.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Sub-bar: Count & Clear Filters Indicator */}
      <div className="flex items-center justify-between text-xs text-muted pt-2 px-1 border-t border-slate-100">
        <span className="font-semibold text-slate-600">
          {isFiltered
            ? `${filteredCount} ${filteredCount === 1 ? "job" : "jobs"} found`
            : `${totalCount} ${totalCount === 1 ? "job" : "jobs"}`}
        </span>

        {isFiltered && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-semibold text-primary hover:text-[#46477f] hover:underline cursor-pointer transition-colors focus-visible:outline-none focus-visible:underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
