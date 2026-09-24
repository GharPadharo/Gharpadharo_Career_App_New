import Link from "next/link";
import { notFound } from "next/navigation";
import { mockJobs } from "@/lib/mockJobs";

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

export function generateStaticParams() {
  return mockJobs.map((job) => ({ id: job.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const job = mockJobs.find((j) => j.id === id);

  if (!job) {
    return {
      title: "Job Not Found | GharPadharo Careers",
      description: "The requested job position does not exist or has closed.",
    };
  }

  const title = `${job.title} | GharPadharo Careers`;
  const description = `${job.title} opportunity in ${job.team} at GharPadharo. ${job.description}`;
  const canonicalUrl = `https://career.gharpadharo.com/jobs/${job.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
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
  const job = mockJobs.find((j) => j.id === id);

  if (!job) {
    notFound();
  }

  const badgeClasses =
    badgeColorMap[job.type] || "bg-slate-50 text-slate-700 border-slate-200";

  // Build schema-compliant JobPosting JSON-LD truthfully from mock data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: new Date(Date.now() - job.postedDays * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    employmentType: employmentTypeMap[job.type] || "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "GharPadharo",
      sameAs: "https://www.gharpadharo.com",
    },
    jobLocationType: job.location.includes("Remote")
      ? "TELECOMMUTE"
      : undefined,
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
      },
    },
    ...(job.location.includes("India") && {
      applicantLocationRequirements: {
        "@type": "Country",
        name: "India",
      },
    }),
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen py-10 lg:py-14 border-b border-slate-200/60">
      {/* JobPosting Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-custom">
        {/* Back Link */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary-hover transition-colors focus:outline-none focus:underline"
          >
            <span aria-hidden="true">&larr;</span>
            <span>Back to Jobs</span>
          </Link>
        </nav>

        {/* Job Header Card */}
        <section
          aria-labelledby="job-title"
          className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-xs mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1
                  id="job-title"
                  className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight"
                >
                  {job.title}
                </h1>
                <span
                  className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold border ${badgeClasses}`}
                >
                  {job.type}
                </span>
              </div>

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-600 font-medium pt-1">
                {/* Team */}
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 text-slate-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{job.team}</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 text-slate-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{job.location}</span>
                </div>

                {/* Experience */}
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 text-slate-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"
                    />
                  </svg>
                  <span>{job.experience}</span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-1.5 text-slate-400">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <time dateTime={jsonLd.datePosted}>{job.postedText}</time>
                </div>
              </div>
            </div>

            {/* Header Apply CTA */}
            <div className="shrink-0">
              <Link
                href={`/jobs/${job.id}/apply`}
                aria-label={`Apply for ${job.title}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm sm:text-base font-bold px-7 py-3.5 rounded-xl shadow-xs transition-all duration-200 active:scale-95 text-center focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <span>Apply Now</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content (65–70%) */}
          <div className="lg:col-span-8 space-y-8">
            {/* About the Role */}
            <section
              aria-labelledby="about-role-heading"
              className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs"
            >
              <h2
                id="about-role-heading"
                className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100 mb-4"
              >
                About the Role
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                {job.description}
              </p>
            </section>

            {/* Responsibilities */}
            <section
              aria-labelledby="responsibilities-heading"
              className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs"
            >
              <h2
                id="responsibilities-heading"
                className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100 mb-4"
              >
                Responsibilities
              </h2>
              <ul className="space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed list-disc pl-5">
                {job.responsibilities && job.responsibilities.length > 0 ? (
                  job.responsibilities.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))
                ) : (
                  <>
                    <li>
                      Collaborate directly within the {job.team} team to deliver
                      impactful solutions and drive high-priority objectives.
                    </li>
                    <li>
                      Design, build, and maintain scalable workflows aligned with
                      GharPadharo platform standards.
                    </li>
                    <li>
                      Utilize relevant tools and technologies including{" "}
                      {job.tags.join(", ")} to solve practical challenges.
                    </li>
                    <li>
                      Communicate progress, coordinate with team members, and ensure
                      timely delivery of milestones.
                    </li>
                  </>
                )}
              </ul>
            </section>

            {/* Skills & Experience */}
            <section
              aria-labelledby="skills-heading"
              className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs"
            >
              <h2
                id="skills-heading"
                className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100 mb-4"
              >
                Skills & Experience
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Experience Level
                  </p>
                  <span className="inline-block bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg border border-slate-200/80">
                    {job.experience}
                  </span>
                </div>

                {job.skills && job.skills.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Key Competencies
                    </p>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed list-disc pl-5">
                      {job.skills.map((skill, idx) => (
                        <li key={idx}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Required Skills & Technologies
                  </p>
                  <div
                    className="flex flex-wrap items-center gap-2"
                    aria-label="Required skills list"
                  >
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-slate-100/90 text-slate-700 text-xs sm:text-sm px-3 py-1.5 rounded-lg font-medium border border-slate-200/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <section
                aria-labelledby="requirements-heading"
                className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs"
              >
                <h2
                  id="requirements-heading"
                  className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100 mb-4"
                >
                  Requirements
                </h2>
                <ul className="space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed list-disc pl-5">
                  {job.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right Sidebar (30–35%) */}
          <aside
            aria-label="Job Overview and Actions"
            className="lg:col-span-4"
          >
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs lg:sticky lg:top-24 space-y-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                Job Overview
              </h2>

              {/* Overview Details List */}
              <dl className="space-y-4 text-xs sm:text-sm">
                <div>
                  <dt className="text-slate-400 font-medium">Team</dt>
                  <dd className="text-slate-800 font-semibold mt-0.5">
                    {job.team}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Location</dt>
                  <dd className="text-slate-800 font-semibold mt-0.5">
                    {job.location}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Job Type</dt>
                  <dd className="text-slate-800 font-semibold mt-0.5">
                    {job.type}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">
                    Experience Level
                  </dt>
                  <dd className="text-slate-800 font-semibold mt-0.5">
                    {job.experience}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400 font-medium">Date Posted</dt>
                  <dd className="text-slate-800 font-semibold mt-0.5">
                    {job.postedText}
                  </dd>
                </div>
              </dl>

              {/* Sidebar Action Buttons */}
              <div className="pt-2 space-y-3">
                <Link
                  href={`/jobs/${job.id}/apply`}
                  aria-label={`Apply for ${job.title}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-5 py-3 rounded-xl shadow-xs transition-all duration-200 text-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <span>Apply Now</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>

                <Link
                  href="/jobs"
                  className="w-full inline-flex items-center justify-center py-2.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors text-center focus:outline-none focus:underline"
                >
                  Back to all jobs
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
