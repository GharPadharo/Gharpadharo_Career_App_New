"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import ApplicationStatusBadge from "./ApplicationStatusBadge";
import {
  getViewedApplicationIds,
  markApplicationAsViewed,
} from "@/lib/viewedApplications";

/**
 * AdminApplicationsTable Component
 * 
 * Interactive applications inbox for GharPadharo Admin:
 * - Two simplified statuses: "new" (unread) and "viewed" (opened by admin)
 * - Automatically transitions applications to "viewed" when opened or clicked
 * - Search: matches candidate name, email, or resolved job title
 * - Status filter: All Status, New, Viewed
 * - Job filter: All Jobs + dynamically derived from mockJobs
 * - Desktop table & responsive mobile cards (< md)
 * - View action linking to /admin/dashboard/applications/[id]
 */
export default function AdminApplicationsTable({
  initialApplications = [],
  jobs = [],
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedJobId, setSelectedJobId] = useState("All");

  // Sync frontend session viewed applications on client mount
  useEffect(() => {
    const viewedIds = getViewedApplicationIds();
    if (viewedIds.size > 0) {
      setApplications((prev) =>
        prev.map((app) =>
          viewedIds.has(app.id) ? { ...app, status: "viewed" } : app
        )
      );
    }
  }, []);

  // Handler for marking application as viewed in state and DB
  const handleViewClick = (id) => {
    markApplicationAsViewed(id);
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "viewed" } : app))
    );

    // Persist viewed status to MongoDB
    fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "viewed" }),
    }).catch((err) => {
      console.error("Failed to mark application as viewed on server:", err);
    });
  };

  // Create job lookup map for instant access to title and team
  const jobsById = useMemo(() => {
    const map = new Map();
    jobs.forEach((j) => map.set(j.id, j));
    return map;
  }, [jobs]);

  // Derived filtered list
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Status filter: All, new, viewed
      const matchesStatus =
        selectedStatus === "All" ||
        app.status.toLowerCase() === selectedStatus.toLowerCase();

      // Job filter
      const matchesJob =
        selectedJobId === "All" || app.jobId === selectedJobId;

      // Search term
      const query = searchTerm.toLowerCase().trim();
      const jobTitle = jobsById.get(app.jobId)?.title?.toLowerCase() || "";
      const matchesSearch =
        !query ||
        app.candidate.toLowerCase().includes(query) ||
        app.email.toLowerCase().includes(query) ||
        jobTitle.includes(query);

      return matchesStatus && matchesJob && matchesSearch;
    });
  }, [applications, searchTerm, selectedStatus, selectedJobId, jobsById]);

  const isFiltered = Boolean(
    searchTerm.trim() || selectedStatus !== "All" || selectedJobId !== "All"
  );

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("All");
    setSelectedJobId("All");
  };

  return (
    <div className="space-y-5">
      {/* 1. Filter Toolbar */}
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
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search candidates or jobs..."
              className="w-full h-11 pl-10 pr-9 bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-200/90 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs transition-colors"
              aria-label="Search candidates or jobs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
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
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-11 appearance-none bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-200/90 rounded-xl pl-3.5 pr-9 text-sm font-medium text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer transition-colors [&::-ms-expand]:hidden"
              aria-label="Filter by Status"
            >
              <option value="All">All Status</option>
              <option value="new">New</option>
              <option value="viewed">Viewed</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* 3. Job Dropdown: 50% width on mobile (col-span-1), 220px on desktop */}
          <div className="col-span-1 md:col-auto relative w-full md:w-[220px] md:shrink-0">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full h-11 appearance-none bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-200/90 rounded-xl pl-3.5 pr-9 text-sm font-medium text-slate-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer transition-colors [&::-ms-expand]:hidden truncate"
              aria-label="Filter by Job"
            >
              <option value="All">All Jobs</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
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

        {/* Sub-bar: Count & Clear Filters Indicator */}
        <div className="flex items-center justify-between text-xs text-muted pt-2 px-1 border-t border-slate-100">
          <span className="font-semibold text-slate-600">
            {isFiltered
              ? `${filteredApplications.length} ${
                  filteredApplications.length === 1 ? "application" : "applications"
                } found`
              : `${applications.length} ${
                  applications.length === 1 ? "application" : "applications"
                }`}
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-semibold text-primary hover:text-[#46477f] hover:underline cursor-pointer transition-colors focus-visible:outline-none focus-visible:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Table / Empty State Container */}
      <div className="bg-card rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {applications.length === 0 ? (
          /* Empty State: No applications in dataset */
          <div className="py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4 shadow-2xs">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-heading">No applications yet</h3>
            <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
              Candidate applications will appear here when applications are received.
            </p>
          </div>
        ) : filteredApplications.length === 0 ? (
          /* Filtered Empty State */
          <div className="py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4 shadow-2xs">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-heading">No applications found</h3>
            <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
              Try adjusting your search or filters.
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
            {/* Desktop Table View (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[720px]">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold text-muted uppercase tracking-wider">
                    <th scope="col" className="py-3.5 px-4 lg:px-6">Candidate</th>
                    <th scope="col" className="py-3.5 px-4">Position</th>
                    <th scope="col" className="py-3.5 px-4">Experience</th>
                    <th scope="col" className="py-3.5 px-4">Status</th>
                    <th scope="col" className="py-3.5 px-4">Applied</th>
                    <th scope="col" className="py-3.5 px-4 lg:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredApplications.map((app) => {
                    const job = jobsById.get(app.jobId);
                    const isNew = app.status === "new";

                    return (
                      <tr
                        key={app.id}
                        className={`transition-colors ${
                          isNew
                            ? "bg-white hover:bg-slate-50/80"
                            : "hover:bg-slate-50/60"
                        }`}
                      >
                        {/* Candidate Column: Name + Email */}
                        <td className="py-3.5 sm:py-4 px-4 lg:px-6">
                          <div>
                            <Link
                              href={`/admin/dashboard/applications/${app.id}`}
                              onClick={() => handleViewClick(app.id)}
                              className={`hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline block ${
                                isNew
                                  ? "font-bold text-slate-900"
                                  : "font-semibold text-slate-700"
                              }`}
                            >
                              {app.candidate}
                            </Link>
                            <span className="text-xs text-muted block mt-0.5">
                              {app.email}
                            </span>
                          </div>
                        </td>

                        {/* Position Column: Job Title + Team */}
                        <td className="py-3.5 sm:py-4 px-4">
                          <div>
                            <span className="font-semibold text-slate-800 block">
                              {job?.title || app.jobId}
                            </span>
                            <span className="text-xs text-muted block mt-0.5">
                              {job?.team || "General"}
                            </span>
                          </div>
                        </td>

                        {/* Experience */}
                        <td className="py-3.5 sm:py-4 px-4 text-slate-600 text-xs whitespace-nowrap">
                          {app.experience}
                        </td>

                        {/* Status (New or Viewed) */}
                        <td className="py-3.5 sm:py-4 px-4">
                          <ApplicationStatusBadge status={app.status} />
                        </td>

                        {/* Applied Relative Date */}
                        <td className="py-3.5 sm:py-4 px-4 text-xs text-muted whitespace-nowrap">
                          {app.appliedText}
                        </td>

                        {/* Actions: View Link */}
                        <td className="py-3.5 sm:py-4 px-4 lg:px-6 text-right whitespace-nowrap">
                          <Link
                            href={`/admin/dashboard/applications/${app.id}`}
                            onClick={() => handleViewClick(app.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-[#46477f] hover:underline transition-colors focus-visible:outline-none focus-visible:underline"
                            aria-label={`View application for ${app.candidate}`}
                          >
                            <span>View</span>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards (< md) */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredApplications.map((app) => {
                const job = jobsById.get(app.jobId);
                const isNew = app.status === "new";

                return (
                  <div
                    key={app.id}
                    className={`p-4 sm:p-5 space-y-3 ${
                      isNew ? "bg-white" : "bg-slate-50/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-heading">
                          <Link
                            href={`/admin/dashboard/applications/${app.id}`}
                            onClick={() => handleViewClick(app.id)}
                            className="hover:text-primary transition-colors"
                          >
                            {app.candidate}
                          </Link>
                        </h3>
                        <p className="text-xs text-muted mt-0.5">
                          {app.email}
                        </p>
                      </div>

                      <ApplicationStatusBadge status={app.status} />
                    </div>

                    <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1">
                      <div className="text-xs font-semibold text-slate-800">
                        {job?.title || app.jobId}
                      </div>
                      <div className="text-[11px] text-muted flex items-center gap-2">
                        <span>{job?.team || "General"}</span>
                        <span aria-hidden="true">&bull;</span>
                        <span>{app.experience}</span>
                        <span aria-hidden="true">&bull;</span>
                        <span>{app.appliedText}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                      <Link
                        href={`/admin/dashboard/applications/${app.id}`}
                        onClick={() => handleViewClick(app.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-[#46477f] text-white text-xs font-semibold shadow-2xs transition-colors"
                      >
                        <span>View Application</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
