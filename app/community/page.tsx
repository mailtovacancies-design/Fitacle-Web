import type { Metadata } from "next"
import { CommunityTopbar } from "@/components/community/community-topbar"
import { CommunityBottomNav } from "@/components/community/community-bottom-nav"
import { CommunityHub } from "@/components/community/community-hub"

export const metadata: Metadata = {
  title: "Community Hub | Fitacle",
  description:
    "Ask questions, share experiences, request features, and celebrate wins with the Fitacle community.",
}

export default function CommunityPage() {
  return (
    <main className="relative min-h-[100dvh] bg-background">
      <CommunityTopbar />

      <div className="pt-[72px]">
        {/* Intro */}
        <section className="mx-auto max-w-2xl px-4 sm:px-6 pt-8 pb-2 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance">
            The Fitacle Community
          </h1>
          <p className="mt-2 text-muted-foreground text-pretty">
            Real people, real progress. Ask, share, and grow together — official answers included.
          </p>
        </section>

        <div className="mt-4">
          <CommunityHub />
        </div>
      </div>

      <CommunityBottomNav />
    </main>
  )
}
