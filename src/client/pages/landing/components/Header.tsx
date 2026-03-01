/**
 * Header Component — Scroll-aware frosted glass
 *
 * Transparent at page top, frosted glass on scroll.
 * Uses GSAP ScrollTrigger for efficient scroll listening.
 */
import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X, Zap, Sun, Moon } from "lucide-react";
import { Button } from "@/src/client/components/ui";
import { Switch } from "@/src/client/components/ui/switch";
import { useTheme } from "@/src/client/hooks/contexts/ThemeContext";
import { NAV_LINKS, navigateToAuth } from "../constants";

gsap.registerPlugin(ScrollTrigger);

function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#ADBC9F]/20 dark:bg-white/10">
      <Sun
        className={`w-4 h-4 transition-colors ${isDark ? "text-white/40" : "text-[#ADBC9F]"}`}
      />
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-[#ADBC9F] data-[state=unchecked]:bg-[#ADBC9F]/40"
      />
      <Moon
        className={`w-4 h-4 transition-colors ${isDark ? "text-[#ADBC9F]" : "text-[#12372A]/40"}`}
      />
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Scroll-aware header opacity
  useGSAP(() => {
    if (!headerRef.current) return;

    ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      onUpdate: (self) => {
        if (!headerRef.current) return;
        if (self.direction === 1 && self.progress > 0) {
          // Scrolling down past threshold
          headerRef.current.classList.add("header-scrolled");
        }
        if (self.scroll() < 80) {
          headerRef.current.classList.remove("header-scrolled");
        }
      },
    });
  });

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 bg-transparent [&.header-scrolled]:bg-white/90 dark:[&.header-scrolled]:bg-[#12372A]/90 [&.header-scrolled]:backdrop-blur-xl [&.header-scrolled]:border-b [&.header-scrolled]:border-[#12372A]/10 dark:[&.header-scrolled]:border-white/10 [&.header-scrolled]:shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-[#12372A] dark:text-white"
          >
            <Zap className="w-6 h-6 text-[#ADBC9F]" />
            Connect-Bridge
          </a>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#12372A]/70 dark:text-white/70 hover:text-[#12372A] dark:hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="text-[#12372A] dark:text-white"
              onClick={navigateToAuth}
            >
              Sign In
            </Button>
            <Button
              size="sm"
              className="bg-[#12372A] hover:bg-[#12372A]/90 text-white dark:bg-white dark:text-[#12372A] dark:hover:bg-white/90 font-semibold"
              onClick={navigateToAuth}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 text-[#12372A] dark:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-[#12372A]/10 dark:border-white/10">
            <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[#12372A] dark:text-white font-medium py-2"
                >
                  {link.label}
                </a>
              ))}
              <Button
                className="bg-[#12372A] text-white dark:bg-white dark:text-[#12372A] mt-2"
                onClick={navigateToAuth}
              >
                Get Started
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
