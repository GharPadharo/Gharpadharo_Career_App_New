"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { WEBSITE_IMAGES } from "@/lib/websiteImages";

export default function Footer() {
  const pathname = usePathname();

  const isAdminDashboard = pathname?.startsWith("/admin/dashboard");

  if (isAdminDashboard) {
    return null;
  }

  return (
    <footer className="w-full bg-[#0b0d11] text-slate-300 border-t border-neutral-800/80">
      <div className="container-custom pt-10 sm:pt-12 lg:pt-16 pb-8 sm:pb-10">
        {/* Main Grid: Responsive 2-column on mobile, 4-column (12-col grid) on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-x-6 sm:gap-x-8 gap-y-8 sm:gap-y-10 lg:gap-8 xl:gap-12 items-start">
          {/* COLUMN 1 — BRAND / CAREERS */}
          <div className="col-span-2 md:col-span-2 lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg group"
              aria-label="GharPadharo Careers Home"
            >
              <Image
                src={WEBSITE_IMAGES.brand.logo}
                alt="GharPadharo"
                width={36}
                height={36}
                className="rounded-full object-cover shrink-0 ring-1 ring-white/10"
              />
              <span className="font-extrabold text-xl text-white tracking-tight">
                GharPadharo
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-primary/25 text-indigo-200 border border-primary/40">
                CAREERS
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mt-3.5 mb-5 sm:mb-6 font-normal">
              Build technology that makes finding a place simpler. We connect
              property seekers and owners across Uttarakhand through transparent,
              verified living experiences.
            </p>

            {/* Contact entries: two independent, un-merged rows */}
            <div className="flex flex-col gap-3 sm:gap-3.5">
              <a
                href="tel:+917903269007"
                className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 hover:text-white transition-colors group w-fit"
              >
                <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg bg-neutral-900/90 border border-neutral-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-primary/60 transition-colors shrink-0">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                </div>
                <span className="font-medium whitespace-nowrap">+91 7903269007</span>
              </a>

              <a
                href="mailto:gharpadharo@gmail.com"
                className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 hover:text-white transition-colors group w-fit"
              >
                <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg bg-neutral-900/90 border border-neutral-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-primary/60 transition-colors shrink-0">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <span className="font-medium whitespace-nowrap">gharpadharo@gmail.com</span>
              </a>
            </div>
          </div>

          {/* COLUMN 2 — COMPANY */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-3.5 sm:mb-4">
              COMPANY
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="https://www.gharpadharo.com/about"
                  className="text-slate-400 hover:text-white transition-colors duration-150 inline-block focus:outline-none focus:underline"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/life-at-gharpadharo"
                  className="text-slate-400 hover:text-white transition-colors duration-150 inline-block focus:outline-none focus:underline"
                >
                  Life at GharPadharo
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="text-slate-400 hover:text-white transition-colors duration-150 inline-block focus:outline-none focus:underline"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="text-slate-400 hover:text-white transition-colors duration-150 inline-block focus:outline-none focus:underline"
                >
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 — RESOURCES */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-3.5 sm:mb-4">
              RESOURCES
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/resources#hiring-process"
                  className="text-slate-400 hover:text-white transition-colors duration-150 inline-block focus:outline-none focus:underline"
                >
                  Hiring Process
                </Link>
              </li>
              <li>
                <Link
                  href="/resources#resume-tips"
                  className="text-slate-400 hover:text-white transition-colors duration-150 inline-block focus:outline-none focus:underline"
                >
                  Resume Tips
                </Link>
              </li>
              <li>
                <Link
                  href="/resources#interview-prep"
                  className="text-slate-400 hover:text-white transition-colors duration-150 inline-block focus:outline-none focus:underline"
                >
                  Interview Prep
                </Link>
              </li>
              <li>
                <Link
                  href="/resources#faq"
                  className="text-slate-400 hover:text-white transition-colors duration-150 inline-block focus:outline-none focus:underline"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4 — CONTACT / OFFICES */}
          <div className="col-span-2 md:col-span-2 lg:col-span-4">
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-3.5 sm:mb-4">
              OFFICES
            </h3>

            <div className="space-y-4 sm:space-y-4.5">
              {/* Corporate Office */}
              <div className="flex items-start gap-3 sm:gap-3.5">
                <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg bg-neutral-900/90 border border-neutral-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-primary/60 transition-colors shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                    Corporate Office
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    48B, New Colony, Ballupur Chowk, Near LIC Building, Dehradun, UK
                  </p>
                </div>
              </div>

              {/* Registered Office */}
              <div className="flex items-start gap-3 sm:gap-3.5">
                <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg bg-neutral-900/90 border border-neutral-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-primary/60 transition-colors shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                    Registered Office
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Gharpadharo HQ, Jakhan, Rajpur Road, Dehradun, UK
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="border-t border-neutral-800/80 mt-10 sm:mt-12 lg:mt-14 pt-6 sm:pt-7 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-xs text-slate-400">
          {/* Copyright: Only company name bold, dynamic year */}
          <p
            suppressHydrationWarning
            className="text-slate-400 text-xs sm:text-sm text-center sm:text-left"
          >
            © {new Date().getFullYear()}{" "}
            <span className="font-bold text-slate-200">
              Zestos Ventures Pvt. Ltd.
            </span>{" "}
            All rights reserved.
          </p>

          {/* 5 Social Media Buttons: Facebook, X, Instagram, LinkedIn, YouTube */}
          <div className="flex items-center justify-center gap-3 shrink-0">
            <a
              href="https://www.facebook.com/share/15obCLp4gg/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GharPadharo Facebook"
              title="Facebook"
              className="w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-full bg-neutral-900/90 border border-neutral-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary hover:border-primary transition-all duration-200 shrink-0"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                />
              </svg>
            </a>

            <a
              href="https://x.com/gharpadharo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GharPadharo X (formerly Twitter)"
              title="X (Twitter)"
              className="w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-full bg-neutral-900/90 border border-neutral-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary hover:border-primary transition-all duration-200 shrink-0"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <a
              href="https://www.instagram.com/ghar_padharo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GharPadharo Instagram"
              title="Instagram"
              className="w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-full bg-neutral-900/90 border border-neutral-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary hover:border-primary transition-all duration-200 shrink-0"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>

            <a
              href="https://www.linkedin.com/company/gharpadharo/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GharPadharo LinkedIn"
              title="LinkedIn"
              className="w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-full bg-neutral-900/90 border border-neutral-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary hover:border-primary transition-all duration-200 shrink-0"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8z" />
              </svg>
            </a>

            <a
              href="https://www.youtube.com/@gharpadharo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GharPadharo YouTube"
              title="YouTube"
              className="w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-full bg-neutral-900/90 border border-neutral-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary hover:border-primary transition-all duration-200 shrink-0"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
