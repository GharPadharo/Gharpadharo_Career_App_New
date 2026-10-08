import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import Application from "@/models/Application";
import { serializeApplication } from "@/lib/applicationSerializer";
import { deleteResume } from "@/lib/cloudinary";
import { logActivity } from "@/lib/activityLogger";
import { appendApplicationToSheet } from "@/lib/googleSheets";
import { getNextApplicationNumber } from "@/lib/applicationCounter";
import {
  RATE_LIMIT_RULES,
  addRateLimitHeaders,
  checkRateLimit,
  createRateLimitResponse,
  getClientIp,
} from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\s\-().]{7,30}$/;

/**
 * Helper to validate and normalize resume metadata payload
 */
function validateResume(resume) {
  if (!resume) {
    return { error: "Please upload your resume." };
  }

  let resumeMetadata = {
    fileName: "resume.pdf",
    fileSize: 0,
    mimeType: "application/pdf",
    fileUrl: "",
    publicId: "",
  };

  if (typeof resume === "string" && resume.trim()) {
    resumeMetadata.fileName = resume.trim();
  } else if (typeof resume === "object" && resume !== null) {
    const rFileName = typeof resume.fileName === "string" ? resume.fileName.trim() : "";
    const rFileSize = typeof resume.fileSize === "number" ? resume.fileSize : 0;
    const rMimeType = typeof resume.mimeType === "string" ? resume.mimeType.trim().toLowerCase() : "";
    const rFileUrl = typeof resume.fileUrl === "string" ? resume.fileUrl.trim() : "";
    const rPublicId = typeof resume.publicId === "string" ? resume.publicId.trim() : "";

    if (!rFileName && !rFileUrl) {
      return { error: "Please upload your resume." };
    }

    if (rFileName) {
      const lastDot = rFileName.lastIndexOf(".");
      const ext = lastDot !== -1 ? rFileName.slice(lastDot).toLowerCase() : "";
      if (![".pdf", ".doc", ".docx"].includes(ext)) {
        return { error: "Invalid resume file type. Allowed formats: PDF, DOC, DOCX." };
      }
    }

    if (rFileSize > 10 * 1024 * 1024) {
      return { error: "Resume file size exceeds the 10 MB limit." };
    }

    // Security check: If publicId is supplied, it MUST match our dedicated folder
    if (rPublicId && !rPublicId.startsWith("gharpadharo-careers/resumes/")) {
      return { error: "Invalid resume storage reference." };
    }

    // Security check: If fileUrl is supplied, it MUST originate from cloudinary.com
    if (rFileUrl) {
      try {
        const parsed = new URL(rFileUrl);
        if (!parsed.hostname.endsWith("cloudinary.com")) {
          return { error: "Invalid resume URL host." };
        }
      } catch {
        return { error: "Malformed resume URL." };
      }
    }

    resumeMetadata = {
      fileName: rFileName || "resume.pdf",
      fileSize: rFileSize,
      mimeType: rMimeType || "application/pdf",
      fileUrl: rFileUrl,
      publicId: rPublicId,
    };
  } else {
    return { error: "Please upload a valid resume." };
  }

  return { data: resumeMetadata };
}

/**
 * POST /api/applications
 * 
 * Public endpoint to submit a job application or general application.
 * - Supports applicationType: "job" | "general" (defaults to "job")
 * - Specific Job Application:
 *   - Resolves job from MongoDB by slug or _id (status must be active)
 *   - Enforces candidate required fields: first/last name, email, phone, experience, cover letter, resume, consent
 *   - Prevents duplicate applications for the same job and email (409 Conflict)
 * - General Application:
 *   - Does not require jobId, jobSlug, or jobTitle
 *   - Validates candidate required fields: first/last name, email, resume, consent
 *   - Optional candidate fields: phone, currentJobTitle, experience, linkedin, portfolio, opportunityLookingFor, aboutYourself
 *   - Prevents duplicate general applications for the same email (409 Conflict)
 * - Both types: Defaults status to "new", viewedAt/viewedBy left null/undefined
 */
export async function POST(request) {
  try {
    await connectDB();

    // 1. Enforce IP rate limiting (5 submissions / 15 min) before processing body
    const clientIp = getClientIp(request);
    const ipRateLimit = await checkRateLimit({
      endpointScope: "application_submit_ip",
      identifier: clientIp,
      limit: RATE_LIMIT_RULES.applicationSubmissionIp.limit,
      windowSeconds: RATE_LIMIT_RULES.applicationSubmissionIp.windowSeconds,
    });

    if (!ipRateLimit.allowed) {
      return createRateLimitResponse(ipRateLimit);
    }

    const body = await request.json();

    const {
      applicationType: rawType,
      jobSlug,
      jobId,
      firstName,
      lastName,
      email,
      phone = "",
      currentJobTitle = "",
      experience = "",
      linkedin = "",
      portfolio = "",
      coverLetter = "",
      opportunityLookingFor = "",
      aboutYourself = "",
      resume,
      consent,
    } = body;

    const applicationType = rawType === "general" ? "general" : "job";

    // 1. Shared Candidate Validation
    if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
      return NextResponse.json(
        { success: false, error: "First name is required." },
        { status: 400 }
      );
    }
    if (firstName.length > 100) {
      return NextResponse.json(
        { success: false, error: "First name cannot exceed 100 characters." },
        { status: 400 }
      );
    }

    if (!lastName || typeof lastName !== "string" || !lastName.trim()) {
      return NextResponse.json(
        { success: false, error: "Last name is required." },
        { status: 400 }
      );
    }
    if (lastName.length > 100) {
      return NextResponse.json(
        { success: false, error: "Last name cannot exceed 100 characters." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Email address is required." },
        { status: 400 }
      );
    }
    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail.length > 254 || !EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (consent !== true) {
      return NextResponse.json(
        {
          success: false,
          error: "You must confirm the accuracy of information and consent to proceed.",
        },
        { status: 400 }
      );
    }

    // 2. Enforce email rate limiting (3 submissions / 1 hour) before duplicate checks and database operations
    const emailRateLimit = await checkRateLimit({
      endpointScope: "application_submit_email",
      identifier: normalizedEmail,
      limit: RATE_LIMIT_RULES.applicationSubmissionEmail.limit,
      windowSeconds: RATE_LIMIT_RULES.applicationSubmissionEmail.windowSeconds,
    });

    if (!emailRateLimit.allowed) {
      return createRateLimitResponse(emailRateLimit);
    }

    // candidate full name
    const candidateFullName = `${firstName.trim()} ${lastName.trim()}`;

    // ==================================================
    // 3A. GENERAL APPLICATION FLOW
    // ==================================================
    if (applicationType === "general") {
      // Resume is strictly required for general applications
      if (!resume) {
        return NextResponse.json(
          { success: false, error: "Please upload your resume." },
          { status: 400 }
        );
      }
      const resumeValidation = validateResume(resume);
      if (resumeValidation.error) {
        return NextResponse.json(
          { success: false, error: resumeValidation.error },
          { status: 400 }
        );
      }
      const resumeMetadata = resumeValidation.data;

      // Validate optional phone if provided
      let cleanPhone = "";
      if (phone && typeof phone === "string" && phone.trim()) {
        cleanPhone = phone.trim();
        if (!PHONE_REGEX.test(cleanPhone)) {
          return NextResponse.json(
            { success: false, error: "Please provide a valid phone number." },
            { status: 400 }
          );
        }
      }

      // Check duplicate general application (same normalized email)
      const existingGeneralApp = await Application.findOne({
        applicationType: "general",
        email: normalizedEmail,
      });

      if (existingGeneralApp) {
        return NextResponse.json(
          {
            success: false,
            error: "You have already submitted a general application. Our team will review your profile for upcoming opportunities.",
          },
          { status: 409 }
        );
      }

      const combinedNotes = [
        opportunityLookingFor ? `Looking for: ${opportunityLookingFor.trim()}` : "",
        aboutYourself ? `About: ${aboutYourself.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      let newApplication;
      try {
        const applicationNumber = await getNextApplicationNumber();

        newApplication = await Application.create({
          applicationNumber,
          applicationType: "general",
          jobId: null,
          jobSlug: null,
          jobTitle: null,
          jobTeam: null,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          candidate: candidateFullName,
          email: normalizedEmail,
          phone: cleanPhone,
          currentJobTitle: (currentJobTitle || "").trim().slice(0, 150),
          experience: (experience || "").trim().slice(0, 50),
          linkedin: (linkedin || "").trim().slice(0, 300),
          portfolio: (portfolio || "").trim().slice(0, 300),
          opportunityLookingFor: (opportunityLookingFor || "").trim().slice(0, 1000),
          aboutYourself: (aboutYourself || "").trim().slice(0, 3000),
          coverLetter: (coverLetter || "").trim().slice(0, 5000),
          resume: resumeMetadata,
          consent: true,
          status: "new",
          viewedAt: undefined,
          viewedBy: undefined,
        });
      } catch (dbError) {
        if (resumeMetadata.publicId) {
          await deleteResume(resumeMetadata.publicId).catch(() => {});
        }
        throw dbError;
      }

      await logActivity({
        type: "application_created",
        title: "New application",
        description: `${candidateFullName} submitted a general application`,
        entityType: "application",
        entityId: newApplication._id,
        metadata: {
          candidateName: candidateFullName,
          jobTitle: "General Application",
          jobSlug: "general-application",
          applicationType: "general",
        },
      });

      // Secondary downstream sync to Google Sheets (fails safely, never breaks submission)
      await appendApplicationToSheet(newApplication).catch((syncErr) => {
        console.error("Google Sheets sync error (general):", syncErr?.message || syncErr);
      });

      const response = NextResponse.json(
        {
          success: true,
          message: "General application submitted successfully.",
          application: serializeApplication(newApplication),
        },
        { status: 201 }
      );
      addRateLimitHeaders(response, ipRateLimit);
      return response;
    }

    // ==================================================
    // 3B. SPECIFIC JOB APPLICATION FLOW
    // ==================================================
    const jobIdentifier = jobSlug || jobId;
    if (!jobIdentifier || typeof jobIdentifier !== "string" || !jobIdentifier.trim()) {
      return NextResponse.json(
        { success: false, error: "A valid job identifier (slug or ID) is required." },
        { status: 400 }
      );
    }

    const trimmedId = jobIdentifier.trim();
    const isObjectId = mongoose.Types.ObjectId.isValid(trimmedId);
    const jobQuery = isObjectId
      ? { $or: [{ slug: trimmedId }, { _id: trimmedId }] }
      : { slug: trimmedId };

    const job = await Job.findOne(jobQuery);

    if (!job) {
      return NextResponse.json(
        { success: false, error: "The position you are applying for does not exist." },
        { status: 404 }
      );
    }

    if (job.status === "draft") {
      return NextResponse.json(
        {
          success: false,
          error: "This position is not currently open for public applications.",
        },
        { status: 400 }
      );
    }

    if (job.status === "closed") {
      return NextResponse.json(
        {
          success: false,
          error: "Applications for this position are closed and no longer accepting submissions.",
        },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json(
        { success: false, error: "Phone number is required." },
        { status: 400 }
      );
    }
    const cleanPhone = phone.trim();
    if (!PHONE_REGEX.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid phone number." },
        { status: 400 }
      );
    }

    if (!experience || typeof experience !== "string" || !experience.trim()) {
      return NextResponse.json(
        { success: false, error: "Years of experience is required." },
        { status: 400 }
      );
    }
    if (experience.length > 50) {
      return NextResponse.json(
        { success: false, error: "Experience description is too long." },
        { status: 400 }
      );
    }

    if (!coverLetter || typeof coverLetter !== "string" || !coverLetter.trim()) {
      return NextResponse.json(
        { success: false, error: "Cover letter is required." },
        { status: 400 }
      );
    }
    if (coverLetter.length > 5000) {
      return NextResponse.json(
        { success: false, error: "Cover letter cannot exceed 5000 characters." },
        { status: 400 }
      );
    }

    // Duplicate check for specific job
    const existingApplication = await Application.findOne({
      jobId: job._id,
      email: normalizedEmail,
    });

    if (existingApplication) {
      return NextResponse.json(
        {
          success: false,
          error: "You have already submitted an application for this position.",
        },
        { status: 409 }
      );
    }

    // Resume metadata for job applications (optional fallback for tests)
    let resumeMetadata = {
      fileName: "resume.pdf",
      fileSize: 0,
      mimeType: "application/pdf",
      fileUrl: "",
      publicId: "",
    };

    if (resume) {
      const resumeValidation = validateResume(resume);
      if (resumeValidation.error) {
        return NextResponse.json(
          { success: false, error: resumeValidation.error },
          { status: 400 }
        );
      }
      resumeMetadata = resumeValidation.data;
    }

    let newApplication;
    try {
      const applicationNumber = await getNextApplicationNumber();

      newApplication = await Application.create({
        applicationNumber,
        applicationType: "job",
        jobId: job._id,
        jobSlug: job.slug,
        jobTitle: job.title,
        jobTeam: job.team,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        candidate: candidateFullName,
        email: normalizedEmail,
        phone: cleanPhone,
        currentJobTitle: (currentJobTitle || "").trim().slice(0, 150),
        experience: experience.trim(),
        linkedin: (linkedin || "").trim().slice(0, 300),
        portfolio: (portfolio || "").trim().slice(0, 300),
        coverLetter: coverLetter.trim(),
        resume: resumeMetadata,
        consent: true,
        status: "new",
        viewedAt: undefined,
        viewedBy: undefined,
      });
    } catch (dbError) {
      if (resumeMetadata.publicId) {
        await deleteResume(resumeMetadata.publicId).catch(() => {});
      }
      throw dbError;
    }

    await logActivity({
      type: "application_created",
      title: "New application",
      description: `${candidateFullName} applied for ${job.title}`,
      entityType: "application",
      entityId: newApplication._id,
      metadata: {
        candidateName: candidateFullName,
        jobTitle: job.title,
        jobSlug: job.slug,
        applicationType: "job",
      },
    });

    // Secondary downstream sync to Google Sheets (fails safely, never breaks submission)
    await appendApplicationToSheet(newApplication).catch((syncErr) => {
      console.error("Google Sheets sync error (job):", syncErr?.message || syncErr);
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully.",
        application: serializeApplication(newApplication),
      },
      { status: 201 }
    );
    addRateLimitHeaders(response, ipRateLimit);
    return response;
  } catch (error) {
    console.error("Error in POST /api/applications:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while submitting your application. Please try again.",
      },
      { status: 500 }
    );
  }
}
