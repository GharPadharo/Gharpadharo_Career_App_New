"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { markApplicationAsViewed } from "@/lib/viewedApplications";

/**
 * ApplicationDetailClient Component
 * 
 * Candidate application detail view:
 * - Automatically transitions status from "new" to "viewed" upon opening in this session
 * - Candidate info, role applied for, and contact details taking full available width
 * - Resume preview placeholder (no fake downloadable file)
 * - Cover letter & profile links
 */
export default function ApplicationDetailClient({ application, job }) {
  const [wasJustViewed, setWasJustViewed] = useState(false);

  useEffect(() => {
    // When opened, mark application as viewed in session and DB
    if (application.id) {
      markApplicationAsViewed(application.id);
      if (application.status === "new") {
        setWasJustViewed(true);
      }

      // Persist to MongoDB
      fetch(`/api/admin/applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "viewed" }),
      }).catch((err) => {
        console.error("Failed to mark application as viewed:", err);
      });
    }
  }, [application.id, application.status]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Top Breadcrumb & Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <Link
          href="/admin/dashboard/applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Applications</span>
        </Link>
      </div>

      {/* 2. Notification banner when application is marked as viewed */}
      {wasJustViewed && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-slate-100 border border-slate-200/90 text-slate-700 text-xs sm:text-sm font-medium flex items-center justify-between shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>
              Application marked as <strong>Viewed</strong> for this session.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setWasJustViewed(false)}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold ml-3 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Header Card: Candidate Display */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
        <div className="pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">
              APPLICATION
            </span>
            {application.applicationType === "general" && (
              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold">
                General Application
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-heading tracking-tight leading-tight">
            {application.candidate}
          </h1>
          <p className="text-sm font-semibold text-slate-700 mt-1">
            Applied for:{" "}
            <span className="text-primary font-bold">
              {application.applicationType === "general"
                ? "General Application"
                : job?.title || application.jobTitle || application.jobId}
            </span>{" "}
            <span className="text-xs text-muted font-normal">
              ({application.applicationType === "general"
                ? "General Talent Pool"
                : job?.team || application.jobTeam || "General"})
            </span>
          </p>
        </div>

        {/* Candidate Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-sm">
          <div>
            <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-1">
              Email
            </span>
            <a
              href={`mailto:${application.email}`}
              className="text-slate-800 hover:text-primary font-medium transition-colors break-all"
            >
              {application.email}
            </a>
          </div>

          <div>
            <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-1">
              Phone
            </span>
            <span className="text-slate-800 font-medium">
              {application.phone || "Not provided"}
            </span>
          </div>

          <div>
            <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-1">
              Experience
            </span>
            <span className="text-slate-800 font-medium">
              {application.experience || "Flexible"}
            </span>
          </div>

          <div>
            <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-1">
              Applied Date
            </span>
            <span className="text-slate-800 font-medium block">
              {application.appliedText}
            </span>
            <span className="text-[11px] text-muted">
              {application.appliedAt?.slice(0, 10)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Resume Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-4">
        <div>
          <h2 className="text-lg font-bold text-heading">Resume</h2>
          <p className="text-xs text-muted mt-0.5">
            Uploaded candidate document.
          </p>
        </div>

        {(() => {
          const resumeUrl = application.resumeMetadata?.fileUrl || "";
          const resumeName =
            application.resumeMetadata?.fileName ||
            (typeof application.resume === "string" ? application.resume : "") ||
            "";
          const hasResume = Boolean(resumeName || resumeUrl);

          if (!hasResume) {
            return (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 italic">
                No resume uploaded for this candidate.
              </div>
            );
          }

          return (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200/60 text-red-600 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 tracking-tight">
                    {resumeName || "Candidate_Resume.pdf"}
                  </p>
                  <p className="text-xs text-muted">
                    {application.resumeMetadata?.mimeType || "Document"}
                    {application.resumeMetadata?.fileSize ? ` • ${(application.resumeMetadata.fileSize / 1024).toFixed(1)} KB` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>View Resume &rarr;</span>
                  </a>
                ) : (
                  <span className="text-xs text-slate-500 font-medium italic">
                    Demo resume placeholder (No remote file)
                  </span>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* 5. Online Profiles (LinkedIn / Portfolio) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-4">
        <div>
          <h2 className="text-lg font-bold text-heading">Online Profiles</h2>
          <p className="text-xs text-muted mt-0.5">
            Links provided by the candidate.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-muted uppercase tracking-wider block">
                LinkedIn
              </span>
              <span className="text-xs text-slate-800 font-medium mt-0.5 block truncate max-w-[170px] sm:max-w-xs md:max-w-sm">
                {application.linkedin}
              </span>
            </div>
            <a
              href={application.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-primary hover:underline shrink-0 ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded px-1"
            >
              Open &rarr;
            </a>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-muted uppercase tracking-wider block">
                Portfolio / Website
              </span>
              <span className="text-xs text-slate-800 font-medium mt-0.5 block truncate max-w-[170px] sm:max-w-xs md:max-w-sm">
                {application.portfolio}
              </span>
            </div>
            <a
              href={application.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-primary hover:underline shrink-0 ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded px-1"
            >
              Open &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Opportunity of Interest (General Applications) */}
      {application.opportunityLookingFor && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-3">
          <div>
            <h2 className="text-lg font-bold text-heading">Opportunity of Interest</h2>
            <p className="text-xs text-muted mt-0.5">
              Role or areas of focus the candidate is seeking.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line">
            {application.opportunityLookingFor}
          </div>
        </div>
      )}

      {/* About Candidate (General Applications) */}
      {application.aboutYourself && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-3">
          <div>
            <h2 className="text-lg font-bold text-heading">About Candidate</h2>
            <p className="text-xs text-muted mt-0.5">
              Candidate&apos;s background and personal introduction.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line">
            {application.aboutYourself}
          </div>
        </div>
      )}

      {/* 6. Cover Letter Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-4">
        <div>
          <h2 className="text-lg font-bold text-heading">Cover Letter / Note</h2>
          <p className="text-xs text-muted mt-0.5">
            Candidate&apos;s statement of interest and background.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-50/80 border border-slate-200/80 text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line">
          &ldquo;{application.coverLetter}&rdquo;
        </div>
      </div>
    </div>
  );
}
