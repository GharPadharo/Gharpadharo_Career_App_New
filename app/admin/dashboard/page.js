import { mockJobs } from "@/lib/mockJobs";
import AdminStats from "@/components/admin/AdminStats";
import AdminJobTable from "@/components/admin/AdminJobTable";

export const metadata = {
  title: "Admin Dashboard | GharPadharo Careers",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminDashboardPage() {
  const publishedCount = mockJobs.length;
  const draftCount = 0;
  const applicationsCount = 0;

  return (
    <div className="space-y-8">
      {/* 1. Summary Stats Cards */}
      <AdminStats
        activeCount={publishedCount}
        draftCount={draftCount}
        applicationsCount={applicationsCount}
        publishedCount={publishedCount}
      />

      {/* 2. Job Listings Management & Filterable Table */}
      <AdminJobTable initialJobs={mockJobs} />
    </div>
  );
}
