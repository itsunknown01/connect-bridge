/**
 * Features Section — Staggered card reveal
 */
import { FEATURES } from "../constants";
import { useSectionReveal } from "../hooks/useScrollReveal";

export default function FeaturesSection() {
  const sectionRef = useSectionReveal();

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-28 bg-white dark:bg-transparent relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-reveal="heading">
          <span className="inline-block text-sm font-semibold text-[#12372A] dark:text-[#ADBC9F] bg-[#ADBC9F]/25 dark:bg-[#ADBC9F]/15 px-4 py-1.5 rounded-full mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12372A] dark:text-white mb-5">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-[#12372A] to-[#ADBC9F] dark:from-[#ADBC9F] dark:to-white bg-clip-text text-transparent">
              connect and scale
            </span>
          </h2>
          <p className="text-lg text-[#12372A]/65 dark:text-white/60 max-w-2xl mx-auto">
            Powerful features designed for modern teams who value knowledge.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              data-reveal="item"
              className="group p-7 rounded-2xl border border-[#ADBC9F]/30 dark:border-[#ADBC9F]/20 bg-white dark:bg-white/[0.03] hover:border-[#ADBC9F]/60 hover:shadow-xl hover:shadow-[#ADBC9F]/8 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ADBC9F]/30 to-[#ADBC9F]/10 dark:from-[#ADBC9F]/20 dark:to-[#ADBC9F]/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-[#12372A] dark:text-[#ADBC9F]" />
              </div>
              <h3 className="text-lg font-bold text-[#12372A] dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-[#12372A]/65 dark:text-white/60 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
