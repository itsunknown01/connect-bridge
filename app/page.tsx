import AboutSection from "@/components/sections/AboutSection";
import HeroSection from "@/components/sections/HeroSection";

export default function Home() {
  return (
    <main className="flex w-full pb-0 flex-col items-start">
      <HeroSection/>
      <AboutSection />
    </main>
  )
}
