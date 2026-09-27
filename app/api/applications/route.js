import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import Application from "@/models/Application";
import { serializeApplication } from "@/lib/applicationSerializer";
import { deleteResume } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\s\-().]{7,30}$/;

/**
 * POST /api/applications
 * 
 * Public endpoint to submit a job application.
 * - Resolves job from MongoDB by slug or _id
 * - Enforces that job exists and status === "active" (rejects draft / closed)
 * - Server-side validation of personal info, experience, cover letter, and consent
 * - Prevents duplicate applications for the same job and email (409 Conflict)
 * - Defaults status to "new", viewedAt/viewedBy left null/undefined
 */
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      jobSlug,
      jobId,
      firstName,
      lastName,
      email,
      phone,
      currentJobTitle = "",
      experience,
      linkedin = "",
      portfolio = "",
      coverLetter,
      resume,
      consent,
    } = body;

    // 1. Identify and fetch the job
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

    // 2. Server-side validation
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

    if (consent !== true) {
      return NextResponse.json(
        {
          success: false,
          error: "You must confirm the accuracy of information and consent to proceed.",
        },
        { status: 400 }
      );
    }

    // 3. Duplicate application check (same job + normalized email)
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

    // 4. Validate and normalize resume metadata
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

      if (rFileName) {
        const lastDot = rFileName.lastIndexOf(".");
        const ext = lastDot !== -1 ? rFileName.slice(lastDot).toLowerCase() : "";
        if (![".pdf", ".doc", ".docx"].includes(ext)) {
          return NextResponse.json(
            { success: false, error: "Invalid resume file type. Allowed formats: PDF, DOC, DOCX." },
            { status: 400 }
          );
        }
      }

      if (rFileSize > 10 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "Resume file size exceeds the 10 MB limit." },
          { status: 400 }
        );
      }

      // Security check: If publicId is supplied, it MUST match our dedicated folder
      if (rPublicId) {
        if (!rPublicId.startsWith("gharpadharo-careers/resumes/")) {
          return NextResponse.json(
            { success: false, error: "Invalid resume storage reference." },
            { status: 400 }
          );
        }
      }

      // Security check: If fileUrl is supplied, it MUST originate from cloudinary.com
      if (rFileUrl) {
        try {
          const parsed = new URL(rFileUrl);
          if (!parsed.hostname.endsWith("cloudinary.com")) {
            return NextResponse.json(
              { success: false, error: "Invalid resume URL host." },
              { status: 400 }
            );
          }
        } catch {
          return NextResponse.json(
            { success: false, error: "Malformed resume URL." },
            { status: 400 }
          );
        }
      }

      resumeMetadata = {
        fileName: rFileName || "resume.pdf",
        fileSize: rFileSize,
        mimeType: rMimeType || "application/pdf",
        fileUrl: rFileUrl,
        publicId: rPublicId,
      };
    }

    // 5. Store application document
    const candidateFullName = `${firstName.trim()} ${lastName.trim()}`;

    let newApplication;
    try {
      newApplication = await Application.create({
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
      // Clean up orphaned Cloudinary upload if document creation fails
      if (resumeMetadata.publicId) {
        await deleteResume(resumeMetadata.publicId).catch(() => {});
      }
      throw dbError;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully.",
        application: serializeApplication(newApplication),
      },
      { status: 201 }
    );
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
