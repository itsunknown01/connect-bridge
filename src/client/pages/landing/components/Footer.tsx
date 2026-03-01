/**
 * Footer Component — Loop-based link rendering (DRY)
 */
import { Zap } from "lucide-react";
import { FOOTER_LINKS } from "../constants";
import { useSectionReveal } from "../hooks/useScrollReveal";

const LINK_SECTIONS = [
  { title: "Product", links: FOOTER_LINKS.product },
  { title: "Company", links: FOOTER_LINKS.company },
  { title: "Legal", links: FOOTER_LINKS.legal },
] as const;

export default function Footer() {
  const sectionRef = useSectionReveal();

  return (
    <footer
      ref={sectionRef}
      className="bg-white dark:bg-[#0d2a1f] border-t border-[#ADBC9F]/20 dark:border-white/8 py-14"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-10" data-reveal="heading">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-6 h-6 text-[#ADBC9F]" />
              <span className="font-bold text-lg text-[#12372A] dark:text-white">
                Connect-Bridge
              </span>
            </div>
            <p className="text-[#12372A]/55 dark:text-white/50 text-sm leading-relaxed">
              Turn conversations into knowledge and trackable outcomes.
            </p>
          </div>

          {/* Link columns */}
          {LINK_SECTIONS.map(({ title, links }) => (
            <div key={title} data-reveal="item">
              <h4 className="font-semibold text-[#12372A] dark:text-[#ADBC9F] mb-4 text-sm">
                {title}
              </h4>
              <ul className="space-y-2.5 text-[#12372A]/55 dark:text-white/50 text-sm">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="hover:text-[#12372A] dark:hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#ADBC9F]/20 dark:border-white/8 pt-6 text-center text-[#12372A]/50 dark:text-white/40 text-sm">
          © {new Date().getFullYear()} Connect-Bridge. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
