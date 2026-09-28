import Link from "next/link";
import RecentActivityCard from "@/components/admin/RecentActivityCard";

export const metadata = {
  title: "Recruitment Activity History | Admin Dashboard",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

/**
 * AdminActivityPage
 * 
 * Dedicated full activity history page:
 * - Shows up to 50 recent recruitment events from MongoDB
 * - Back link to main admin dashboard
 * - Reuses RecentActivityCard with isFullPage={true} and limit={50}
 */
export default function AdminActivityPage() {
  return (
    <div className="space-y-5">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-primary transition-colors py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-lg"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Activity History Card */}
      <RecentActivityCard limit={50} isFullPage={true} />
    </div>
  );
}
