/**
 * Pricing Section — Scale-up card entrance with stagger
 *
 * Uses useSectionReveal for heading, custom GSAP for card stagger.
 */
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/src/client/components/ui";
import { PRICING_PLANS, navigateToAuth } from "../constants";
import { REDUCED_MOTION } from "../hooks/useScrollReveal";

gsap.registerPlugin(ScrollTrigger);

export default function PricingSection() {
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

      const cards = sectionRef.current.querySelectorAll("[data-pricing-card]");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cards[0],
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
      id="pricing"
      className="py-28 relative bg-white dark:bg-transparent"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-reveal="heading">
          <span className="inline-block text-sm font-semibold text-[#12372A] dark:text-[#ADBC9F] bg-[#ADBC9F]/25 dark:bg-[#ADBC9F]/15 px-4 py-1.5 rounded-full mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12372A] dark:text-white mb-5">
            Simple, <span className="text-[#ADBC9F]">transparent pricing</span>
          </h2>
          <p className="text-lg text-[#12372A]/65 dark:text-white/60 max-w-2xl mx-auto">
            Start free, scale as you grow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Extracted sub-component (SRP) ─── */

interface PricingPlan {
  readonly name: string;
  readonly price: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly cta: string;
  readonly popular: boolean;
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  const isPopular = plan.popular;

  return (
    <div
      data-pricing-card
      className={`relative rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 ${
        isPopular
          ? "border-[#12372A] dark:border-[#ADBC9F] bg-[#12372A] dark:bg-[#ADBC9F]/10 shadow-xl shadow-[#12372A]/15 dark:shadow-[#ADBC9F]/10 scale-[1.03]"
          : "border-[#ADBC9F]/30 dark:border-[#ADBC9F]/15 bg-white dark:bg-white/[0.03] hover:shadow-lg"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#ADBC9F] text-[#12372A] text-xs font-bold rounded-full shadow-sm">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3
          className={`text-xl font-bold mb-1 ${isPopular ? "text-white" : "text-[#12372A] dark:text-white"}`}
        >
          {plan.name}
        </h3>
        <p
          className={`text-sm ${isPopular ? "text-white/70" : "text-[#12372A]/60 dark:text-white/50"}`}
        >
          {plan.description}
        </p>
      </div>

      <div className="mb-6">
        <span
          className={`text-4xl font-extrabold ${isPopular ? "text-white" : "text-[#12372A] dark:text-white"}`}
        >
          {plan.price === "Custom" ? "Custom" : `$${plan.price}`}
        </span>
        {plan.price !== "Custom" && (
          <span
            className={`text-sm ${isPopular ? "text-white/60" : "text-[#12372A]/50 dark:text-white/40"}`}
          >
            /month
          </span>
        )}
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className={`flex items-center gap-2.5 text-sm ${
              isPopular
                ? "text-white/85"
                : "text-[#12372A]/70 dark:text-white/60"
            }`}
          >
            <Check className="w-4 h-4 flex-shrink-0 text-[#ADBC9F]" />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        className={`w-full font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] ${
          isPopular
            ? "bg-white text-[#12372A] hover:bg-white/90 shadow-lg"
            : "bg-[#12372A] text-white dark:bg-white dark:text-[#12372A] hover:opacity-90"
        }`}
        onClick={navigateToAuth}
      >
        {plan.cta} <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </div>
  );
}
