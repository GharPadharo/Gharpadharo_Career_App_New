"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * AdminSidebar Component
 * 
 * Clean, professional sidebar matching GharPadharo design tokens:
 * - Desktop: Fixed/Sticky left sidebar (w-64)
 * - Mobile: Slide-out drawer with backdrop overlay
 * - Navigation: Overview, Jobs, Applications
 * - Bottom: Link to "Back to Careers"
 */
export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const navItems = [
    {
      label: "Overview",
      href: "/admin/dashboard",
      active: pathname === "/admin/dashboard",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: "Jobs",
      href: "/admin/dashboard",
      active: pathname?.startsWith("/admin/dashboard"),
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Applications",
      href: "#",
      active: false,
      badge: "0",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-white border-r border-slate-200/90 text-slate-700">
      {/* Top Branding Section */}
      <div>
        <div className="h-18 px-6 flex items-center justify-between border-b border-slate-100">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-lg py-1"
          >
            <Image
              src="/logo.png"
              alt="GharPadharo"
              width={38}
              height={38}
              className="rounded-full object-cover shrink-0"
              priority
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-heading tracking-tight leading-tight">
                GharPadharo
              </span>
              <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                Career Admin
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5" aria-label="Admin Navigation">
          {navItems.map((item, idx) => {
            const isClickable = item.href !== "#";
            const content = (
              <div
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  item.active
                    ? "bg-[#525599]/10 text-primary"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                } ${!isClickable ? "cursor-default opacity-80" : ""}`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    {item.badge}
                  </span>
                )}
              </div>
            );

            return isClickable ? (
              <Link
                key={idx}
                href={item.href}
                onClick={onClose}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl"
              >
                {content}
              </Link>
            ) : (
              <div key={idx}>{content}</div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Back to Careers */}
      <div className="p-4 border-t border-slate-100">
        <Link
          href="/jobs"
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Careers</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (lg:block) */}
      <aside className="hidden lg:block w-64 shrink-0 min-h-screen sticky top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (lg:hidden) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Slide-out panel */}
          <div className="relative w-72 max-w-[85%] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
