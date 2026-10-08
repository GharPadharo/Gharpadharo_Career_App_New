import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import Job from "@/models/Job";
import { serializeApplication } from "@/lib/applicationSerializer";
import { serializeJob } from "@/lib/jobSerializer";
import AdminApplicationsTable from "@/components/admin/AdminApplicationsTable";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Applications | Admin Dashboard",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function AdminApplicationsPage() {
  let allApplications = [];
  let allJobs = [];
  let loadError = false;

  try {
    await connectDB();
    const [appDocs, jobDocs] = await Promise.all([
      Application.find({}).sort({ createdAt: -1 }),
      Job.find({}).sort({ title: 1 }),
    ]);

    allApplications = appDocs.map(serializeApplication);
    allJobs = jobDocs.map(serializeJob);
  } catch (error) {
    console.error("Failed to load applications from database:", error);
    loadError = true;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-primary tracking-widest uppercase inline-block">
              APPLICATIONS
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-heading tracking-tight leading-tight">
            Applications
          </h1>
          <p className="text-sm text-muted font-normal max-w-2xl mt-1 leading-relaxed">
            Review candidate applications submitted for GharPadharo positions.
          </p>
        </div>
      </div>

      {/* Main Applications Table or Error Notice */}
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
                Unable to load candidate applications
              </h3>
              <p className="mt-1 text-sm text-red-700">
                A connection error occurred while retrieving applications from the recruitment database. Please refresh the page or try again in a few moments.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <AdminApplicationsTable
          initialApplications={allApplications}
          jobs={allJobs}
        />
      )}
    </div>
  );
}
