import { Navbar } from "@/components/fitacle/navbar"
import { Hero } from "@/components/fitacle/hero"
import { BodyAnalyzer } from "@/components/fitacle/body-analyzer"
import { DailyPlan } from "@/components/fitacle/daily-plan"
import { Transformation } from "@/components/fitacle/transformation"
import { GymPartner } from "@/components/fitacle/gym-partner"
import { FitacleScore } from "@/components/fitacle/fitacle-score"
import { Footer } from "@/components/fitacle/footer"

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <Hero />
      <BodyAnalyzer />
      <DailyPlan />
      <Transformation />
      <GymPartner />
      <FitacleScore />
      <Footer />
    </main>
  )
}
