"use client"

import { useState } from "react"
import { Navbar } from "@/components/fitacle/navbar"
import { Hero } from "@/components/fitacle/hero"
import { BodyAnalyzer } from "@/components/fitacle/body-analyzer"
import { DailyPlan } from "@/components/fitacle/daily-plan"
import { Transformation } from "@/components/fitacle/transformation"
import { GymPartner } from "@/components/fitacle/gym-partner"
import { FitacleScore } from "@/components/fitacle/fitacle-score"
import { Footer } from "@/components/fitacle/footer"

export function MainContent() {
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <main className="relative overflow-hidden">
      <Navbar onSignIn={() => setShowAuthModal(true)} />
      <Hero showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal} />
      <BodyAnalyzer />
      <DailyPlan />
      <Transformation />
      <GymPartner />
      <FitacleScore />
      <Footer />
    </main>
  )
}
