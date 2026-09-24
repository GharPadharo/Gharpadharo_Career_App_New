"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-[100] w-full bg-white border-b border-border shadow-xs">
      {/* Top Header Bar */}
      <div className="container-custom h-18 flex items-center justify-between relative z-[100] bg-white">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-lg py-1"
          aria-label="GharPadharo Careers Home"
        >
          <Image
            src="/logo.png"
            alt="GharPadharo"
            width={44}
            height={44}
            className="rounded-full object-cover shrink-0"
            priority
          />
          <span className="font-extrabold text-xl text-heading tracking-tight">
            GharPadharo
          </span>
        </Link>

        {/* Desktop Primary Navigation */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Primary Navigation"
        >
          <Link
            href="/jobs"
            className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors duration-200"
          >
            Jobs
          </Link>
          <Link
            href="/life-at-gharpadharo"
            className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors duration-200"
          >
            Life at GharPadharo
          </Link>
          <Link
            href="/#about"
            className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors duration-200"
          >
            About
          </Link>
        </nav>

        {/* Desktop Header Action */}
        <div className="hidden md:flex items-center">
          <Link
            href="/admin/login"
            className="btn-primary text-sm px-5 py-2.5 rounded-xl shadow-xs"
          >
            Admin Login
          </Link>
        </div>

        {/* Mobile Hamburger / Close Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg text-slate-700 hover:text-primary hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isMenuOpen ? (
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
          ) : (
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
          )}
        </button>
      </div>

      {/* Mobile Drawer & Backdrop Layering */}
      {isMenuOpen && (
        <div className="md:hidden">
          {/* Dimmed Backdrop Overlay covering full viewport behind menu (z-[90]) */}
          <div
            className="fixed inset-0 z-[90] bg-black/50 transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Opaque Full-Available-Height Mobile Navigation Panel (z-[110]) */}
          <div
            className="fixed top-18 inset-x-0 bottom-0 z-[110] bg-white border-t border-border flex flex-col justify-between p-6 sm:p-8 overflow-y-auto shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            {/* Primary Mobile Navigation Links */}
            <nav
              className="flex flex-col gap-2 pt-2"
              aria-label="Mobile Navigation Links"
            >
              <Link
                href="/jobs"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-100 hover:text-primary transition-colors"
              >
                Jobs
              </Link>
              <Link
                href="/life-at-gharpadharo"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-100 hover:text-primary transition-colors"
              >
                Life at GharPadharo
              </Link>
              <Link
                href="/#about"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-100 hover:text-primary transition-colors"
              >
                About
              </Link>
            </nav>

            {/* Separate Mobile CTA: Admin Login */}
            <div className="pt-6 border-t border-slate-100 mt-auto">
              <Link
                href="/admin/login"
                onClick={() => setIsMenuOpen(false)}
                className="btn-primary w-full text-center justify-center text-base py-3.5 rounded-xl shadow-xs"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
