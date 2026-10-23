import { connectDB } from "@/lib/mongodb";
import Application from "@/models/Application";
import AdminDashboardShell from "@/components/admin/AdminDashboardShell";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard | GharPadharo Careers",
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

export default async function AdminDashboardLayout({ children }) {
  let initialApplicationsCount = null;
  let session = null;
  try {
    session = await auth();
    await connectDB();
    initialApplicationsCount = await Application.countDocuments({});
  } catch (err) {
    console.error("Failed to query application count for layout:", err);
  }

  return (
    <SessionProvider session={session}>
      <AdminDashboardShell
        initialApplicationsCount={initialApplicationsCount}
        user={session?.user}
      >
        {children}
      </AdminDashboardShell>
    </SessionProvider>
  );
}
