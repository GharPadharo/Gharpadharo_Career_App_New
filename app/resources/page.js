import ResourcesHub from "@/components/careers/ResourcesHub";

export const metadata = {
  title: {
    absolute: "Career Resources | GharPadharo",
  },
  description:
    "Helpful career resources from GharPadharo, including hiring process guidance, resume tips, interview preparation, and frequently asked questions.",
  alternates: {
    canonical: "https://career.gharpadharo.com/resources",
  },
  openGraph: {
    title: "Career Resources | GharPadharo",
    description:
      "Helpful career resources from GharPadharo, including hiring process guidance, resume tips, interview preparation, and frequently asked questions.",
    url: "https://career.gharpadharo.com/resources",
    siteName: "GharPadharo Careers",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Resources | GharPadharo",
    description:
      "Helpful career resources from GharPadharo, including hiring process guidance, resume tips, interview preparation, and frequently asked questions.",
  },
};

export default function ResourcesPage() {
  return <ResourcesHub />;
}
