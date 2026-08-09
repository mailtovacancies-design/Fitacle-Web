import type { Metadata } from "next"
import { MainContent } from "@/components/fitacle/main-content"

export const metadata: Metadata = {
  title: "Find a Workout Partner Near You",
  description:
    "Find a workout partner, gym buddy, or accountability partner near you. Match with training partners by goals, activity, schedule, and location on Fitacle.",
  alternates: { canonical: "/" },
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Fitacle",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      url: "https://www.fitacle.com",
      description:
        "Find a workout partner, gym buddy, or accountability partner near you. Fitacle matches you with training partners by goals, activity, schedule, and location, powered by AI fitness intelligence.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I find a workout partner on Fitacle?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Create your free Fitacle profile with your goals, activity, schedule, and location. Fitacle then matches you with nearby workout partners, gym buddies, and accountability partners so you never train alone.",
          },
        },
        {
          "@type": "Question",
          name: "Is finding a fitness partner on Fitacle free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. You can create a profile and find a workout partner on Fitacle for free — no credit card required.",
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
