import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import { serializeJob } from "@/lib/jobSerializer";
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
  let loadError = false;

  try {
    await connectDB();
    const docs = await Job.find({}).sort({ createdAt: -1 });
    allJobs = docs.map(serializeJob);
  } catch (error) {
    console.error("Failed to load admin jobs from database:", error);
    loadError = true;
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

      {/* Main Filterable Job Table or Error Notice */}
      {loadError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50/60 p-6 text-slate-800 shadow-2xs">
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
            <div>
              <h3 className="text-sm font-semibold text-red-900">
                Unable to load job postings
              </h3>
              <p className="mt-1 text-sm text-red-700">
                A connection error occurred while retrieving job postings from the database. Please refresh the page or try again in a few moments.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <AdminJobTable initialJobs={allJobs} hideHeader={true} />
      )}
    </div>
  );
}
