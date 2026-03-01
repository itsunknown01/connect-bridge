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
    <div className="scroll-smooth overflow-x-hidden min-h-screen bg-white dark:bg-gradient-to-b dark:from-[#12372A] dark:via-[#12372A] dark:to-[#0d2a1f] transition-colors">
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
