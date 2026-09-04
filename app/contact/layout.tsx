import type { Metadata } from "next"

// Metadata-only layout for the client-rendered Contact page. Passes children
// through unchanged — no UI, layout or behavior impact.
export const metadata: Metadata = {
  title: "Contact Fitacle",
  description:
    "Get in touch with the Fitacle team. Questions about finding a fitness partner, AI fitness plans, or your account? We're here to help.",
  alternates: {
    canonical: "/contact",
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
