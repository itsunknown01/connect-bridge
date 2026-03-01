import { useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  y?: number;
  x?: number;
  scale?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  start?: string;
  toggleActions?: string;
  scrub?: boolean | number;
}

export const REDUCED_MOTION =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

export function useScrollReveal() {
  const containerRef = useRef<HTMLDivElement>(null);

  const reveal = useCallback(
    (
      targets: string | HTMLElement | HTMLElement[],
      options: ScrollRevealOptions = {},
    ) => {
      if (REDUCED_MOTION || !containerRef.current) return;

      const {
        y = 60,
        x = 0,
        scale = 1,
        duration = 0.8,
        delay = 0,
        stagger = 0,
        ease = "power3.out",
        start = "top 85%",
        toggleActions = "play none none none",
        scrub,
      } = options;

      const resolvedTrigger =
        typeof targets === "string"
          ? containerRef.current.querySelector(targets) || containerRef.current
          : Array.isArray(targets)
            ? targets[0]
            : targets;

      gsap.fromTo(
        targets,
        { y, x, opacity: 0, scale },
        {
          y: 0,
          x: 0,
          opacity: 1,
          scale: 1,
          duration,
          delay,
          stagger,
          ease,
          scrollTrigger: {
            trigger: resolvedTrigger,
            start,
            toggleActions,
            scrub,
          },
        },
      );
    },
    [],
  );

  return { containerRef, reveal, isReducedMotion: REDUCED_MOTION };
}

/**
 * Utility: batch-reveal children of a container.
 *
 * Elements with [data-reveal="heading"] and [data-reveal="item"]
 * are animated on scroll with stagger. Elements are VISIBLE by
 * default — animation is progressive enhancement.
 */
export function useSectionReveal() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (REDUCED_MOTION || !sectionRef.current) return;

      const heading = sectionRef.current.querySelector(
        "[data-reveal='heading']",
      );
      const items = sectionRef.current.querySelectorAll("[data-reveal='item']");

      if (heading) {
        gsap.fromTo(
          heading,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      if (items.length > 0) {
        gsap.fromTo(
          items,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: items[0],
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      }
    },
    { scope: sectionRef },
  );

  return sectionRef;
}
