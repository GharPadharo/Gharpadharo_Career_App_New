import Link from "next/link";
import { notFound } from "next/navigation";
import { mockJobs } from "@/lib/mockJobs";
import JobApplicationForm from "@/components/careers/JobApplicationForm";

export function generateStaticParams() {
  return mockJobs.map((job) => ({ id: job.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const job = mockJobs.find((j) => j.id === id);

  if (!job) {
    return {
      title: "Job Not Found | GharPadharo Careers",
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
  const job = mockJobs.find((j) => j.id === id);

  if (!job) {
    notFound();
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
