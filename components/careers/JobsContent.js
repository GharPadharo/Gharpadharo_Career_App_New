"use client";

import { useState } from "react";
import CareersHero from "./CareersHero";
import JobListings from "./JobListings";

/**
 * JobsContent Component
 * 
 * Coordinates the Careers Hero search input with the Job Listings filters,
 * sorting, and pagination.
 */
export default function JobsContent({ allJobs }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <CareersHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <JobListings
        allJobs={allJobs}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </>
  );
}
