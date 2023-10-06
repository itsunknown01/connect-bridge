import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import React from "react";
import { Language } from "./types";

export const navLinks = [
  { name: "Home" },
  { name: "Download" },
  { name: "Nitro" },
  { name: "Discover" },
  { name: "Safety" },
  { name: "Support" },
  { name: "Blog" },
  { name: "Courses" },
];

export const aboutData = [
  {
    title: "Create an invite-only place where you belong",
    content:
      "Discord servers are organized into topic- based channels where you can collaborate, share, and just talk about your day without clogging up a group chat.",
    image: "/about1.svg",
  },

  {
    title: "Where hanging out is easy",
    content:
      "Grab a seat in a voice channel when you’re free. Friends in your server can see you’re around and instantly pop in to talk without having to call.",
    image: "/about2.svg",
  },

  {
    title: "From few to a fandom",
    content:
      "Get any community running with moderation tools and custom member access. Give members special powers, set up private channels, and more.",
    image: "/about3.svg",
  },
];

export const socialLinks = [
  {
    name: "Twitter",
    url: "/",
    icon: React.createElement(Twitter, {color: "white"}),
  },
  {
    name: "Facebook",
    icon: React.createElement(Facebook, {color: "white"}),
    url: "/",
  },
  {
    name: "Instagram",
    icon: React.createElement(Instagram, {color: "white"}),
    url: "/",
  },
  {
    name: "YouTube",
    icon: React.createElement(Youtube, {color: "white"}),
    url: "/",
  },
];

export const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'tr', name: 'Turkish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'pl', name: 'Polish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'da', name: 'Danish' },
  { code: 'cs', name: 'Czech' },
  // Add more languages here
];

export const footerSectionsData = [
  {
    title: "Product",
    content: [
      { link: "Download" },
      { link: "Nitro" },
      { link: "Status" },
      { link: "App Directory" },
    ],
  },
  {
    title: "Company",
    content: [
      { link: "About" },
      { link: "jobs" },
      { link: "Brand" },
      { link: "Newsroom" },
    ],
  },
  {
    title: "Resourses",
    content: [
      { link: "College" },
      { link: "Support" },
      { link: "Safety" },
      { link: "Blog" },
      { link: "FeedBack" },
      { link: "Developers" },
      { link: "StreamKit" },
      { link: "Creators" },
      { link: "Community" },
      { link: "Official 3rd Party March" },
    ],
  },
  {
    title: "Policies",
    content: [
      { link: "Terms" },
      { link: "Privacy" },
      { link: "Cookie Settings" },
      { link: "Guidelines" },
      { link: "Acknowledgements" },
      { link: "Licences" },
      { link: "Company Information" },
    ],
  },
];