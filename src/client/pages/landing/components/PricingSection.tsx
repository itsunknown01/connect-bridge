/**
 * Pricing Section Component
 * Pricing cards with feature lists
 */
import { Check, Star } from "lucide-react";
import { cn } from "@/src/client/lib/utils";
import { Button } from "@/src/client/components/ui";
import { PRICING_PLANS } from "../constants";

export default function PricingSection() {
  const handleNavigate = () => {
    window.location.href = "/auth";
  };

  return (
    <section
      id="pricing"
      className="py-24 bg-gradient-to-br from-[#ADBC9F]/30 via-[#ADBC9F]/10 to-white dark:from-[#0d2a1f] dark:via-[#12372A]/50 dark:to-[#0d2a1f]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold text-[#12372A] dark:text-[#ADBC9F] bg-white dark:bg-[#ADBC9F]/20 px-4 py-1.5 rounded-full mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#12372A] dark:text-white mb-4">
            Start free, scale as you grow
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan, i) => (
            <div
              key={i}
              className={cn(
                "relative p-6 rounded-2xl border-2 flex flex-col bg-white dark:bg-[#12372A]/80 backdrop-blur-sm",
                plan.popular
                  ? "border-[#12372A] dark:border-[#ADBC9F] shadow-xl shadow-[#12372A]/10 dark:shadow-[#ADBC9F]/10"
                  : "border-[#ADBC9F]/40 dark:border-[#ADBC9F]/30",
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#12372A] dark:bg-[#ADBC9F] text-white dark:text-[#12372A] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3" /> Popular
                </div>
              )}
              <h3 className="text-lg font-semibold text-[#12372A]/60 dark:text-white/60 mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-1">
                {plan.price !== "Custom" && (
                  <span className="text-xl text-[#12372A]/60 dark:text-white/60">
                    $
                  </span>
                )}
                <span className="text-4xl font-bold text-[#12372A] dark:text-white">
                  {plan.price}
                </span>
                {plan.price !== "Custom" && (
                  <span className="text-[#12372A]/60 dark:text-white/60">
                    /mo
                  </span>
                )}
              </div>
              <p className="text-[#12372A]/60 dark:text-white/60 text-sm mb-4">
                {plan.description}
              </p>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f, j) => (
                  <li
                    key={j}
                    className="flex items-center gap-2 text-sm text-[#12372A]/80 dark:text-white/80"
                  >
                    <Check className="w-4 h-4 text-[#ADBC9F] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className={cn(
                  "w-full",
                  plan.popular
                    ? "bg-[#12372A] hover:bg-[#12372A]/90 text-white dark:bg-white dark:text-[#12372A] dark:hover:bg-white/90"
                    : "bg-[#ADBC9F] hover:bg-[#ADBC9F]/90 text-[#12372A]",
                )}
                onClick={handleNavigate}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
