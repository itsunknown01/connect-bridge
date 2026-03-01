/**
 * Demo Section — Browser mockup with chat preview
 *
 * Uses useSectionReveal for heading + custom GSAP for browser entrance.
 */
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, Target, Search, Hash } from "lucide-react";
import { REDUCED_MOTION } from "../hooks/useScrollReveal";

gsap.registerPlugin(ScrollTrigger);

/* ─── Data (SRP) ─── */
const CHANNELS = ["general", "engineering", "design"];
const MESSAGES = [
  {
    name: "Sarah C.",
    msg: "The new auth flow is ready for review.",
    time: "2:14 PM",
  },
  {
    name: "Alex R.",
    msg: "Looks great! I'll add it to the knowledge base.",
    time: "2:16 PM",
  },
  {
    name: "System",
    msg: "📚 Knowledge item created: Auth Flow v2 Architecture",
    time: "2:16 PM",
    system: true,
  },
];
const KNOWLEDGE_ITEMS = ["Auth Flow v2", "API Design", "Sprint Goals"];

export default function DemoSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (REDUCED_MOTION || !sectionRef.current) return;

      // Heading
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

      // Browser window scale-up
      const browser = sectionRef.current.querySelector("[data-demo-browser]");
      if (browser) {
        gsap.fromTo(
          browser,
          { y: 80, opacity: 0, scale: 0.92 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: browser,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // Inner content items stagger
      const items = sectionRef.current.querySelectorAll("[data-demo-item]");
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: items[0],
              start: "top 85%",
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
      id="demo"
      className="py-28 relative bg-white dark:bg-transparent"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-reveal="heading">
          <span className="inline-block text-sm font-semibold text-[#12372A] dark:text-[#ADBC9F] bg-[#ADBC9F]/25 dark:bg-[#ADBC9F]/15 px-4 py-1.5 rounded-full mb-4">
            See It In Action
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12372A] dark:text-white mb-5">
            Your conversations,{" "}
            <span className="text-[#ADBC9F]">organized</span>
          </h2>
          <p className="text-lg text-[#12372A]/65 dark:text-white/60 max-w-2xl mx-auto">
            Watch how Connect-Bridge captures knowledge in real-time.
          </p>
        </div>

        {/* Browser mockup */}
        <div
          data-demo-browser
          className="rounded-2xl border border-[#ADBC9F]/30 dark:border-[#ADBC9F]/15 overflow-hidden shadow-2xl shadow-[#12372A]/8 dark:shadow-black/30 bg-white dark:bg-[#0d2a1f]"
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-5 py-3 bg-[#f8f9fa] dark:bg-[#12372A] border-b border-[#ADBC9F]/20 dark:border-[#ADBC9F]/10">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/80" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2 px-4 py-1 bg-white dark:bg-[#0d2a1f] rounded-md text-xs text-[#12372A]/50 dark:text-white/40 border border-[#ADBC9F]/15">
                <Search className="w-3 h-3" />
                connect-bridge.app
              </div>
            </div>
          </div>

          {/* App content */}
          <div className="flex min-h-[420px]">
            {/* Sidebar */}
            <div className="hidden md:block w-56 border-r border-[#ADBC9F]/15 dark:border-[#ADBC9F]/10 p-4 bg-[#f8faf7] dark:bg-[#12372A]/60">
              <div className="text-xs font-semibold text-[#12372A]/50 dark:text-white/40 uppercase tracking-wider mb-3">
                Channels
              </div>
              {CHANNELS.map((ch, i) => (
                <div
                  key={ch}
                  data-demo-item
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-1 cursor-default ${
                    i === 1
                      ? "bg-[#ADBC9F]/20 dark:bg-[#ADBC9F]/10 text-[#12372A] dark:text-white font-medium"
                      : "text-[#12372A]/60 dark:text-white/50"
                  }`}
                >
                  <Hash className="w-3.5 h-3.5" />
                  {ch}
                </div>
              ))}
            </div>

            {/* Chat area */}
            <div className="flex-1 p-6 space-y-4">
              {MESSAGES.map((m, i) => (
                <div
                  key={i}
                  data-demo-item
                  className={`flex gap-3 ${m.system ? "opacity-80" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                      m.system
                        ? "bg-[#ADBC9F]/30 text-[#12372A] dark:text-[#ADBC9F]"
                        : "bg-gradient-to-br from-[#ADBC9F] to-[#12372A] text-white"
                    }`}
                  >
                    {m.system ? <BookOpen className="w-4 h-4" /> : m.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-[#12372A] dark:text-white">
                        {m.name}
                      </span>
                      <span className="text-xs text-[#12372A]/40 dark:text-white/30">
                        {m.time}
                      </span>
                    </div>
                    <p
                      className={`text-sm ${m.system ? "text-[#ADBC9F] font-medium" : "text-[#12372A]/80 dark:text-white/70"}`}
                    >
                      {m.msg}
                    </p>
                  </div>
                </div>
              ))}

              {/* Action buttons */}
              <div data-demo-item className="flex gap-2 pl-11 mt-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ADBC9F]/15 dark:bg-[#ADBC9F]/10 text-xs font-medium text-[#12372A] dark:text-[#ADBC9F] cursor-default">
                  <BookOpen className="w-3 h-3" /> Save to Knowledge
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#12372A]/8 dark:bg-white/5 text-xs font-medium text-[#12372A]/70 dark:text-white/50 cursor-default">
                  <Target className="w-3 h-3" /> Create Outcome
                </div>
              </div>
            </div>

            {/* Right sidebar — Knowledge panel */}
            <div className="hidden lg:block w-52 border-l border-[#ADBC9F]/15 dark:border-[#ADBC9F]/10 p-4 bg-[#f8faf7] dark:bg-[#12372A]/60">
              <div className="text-xs font-semibold text-[#12372A]/50 dark:text-white/40 uppercase tracking-wider mb-3">
                Knowledge
              </div>
              {KNOWLEDGE_ITEMS.map((item) => (
                <div
                  key={item}
                  data-demo-item
                  className="flex items-center gap-2 px-2 py-2 text-xs text-[#12372A]/60 dark:text-white/50 cursor-default"
                >
                  <BookOpen className="w-3 h-3 text-[#ADBC9F]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
