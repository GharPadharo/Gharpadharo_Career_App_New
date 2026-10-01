import Link from "next/link";
import GeneralApplicationForm from "@/components/careers/GeneralApplicationForm";

export const metadata = {
  title: "General Application | GharPadharo Careers",
  description:
    "Didn't find the right opportunity? Submit your resume and profile to GharPadharo. We are always looking for passionate talent to join our team.",
  alternates: {
    canonical: "https://career.gharpadharo.com/jobs/general-application",
  },
  openGraph: {
    title: "General Application | GharPadharo Careers",
    description:
      "Didn't find the right opportunity? Submit your resume and profile to GharPadharo. We are always looking for passionate talent to join our team.",
    url: "https://career.gharpadharo.com/jobs/general-application",
    siteName: "GharPadharo Careers",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "General Application | GharPadharo Careers",
    description:
      "Didn't find the right opportunity? Submit your resume and profile to GharPadharo.",
  },
};

export default function GeneralApplicationPage() {
  return (
    <div className="w-full bg-[#f8fafc] min-h-screen py-10 lg:py-16 border-b border-slate-200/60">
      <div className="container-custom max-w-3xl mx-auto">
        {/* Navigation / Back link */}
        <div className="mb-4">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-[#46477f] transition-colors focus:outline-none focus:underline"
          >
            <span aria-hidden="true">&larr;</span>
            <span>Back to all jobs</span>
          </Link>
        </div>

        {/* Badge */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase">
            <span>GENERAL APPLICATION</span>
          </div>
        </div>

        {/* Form Container */}
        <GeneralApplicationForm />
      </div>
    </div>
  );
}
