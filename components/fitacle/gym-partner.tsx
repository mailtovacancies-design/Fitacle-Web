"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, MapPin, Instagram, Sparkles, UserPlus, Heart, MessageCircle, Dumbbell, Star, Clock } from "lucide-react"

const mockPartners = [
  { id: 1, username: "alex_fitness", location: "Los Angeles, CA", avatar: "A", focus: "Strength Training", level: "Advanced", rating: 4.9, schedule: "Morning" },
  { id: 2, username: "sarah_lifts", location: "New York, NY", avatar: "S", focus: "CrossFit", level: "Intermediate", rating: 4.8, schedule: "Evening" },
  { id: 3, username: "mike_gains", location: "Miami, FL", avatar: "M", focus: "Bodybuilding", level: "Advanced", rating: 4.7, schedule: "Flexible" },
  { id: 4, username: "emma_fit", location: "Chicago, IL", avatar: "E", focus: "HIIT", level: "Beginner", rating: 4.9, schedule: "Afternoon" },
  { id: 5, username: "jordan_power", location: "Seattle, WA", avatar: "J", focus: "Powerlifting", level: "Intermediate", rating: 4.6, schedule: "Morning" },
  { id: 6, username: "taylor_cardio", location: "Austin, TX", avatar: "T", focus: "Running", level: "Advanced", rating: 4.8, schedule: "Evening" },
]

export function GymPartner() {
  const [location, setLocation] = useState("")
  const [instagram, setInstagram] = useState("")
  const [joined, setJoined] = useState(false)
  const [partners] = useState(mockPartners)

  const handleJoin = () => {
    if (location && instagram) {
      setJoined(true)
    }
  }

  return (
    <section id="partner" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/30 via-transparent to-transparent" />

      <div className="mx-auto max-w-7xl px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-border text-sm font-medium text-foreground mb-6">
            <Users size={16} className="text-primary" />
            Gym Partner Network
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-foreground">Find Your Perfect</span>
            <br />
            <span className="text-muted-foreground">Gym Partner</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Connect with like-minded fitness enthusiasts in your area. 
            Our AI matches you based on goals, schedule, and training style.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Join Form */}
          <motion.div
            initial={{ opacity: 0, x: -40, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-3xl border border-border p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-foreground">
                <UserPlus size={24} className="text-background" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Join the Network</h3>
                <p className="text-sm text-muted-foreground">Connect with fitness partners nearby</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!joined ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Your Location</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter your city or zip code"
                        className="w-full py-3.5 pl-12 pr-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Instagram Username</label>
                    <div className="relative">
                      <Instagram size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="@yourusername"
                        className="w-full py-3.5 pl-12 pr-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleJoin}
                    disabled={!location || !instagram}
                    className="w-full py-4 bg-foreground text-background rounded-xl font-semibold text-lg flex items-center justify-center gap-3 hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles size={20} />
                    Join Network
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 rounded-full bg-primary mx-auto mb-6 flex items-center justify-center">
                    <Heart size={36} className="text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Welcome to the Network!</h3>
                  <p className="text-muted-foreground mb-6">
                    You&apos;re now connected with fitness partners in {location}
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Instagram size={16} />@{instagram}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats */}
            <div className="mt-8 pt-8 border-t border-border grid grid-cols-3 gap-4">
              {[
                { icon: Users, label: "Members", value: "50K+" },
                { icon: MapPin, label: "Cities", value: "100+" },
                { icon: MessageCircle, label: "Active", value: "24/7" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <stat.icon size={20} className="text-primary mx-auto mb-2" />
                  <div className="text-lg font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Partner Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Partners Near You</h3>
              <span className="text-sm text-muted-foreground">{partners.length} active</span>
            </div>

            <div className="grid gap-3">
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="bg-card rounded-2xl border border-border p-4 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-lg font-bold text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      {partner.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">@{partner.username}</span>
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {partner.level}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin size={12} />
                          {partner.location}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Dumbbell size={12} />
                          {partner.focus}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock size={12} />
                          {partner.schedule}
                        </span>
                        <span className="text-sm flex items-center gap-1 text-amber-600">
                          <Star size={12} className="fill-current" />
                          {partner.rating}
                        </span>
                      </div>
                    </div>
                    <button className="p-2.5 rounded-xl bg-accent hover:bg-primary hover:text-primary-foreground transition-all duration-300 opacity-0 group-hover:opacity-100">
                      <MessageCircle size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full py-3.5 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300 text-sm font-medium">
              View All Partners
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
