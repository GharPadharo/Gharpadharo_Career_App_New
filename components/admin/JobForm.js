"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * JobForm Component
 * 
 * Reusable form for Add Job (/admin/dashboard/new) and Edit Job (/admin/dashboard/[id]/edit).
 * Frontend-only UI without database persistence.
 */
export default function JobForm({ initialData = null, isEdit = false }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    team: initialData?.team || "Technology",
    location: initialData?.location || "Remote (India)",
    type: initialData?.type || "Full-time",
    experience: initialData?.experience || "Mid-level (2–5 years)",
    description: initialData?.description || "",
    responsibilities: Array.isArray(initialData?.responsibilities)
      ? initialData.responsibilities.join("\n")
      : initialData?.responsibilities || "",
    requirements: Array.isArray(initialData?.requirements)
      ? initialData.requirements.join("\n")
      : initialData?.requirements || "",
    skills: Array.isArray(initialData?.skills)
      ? initialData.skills.join("\n")
      : Array.isArray(initialData?.tags)
      ? initialData.tags.join(", ")
      : initialData?.skills || "",
    status: initialData?.status || "Published",
  });

  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (actionType) => (e) => {
    e.preventDefault();
    const finalStatus = actionType === "draft" ? "Draft" : "Published";
    setNotification(
      `${isEdit ? "Job updated" : "Job created"} successfully as "${finalStatus}"! (Frontend preview only)`
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <form className="space-y-8 max-w-4xl mx-auto">
      {/* Success Notification Banner */}
      {notification && (
        <div
          role="status"
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 flex items-center justify-between shadow-2xs"
        >
          <div className="flex items-center gap-3 text-sm font-semibold">
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{notification}</span>
          </div>
          <Link
            href="/admin/dashboard"
            className="text-xs font-bold underline hover:text-emerald-950 ml-4 shrink-0"
          >
            Back to Dashboard &rarr;
          </Link>
        </div>
      )}

      {/* 1. Basic Information Section */}
      <section className="bg-card rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-6">
        <div>
          <h3 className="text-lg font-bold text-heading">Basic Information</h3>
          <p className="text-xs text-muted mt-0.5">
            Core job metadata and organizational placement.
          </p>
        </div>

        <div className="space-y-4">
          {/* Job Title */}
          <div>
            <label htmlFor="title" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full px-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs transition-colors"
            />
          </div>

          {/* Grid: Team, Location, Job Type, Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Team */}
            <div>
              <label htmlFor="team" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Team <span className="text-red-500">*</span>
              </label>
              <select
                id="team"
                name="team"
                value={formData.team}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
              >
                <option value="Technology">Technology</option>
                <option value="Product Management">Product Management</option>
                <option value="Operations">Operations</option>
                <option value="Marketing">Marketing</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Remote (India) or Dehradun"
                className="w-full px-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs transition-colors"
              />
            </div>

            {/* Job Type */}
            <div>
              <label htmlFor="type" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label htmlFor="experience" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Experience Level <span className="text-red-500">*</span>
              </label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs cursor-pointer"
              >
                <option value="Fresher (0–1 years)">Fresher (0–1 years)</option>
                <option value="Mid-level (2–5 years)">Mid-level (2–5 years)</option>
                <option value="Senior (5+ years)">Senior (5+ years)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Job Description & Content */}
      <section className="bg-card rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-6">
        <div>
          <h3 className="text-lg font-bold text-heading">Job Description & Details</h3>
          <p className="text-xs text-muted mt-0.5">
            Role overview, candidate expectations, and required skills.
          </p>
        </div>

        <div className="space-y-5">
          {/* Summary / Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Role Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief summary of the role, team context, and purpose..."
              className="w-full px-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs transition-colors"
            />
          </div>

          {/* Responsibilities */}
          <div>
            <label htmlFor="responsibilities" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Responsibilities
            </label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              rows={4}
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder="Enter each responsibility on a new line..."
              className="w-full px-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs transition-colors font-mono text-xs sm:text-sm"
            />
            <p className="text-[11px] text-muted mt-1">
              Tip: Enter one responsibility per line.
            </p>
          </div>

          {/* Requirements */}
          <div>
            <label htmlFor="requirements" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Requirements
            </label>
            <textarea
              id="requirements"
              name="requirements"
              rows={4}
              value={formData.requirements}
              onChange={handleChange}
              placeholder="Enter each requirement on a new line..."
              className="w-full px-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs transition-colors font-mono text-xs sm:text-sm"
            />
            <p className="text-[11px] text-muted mt-1">
              Tip: Enter one requirement per line.
            </p>
          </div>

          {/* Skills / Tags */}
          <div>
            <label htmlFor="skills" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Skills & Qualifications
            </label>
            <textarea
              id="skills"
              name="skills"
              rows={3}
              value={formData.skills}
              onChange={handleChange}
              placeholder="Enter key skills or technologies, line by line or comma-separated..."
              className="w-full px-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs transition-colors font-mono text-xs sm:text-sm"
            />
          </div>
        </div>
      </section>

      {/* 3. Publishing Options */}
      <section className="bg-card rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-4">
        <div>
          <h3 className="text-lg font-bold text-heading">Publishing</h3>
          <p className="text-xs text-muted mt-0.5">
            Choose whether to publish immediately or save as draft.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors bg-white flex-1">
            <input
              type="radio"
              name="status"
              value="Published"
              checked={formData.status === "Published"}
              onChange={handleChange}
              className="w-4 h-4 text-primary focus:ring-primary"
            />
            <div>
              <p className="text-sm font-bold text-slate-800">Published</p>
              <p className="text-xs text-muted">Visible to all candidates on the public portal.</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors bg-white flex-1">
            <input
              type="radio"
              name="status"
              value="Draft"
              checked={formData.status === "Draft"}
              onChange={handleChange}
              className="w-4 h-4 text-primary focus:ring-primary"
            />
            <div>
              <p className="text-sm font-bold text-slate-800">Draft</p>
              <p className="text-xs text-muted">Saved internally without public visibility.</p>
            </div>
          </label>
        </div>
      </section>

      {/* 4. Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <Link
          href="/admin/dashboard"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 text-sm font-semibold transition-colors text-center order-3 sm:order-1"
        >
          Cancel
        </Link>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
          <button
            type="button"
            onClick={handleSubmit("draft")}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 text-sm font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={handleSubmit("publish")}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
          >
            {isEdit ? "Update Job" : "Publish Job"}
          </button>
        </div>
      </div>
    </form>
  );
}
