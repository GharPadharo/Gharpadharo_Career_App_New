import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import { serializeJob } from "@/lib/jobSerializer";
import JobApplicationForm from "@/components/careers/JobApplicationForm";

export const dynamic = "force-dynamic";

async function getJobBySlug(id) {
  try {
    await connectDB();
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { $or: [{ slug: id }, { _id: id }] } : { slug: id };
    const doc = await Job.findOne(query);
    if (doc) {
      return serializeJob(doc);
    }
  } catch (error) {
    console.error("Error fetching job for apply page:", error);
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const job = await getJobBySlug(id);

  if (!job || job.status === "draft") {
    return {
      title: "Job Not Found | GharPadharo Careers",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  if (job.status === "closed") {
    return {
      title: `Applications Closed: ${job.title} | GharPadharo Careers`,
      description: `Applications are closed for the ${job.title} position at GharPadharo.`,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `Apply for ${job.title} | GharPadharo Careers`,
    description: `Apply for the ${job.title} position at GharPadharo.`,
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

export default async function JobApplyPage({ params }) {
  const { id } = await params;
  const job = await getJobBySlug(id);

  if (!job || job.status === "draft") {
    notFound();
  }

  // Unavailable / closed state for closed jobs
  if (job.status === "closed") {
    return (
      <div className="w-full bg-[#f8fafc] min-h-screen py-10 lg:py-14 border-b border-slate-200/60">
        <div className="container-custom max-w-xl mx-auto">
          <div className="mb-6">
            <Link
              href={`/jobs/${job.id}`}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary-hover transition-colors focus:outline-none focus:underline mb-4"
            >
              <span aria-hidden="true">&larr;</span>
              <span>Back to Job Details</span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Applications Closed
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Applications for <strong>{job.title}</strong> are now closed. This role is no longer accepting new submissions.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/jobs/${job.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                View Position Details
              </Link>
              <Link
                href="/jobs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
              >
                <span>Browse Open Positions</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen py-10 lg:py-14 border-b border-slate-200/60">
      <div className="container-custom max-w-3xl mx-auto">
        {/* Navigation & Application Header */}
        <div className="mb-6">
          <Link
            href={`/jobs/${job.id}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary-hover transition-colors focus:outline-none focus:underline mb-4"
          >
            <span aria-hidden="true">&larr;</span>
            <span>Back to Job Details</span>
          </Link>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Apply for {job.title}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 font-medium">
              <span>{job.team}</span>
              <span className="mx-2 text-slate-300">·</span>
              <span>{job.location}</span>
              <span className="mx-2 text-slate-300">·</span>
              <span>{job.type}</span>
            </p>
          </div>
        </div>

        {/* Form Component */}
        <JobApplicationForm job={job} />
      </div>
    </div>
  );
}
