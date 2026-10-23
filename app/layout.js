import { Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollRevealInit from "@/components/common/ScrollRevealInit";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://career.gharpadharo.com"),
  title: {
    default: "GharPadharo Careers | Join Our Team",
    template: "%s | GharPadharo Careers",
  },
  description:
    "Explore career opportunities at GharPadharo. Discover jobs, teams, and opportunities to build your career with us.",
  applicationName: "GharPadharo Careers",
  authors: [{ name: "GharPadharo", url: "https://www.gharpadharo.com" }],
  creator: "GharPadharo",
  publisher: "GharPadharo",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://career.gharpadharo.com",
    siteName: "GharPadharo Careers",
    title: "GharPadharo Careers | Join Our Team",
    description:
      "Explore career opportunities at GharPadharo. Discover jobs, teams, and opportunities to build your career with us.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "GharPadharo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GharPadharo Careers | Join Our Team",
    description:
      "Explore career opportunities at GharPadharo. Discover jobs, teams, and opportunities to build your career with us.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const globalJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://career.gharpadharo.com/#organization",
      name: "GharPadharo",
      url: "https://career.gharpadharo.com",
      sameAs: "https://www.gharpadharo.com",
      logo: "https://career.gharpadharo.com/logo.png",
    },
    {
      "@type": "WebSite",
      "@id": "https://career.gharpadharo.com/#website",
      url: "https://career.gharpadharo.com",
      name: "GharPadharo Careers",
      description:
        "Explore career opportunities at GharPadharo. Discover jobs, teams, and opportunities to build your career with us.",
      publisher: {
        "@id": "https://career.gharpadharo.com/#organization",
      },
      inLanguage: "en-IN",
    },
  ],
};

const safeJsonLdString = JSON.stringify(globalJsonLd).replace(/</g, "\\u003c");

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://res.cloudinary.com"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdString }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-body">
        <ScrollRevealInit />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
