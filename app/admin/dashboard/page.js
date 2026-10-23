import AdminQuickActions from "@/components/admin/AdminQuickActions";
import AdminDashboardOverview from "@/components/admin/AdminDashboardOverview";
import ScrollReveal from "@/components/common/ScrollReveal";

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
      <ScrollReveal variant="fade-up">
        <div className="space-y-1">
          <span className="admin-eyebrow">
            RECRUITMENT
          </span>
          <h1 className="admin-page-title">
            Good afternoon, Admin
          </h1>
          <p className="admin-subtitle max-w-2xl mt-1">
            Manage open roles, keep job information up to date, and track recruitment
            activity from one place.
          </p>
        </div>
      </ScrollReveal>

      {/* 2. Quick Actions */}
      <ScrollReveal variant="fade-up" delay={50}>
        <AdminQuickActions />
      </ScrollReveal>

      {/* 3. Live Overview Stats & Real-time Recruitment Activity */}
      <ScrollReveal variant="fade-up" delay={100}>
        <AdminDashboardOverview />
      </ScrollReveal>
    </div>
  );
}
