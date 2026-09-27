import Link from "next/link";
import JobForm from "@/components/admin/JobForm";

export const metadata = {
  title: "Add New Job | Admin Dashboard",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AddNewJobPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb / Back link */}
      <div>
        <Link
          href="/admin/dashboard/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Jobs</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="space-y-1">
        <span className="text-xs font-bold text-primary tracking-widest uppercase inline-block">
          JOB MANAGEMENT
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-heading tracking-tight leading-tight">
          Add New Job
        </h1>
        <p className="text-sm text-muted font-normal max-w-2xl mt-0.5 leading-relaxed">
          Create a new career opening for the GharPadharo careers site.
        </p>
      </div>

      {/* Main Form */}
      <JobForm isEdit={false} />
    </div>
  );
}
