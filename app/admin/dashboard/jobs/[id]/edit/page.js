import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import { serializeJob } from "@/lib/jobSerializer";
import { mockJobs } from "@/lib/mockJobs";
import JobForm from "@/components/admin/JobForm";

export const dynamic = "force-dynamic";

async function getJobForEdit(id) {
  try {
    await connectDB();
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ slug: id }, { _id: id }] } : { slug: id };
    const doc = await Job.findOne(query);
    if (doc) {
      return serializeJob(doc);
    }
  } catch (error) {
    console.error("Error fetching job for edit:", error);
  }
  return mockJobs.find((j) => j.id === id) || null;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const job = await getJobForEdit(id);

  return {
    title: job ? `Edit ${job.title} | Admin Dashboard` : "Edit Job | Admin Dashboard",
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}

export default async function EditJobPage({ params }) {
  const { id } = await params;
  const job = await getJobForEdit(id);

  if (!job) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb / Back Link */}
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
          Edit Job: {job.title}
        </h1>
        <p className="text-sm text-muted font-normal max-w-2xl mt-0.5 leading-relaxed">
          Update this career opening and its application settings.
        </p>
      </div>

      {/* Main Edit Form */}
      <JobForm initialData={job} isEdit={true} />
    </div>
  );
}
