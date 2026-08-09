// Central config for the public, SEO-focused "find a partner" landing pages.
// Plain serializable data only (no JSX) so it can be imported by both server
// components (metadata + JSON-LD) and the client landing component.
//
// Each variant maps to ONE indexable route and connects to the SAME existing
// "Find a Fitness Partner" feature (the MembersShowcase directory + profile
// system). We do NOT create a new matching/profile system.

export const SITE_ORIGIN = "https://www.fitacle.com"

export interface PartnerFaq {
  question: string
  answer: string
}

export interface PartnerHighlight {
  // Icon is chosen by index in the client component to keep this data
  // serializable. Order: goals, location, schedule, accountability.
  title: string
  body: string
}

export interface PartnerVariant {
  slug: string // e.g. "find-fitness-partner"
  noun: string // e.g. "fitness partner" (lowercase, for inline copy)
  nounTitle: string // e.g. "Fitness Partner" (title case, for H1)
  ctaNoun: string // e.g. "Fitness Partner" used in the CTA button
  badge: string
  h1: string
  intro: string
  highlights: [PartnerHighlight, PartnerHighlight, PartnerHighlight, PartnerHighlight]
  about: { heading: string; paragraphs: string[] }
  faqs: PartnerFaq[]
  metaTitle: string
  metaDescription: string
  ogTitle: string
  ogDescription: string
  keywords: string[]
  priority: number
}

const ACCOUNTABILITY: PartnerHighlight = {
  title: "Real accountability",
  body: "Turn one-off sessions into a consistent habit with someone who keeps you showing up.",
}

export const PARTNER_VARIANTS: PartnerVariant[] = [
  {
    slug: "find-fitness-partner",
    noun: "fitness partner",
    nounTitle: "Fitness Partner",
    ctaNoun: "Fitness Partner",
    badge: "Find Your Fitness Partner",
    h1: "Find a Fitness Partner Near You",
    intro:
      "Never train alone. Fitacle matches you with a fitness partner, gym buddy, or accountability partner based on your goals, activity, schedule, and location — so every session has someone in your corner.",
    highlights: [
      {
        title: "Matched by goals",
        body: "Connect with people chasing the same outcome — strength, fat loss, endurance, or general health.",
      },
      {
        title: "Near your location",
        body: "Find a fitness partner in your city and at your usual gym so training together is genuinely convenient.",
      },
      {
        title: "On your schedule",
        body: "Filter by training times so you meet someone who shows up when you actually do.",
      },
      ACCOUNTABILITY,
    ],
    about: {
      heading: "Why train with a fitness partner?",
      paragraphs: [
        "The hardest part of getting fit is showing up consistently. A fitness partner near you makes that easier — you have someone expecting you, pushing your pace, and celebrating the wins with you.",
        "Fitacle uses your real profile data — fitness focus, experience level, city, gym, and preferred times — to surface people you can actually train with, not a random feed of strangers.",
      ],
    },
    faqs: [
      {
        question: "How do I find a fitness partner near me?",
        answer:
          "Create your free Fitacle profile with your goals, activity, schedule, and location. Fitacle then surfaces nearby fitness partners, gym buddies, and accountability partners so you never train alone.",
      },
      {
        question: "Is finding a fitness partner on Fitacle free?",
        answer: "Yes. You can create a profile and find a fitness partner on Fitacle for free — no credit card required.",
      },
      {
        question: "How does Fitacle match me with a partner?",
        answer:
          "Fitacle uses your real profile data — fitness focus, experience level, city, gym, and preferred training times — to surface compatible partners so it is easy to train together consistently.",
      },
      {
        question: "Can I find a fitness partner in my specific city?",
        answer:
          "Yes. Use the location filters in the partner directory to narrow results to your country, city, or gym — whether that is Doha, London, Dubai, or anywhere else.",
      },
    ],
    metaTitle: "Find a Fitness Partner Near You",
    metaDescription:
      "Find a fitness partner, gym buddy, or accountability partner near you. Fitacle matches you with training partners by goals, activity, schedule, and location.",
    ogTitle: "Find a Fitness Partner Near You | Fitacle",
    ogDescription:
      "Never train alone. Match with a fitness partner, gym buddy, or accountability partner by goals, schedule, and location on Fitacle.",
    keywords: [
      "find a fitness partner",
      "fitness partner near me",
      "fitness buddy near me",
      "exercise partner near me",
      "accountability partner",
      "workout buddy",
    ],
    priority: 0.9,
  },
  {
    slug: "find-workout-partner",
    noun: "workout partner",
    nounTitle: "Workout Partner",
    ctaNoun: "Workout Partner",
    badge: "Find Your Workout Partner",
    h1: "Find a Workout Partner Near You",
    intro:
      "Stop skipping sessions. Fitacle connects you with a workout partner near you who matches your training style, experience level, schedule, and location — so your next workout already has a plus-one.",
    highlights: [
      {
        title: "Same training style",
        body: "Match with people who lift, push, and progress the way you like to train.",
      },
      {
        title: "Near your location",
        body: "Find a workout partner in your city and at your gym so meeting up is effortless.",
      },
      {
        title: "Fits your routine",
        body: "Filter by morning, evening, or flexible slots to sync workouts with your week.",
      },
      ACCOUNTABILITY,
    ],
    about: {
      heading: "Why train with a workout partner?",
      paragraphs: [
        "A workout partner turns motivation into momentum. On the days you would rather stay home, someone is counting on you — and that is often the difference between progress and plateaus.",
        "Fitacle pairs you using real profile data, not guesswork, so your workout partner actually trains near you, at compatible times, toward compatible goals.",
      ],
    },
    faqs: [
      {
        question: "How do I find a workout partner near me?",
        answer:
          "Set up your free Fitacle profile with your training style, schedule, and location. Fitacle then shows nearby workout partners you can start training with right away.",
      },
      {
        question: "What makes a good workout partner?",
        answer:
          "A good workout partner trains near you, keeps a similar schedule, and shares your intensity and goals. Fitacle filters on exactly these signals so the match is practical, not random.",
      },
      {
        question: "Is Fitacle free for finding a workout buddy?",
        answer: "Yes. Creating a profile and browsing workout partners is completely free.",
      },
      {
        question: "Can I find a workout partner in my city?",
        answer:
          "Absolutely. Filter the partner directory by country, city, or gym to find a workout buddy near you — for example a workout partner in London or Dubai.",
      },
    ],
    metaTitle: "Find a Workout Partner Near You",
    metaDescription:
      "Find a workout partner or workout buddy near you. Fitacle matches you by training style, experience, schedule, and location so you never skip a session.",
    ogTitle: "Find a Workout Partner Near You | Fitacle",
    ogDescription:
      "Match with a workout partner near you by training style, schedule, and location. Never skip a session again with Fitacle.",
    keywords: [
      "find a workout partner",
      "workout partner near me",
      "workout buddy near me",
      "gym workout partner",
      "training partner",
    ],
    priority: 0.9,
  },
  {
    slug: "find-gym-partner",
    noun: "gym partner",
    nounTitle: "Gym Partner",
    ctaNoun: "Gym Partner",
    badge: "Find Your Gym Buddy",
    h1: "Find a Gym Partner Near You",
    intro:
      "Lift with someone who spots you. Fitacle helps you find a gym partner or gym buddy at your gym and in your city, matched by goals, experience level, and the times you actually train.",
    highlights: [
      {
        title: "Same goals & level",
        body: "Pair with lifters at your experience level chasing strength, size, or conditioning.",
      },
      {
        title: "At your gym",
        body: "Find a gym buddy who trains at your gym or nearby, so spotting and sessions just work.",
      },
      {
        title: "Same gym hours",
        body: "Match by usual gym time so you are on the floor together, not passing in the door.",
      },
      ACCOUNTABILITY,
    ],
    about: {
      heading: "Why you need a gym partner",
      paragraphs: [
        "A gym partner means safer heavy sets, sharper focus, and a reason to hit every scheduled session. Training gets more fun and more productive when someone is racking up beside you.",
        "Fitacle connects you with gym buddies using real profile data — gym name, city, experience, and preferred hours — so the match is someone you can genuinely train with.",
      ],
    },
    faqs: [
      {
        question: "How do I find a gym partner near me?",
        answer:
          "Create your free Fitacle profile, add your gym and usual training times, and Fitacle will surface gym partners who train at or near your gym.",
      },
      {
        question: "Can I find a gym buddy at my specific gym?",
        answer:
          "Yes. The partner directory lets you filter by gym name and city, so you can find a gym buddy who already trains where you do.",
      },
      {
        question: "Is finding a gym partner free on Fitacle?",
        answer: "Yes, it is free to create a profile and find a gym partner near you.",
      },
      {
        question: "What if there is no gym partner in my area yet?",
        answer:
          "Completing your profile makes you discoverable to others searching in your area, so more matches appear as the community near you grows.",
      },
    ],
    metaTitle: "Find a Gym Partner Near You",
    metaDescription:
      "Find a gym partner or gym buddy near you. Fitacle matches lifters at your gym by goals, experience level, and training times so you always have a spotter.",
    ogTitle: "Find a Gym Partner Near You | Fitacle",
    ogDescription:
      "Find a gym buddy at your gym matched by goals, level, and training hours. Train harder and safer with Fitacle.",
    keywords: [
      "find a gym partner",
      "gym partner near me",
      "gym buddy near me",
      "find a gym buddy",
      "lifting partner",
    ],
    priority: 0.9,
  },
  {
    slug: "find-running-partner",
    noun: "running partner",
    nounTitle: "Running Partner",
    ctaNoun: "Running Partner",
    badge: "Find Your Running Buddy",
    h1: "Find a Running Partner Near You",
    intro:
      "Log the miles together. Fitacle matches you with a running partner or running buddy near you by pace, distance goals, preferred routes, and the times you like to run.",
    highlights: [
      {
        title: "Similar pace & goals",
        body: "Find runners training for the same distances — 5K, 10K, half, or marathon — at a compatible pace.",
      },
      {
        title: "Near your routes",
        body: "Match with a running buddy in your city so you share parks, tracks, and morning loops.",
      },
      {
        title: "Same run times",
        body: "Sync early mornings or evening runs so your schedules actually line up.",
      },
      ACCOUNTABILITY,
    ],
    about: {
      heading: "Why run with a partner?",
      paragraphs: [
        "A running partner makes early alarms easier and long runs shorter. Someone matching your pace keeps you honest on tempo days and safe on quiet routes.",
        "Fitacle uses your real profile — activity, city, and preferred times — to connect you with runners nearby, so your next run has company.",
      ],
    },
    faqs: [
      {
        question: "How do I find a running partner near me?",
        answer:
          "Create a free Fitacle profile, set your activity to running and add your city and preferred times. Fitacle then surfaces running partners near you.",
      },
      {
        question: "Can I match with a running buddy at my pace?",
        answer:
          "Yes. Add your goals and experience level so you match with running partners training at a similar pace and distance.",
      },
      {
        question: "Is Fitacle free for finding a running partner?",
        answer: "Yes. Finding a running buddy near you is free.",
      },
      {
        question: "Can I find a running partner in my city?",
        answer:
          "Yes — filter the directory by city to find a running partner near you, whether that is Doha, London, or your local park loop.",
      },
    ],
    metaTitle: "Find a Running Partner Near You",
    metaDescription:
      "Find a running partner or running buddy near you. Fitacle matches runners by pace, distance goals, routes, and schedule so you never run alone.",
    ogTitle: "Find a Running Partner Near You | Fitacle",
    ogDescription:
      "Match with a running buddy near you by pace, goals, and schedule. Log the miles together with Fitacle.",
    keywords: [
      "find a running partner",
      "running partner near me",
      "running buddy near me",
      "find a running buddy",
      "jogging partner",
    ],
    priority: 0.8,
  },
  {
    slug: "find-walking-partner",
    noun: "walking partner",
    nounTitle: "Walking Partner",
    ctaNoun: "Walking Partner",
    badge: "Find Your Walking Buddy",
    h1: "Find a Walking Partner Near You",
    intro:
      "Get your steps in with company. Fitacle helps you find a walking partner or walking buddy near you — matched by neighborhood, pace, and the times you like to head out.",
    highlights: [
      {
        title: "Comfortable pace",
        body: "Match with people who want the same easy, brisk, or power-walking pace as you.",
      },
      {
        title: "In your neighborhood",
        body: "Find a walking buddy nearby so your daily walk is easy to keep up.",
      },
      {
        title: "Your time of day",
        body: "Sync morning, lunch, or evening walks so it fits naturally into your routine.",
      },
      ACCOUNTABILITY,
    ],
    about: {
      heading: "Why walk with a partner?",
      paragraphs: [
        "Walking is the most sustainable habit in fitness, and a walking partner makes it stick. Good conversation makes the steps fly by and turns a chore into the best part of your day.",
        "Fitacle matches you with walking buddies nearby using your real profile data, so your daily walk always has good company.",
      ],
    },
    faqs: [
      {
        question: "How do I find a walking partner near me?",
        answer:
          "Set up a free Fitacle profile, choose walking as your activity, and add your location and preferred times. Fitacle then shows walking partners near you.",
      },
      {
        question: "Is a walking buddy good for staying active?",
        answer:
          "Yes. A walking partner adds accountability and consistency, which is exactly what makes daily walking a lasting habit.",
      },
      {
        question: "Is Fitacle free to find a walking partner?",
        answer: "Yes, finding a walking buddy near you on Fitacle is free.",
      },
      {
        question: "Can I find a walking partner in my area?",
        answer:
          "Yes. Filter by city to find a walking partner near you and arrange walks in your own neighborhood.",
      },
    ],
    metaTitle: "Find a Walking Partner Near You",
    metaDescription:
      "Find a walking partner or walking buddy near you. Fitacle matches you by neighborhood, pace, and schedule so your daily walk always has company.",
    ogTitle: "Find a Walking Partner Near You | Fitacle",
    ogDescription:
      "Match with a walking buddy near you by neighborhood, pace, and schedule. Stay active together with Fitacle.",
    keywords: [
      "find a walking partner",
      "walking partner near me",
      "walking buddy near me",
      "find a walking buddy",
      "daily walk partner",
    ],
    priority: 0.8,
  },
  {
    slug: "find-training-partner",
    noun: "training partner",
    nounTitle: "Training Partner",
    ctaNoun: "Training Partner",
    badge: "Find Your Training Partner",
    h1: "Find a Training Partner Near You",
    intro:
      "Level up with the right training partner. Whether you lift, run, do CrossFit, or box, Fitacle matches you with a training partner near you by discipline, experience, schedule, and location.",
    highlights: [
      {
        title: "Same discipline",
        body: "Match with partners in your sport — strength, CrossFit, boxing, calisthenics, and more.",
      },
      {
        title: "Near your location",
        body: "Find a training partner in your city and at your gym so working out together is realistic.",
      },
      {
        title: "Compatible schedule",
        body: "Filter by preferred times so your training sessions actually align.",
      },
      ACCOUNTABILITY,
    ],
    about: {
      heading: "Why a training partner matters",
      paragraphs: [
        "A great training partner sharpens your technique, pushes your limits, and makes hard sessions repeatable. Elite athletes rarely train alone — and you do not have to either.",
        "Fitacle connects you with training partners using real profile data — discipline, experience level, city, and times — so the match supports your specific goals.",
      ],
    },
    faqs: [
      {
        question: "How do I find a training partner near me?",
        answer:
          "Create a free Fitacle profile with your discipline, experience level, schedule, and location. Fitacle then surfaces compatible training partners near you.",
      },
      {
        question: "Can I find a training partner for my specific sport?",
        answer:
          "Yes. Set your activity and goals so you match with training partners in the same discipline — from strength and CrossFit to boxing and calisthenics.",
      },
      {
        question: "Is Fitacle free for finding a training partner?",
        answer: "Yes. Finding a training partner near you is free.",
      },
      {
        question: "Can I find a training partner in my city?",
        answer:
          "Yes. Use the city and gym filters to find a training partner near you, wherever you train.",
      },
    ],
    metaTitle: "Find a Training Partner Near You",
    metaDescription:
      "Find a training partner near you for any discipline. Fitacle matches you by sport, experience, schedule, and location so you train harder together.",
    ogTitle: "Find a Training Partner Near You | Fitacle",
    ogDescription:
      "Match with a training partner near you by discipline, experience, and schedule. Train harder together with Fitacle.",
    keywords: [
      "find a training partner",
      "training partner near me",
      "exercise partner near me",
      "sports training partner",
      "workout partner",
    ],
    priority: 0.8,
  },
]

export function getPartnerVariant(slug: string): PartnerVariant | undefined {
  return PARTNER_VARIANTS.find((v) => v.slug === slug)
}

// Build Next.js metadata for a variant. Canonical always points to the clean
// path (no query params) so location-intent URLs never create duplicates.
export function buildPartnerMetadata(variant: PartnerVariant) {
  const pageUrl = `${SITE_ORIGIN}/${variant.slug}`
  return {
    title: variant.metaTitle,
    description: variant.metaDescription,
    keywords: variant.keywords,
    alternates: { canonical: `/${variant.slug}` },
    openGraph: {
      title: variant.ogTitle,
      description: variant.ogDescription,
      url: pageUrl,
      siteName: "Fitacle",
      type: "website" as const,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: variant.ogTitle,
      description: variant.ogDescription,
    },
    robots: { index: true, follow: true },
  }
}

// Build Schema.org JSON-LD (WebPage + Breadcrumbs + Service + FAQPage) for a variant.
export function buildPartnerJsonLd(variant: PartnerVariant) {
  const pageUrl = `${SITE_ORIGIN}/${variant.slug}`
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: variant.metaTitle,
        description: variant.metaDescription,
        isPartOf: { "@type": "WebSite", name: "Fitacle", url: SITE_ORIGIN },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
          { "@type": "ListItem", position: 2, name: `Find a ${variant.nounTitle}`, item: pageUrl },
        ],
      },
      {
        "@type": "Service",
        serviceType: `${variant.nounTitle} matching`,
        name: `Find a ${variant.nounTitle}`,
        url: pageUrl,
        areaServed: "Worldwide",
        provider: { "@type": "Organization", name: "Fitacle", url: SITE_ORIGIN },
        description: variant.metaDescription,
      },
      {
        "@type": "FAQPage",
        mainEntity: variant.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  }
}
