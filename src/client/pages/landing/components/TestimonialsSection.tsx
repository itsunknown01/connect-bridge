/**
 * Testimonials Section Component
 * Customer testimonials with star ratings
 */
import { Star } from "lucide-react";
import { TESTIMONIALS } from "../constants";

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#ADBC9F]/80 via-[#ADBC9F]/60 to-[#8fa884] dark:from-[#ADBC9F]/20 dark:via-[#12372A] dark:to-[#0d2a1f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#12372A] dark:text-white mb-4">
            Loved by teams{" "}
            <span className="text-white dark:text-[#ADBC9F]">worldwide</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-white/90 dark:bg-white/10 backdrop-blur p-6 rounded-xl border border-[#12372A]/10 dark:border-[#ADBC9F]/20 hover:scale-105 transition-transform"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 text-[#12372A] dark:text-[#ADBC9F] fill-current"
                  />
                ))}
              </div>
              <p className="text-[#12372A] dark:text-white mb-4">"{t.quote}"</p>
              <p className="text-[#12372A] dark:text-[#ADBC9F] font-semibold text-sm">
                {t.name}
              </p>
              <p className="text-[#12372A]/60 dark:text-white/60 text-xs">
                {t.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
