"use client";

import { useState } from "react";
import CareersHero from "./CareersHero";
import JobListings from "./JobListings";

/**
 * JobsContent Component
 * 
 * Coordinates the deep navy Careers Hero with the Job Listings area,
 * search filtering, sorting, and Resume CTA.
 */
export default function JobsContent({ allJobs = [], error = null }) {
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
        error={error}
      />
    </>
  );
}
