/**
 * Hero Section — Cinematic Parallax
 *
 * 3-depth parallax layers driven by GSAP ScrollTrigger.
 * All styling via Tailwind — no custom CSS.
 */
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Check, Play } from "lucide-react";
import { Button } from "@/src/client/components/ui";
import { navigateToAuth, TRUST_SIGNALS } from "../constants";
import { REDUCED_MOTION } from "../hooks/useScrollReveal";

gsap.registerPlugin(ScrollTrigger);

/* ─── Sub-components (SRP) ─── */

function TrustSignals() {
  return (
    <div className="mt-16 flex items-center justify-center gap-6 text-sm text-[#12372A]/50 dark:text-white/40">
      {TRUST_SIGNALS.map((label, i) => (
        <span key={label} className="contents">
          {i > 0 && (
            <span className="w-1 h-1 rounded-full bg-current opacity-30" />
          )}
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            {label}
          </span>
        </span>
      ))}
    </div>
  );
}

function HeroHeadline() {
  const words = [
    { text: "Turn\u00a0" },
    { text: "Conversations\u00a0" },
    { br: "sm" },
    { text: "into\u00a0" },
    {
      text: "Knowledge\u00a0",
      gradient:
        "bg-gradient-to-r from-[#12372A] to-[#ADBC9F] dark:from-[#ADBC9F] dark:to-white bg-clip-text text-transparent",
    },
    { text: "and\u00a0" },
    { br: "lg" },
    {
      text: "Outcomes",
      gradient:
        "bg-gradient-to-r from-[#ADBC9F] to-[#12372A] dark:from-white dark:to-[#ADBC9F] bg-clip-text text-transparent",
    },
  ];

  return (
    <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.25rem] font-extrabold text-[#12372A] dark:text-white leading-[1.08] tracking-tight mb-8">
      {words.map((w, i) =>
        w.br ? (
          <br
            key={i}
            className={w.br === "sm" ? "hidden sm:block" : "hidden lg:block"}
          />
        ) : (
          <span key={i} className="inline-block overflow-hidden">
            <span
              className={`inline-block hero-word-inner ${w.gradient || ""}`}
            >
              {w.text}
            </span>
          </span>
        ),
      )}
    </h1>
  );
}

/* ─── Floating shapes data ─── */
const SHAPES = [
  {
    className:
      "top-[18%] left-[12%] w-16 h-16 border-2 border-[#12372A]/15 dark:border-[#ADBC9F]/20 rounded-lg rotate-12 animate-float-slow",
  },
  {
    className:
      "top-[25%] right-[15%] w-10 h-10 bg-[#ADBC9F]/20 dark:bg-[#ADBC9F]/15 rounded-full animate-float-medium",
  },
  {
    className:
      "bottom-[30%] left-[20%] w-12 h-12 border-2 border-[#ADBC9F]/25 dark:border-[#ADBC9F]/20 rounded-full animate-float-medium",
    delay: "1s",
  },
  {
    className:
      "top-[55%] right-[10%] w-20 h-20 border border-[#12372A]/10 dark:border-[#ADBC9F]/15 rounded-2xl -rotate-6 animate-float-slow",
    delay: "2s",
  },
  {
    className:
      "bottom-[22%] right-[28%] w-8 h-8 bg-[#12372A]/8 dark:bg-[#ADBC9F]/10 rotate-45 animate-float-slow",
    delay: "3s",
  },
  {
    className:
      "top-[35%] left-[6%] w-24 h-[1px] bg-gradient-to-r from-transparent via-[#ADBC9F]/30 to-transparent rotate-[20deg]",
  },
  {
    className:
      "bottom-[40%] right-[5%] w-20 h-[1px] bg-gradient-to-r from-transparent via-[#12372A]/15 dark:via-[#ADBC9F]/20 to-transparent -rotate-[15deg]",
  },
];

/* ─── Main Component ─── */

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const midLayerRef = useRef<HTMLDivElement>(null);
  const fgLayerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (REDUCED_MOTION || !heroRef.current) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Headline word reveal
      const words = heroRef.current.querySelectorAll(".hero-word-inner");
      tl.from(words, { y: 80, opacity: 0, duration: 0.9, stagger: 0.08 });

      // Subtitle + CTA fade in
      tl.from(
        heroRef.current.querySelector("[data-hero='subtitle']"),
        { y: 30, opacity: 0, duration: 0.6 },
        "-=0.3",
      );
      tl.from(
        heroRef.current.querySelector("[data-hero='cta']"),
        { y: 20, opacity: 0, duration: 0.5 },
        "-=0.2",
      );
      tl.from(
        heroRef.current.querySelector("[data-hero='badge']"),
        { y: -20, opacity: 0, duration: 0.5 },
        "-=0.4",
      );

      // Floating shapes entrance
      tl.from(
        heroRef.current.querySelectorAll("[data-shape]"),
        {
          scale: 0,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=0.5",
      );

      // Parallax on scroll
      const parallaxConfig = (
        ref: React.RefObject<HTMLDivElement | null>,
        yVal: number,
      ) => {
        if (!ref.current) return;
        gsap.to(ref.current, {
          y: yVal,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      };

      parallaxConfig(bgLayerRef, 200);
      parallaxConfig(midLayerRef, 120);
      parallaxConfig(fgLayerRef, 50);
    },
    { scope: heroRef },
  );

  const scrollToDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden flex items-center pt-20 pb-12"
      aria-label="Connect-Bridge Hero"
    >
      {/* Layer 1: Background */}
      <div
        ref={bgLayerRef}
        className="absolute inset-0 z-[1] will-change-transform"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#ADBC9F]/50 via-[#c5d4b8]/30 to-white dark:from-[#0d2a1f] dark:via-[#12372A] dark:to-[#12372A]" />
        <div
          className="absolute inset-0 opacity-25 dark:opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1.5px 1.5px, rgba(18,55,42,0.18) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-[10%] left-[5%] w-[28rem] h-[28rem] bg-[#ADBC9F]/25 dark:bg-[#ADBC9F]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[15%] right-[8%] w-[34rem] h-[34rem] bg-[#12372A]/8 dark:bg-[#ADBC9F]/5 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[30%] w-[20rem] h-[20rem] bg-[#ADBC9F]/15 dark:bg-[#ADBC9F]/6 rounded-full blur-[100px]" />
      </div>

      {/* Layer 2: Floating shapes */}
      <div
        ref={midLayerRef}
        className="absolute inset-0 z-[2] will-change-transform pointer-events-none"
      >
        {SHAPES.map((shape, i) => (
          <div
            key={i}
            data-shape
            className={`absolute ${shape.className}`}
            style={shape.delay ? { animationDelay: shape.delay } : undefined}
          />
        ))}
      </div>

      {/* Layer 3: Content */}
      <div ref={fgLayerRef} className="z-[3] relative w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div data-hero="badge" className="mb-8">
              <span className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/70 dark:bg-[#ADBC9F]/15 text-[#12372A] dark:text-[#ADBC9F] text-sm font-medium rounded-full border border-[#12372A]/15 dark:border-[#ADBC9F]/25 backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 bg-[#12372A] dark:bg-[#ADBC9F] rounded-full animate-pulse" />
                Now in Early Access
              </span>
            </div>

            <HeroHeadline />

            {/* Subtitle */}
            <p
              data-hero="subtitle"
              className="text-lg sm:text-xl lg:text-[1.35rem] text-[#12372A]/75 dark:text-white/65 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Connect-Bridge captures what matters from your team chats—turning
              discussions into documented knowledge and trackable outcomes.
            </p>

            {/* CTA Buttons */}
            <div
              data-hero="cta"
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="bg-[#12372A] hover:bg-[#0d2a1f] text-white dark:bg-white dark:text-[#12372A] dark:hover:bg-white/90 font-bold px-10 py-6 text-base shadow-xl shadow-[#12372A]/20 dark:shadow-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                onClick={navigateToAuth}
              >
                Get Early Access <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[#12372A]/25 text-[#12372A] hover:bg-[#12372A]/8 dark:border-white/25 dark:text-white dark:hover:bg-white/8 px-10 py-6 text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
                onClick={scrollToDemo}
              >
                <Play className="mr-2 w-5 h-5" /> Watch Demo
              </Button>
            </div>

            <TrustSignals />
          </div>
        </div>
      </div>
    </section>
  );
}
