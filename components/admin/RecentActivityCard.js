"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";

const POLL_INTERVAL_MS = 20000; // 20 seconds polling interval

/**
 * Format relative timestamps: "just now", "2m ago", "18m ago", "1h ago", "2d ago"
 */
function formatRelativeTime(dateInput) {
  if (!dateInput) return "just now";
  const date = new Date(dateInput);
  const now = new Date();
  const diffSec = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

  if (diffSec < 45) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks}w ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo ago`;
}

/**
 * Event styling configuration based on activity type
 */
function getActivityStyle(type) {
  switch (type) {
    case "application_created":
      return {
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
        iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200/70",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        ),
      };
    case "application_viewed":
      return {
        badgeBg: "bg-sky-50 text-sky-700 border-sky-200/70",
        iconBg: "bg-sky-50 text-sky-600 border-sky-200/70",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        ),
      };
    case "application_status_changed":
      return {
        badgeBg: "bg-[#525599]/10 text-primary border-[#525599]/25",
        iconBg: "bg-[#525599]/10 text-primary border-[#525599]/25",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      };
    case "job_created":
      return {
        badgeBg: "bg-purple-50 text-purple-700 border-purple-200/70",
        iconBg: "bg-purple-50 text-purple-600 border-purple-200/70",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      };
    case "job_published":
      return {
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
        iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200/70",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        ),
      };
    case "job_closed":
      return {
        badgeBg: "bg-slate-100 text-slate-700 border-slate-200/80",
        iconBg: "bg-slate-100 text-slate-600 border-slate-200/80",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        ),
      };
    case "job_reopened":
      return {
        badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200/70",
        iconBg: "bg-indigo-50 text-indigo-600 border-indigo-200/70",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        ),
      };
    case "job_updated":
      return {
        badgeBg: "bg-amber-50 text-amber-700 border-amber-200/70",
        iconBg: "bg-amber-50 text-amber-600 border-amber-200/70",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
      };
    case "application_deleted":
      return {
        badgeBg: "bg-rose-50 text-rose-700 border-rose-200/70",
        iconBg: "bg-rose-50 text-rose-600 border-rose-200/70",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        ),
      };
    default:
      return {
        badgeBg: "bg-slate-50 text-slate-700 border-slate-200/70",
        iconBg: "bg-slate-50 text-slate-600 border-slate-200/70",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      };
  }
}

/**
 * Determine navigation target for clickable activity events
 */
function getActivityHref(activity) {
  if (activity.type === "application_deleted") {
    return null;
  }
  if (activity.entityType === "application") {
    return activity.entityId
      ? `/admin/dashboard/applications/${activity.entityId}`
      : "/admin/dashboard/applications";
  }
  if (activity.entityType === "job") {
    return activity.metadata?.jobSlug
      ? `/admin/dashboard/jobs/${activity.metadata.jobSlug}/edit`
      : "/admin/dashboard/jobs";
  }
  return null;
}

/**
 * RecentActivityCard Component
 * 
 * Compact, real-time, database-backed recruitment activity feed:
 * - Displays up to `limit` activities (default 5 on dashboard overview)
 * - Properly aligned connector line that starts below icon and ends above next icon
 * - Automatic background polling (every 20s while visible)
 * - Revalidates on focus and admin action events without overlapping requests
 * - "View all activity →" link points to dedicated /admin/dashboard/activity page
 */
export default function RecentActivityCard({ limit = 5, isFullPage = false }) {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const isFetchingRef = useRef(false);

  const fetchActivities = useCallback(async (isBackground = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (!isBackground) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const res = await fetch(`/api/admin/dashboard/activity?limit=${limit}`);
      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      if (!json.success || !Array.isArray(json.activities)) {
        throw new Error("Malformed activity payload from API");
      }
      setActivities(json.activities.slice(0, limit));
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to load recruitment activities:", err);
      setError(err.message || "Activity couldn't be loaded.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      isFetchingRef.current = false;
    }
  }, [limit]);

  // Initial load
  useEffect(() => {
    fetchActivities(false);
  }, [fetchActivities]);

  // Periodic polling & event-based revalidation
  useEffect(() => {
    const handlePoll = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchActivities(true);
      }
    };

    const intervalId = setInterval(handlePoll, POLL_INTERVAL_MS);

    const handleFocus = () => {
      handlePoll();
    };

    const handleEventUpdate = () => {
      handlePoll();
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("applications-updated", handleEventUpdate);
    window.addEventListener("activity-updated", handleEventUpdate);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("applications-updated", handleEventUpdate);
      window.removeEventListener("activity-updated", handleEventUpdate);
    };
  }, [fetchActivities]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
      {/* Header with Live Indicator */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            {isFullPage ? "Activity History" : "Recruitment Activity"}
          </h2>
          <p className="text-xs text-muted mt-0.5">
            {isFullPage
              ? "Complete chronological timeline of candidate applications and job updates."
              : "Real-time timeline of candidate submissions and job activity."}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {lastUpdated && !isLoading && (
            <span className="text-[11px] text-slate-400 hidden sm:inline-block">
              {isRefreshing ? "Updating..." : "Updated just now"}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
            <span
              className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${
                isRefreshing ? "animate-ping" : "animate-pulse"
              }`}
              aria-hidden="true"
            />
            Live activity
          </span>
        </div>
      </div>

      {/* Main Content: Loading, Error, Empty, or Timeline */}
      {isLoading ? (
        /* Compact Timeline Skeleton (Matches requested 5-item count) */
        <div className="space-y-1.5 py-1 animate-pulse">
          {Array.from({ length: Math.min(limit, 5) }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-2 rounded-xl">
              <div className="w-7 h-7 rounded-lg bg-slate-100 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1.5 min-w-0 pt-0.5">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-28 bg-slate-200 rounded" />
                  <div className="h-2.5 w-12 bg-slate-100 rounded" />
                </div>
                <div className="h-2.5 w-44 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error State with Isolated Retry */
        <div className="py-5 px-4 rounded-xl bg-red-50/70 border border-red-200/80 text-center space-y-2">
          <p className="text-xs font-semibold text-red-800">
            Activity couldn&apos;t be loaded.
          </p>
          <p className="text-[11px] text-red-600 max-w-sm mx-auto">
            {error}
          </p>
          <button
            type="button"
            onClick={() => fetchActivities(false)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry
          </button>
        </div>
      ) : activities.length === 0 ? (
        /* Intentional Empty State */
        <div className="py-8 text-center space-y-1.5">
          <div className="w-9 h-9 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xs font-bold text-slate-800">No recent activity</p>
          <p className="text-xs text-muted max-w-xs mx-auto leading-relaxed">
            Recruitment activity will appear here as jobs and applications change.
          </p>
        </div>
      ) : (
        /* Clean Timeline with Centered Segmented Connector */
        <div className="relative">
          {activities.map((act, index) => {
            const style = getActivityStyle(act.type);
            const href = getActivityHref(act);
            const timeAgo = formatRelativeTime(act.createdAt);
            const isLast = index === activities.length - 1;

            const rowContent = (
              <div
                className={`group flex items-start gap-3 px-2 py-1.5 sm:px-2.5 rounded-xl transition-colors duration-150 ${
                  href
                    ? "hover:bg-slate-50/90 cursor-pointer"
                    : "hover:bg-slate-50/50"
                }`}
              >
                {/* Column: Icon Node & Non-overlapping Connector Line */}
                <div className="relative flex flex-col items-center shrink-0 self-stretch pt-0.5">
                  {/* Node icon: Solid background and border, cleanly centered */}
                  <div
                    className={`relative z-10 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border shadow-2xs ${style.iconBg}`}
                  >
                    {style.icon}
                  </div>

                  {/* Connector line segment: Starts below icon, runs down to next item, omitted on last item */}
                  {!isLast && (
                    <div
                      className="w-px bg-slate-200/90 flex-1 my-1 -mb-1.5"
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Event Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {act.title}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border shrink-0 ${style.badgeBg}`}
                      >
                        {act.type.replace(/_/g, " ")}
                      </span>
                    </div>

                    <span className="text-[11px] text-muted whitespace-nowrap shrink-0">
                      {timeAgo}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-0.5 leading-snug line-clamp-2">
                    {act.description}
                  </p>
                </div>
              </div>
            );

            return href ? (
              <Link
                key={act.id}
                href={href}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl"
              >
                {rowContent}
              </Link>
            ) : (
              <div key={act.id}>{rowContent}</div>
            );
          })}
        </div>
      )}

      {/* Sub-bar / Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Sourced in real-time from MongoDB Atlas</span>
        {!isFullPage ? (
          <Link
            href="/admin/dashboard/activity"
            className="text-primary hover:underline font-semibold"
          >
            View all activity &rarr;
          </Link>
        ) : (
          <span className="font-medium text-slate-500">
            Showing up to {limit} recent events
          </span>
        )}
      </div>
    </div>
  );
}
