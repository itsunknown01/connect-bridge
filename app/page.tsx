import Header from "@/components/layouts/Header";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";

export default function Home() {
  return (
    <main className="flex w-full pb-0 flex-col items-start">
      <HeroSection/>
      <AboutSection />
    </main>
  )
}
