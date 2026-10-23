import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import {
  Briefcase,
  MapPin,
  CircleCheck,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ListChecks,
  Award,
  ShieldCheck,
} from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import { serializeJob } from "@/lib/jobSerializer";
import ScrollReveal from "@/components/common/ScrollReveal";

export const dynamic = "force-dynamic";

const badgeColorMap = {
  "Full-time": "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  "Part-time": "bg-purple-50 text-purple-700 border-purple-200/80",
  Internship: "bg-blue-50 text-blue-700 border-blue-200/80",
  Contract: "bg-amber-50 text-amber-700 border-amber-200/80",
};

const employmentTypeMap = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Contract: "CONTRACTOR",
  Internship: "INTERN",
};

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
    console.error("Error fetching job from database:", error);
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const job = await getJobBySlug(id);

  if (!job || job.status === "draft") {
    return {
      title: "Job Not Found | GharPadharo Careers",
      description: "The requested job position does not exist or is not available.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const isClosed = job.status === "closed";
  const title = isClosed
    ? `${job.title} (Applications Closed) | GharPadharo Careers`
    : `${job.title} | GharPadharo Careers`;
  const description = isClosed
    ? `The position for ${job.title} at GharPadharo is now closed and no longer accepting applications.`
    : `Join GharPadharo as ${job.title} (${job.type}, ${job.location}). ${
        job.description?.length > 140
          ? `${job.description.slice(0, 137)}...`
          : job.description || ""
      }`;
  const canonicalUrl = `https://career.gharpadharo.com/jobs/${job.slug || job.id}`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    ...(isClosed && {
      robots: {
        index: false,
        follow: true,
      },
    }),
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "GharPadharo Careers",
      locale: "en_IN",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function JobDetailsPage({ params }) {
  const { id } = await params;
  const job = await getJobBySlug(id);

  if (!job || job.status === "draft") {
    notFound();
  }

  const isClosed = job.status === "closed";
  const badgeClasses =
    badgeColorMap[job.type] || "bg-slate-50 text-slate-700 border-slate-200";

  const hasSkills = Array.isArray(job.skills) && job.skills.length > 0;
  const hasTags = Array.isArray(job.tags) && job.tags.length > 0;

  // Check if skills and tags are duplicate lists
  const areSkillsAndTagsIdentical =
    hasSkills &&
    hasTags &&
    job.skills.length === job.tags.length &&
    job.skills.every((s, i) => s.trim().toLowerCase() === job.tags[i]?.trim().toLowerCase());

  // Skills unique to job.skills (if not identical)
  const uniqueSkills = hasSkills
    ? areSkillsAndTagsIdentical
      ? []
      : job.skills.filter(
          (s) => !job.tags.some((t) => t.trim().toLowerCase() === s.trim().toLowerCase())
        )
    : [];

  // Consolidated tags to display as badges
  const displayTags = hasTags
    ? job.tags
    : hasSkills
    ? job.skills
    : [];

  const postedIsoDate = job.postedAt
    ? job.postedAt.split("T")[0]
    : undefined;

  // Build full HTML description matching visible page content for Google Jobs
  let fullDescription = `<p>${job.description || ""}</p>`;
  if (Array.isArray(job.responsibilities) && job.responsibilities.length > 0) {
    fullDescription += `<h3>Key Responsibilities:</h3><ul>${job.responsibilities
      .map((r) => `<li>${r}</li>`)
      .join("")}</ul>`;
  }
  if (Array.isArray(job.requirements) && job.requirements.length > 0) {
    fullDescription += `<h3>Requirements:</h3><ul>${job.requirements
      .map((r) => `<li>${r}</li>`)
      .join("")}</ul>`;
  }

  const isRemote =
    job.workMode === "Remote" ||
    (typeof job.location === "string" && job.location.includes("Remote"));

  const canonicalJobUrl = `https://career.gharpadharo.com/jobs/${job.slug || job.id}`;

  // Build schema-compliant JobPosting JSON-LD truthfully from data for active vacancies only
  const jsonLd = !isClosed
    ? {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: job.title,
        description: fullDescription,
        datePosted: postedIsoDate,
        employmentType: employmentTypeMap[job.type] || "FULL_TIME",
        url: canonicalJobUrl,
        directApply: true,
        hiringOrganization: {
          "@type": "Organization",
          "@id": "https://career.gharpadharo.com/#organization",
          name: "GharPadharo",
          sameAs: "https://www.gharpadharo.com",
          logo: "https://career.gharpadharo.com/logo.png",
        },
        jobLocationType: isRemote ? "TELECOMMUTE" : undefined,
        applicantLocationRequirements: isRemote
          ? {
              "@type": "Country",
              name: "India",
            }
          : undefined,
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            ...(isRemote
              ? {}
              : {
                  addressLocality: job.location || "Dehradun",
                  addressRegion: "Uttarakhand",
                }),
            addressCountry: "IN",
          },
        },
      }
    : null;

  return (
    <div className="w-full bg-[#F8F7FC] min-h-screen py-8 sm:py-10 lg:py-14 border-b border-slate-200/60">
      {/* JobPosting Structured Data - only emitted for active vacancies */}
      {!isClosed && jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#5929D6] hover:text-[#4D20BE] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6]/30 rounded px-1 py-0.5"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Jobs</span>
          </Link>
        </nav>

        {/* Job Header Card */}
        <ScrollReveal variant="fade-up">
          <section
            aria-labelledby="job-title"
            className="bg-white rounded-2xl border border-[#E8E2FA] p-6 sm:p-8 lg:p-9 shadow-[0_2px_12px_rgba(89,41,214,0.03)] mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1
                    id="job-title"
                    className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#11152F] tracking-tight"
                  >
                    {job.title}
                  </h1>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badgeClasses}`}
                  >
                    {job.type}
                  </span>
                  {isClosed && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500" aria-hidden="true" />
                      Closed
                    </span>
                  )}
                </div>

                {/* Closed position notice banner */}
                {isClosed && (
                  <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl flex items-center gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                    <ShieldCheck className="w-5 h-5 text-slate-500 shrink-0" aria-hidden="true" />
                    <span>
                      This position is closed and no longer accepting applications.
                    </span>
                  </div>
                )}

                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm text-[#64748B] font-medium pt-0.5">
                  {/* Team */}
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-[#94A3B8] shrink-0" aria-hidden="true" />
                    <span>{job.team}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#94A3B8] shrink-0" aria-hidden="true" />
                    <span>{job.location}</span>
                  </div>

                  {/* Experience */}
                  <div className="flex items-center gap-1.5">
                    <CircleCheck className="w-4 h-4 text-[#94A3B8] shrink-0" aria-hidden="true" />
                    <span>{job.experience}</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#94A3B8] shrink-0" aria-hidden="true" />
                    <time dateTime={postedIsoDate}>{job.postedText}</time>
                  </div>
                </div>
              </div>

              {/* Header Apply CTA */}
              <div className="shrink-0">
                {isClosed ? (
                  <span
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 border border-slate-200 text-slate-500 text-sm sm:text-base font-bold px-7 py-3.5 rounded-xl cursor-not-allowed select-none text-center"
                    aria-disabled="true"
                  >
                    Applications Closed
                  </span>
                ) : (
                  <Link
                    href={`/jobs/${job.id}/apply`}
                    aria-label={`Apply for ${job.title}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#5929D6] hover:bg-[#4D20BE] active:bg-[#3F189F] text-white text-sm sm:text-base font-bold px-7 py-3.5 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.98] text-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-2"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* 2-Column Content Layout (70% main, 30% sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content (~70%) */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* About the Role */}
            <ScrollReveal variant="fade-up">
              <section
                aria-labelledby="about-role-heading"
                className="bg-white rounded-2xl border border-[#E8E2FA] p-6 sm:p-8 shadow-[0_2px_12px_rgba(89,41,214,0.03)]"
              >
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-[#F0EBFF] text-[#5929D6] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#5929D6]" aria-hidden="true" />
                  </div>
                  <h2
                    id="about-role-heading"
                    className="text-lg sm:text-xl font-bold text-[#11152F] tracking-tight"
                  >
                    About the Role
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-[#475569] leading-relaxed font-normal">
                  {job.description}
                </p>
              </section>
            </ScrollReveal>

            {/* Responsibilities */}
            <ScrollReveal variant="fade-up">
              <section
                aria-labelledby="responsibilities-heading"
                className="bg-white rounded-2xl border border-[#E8E2FA] p-6 sm:p-8 shadow-[0_2px_12px_rgba(89,41,214,0.03)]"
              >
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-[#F0EBFF] text-[#5929D6] flex items-center justify-center shrink-0">
                    <ListChecks className="w-4 h-4 text-[#5929D6]" aria-hidden="true" />
                  </div>
                  <h2
                    id="responsibilities-heading"
                    className="text-lg sm:text-xl font-bold text-[#11152F] tracking-tight"
                  >
                    Responsibilities
                  </h2>
                </div>
                <ul className="space-y-3 text-sm sm:text-base text-[#475569] leading-relaxed">
                  {job.responsibilities && job.responsibilities.length > 0 ? (
                    job.responsibilities.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-[#5929D6] mt-2.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start gap-3">
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-[#5929D6] mt-2.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span>
                          Collaborate directly within the {job.team} team to deliver
                          impactful solutions and drive high-priority objectives.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-[#5929D6] mt-2.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span>
                          Design, build, and maintain scalable workflows aligned with
                          GharPadharo platform standards.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-[#5929D6] mt-2.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span>
                          Utilize relevant tools and technologies including{" "}
                          {job.tags.join(", ")} to solve practical challenges.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-[#5929D6] mt-2.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span>
                          Communicate progress, coordinate with team members, and ensure
                          timely delivery of milestones.
                        </span>
                      </li>
                    </>
                  )}
                </ul>
              </section>
            </ScrollReveal>

            {/* Skills & Experience */}
            <ScrollReveal variant="fade-up">
              <section
                aria-labelledby="skills-heading"
                className="bg-white rounded-2xl border border-[#E8E2FA] p-6 sm:p-8 shadow-[0_2px_12px_rgba(89,41,214,0.03)]"
              >
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-[#F0EBFF] text-[#5929D6] flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-[#5929D6]" aria-hidden="true" />
                  </div>
                  <h2
                    id="skills-heading"
                    className="text-lg sm:text-xl font-bold text-[#11152F] tracking-tight"
                  >
                    Skills &amp; Experience
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Experience Level */}
                  <div>
                    <p className="text-xs font-bold text-[#11152F] uppercase tracking-wider mb-2.5">
                      Experience Level
                    </p>
                    <span className="inline-block bg-[#F0EBFF] text-[#5929D6] text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-lg border border-[#DDD6FE]">
                      {job.experience}
                    </span>
                  </div>

                  {/* Key Competencies (rendered if distinct from tags) */}
                  {uniqueSkills.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-[#11152F] uppercase tracking-wider mb-2.5">
                        Key Competencies
                      </p>
                      <ul className="space-y-2.5 text-sm text-[#475569] leading-relaxed">
                        {uniqueSkills.map((skill, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-[#5929D6] mt-2 shrink-0"
                              aria-hidden="true"
                            />
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Required Skills & Technologies (Badges) */}
                  {displayTags.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-[#11152F] uppercase tracking-wider mb-2.5">
                        {areSkillsAndTagsIdentical
                          ? "Key Skills & Competencies"
                          : "Required Skills & Technologies"}
                      </p>
                      <div
                        className="flex flex-wrap items-center gap-2"
                        aria-label="Required skills list"
                      >
                        {displayTags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block bg-[#F0EBFF] text-[#5929D6] hover:bg-[#E5DBFF] hover:text-[#4619B8] text-xs sm:text-sm px-3.5 py-1.5 rounded-lg font-medium border border-[#DDD6FE] hover:border-[#C4B5FD] hover:shadow-[0_2px_8px_rgba(89,41,214,0.12)] hover:-translate-y-px transition-all duration-200 ease-in-out cursor-default select-none break-words max-w-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </ScrollReveal>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <ScrollReveal variant="fade-up">
                <section
                  aria-labelledby="requirements-heading"
                  className="bg-white rounded-2xl border border-[#E8E2FA] p-6 sm:p-8 shadow-[0_2px_12px_rgba(89,41,214,0.03)]"
                >
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-[#F0EBFF] text-[#5929D6] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 text-[#5929D6]" aria-hidden="true" />
                    </div>
                    <h2
                      id="requirements-heading"
                      className="text-lg sm:text-xl font-bold text-[#11152F] tracking-tight"
                    >
                      Requirements
                    </h2>
                  </div>
                  <ul className="space-y-3 text-sm sm:text-base text-[#475569] leading-relaxed">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-[#5929D6] mt-2.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </ScrollReveal>
            )}
          </div>

          {/* Right Sidebar (~30%) */}
          <aside
            aria-label="Job Overview and Actions"
            className="lg:col-span-4"
          >
            <ScrollReveal variant="fade-up" delay={80}>
              <div className="bg-white rounded-2xl border border-[#E8E2FA] p-6 sm:p-7 shadow-[0_2px_12px_rgba(89,41,214,0.03)] lg:sticky lg:top-24 space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-[#F0EBFF] text-[#5929D6] flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4 text-[#5929D6]" aria-hidden="true" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#11152F] tracking-tight">
                  Job Overview
                </h2>
              </div>

              {/* Overview Details List */}
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Team
                  </dt>
                  <dd className="text-sm font-semibold text-[#11152F] mt-1">
                    {job.team}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Location
                  </dt>
                  <dd className="text-sm font-semibold text-[#11152F] mt-1">
                    {job.location}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Job Type
                  </dt>
                  <dd className="text-sm font-semibold text-[#11152F] mt-1">
                    {job.type}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Experience Level
                  </dt>
                  <dd className="text-sm font-semibold text-[#11152F] mt-1">
                    {job.experience}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Date Posted
                  </dt>
                  <dd className="text-sm font-semibold text-[#11152F] mt-1">
                    {job.postedText}
                  </dd>
                </div>
              </dl>

              {/* Sidebar Action Buttons */}
              <div className="pt-2 space-y-3">
                {isClosed ? (
                  <span
                    className="w-full inline-flex items-center justify-center bg-slate-100 border border-slate-200 text-slate-500 text-sm font-bold px-5 py-3.5 rounded-xl cursor-not-allowed select-none text-center"
                    aria-disabled="true"
                  >
                    Applications Closed
                  </span>
                ) : (
                  <Link
                    href={`/jobs/${job.id}/apply`}
                    aria-label={`Apply for ${job.title}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#5929D6] hover:bg-[#4D20BE] active:bg-[#3F189F] text-white text-sm sm:text-base font-bold px-5 py-3.5 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 text-center cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-2"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                )}

                <Link
                  href="/jobs"
                  className="w-full inline-flex items-center justify-center py-2.5 text-xs sm:text-sm font-semibold text-[#5929D6] hover:text-[#4D20BE] hover:underline transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6]/30 rounded"
                >
                  Back to all jobs
                </Link>
              </div>
            </div>
            </ScrollReveal>
          </aside>
        </div>
      </div>
    </div>
  );
}
