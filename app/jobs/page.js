import CareersHero from "@/components/careers/CareersHero";
import JobListings from "@/components/careers/JobListings";

export const metadata = {
  title: "GharPadharo Careers | Join Our Team",
  description:
    "Explore career opportunities at GharPadharo. Discover jobs, teams, and opportunities to build your career with us.",
  keywords: [
    "GharPadharo Careers",
    "Ghar Padharo jobs",
    "startup careers India",
    "tech jobs Dehradun",
    "remote jobs India",
  ],
  alternates: {
    canonical: "https://career.gharpadharo.com/jobs",
  },
  openGraph: {
    title: "GharPadharo Careers | Join Our Team",
    description:
      "Explore career opportunities at GharPadharo. Discover jobs, teams, and opportunities to build your career with us.",
    url: "https://career.gharpadharo.com/jobs",
    siteName: "GharPadharo Careers",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GharPadharo Careers | Join Our Team",
    description:
      "Explore career opportunities at GharPadharo. Discover jobs, teams, and opportunities to build your career with us.",
  },
};

export default function JobsPage() {
  return (
    <>
      <CareersHero />
      <JobListings />
    </>
  );
}
