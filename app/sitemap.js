import { mockJobs } from "@/lib/mockJobs";

export default function sitemap() {
  const baseUrl = "https://career.gharpadharo.com";
  const currentDate = new Date().toISOString();

  const jobUrls = mockJobs.map((job) => ({
    url: `${baseUrl}/careers/jobs/${job.id}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: `${baseUrl}/careers`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...jobUrls,
  ];
}
