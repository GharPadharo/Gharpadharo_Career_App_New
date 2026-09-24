"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

/**
 * AdminDashboardShell Component
 * 
 * Interactive client shell for admin dashboard pages:
 * - Coordinates mobile sidebar open/close state
 * - Provides desktop sticky sidebar + top header
 * - Contextual header titles based on pathname
 * - Hosts main content area with proper background and responsive padding
 */
export default function AdminDashboardShell({ children, title, subtitle }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Contextual header titles if not explicitly passed as props
  let headerTitle = title;
  let headerSubtitle = subtitle;

  if (!headerTitle) {
    if (pathname === "/admin/dashboard/new") {
      headerTitle = "Add New Job";
      headerSubtitle = "Create and configure a new career opportunity.";
    } else if (pathname?.endsWith("/edit")) {
      headerTitle = "Edit Job";
      headerSubtitle = "Update job details, requirements, and publishing status.";
    } else {
      headerTitle = "Dashboard";
      headerSubtitle = "Manage jobs and review career activity.";
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex antialiased">
      {/* Sidebar (Desktop sticky & Mobile drawer) */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <AdminHeader
          title={headerTitle}
          subtitle={headerSubtitle}
          onMenuToggle={() => setIsSidebarOpen((prev) => !prev)}
        />

        {/* Page Children */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
