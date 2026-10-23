export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/jobs", "/life-at-gharpadharo", "/resources"],
        disallow: ["/admin/", "/jobs/*/apply", "/api/"],
      },
    ],
    sitemap: "https://career.gharpadharo.com/sitemap.xml",
  };
}
