"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdminJobFilters from "./AdminJobFilters";

/**
 * AdminJobTable Component
 * 
 * Polished internal job-management workspace:
 * - Desktop: Density-optimized, readable management table (~64–76px row height)
 * - Mobile: Clean stacked cards for viewport < md
 * - Columns: JOB, TEAM, LOCATION, TYPE, EXPERIENCE, STATUS, POSTED, ACTIONS
 * - Actions:
 *   * Edit: /admin/dashboard/jobs/[id]/edit
 *   * Preview: /jobs/[id] (target="_blank", rel="noopener noreferrer")
 *   * Delete: Frontend confirmation modal ("Delete job?" / "Delete Job")
 * - Filter Toolbar: Search, Status (Active, Draft, Closed), Team, and derived Job Count
 * - Empty States:
 *   * Search empty: "No jobs found" + "Clear Filters"
 *   * Table empty: "No jobs available" + "Add New Job"
 */
export default function AdminJobTable({ initialJobs = [], hideHeader = false }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Extract distinct teams from currently loaded jobs
  const teams = useMemo(() => {
    return Array.from(new Set(initialJobs.map((j) => j.team))).filter(Boolean);
  }, [initialJobs]);

  // Frontend filter logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Status filter logic (active, draft, closed)
      const jobStatus = (job.status || "active").toLowerCase();
      const matchesStatus =
        selectedStatus === "all" ||
        selectedStatus === "All" ||
        jobStatus === selectedStatus.toLowerCase();

      // Team filter
      const matchesTeam =
        selectedTeam === "All" || selectedTeam === "all" || job.team === selectedTeam;

      // Search term filter across title, team, location, and description
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.team.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query);

      return matchesStatus && matchesTeam && matchesSearch;
    });
  }, [jobs, searchTerm, selectedStatus, selectedTeam]);

  // Reset all active filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setSelectedTeam("All");
  };

  // Database-backed delete confirmation handler
  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const identifier = jobToDelete.slug || jobToDelete.id;
      const res = await fetch(`/api/admin/jobs/${identifier}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete job.");
      }

      setJobs((prev) => prev.filter((j) => j.id !== jobToDelete.id && j.slug !== jobToDelete.slug));
      setJobToDelete(null);
    } catch (err) {
      console.error("Delete job error:", err);
      setDeleteError(err.message || "An unexpected error occurred while deleting the job.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper for rendering status badges
  const renderStatusBadge = (status) => {
    const s = (status || "active").toLowerCase();
    if (s === "draft") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
          Draft
        </span>
      );
    }
    if (s === "closed") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" aria-hidden="true" />
          Closed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
        Active
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Optional Top Section Header (when not already provided by page) */}
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-heading tracking-tight">
              Jobs
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-0.5">
              Create, edit and manage the positions shown on the GharPadharo careers site.
            </p>
          </div>

          <Link
            href="/admin/dashboard/jobs/new"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-[#46477f] text-white text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Job</span>
          </Link>
        </div>
      )}

      {/* Filter Toolbar with Search, Status, Team & Derived Count */}
      <AdminJobFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedTeam={selectedTeam}
        onTeamChange={setSelectedTeam}
        teams={teams}
        totalCount={jobs.length}
        filteredCount={filteredJobs.length}
        onClearFilters={handleClearFilters}
      />

      {/* Main Table / Empty State Container */}
      <div className="bg-card rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {jobs.length === 0 ? (
          /* Table Empty State (Genuinely no jobs in system) */
          <div className="py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4 shadow-2xs">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.75"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-heading">No jobs available</h3>
            <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
              There are no career openings to manage right now.
            </p>
            <div className="mt-5">
              <Link
                href="/admin/dashboard/jobs/new"
                className="inline-flex items-center gap-2 bg-primary hover:bg-[#46477f] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add New Job</span>
              </Link>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          /* Search / Filter Empty State */
          <div className="py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4 shadow-2xs">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.75"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-heading">No jobs found</h3>
            <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
              Try adjusting your search or filters to find a matching position.
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-2xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View (hidden on screens < md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold text-muted uppercase tracking-wider">
                    <th scope="col" className="py-3.5 px-4 lg:px-6 w-[34%]">Job</th>
                    <th scope="col" className="py-3.5 px-4 w-[18%]">Team</th>
                    <th scope="col" className="py-3.5 px-4 w-[14%]">Experience</th>
                    <th scope="col" className="py-3.5 px-4 w-[12%]">Status</th>
                    <th scope="col" className="py-3.5 px-4 w-[10%]">Posted</th>
                    <th scope="col" className="py-3.5 px-4 lg:px-6 text-right w-[12%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* JOB Column: Strong title with supporting Location · Type metadata */}
                      <td className="py-4 px-4 lg:px-6">
                        <div className="min-w-0 pr-2">
                          <Link
                            href={`/admin/dashboard/jobs/${job.id}/edit`}
                            className="font-bold text-slate-900 text-sm sm:text-[15px] hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline leading-snug block truncate"
                          >
                            {job.title}
                          </Link>
                          <span className="block text-xs text-slate-500 mt-1 truncate font-normal">
                            {job.location} &bull; {job.type}
                          </span>
                        </div>
                      </td>

                      {/* TEAM */}
                      <td className="py-4 px-4 text-slate-700 font-medium whitespace-nowrap">
                        {job.team}
                      </td>

                      {/* EXPERIENCE */}
                      <td className="py-4 px-4 text-slate-600 text-sm whitespace-nowrap">
                        {job.experience}
                      </td>

                      {/* STATUS */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {renderStatusBadge(job.status)}
                      </td>

                      {/* POSTED */}
                      <td className="py-4 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {job.postedText}
                      </td>

                      {/* ACTIONS: Edit · Preview · Delete */}
                      <td className="py-4 px-4 lg:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2.5 text-xs font-semibold">
                          {/* Primary Action: Edit */}
                          <Link
                            href={`/admin/dashboard/jobs/${job.id}/edit`}
                            className="text-primary hover:text-[#46477f] transition-colors focus-visible:outline-none focus-visible:underline"
                            aria-label={`Edit ${job.title}`}
                          >
                            Edit
                          </Link>

                          <span className="text-slate-300" aria-hidden="true">&bull;</span>

                          {/* Secondary Action: Preview */}
                          <Link
                            href={`/jobs/${job.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-slate-800 transition-colors focus-visible:outline-none focus-visible:underline inline-flex items-center gap-1 group"
                            aria-label={
                              (job.status || "active").toLowerCase() === "draft"
                                ? `Preview draft job: ${job.title}`
                                : (job.status || "active").toLowerCase() === "closed"
                                ? `Preview closed job: ${job.title}`
                                : `Preview active job: ${job.title} on careers portal (opens in new tab)`
                            }
                          >
                            <span>Preview</span>
                            <svg
                              className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </Link>

                          <span className="text-slate-300" aria-hidden="true">&bull;</span>

                          {/* Destructive Action: Delete */}
                          <button
                            type="button"
                            onClick={() => setJobToDelete(job)}
                            className="text-red-600 hover:text-red-700 transition-colors focus-visible:outline-none focus-visible:underline cursor-pointer"
                            aria-label={`Delete ${job.title}`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards (visible only on screens < md) */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredJobs.map((job) => (
                <div key={job.id} className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-heading">
                        <Link
                          href={`/admin/dashboard/jobs/${job.id}/edit`}
                          className="hover:text-primary transition-colors"
                        >
                          {job.title}
                        </Link>
                      </h3>
                      <p className="text-xs font-medium text-slate-600 mt-0.5">
                        {job.team} &bull; {job.location}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {renderStatusBadge(job.status)}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {job.type}
                    </span>
                    <span>{job.experience}</span>
                    <span aria-hidden="true">&bull;</span>
                    <span>{job.postedText}</span>
                  </div>

                  {/* Mobile Actions: Edit · Preview · Delete */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-end gap-3 text-xs font-semibold">
                    <Link
                      href={`/admin/dashboard/jobs/${job.id}/edit`}
                      className="text-primary hover:text-[#46477f] transition-colors"
                    >
                      Edit
                    </Link>

                    <span className="text-slate-300" aria-hidden="true">&bull;</span>

                    <Link
                      href={`/jobs/${job.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1 group"
                      aria-label={
                        (job.status || "active").toLowerCase() === "draft"
                          ? `Preview draft job: ${job.title}`
                          : (job.status || "active").toLowerCase() === "closed"
                          ? `Preview closed job: ${job.title}`
                          : `Preview active job: ${job.title} on careers portal`
                      }
                    >
                      <span>Preview</span>
                      <svg
                        className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </Link>

                    <span className="text-slate-300" aria-hidden="true">&bull;</span>

                    <button
                      type="button"
                      onClick={() => setJobToDelete(job)}
                      className="text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 shadow-xl space-y-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
          >
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <div>
              <h3 id="delete-dialog-title" className="text-lg font-bold text-heading">
                Delete job?
              </h3>
              <p className="text-sm text-muted mt-1 leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-800">{jobToDelete.title}</strong>? This action will permanently remove the job from the system.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setJobToDelete(null);
                  setDeleteError(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                {isDeleting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Job</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
