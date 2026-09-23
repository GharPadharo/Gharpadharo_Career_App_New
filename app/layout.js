import { Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-body">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
