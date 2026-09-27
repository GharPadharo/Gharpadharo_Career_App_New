import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import Job from "@/models/Job";
import { serializeApplication } from "@/lib/applicationSerializer";
import { serializeJob } from "@/lib/jobSerializer";
import { mockApplications } from "@/lib/mockApplications";
import { mockJobs } from "@/lib/mockJobs";
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

  try {
    await connectDB();
    const [appDocs, jobDocs] = await Promise.all([
      Application.find({}).sort({ createdAt: -1 }),
      Job.find({}).sort({ title: 1 }),
    ]);

    allApplications = appDocs.map(serializeApplication);
    allJobs = jobDocs.map(serializeJob);
  } catch (error) {
    console.error("Failed to load applications from database, using fallback:", error);
    allApplications = mockApplications;
    allJobs = mockJobs;
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

      {/* Main Applications Table */}
      <AdminApplicationsTable
        initialApplications={allApplications}
        jobs={allJobs}
      />
    </div>
  );
}
