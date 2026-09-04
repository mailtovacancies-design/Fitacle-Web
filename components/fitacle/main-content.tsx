"use client"

import { useState } from "react"
import { Navbar } from "@/components/fitacle/navbar"
import { Hero } from "@/components/fitacle/hero"
import { EmotionalHook } from "@/components/fitacle/emotional-hook"
import { BodyAnalyzer } from "@/components/fitacle/body-analyzer"
import { DailyPlan } from "@/components/fitacle/daily-plan"
import { Transformation } from "@/components/fitacle/transformation"
import { MembersShowcase } from "@/components/fitacle/members-showcase"
import { FitacleScore } from "@/components/fitacle/fitacle-score"
// TEMPORARY PREVIEW: surfaces the previously hidden/disabled FinalCTA section for review only. Remove this import to revert.
import { FinalCTA } from "@/components/fitacle/final-cta"

import { Footer } from "@/components/fitacle/footer"
import { AIChatbot } from "@/components/fitacle/ai-chatbot"

export function MainContent() {
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <main className="relative overflow-hidden">
      <Navbar onSignIn={() => setShowAuthModal(true)} />
      <Hero showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal} />
      <BodyAnalyzer />
      <DailyPlan onSignUpClick={() => setShowAuthModal(true)} />
      <Transformation />
      <MembersShowcase />
      <FitacleScore onSignUpClick={() => setShowAuthModal(true)} />
      <EmotionalHook />
      {/* TEMPORARY PREVIEW: previously hidden/disabled FinalCTA section, shown for review only. Remove this line to revert. */}
      <FinalCTA onStartTransformation={() => setShowAuthModal(true)} />
      <Footer />
      <AIChatbot />
    </main>
  )
}
