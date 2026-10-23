import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import { serializeJob } from "@/lib/jobSerializer";
import JobsContent from "@/components/careers/JobsContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: {
    absolute: "GharPadharo Jobs | Open Positions & Careers",
  },
  description:
    "Explore active job openings and career opportunities at GharPadharo across technology, product, sales, and operations in Uttarakhand and remote.",
  alternates: {
    canonical: "https://career.gharpadharo.com/jobs",
  },
  openGraph: {
    title: "GharPadharo Jobs | Open Positions & Careers",
    description:
      "Explore active job openings and career opportunities at GharPadharo across technology, product, sales, and operations in Uttarakhand and remote.",
    url: "https://career.gharpadharo.com/jobs",
    siteName: "GharPadharo Careers",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GharPadharo Jobs | Open Positions & Careers",
    description:
      "Explore active job openings and career opportunities at GharPadharo across technology, product, sales, and operations in Uttarakhand and remote.",
  },
};

export default async function JobsPage() {
  let activeJobs = [];
  let error = null;

  try {
    await connectDB();
    const docs = await Job.find({ status: "active" }).sort({ postedAt: -1, createdAt: -1 });
    activeJobs = docs.map(serializeJob);
  } catch (err) {
    console.error("Failed to load jobs from database:", err);
    error = err?.message || "Failed to load job listings. Please try again.";
  }

  return <JobsContent allJobs={activeJobs} error={error} />;
}
