"use client";

import { useState } from "react";
import CareersHero from "./CareersHero";
import JobListings from "./JobListings";
import GeneralApplicationCTA from "./GeneralApplicationCTA";

/**
 * JobsContent Component
 * 
 * Coordinates the Careers Hero search input with the Job Listings filters,
 * sorting, and pagination. Includes the General Application CTA at the bottom.
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
      <GeneralApplicationCTA />
    </>
  );
}
