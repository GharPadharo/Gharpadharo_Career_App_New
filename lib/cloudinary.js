import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";

/**
 * Server-only Cloudinary Helper
 * 
 * Securely handles resume uploads and cleanup:
 * - Credentials loaded exclusively from server environment variables
 * - API secret is NEVER exposed to client-side bundles
 * - Strictly stores under "gharpadharo-careers/resumes" folder
 * - Generates collision-resistant, cryptographically secure public IDs
 */

export const RESUME_FOLDER = "gharpadharo-careers/resumes";
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream", // fallback from certain OS/browsers
];

/**
 * Check if Cloudinary is configured in the current environment
 * @returns {boolean}
 */
export function isCloudinaryConfigured() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  return Boolean(
    CLOUDINARY_CLOUD_NAME &&
    CLOUDINARY_API_KEY &&
    CLOUDINARY_API_SECRET &&
    CLOUDINARY_CLOUD_NAME.trim() &&
    CLOUDINARY_API_KEY.trim() &&
    CLOUDINARY_API_SECRET.trim()
  );
}

/**
 * Configure and return the Cloudinary v2 SDK instance
 */
export function getCloudinaryClient() {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary credentials are not configured. Please define CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your server environment."
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
    secure: true,
  });

  return cloudinary;
}

/**
 * Validates buffer magic bytes for allowed document types
 * @param {Buffer} buffer 
 * @param {string} extension 
 * @returns {boolean}
 */
export function validateMagicBytes(buffer, extension) {
  if (!buffer || buffer.length < 4) return false;
  const ext = extension.toLowerCase();

  // PDF: %PDF-
  if (ext === ".pdf") {
    return (
      buffer[0] === 0x25 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x44 &&
      buffer[3] === 0x46
    );
  }

  // DOCX: PK\x03\x04 (ZIP container)
  if (ext === ".docx") {
    return (
      buffer[0] === 0x50 &&
      buffer[1] === 0x4b &&
      (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07)
    );
  }

  // DOC: OLE2 compound document 0xD0 0xCF 0x11 0xE0
  if (ext === ".doc") {
    return (
      buffer[0] === 0xd0 &&
      buffer[1] === 0xcf &&
      buffer[2] === 0x11 &&
      buffer[3] === 0xe0
    );
  }

  return false;
}

/**
 * Uploads a document buffer to Cloudinary with safe unique public ID
 * @param {Buffer} buffer 
 * @param {string} originalFileName 
 * @param {string} extension 
 * @returns {Promise<{ fileUrl: string, publicId: string, resourceType: string, bytes: number }>}
 */
export async function uploadResumeBuffer(buffer, originalFileName, extension) {
  const client = getCloudinaryClient();

  const safeRandom = crypto.randomBytes(12).toString("hex");
  const timestamp = Date.now();
  const publicId = `${RESUME_FOLDER}/resume_${timestamp}_${safeRandom}`;

  return new Promise((resolve, reject) => {
    // For documents (PDF, DOC, DOCX), use resource_type: "auto" so Cloudinary handles raw/document formats correctly without rasterization
    const uploadStream = client.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: "auto",
        folder: undefined, // folder already prefixed in public_id
        overwrite: false,
        use_filename: false,
        unique_filename: false,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload stream error:", error);
          return reject(new Error("Cloudinary upload failed"));
        }
        resolve({
          fileUrl: result.secure_url || result.url,
          publicId: result.public_id,
          resourceType: result.resource_type || "auto",
          bytes: result.bytes || buffer.length,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Server-side helper to delete an uploaded resume from Cloudinary
 * Used for cleanup when application creation fails after upload
 * @param {string} publicId 
 * @param {string} [resourceType="image"]
 * @returns {Promise<{ success: boolean }>}
 */
export async function deleteResume(publicId, resourceType = "image") {
  if (!publicId || typeof publicId !== "string") {
    return { success: false };
  }

  // Security check: Only allow deleting files in our dedicated folder
  if (!publicId.startsWith(RESUME_FOLDER)) {
    console.warn(`Refusing to delete publicId outside resume folder: ${publicId}`);
    return { success: false };
  }

  if (!isCloudinaryConfigured()) {
    console.warn("Cloudinary not configured; skipping remote deleteResume.");
    return { success: false };
  }

  try {
    const client = getCloudinaryClient();
    // Cloudinary uploader.destroy does not accept 'auto'. PDFs are stored under 'image' (or occasionally 'raw').
    const primaryType = (!resourceType || resourceType === "auto") ? "image" : resourceType;
    let res = await client.uploader.destroy(publicId, { resource_type: primaryType });
    const isSuccess = (r) => r && (r.result === "ok" || r.result === "not found");
    if (!isSuccess(res)) {
      const fallbackType = primaryType === "image" ? "raw" : "image";
      res = await client.uploader.destroy(publicId, { resource_type: fallbackType });
    }
    return { success: isSuccess(res), result: res?.result };
  } catch (err) {
    try {
      const client = getCloudinaryClient();
      const res = await client.uploader.destroy(publicId, { resource_type: "raw" });
      const isCleaned = res && (res.result === "ok" || res.result === "not found");
      return { success: isCleaned, result: res?.result };
    } catch {
      console.error("Failed to delete Cloudinary file:", err);
      return { success: false };
    }
  }
}
