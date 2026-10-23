"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  UsersRound,
  FileText,
  Info,
  ChevronRight,
  X,
} from "lucide-react";
import { WEBSITE_IMAGES } from "@/lib/websiteImages";

const NAV_LINKS = [
  {
    label: "Jobs",
    href: "/jobs",
    icon: BriefcaseBusiness,
  },
  {
    label: "Life at GharPadharo",
    href: "/life-at-gharpadharo",
    icon: UsersRound,
  },
  {
    label: "Resources",
    href: "/resources",
    icon: FileText,
  },
  {
    label: "About",
    href: "https://www.gharpadharo.com/about",
    icon: Info,
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
        <div className="container-custom max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-17 sm:h-[72px] flex items-center justify-between relative">
          {/* Brand / Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 outline-hidden focus-visible:ring-2 focus-visible:ring-[#5929D6]/30 rounded-lg py-1 transition-opacity hover:opacity-90 z-10 shrink-0"
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
            <span className="font-extrabold text-xl text-heading tracking-tight whitespace-nowrap">
              GharPadharo
            </span>
          </Link>

          {/* Primary Navigation: Right-aligned on Tablet (768px–1023px) to prevent logo collision, Horizontally Centered on Desktop (1024px+) */}
          <nav
            className="hidden md:flex items-center md:gap-1.5 lg:gap-2.5 md:ml-auto lg:ml-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2"
            aria-label="Primary Navigation"
          >
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href, pathname);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative px-2.5 lg:px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 group whitespace-nowrap ${
                    active
                      ? "text-[#5929D6] hover:bg-[#F0EBFF]"
                      : "text-slate-700 hover:text-[#5929D6] hover:bg-[#F0EBFF]"
                  }`}
                >
                  <span className="relative inline-flex items-center">
                    {link.label}
                    {/* Active Thin Purple Underline Indicator (~2px high, rounded ends) */}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1.5 inset-x-0 h-[2px] bg-[#5929D6] rounded-full transition-all duration-200"
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
            className="md:hidden p-2 rounded-xl text-slate-700 hover:text-[#5929D6] hover:bg-[#F0EBFF] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#5929D6]/30 cursor-pointer"
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
        <div
          className="md:hidden fixed inset-0 z-[110]"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          {/* Subtle dark overlay and soft blur over the remaining page */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300 animate-drawer-fade-in"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* White, vertically arranged navigation panel anchored to the left side */}
          <div
            className="fixed inset-y-0 left-0 z-10 w-[74%] max-w-[320px] bg-white rounded-r-3xl shadow-2xl flex flex-col h-full overflow-hidden animate-drawer-slide-in motion-reduce:animate-none"
          >
            {/* Top Bar with Brand & Close Button */}
            <div className="px-4.5 py-4 flex items-center justify-between border-b border-slate-100 shrink-0 bg-white">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2.5 outline-hidden focus-visible:ring-2 focus-visible:ring-[#525599]/30 rounded-lg py-0.5"
                aria-label="GharPadharo Careers Home"
              >
                <Image
                  src={WEBSITE_IMAGES.brand.logo}
                  alt="GharPadharo"
                  width={34}
                  height={34}
                  className="rounded-full object-cover shrink-0 w-8.5 h-8.5 aspect-square"
                />
                <span className="font-extrabold text-lg text-slate-900 tracking-tight whitespace-nowrap">
                  GharPadharo
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#525599]/40 cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="w-4 h-4 stroke-[2]" aria-hidden="true" />
              </button>
            </div>

            {/* Navigation Items List */}
            <div className="p-3 sm:p-3.5 flex-1 overflow-y-auto">
              <nav className="flex flex-col gap-1.5" aria-label="Mobile Navigation Links">
                {NAV_LINKS.map((link) => {
                  const active = isLinkActive(link.href, pathname);
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`group min-h-[48px] flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-150 active:scale-[0.98] ${
                        active
                          ? "bg-[#525599]/10 text-[#525599] font-bold"
                          : "text-[#0f172a] font-medium hover:bg-slate-50 active:bg-slate-100 hover:text-slate-950"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={`w-5 h-5 shrink-0 stroke-[1.8] transition-colors ${
                            active
                              ? "text-[#525599]"
                              : "text-slate-500 group-hover:text-slate-700"
                          }`}
                          aria-hidden="true"
                        />
                        <span className="text-[15px] truncate">
                          {link.label}
                        </span>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 shrink-0 stroke-[2] ml-2 transition-colors ${
                          active
                            ? "text-[#525599]"
                            : "text-slate-300 group-hover:text-slate-400"
                        }`}
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
