/**
 * How It Works Section — Sequential timeline animation
 *
 * Steps appear sequentially as user scrolls.
 * Connecting line "draws" progressively.
 */
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STEPS } from "../constants";
import { REDUCED_MOTION } from "../hooks/useScrollReveal";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (REDUCED_MOTION || !sectionRef.current) return;

      // Heading reveal
      const heading = sectionRef.current.querySelector(
        "[data-reveal='heading']",
      );
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

      // Timeline line draw
      const line = sectionRef.current.querySelector(".timeline-draw");
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current.querySelector(".steps-container"),
              start: "top 75%",
              end: "bottom 60%",
              scrub: 1,
            },
          },
        );
      }

      // Step cards stagger
      const steps = sectionRef.current.querySelectorAll("[data-step]");
      steps.forEach((step, i) => {
        gsap.fromTo(
          step,
          { x: i % 2 === 0 ? -60 : 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="py-28 bg-gradient-to-b from-[#ADBC9F]/8 to-white dark:from-[#ADBC9F]/5 dark:to-transparent relative"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20" data-reveal="heading">
          <span className="inline-block text-sm font-semibold text-[#12372A] dark:text-[#ADBC9F] bg-[#ADBC9F]/25 dark:bg-[#ADBC9F]/15 px-4 py-1.5 rounded-full mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12372A] dark:text-white">
            Three steps to{" "}
            <span className="text-[#ADBC9F]">organized knowledge</span>
          </h2>
        </div>

        <div className="steps-container relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2">
            <div className="timeline-draw w-full h-full bg-gradient-to-b from-[#ADBC9F]/60 via-[#ADBC9F]/40 to-transparent" />
          </div>

          <div className="space-y-16 md:space-y-20">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                data-step
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Content card */}
                <div
                  className={`flex-1 ${
                    i % 2 === 0 ? "md:text-right" : "md:text-left"
                  }`}
                >
                  <div className="bg-white dark:bg-white/[0.03] border border-[#ADBC9F]/25 dark:border-[#ADBC9F]/15 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-[#12372A] dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[#12372A]/65 dark:text-white/60 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Step number (center) */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#12372A] to-[#12372A]/80 dark:from-[#ADBC9F] dark:to-[#ADBC9F]/70 flex items-center justify-center shadow-lg shadow-[#12372A]/15 dark:shadow-[#ADBC9F]/15">
                    <span className="text-xl font-bold text-white dark:text-[#12372A]">
                      {step.num}
                    </span>
                  </div>
                </div>

                {/* Spacer for alignment */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
