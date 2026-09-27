import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import Job from "@/models/Job";
import { serializeApplication } from "@/lib/applicationSerializer";
import { serializeJob } from "@/lib/jobSerializer";
import { mockApplications } from "@/lib/mockApplications";
import { mockJobs } from "@/lib/mockJobs";
import ApplicationDetailClient from "@/components/admin/ApplicationDetailClient";

export const dynamic = "force-dynamic";

async function getApplicationData(id) {
  try {
    await connectDB();
    if (mongoose.Types.ObjectId.isValid(id)) {
      const appDoc = await Application.findById(id);
      if (appDoc) {
        const serializedApp = serializeApplication(appDoc);
        let job = null;
        if (appDoc.jobId) {
          const jobDoc = await Job.findById(appDoc.jobId);
          if (jobDoc) job = serializeJob(jobDoc);
        }
        if (!job && appDoc.jobSlug) {
          const jobDoc = await Job.findOne({ slug: appDoc.jobSlug });
          if (jobDoc) job = serializeJob(jobDoc);
        }
        return { application: serializedApp, job };
      }
    }
  } catch (error) {
    console.error("Error loading application detail from database:", error);
  }

  // Fallback to mock data for development
  const mockApp = mockApplications.find((a) => a.id === id);
  if (mockApp) {
    const mockJob = mockJobs.find((j) => j.id === mockApp.jobId);
    return { application: mockApp, job: mockJob };
  }

  return { application: null, job: null };
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { application } = await getApplicationData(id);

  return {
    title: application
      ? `${application.candidate} — Application | Admin Dashboard`
      : "Application | Admin Dashboard",
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}

export default async function AdminApplicationDetailPage({ params }) {
  const { id } = await params;
  const { application, job } = await getApplicationData(id);

  if (!application) {
    notFound();
  }

  return (
    <ApplicationDetailClient
      application={application}
      job={job}
    />
  );
}
