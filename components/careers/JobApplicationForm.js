"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function JobApplicationForm({ job }) {
  // Form values
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentJobTitle: "",
    experience: "0–1 years",
    linkedin: "",
    portfolio: "",
    coverLetter: "",
    consent: false,
  });

  // Resume state
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Validation errors & submission state
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Field change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for that field
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Resume file validation helper
  const validateFile = (file) => {
    if (!file) return "Please upload your resume.";

    const extension = "." + file.name.split(".").pop().toLowerCase();
    const isValidExtension = ALLOWED_EXTENSIONS.includes(extension);
    const isValidMime = ALLOWED_MIME_TYPES.includes(file.type);

    if (!isValidExtension && !isValidMime) {
      return "Only PDF, DOC, or DOCX files are accepted.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File size must not exceed 5MB.";
    }

    return "";
  };

  // Resume selection handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const errorMsg = validateFile(file);
      if (errorMsg) {
        setResumeError(errorMsg);
        setResumeFile(null);
      } else {
        setResumeError("");
        setResumeFile(file);
      }
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const errorMsg = validateFile(file);
      if (errorMsg) {
        setResumeError(errorMsg);
        setResumeFile(null);
      } else {
        setResumeError("");
        setResumeFile(file);
      }
    }
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    setResumeError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!formData.firstName.trim()) {
      validationErrors.firstName = "First name is required.";
    }
    if (!formData.lastName.trim()) {
      validationErrors.lastName = "Last name is required.";
    }
    if (!formData.email.trim()) {
      validationErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      validationErrors.email = "Please enter a valid email address.";
    }
    if (!formData.phone.trim()) {
      validationErrors.phone = "Phone number is required.";
    } else if (!/^[0-9+\s\-().]{7,18}$/.test(formData.phone.trim())) {
      validationErrors.phone = "Please enter a valid phone number.";
    }
    if (!formData.coverLetter.trim()) {
      validationErrors.coverLetter = "Cover letter is required.";
    }
    if (!resumeFile) {
      validationErrors.resume = "Please upload your resume.";
    }
    if (!formData.consent) {
      validationErrors.consent =
        "You must confirm the accuracy of information and consent to proceed.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to the first error
      const firstErrorKey = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.focus();
      }
      return;
    }

    // Success: frontend confirmation without sending or saving data
    setErrors({});
    setIsSubmitted(true);
  };

  // Success Confirmation Screen
  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 shadow-xs text-center max-w-2xl mx-auto">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200/80">
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Application received
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg mx-auto">
          Thank you for applying for{" "}
          <strong className="text-slate-900 font-semibold">{job.title}</strong>.
          We&apos;ll review your application and get back to you if your
          experience matches the role.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/jobs"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-xs"
          >
            Back to Jobs
          </Link>
          <Link
            href={`/jobs/${job.id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-white border border-slate-300 hover:border-primary text-slate-700 hover:text-primary text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            View Job Details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-8"
      aria-label={`Application form for ${job.title}`}
    >
      {/* SECTION 1: Personal Information */}
      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 w-full">
          Personal Information
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
              className={`w-full h-11 px-3.5 rounded-xl border text-sm text-slate-900 bg-white outline-none transition-colors ${
                errors.firstName
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
              }`}
              placeholder="e.g. Rahul"
            />
            {errors.firstName && (
              <p id="firstName-error" className="text-xs text-red-600 mt-1 font-medium">
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              className={`w-full h-11 px-3.5 rounded-xl border text-sm text-slate-900 bg-white outline-none transition-colors ${
                errors.lastName
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
              }`}
              placeholder="e.g. Sharma"
            />
            {errors.lastName && (
              <p id="lastName-error" className="text-xs text-red-600 mt-1 font-medium">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full h-11 px-3.5 rounded-xl border text-sm text-slate-900 bg-white outline-none transition-colors ${
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
              }`}
              placeholder="name@example.com"
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-red-600 mt-1 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={`w-full h-11 px-3.5 rounded-xl border text-sm text-slate-900 bg-white outline-none transition-colors ${
                errors.phone
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
              }`}
              placeholder="+91 98765 43210"
            />
            {errors.phone && (
              <p id="phone-error" className="text-xs text-red-600 mt-1 font-medium">
                {errors.phone}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* SECTION 2: Professional Information */}
      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 w-full">
          Professional Information
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Current Job Title */}
          <div>
            <label
              htmlFor="currentJobTitle"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Current Job Title
            </label>
            <input
              id="currentJobTitle"
              name="currentJobTitle"
              type="text"
              value={formData.currentJobTitle}
              onChange={handleChange}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              placeholder="e.g. Software Engineer"
            />
          </div>

          {/* Years of Experience */}
          <div>
            <label
              htmlFor="experience"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Years of Experience
            </label>
            <div className="relative">
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full h-11 pl-3.5 pr-8 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
              >
                <option value="0–1 years">0–1 years</option>
                <option value="2–5 years">2–5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
              <svg
                className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* LinkedIn Profile */}
          <div>
            <label
              htmlFor="linkedin"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              LinkedIn Profile
            </label>
            <input
              id="linkedin"
              name="linkedin"
              type="url"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          {/* Portfolio / GitHub URL */}
          <div>
            <label
              htmlFor="portfolio"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Portfolio / GitHub URL
            </label>
            <input
              id="portfolio"
              name="portfolio"
              type="url"
              value={formData.portfolio}
              onChange={handleChange}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              placeholder="https://github.com/username"
            />
          </div>
        </div>
      </fieldset>

      {/* SECTION 3: Cover Letter */}
      <div>
        <label
          htmlFor="coverLetter"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          Cover Letter <span className="text-red-500">*</span>
        </label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          rows={5}
          required
          value={formData.coverLetter}
          onChange={handleChange}
          aria-invalid={!!errors.coverLetter}
          aria-describedby={errors.coverLetter ? "coverLetter-error" : undefined}
          className={`w-full p-3.5 rounded-xl border text-sm text-slate-900 bg-white outline-none transition-colors ${
            errors.coverLetter
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
          }`}
          placeholder="Tell us about yourself, why you want to join GharPadharo, and how your skills align with this role..."
        />
        {errors.coverLetter && (
          <p id="coverLetter-error" className="text-xs text-red-600 mt-1 font-medium">
            {errors.coverLetter}
          </p>
        )}
      </div>

      {/* SECTION 4: Resume Upload Area */}
      <div>
        <label
          id="resume-label"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
        >
          Resume / CV <span className="text-red-500">*</span>
        </label>

        {/* Real hidden file input */}
        <input
          ref={fileInputRef}
          id="resume"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
          className="sr-only"
          aria-labelledby="resume-label"
          aria-describedby="resume-help"
        />

        {!resumeFile ? (
          /* Drag & Drop Visual Area */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : errors.resume || resumeError
                ? "border-red-300 bg-red-50/30"
                : "border-slate-200 hover:border-primary/60 bg-slate-50/50 hover:bg-slate-50"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Upload your resume
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Drag and drop your resume here, or{" "}
              <span className="text-primary font-bold">browse</span>
            </p>
            <p id="resume-help" className="text-xs text-slate-400 mt-2 font-medium">
              PDF, DOC, or DOCX — max 5MB
            </p>
          </div>
        ) : (
          /* Selected File View */
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {resumeFile.name}
                </p>
                <p className="text-xs text-slate-500">
                  {formatFileSize(resumeFile.size)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveResume}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-red-200"
              aria-label="Remove uploaded resume"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {(errors.resume || resumeError) && (
          <p className="text-xs text-red-600 mt-1.5 font-medium">
            {errors.resume || resumeError}
          </p>
        )}
      </div>

      {/* SECTION 5: Consent Checkbox */}
      <div className="pt-2">
        <label
          htmlFor="consent"
          className="flex items-start gap-3 cursor-pointer select-none"
        >
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            checked={formData.consent}
            onChange={handleChange}
            className="w-4 h-4 rounded border-slate-300 text-primary accent-primary mt-1 shrink-0 focus:ring-primary/20 cursor-pointer"
          />
          <span className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            I confirm that the information provided is accurate and that I agree
            to the processing of my application. <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.consent && (
          <p className="text-xs text-red-600 mt-1.5 font-medium">
            {errors.consent}
          </p>
        )}
      </div>

      {/* SECTION 6: Submit Button */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href={`/jobs/${job.id}`}
          className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-primary transition-colors focus:outline-none focus:underline order-2 sm:order-1"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#3b5ae8] hover:bg-[#314bc7] text-white text-sm sm:text-base font-bold px-8 py-3.5 rounded-xl shadow-xs transition-all duration-200 active:scale-95 cursor-pointer order-1 sm:order-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <span>Submit Application</span>
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </form>
  );
}
