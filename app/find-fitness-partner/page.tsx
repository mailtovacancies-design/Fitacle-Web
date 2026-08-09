import type { Metadata } from "next"
import { FindPartnerLanding } from "@/components/fitacle/find-partner-landing"

const PAGE_URL = "https://www.fitacle.com/find-fitness-partner"

export const metadata: Metadata = {
  title: "Find a Fitness Partner Near You",
  description:
    "Find a fitness partner, workout partner, gym buddy, or accountability partner near you. Fitacle matches you with training partners by goals, activity, schedule, and location.",
  keywords: [
    "find a fitness partner",
    "find a workout partner",
    "find a gym partner",
    "fitness partner near me",
    "gym buddy",
    "workout buddy",
    "accountability partner",
    "training partner",
  ],
  alternates: { canonical: "/find-fitness-partner" },
  openGraph: {
    title: "Find a Fitness Partner Near You | Fitacle",
    description:
      "Never train alone. Match with a workout partner, gym buddy, or accountability partner by goals, schedule, and location on Fitacle.",
    url: PAGE_URL,
    siteName: "Fitacle",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find a Fitness Partner Near You | Fitacle",
    description:
      "Never train alone. Match with a workout partner or gym buddy by goals, schedule, and location on Fitacle.",
  },
  robots: { index: true, follow: true },
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": PAGE_URL,
      url: PAGE_URL,
      name: "Find a Fitness Partner Near You",
      description:
        "Find a fitness partner, workout partner, gym buddy, or accountability partner near you. Fitacle matches you with training partners by goals, activity, schedule, and location.",
      isPartOf: {
        "@type": "WebSite",
        name: "Fitacle",
        url: "https://www.fitacle.com",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.fitacle.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Find a Fitness Partner",
          item: PAGE_URL,
        },
      ],
    },
    {
      "@type": "Service",
      serviceType: "Fitness partner matching",
      name: "Find a Fitness Partner",
      url: PAGE_URL,
      areaServed: "Worldwide",
      provider: {
        "@type": "Organization",
        name: "Fitacle",
        url: "https://www.fitacle.com",
      },
      description:
        "Fitacle matches you with a workout partner, gym buddy, or accountability partner based on your goals, activity, schedule, and location.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I find a fitness partner near me?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Create your free Fitacle profile with your goals, activity, schedule, and location. Fitacle then matches you with nearby workout partners, gym buddies, and accountability partners so you never train alone.",
          },
        },
        {
          "@type": "Question",
          name: "Is finding a workout partner on Fitacle free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. You can create a profile and find a fitness partner on Fitacle for free — no credit card required.",
          },
        },
        {
          "@type": "Question",
          name: "How does Fitacle match me with a training partner?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Fitacle uses your real profile data — fitness focus, experience level, city, gym, and preferred training times — to surface compatible partners so it's easy to train together consistently.",
          },
        },
      ],
    },
  ],
}

export default function FindFitnessPartnerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <FindPartnerLanding />
    </>
  )
}
