"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
 * - Job filter: All Jobs + dynamically derived from jobs
 * - Desktop table & responsive mobile cards (< md)
 * - View action linking to /admin/dashboard/applications/[id]
 * - Secure Bulk Selection and Deletion:
 *   * Header checkbox with checked/indeterminate/unchecked states for current page
 *   * Per-row accessible checkboxes
 *   * Floating / sticky Bulk Action Bar displaying selection count
 *   * Accessible confirmation dialog with exact selection count and resume warning
 *   * Safe server-side bulk deletion with Cloudinary resume cleanup
 *   * Feedback alerts for success and partial failure
 *   * Clean pagination handling
 */
export default function AdminApplicationsTable({
  initialApplications = [],
  jobs = [],
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedJobId, setSelectedJobId] = useState("All");

  // Selection & Bulk Delete state
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const headerCheckboxRef = useRef(null);

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

  // Sync sidebar applications count when applications length changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("applications-updated", {
          detail: { count: applications.length },
        })
      );
    }
  }, [applications.length]);

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

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedJobId]);

  // Total pages calculation
  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / pageSize));

  // If current page becomes empty after deletion, step back
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Current page items
  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredApplications.slice(start, start + pageSize);
  }, [filteredApplications, currentPage, pageSize]);

  // Checkbox states for current page
  const allCurrentPageSelected =
    paginatedApplications.length > 0 &&
    paginatedApplications.every((app) => selectedIds.has(app.id));

  const someCurrentPageSelected =
    paginatedApplications.some((app) => selectedIds.has(app.id));

  const isIndeterminate = someCurrentPageSelected && !allCurrentPageSelected;

  // Manage indeterminate DOM property
  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  // Toggle selection for all visible rows on the current page
  const handleSelectAllCurrentPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allCurrentPageSelected) {
        paginatedApplications.forEach((app) => next.delete(app.id));
      } else {
        paginatedApplications.forEach((app) => next.add(app.id));
      }
      return next;
    });
  };

  // Toggle selection for an individual row
  const handleToggleSelectRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Deselect all
  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  // Confirm and execute bulk deletion
  const handleConfirmBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const idsArray = Array.from(selectedIds);
      const res = await fetch("/api/admin/applications/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsArray }),
      });

      const data = await res.json();

      if (!res.ok || (data.success === false && data.deletedCount === 0)) {
        setDeleteError(data.error || "Failed to delete applications.");
        setIsDeleting(false);
        return;
      }

      // Successful or partial deletion
      const deletedSet = new Set(data.deletedIds || []);

      // Remove deleted records from state
      setApplications((prev) => {
        const remaining = prev.filter((app) => !deletedSet.has(app.id));
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("applications-updated", {
              detail: { count: remaining.length },
            })
          );
        }
        return remaining;
      });

      // Remove deleted IDs from selection state
      setSelectedIds((prev) => {
        const next = new Set(prev);
        deletedSet.forEach((id) => next.delete(id));
        return next;
      });

      setIsDeleteModalOpen(false);
      setIsDeleting(false);

      if (data.failedCount > 0) {
        setFeedbackMessage({
          type: "warning",
          text: `${data.deletedCount} application(s) deleted. ${data.failedCount} application(s) could not be deleted because resume cleanup failed.`,
        });
      } else {
        setFeedbackMessage({
          type: "success",
          text: `${data.deletedCount} ${
            data.deletedCount === 1 ? "application" : "applications"
          } deleted successfully.`,
        });
      }
    } catch (err) {
      console.error("Bulk delete request failed:", err);
      setDeleteError("Network error: Could not reach the server to perform deletion.");
      setIsDeleting(false);
    }
  };

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
      {/* Feedback Banner */}
      {feedbackMessage && (
        <div
          role="status"
          className={`flex items-center justify-between p-4 rounded-xl border text-sm font-medium ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-amber-50 text-amber-800 border-amber-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedbackMessage.type === "success" ? (
              <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer"
            aria-label="Dismiss message"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Bulk Action Toolbar (Visible when 1+ selected) */}
      {selectedIds.size > 0 && (
        <div
          role="region"
          aria-label="Bulk actions toolbar"
          className="bg-primary/5 border border-primary/20 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs animate-in fade-in duration-200"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-white text-xs font-bold shadow-2xs">
              {selectedIds.size}
            </span>
            <span className="text-sm font-semibold text-slate-800">
              {selectedIds.size} {selectedIds.size === 1 ? "application" : "applications"} selected
            </span>
            <button
              type="button"
              onClick={handleDeselectAll}
              className="text-xs font-semibold text-primary hover:underline hover:text-[#46477f] cursor-pointer ml-1"
            >
              Deselect all
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setDeleteError(null);
                setIsDeleteModalOpen(true);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              aria-label={`Delete ${selectedIds.size} selected applications`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete Selected ({selectedIds.size})</span>
            </button>
          </div>
        </div>
      )}

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
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold text-muted uppercase tracking-wider">
                    {/* Checkbox Header Column */}
                    <th scope="col" className="py-3.5 pl-4 pr-2 w-10 text-center">
                      <input
                        type="checkbox"
                        ref={headerCheckboxRef}
                        checked={allCurrentPageSelected}
                        onChange={handleSelectAllCurrentPage}
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/30 cursor-pointer"
                        aria-label="Select all applications on current page"
                      />
                    </th>
                    <th scope="col" className="py-3.5 px-4 lg:px-6">Candidate</th>
                    <th scope="col" className="py-3.5 px-4">Position</th>
                    <th scope="col" className="py-3.5 px-4">Experience</th>
                    <th scope="col" className="py-3.5 px-4">Status</th>
                    <th scope="col" className="py-3.5 px-4">Applied</th>
                    <th scope="col" className="py-3.5 px-4 lg:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paginatedApplications.map((app) => {
                    const job = jobsById.get(app.jobId);
                    const isNew = app.status === "new";
                    const isSelected = selectedIds.has(app.id);

                    return (
                      <tr
                        key={app.id}
                        className={`transition-colors ${
                          isSelected
                            ? "bg-primary/5 hover:bg-primary/10"
                            : isNew
                            ? "bg-white hover:bg-slate-50/80"
                            : "hover:bg-slate-50/60"
                        }`}
                      >
                        {/* Checkbox Column */}
                        <td className="py-3.5 sm:py-4 pl-4 pr-2 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectRow(app.id)}
                            className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/30 cursor-pointer"
                            aria-label={`Select application for ${app.candidate}`}
                          />
                        </td>

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
              {/* Select All on mobile */}
              <div className="p-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allCurrentPageSelected}
                    onChange={handleSelectAllCurrentPage}
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/30 cursor-pointer"
                    aria-label="Select all on this page"
                  />
                  <span>Select all on page</span>
                </label>
                <span className="text-xs text-muted">
                  {paginatedApplications.length} on page
                </span>
              </div>

              {paginatedApplications.map((app) => {
                const job = jobsById.get(app.jobId);
                const isNew = app.status === "new";
                const isSelected = selectedIds.has(app.id);

                return (
                  <div
                    key={app.id}
                    className={`p-4 sm:p-5 space-y-3 transition-colors ${
                      isSelected
                        ? "bg-primary/5"
                        : isNew
                        ? "bg-white"
                        : "bg-slate-50/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(app.id)}
                          className="w-4 h-4 mt-1 rounded border-slate-300 text-primary focus:ring-primary/30 cursor-pointer shrink-0"
                          aria-label={`Select application for ${app.candidate}`}
                        />
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-3 sm:p-4 border-t border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted">
                <div>
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {(currentPage - 1) * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-700">
                    {Math.min(currentPage * pageSize, filteredApplications.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700">
                    {filteredApplications.length}
                  </span>{" "}
                  applications
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
                  >
                    Previous
                  </button>

                  <span className="px-2 font-medium text-slate-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bulk Delete Confirmation Dialog */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onKeyDown={(e) => {
            if (e.key === "Escape" && !isDeleting) {
              setIsDeleteModalOpen(false);
              setDeleteError(null);
            }
          }}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
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
                Delete {selectedIds.size} {selectedIds.size === 1 ? "application" : "applications"}?
              </h3>
              <p className="text-sm text-muted mt-1.5 leading-relaxed">
                This action permanently deletes the selected {selectedIds.size === 1 ? "application" : "applications"} and their uploaded resume files. This cannot be undone.
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
                  setIsDeleteModalOpen(false);
                  setDeleteError(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmBulkDelete}
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
                  <span>Delete Applications</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
