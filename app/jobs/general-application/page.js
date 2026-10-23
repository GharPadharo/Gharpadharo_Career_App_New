import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SectionBadge from "@/components/common/SectionBadge";
import GeneralApplicationForm from "@/components/careers/GeneralApplicationForm";
import ScrollReveal from "@/components/common/ScrollReveal";

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
    <div className="w-full bg-[#F8F7FC] min-h-screen py-8 sm:py-10 lg:py-14 border-b border-slate-200/60">
      <div className="w-full max-w-[800px] mx-auto px-4 sm:px-6">
        {/* Navigation / Back link */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#5929D6] hover:text-[#4D20BE] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6]/30 rounded px-1 py-0.5"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to all jobs</span>
          </Link>
        </nav>

        {/* Compact Lavender Eyebrow Badge */}
        <ScrollReveal variant="fade-up">
          <div className="mb-5 sm:mb-6">
            <SectionBadge>
              General Application
            </SectionBadge>
          </div>
        </ScrollReveal>

        {/* Form Container */}
        <ScrollReveal variant="fade-up" delay={60}>
          <GeneralApplicationForm />
        </ScrollReveal>
      </div>
    </div>
  );
}
