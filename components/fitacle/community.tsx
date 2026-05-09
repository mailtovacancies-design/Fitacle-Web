"use client"

import { motion } from "framer-motion"
import { Users, Star, Heart, TrendingUp } from "lucide-react"

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
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-3">
            Not influencers. Not perfection. Real people improving daily.
          </p>
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
      </div>
    </section>
  )
}
