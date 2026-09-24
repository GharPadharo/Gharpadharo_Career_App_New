"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdminJobFilters from "./AdminJobFilters";

/**
 * AdminJobTable Component
 * 
 * Manages job listings presentation:
 * - Desktop: Clean, responsive table
 * - Mobile: Stacked, readable cards
 * - Filter/Search: React state-driven against mockJobs
 * - Actions: Edit (/admin/dashboard/[id]/edit) and Delete (frontend confirmation modal)
 */
export default function AdminJobTable({ initialJobs = [] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [jobToDelete, setJobToDelete] = useState(null);

  // Extract distinct teams from jobs
  const teams = useMemo(() => {
    return Array.from(new Set(initialJobs.map((j) => j.team))).filter(Boolean);
  }, [initialJobs]);

  // Frontend filter logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Status filter (current mock jobs are all Published)
      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Published" && true) ||
        (selectedStatus === "Draft" && false);

      // Team filter
      const matchesTeam =
        selectedTeam === "All" || job.team === selectedTeam;

      // Search term filter
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

  // Frontend-only delete confirmation handler
  const handleConfirmDelete = () => {
    if (jobToDelete) {
      setJobs((prev) => prev.filter((j) => j.id !== jobToDelete.id));
      setJobToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header: Title & "+ Add New Job" Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-heading tracking-tight">
            Job Listings
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            View, search, and manage all career openings.
          </p>
        </div>

        <Link
          href="/admin/dashboard/new"
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Job</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <AdminJobFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedTeam={selectedTeam}
        onTeamChange={setSelectedTeam}
        teams={teams}
      />

      {/* Main Table / Mobile Cards Container */}
      <div className="bg-card rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {filteredJobs.length === 0 ? (
          /* Empty State */
          <div className="py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-heading">No jobs found</h3>
            <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
              No job postings match your current filter criteria. Try adjusting your search term or filters.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table (hidden on mobile/tablet < md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold text-muted uppercase tracking-wider">
                    <th scope="col" className="py-3.5 px-4 lg:px-6">Job Title</th>
                    <th scope="col" className="py-3.5 px-4">Team</th>
                    <th scope="col" className="py-3.5 px-4">Location</th>
                    <th scope="col" className="py-3.5 px-4">Type</th>
                    <th scope="col" className="py-3.5 px-4">Experience</th>
                    <th scope="col" className="py-3.5 px-4">Status</th>
                    <th scope="col" className="py-3.5 px-4">Posted</th>
                    <th scope="col" className="py-3.5 px-4 lg:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Job Title */}
                      <td className="py-4 px-4 lg:px-6 font-semibold text-heading">
                        <Link
                          href={`/admin/dashboard/${job.id}/edit`}
                          className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
                        >
                          {job.title}
                        </Link>
                      </td>

                      {/* Team */}
                      <td className="py-4 px-4 text-slate-600 font-medium">
                        {job.team}
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4 text-slate-500">
                        {job.location}
                      </td>

                      {/* Type */}
                      <td className="py-4 px-4 text-slate-500">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-xs font-medium text-slate-700">
                          {job.type}
                        </span>
                      </td>

                      {/* Experience */}
                      <td className="py-4 px-4 text-slate-500 text-xs">
                        {job.experience}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Published
                        </span>
                      </td>

                      {/* Posted */}
                      <td className="py-4 px-4 text-xs text-muted whitespace-nowrap">
                        {job.postedText}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 lg:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/dashboard/${job.id}/edit`}
                            className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors focus-visible:outline-none focus-visible:underline"
                          >
                            Edit
                          </Link>
                          <span className="text-slate-300" aria-hidden="true">&bull;</span>
                          <button
                            type="button"
                            onClick={() => setJobToDelete(job)}
                            className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors focus-visible:outline-none focus-visible:underline cursor-pointer"
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
                          href={`/admin/dashboard/${job.id}/edit`}
                          className="hover:text-primary transition-colors"
                        >
                          {job.title}
                        </Link>
                      </h3>
                      <p className="text-xs font-medium text-slate-600 mt-0.5">
                        {job.team} &bull; {job.location}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Published
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {job.type}
                    </span>
                    <span>{job.experience}</span>
                    <span aria-hidden="true">&bull;</span>
                    <span>{job.postedText}</span>
                  </div>

                  {/* Mobile Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-4 text-xs font-semibold">
                    <Link
                      href={`/admin/dashboard/${job.id}/edit`}
                      className="text-primary hover:text-primary-hover transition-colors"
                    >
                      Edit
                    </Link>
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

      {/* Frontend-only Delete Confirmation Modal */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 shadow-xl space-y-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
          >
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <div>
              <h3 id="delete-dialog-title" className="text-lg font-bold text-heading">
                Delete Job Posting?
              </h3>
              <p className="text-sm text-muted mt-1 leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-800 font-semibold">{jobToDelete.title}</strong>? (This is a frontend preview action; mockJobs are not modified permanently.)
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setJobToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
