/**
 * FAQ Section Component
 * Accordion-style FAQ list
 */
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/src/client/lib/utils";
import { FAQS } from "../constants";

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white dark:bg-gradient-to-br dark:from-[#12372A] dark:via-[#12372A] dark:to-[#ADBC9F]/15">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold text-[#12372A] dark:text-[#ADBC9F] bg-[#ADBC9F]/30 dark:bg-[#ADBC9F]/20 px-4 py-1.5 rounded-full mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#12372A] dark:text-white">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-[#ADBC9F]/20 dark:bg-white/5 rounded-xl border border-[#ADBC9F]/30 dark:border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-[#ADBC9F]/10 dark:hover:bg-white/5 transition-colors"
              >
                <span className="font-semibold text-[#12372A] dark:text-white">
                  {faq.q}
                </span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-[#12372A] dark:text-[#ADBC9F] transition-transform",
                    open === i && "rotate-180",
                  )}
                />
              </button>
              {open === i && (
                <div className="px-4 pb-4 text-[#12372A]/70 dark:text-white/70 text-sm">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
