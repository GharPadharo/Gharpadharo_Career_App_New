/**
 * Job Serializer Utility
 * 
 * Normalizes MongoDB Job documents to the exact shape expected by the frontend.
 * - Maps `slug` to `id` (preserving public URL and component expectations)
 * - Computes dynamic `postedDays` and human-friendly `postedText`
 * - Ensures safe array defaults for responsibilities, skills, requirements, and tags
 */

export function formatPostedText(postedAt) {
  if (!postedAt) return "Recently";
  const date = new Date(postedAt);
  const now = new Date();
  const diffTime = Math.max(0, now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Posted today";
  if (diffDays === 1) return "Posted yesterday";
  if (diffDays < 7) return `Posted ${diffDays} days ago`;
  if (diffDays < 14) return "Posted 1 week ago";
  if (diffDays < 21) return "Posted 2 weeks ago";
  if (diffDays < 30) return "Posted 3 weeks ago";
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "Posted 1 month ago";
  return `Posted ${diffMonths} months ago`;
}

export function serializeJob(jobDoc) {
  if (!jobDoc) return null;
  const raw = typeof jobDoc.toObject === "function" ? jobDoc.toObject() : jobDoc;

  const postedAtDate = raw.postedAt ? new Date(raw.postedAt) : new Date();
  const diffTime = Math.max(0, Date.now() - postedAtDate.getTime());
  const postedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return {
    _id: raw._id?.toString() || "",
    id: raw.slug,
    slug: raw.slug,
    title: raw.title || "",
    team: raw.team || "",
    type: raw.type || "Full-time",
    experience: raw.experience || "",
    location: raw.location || "",
    workMode: raw.workMode || "Remote",
    description: raw.description || "",
    responsibilities: Array.isArray(raw.responsibilities) ? raw.responsibilities : [],
    skills: Array.isArray(raw.skills) ? raw.skills : [],
    requirements: Array.isArray(raw.requirements) ? raw.requirements : [],
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    status: (raw.status || "draft").toLowerCase(),
    postedAt: postedAtDate.toISOString(),
    postedDays,
    postedText: formatPostedText(postedAtDate),
    createdAt: raw.createdAt ? new Date(raw.createdAt).toISOString() : undefined,
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt).toISOString() : undefined,
  };
}
