"use client"

import Footer from "@/components/layouts/Footer";
import AboutSection from "@/components/sections/AboutSection";
import HeroSection from "@/components/sections/HeroSection";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const {user} = useUser();
  const router = useRouter();

  if (user) {
    router.push('/channels')
    return null;
  }
  
  return (
    <main className="flex w-full pb-0 flex-col items-start">
      <HeroSection/>
      <AboutSection />
      <Footer />
    </main>
  )
}
