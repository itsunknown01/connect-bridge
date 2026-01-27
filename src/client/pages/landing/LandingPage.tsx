/**
 * Connect-Bridge Landing Page
 *
 * Clean composition root following SOLID principles:
 * - S: Each section has single responsibility
 * - O: Components are open for extension (via props)
 * - L: Components are substitutable
 * - I: Small, focused interfaces
 * - D: Depends on abstractions (imports from index)
 *
 * Color Scheme:
 * - Light: #ADBC9F gradients, #12372A text/buttons, white cards
 * - Dark: #12372A gradients, white text/buttons, #ADBC9F accents
 */

import {
  Header,
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  DemoSection,
  PricingSection,
  TestimonialsSection,
  FAQSection,
  CTASection,
  Footer,
} from "./components";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-[#12372A] dark:via-[#12372A] dark:to-[#ADBC9F]/10 transition-colors">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DemoSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
