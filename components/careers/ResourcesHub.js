"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * ResourcesHub Component
 * 
 * Candidate-focused Career Resources hub with:
 * - Clean Hero section
 * - Vertical timeline for Hiring Process (#hiring-process)
 * - 2-column grid for Resume Tips (#resume-tips) + Freshers callout
 * - Side-by-side cards + Question accordions for Interview Prep (#interview-prep)
 * - Accessible FAQ accordion (#faq)
 */
export default function ResourcesHub() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const toggleFaq = (idx) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  const hiringSteps = [
    {
      num: "01",
      title: "Apply",
      shortTitle: "Apply",
      desc: "Find a role that matches your skills and submit your application.",
      guidance: [
        "Review the role",
        "Check your skills",
        "Submit your application",
      ],
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
        </svg>
      ),
    },
    {
      num: "02",
      title: "Application Review",
      shortTitle: "Review",
      desc: "Our team reviews your application and experience to understand whether your background matches the role.",
      guidance: [
        "Keep your resume clear",
        "Highlight relevant skills",
        "Keep your contact details current",
      ],
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      ),
    },
    {
      num: "03",
      title: "Screening Call",
      shortTitle: "Screening",
      desc: "If your application looks like a potential match, we’ll have a short conversation to learn more about you and your experience.",
      guidance: [
        "Prepare a short introduction",
        "Be ready to discuss your experience",
        "Ask questions about the opportunity",
      ],
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
          />
        </svg>
      ),
    },
    {
      num: "04",
      title: "Interview",
      shortTitle: "Interview",
      desc: "Depending on the role, you’ll meet with the team to discuss your experience, skills, and how you could contribute.",
      guidance: [
        "Review the role",
        "Prepare project examples",
        "Think about how you solve problems",
      ],
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.999-3.199a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
          />
        </svg>
      ),
    },
    {
      num: "05",
      title: "Next Steps",
      shortTitle: "Next Steps",
      desc: "We’ll keep you informed about the outcome and any next steps in the process.",
      guidance: [
        "Check your contact details",
        "Follow any instructions",
        "Watch for updates",
      ],
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
    },
  ];

  const resumeTips = [
    {
      num: "01",
      title: "Keep it clear",
      desc: "Keep your resume focused and easy to scan. Highlight the experience most relevant to the role.",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      ),
    },
    {
      num: "02",
      title: "Show your projects",
      desc: "For early-career roles, projects can demonstrate your skills and how you solve problems.",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="18" height="12" x="3" y="4" rx="2" ry="2" />
          <line x1="2" y1="20" x2="22" y2="20" />
        </svg>
      ),
    },
    {
      num: "03",
      title: "Highlight your skills",
      desc: "List the technologies, tools, and skills you are comfortable using.",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
    },
    {
      num: "04",
      title: "Show impact",
      desc: "When possible, explain what you achieved rather than only listing what you were responsible for.",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
          <path d="m4 12 7-7 4 4 6-6" />
          <path d="M16 3h5v5" />
        </svg>
      ),
    },
    {
      num: "05",
      title: "Keep it updated",
      desc: "Make sure your contact details, skills, projects, and experience are current.",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M16 16h5v5" />
        </svg>
      ),
    },
  ];

  const interviewBefore = [
    "Read the job description carefully.",
    "Learn about GharPadharo and what we do.",
    "Review your resume and projects.",
    "Prepare a few questions for the interviewer.",
  ];

  const interviewDuring = [
    "Be clear and honest.",
    "Explain your thinking.",
    "Ask questions when something isn't clear.",
    "It's okay to say when you don't know something.",
  ];

  const faqs = [
    {
      question: "Can I apply for more than one position?",
      answer: "Yes. You can apply for roles that match your skills and experience.",
    },
    {
      question: "Do you hire freshers?",
      answer: "Yes, depending on the role and current openings.",
    },
    {
      question: "Can I apply if there isn't a suitable opening?",
      answer: (
        <>
          Yes. You can submit your resume through our{" "}
          <Link
            href="/jobs/general-application"
            className="text-primary font-semibold hover:underline"
          >
            General Application form
          </Link>{" "}
          so we can consider you for future opportunities.
        </>
      ),
    },
    {
      question: "Can I apply for remote roles?",
      answer:
        "Work mode depends on the individual position. Check the work mode listed on each job posting.",
    },
    {
      question: "How will I know if my application is shortlisted?",
      answer:
        "If your application moves forward, our team will contact you using the information provided in your application.",
    },
    {
      question: "Can I update my application after submitting it?",
      answer:
        "Please contact the GharPadharo careers team if you need to make an important correction to information you submitted.",
    },
  ];

  return (
    <div className="w-full bg-[#f8fafc] text-body">
      {/* 1. HERO SECTION */}
      <section className="relative w-full overflow-hidden py-12 sm:py-16 lg:py-20 border-b border-slate-200/70 bg-gradient-to-br from-[#f8fafc] via-[#f3f4fd]/60 to-[#f8fafc]">
        {/* Subtle Decorative Dotted Pattern (Right Side, low contrast) */}
        <div
          aria-hidden="true"
          className="hidden md:block pointer-events-none absolute right-0 top-0 bottom-0 w-1/2 opacity-35 [background-image:radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
        />

        <div className="container-custom max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-3">
                CAREER RESOURCES
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-extrabold text-heading tracking-tight leading-[1.12]">
                Prepare for your next step.
              </h1>
              <p className="text-sm sm:text-base text-body mt-3.5 sm:mt-4 leading-relaxed font-normal max-w-[540px]">
                Get practical guidance on our hiring process, resumes, interviews,
                and common questions about joining GharPadharo.
              </p>

              {/* CTAs */}
              <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-3.5 w-full sm:w-auto">
                <a
                  href="#hiring-process"
                  className="btn-primary text-xs sm:text-sm px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-xs"
                >
                  Explore Hiring Steps ↓
                </a>
                <Link
                  href="/jobs"
                  className="btn-secondary text-xs sm:text-sm px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-2xs"
                >
                  Browse Positions →
                </Link>
              </div>
            </div>

            {/* Right Visual Area: Staggered Floating Resource Cards */}
            <div className="lg:col-span-5 w-full">
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 sm:gap-4 lg:gap-4 relative sm:justify-center lg:items-center">
                {/* Card 1: Hiring Process Breakdown */}
                <a
                  href="#hiring-process"
                  className="group bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-4.5 shadow-xs hover:shadow-md sm:hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3.5 w-full sm:w-auto lg:w-72 lg:translate-x-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-primary border border-purple-100 flex items-center justify-center shrink-0 group-hover:bg-purple-100/80 transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                      />
                      <circle
                        cx="17.5"
                        cy="17.25"
                        r="2.25"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors">
                      Hiring Process
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Breakdown
                    </p>
                  </div>
                </a>

                {/* Card 2: Interview Guides & Tips (Staggered Right) */}
                <a
                  href="#interview-prep"
                  className="group bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-4.5 shadow-xs hover:shadow-md sm:hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3.5 w-full sm:w-auto lg:w-72 lg:translate-x-6 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-primary border border-purple-100 flex items-center justify-center shrink-0 group-hover:bg-purple-100/80 transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors">
                      Interview Guides
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      &amp; Tips
                    </p>
                  </div>
                </a>

                {/* Card 3: Team Culture FAQ (Staggered Left) */}
                <a
                  href="#faq"
                  className="group bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-4.5 shadow-xs hover:shadow-md sm:hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3.5 w-full sm:w-auto lg:w-72 lg:-translate-x-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-primary border border-purple-100 flex items-center justify-center shrink-0 group-hover:bg-purple-100/80 transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors">
                      Team Culture
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      FAQ
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HIRING PROCESS SECTION (Interactive Progress Timeline) */}
      <section
        id="hiring-process"
        className="scroll-mt-24 w-full py-14 sm:py-20 bg-white border-b border-slate-200/60"
        aria-labelledby="hiring-process-heading"
      >
        <div className="container-custom max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="mb-8 sm:mb-10">
            <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-2 sm:mb-2.5">
              HIRING PROCESS
            </span>
            <h2
              id="hiring-process-heading"
              className="text-2xl sm:text-[30px] lg:text-[32px] font-extrabold text-heading tracking-tight leading-snug"
            >
              What happens after you apply?
            </h2>
            <p className="text-sm sm:text-base text-body mt-2 sm:mt-2.5 leading-relaxed font-normal max-w-2xl">
              Here&apos;s what you can generally expect when you apply for a role
              at GharPadharo.
            </p>
          </div>

          {/* Supporting Label Above Timeline */}
          <div className="mb-6 lg:mb-8 flex items-center gap-3">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">
              OUR TYPICAL PROCESS
            </span>
            <span className="h-px flex-1 bg-slate-200/80" aria-hidden="true" />
          </div>

          {/* A. DESKTOP TIMELINE (>= 1024px) */}
          <div className="hidden lg:block">
            {/* Horizontal Progress Timeline */}
            <div
              role="tablist"
              aria-label="Hiring process steps"
              className="relative grid grid-cols-5 items-start"
            >
              {/* Connecting Background Line */}
              <div
                aria-hidden="true"
                className="absolute top-5 left-[10%] right-[10%] h-[2px] bg-slate-200 -translate-y-1/2 z-0"
              />

              {/* Active Progress Highlight Line */}
              <div
                aria-hidden="true"
                className="absolute top-5 left-[10%] h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-300 ease-out"
                style={{
                  width: `${(activeStep / (hiringSteps.length - 1)) * 80}%`,
                }}
              />

              {hiringSteps.map((step, idx) => {
                const isActive = activeStep === idx;
                const isPassed = activeStep > idx;

                return (
                  <button
                    key={step.num}
                    type="button"
                    role="tab"
                    id={`desktop-step-tab-${step.num}`}
                    aria-selected={isActive}
                    aria-controls={`desktop-step-panel-${step.num}`}
                    onClick={() => setActiveStep(idx)}
                    className="group relative z-10 flex flex-col items-center text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl p-2 cursor-pointer transition-colors"
                  >
                    {/* Circular Number Badge */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all duration-200 border ${
                        isActive
                          ? "bg-primary text-white border-primary shadow-xs ring-4 ring-purple-100"
                          : isPassed
                          ? "bg-purple-50 text-primary border-purple-200 hover:bg-purple-100/80"
                          : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800"
                      }`}
                    >
                      {step.num}
                    </div>

                    {/* Step Title + Icon */}
                    <div className="mt-3 flex items-center gap-1.5 justify-center">
                      <span
                        className={`transition-colors ${
                          isActive
                            ? "text-primary"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      >
                        {step.icon}
                      </span>
                      <span
                        className={`text-sm transition-colors ${
                          isActive
                            ? "font-bold text-primary"
                            : "font-semibold text-slate-600 group-hover:text-slate-900"
                        }`}
                      >
                        {step.shortTitle}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Desktop Compact Selected-Step Panel */}
            <div
              key={activeStep}
              role="tabpanel"
              id={`desktop-step-panel-${hiringSteps[activeStep].num}`}
              aria-labelledby={`desktop-step-tab-${hiringSteps[activeStep].num}`}
              className="mt-6 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs transition-opacity duration-200 motion-reduce:transition-none"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-bold text-xs text-primary bg-purple-50 border border-purple-200/70 px-2 py-0.5 rounded-md">
                  {hiringSteps[activeStep].num}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-heading tracking-tight">
                  {hiringSteps[activeStep].title.toUpperCase()}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-body mt-2 leading-relaxed font-normal">
                {hiringSteps[activeStep].desc}
              </p>

              {/* Horizontal 3 Points */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-2 text-xs sm:text-sm text-body">
                {hiringSteps[activeStep].guidance.map((item, gIdx) => (
                  <div key={gIdx} className="flex items-center gap-1.5 min-w-0">
                    <svg
                      className="w-3.5 h-3.5 text-primary shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                    <span className="font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* B. MOBILE/TABLET TIMELINE (< 1024px) */}
          <div
            role="tablist"
            aria-label="Hiring process steps"
            className="block lg:hidden relative pl-2 sm:pl-3"
          >
            {hiringSteps.map((step, idx) => {
              const isLast = idx === hiringSteps.length - 1;
              const isActive = activeStep === idx;
              const isPassed = activeStep > idx;

              return (
                <div
                  key={step.num}
                  className={`relative ${isLast ? "pb-0" : "pb-5 sm:pb-6"}`}
                >
                  {/* Vertical Connecting Line */}
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className={`absolute left-[19px] sm:left-[21px] top-9 -bottom-1 w-[2px] transition-colors duration-200 ${
                        isPassed ? "bg-primary" : "bg-slate-200"
                      }`}
                    />
                  )}

                  {/* Step Interactive Trigger */}
                  <button
                    type="button"
                    role="tab"
                    id={`mobile-step-tab-${step.num}`}
                    aria-selected={isActive}
                    aria-controls={`mobile-step-panel-${step.num}`}
                    onClick={() => setActiveStep(idx)}
                    className="w-full flex items-start gap-3.5 sm:gap-4 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl p-1 -m-1 cursor-pointer"
                  >
                    {/* Circular Number Badge */}
                    <div
                      className={`relative z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-all duration-200 border ${
                        isActive
                          ? "bg-primary text-white border-primary shadow-xs ring-4 ring-purple-100"
                          : isPassed
                          ? "bg-purple-50 text-primary border-purple-200"
                          : "bg-white text-slate-500 border-slate-200 group-hover:border-slate-300"
                      }`}
                    >
                      {step.num}
                    </div>

                    {/* Step Title + Description */}
                    <div className="pt-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`transition-colors ${
                            isActive
                              ? "text-primary"
                              : "text-slate-400 group-hover:text-slate-600"
                          }`}
                        >
                          {step.icon}
                        </span>
                        <h3
                          className={`text-base sm:text-lg tracking-tight transition-colors ${
                            isActive
                              ? "font-bold text-primary"
                              : "font-bold text-heading group-hover:text-primary"
                          }`}
                        >
                          {step.title}
                        </h3>
                      </div>
                      {!isActive && (
                        <p className="text-xs sm:text-sm text-body leading-relaxed mt-1 font-normal">
                          {step.desc}
                        </p>
                      )}
                    </div>
                  </button>

                  {/* Selected Step Detail Panel (Compact card directly below selected step on mobile) */}
                  {isActive && (
                    <div
                      role="tabpanel"
                      id={`mobile-step-panel-${step.num}`}
                      aria-labelledby={`mobile-step-tab-${step.num}`}
                      className="ml-11 sm:ml-13 mt-2.5 bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs transition-opacity duration-200 motion-reduce:transition-none"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono font-bold text-[11px] text-primary bg-purple-50 border border-purple-200/70 px-1.5 py-0.5 rounded">
                          {step.num}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-heading tracking-tight uppercase">
                          {step.title}
                        </h4>
                      </div>

                      <p className="text-xs text-body leading-relaxed mb-2.5 font-normal">
                        {step.desc}
                      </p>

                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        {step.guidance.map((item, gIdx) => (
                          <div
                            key={gIdx}
                            className="flex items-center gap-1.5 text-xs text-body"
                          >
                            <svg
                              className="w-3.5 h-3.5 text-primary shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2.5"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m4.5 12.75 6 6 9-13.5"
                              />
                            </svg>
                            <span className="font-medium text-slate-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Tiny Muted Line at Section Bottom */}
          <p className="text-center text-xs text-muted mt-6 sm:mt-8">
            Process may vary slightly by role.
          </p>
        </div>
      </section>

      {/* 3. RESUME TIPS SECTION (2-Column Grid + Freshers Callout) */}
      <section
        id="resume-tips"
        className="scroll-mt-24 w-full py-14 sm:py-20 bg-[#f8fafc] border-b border-slate-200/60"
        aria-labelledby="resume-tips-heading"
      >
        <div className="container-custom max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="mb-8 sm:mb-10">
            <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-2 sm:mb-2.5">
              RESUME TIPS
            </span>
            <h2
              id="resume-tips-heading"
              className="text-2xl sm:text-[30px] lg:text-[32px] font-extrabold text-heading tracking-tight leading-snug"
            >
              Make your experience easy to understand.
            </h2>
            <p className="text-sm sm:text-base text-body mt-2.5 sm:mt-3 leading-relaxed font-normal max-w-2xl">
              Your resume doesn&apos;t need to be complicated. Focus on showing
              what you&apos;ve learned, what you&apos;ve built, and how you can
              contribute.
            </p>
          </div>

          {/* 5 Tips Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {resumeTips.map((tip, idx) => (
              <div
                key={tip.num}
                className={`group bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all duration-200 sm:hover:-translate-y-0.5 flex items-start gap-4 sm:gap-5 h-full ${
                  idx === 4 ? "md:col-span-2" : ""
                }`}
              >
                {/* Icon Container */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 text-primary border border-purple-100 flex items-center justify-center shrink-0 group-hover:bg-purple-100/70 transition-colors">
                  {tip.icon}
                </div>

                {/* Content + Badge */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base sm:text-[17px] font-bold text-heading tracking-tight group-hover:text-primary transition-colors">
                      {tip.title}
                    </h3>
                    <span className="font-mono text-xs font-semibold text-primary bg-purple-50 border border-purple-100/90 px-2 py-0.5 rounded-full shrink-0">
                      {tip.num}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-body leading-relaxed mt-1.5 font-normal">
                    {tip.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* FOR FRESHERS CALLOUT */}
          <div className="mt-5 sm:mt-6 rounded-2xl bg-gradient-to-br from-[#f8f7ff] via-[#f5f4fd] to-[#edeaff]/50 border border-purple-200/70 p-5 sm:p-6 lg:p-7 shadow-2xs relative overflow-hidden flex items-start gap-4 sm:gap-5">
            {/* Subtle decorative background blur/shape */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-6 -bottom-8 w-44 h-44 rounded-full bg-purple-200/25 blur-2xl"
            />

            {/* Lightbulb Icon Badge */}
            <div className="relative z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-purple-100 flex items-center justify-center text-amber-500 shrink-0 shadow-2xs">
              <svg
                className="w-5 h-5 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M12 2a6 6 0 0 0-6 6c0 2.2 1.1 4.1 2.8 5.2.7.5 1.2 1.3 1.2 2.2v.6h4v-.6c0-.9.5-1.7 1.2-2.2A6 6 0 0 0 12 2z" />
                <circle cx="12" cy="8" r="1.5" fill="currentColor" />
              </svg>
            </div>

            {/* Freshers Content */}
            <div className="relative z-10 flex-1 min-w-0">
              <span className="text-xs font-bold text-primary tracking-wider uppercase block mb-1">
                FOR FRESHERS
              </span>
              <h3 className="text-base sm:text-lg font-bold text-heading tracking-tight mb-1">
                No professional experience yet? That&apos;s okay.
              </h3>
              <p className="text-xs sm:text-sm text-body leading-relaxed font-normal max-w-3xl">
                Highlight your projects, internships, coursework, technical
                skills, and the problems you&apos;ve solved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERVIEW PREP SECTION (Two Feature Cards) */}
      <section
        id="interview-prep"
        className="scroll-mt-24 w-full py-14 sm:py-20 bg-white border-b border-slate-200/60"
        aria-labelledby="interview-prep-heading"
      >
        <div className="container-custom max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="mb-8 sm:mb-10">
            <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-2 sm:mb-2.5">
              INTERVIEW PREP
            </span>
            <h2
              id="interview-prep-heading"
              className="text-2xl sm:text-[30px] lg:text-[32px] font-extrabold text-heading tracking-tight leading-snug"
            >
              Prepare with confidence.
            </h2>
            <p className="text-sm sm:text-base text-body mt-2.5 sm:mt-3 leading-relaxed font-normal max-w-2xl">
              A little preparation can help you communicate your experience and
              ideas more clearly.
            </p>
          </div>

          {/* Subsections: Before & During Two-Column Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
            {/* Before the Interview */}
            <div className="group bg-white rounded-2xl sm:rounded-[22px] border border-slate-200/80 p-6 sm:p-7 shadow-2xs hover:shadow-xs transition-all duration-200 sm:hover:-translate-y-0.5 relative overflow-hidden flex flex-col justify-between h-full">
              {/* Subtle decorative amber glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full bg-amber-100/35 blur-2xl"
              />

              <div className="relative z-10">
                {/* Card Header */}
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/70 flex items-center justify-center shrink-0 shadow-2xs">
                    <svg
                      className="w-6 h-6 text-amber-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-heading tracking-tight">
                      Before the interview
                    </h3>
                    <p className="text-xs sm:text-sm text-muted font-normal mt-0.5">
                      Prepare before you walk in.
                    </p>
                  </div>
                </div>

                {/* Subtle Divider */}
                <div className="border-t border-slate-100/90 my-5" aria-hidden="true" />

                {/* Checklist */}
                <ul className="space-y-3.5 sm:space-y-4">
                  {interviewBefore.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-xs sm:text-sm text-body leading-relaxed font-normal"
                    >
                      <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 border border-amber-200/70 flex items-center justify-center shrink-0 mt-0.5">
                        <svg
                          className="w-3 h-3 text-amber-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="3"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                          />
                        </svg>
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* During the Interview */}
            <div className="group bg-white rounded-2xl sm:rounded-[22px] border border-slate-200/80 p-6 sm:p-7 shadow-2xs hover:shadow-xs transition-all duration-200 sm:hover:-translate-y-0.5 relative overflow-hidden flex flex-col justify-between h-full">
              {/* Subtle decorative emerald glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full bg-emerald-100/35 blur-2xl"
              />

              <div className="relative z-10">
                {/* Card Header */}
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/70 flex items-center justify-center shrink-0 shadow-2xs">
                    <svg
                      className="w-6 h-6 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                      <circle cx="8" cy="12" r="1" fill="currentColor" />
                      <circle cx="12" cy="12" r="1" fill="currentColor" />
                      <circle cx="16" cy="12" r="1" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-heading tracking-tight">
                      During the interview
                    </h3>
                    <p className="text-xs sm:text-sm text-muted font-normal mt-0.5">
                      Communicate clearly and naturally.
                    </p>
                  </div>
                </div>

                {/* Subtle Divider */}
                <div className="border-t border-slate-100/90 my-5" aria-hidden="true" />

                {/* Checklist */}
                <ul className="space-y-3.5 sm:space-y-4">
                  {interviewDuring.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-xs sm:text-sm text-body leading-relaxed font-normal"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/70 flex items-center justify-center shrink-0 mt-0.5">
                        <svg
                          className="w-3 h-3 text-emerald-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="3"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                          />
                        </svg>
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section
        id="faq"
        className="scroll-mt-24 w-full pt-14 sm:pt-20 pb-16 sm:pb-24 bg-[#f8fafc] border-b border-slate-200/60"
        aria-labelledby="faq-heading"
      >
        <div className="container-custom max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="mb-8 sm:mb-10">
            <span className="text-xs font-bold text-primary tracking-widest uppercase block mb-2 sm:mb-2.5">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2
              id="faq-heading"
              className="text-2xl sm:text-[30px] lg:text-[32px] font-extrabold text-heading tracking-tight leading-snug"
            >
              Questions candidates often ask.
            </h2>
            <p className="text-sm sm:text-base text-body mt-2 sm:mt-2.5 leading-relaxed font-normal max-w-2xl">
              Find answers to common questions about our hiring process, applications and roles.
            </p>
          </div>

          {/* Single Unified Grouped Accordion Container */}
          <div className="bg-white rounded-2xl sm:rounded-[22px] border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              const contentId = `faq-answer-${idx}`;
              const buttonId = `faq-question-${idx}`;

              return (
                <div
                  key={idx}
                  className={`transition-colors duration-150 ${
                    isOpen ? "bg-[#f8f9ff]" : "hover:bg-[#fafaff]"
                  }`}
                >
                  <button
                    type="button"
                    id={buttonId}
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    className="group w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4.5 sm:py-5 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-inset min-h-[64px]"
                  >
                    <span
                      className={`text-sm sm:text-base font-semibold tracking-tight transition-colors duration-150 pr-2 ${
                        isOpen ? "text-primary" : "text-heading group-hover:text-primary"
                      }`}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                        isOpen
                          ? "rotate-180 bg-purple-100/90 text-primary"
                          : "text-slate-400 bg-slate-100/70 group-hover:bg-purple-50 group-hover:text-primary"
                      }`}
                      aria-hidden="true"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      id={contentId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-xs sm:text-sm text-body leading-relaxed font-normal"
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
