"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'duplicate' | 'error'
  const [message, setMessage] = useState("");

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim();
    if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await res.json();

      if (res.status === 201) {
        setStatus("success");
        setMessage("You're subscribed! We'll keep you updated.");
        setEmail("");
      } else if (res.ok && data.isDuplicate) {
        setStatus("duplicate");
        setMessage("You're already subscribed.");
      } else if (res.status === 400) {
        setStatus("error");
        setMessage(data.error || "Please enter a valid email address.");
      } else {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  const isAdminDashboard = pathname?.startsWith("/admin/dashboard");

  if (isAdminDashboard) {
    return null;
  }

  return (
    <footer className="w-full bg-footer text-slate-300 border-t border-neutral-800/80">
      <div className="container-custom pt-16 pb-12">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: GharPadharo Careers */}
          <div className="lg:col-span-3">
            <h3 className="text-white !text-white font-bold text-base tracking-tight">
              GharPadharo Careers
            </h3>
            <div className="h-0.5 w-8 bg-primary rounded-full mt-2 mb-4" />
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/#about"
                  className="text-slate-300 hover:text-white transition-colors duration-150 inline-block focus:outline-none focus:underline"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/life-at-gharpadharo"
                  className="text-slate-300 hover:text-white transition-colors duration-150 inline-block focus:outline-none focus:underline"
                >
                  Life at GharPadharo
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="text-slate-300 hover:text-white transition-colors duration-150 inline-block focus:outline-none focus:underline"
                >
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="lg:col-span-3">
            <h3 className="text-white !text-white font-bold text-base tracking-tight">
              Resources
            </h3>
            <div className="h-0.5 w-8 bg-primary rounded-full mt-2 mb-4" />
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/jobs#interview-preparation"
                  className="text-slate-300 hover:text-white transition-colors duration-150 inline-block focus:outline-none focus:underline"
                >
                  Interview Preparation
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs#resume-tips"
                  className="text-slate-300 hover:text-white transition-colors duration-150 inline-block focus:outline-none focus:underline"
                >
                  Resume Tips
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs#events"
                  className="text-slate-300 hover:text-white transition-colors duration-150 inline-block focus:outline-none focus:underline"
                >
                  Career Events
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs#faq"
                  className="text-slate-300 hover:text-white transition-colors duration-150 inline-block focus:outline-none focus:underline"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs#blog"
                  className="text-slate-300 hover:text-white transition-colors duration-150 inline-block focus:outline-none focus:underline"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div className="lg:col-span-2">
            <h3 className="text-white !text-white font-bold text-base tracking-tight">
              Connect
            </h3>
            <div className="h-0.5 w-8 bg-primary rounded-full mt-2 mb-4" />
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="https://www.instagram.com/ghar_padharo"
                  className="text-slate-300 hover:text-white transition-colors duration-150 inline-block focus:outline-none focus:underline"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.linkedin.com/company/gharpadharo/"
                  className="text-slate-300 hover:text-white transition-colors duration-150 inline-block focus:outline-none focus:underline"
                >
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.youtube.com/@gharpadharo"
                  className="text-slate-300 hover:text-white transition-colors duration-150 inline-block focus:outline-none focus:underline"
                >
                  YouTube
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Stay Updated */}
          <div className="lg:col-span-4">
            <h3 className="text-white !text-white font-bold text-base tracking-tight">
              Stay Updated
            </h3>
            <div className="h-0.5 w-8 bg-primary rounded-full mt-2 mb-4" />
            <p className="text-sm leading-relaxed mb-4 text-slate-300">
              Subscribe to our newsletter for the latest job openings and career
              tips.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-2 sm:gap-0 max-w-md"
              noValidate
            >
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle" && status !== "loading") {
                    setStatus("idle");
                    setMessage("");
                  }
                }}
                disabled={status === "loading"}
                placeholder="Your email address"
                className="flex-1 bg-neutral-800/90 border border-neutral-700/80 text-white placeholder-slate-400 text-sm px-4 py-2.5 rounded-xl sm:rounded-r-none outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label="Email address for newsletter"
                autoComplete="email"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                aria-busy={status === "loading"}
                className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-5 py-2.5 rounded-xl sm:rounded-l-none transition-colors duration-200 cursor-pointer shrink-0 shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            {message && (
              <p
                role="status"
                aria-live="polite"
                className={`mt-2.5 text-xs font-medium ${
                  status === "success"
                    ? "text-emerald-400"
                    : status === "duplicate"
                    ? "text-amber-300"
                    : "text-rose-400"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Divider & Legal / Copyright */}
        <div className="border-t border-neutral-800/80 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
            <Link
              href="#"
              className="hover:text-white transition-colors duration-150 focus:outline-none focus:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="hover:text-white transition-colors duration-150 focus:outline-none focus:underline"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="hover:text-white transition-colors duration-150 focus:outline-none focus:underline"
            >
              Cookie Policy
            </Link>
            <Link
              href="#"
              className="hover:text-white transition-colors duration-150 focus:outline-none focus:underline"
            >
              Accessibility
            </Link>
          </div>
          <p className="text-center md:text-right" suppressHydrationWarning>
            © {new Date().getFullYear()} GharPadharo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
