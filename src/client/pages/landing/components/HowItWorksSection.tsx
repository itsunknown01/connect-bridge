/**
 * How It Works Section Component
 * Step-by-step process display
 */
import { STEPS } from "../constants";

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-gradient-to-br from-[#ADBC9F]/30 via-[#ADBC9F]/10 to-white dark:from-[#0d2a1f] dark:via-[#12372A]/50 dark:to-[#0d2a1f]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-[#12372A] dark:text-[#ADBC9F] bg-white dark:bg-[#ADBC9F]/20 px-4 py-1.5 rounded-full mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#12372A] dark:text-white mb-4">
            Simple as <span className="text-[#ADBC9F]">1-2-3</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-[#12372A] dark:bg-white text-white dark:text-[#12372A] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-[#12372A]/20 dark:shadow-white/10">
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-[#12372A] dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-[#12372A]/70 dark:text-white/70">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
