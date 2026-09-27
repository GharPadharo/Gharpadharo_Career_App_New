import { permanentRedirect } from "next/navigation";
import { mockJobs } from "@/lib/mockJobs";

export function generateStaticParams() {
  return mockJobs.map((job) => ({ id: job.id }));
}

export default async function OldEditJobRedirect({ params }) {
  const { id } = await params;
  permanentRedirect(`/admin/dashboard/jobs/${id}/edit`);
}
