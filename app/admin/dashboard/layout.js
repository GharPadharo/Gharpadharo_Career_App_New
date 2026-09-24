import AdminDashboardShell from "@/components/admin/AdminDashboardShell";

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

export default function AdminDashboardLayout({ children }) {
  return <AdminDashboardShell>{children}</AdminDashboardShell>;
}
