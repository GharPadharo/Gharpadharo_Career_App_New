"use client";

import React, { useEffect, useRef } from "react";

// Singleton IntersectionObserver instance for optimal 60fps scrolling
let sharedObserver = null;

function getSharedObserver() {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return null;
  }
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "true");
            sharedObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px",
      }
    );
  }
  return sharedObserver;
}

/**
 * Initializes the scroll reveal system on client mount.
 * Sets the .js-reveal-ready flag on <html> and registers all data-reveal elements.
 */
export function initScrollReveal() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  // Check prefers-reduced-motion
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      el.setAttribute("data-revealed", "true");
    });
    return;
  }

  document.documentElement.classList.add("js-reveal-ready");

  const observer = getSharedObserver();
  if (!observer) {
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      el.setAttribute("data-revealed", "true");
    });
    return;
  }

  // Observe all unrevealed elements
  document.querySelectorAll("[data-reveal]:not([data-revealed='true'])").forEach((el) => {
    observer.observe(el);
  });
}

/**
 * Reusable ScrollReveal wrapper component.
 *
 * @param {Object} props
 * @param {string|React.ElementType} [props.as='div'] - HTML tag or component to render
 * @param {'fade-up'|'fade'|'scale-up'|'fade-left'|'fade-right'} [props.variant='fade-up'] - Animation variant
 * @param {number} [props.delay=0] - Delay in milliseconds
 * @param {number} [props.duration=600] - Duration in milliseconds
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {React.CSSProperties} [props.style] - Additional inline styles
 * @param {React.ReactNode} props.children - Child content
 */
export default function ScrollReveal({
  as: Component = "div",
  variant = "fade-up",
  delay = 0,
  duration = 600,
  className = "",
  style = {},
  children,
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    initScrollReveal();

    const node = ref.current;
    if (!node) return;

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.setAttribute("data-revealed", "true");
      return;
    }

    const observer = getSharedObserver();
    if (!observer) {
      node.setAttribute("data-revealed", "true");
      return;
    }

    if (node.getAttribute("data-revealed") !== "true") {
      observer.observe(node);
    }

    return () => {
      if (node && observer) {
        observer.unobserve(node);
      }
    };
  }, []);

  const inlineStyles = {
    ...style,
    ...(delay > 0 ? { transitionDelay: `${delay}ms` } : {}),
    ...(duration !== 600 ? { transitionDuration: `${duration}ms` } : {}),
  };

  return (
    <Component
      ref={ref}
      data-reveal={variant}
      className={className}
      style={inlineStyles}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Helper component for staggering a grid or list of child elements.
 */
export function ScrollRevealGroup({
  as: Component = "div",
  variant = "fade-up",
  stagger = 90,
  baseDelay = 0,
  className = "",
  children,
  ...props
}) {
  return (
    <Component className={className} {...props}>
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;
        return (
          <ScrollReveal
            variant={variant}
            delay={baseDelay + idx * stagger}
          >
            {child}
          </ScrollReveal>
        );
      })}
    </Component>
  );
}
