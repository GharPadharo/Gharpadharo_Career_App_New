import Image from "next/image";
import Link from "next/link";
import GoogleSignInButton from "@/components/admin/GoogleSignInButton";
import { WEBSITE_IMAGES } from "@/lib/websiteImages";

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

export default async function AdminLoginPage({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;
  const callbackUrl = params?.callbackUrl || "/admin/dashboard";

  let errorMessage = "";
  if (error === "AccessDenied") {
    errorMessage = "Access denied: Your Google account is not authorized as an administrator.";
  } else if (error === "OAuthCallbackError" || error === "OAuthSignin") {
    errorMessage = "Could not authenticate with Google. Please check your credentials and try again.";
  } else if (error) {
    errorMessage = "Authentication failed. Please try signing in again.";
  }

  return (
    <div className="relative min-h-[calc(100dvh-4.5rem)] sm:min-h-[calc(100vh-4.5rem)] w-full flex items-center justify-center px-4 py-10 sm:py-16 overflow-hidden">
      {/* Full-viewport Mountain Landscape Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={WEBSITE_IMAGES.admin.loginBackground}
          alt="Misty lavender mountain sunrise"
          fill
          priority
          quality={100}
          unoptimized
          className="object-cover object-center select-none pointer-events-none"
          sizes="100vw"
        />
      </div>

      {/* Centered Glassmorphic Login Container */}
      <div className="relative z-10 w-full max-w-[420px] mx-auto">
        {/* Glassmorphism Login Card */}
        <section
          aria-labelledby="admin-login-heading"
          className="rounded-[30px] bg-white/30 sm:bg-white/35 border border-white/60 backdrop-blur-[20px] shadow-[0_24px_50px_rgba(30,12,65,0.22)] p-6 sm:p-9 transition-all duration-300"
        >
          {/* Card Top: Official Logo & Portal Branding */}
          <div className="text-center mb-6 sm:mb-7">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-full bg-white/85 border border-white shadow-[0_4px_16px_rgba(89,41,214,0.18)] backdrop-blur-md mb-3.5 p-1 sm:p-[4px] overflow-hidden">
              <Image
                src={WEBSITE_IMAGES.brand.logo}
                alt="GharPadharo Official Logo"
                width={62}
                height={62}
                className="w-full h-full object-contain rounded-full"
                priority
              />
            </div>

            <div>
              <span className="inline-flex items-center justify-center px-3.5 py-1 rounded-full bg-[#EAE6F8] border border-[#D8D2F2] text-[10.5px] sm:text-[11px] font-bold text-[#5929D6] tracking-wider uppercase shadow-xs">
                GharPadharo Careers
              </span>
            </div>

            <h1
              id="admin-login-heading"
              className="text-3xl sm:text-[34px] font-extrabold text-[#0F172A] tracking-tight mt-3"
            >
              Admin <span className="text-[#5929D6]">Portal</span>
            </h1>

            <p className="text-sm sm:text-[14.5px] text-[#3F3B5C] mt-2 leading-relaxed font-medium max-w-[310px] mx-auto">
              Sign in with your authorized GharPadharo account to manage job listings.
            </p>
          </div>

          {/* Error Notice for Access Denied / OAuth failures */}
          {errorMessage && (
            <div
              id="oauth-error-container"
              role="alert"
              aria-live="polite"
              className="mb-5 p-3 rounded-xl bg-red-500/15 border border-red-400/40 text-xs sm:text-sm text-red-900 font-medium flex items-start gap-2.5 backdrop-blur-md shadow-xs"
            >
              <svg
                className="w-4 h-4 text-red-600 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* OAuth Action Button */}
          <div className="space-y-4">
            <GoogleSignInButton callbackUrl={callbackUrl} />
          </div>

          {/* Informational Security Notice */}
          <div className="mt-7 pt-5 border-t border-purple-200/50">
            <div className="flex items-center justify-center gap-2 text-xs sm:text-[13px] text-[#3F3B5C] font-medium leading-relaxed text-center">
              <svg
                className="w-4 h-4 text-[#5929D6] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              <span>Admin access is restricted to authorized GharPadharo accounts only.</span>
            </div>
          </div>
        </section>

        {/* Navigation back to public portal */}
        <div className="text-center mt-5">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-white hover:text-white px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-98"
          >
            <span aria-hidden="true">&larr;</span>
            <span>Back to Jobs</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
