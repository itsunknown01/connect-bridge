/**
 * FAQ Section — Sequential accordion fade-in
 *
 * FAQItem extracted as a separate sub-component (SRP).
 */
import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import { FAQS } from "../constants";
import { REDUCED_MOTION } from "../hooks/useScrollReveal";

gsap.registerPlugin(ScrollTrigger);

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#ADBC9F]/20 dark:border-[#ADBC9F]/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group focus-ring rounded-lg"
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-[#12372A] dark:text-white pr-4 group-hover:text-[#12372A]/80 dark:group-hover:text-white/80 transition-colors">
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[#ADBC9F] flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-40 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-[#12372A]/65 dark:text-white/60 text-sm leading-relaxed">
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQSection() {
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

      const items = sectionRef.current.querySelectorAll("[data-faq-item]");
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
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

  return (
    <section
      ref={sectionRef}
      className="py-28 relative bg-white dark:bg-transparent"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-reveal="heading">
          <span className="inline-block text-sm font-semibold text-[#12372A] dark:text-[#ADBC9F] bg-[#ADBC9F]/25 dark:bg-[#ADBC9F]/15 px-4 py-1.5 rounded-full mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12372A] dark:text-white">
            Common questions
          </h2>
        </div>

        <div>
          {FAQS.map((faq, i) => (
            <div key={i} data-faq-item>
              <FAQItem q={faq.q} a={faq.a} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
