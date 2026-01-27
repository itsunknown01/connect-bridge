/**
 * Features Section Component
 * Displays feature cards in a grid
 */
import { FEATURES } from "../constants";

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 bg-white dark:bg-gradient-to-br dark:from-[#12372A] dark:via-[#12372A] dark:to-[#ADBC9F]/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-[#12372A] dark:text-[#ADBC9F] bg-[#ADBC9F]/30 dark:bg-[#ADBC9F]/20 px-4 py-1.5 rounded-full mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#12372A] dark:text-white mb-4">
            Everything you need to{" "}
            <span className="text-[#ADBC9F]">connect and scale</span>
          </h2>
          <p className="text-lg text-[#12372A]/70 dark:text-white/70 max-w-2xl mx-auto">
            Powerful features designed for modern teams.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-[#ADBC9F]/40 dark:border-[#ADBC9F]/30 bg-white dark:bg-[#12372A]/50 hover:border-[#ADBC9F] hover:shadow-lg hover:shadow-[#ADBC9F]/10 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ADBC9F]/40 to-[#ADBC9F]/20 dark:from-[#ADBC9F]/30 dark:to-[#ADBC9F]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-[#12372A] dark:text-[#ADBC9F]" />
              </div>
              <h3 className="text-lg font-bold text-[#12372A] dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-[#12372A]/70 dark:text-white/70 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
