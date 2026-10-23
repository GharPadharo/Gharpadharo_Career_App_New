"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, MapPin, CircleCheck, ChevronUp } from "lucide-react";

const badgeColorMap = {
  "Full-time": "bg-[#ECFDF5] text-[#059669] border-[#D1FAE5]",
  "Part-time": "bg-[#FDF4FF] text-[#C026D3] border-[#F5D0FE]",
  Internship: "bg-[#EEF2FF] text-[#4F46E5] border-[#E0E7FF]",
  Contract: "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]",
};

export default function JobCard({ job }) {
  const [isSkillsExpanded, setIsSkillsExpanded] = useState(false);

  // Unified toggle handler for both +N and Show less controls
  const toggleSkills = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsSkillsExpanded((prev) => !prev);
  };

  // Keyboard accessibility handler for Enter and Space
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      toggleSkills(e);
    }
  };

  const badgeClasses =
    badgeColorMap[job.type] || "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]";

  // Skill tags: fallback to job.skills if job.tags is absent
  const rawTags =
    Array.isArray(job.tags) && job.tags.length > 0
      ? job.tags
      : Array.isArray(job.skills)
      ? job.skills
      : [];
  const allTags = rawTags.filter(Boolean);
  const hasMoreTags = allTags.length > 3;
  const displayedTags = isSkillsExpanded ? allTags : allTags.slice(0, 3);
  const remainingCount = allTags.length - 3;

  return (
    <article className="bg-white rounded-2xl border border-[#E8E3F2] p-6 sm:p-7 shadow-[0_2px_12px_rgba(89,41,214,0.03)] hover:shadow-[0_8px_24px_rgba(89,41,214,0.08)] hover:border-[#D5CAFA] transition-all duration-200 flex flex-col justify-between gap-3.5 sm:gap-4">
      {/* Top Header Row: Badge on left, Posted text on right */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badgeClasses}`}
        >
          {job.type}
        </span>
        <time
          dateTime={job.postedAt || "2026-09-21"}
          className="text-xs text-[#94A3B8] font-normal whitespace-nowrap"
        >
          {job.postedText || "Posted recently"}
        </time>
      </div>

      {/* Title & Metadata */}
      <div>
        <h3 className="text-lg sm:text-[21px] font-bold text-[#11152F] tracking-tight hover:text-[#5929D6] transition-colors leading-snug">
          <Link
            href={`/jobs/${job.id}`}
            className="focus:outline-none focus:underline"
          >
            {job.title}
          </Link>
        </h3>

        {/* Icon-Based Metadata Row */}
        {(job.team || job.location || job.experience) && (
          <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-1.5 text-xs sm:text-[13.5px] text-[#64748B] mt-2">
            {job.team && (
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#94A3B8] shrink-0" aria-hidden="true" />
                <span>{job.team}</span>
              </span>
            )}
            {job.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#94A3B8] shrink-0" aria-hidden="true" />
                <span>{job.location}</span>
              </span>
            )}
            {job.experience && (
              <span className="inline-flex items-center gap-1.5">
                <CircleCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#94A3B8] shrink-0" aria-hidden="true" />
                <span>{job.experience}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Short Job Description: clamped to 2 lines with ellipsis across all breakpoints */}
      {job.description && (
        <p className="text-xs sm:text-[13.5px] text-[#64748B] leading-relaxed font-normal line-clamp-2">
          {job.description}
        </p>
      )}

      {/* Skills / Tags Row */}
      {allTags.length > 0 && (
        <div
          className="flex flex-wrap items-center gap-1.5 pt-1"
          aria-label="Required skills"
        >
          {displayedTags.map((tag) => (
            <span
              key={tag}
              className="inline-block bg-[#F0EBFF] text-[#5929D6] hover:bg-[#E5DBFF] hover:text-[#4619B8] border border-transparent hover:border-[#D5CAFA] hover:shadow-[0_2px_6px_rgba(89,41,214,0.12)] hover:-translate-y-px text-xs font-medium px-2.5 sm:px-3 py-1 rounded-md transition-all duration-200 ease-out cursor-default select-none"
            >
              {tag}
            </span>
          ))}
          {hasMoreTags &&
            (isSkillsExpanded ? (
              <button
                type="button"
                onClick={toggleSkills}
                onKeyDown={handleKeyDown}
                aria-expanded={true}
                aria-label="Show fewer skills"
                className="inline-flex items-center gap-1 bg-transparent hover:bg-[#F0EBFF] text-[#5929D6] hover:text-[#4619B8] text-xs font-semibold px-2 py-1 rounded-md underline underline-offset-2 decoration-[#5929D6]/40 hover:decoration-[#4619B8] transition-all duration-200 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-1 select-none"
              >
                <span>Show less</span>
                <ChevronUp className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={toggleSkills}
                onKeyDown={handleKeyDown}
                aria-expanded={false}
                aria-label={`Show ${remainingCount} more skills`}
                className="inline-flex items-center justify-center bg-[#F0EBFF] hover:bg-[#E5DBFF] text-[#5929D6] hover:text-[#4619B8] border border-transparent hover:border-[#D5CAFA] hover:shadow-[0_2px_8px_rgba(89,41,214,0.18)] hover:-translate-y-px active:scale-95 text-xs font-semibold px-2 sm:px-2.5 py-1 rounded-md transition-all duration-200 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-1 select-none"
              >
                +{remainingCount}
              </button>
            ))}
        </div>
      )}

      {/* Bottom Action Row: View details link on left, Apply now button on right */}
      <div className="flex items-center justify-between gap-4 pt-3.5 border-t border-slate-100">
        <Link
          href={`/jobs/${job.id}`}
          aria-label={`View details for ${job.title}`}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#5929D6] hover:text-[#4D20BE] hover:underline transition-colors focus:outline-none"
        >
          <span>View details</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>

        <Link
          href={`/jobs/${job.id}/apply`}
          aria-label={`Apply now for ${job.title}`}
          className="inline-flex items-center justify-center bg-[#5929D6] hover:bg-[#4D20BE] active:bg-[#3F189F] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold px-5 sm:px-6 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 ease-out text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-2"
        >
          <span>Apply now</span>
        </Link>
      </div>
    </article>
  );
}
