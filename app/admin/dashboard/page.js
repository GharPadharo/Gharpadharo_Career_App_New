import { getActiveJobs, getDraftJobs, getClosedJobs } from "@/lib/mockJobs";
import { mockApplications } from "@/lib/mockApplications";
import AdminQuickActions from "@/components/admin/AdminQuickActions";
import AdminStats from "@/components/admin/AdminStats";
import RecentActivityCard from "@/components/admin/RecentActivityCard";

export const metadata = {
  title: "Admin Dashboard | GharPadharo Careers",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminDashboardPage() {
  // Derive counts directly from canonical datasets
  const activeCount = getActiveJobs().length;
  const draftCount = getDraftJobs().length;
  const closedCount = getClosedJobs().length;
  const applicationsCount = mockApplications.length;

  // Compact status breakdown derived dynamically from mockApplications
  const newCount = mockApplications.filter((app) => app.status === "new").length;
  const viewedCount = mockApplications.filter((app) => app.status === "viewed").length;
  const applicationBreakdown = `${newCount} New · ${viewedCount} Viewed`;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Welcome / Page Heading (Deterministic, Hydration-Safe) */}
      <div className="space-y-1">
        <span className="text-xs font-bold text-primary tracking-widest uppercase inline-block">
          RECRUITMENT
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-heading tracking-tight leading-tight">
          Good afternoon, Admin
        </h1>
        <p className="text-sm sm:text-base text-muted font-normal max-w-2xl mt-1 leading-relaxed">
          Manage open roles, keep job information up to date, and track recruitment
          activity from one place.
        </p>
      </div>

      {/* 2. Quick Actions */}
      <AdminQuickActions />

      {/* 3. 4 Overview Stats */}
      <AdminStats
        activeCount={activeCount}
        draftCount={draftCount}
        closedCount={closedCount}
        applicationsCount={applicationsCount}
        applicationBreakdown={applicationBreakdown}
      />

      {/* 4. Compact Recruitment Activity Card */}
      <RecentActivityCard />
    </div>
  );
}
