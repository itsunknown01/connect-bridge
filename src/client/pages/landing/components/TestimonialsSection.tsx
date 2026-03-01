/**
 * Testimonials Section — Slide-in reveals from alternating sides
 *
 * Uses shared REDUCED_MOTION, custom GSAP for alternating X direction.
 */
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote } from "lucide-react";
import { TESTIMONIALS } from "../constants";
import { REDUCED_MOTION } from "../hooks/useScrollReveal";

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (REDUCED_MOTION || !sectionRef.current) return;

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

      const cards = sectionRef.current.querySelectorAll("[data-testimonial]");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { x: i % 2 === 0 ? -50 : 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
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
      className="py-28 bg-gradient-to-b from-[#ADBC9F]/8 to-white dark:from-[#ADBC9F]/5 dark:to-transparent relative"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-reveal="heading">
          <span className="inline-block text-sm font-semibold text-[#12372A] dark:text-[#ADBC9F] bg-[#ADBC9F]/25 dark:bg-[#ADBC9F]/15 px-4 py-1.5 rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12372A] dark:text-white">
            Loved by <span className="text-[#ADBC9F]">modern teams</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              data-testimonial
              className="relative p-8 rounded-2xl border border-[#ADBC9F]/25 dark:border-[#ADBC9F]/15 bg-white dark:bg-white/[0.03] hover:shadow-lg hover:shadow-[#ADBC9F]/8 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-[#ADBC9F]/30 dark:text-[#ADBC9F]/20 mb-4" />
              <p className="text-[#12372A]/80 dark:text-white/70 text-base leading-relaxed mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ADBC9F] to-[#12372A] flex items-center justify-center text-white text-sm font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#12372A] dark:text-white">
                    {t.name}
                  </div>
                  <div className="text-xs text-[#12372A]/50 dark:text-white/40">
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
