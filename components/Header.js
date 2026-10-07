"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { WEBSITE_IMAGES } from "@/lib/websiteImages";

const NAV_LINKS = [
  {
    label: "Jobs",
    href: "/jobs",
    icon: (cls) => (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        <path d="M12 11v3" />
      </svg>
    ),
  },
  {
    label: "Life at GharPadharo",
    href: "/life-at-gharpadharo",
    icon: (cls) => (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Resources",
    href: "/resources",
    icon: (cls) => (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: "About",
    href: "https://www.gharpadharo.com/about",
    icon: (cls) => (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8h.01M12 12v4" />
      </svg>
    ),
  },
];

function isLinkActive(href, pathname) {
  if (!pathname) return false;
  if (href === "/jobs") {
    return (
      pathname === "/jobs" ||
      pathname.startsWith("/jobs/") ||
      pathname.startsWith("/careers")
    );
  }
  if (href === "/life-at-gharpadharo") {
    return (
      pathname === "/life-at-gharpadharo" ||
      pathname.startsWith("/life-at-gharpadharo/")
    );
  }
  if (href === "/resources") {
    return pathname === "/resources" || pathname.startsWith("/resources/");
  }
  if (href === "/#about") {
    return pathname === "/about";
  }
  return false;
}

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll for sticky header states
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on Escape key and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const isAdminDashboard = pathname?.startsWith("/admin/dashboard");

  if (isAdminDashboard) {
    return null;
  }

  return (
    <>
      <header
        className={`sticky top-0 z-[100] w-full transition-all duration-300 print:static ${
          isScrolled
            ? "bg-white/92 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs"
            : "bg-white border-b border-[#E2E8F0]/60 shadow-none"
        }`}
      >
        <div className="container-custom max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-17 sm:h-[72px] flex items-center justify-between relative">
          {/* Brand / Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 outline-hidden focus-visible:ring-2 focus-visible:ring-[#525599]/30 rounded-lg py-1 transition-opacity hover:opacity-90 z-10 shrink-0"
            aria-label="GharPadharo Careers Home"
          >
            <Image
              src={WEBSITE_IMAGES.brand.logo}
              alt="GharPadharo"
              width={42}
              height={42}
              className="rounded-full object-cover shrink-0 w-9.5 h-9.5 sm:w-[42px] sm:h-[42px]"
              priority
            />
            <span className="font-extrabold text-xl text-heading tracking-tight">
              GharPadharo
            </span>
          </Link>

          {/* Desktop Primary Navigation (Horizontally Centered) */}
          <nav
            className="hidden md:flex items-center gap-1 lg:gap-2.5 absolute left-1/2 -translate-x-1/2"
            aria-label="Primary Navigation"
          >
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href, pathname);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative px-3 lg:px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 group whitespace-nowrap ${
                    active
                      ? "text-[#525599] hover:bg-[#F3F2FF]"
                      : "text-slate-700 hover:text-[#525599] hover:bg-[#F3F2FF]"
                  }`}
                >
                  <span className="relative inline-flex items-center">
                    {link.label}
                    {/* Active Thin Purple Underline Indicator (~2px high, rounded ends) */}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1.5 inset-x-0 h-[2px] bg-[#525599] rounded-full transition-all duration-200"
                      />
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:text-[#525599] hover:bg-[#F3F2FF] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#525599]/30 cursor-pointer"
            aria-expanded={isMenuOpen}
            aria-label="Open navigation menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Modal / Drawer with Dimmed Backdrop */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[110]" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          {/* Dimmed Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Mobile Menu Panel Sliding Down from Top */}
          <div className="relative bg-white rounded-b-3xl shadow-2xl border-b border-[#E2E8F0] overflow-hidden z-10 transition-transform duration-300">
            {/* Top Bar with Brand & Close 'X' Button */}
            <div className="container-custom max-w-[1240px] mx-auto px-4 sm:px-6 h-17 flex items-center justify-between border-b border-[#E2E8F0]/70">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 outline-hidden"
                aria-label="GharPadharo Careers Home"
              >
                <Image
                  src={WEBSITE_IMAGES.brand.logo}
                  alt="GharPadharo"
                  width={38}
                  height={38}
                  className="rounded-full object-cover shrink-0"
                />
                <span className="font-extrabold text-xl text-heading tracking-tight">
                  GharPadharo
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-xl text-slate-700 hover:text-[#525599] hover:bg-[#F3F2FF] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#525599]/30 cursor-pointer"
                aria-label="Close navigation menu"
              >
                <svg
                  className="w-6 h-6"
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

            {/* Navigation List & Actions */}
            <div className="container-custom max-w-[1240px] mx-auto px-4 sm:px-6 py-5 space-y-4">
              <nav className="flex flex-col gap-1.5" aria-label="Mobile Navigation Links">
                {NAV_LINKS.map((link) => {
                  const active = isLinkActive(link.href, pathname);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-150 ${
                        active
                          ? "bg-[#F3F2FF] text-[#525599]"
                          : "text-slate-800 hover:bg-[#F3F2FF] hover:text-[#525599]"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`shrink-0 ${
                            active
                              ? "text-[#525599]"
                              : "text-slate-500 group-hover:text-[#525599]"
                          } transition-colors`}
                        >
                          {link.icon("w-5 h-5")}
                        </span>
                        <span className="text-[15px] font-semibold">{link.label}</span>
                      </div>
                      <svg
                        className={`w-4 h-4 ${
                          active
                            ? "text-[#525599]"
                            : "text-slate-400 group-hover:text-[#525599]"
                        } transition-colors`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  );
                })}
              </nav>

              {/* Full-width Mobile CTA: Explore Open Roles */}
              <div className="pt-2 pb-1">
                <Link
                  href="/jobs"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#525599] hover:bg-[#46477F] text-white text-base font-bold py-3.5 px-6 rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 active:scale-95"
                >
                  <span>Explore Open Roles</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
