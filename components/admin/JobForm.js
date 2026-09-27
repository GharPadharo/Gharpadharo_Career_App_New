"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CANONICAL_TEAMS = [
  "Technology",
  "Product Management",
  "Operations",
  "Marketing",
  "Data Science",
];

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

const EXPERIENCE_LEVELS = [
  "Fresher (0–1 years)",
  "Mid-level (2–5 years)",
  "Senior (5+ years)",
];

const WORK_MODES = ["Remote", "Hybrid", "On-site"];

/**
 * JobForm Component
 * 
 * Production-ready frontend form for creating and editing jobs in the admin dashboard:
 * - 2-column layout (70% main sections / 30% publishing sidebar on desktop, stacked on mobile)
 * - Section 1: Basic Information (Title, Team, Job Type, Experience Level)
 * - Section 2: Location & Work Mode
 * - Section 3: Job Description (About the Role, Dynamic Responsibilities, Skills, Requirements)
 * - Section 4: Publishing & Status (Active, Draft, Closed with human-readable definitions)
 * - Client-side validation with actionable feedback
 * - Frontend preview confirmation before navigating back to /admin/dashboard/jobs
 */
export default function JobForm({ initialData = null, isEdit = false }) {
  const router = useRouter();

  // Helper to normalize array fields from mock data
  const normalizeList = (data, fallback = [""]) => {
    if (Array.isArray(data) && data.length > 0) return data;
    if (typeof data === "string" && data.trim()) {
      return data.split("\n").map((s) => s.trim()).filter(Boolean);
    }
    return fallback;
  };

  // Determine work mode default from location string if editing
  const inferWorkMode = (loc = "") => {
    const l = loc.toLowerCase();
    if (l.includes("hybrid")) return "Hybrid";
    if (l.includes("on-site") || l.includes("onsite") || l.includes("office") || l.includes("dehradun")) return "On-site";
    return "Remote";
  };

  // Form State
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    team: initialData?.team || "Technology",
    type: initialData?.type || "Full-time",
    experience: initialData?.experience || (isEdit ? "Mid-level (2–5 years)" : "Fresher (0–1 years)"),
    location: initialData?.location || (isEdit ? "" : "Remote (India)"),
    workMode: initialData?.workMode || inferWorkMode(initialData?.location),
    description: initialData?.description || "",
    responsibilities: normalizeList(initialData?.responsibilities),
    skills: normalizeList(initialData?.skills || initialData?.tags),
    requirements: normalizeList(initialData?.requirements),
    status: initialData?.status
      ? (initialData.status.toLowerCase() === "published" ? "active" : initialData.status.toLowerCase())
      : (isEdit ? "active" : "draft"),
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState(null);
  const [serverError, setServerError] = useState(null);

  // Field change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Dynamic list helpers
  const handleListChange = (fieldName, index, value) => {
    setFormData((prev) => {
      const updated = [...prev[fieldName]];
      updated[index] = value;
      return { ...prev, [fieldName]: updated };
    });
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleAddListItem = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: [...prev[fieldName], ""],
    }));
  };

  const handleRemoveListItem = (fieldName, index) => {
    setFormData((prev) => {
      const list = prev[fieldName];
      if (list.length <= 1) {
        // Keep at least one empty row instead of empty array
        return { ...prev, [fieldName]: [""] };
      }
      return {
        ...prev,
        [fieldName]: list.filter((_, i) => i !== index),
      };
    });
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required.";
    }
    if (!formData.team) {
      newErrors.team = "Please select a team.";
    }
    if (!formData.type) {
      newErrors.type = "Please select a job type.";
    }
    if (!formData.experience) {
      newErrors.experience = "Please select an experience level.";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Job location is required.";
    }
    if (!formData.description.trim()) {
      newErrors.description = "About the role description is required.";
    }

    const validResponsibilities = formData.responsibilities.filter((r) => r.trim());
    if (validResponsibilities.length === 0) {
      newErrors.responsibilities = "Add at least one responsibility.";
    }

    const validSkills = formData.skills.filter((s) => s.trim());
    if (validSkills.length === 0) {
      newErrors.skills = "Add at least one required skill.";
    }

    const validRequirements = formData.requirements.filter((req) => req.trim());
    if (validRequirements.length === 0) {
      newErrors.requirements = "Add at least one requirement.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler connected to backend API
  const handleSubmit = (enforcedStatus = null) => async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error
      window.scrollTo({ top: 180, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    const finalStatus = enforcedStatus || formData.status;
    const statusLabel =
      finalStatus.toLowerCase() === "active"
        ? "Active"
        : finalStatus.toLowerCase() === "closed"
        ? "Closed"
        : "Draft";

    const payload = {
      title: formData.title.trim(),
      team: formData.team.trim(),
      type: formData.type,
      experience: formData.experience.trim(),
      location: formData.location.trim(),
      workMode: formData.workMode,
      description: formData.description.trim(),
      responsibilities: formData.responsibilities.filter((r) => r.trim()),
      skills: formData.skills.filter((s) => s.trim()),
      requirements: formData.requirements.filter((req) => req.trim()),
      tags: formData.skills.filter((s) => s.trim()),
      status: finalStatus,
    };

    try {
      let res;
      if (isEdit) {
        const identifier = initialData.slug || initialData.id;
        res = await fetch(`/api/admin/jobs/${identifier}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || `Failed to ${isEdit ? "update" : "create"} job.`);
      }

      setSuccessBanner({
        message: `${isEdit ? "Job updated" : "Job created"} successfully as "${statusLabel}"!`,
        subtext: "Changes have been saved to the database.",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => {
        router.push("/admin/dashboard/jobs");
      }, 1500);
    } catch (err) {
      console.error("Job submit error:", err);
      setServerError(err.message || "An unexpected error occurred while saving the job.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6">
      {/* Server Error Notification Banner */}
      {serverError && (
        <div
          role="alert"
          className="p-4 sm:p-5 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-start justify-between shadow-2xs animate-in fade-in duration-200"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold">Failed to save job</p>
              <p className="text-xs text-red-700 mt-0.5 font-medium leading-relaxed">
                {serverError}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setServerError(null)}
            className="text-xs font-bold text-red-800 hover:text-red-950 underline shrink-0 ml-4 pt-1 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}
      {/* Success Notification Banner */}
      {successBanner && (
        <div
          role="status"
          className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-emerald-900 flex items-start justify-between shadow-2xs animate-in fade-in duration-200"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold">{successBanner.message}</p>
              <p className="text-xs text-emerald-700 mt-0.5 font-medium leading-relaxed">
                {successBanner.subtext} Redirecting to Jobs...
              </p>
            </div>
          </div>
          <Link
            href="/admin/dashboard/jobs"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline shrink-0 ml-4 pt-1"
          >
            Back to Jobs &rarr;
          </Link>
        </div>
      )}

      {/* Two-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Content Form Column (~70% desktop / 8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION 1: Basic Information */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Basic Information
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Core job title, organizational team, and seniority level.
              </p>
            </div>

            <div className="space-y-4">
              {/* Job Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Full Stack Developer"
                  className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                    errors.title
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-200 hover:border-slate-300 focus:border-primary"
                  }`}
                />
                {errors.title && (
                  <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                    <span>&bull;</span> {errors.title}
                  </p>
                )}
              </div>

              {/* Grid: Team, Job Type, Experience Level */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Team */}
                <div>
                  <label
                    htmlFor="team"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Team <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="team"
                    name="team"
                    value={formData.team}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all"
                  >
                    {CANONICAL_TEAMS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job Type */}
                <div>
                  <label
                    htmlFor="type"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Job Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all"
                  >
                    {JOB_TYPES.map((jt) => (
                      <option key={jt} value={jt}>
                        {jt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Experience Level */}
                <div>
                  <label
                    htmlFor="experience"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Experience Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all"
                  >
                    {EXPERIENCE_LEVELS.map((exp) => (
                      <option key={exp} value={exp}>
                        {exp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Job Location */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Job Location & Work Mode
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Specify geographic requirements and workplace arrangement.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Displayed Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Remote (India)"
                  className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                    errors.location
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-200 hover:border-slate-300 focus:border-primary"
                  }`}
                />
                {errors.location && (
                  <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                    <span>&bull;</span> {errors.location}
                  </p>
                )}
              </div>

              {/* Work Mode */}
              <div>
                <label
                  htmlFor="workMode"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Work Mode
                </label>
                <select
                  id="workMode"
                  name="workMode"
                  value={formData.workMode}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all"
                >
                  {WORK_MODES.map((wm) => (
                    <option key={wm} value={wm}>
                      {wm}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* SECTION 3: Job Description & Details */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Job Description
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Overview of the role, core responsibilities, and required competencies.
              </p>
            </div>

            {/* About the Role */}
            <div>
              <label
                htmlFor="description"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                About the Role <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the role and what the person will work on..."
                className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all leading-relaxed ${
                  errors.description
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 hover:border-slate-300 focus:border-primary"
                }`}
              />
              <p className="text-[11px] text-muted mt-1">
                Describe the role and what the person will work on.
              </p>
              {errors.description && (
                <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                  <span>&bull;</span> {errors.description}
                </p>
              )}
            </div>

            {/* Responsibilities Dynamic List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Responsibilities <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-muted">
                    Key day-to-day tasks and goals for this position.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddListItem("responsibilities")}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-[#46477f] px-2.5 py-1 rounded-lg hover:bg-slate-50 border border-slate-200/80 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add responsibility</span>
                </button>
              </div>

              {errors.responsibilities && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <span>&bull;</span> {errors.responsibilities}
                </p>
              )}

              <div className="space-y-2.5">
                {formData.responsibilities.map((resp, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-5 text-right text-xs font-bold text-slate-400 select-none">
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      value={resp}
                      onChange={(e) => handleListChange("responsibilities", idx, e.target.value)}
                      placeholder={`e.g. Design and scale core application features...`}
                      className="flex-1 px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 focus:border-primary rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveListItem("responsibilities", idx)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50/70 rounded-lg transition-colors cursor-pointer"
                      aria-label={`Remove responsibility ${idx + 1}`}
                      title="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Skills Dynamic List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Required Skills <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-muted">
                    Technologies, frameworks, or competencies needed.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddListItem("skills")}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-[#46477f] px-2.5 py-1 rounded-lg hover:bg-slate-50 border border-slate-200/80 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add skill</span>
                </button>
              </div>

              {errors.skills && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <span>&bull;</span> {errors.skills}
                </p>
              )}

              <div className="space-y-2.5">
                {formData.skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-5 text-right text-xs font-bold text-slate-400 select-none">
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleListChange("skills", idx, e.target.value)}
                      placeholder={`e.g. Next.js, TypeScript, PostgreSQL...`}
                      className="flex-1 px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 focus:border-primary rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveListItem("skills", idx)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50/70 rounded-lg transition-colors cursor-pointer"
                      aria-label={`Remove skill ${idx + 1}`}
                      title="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements Dynamic List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Requirements <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-muted">
                    Candidate experience, qualifications, and background standards.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddListItem("requirements")}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-[#46477f] px-2.5 py-1 rounded-lg hover:bg-slate-50 border border-slate-200/80 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add requirement</span>
                </button>
              </div>

              {errors.requirements && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <span>&bull;</span> {errors.requirements}
                </p>
              )}

              <div className="space-y-2.5">
                {formData.requirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-5 text-right text-xs font-bold text-slate-400 select-none">
                      {idx + 1}.
                    </span>
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleListChange("requirements", idx, e.target.value)}
                      placeholder={`e.g. 3+ years building full-stack web applications...`}
                      className="flex-1 px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 focus:border-primary rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveListItem("requirements", idx)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50/70 rounded-lg transition-colors cursor-pointer"
                      aria-label={`Remove requirement ${idx + 1}`}
                      title="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar Column (~30% desktop / 4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* SECTION 4: Publishing & Status */}
          <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Publishing
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Control position visibility and status.
                </p>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-200/80">
                Status
              </span>
            </div>

            <div className="space-y-3">
              {/* Active */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.status.toLowerCase() === "active"
                    ? "border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/20 shadow-2xs"
                    : "border-slate-200/90 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status.toLowerCase() === "active"}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 mt-0.5 cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Active</span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200/80">
                      Public
                    </span>
                  </div>
                  <p className="text-[11px] text-muted mt-1 leading-snug">
                    The job is publicly visible and accepting applications.
                  </p>
                </div>
              </label>

              {/* Draft */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.status.toLowerCase() === "draft"
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-2xs"
                    : "border-slate-200/90 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={formData.status.toLowerCase() === "draft"}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary focus:ring-primary mt-0.5 cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Draft</span>
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.2 rounded-full border border-slate-200">
                      Internal
                    </span>
                  </div>
                  <p className="text-[11px] text-muted mt-1 leading-snug">
                    The job is saved internally but is not publicly visible.
                  </p>
                </div>
              </label>

              {/* Closed */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.status.toLowerCase() === "closed"
                    ? "border-slate-400 bg-slate-50 ring-1 ring-slate-400/20 shadow-2xs"
                    : "border-slate-200/90 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="closed"
                  checked={formData.status.toLowerCase() === "closed"}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-slate-600 focus:ring-slate-500 mt-0.5 cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Closed</span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.2 rounded-full border border-slate-200">
                      Archived
                    </span>
                  </div>
                  <p className="text-[11px] text-muted mt-1 leading-snug">
                    The position is no longer accepting applications and should not appear as an active opening.
                  </p>
                </div>
              </label>
            </div>

            {/* Quick Preview Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-muted font-medium">Public link preview:</span>
              {isEdit && initialData?.id ? (
                <Link
                  href={`/jobs/${initialData.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:text-[#46477f] hover:underline"
                  title="Preview role on public portal (opens in new tab)"
                >
                  <span>Preview</span>
                  <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </Link>
              ) : (
                <span className="text-slate-400 italic text-[11px]">
                  Available after creation
                </span>
              )}
            </div>
          </section>

          {/* Quick Summary Card */}
          <section className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Summary Details
            </h3>
            <dl className="text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <dt className="text-muted">Target Team</dt>
                <dd className="font-semibold text-slate-800">{formData.team}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <dt className="text-muted">Arrangement</dt>
                <dd className="font-semibold text-slate-800">{formData.workMode}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <dt className="text-muted">Commitment</dt>
                <dd className="font-semibold text-slate-800">{formData.type}</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-muted">Seniority</dt>
                <dd className="font-semibold text-slate-800">{formData.experience}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      {/* SECTION 5: Form Bottom Actions */}
      <div className="pt-4 border-t border-slate-200/80 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 bg-white p-5 rounded-2xl border shadow-2xs">
        {/* Cancel */}
        <Link
          href="/admin/dashboard/jobs"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          Cancel
        </Link>

        {/* Action Group */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
          {/* Secondary Save as Draft button (for Add page or when Active/Closed selected) */}
          {!isEdit && formData.status.toLowerCase() !== "draft" && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit("draft")}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
            >
              Save as Draft
            </button>
          )}

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Processing...</span>
              </>
            ) : formData.status.toLowerCase() === "draft" ? (
              <span>{isEdit ? "Save Changes" : "Save Draft"}</span>
            ) : isEdit ? (
              <span>Save Changes</span>
            ) : (
              <span>Create Job</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
