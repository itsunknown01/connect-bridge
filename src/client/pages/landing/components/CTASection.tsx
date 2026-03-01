/**
 * CTA Section — Parallax gradient background + scale-up reveal
 */
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Send } from "lucide-react";
import { Button } from "@/src/client/components/ui";
import { navigateToAuth } from "../constants";
import { REDUCED_MOTION } from "../hooks/useScrollReveal";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (REDUCED_MOTION || !sectionRef.current) return;

      // Background parallax
      const bg = sectionRef.current.querySelector("[data-cta-bg]");
      if (bg) {
        gsap.to(bg, {
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // Content reveal
      const content = sectionRef.current.querySelector("[data-cta-content]");
      if (content) {
        gsap.fromTo(
          content,
          { y: 50, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: content,
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
    <section ref={sectionRef} className="py-28 relative overflow-hidden">
      {/* Parallax gradient background */}
      <div
        data-cta-bg
        className="absolute inset-0 bg-gradient-to-br from-[#ADBC9F]/20 via-[#ADBC9F]/8 to-white dark:from-[#12372A] dark:via-[#0d2a1f] dark:to-[#12372A] -z-10"
        style={{ height: "130%", top: "-15%" }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div data-cta-content className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12372A] dark:text-white mb-5">
            Ready to{" "}
            <span className="bg-gradient-to-r from-[#12372A] to-[#ADBC9F] dark:from-[#ADBC9F] dark:to-white bg-clip-text text-transparent">
              transform
            </span>{" "}
            your team?
          </h2>
          <p className="text-lg text-[#12372A]/65 dark:text-white/60 mb-10 max-w-xl mx-auto">
            Join thousands of teams using Connect-Bridge to capture knowledge
            and drive outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#12372A] hover:bg-[#0d2a1f] text-white dark:bg-white dark:text-[#12372A] dark:hover:bg-white/90 font-bold px-10 py-6 text-base shadow-xl shadow-[#12372A]/20 dark:shadow-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              onClick={navigateToAuth}
            >
              Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-[#12372A]/25 text-[#12372A] dark:border-white/25 dark:text-white px-10 py-6 text-base hover:bg-[#12372A]/8 dark:hover:bg-white/8 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send className="mr-2 w-5 h-5" /> Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
