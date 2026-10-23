import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { ArrowLeft, ArrowRight, Briefcase, MapPin, Clock, Lock } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import { serializeJob } from "@/lib/jobSerializer";
import JobApplicationForm from "@/components/careers/JobApplicationForm";
import ScrollReveal from "@/components/common/ScrollReveal";

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
      <div className="w-full bg-[#F8F7FC] min-h-screen py-10 lg:py-14 border-b border-slate-200/60">
        <div className="w-full max-w-xl mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <Link
              href={`/jobs/${job.id}`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#5929D6] hover:text-[#4D20BE] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6]/30 rounded px-1 py-0.5"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back to Job Details</span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E2FA] p-8 sm:p-12 text-center shadow-[0_2px_12px_rgba(89,41,214,0.03)] space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-slate-600" aria-hidden="true" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#11152F] tracking-tight">
              Applications Closed
            </h1>
            <p className="text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
              Applications for <strong className="text-[#11152F]">{job.title}</strong> are now closed. This role is no longer accepting new submissions.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/jobs/${job.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-[#E8E2FA] text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                View Position Details
              </Link>
              <Link
                href="/jobs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#5929D6] hover:bg-[#4D20BE] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
              >
                <span>Browse Open Positions</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F8F7FC] min-h-screen py-8 sm:py-10 lg:py-14 border-b border-slate-200/60">
      <div className="w-full max-w-[800px] mx-auto px-4 sm:px-6">
        {/* Navigation & Application Header */}
        <div className="mb-6">
          <nav aria-label="Breadcrumb" className="mb-4">
            <Link
              href={`/jobs/${job.id}`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#5929D6] hover:text-[#4D20BE] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6]/30 rounded px-1 py-0.5"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back to Job Details</span>
            </Link>
          </nav>

          <ScrollReveal variant="fade-up">
            <div className="bg-white rounded-2xl border border-[#E8E2FA] p-6 sm:p-8 shadow-[0_2px_12px_rgba(89,41,214,0.03)]">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#11152F] tracking-tight">
                Apply for {job.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-[#64748B] font-medium">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-[#94A3B8] shrink-0" aria-hidden="true" />
                  <span>{job.team}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#94A3B8] shrink-0" aria-hidden="true" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#94A3B8] shrink-0" aria-hidden="true" />
                  <span>{job.type}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Form Component */}
        <ScrollReveal variant="fade-up" delay={60}>
          <JobApplicationForm job={job} />
        </ScrollReveal>
      </div>
    </div>
  );
}
