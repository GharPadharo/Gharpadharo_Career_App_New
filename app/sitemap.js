import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";

export default async function sitemap() {
  const baseUrl = "https://career.gharpadharo.com";
  const currentDate = new Date().toISOString();

  let jobUrls = [];

  try {
    await connectDB();
    const activeJobs = await Job.find({ status: "active" })
      .select("slug updatedAt postedAt")
      .lean();

    jobUrls = activeJobs
      .filter((job) => Boolean(job.slug))
      .map((job) => ({
        url: `${baseUrl}/jobs/${job.slug}`,
        lastModified: job.updatedAt
          ? new Date(job.updatedAt).toISOString()
          : job.postedAt
          ? new Date(job.postedAt).toISOString()
          : currentDate,
        changeFrequency: "weekly",
        priority: 0.8,
      }));
  } catch (error) {
    console.error("Failed to load active jobs for sitemap:", error?.message || error);
    jobUrls = [];
  }

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/life-at-gharpadharo`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...jobUrls,
  ];
}
