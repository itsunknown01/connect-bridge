/**
 * Demo Section Component
 * Interactive demo preview
 */
import { useState } from "react";
import { Play } from "lucide-react";

export default function DemoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section
      id="demo"
      className="py-24 bg-white dark:bg-gradient-to-bl dark:from-[#ADBC9F]/10 dark:via-[#12372A] dark:to-[#12372A]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold text-[#12372A] dark:text-[#ADBC9F] bg-[#ADBC9F]/30 dark:bg-[#ADBC9F]/20 px-4 py-1.5 rounded-full mb-4">
            Demo
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#12372A] dark:text-white mb-4">
            See it in <span className="text-[#ADBC9F]">action</span>
          </h2>
        </div>

        <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-[#ADBC9F]/40 bg-gradient-to-br from-[#ADBC9F]/80 to-[#8fa884] dark:from-[#12372A] dark:to-[#0d2a1f] relative">
          {!playing ? (
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center group"
            >
              <div className="w-20 h-20 bg-[#12372A] dark:bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Play
                  className="w-8 h-8 text-white dark:text-[#12372A] ml-1"
                  fill="currentColor"
                />
              </div>
            </button>
          ) : (
            <div className="w-full h-full bg-white dark:bg-[#0d2a1f] flex flex-col">
              <div className="bg-[#12372A] px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-[#ADBC9F]/50 rounded-full" />
                  <div className="w-3 h-3 bg-[#ADBC9F]/50 rounded-full" />
                  <div className="w-3 h-3 bg-[#ADBC9F] rounded-full" />
                </div>
                <span className="ml-3 text-white/80 text-sm">
                  # product-decisions
                </span>
              </div>
              <div className="flex-1 p-4 bg-[#ADBC9F]/10 dark:bg-[#12372A] space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-[#ADBC9F] rounded-full flex-shrink-0" />
                  <div className="bg-white dark:bg-[#0d2a1f] p-3 rounded-lg shadow-sm max-w-xs border border-[#ADBC9F]/30">
                    <p className="text-sm text-[#12372A] dark:text-white">
                      Let's go with pricing tiers for v2!
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-[#ADBC9F]/30 dark:bg-[#ADBC9F]/20 p-3 rounded-lg max-w-xs">
                    <p className="text-sm text-[#12372A] dark:text-white">
                      ✅ Creating outcome: "Implement pricing tiers"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
