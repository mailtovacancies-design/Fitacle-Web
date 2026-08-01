import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import type { ReactNode } from "react"

interface LegalPageProps {
  title: string
  updated: string
  intro?: string
  children: ReactNode
}

export function LegalPage({ title, updated, intro, children }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/fitacle-logo.png"
              alt="Fitacle"
              width={32}
              height={32}
              className="rounded-lg object-contain"
            />
            <span className="text-lg font-bold text-foreground">
              F<span className="text-emerald-600">i</span>tacle
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={15} />
            Back home
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance mb-2">{title}</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {updated}</p>
        {intro && <p className="text-base text-muted-foreground leading-relaxed mb-8 text-pretty">{intro}</p>}
        <div className="legal-prose space-y-8">{children}</div>
      </article>
    </main>
  )
}

interface SectionProps {
  heading: string
  children: ReactNode
}

export function LegalSection({ heading, children }: SectionProps) {
  return (
    <section>
      <h2 className="text-xl font-bold text-foreground mb-3">{heading}</h2>
      <div className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed [&_a]:text-emerald-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">
        {children}
      </div>
    </section>
  )
}
