/**
 * Application Serializer Utility
 * 
 * Normalizes MongoDB Application documents to the exact shape expected by the frontend.
 * - Maps `_id` to `id`
 * - Normalizes `jobId` to `jobSlug` for frontend filter compatibility
 * - Computes human-friendly `appliedText` from `createdAt`
 * - Preserves both flat string resume (for UI) and structured resumeMetadata
 */

export function formatAppliedText(appliedAt) {
  if (!appliedAt) return "Recently";
  const date = new Date(appliedAt);
  const now = new Date();
  const diffTime = Math.max(0, now.getTime() - date.getTime());
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Just now";
  if (diffHours === 1) return "1 hour ago";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "1 month ago";
  return `${diffMonths} months ago`;
}

export function serializeApplication(doc) {
  if (!doc) return null;
  const raw = typeof doc.toObject === "function" ? doc.toObject() : doc;

  const appliedDate = raw.createdAt ? new Date(raw.createdAt) : new Date();
  const candidateName =
    raw.candidate ||
    `${raw.firstName || ""} ${raw.lastName || ""}`.trim() ||
    "Applicant";

  const resumeFileName =
    (typeof raw.resume === "string" ? raw.resume : raw.resume?.fileName) ||
    "resume.pdf";

  return {
    _id: raw._id?.toString() || "",
    id: raw._id?.toString() || "",
    jobId: raw.jobSlug || (raw.jobId?._id ? raw.jobId._id.toString() : raw.jobId?.toString()) || "",
    jobDbId: raw.jobId?._id ? raw.jobId._id.toString() : raw.jobId?.toString() || "",
    jobSlug: raw.jobSlug || "",
    jobTitle: raw.jobTitle || "",
    jobTeam: raw.jobTeam || "",
    candidate: candidateName,
    firstName: raw.firstName || "",
    lastName: raw.lastName || "",
    email: (raw.email || "").toLowerCase().trim(),
    phone: raw.phone || "",
    currentJobTitle: raw.currentJobTitle || "",
    experience: raw.experience || "",
    linkedin: raw.linkedin || "",
    portfolio: raw.portfolio || "",
    coverLetter: raw.coverLetter || "",
    resume: resumeFileName,
    resumeMetadata:
      typeof raw.resume === "object" && raw.resume !== null
        ? {
            fileName: raw.resume.fileName || resumeFileName,
            fileUrl: raw.resume.fileUrl || "",
            publicId: raw.resume.publicId || "",
            fileSize: raw.resume.fileSize || 0,
            mimeType: raw.resume.mimeType || "application/pdf",
          }
        : {
            fileName: resumeFileName,
            fileUrl: "",
            publicId: "",
            fileSize: 0,
            mimeType: "application/pdf",
          },
    consent: Boolean(raw.consent),
    status: (raw.status || "new").toLowerCase(),
    appliedAt: appliedDate.toISOString(),
    appliedText: formatAppliedText(appliedDate),
    viewedAt: raw.viewedAt ? new Date(raw.viewedAt).toISOString() : undefined,
    viewedBy: raw.viewedBy?.toString() || undefined,
    createdAt: appliedDate.toISOString(),
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt).toISOString() : undefined,
  };
}
