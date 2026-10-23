"use client";

import { useEffect } from "react";
import { initScrollReveal } from "@/components/common/ScrollReveal";

/**
 * Client-side initializer for the scroll reveal system.
 * Mounted once in RootLayout to enable progressive enhancement and observe dynamic content.
 */
export default function ScrollRevealInit() {
  useEffect(() => {
    initScrollReveal();

    // Auto-observe newly mounted DOM nodes (SPA page navigation, modal displays, tabs)
    if (typeof MutationObserver !== "undefined") {
      const observer = new MutationObserver(() => {
        initScrollReveal();
      });

      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return null;
}
