import type { Metadata } from "next"
import { Suspense } from "react"
import { FindPartnerLanding } from "@/components/fitacle/find-partner-landing"
import { buildPartnerJsonLd, buildPartnerMetadata, getPartnerVariant } from "@/lib/partner-pages"

const variant = getPartnerVariant("find-gym-partner")!

export const metadata: Metadata = buildPartnerMetadata(variant)

export default function FindGymPartnerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPartnerJsonLd(variant)) }}
      />
      <Suspense fallback={null}>
        <FindPartnerLanding variant={variant} />
      </Suspense>
    </>
  )
}
