/**
 * Hero Section Component
 * Visually striking hero with gradient background
 */
import {
  ArrowRight,
  Play,
  BookOpen,
  MessageSquare,
  Target,
} from "lucide-react";
import { Button } from "@/src/client/components/ui";

export default function HeroSection() {
  const handleNavigate = () => {
    window.location.href = "/auth";
  };

  const scrollToDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Gradient Background - Light: Sage to White | Dark: Deep green gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ADBC9F]/60 via-[#c5d4b8]/40 to-white dark:from-[#12372A] dark:via-[#0d2a1f] dark:to-[#12372A]" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(18,55,42,0.15) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#ADBC9F]/30 dark:bg-[#ADBC9F]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#12372A]/10 dark:bg-[#ADBC9F]/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-[#ADBC9F]/20 text-[#12372A] dark:text-[#ADBC9F] text-sm font-medium rounded-full border border-[#12372A]/20 dark:border-[#ADBC9F]/30 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-[#12372A] dark:bg-[#ADBC9F] rounded-full animate-pulse" />
              Now in Early Access
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#12372A] dark:text-white leading-tight mb-6">
              Turn Conversations into{" "}
              <span className="bg-gradient-to-r from-[#12372A] to-[#ADBC9F] dark:from-[#ADBC9F] dark:to-white bg-clip-text text-transparent">
                Knowledge
              </span>{" "}
              and{" "}
              <span className="bg-gradient-to-r from-[#ADBC9F] to-[#12372A] dark:from-white dark:to-[#ADBC9F] bg-clip-text text-transparent">
                Outcomes
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#12372A]/80 dark:text-white/70 mb-8 max-w-xl mx-auto lg:mx-0">
              Connect-Bridge captures what matters from your team chats—turning
              discussions into documented knowledge.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-[#12372A] hover:bg-[#12372A]/90 text-white dark:bg-white dark:text-[#12372A] dark:hover:bg-white/90 font-bold px-8 shadow-lg shadow-[#12372A]/20 dark:shadow-white/10"
                onClick={handleNavigate}
              >
                Get Early Access <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[#12372A]/30 text-[#12372A] hover:bg-[#12372A]/10 dark:border-white/30 dark:text-white dark:hover:bg-white/10 px-8"
                onClick={scrollToDemo}
              >
                <Play className="mr-2 w-5 h-5" /> Watch Demo
              </Button>
            </div>
          </div>

          {/* Animated Illustration */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-80 h-80">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-[#ADBC9F]/30 dark:from-[#ADBC9F]/20 dark:to-transparent rounded-full blur-[60px]" />

              {/* Rotating ring */}
              <div
                className="absolute inset-8 rounded-full border-2 border-dashed border-[#12372A]/30 dark:border-[#ADBC9F]/40 animate-spin"
                style={{ animationDuration: "30s" }}
              />

              {/* Center orb */}
              <div className="absolute inset-16 rounded-full bg-white dark:bg-[#ADBC9F] shadow-2xl flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-[#12372A]" />
              </div>

              {/* Floating icons */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#12372A] dark:bg-white rounded-xl shadow-lg flex items-center justify-center animate-bounce"
                style={{ animationDuration: "3s" }}
              >
                <MessageSquare className="w-7 h-7 text-white dark:text-[#12372A]" />
              </div>
              <div
                className="absolute bottom-4 left-4 w-12 h-12 bg-[#12372A] dark:bg-white rounded-xl shadow-lg flex items-center justify-center animate-bounce"
                style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
              >
                <Target className="w-6 h-6 text-white dark:text-[#12372A]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
