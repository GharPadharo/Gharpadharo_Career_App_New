export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/jobs", "/life-at-gharpadharo"],
        disallow: ["/admin/", "/jobs/*/apply"],
      },
    ],
    sitemap: "https://career.gharpadharo.com/sitemap.xml",
  };
}
