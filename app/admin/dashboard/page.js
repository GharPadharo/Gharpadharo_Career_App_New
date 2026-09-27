import AdminQuickActions from "@/components/admin/AdminQuickActions";
import AdminDashboardOverview from "@/components/admin/AdminDashboardOverview";

export const metadata = {
  title: "Admin Dashboard | GharPadharo Careers",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminDashboardPage() {
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

      {/* 3. Live Overview Stats & Real-time Recruitment Activity */}
      <AdminDashboardOverview />
    </div>
  );
}
