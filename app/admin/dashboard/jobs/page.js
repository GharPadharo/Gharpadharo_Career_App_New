import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import { serializeJob } from "@/lib/jobSerializer";
import { mockJobs } from "@/lib/mockJobs";
import AdminJobTable from "@/components/admin/AdminJobTable";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Jobs Management | Admin Dashboard",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function AdminJobsPage() {
  let allJobs = [];
  try {
    await connectDB();
    const docs = await Job.find({}).sort({ createdAt: -1 });
    allJobs = docs.map(serializeJob);
  } catch (error) {
    console.error("Failed to load admin jobs from database, using fallback:", error);
    allJobs = mockJobs;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-primary tracking-widest uppercase inline-block">
            JOB MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-heading tracking-tight leading-tight">
            Jobs
          </h1>
          <p className="text-sm text-muted font-normal max-w-2xl mt-1 leading-relaxed">
            Create, edit and manage the positions shown on the GharPadharo careers site.
          </p>
        </div>

        <Link
          href="/admin/dashboard/jobs/new"
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-[#46477f] text-white text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 shrink-0 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Job</span>
        </Link>
      </div>

      {/* Main Filterable Job Table */}
      <AdminJobTable initialJobs={allJobs} hideHeader={true} />
    </div>
  );
}
