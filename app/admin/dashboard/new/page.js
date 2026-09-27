import { permanentRedirect } from "next/navigation";

export default function OldAddNewJobRedirect() {
  permanentRedirect("/admin/dashboard/jobs/new");
}
