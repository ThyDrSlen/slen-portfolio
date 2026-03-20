import type { SiteConfig, ExperienceEntry } from "@/lib/content-schema";

export const siteConfig: SiteConfig = {
  name: "Fabrizio Corrales",
  title: "Slen Portfolio",
  description:
    "Portfolio of Fabrizio Corrales — software engineer building tools that ship.",
  url: "https://slen.win",
  email: "fabriziocorrales@pursuit.org",
  socialLinks: [
    {
      platform: "github",
      url: "https://github.com/ThyDrSlen",
      label: "GitHub",
    },
    {
      platform: "linkedin",
      url: "https://www.linkedin.com/in/fabrizio-corrales/",
      label: "LinkedIn",
    },
    {
      platform: "email",
      url: "mailto:fabriziocorrales@pursuit.org",
      label: "Email",
    },
  ],
};

export const experienceEntries: ExperienceEntry[] = [
  {
    company: "Palo Alto Networks",
    role: "Software Engineer",
    period: "2024 – Present",
    description:
      "Enterprise cybersecurity platform engineering on large-scale, mission-critical systems.",
  },
  {
    company: "Form Factor",
    role: "Founder & Lead Engineer",
    period: "2024 – Present",
    description:
      "Mobile fitness app with real-time form feedback, built on Expo, React Native, TypeScript, and Supabase.",
  },
  {
    company: "Marcy Lab School",
    role: "Software Engineering Fellow",
    period: "2023 – 2024",
    description:
      "Intensive fellowship focused on full-stack development, systems design, and technical communication.",
  },
];

export const heroContent = {
  headline: "Fabrizio Corrales",
  subhead:
    "Software engineer who ships product, thinks in systems, and proves it in public.",
  cta: {
    label: "See the work",
    href: "/work",
  },
};

export const aboutContent = {
  intro:
    "I'm a software engineer with a non-traditional path — from the Marcy Lab School fellowship to enterprise cybersecurity at Palo Alto Networks and shipping my own product. I care about building things that work, explaining how they work, and proving they work.",
  currentFocus:
    "Currently building Form Factor, a mobile fitness app with real-time computer vision form feedback, while working on large-scale platform engineering at Palo Alto Networks.",
};
