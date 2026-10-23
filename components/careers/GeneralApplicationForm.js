"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileText,
  X,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  AlertCircle,
  User,
  Briefcase,
  Sparkles,
} from "lucide-react";

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

        setServerError(errorMsg);

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
        className="bg-white rounded-2xl sm:rounded-[20px] border border-[#E8E2FA] p-8 sm:p-12 text-center shadow-[0_2px_12px_rgba(89,41,214,0.03)] max-w-2xl mx-auto"
      >
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 border border-emerald-200/80">
          <CheckCircle2 className="w-7 h-7 text-emerald-600" aria-hidden="true" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#11152F] tracking-tight">
          Application Received!
        </h2>

        <p className="text-[#64748B] text-sm sm:text-base mt-3 max-w-lg mx-auto leading-relaxed font-normal">
          Thank you for sharing your resume with GharPadharo! We&apos;ve added your profile to our talent network and will reach out when a relevant opportunity matches your background.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/jobs"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#5929D6] hover:bg-[#4D20BE] active:bg-[#3F189F] text-white text-sm sm:text-base font-bold px-7 py-3.5 rounded-xl transition-all shadow-xs"
          >
            <span>Explore Open Positions</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-2xl sm:rounded-[20px] border border-[#E8E2FA] px-5 py-6 sm:p-9 lg:p-10 shadow-[0_2px_12px_rgba(89,41,214,0.03)] space-y-8 sm:space-y-10"
      aria-label="General Application form"
    >
      {/* SECTION 1: Personal Information */}
      <fieldset className="space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 w-full mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#F0EBFF] text-[#5929D6] flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-[#5929D6]" aria-hidden="true" />
          </div>
          <legend className="text-base sm:text-lg font-bold text-[#11152F] tracking-tight">
            Personal Information
          </legend>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
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
              className={`w-full h-11 sm:h-12 px-3.5 rounded-xl border text-sm text-[#11152F] bg-white placeholder:text-[#94A3B8] outline-none transition-all duration-200 ${
                errors.firstName
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-[#E2E8F0] hover:border-[#C4B5FD] focus:border-[#5929D6] focus:ring-2 focus:ring-[#5929D6]/15"
              }`}
              placeholder="e.g. Rahul"
            />
            {errors.firstName && (
              <p id="firstName-error" className="text-xs text-red-600 mt-1.5 font-medium">
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
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
              className={`w-full h-11 sm:h-12 px-3.5 rounded-xl border text-sm text-[#11152F] bg-white placeholder:text-[#94A3B8] outline-none transition-all duration-200 ${
                errors.lastName
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-[#E2E8F0] hover:border-[#C4B5FD] focus:border-[#5929D6] focus:ring-2 focus:ring-[#5929D6]/15"
              }`}
              placeholder="e.g. Sharma"
            />
            {errors.lastName && (
              <p id="lastName-error" className="text-xs text-red-600 mt-1.5 font-medium">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
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
              className={`w-full h-11 sm:h-12 px-3.5 rounded-xl border text-sm text-[#11152F] bg-white placeholder:text-[#94A3B8] outline-none transition-all duration-200 ${
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-[#E2E8F0] hover:border-[#C4B5FD] focus:border-[#5929D6] focus:ring-2 focus:ring-[#5929D6]/15"
              }`}
              placeholder="name@example.com"
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-red-600 mt-1.5 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone (Optional) */}
          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
            >
              Phone Number <span className="text-[#94A3B8] font-normal lowercase tracking-normal ml-1">(optional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={`w-full h-11 sm:h-12 px-3.5 rounded-xl border text-sm text-[#11152F] bg-white placeholder:text-[#94A3B8] outline-none transition-all duration-200 ${
                errors.phone
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-[#E2E8F0] hover:border-[#C4B5FD] focus:border-[#5929D6] focus:ring-2 focus:ring-[#5929D6]/15"
              }`}
              placeholder="+91 98765 43210"
            />
            {errors.phone && (
              <p id="phone-error" className="text-xs text-red-600 mt-1.5 font-medium">
                {errors.phone}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* SECTION 2: Professional Background */}
      <fieldset className="space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 w-full mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#F0EBFF] text-[#5929D6] flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4 text-[#5929D6]" aria-hidden="true" />
          </div>
          <legend className="text-base sm:text-lg font-bold text-[#11152F] tracking-tight">
            Professional Background
          </legend>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Current Job Title */}
          <div>
            <label
              htmlFor="currentJobTitle"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
            >
              Current Job Title <span className="text-[#94A3B8] font-normal lowercase tracking-normal ml-1">(optional)</span>
            </label>
            <input
              id="currentJobTitle"
              name="currentJobTitle"
              type="text"
              value={formData.currentJobTitle}
              onChange={handleChange}
              className="w-full h-11 sm:h-12 px-3.5 rounded-xl border border-[#E2E8F0] hover:border-[#C4B5FD] text-sm text-[#11152F] bg-white placeholder:text-[#94A3B8] outline-none focus:border-[#5929D6] focus:ring-2 focus:ring-[#5929D6]/15 transition-all duration-200"
              placeholder="e.g. Software Engineer"
            />
          </div>

          {/* Years of Experience */}
          <div>
            <label
              htmlFor="experience"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
            >
              Years of Experience <span className="text-[#94A3B8] font-normal lowercase tracking-normal ml-1">(optional)</span>
            </label>
            <div className="relative">
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full h-11 sm:h-12 px-3.5 pr-9 rounded-xl border border-[#E2E8F0] hover:border-[#C4B5FD] text-sm text-[#11152F] bg-white outline-none focus:border-[#5929D6] focus:ring-2 focus:ring-[#5929D6]/15 appearance-none cursor-pointer transition-all duration-200"
              >
                <option value="Any / Flexible">Any / Flexible</option>
                <option value="0–1 years">0–1 years (Entry / Fresher)</option>
                <option value="1–3 years">1–3 years (Junior)</option>
                <option value="3–5 years">3–5 years (Mid-Level)</option>
                <option value="5–8 years">5–8 years (Senior)</option>
                <option value="8+ years">8+ years (Lead / Director)</option>
              </select>
              <ChevronDown
                className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* LinkedIn URL */}
          <div>
            <label
              htmlFor="linkedin"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
            >
              LinkedIn Profile <span className="text-[#94A3B8] font-normal lowercase tracking-normal ml-1">(optional)</span>
            </label>
            <input
              id="linkedin"
              name="linkedin"
              type="url"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full h-11 sm:h-12 px-3.5 rounded-xl border border-[#E2E8F0] hover:border-[#C4B5FD] text-sm text-[#11152F] bg-white placeholder:text-[#94A3B8] outline-none focus:border-[#5929D6] focus:ring-2 focus:ring-[#5929D6]/15 transition-all duration-200"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          {/* Portfolio URL */}
          <div>
            <label
              htmlFor="portfolio"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
            >
              Portfolio / GitHub / Website <span className="text-[#94A3B8] font-normal lowercase tracking-normal ml-1">(optional)</span>
            </label>
            <input
              id="portfolio"
              name="portfolio"
              type="url"
              value={formData.portfolio}
              onChange={handleChange}
              className="w-full h-11 sm:h-12 px-3.5 rounded-xl border border-[#E2E8F0] hover:border-[#C4B5FD] text-sm text-[#11152F] bg-white placeholder:text-[#94A3B8] outline-none focus:border-[#5929D6] focus:ring-2 focus:ring-[#5929D6]/15 transition-all duration-200"
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>
      </fieldset>

      {/* SECTION 3: Your Interests & Goals */}
      <fieldset className="space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 w-full mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#F0EBFF] text-[#5929D6] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-[#5929D6]" aria-hidden="true" />
          </div>
          <legend className="text-base sm:text-lg font-bold text-[#11152F] tracking-tight">
            Your Interests &amp; Goals
          </legend>
        </div>

        <div className="space-y-5">
          {/* What kind of opportunity are you looking for? */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <label
                htmlFor="opportunityLookingFor"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider leading-snug"
              >
                What kind of opportunity are you looking for?{" "}
                <span className="text-[#94A3B8] font-normal lowercase tracking-normal">(optional)</span>
              </label>
              <span className="text-[11px] text-[#94A3B8] font-medium shrink-0">
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
              className="w-full p-3.5 rounded-xl border border-[#E2E8F0] hover:border-[#C4B5FD] text-sm text-[#11152F] bg-white placeholder:text-[#94A3B8] outline-none focus:border-[#5929D6] focus:ring-2 focus:ring-[#5929D6]/15 transition-all duration-200 resize-y leading-relaxed min-h-[110px]"
              placeholder="Tell us what teams, technologies, or roles interest you most (e.g., Full Stack Development, AI Research, Product Management)..."
            />
          </div>

          {/* Tell us about yourself */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <label
                htmlFor="aboutYourself"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider leading-snug"
              >
                Tell us about yourself{" "}
                <span className="text-[#94A3B8] font-normal lowercase tracking-normal">(optional)</span>
              </label>
              <span className="text-[11px] text-[#94A3B8] font-medium shrink-0">
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
              className="w-full p-3.5 rounded-xl border border-[#E2E8F0] hover:border-[#C4B5FD] text-sm text-[#11152F] bg-white placeholder:text-[#94A3B8] outline-none focus:border-[#5929D6] focus:ring-2 focus:ring-[#5929D6]/15 transition-all duration-200 resize-y leading-relaxed min-h-[110px]"
              placeholder="A brief overview of your journey, key accomplishments, or what makes you excited about joining GharPadharo..."
            />
          </div>
        </div>
      </fieldset>

      {/* SECTION 4: Resume / CV Upload */}
      <fieldset className="space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 w-full mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#F0EBFF] text-[#5929D6] flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-[#5929D6]" aria-hidden="true" />
          </div>
          <legend className="text-base sm:text-lg font-bold text-[#11152F] tracking-tight">
            Resume / CV <span className="text-red-500">*</span>
          </legend>
        </div>

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
            className={`border-2 border-dashed rounded-2xl p-7 sm:p-9 text-center cursor-pointer transition-all duration-200 group ${
              isDragging
                ? "border-[#5929D6] bg-[#F0EBFF]/50"
                : errors.resume || resumeError
                ? "border-red-300 bg-red-50/30"
                : "border-[#DDD6FE] hover:border-[#5929D6] bg-[#FDFCFE] hover:bg-[#F8F6FD]"
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-[#F0EBFF] text-[#5929D6] group-hover:scale-105 flex items-center justify-center mx-auto mb-3.5 transition-transform duration-200 shadow-2xs">
              <UploadCloud className="w-6 h-6 text-[#5929D6]" aria-hidden="true" />
            </div>
            <p className="text-sm font-bold text-[#11152F]">
              Upload your resume
            </p>
            <p className="text-xs text-[#64748B] mt-1.5">
              Drag and drop your resume here, or{" "}
              <span className="text-[#5929D6] font-bold group-hover:underline">browse</span>
            </p>
            <p id="resume-help" className="text-[11px] text-[#94A3B8] mt-2.5 font-medium">
              PDF, DOC, or DOCX — max 10MB
            </p>
          </div>
        ) : (
          /* Selected file display */
          <div className="border border-[#E8E2FA] rounded-2xl p-4 bg-[#F8F7FC] flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#F0EBFF] text-[#5929D6] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-[#5929D6]" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#11152F] truncate">
                  {resumeFile.name}
                </p>
                <p className="text-xs text-[#64748B] mt-0.5 font-medium">
                  {formatFileSize(resumeFile.size)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-[#5929D6] hover:text-[#4D20BE] hover:underline px-2.5 py-1.5 transition-colors cursor-pointer rounded-lg hover:bg-[#F0EBFF]"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemoveResume}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
                aria-label="Remove resume"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {(errors.resume || resumeError) && (
          <p id="resume-error" className="text-xs text-red-600 mt-2 font-medium">
            {errors.resume || resumeError}
          </p>
        )}
      </fieldset>

      {/* SECTION 5: Consent & Legal */}
      <div className="pt-2">
        <label
          htmlFor="consent"
          className="flex items-start gap-3 cursor-pointer select-none group"
        >
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            checked={formData.consent}
            onChange={handleChange}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="w-4 h-4 rounded border-slate-300 text-[#5929D6] accent-[#5929D6] mt-0.5 shrink-0 focus:ring-[#5929D6]/20 cursor-pointer"
          />
          <span className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal group-hover:text-slate-800 transition-colors">
            I confirm that the information provided is accurate and consent to GharPadharo retaining my resume and details for prospective career opportunities. <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="text-xs text-red-600 mt-2 font-medium">
            {errors.consent}
          </p>
        )}
      </div>

      {/* Server Error Message */}
      {serverError && (
        <div
          role="alert"
          className="p-4 sm:p-5 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-start justify-between shadow-2xs animate-in fade-in duration-200"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5 text-red-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold">Submission failed</p>
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

      {/* SECTION 6: Submit Button */}
      <div className="pt-4 border-t border-slate-100">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#5929D6] hover:bg-[#4D20BE] active:bg-[#3F189F] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm sm:text-base font-bold py-3.5 px-8 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5929D6] focus-visible:ring-offset-2 group"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
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
            <>
              <span>Submit Your Resume</span>
              <ArrowRight
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
