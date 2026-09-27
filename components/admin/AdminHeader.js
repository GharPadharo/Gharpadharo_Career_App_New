"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";

/**
 * AdminHeader Component
 * 
 * Clean top header bar for the admin dashboard:
 * - Left: Mobile hamburger button, page title, and supporting subtitle
 * - Right: Admin profile dropdown with avatar, account info, and authenticated Logout action
 */
export default function AdminHeader({
  title = "Dashboard",
  subtitle = "Manage jobs and review career activity.",
  onMenuToggle,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click or Escape key press
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleLogoutClick = () => {
    signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <header className="h-18 px-4 sm:px-8 bg-white border-b border-slate-200/90 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 cursor-pointer shrink-0"
            aria-label="Open sidebar menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-extrabold text-heading tracking-tight leading-tight truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-muted hidden sm:block mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Admin Profile Button with Accessible Dropdown Menu */}
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => {
            setIsDropdownOpen((prev) => !prev);
            setLogoutFeedback(false);
          }}
          aria-expanded={isDropdownOpen}
          aria-haspopup="menu"
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/70 transition-colors cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          aria-label="Admin account menu"
        >
          <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
            A
          </div>
          <span className="text-xs font-bold text-slate-800 hidden sm:inline-block">
            Admin
          </span>
          <svg
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            role="menu"
            aria-orientation="vertical"
            aria-label="Admin profile options"
            className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-lg shadow-slate-200/50 p-2 z-30 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
          >
            {/* Account Details Header */}
            <div className="px-2.5 py-2">
              <p className="text-xs font-bold text-slate-900 leading-tight">
                Admin
              </p>
              <p className="text-[11px] text-muted font-normal mt-0.5">
                Admin account
              </p>
            </div>

            <div className="h-px bg-slate-100 my-1" role="separator" />

            {/* Logout Action */}
            <button
              type="button"
              role="menuitem"
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50/70 transition-colors group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40"
            >
              <svg
                className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
