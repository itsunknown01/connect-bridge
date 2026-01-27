/**
 * Footer Component
 * Site footer with navigation links
 * Light: White bg with dark text | Dark: Dark bg with light text
 */
import { Zap } from "lucide-react";
import { FOOTER_LINKS } from "../constants";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#12372A] border-t border-[#ADBC9F]/30 dark:border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-6 h-6 text-[#ADBC9F]" />
              <span className="font-bold text-lg text-[#12372A] dark:text-white">
                Connect-Bridge
              </span>
            </div>
            <p className="text-[#12372A]/60 dark:text-white/60 text-sm">
              Turn conversations into knowledge.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-[#12372A] dark:text-[#ADBC9F] mb-3 text-sm">
              Product
            </h4>
            <ul className="space-y-2 text-[#12372A]/60 dark:text-white/60 text-sm">
              {FOOTER_LINKS.product.map((link) => (
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

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-[#12372A] dark:text-[#ADBC9F] mb-3 text-sm">
              Company
            </h4>
            <ul className="space-y-2 text-[#12372A]/60 dark:text-white/60 text-sm">
              {FOOTER_LINKS.company.map((link) => (
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

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-[#12372A] dark:text-[#ADBC9F] mb-3 text-sm">
              Legal
            </h4>
            <ul className="space-y-2 text-[#12372A]/60 dark:text-white/60 text-sm">
              {FOOTER_LINKS.legal.map((link) => (
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
        </div>

        <div className="border-t border-[#ADBC9F]/30 dark:border-white/10 pt-6 text-center text-[#12372A]/60 dark:text-white/60 text-sm">
          © 2024 Connect-Bridge. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
