"use client";

import { useState } from "react";

/**
 * DownloadSpreadsheetButton Component
 *
 * Allows authorized admins to export and download the existing
 * Google Sheets spreadsheet (Applications) as an Excel (.xlsx) file.
 *
 * Features:
 * - GharPadharo primary purple theme (#5929D6) matching "Add New Job"
 * - Download icon with animated loading spinner during request
 * - Protected server-side export call via /api/admin/applications/export
 * - Native browser download with correct filename
 * - Inline dismissible error feedback
 */
export default function DownloadSpreadsheetButton({ className = "" }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/applications/export");

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(
          errorJson.error ||
          `Failed to download spreadsheet (Server returned status ${res.status}).`
        );
      }

      const blob = await res.blob();
      if (!blob || blob.size === 0) {
        throw new Error("Received an empty file from the server.");
      }

      // Extract filename from Content-Disposition header if available
      let filename = "GharPadharo_Applications.xlsx";
      const disposition = res.headers.get("Content-Disposition");
      if (disposition) {
        const match = disposition.match(/filename="?([^";]+)"?/i);
        if (match?.[1]) {
          filename = match[1].trim();
        }
      }

      // Trigger native file download
      const blobUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      // Revoke object URL after delay to free memory
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (err) {
      console.error("Failed to download applications spreadsheet:", err);
      setErrorMessage(err.message || "Failed to download spreadsheet. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative w-full sm:w-auto inline-flex flex-col items-stretch sm:items-end">
      <button
        type="button"
        onClick={handleDownload}
        disabled={isDownloading}
        aria-label="Download Applications Spreadsheet"
        className={
          className ||
          `w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-[#4D20BE] text-white text-sm font-semibold px-4 sm:px-5 py-3 sm:py-2.5 rounded-xl shadow-xs transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 shrink-0 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed disabled:active:scale-100 min-h-[44px]`
        }
      >
        {isDownloading ? (
          <>
            <svg
              className="w-4 h-4 animate-spin shrink-0 text-white"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Downloading...</span>
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>Download Spreadsheet</span>
          </>
        )}
      </button>

      {/* Dismissible Error Alert */}
      {errorMessage && (
        <div
          role="alert"
          className="mt-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2 shadow-2xs w-full max-w-sm sm:max-w-md z-10 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <svg
            className="w-4 h-4 text-red-600 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-red-900">Download failed</p>
            <p className="mt-0.5 text-red-700 leading-normal">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-red-700 p-1 rounded-md cursor-pointer transition-colors"
            aria-label="Dismiss error"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
