"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Users, Star, Heart, TrendingUp, Instagram, MessageSquare, ArrowRight } from "lucide-react"

const communityMembers = [
  { name: "Sarah M.", progress: "Lost 12kg in 90 days", badge: "Consistent" },
  { name: "James K.", progress: "200+ workout streak", badge: "Dedicated" },
  { name: "Priya S.", progress: "Complete lifestyle change", badge: "Transformed" },
  { name: "Michael R.", progress: "First marathon completed", badge: "Achiever" },
]

export function Community() {
  return (
    <section className="py-20 sm:py-32 bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.03),transparent_50%)]" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-border text-sm font-medium text-foreground mb-6">
            <Users size={16} className="text-primary" />
            Real Community
          </span>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-foreground">You Are Surrounded by People</span>
            <br />
            <span className="text-muted-foreground">Becoming Better.</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
            Not influencers. Not perfection. Real people improving daily.
          </p>

          <Link
            href="/community"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-semibold rounded-full shadow-md hover:bg-foreground/90 hover:shadow-lg transition-all"
          >
            <MessageSquare size={18} />
            Visit the Community Hub
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Community Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {communityMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-5 sm:p-6 text-center hover:border-foreground/20 transition-colors"
            >
              {/* Avatar */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl sm:text-2xl font-semibold text-foreground">
                  {member.name.charAt(0)}
                </span>
              </div>
              
              {/* Name */}
              <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
              
              {/* Progress */}
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">{member.progress}</p>
              
              {/* Badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-foreground/5 text-xs font-medium text-foreground">
                <Star size={10} className="text-yellow-500" />
                {member.badge}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-2xl sm:text-3xl font-bold text-foreground">10k+</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Active Members</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Heart size={16} className="text-red-500" />
              <span className="text-2xl sm:text-3xl font-bold text-foreground">500k+</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Workouts Logged</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star size={16} className="text-yellow-500" />
              <span className="text-2xl sm:text-3xl font-bold text-foreground">92%</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Success Rate</p>
          </div>
        </motion.div>

        {/* Join the Movement - Instagram Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-orange-500/5 border border-pink-500/10 rounded-3xl p-8 sm:p-12 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 mb-6">
              <Instagram size={28} className="text-white" />
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Join the Movement
            </h3>
            
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Follow @fitacle_official for daily fitness insights, transformation stories, and AI-powered health tips.
            </p>
            
            <motion.a
              href="https://instagram.com/fitacle_official"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <Instagram size={18} />
              Follow on Instagram
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
