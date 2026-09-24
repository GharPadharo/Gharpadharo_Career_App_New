import Link from "next/link";
import { notFound } from "next/navigation";
import { mockJobs } from "@/lib/mockJobs";
import JobForm from "@/components/admin/JobForm";

export function generateStaticParams() {
  return mockJobs.map((job) => ({ id: job.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const job = mockJobs.find((j) => j.id === id);

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
  const job = mockJobs.find((j) => j.id === id);

  if (!job) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb / Back Link */}
      <div>
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Job Listings</span>
        </Link>
      </div>

      {/* Main Edit Form */}
      <JobForm initialData={job} isEdit={true} />
    </div>
  );
}
