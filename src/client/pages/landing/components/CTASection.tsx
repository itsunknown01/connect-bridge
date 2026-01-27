/**
 * CTA Section Component
 * Call-to-action with prominent buttons
 */
import { ArrowRight, Send } from "lucide-react";
import { Button } from "@/src/client/components/ui";

export default function CTASection() {
  const handleNavigate = () => {
    window.location.href = "/auth";
  };

  return (
    <section className="py-24 bg-gradient-to-br from-[#ADBC9F]/30 via-[#ADBC9F]/10 to-white dark:from-[#0d2a1f] dark:via-[#12372A]/50 dark:to-[#0d2a1f]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#12372A] dark:text-white mb-4">
          Ready to get started?
        </h2>
        <p className="text-lg text-[#12372A]/70 dark:text-white/70 mb-8">
          Join thousands of teams using Connect-Bridge.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-[#12372A] hover:bg-[#12372A]/90 text-white dark:bg-white dark:text-[#12372A] dark:hover:bg-white/90 font-bold px-8 shadow-lg shadow-[#12372A]/20 dark:shadow-white/10"
            onClick={handleNavigate}
          >
            Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-[#12372A] text-[#12372A] dark:border-white dark:text-white px-8 hover:bg-[#12372A]/10 dark:hover:bg-white/10"
          >
            <Send className="mr-2 w-5 h-5" /> Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
}
