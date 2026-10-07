"use client";

import { useEffect, useState } from "react";
import AdminStats from "@/components/admin/AdminStats";
import RecentActivityCard from "@/components/admin/RecentActivityCard";

/**
 * AdminDashboardOverview Component
 * 
 * Coordinates live data loading from GET /api/admin/dashboard/stats:
 * - Shows loading skeletons to prevent misleading zero flashes
 * - Displays error state with retry functionality if network or database fails
 * - Strictly relies on MongoDB as source of truth (no mock data fallback)
 */
export default function AdminDashboardOverview() {
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/dashboard/stats");
      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || `HTTP error ${res.status}`);
      }
      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error || "Malformed response payload from stats API");
      }
      setStatsData(json.data);
    } catch (err) {
      console.error("Failed to load dashboard statistics:", err);
      setError(err.message || "Failed to load dashboard statistics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/dashboard/stats");
        if (!res.ok) {
          const errorJson = await res.json().catch(() => ({}));
          throw new Error(errorJson.error || `HTTP error ${res.status}`);
        }
        const json = await res.json();
        if (!json.success || !json.data) {
          throw new Error(json.error || "Malformed response payload from stats API");
        }
        if (!ignore) {
          setStatsData(json.data);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Failed to load dashboard statistics:", err);
          setError(err.message || "Failed to load dashboard statistics");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/60 p-5 sm:p-6 text-slate-800 shadow-2xs">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-red-100 p-2.5 text-red-600 shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-red-900 tracking-tight">
              Unable to load live dashboard statistics
            </h3>
            <p className="mt-1 text-xs text-red-700 leading-relaxed font-normal">
              Could not retrieve real-time statistics from MongoDB: {error}
            </p>
            <div className="mt-3.5 flex items-center gap-3">
              <button
                type="button"
                onClick={fetchStats}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 active:scale-95 transition-all shadow-xs"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Overview Statistic Cards */}
      <AdminStats
        isLoading={isLoading}
        jobs={statsData?.jobs}
        applications={statsData?.applications}
      />

      {/* 2. Real-time Recruitment Activity */}
      <RecentActivityCard />
    </div>
  );
}
