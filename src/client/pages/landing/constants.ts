/**
 * Landing Page Constants
 * Centralized data for the landing page (Single Responsibility)
 */
import { MessageSquare, BookOpen, Target, Shield } from "lucide-react";

// Brand colors for consistent theming
export const BRAND = {
  primary: "#12372A",
  primaryLight: "#1a4a38",
  primaryDark: "#0d2a1f",
  accent: "#ADBC9F",
  accentLight: "#c5d4b8",
} as const;

// Navigation links
export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
] as const;

// Feature cards data
export const FEATURES = [
  {
    icon: MessageSquare,
    title: "Real-Time Chat",
    description: "Seamless team communication with channels and threads.",
  },
  {
    icon: BookOpen,
    title: "Knowledge Capture",
    description: "Transform messages into documented knowledge instantly.",
  },
  {
    icon: Target,
    title: "Outcome Tracking",
    description: "Turn discussions into tracked decisions and actions.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption with SOC 2 and GDPR compliance.",
  },
] as const;

// How it works steps
export const STEPS = [
  {
    num: "1",
    title: "Chat naturally",
    desc: "Have conversations like you normally would.",
  },
  {
    num: "2",
    title: "Mark important items",
    desc: "One-click to save to knowledge or create outcomes.",
  },
  {
    num: "3",
    title: "Track and search",
    desc: "Find decisions and knowledge instantly.",
  },
] as const;

// Pricing plans
export const PRICING_PLANS = [
  {
    name: "Free",
    price: "0",
    description: "For small teams",
    features: ["Up to 5 members", "Basic chat", "1GB storage"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "12",
    description: "For growing teams",
    features: [
      "Unlimited members",
      "Knowledge base",
      "10GB storage",
      "Priority support",
      "API access",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large orgs",
    features: [
      "Everything in Pro",
      "SSO & SCIM",
      "Unlimited storage",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
] as const;

// Testimonials
export const TESTIMONIALS = [
  {
    quote: "Transform how our team collaborates.",
    name: "Sarah Chen",
    role: "CTO at TechCorp",
  },
  {
    quote: "The best platform we've ever used.",
    name: "Michael Rodriguez",
    role: "VP Engineering",
  },
  {
    quote: "Saved us countless hours every week.",
    name: "Emily Watson",
    role: "Product Lead",
  },
] as const;

// FAQs
export const FAQS = [
  {
    q: "How does Connect-Bridge work?",
    a: "Combine real-time chat with knowledge capture. Save messages to your knowledge base with one click.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Bank-level encryption with SOC 2, GDPR, and HIPAA compliance.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. No hidden fees. Data accessible for 30 days after cancellation.",
  },
] as const;

// Footer links
export const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
  ],
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
} as const;
