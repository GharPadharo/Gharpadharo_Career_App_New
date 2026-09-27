import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import { serializeJob } from "@/lib/jobSerializer";
import JobsContent from "@/components/careers/JobsContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: {
    absolute: "Jobs at GharPadharo | Careers",
  },
  description:
    "Explore current career opportunities at GharPadharo across technology, product, operations, and more. Find your next role with us.",
  alternates: {
    canonical: "https://career.gharpadharo.com/jobs",
  },
  openGraph: {
    title: "Jobs at GharPadharo | Careers",
    description:
      "Explore current career opportunities at GharPadharo across technology, product, operations, and more. Find your next role with us.",
    url: "https://career.gharpadharo.com/jobs",
    siteName: "GharPadharo Careers",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jobs at GharPadharo | Careers",
    description:
      "Explore current career opportunities at GharPadharo across technology, product, operations, and more. Find your next role with us.",
  },
};

export default async function JobsPage() {
  let activeJobs = [];
  try {
    await connectDB();
    const docs = await Job.find({ status: "active" }).sort({ postedAt: -1, createdAt: -1 });
    activeJobs = docs.map(serializeJob);
  } catch (error) {
    console.error("Failed to load jobs from database:", error);
    activeJobs = [];
  }

  return <JobsContent allJobs={activeJobs} />;
}
