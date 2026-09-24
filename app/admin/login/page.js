import Image from "next/image";
import Link from "next/link";
import GoogleSignInButton from "@/components/admin/GoogleSignInButton";

export const metadata = {
  title: "Admin Login | GharPadharo Careers",
  description: "Sign in to access the GharPadharo Careers administrative portal.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-12 sm:py-20 bg-background">
      <div className="w-full max-w-[460px] mx-auto">
        {/* Admin Login Card */}
        <section
          aria-labelledby="admin-login-heading"
          className="bg-card rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-10"
        >
          {/* Card Top: Official Logo & Portal Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 border border-slate-100 shadow-2xs mb-4 overflow-hidden">
              <Image
                src="/logo.png"
                alt="GharPadharo Official Logo"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">
              GharPadharo Careers
            </p>
            <h1
              id="admin-login-heading"
              className="text-2xl sm:text-3xl font-bold text-heading mt-2"
            >
              Admin Portal
            </h1>
            <p className="text-sm text-body mt-2.5 leading-relaxed">
              Sign in with your authorized GharPadharo account to manage job listings.
            </p>
          </div>

          {/* Structural Error Container (Prepared for future OAuth error responses, e.g. ?error=AccessDenied) */}
          {/* Currently hidden by default because authentication is not yet active */}
          <div
            id="oauth-error-container"
            aria-live="polite"
            className="hidden mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium"
          >
            {/* Future OAuth error message will be rendered here */}
          </div>

          {/* OAuth Action Button */}
          <div className="space-y-4">
            <GoogleSignInButton />
          </div>

          {/* Informational Security Notice */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-start gap-2.5 text-xs text-muted leading-relaxed">
              <svg
                className="w-4 h-4 text-slate-400 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              <span>Admin access is restricted to authorized GharPadharo accounts.</span>
            </div>
          </div>
        </section>

        {/* Navigation back to public portal */}
        <div className="text-center mt-6">
          <Link
            href="/jobs"
            className="inline-flex items-center text-sm font-medium text-body hover:text-primary transition-colors gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1"
          >
            <span aria-hidden="true">&larr;</span>
            <span>Back to Jobs</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
