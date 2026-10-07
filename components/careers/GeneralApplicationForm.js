"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function GeneralApplicationForm() {
  // Form values
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentJobTitle: "",
    experience: "Any / Flexible",
    linkedin: "",
    portfolio: "",
    opportunityLookingFor: "",
    aboutYourself: "",
    consent: false,
  });

  // Resume state
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Validation errors, submission & server state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingStage, setSubmittingStage] = useState(""); // "uploading" | "submitting"
  const [serverError, setServerError] = useState(null);
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
    if (serverError) {
      setServerError(null);
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
      return "File size must not exceed 10MB.";
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
        if (errors.resume) {
          setErrors((prev) => {
            const next = { ...prev };
            delete next.resume;
            return next;
          });
        }
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
        if (errors.resume) {
          setErrors((prev) => {
            const next = { ...prev };
            delete next.resume;
            return next;
          });
        }
      }
    }
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    setResumeError("");
    if (errors.resume) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.resume;
        return next;
      });
    }
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

  // Form submission connected to POST /api/applications with applicationType: "general"
  const handleSubmit = async (e) => {
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
    if (formData.phone.trim() && !/^[0-9+\s\-().]{7,30}$/.test(formData.phone.trim())) {
      validationErrors.phone = "Please enter a valid phone number.";
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

    setIsSubmitting(true);
    setServerError(null);
    setResumeError("");

    try {
      // 1. Upload resume to POST /api/uploads/resume
      setSubmittingStage("uploading");
      const uploadFormData = new FormData();
      uploadFormData.append("file", resumeFile);

      let uploadRes;
      try {
        uploadRes = await fetch("/api/uploads/resume", {
          method: "POST",
          body: uploadFormData,
        });
      } catch {
        setServerError(
          "Network error: Unable to connect to the resume upload service. Please check your connection and try again."
        );
        setIsSubmitting(false);
        setSubmittingStage("");
        return;
      }

      const uploadData = await uploadRes.json().catch(() => ({}));

      if (!uploadRes.ok || !uploadData.success) {
        const errorMsg =
          uploadData.error ||
          "Failed to upload resume. Please check your document and try again.";

        // Expected user-facing validation error on resume (e.g. 400 invalid / corrupt / wrong format)
        if (uploadRes.status >= 400 && uploadRes.status < 500) {
          setResumeError(errorMsg);
          setErrors((prev) => ({ ...prev, resume: errorMsg }));
          const resumeElem =
            document.getElementById("resume-error") ||
            document.getElementById("resume");
          if (resumeElem) {
            resumeElem.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else {
          // Unexpected 5xx server-level error
          setServerError(errorMsg);
        }

        setIsSubmitting(false);
        setSubmittingStage("");
        return;
      }

      const uploadedResume = uploadData.resume;

      // 2. Submit general application to POST /api/applications
      setSubmittingStage("submitting");
      const payload = {
        applicationType: "general",
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        currentJobTitle: formData.currentJobTitle.trim(),
        experience: formData.experience,
        linkedin: formData.linkedin.trim(),
        portfolio: formData.portfolio.trim(),
        opportunityLookingFor: formData.opportunityLookingFor.trim(),
        aboutYourself: formData.aboutYourself.trim(),
        resume: uploadedResume,
        consent: formData.consent,
      };

      let res;
      try {
        res = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {
        setServerError(
          "Network error: Unable to submit application. Please check your connection and try again."
        );
        setIsSubmitting(false);
        setSubmittingStage("");
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        const errorMsg =
          data.error || "Failed to submit application. Please try again.";

        // Set the returned user-friendly error message in serverError
        setServerError(errorMsg);

        // If duplicate application error (409) or email conflict, also highlight the email field
        if (res.status === 409) {
          setErrors((prev) => ({
            ...prev,
            email: errorMsg,
          }));
        }

        setIsSubmitting(false);
        setSubmittingStage("");
        return;
      }

      setErrors({});
      setIsSubmitted(true);
    } catch {
      setServerError(
        "An unexpected error occurred while processing your application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      setSubmittingStage("");
    }
  };

  // SUCCESS STATE
  if (isSubmitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-14 text-center shadow-xs max-w-2xl mx-auto"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-heading tracking-tight">
          Application Received!
        </h2>

        <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-lg mx-auto leading-relaxed">
          Thank you for sharing your resume with GharPadharo! We&apos;ve added your profile to our talent network and will reach out when a relevant opportunity matches your background.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/jobs"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-[#46477f] text-white text-sm font-bold px-7 py-3.5 rounded-xl transition-all shadow-xs"
          >
            <span>Explore Open Positions</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 px-5 py-6 sm:p-10 shadow-xs space-y-6 sm:space-y-8"
      aria-label="General Application form"
    >
      {/* SECTION 1: Personal Information */}
      <fieldset className="space-y-3.5 sm:space-y-4">
        <legend className="text-sm sm:text-base font-bold text-slate-900 pb-2.5 sm:pb-3 border-b border-slate-100 w-full">
          Personal Information
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-3.5 sm:pt-4">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wide sm:tracking-wider mb-1 sm:mb-1.5"
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
              className="block text-xs font-bold text-slate-700 uppercase tracking-wide sm:tracking-wider mb-1 sm:mb-1.5"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wide sm:tracking-wider mb-1 sm:mb-1.5"
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

          {/* Phone (Optional) */}
          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wide sm:tracking-wider mb-1 sm:mb-1.5"
            >
              Phone Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
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

      {/* SECTION 2: Professional Background */}
      <fieldset className="space-y-3.5 sm:space-y-4">
        <legend className="text-sm sm:text-base font-bold text-slate-900 pb-2.5 sm:pb-3 border-b border-slate-100 w-full">
          Professional Background
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-3.5 sm:pt-4">
          {/* Current Job Title */}
          <div>
            <label
              htmlFor="currentJobTitle"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wide sm:tracking-wider mb-1 sm:mb-1.5"
            >
              Current Job Title <span className="text-slate-400 font-normal lowercase">(optional)</span>
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
              className="block text-xs font-bold text-slate-700 uppercase tracking-wide sm:tracking-wider mb-1 sm:mb-1.5"
            >
              Years of Experience <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors cursor-pointer"
            >
              <option value="Any / Flexible">Any / Flexible</option>
              <option value="0–1 years">0–1 years (Entry / Fresher)</option>
              <option value="1–3 years">1–3 years (Junior)</option>
              <option value="3–5 years">3–5 years (Mid-Level)</option>
              <option value="5–8 years">5–8 years (Senior)</option>
              <option value="8+ years">8+ years (Lead / Director)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {/* LinkedIn URL */}
          <div>
            <label
              htmlFor="linkedin"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wide sm:tracking-wider mb-1 sm:mb-1.5"
            >
              LinkedIn Profile <span className="text-slate-400 font-normal lowercase">(optional)</span>
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

          {/* Portfolio URL */}
          <div>
            <label
              htmlFor="portfolio"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wide sm:tracking-wider mb-1 sm:mb-1.5"
            >
              Portfolio / GitHub / Website <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              id="portfolio"
              name="portfolio"
              type="url"
              value={formData.portfolio}
              onChange={handleChange}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>
      </fieldset>

      {/* SECTION 3: Opportunity of Interest & Background */}
      <fieldset className="space-y-3.5 sm:space-y-4">
        <legend className="text-sm sm:text-base font-bold text-slate-900 pb-2.5 sm:pb-3 border-b border-slate-100 w-full">
          Your Interests & Goals
        </legend>

        <div className="pt-3.5 sm:pt-4 space-y-3.5 sm:space-y-4">
          {/* What kind of opportunity are you looking for? */}
          <div>
            <div className="flex items-baseline justify-between gap-2 mb-1 sm:mb-1.5">
              <label
                htmlFor="opportunityLookingFor"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wide sm:tracking-wider leading-snug"
              >
                What kind of opportunity are you looking for?{" "}
                <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                {formData.opportunityLookingFor.length}/1000
              </span>
            </div>
            <textarea
              id="opportunityLookingFor"
              name="opportunityLookingFor"
              rows={3}
              maxLength={1000}
              value={formData.opportunityLookingFor}
              onChange={handleChange}
              className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-y leading-relaxed min-h-[105px] sm:min-h-[115px]"
              placeholder="Tell us what teams, technologies, or roles interest you most (e.g., Full Stack Development, AI Research, Product Management)..."
            />
          </div>

          {/* Tell us about yourself */}
          <div>
            <div className="flex items-baseline justify-between gap-2 mb-1 sm:mb-1.5">
              <label
                htmlFor="aboutYourself"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wide sm:tracking-wider leading-snug"
              >
                Tell us about yourself{" "}
                <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                {formData.aboutYourself.length}/3000
              </span>
            </div>
            <textarea
              id="aboutYourself"
              name="aboutYourself"
              rows={3}
              maxLength={3000}
              value={formData.aboutYourself}
              onChange={handleChange}
              className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-y leading-relaxed min-h-[105px] sm:min-h-[115px]"
              placeholder="A brief overview of your journey, key accomplishments, or what makes you excited about joining GharPadharo..."
            />
          </div>
        </div>
      </fieldset>

      {/* SECTION 4: Resume Upload */}
      <fieldset className="space-y-3.5 sm:space-y-4">
        <legend className="text-sm sm:text-base font-bold text-slate-900 pb-2.5 sm:pb-3 border-b border-slate-100 w-full">
          Resume / CV <span className="text-red-500">*</span>
        </legend>

        <div className="pt-3.5 sm:pt-4">
          {/* Hidden native input */}
          <input
            ref={fileInputRef}
            id="resume"
            name="resume"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="sr-only"
            aria-describedby="resume-help resume-error"
          />

          {!resumeFile ? (
            /* Dropzone when no file selected */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl py-5 px-4 sm:p-8 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : errors.resume || resumeError
                  ? "border-red-300 bg-red-50/30 hover:border-red-400"
                  : "border-slate-200 hover:border-primary/50 hover:bg-slate-50/50"
              }`}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2.5 sm:mb-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                <span className="text-primary font-bold hover:underline">Click to upload</span> or drag and drop your resume
              </p>
              <p id="resume-help" className="text-[11px] sm:text-xs text-muted mt-1">
                PDF, DOC, DOCX up to 10 MB
              </p>
            </div>
          ) : (
            /* Selected file display */
            <div
              className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-colors ${
                errors.resume || resumeError
                  ? "border-red-300 bg-red-50/30"
                  : "border-slate-200 bg-slate-50/60"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                    {resumeFile.name}
                  </p>
                  <p className="text-[11px] sm:text-xs text-muted">
                    {formatFileSize(resumeFile.size)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveResume}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                aria-label="Remove resume"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {(errors.resume || resumeError) && (
            <p id="resume-error" className="text-xs text-red-600 mt-1.5 font-medium">
              {errors.resume || resumeError}
            </p>
          )}
        </div>
      </fieldset>

      {/* SECTION 5: Consent & Legal */}
      <fieldset className="space-y-3 pt-0.5 sm:pt-1">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            checked={formData.consent}
            onChange={handleChange}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="w-4 h-4 mt-0.5 sm:mt-1 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer shrink-0"
          />
          <label htmlFor="consent" className="text-xs sm:text-sm text-slate-600 leading-relaxed cursor-pointer">
            I confirm that the information provided is accurate and consent to GharPadharo retaining my resume and details for prospective career opportunities. <span className="text-red-500">*</span>
          </label>
        </div>
        {errors.consent && (
          <p id="consent-error" className="text-xs text-red-600 font-medium">
            {errors.consent}
          </p>
        )}
      </fieldset>

      {/* Server Error Message */}
      {serverError && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800 font-medium flex items-center gap-3"
        >
          <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{serverError}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-1 sm:pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full h-12 rounded-xl text-white font-bold text-sm sm:text-base transition-all shadow-xs flex items-center justify-center gap-2 ${
            isSubmitting
              ? "bg-primary/70 cursor-wait"
              : "bg-primary hover:bg-[#46477f] cursor-pointer"
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>
                {submittingStage === "uploading"
                  ? "Uploading Resume..."
                  : "Submitting Profile..."}
              </span>
            </>
          ) : (
            <span>Submit Your Resume &rarr;</span>
          )}
        </button>
      </div>
    </form>
  );
}
