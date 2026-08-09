import type { Metadata } from "next"
import { MainContent } from "@/components/fitacle/main-content"
import { SITE_URL, SITE_NAME } from "@/lib/site"

export const metadata: Metadata = {
  title: "Find a Fitness Partner Near You | Fitacle",
  description:
    "Looking for a fitness partner? Fitacle matches you with a gym buddy, workout partner, running or walking companion near you — and builds AI fitness plans. Never train alone.",
  alternates: {
    canonical: "/",
  },
}

// Invisible JSON-LD structured data (renders nothing visually). Helps search
// engines understand Fitacle and surface it for fitness-partner searches.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icons/icon-512.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description:
        "Find a fitness partner near you and get AI fitness plans with Fitacle.",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Service",
      name: "Find a Fitness Partner",
      serviceType: "Fitness partner matching",
      description:
        "Fitacle connects you with a fitness partner near you — a gym buddy, workout partner, running partner, walking partner or accountability companion who matches your goals, location and schedule.",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: "Worldwide",
      url: `${SITE_URL}/#members`,
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I find a fitness partner near me?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sign up for Fitacle and use Find My Fitness Partner to get matched with a gym buddy, workout partner, running or walking companion near you based on your goals, location and schedule.",
          },
        },
        {
          "@type": "Question",
          name: "Can I find a workout buddy or gym partner on Fitacle?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Fitacle helps you find a workout buddy, gym partner, running buddy, walking partner or training partner so you never have to train alone.",
          },
        },
        {
          "@type": "Question",
          name: "Where can I find a workout partner or gym partner near me?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Use Fitacle's Find My Fitness Partner feature to discover a workout partner or gym partner near you. Matches are based on your location, schedule and fitness goals so you can train with someone nearby.",
          },
        },
        {
          "@type": "Question",
          name: "Can I find a running partner or walking partner near me?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Fitacle matches you with a running partner, running buddy or walking partner near you, so you always have a fitness companion for your runs and walks.",
          },
        },
        {
          "@type": "Question",
          name: "I'm looking for someone to workout with — can Fitacle help?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely. If you're looking for a fitness partner or someone to workout with, Fitacle connects you with a like-minded training partner or accountability companion near you.",
          },
        },
      ],
    },
  ],
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <MainContent />
    </>
  )
}
