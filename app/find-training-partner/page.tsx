import type { Metadata } from "next"
import { Suspense } from "react"
import { FindPartnerLanding } from "@/components/fitacle/find-partner-landing"
import { buildPartnerJsonLd, buildPartnerMetadata, getPartnerVariant } from "@/lib/partner-pages"

const variant = getPartnerVariant("find-training-partner")!

export const metadata: Metadata = buildPartnerMetadata(variant)

export default function FindTrainingPartnerPage() {
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
