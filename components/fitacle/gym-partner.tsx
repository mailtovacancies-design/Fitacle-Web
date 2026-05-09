"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, MapPin, Instagram, Sparkles, UserPlus, Heart, MessageCircle, Dumbbell, Star, Clock, CheckCircle2, Building2, Filter, Search, X, Loader2, Scale, Ruler, Activity, AlertCircle, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface FitnessPartner {
  id: string
  user_id: string
  full_name: string
  instagram_id: string
  age: number | null
  country: string
  city: string
  gym_name: string
  usual_gym_time: string
  weight_kg: number | null
  height_cm: number | null
  body_fat_percentage: number | null
  fitness_focus: string | null
  experience_level: string
  schedule_preference: string
  is_visible: boolean
  is_trainer: boolean
  avatar_initial: string | null
  created_at: string
}

const experienceLevels = ["Beginner", "Intermediate", "Advanced", "Pro"]
const fitnessFocusOptions = ["Strength Training", "Bodybuilding", "CrossFit", "HIIT", "Running", "Cycling", "Powerlifting", "Calisthenics", "Yoga", "Swimming", "Boxing", "Martial Arts", "Other"]
const scheduleOptions = ["Morning", "Afternoon", "Evening", "Night", "Flexible"]
const gymTimeOptions = ["5-7 AM", "7-9 AM", "9-11 AM", "11 AM-1 PM", "1-3 PM", "3-5 PM", "5-7 PM", "7-9 PM", "9-11 PM", "Flexible"]

export function GymPartner() {
  const [user, setUser] = useState<User | null>(null)
  const [partners, setPartners] = useState<FitnessPartner[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)
  const [showSignupPrompt, setShowSignupPrompt] = useState(false)
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    instagram_id: "",
    age: "",
    country: "",
    city: "",
    gym_name: "",
    usual_gym_time: "Flexible",
    weight_kg: "",
    height_cm: "",
    body_fat_percentage: "",
    fitness_focus: "Strength Training",
    experience_level: "Beginner",
    schedule_preference: "Flexible",
    is_visible: true,
    is_trainer: false
  })
  const [showTrainerNote, setShowTrainerNote] = useState(false)
  
  // Filter state
  const [filters, setFilters] = useState({
    country: "",
    city: "",
    gym_name: "",
    experience_level: "",
    fitness_focus: "",
    schedule_preference: ""
  })

  // Check user and load partners
  useEffect(() => {
    const checkUserAndLoadData = async () => {
      try {
        const supabase = createClient()
        if (!supabase) {
          setLoading(false)
          return
        }
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (user) {
          // Check if user has a profile
          const { data: profile } = await supabase
            .from("fitness_partners")
            .select("*")
            .eq("user_id", user.id)
            .single()
          
          if (profile) {
            setHasProfile(true)
            setFormData({
              full_name: profile.full_name || "",
              instagram_id: profile.instagram_id || "",
              country: profile.country || "",
              city: profile.city || "",
              gym_name: profile.gym_name || "",
              usual_gym_time: profile.usual_gym_time || "Flexible",
              weight_kg: profile.weight_kg?.toString() || "",
              height_cm: profile.height_cm?.toString() || "",
              body_fat_percentage: profile.body_fat_percentage?.toString() || "",
              fitness_focus: profile.fitness_focus || "Strength Training",
              experience_level: profile.experience_level || "Beginner",
              schedule_preference: profile.schedule_preference || "Flexible",
              is_visible: profile.is_visible
            })
          }
        }
        
        // Load all visible partners
        await loadPartners()
      } catch {
        // Supabase not configured
      } finally {
        setLoading(false)
      }
    }
    
    checkUserAndLoadData()
  }, [])

  const loadPartners = async () => {
    try {
      const supabase = createClient()
      if (!supabase) return
      
      let query = supabase
        .from("fitness_partners")
        .select("*")
        .eq("is_visible", true)
        .order("created_at", { ascending: false })
      
      // Apply filters
      if (filters.country) query = query.ilike("country", `%${filters.country}%`)
      if (filters.city) query = query.ilike("city", `%${filters.city}%`)
      if (filters.gym_name) query = query.ilike("gym_name", `%${filters.gym_name}%`)
      if (filters.experience_level) query = query.eq("experience_level", filters.experience_level)
      if (filters.fitness_focus) query = query.eq("fitness_focus", filters.fitness_focus)
      if (filters.schedule_preference) query = query.eq("schedule_preference", filters.schedule_preference)
      
      const { data, error } = await query.limit(20)
      
      if (error) throw error
      setPartners(data || [])
    } catch {
      // Error loading partners
    }
  }

  const handleJoinClick = () => {
    if (!user) {
      setShowSignupPrompt(true)
    } else if (!hasProfile) {
      setShowProfileForm(true)
    }
  }

  // Validation function
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    // Required fields validation
    if (!formData.full_name.trim() || formData.full_name.trim().length < 2) {
      errors.full_name = "Please enter your full name (min 2 characters)"
    }
    
    if (!formData.instagram_id.trim() || formData.instagram_id.trim().length < 2) {
      errors.instagram_id = "Please enter a valid Instagram username"
    }
    
    // Age validation
    if (formData.age) {
      const age = parseInt(formData.age)
      if (isNaN(age) || age <= 0 || age < 16 || age > 100) {
        errors.age = "Enter realistic age (16-100)"
      }
    }
    
    if (!formData.country.trim() || formData.country.trim().length < 2) {
      errors.country = "Please enter your country"
    }
    
    if (!formData.city.trim() || formData.city.trim().length < 2) {
      errors.city = "Please enter your city"
    }
    
    if (!formData.gym_name.trim() || formData.gym_name.trim().length < 2) {
      errors.gym_name = "Please enter your gym name"
    }
    
    // Numeric validation - no zeros, realistic ranges
    if (formData.weight_kg) {
      const weight = parseFloat(formData.weight_kg)
      if (isNaN(weight) || weight <= 0 || weight < 30 || weight > 300) {
        errors.weight_kg = "Enter realistic weight (30-300 kg)"
      }
    }
    
    if (formData.height_cm) {
      const height = parseFloat(formData.height_cm)
      if (isNaN(height) || height <= 0 || height < 100 || height > 250) {
        errors.height_cm = "Enter realistic height (100-250 cm)"
      }
    }
    
    if (formData.body_fat_percentage) {
      const bodyFat = parseFloat(formData.body_fat_percentage)
      if (isNaN(bodyFat) || bodyFat <= 0 || bodyFat < 3 || bodyFat > 60) {
        errors.body_fat_percentage = "Enter realistic body fat (3-60%)"
      }
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    // Validate form
    if (!validateForm()) {
      setError("Please fix the errors below")
      return
    }
    
    const supabase = createClient()
    if (!supabase) return
    
    setSubmitting(true)
    setError(null)
    setFieldErrors({})
    
    try {
      const profileData = {
        user_id: user.id,
        full_name: formData.full_name.trim(),
        instagram_id: formData.instagram_id.replace("@", "").trim(),
        age: formData.age ? parseInt(formData.age) : null,
        country: formData.country.trim(),
        city: formData.city.trim(),
        gym_name: formData.gym_name.trim(),
        usual_gym_time: formData.usual_gym_time,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
        body_fat_percentage: formData.body_fat_percentage ? parseFloat(formData.body_fat_percentage) : null,
        fitness_focus: formData.fitness_focus,
        experience_level: formData.experience_level,
        schedule_preference: formData.schedule_preference,
        is_visible: formData.is_visible,
        is_trainer: formData.is_trainer,
        avatar_initial: formData.full_name.trim().charAt(0).toUpperCase()
      }
      
      if (hasProfile) {
        // Update existing profile
        const { error } = await supabase
          .from("fitness_partners")
          .update(profileData)
          .eq("user_id", user.id)
        
        if (error) throw error
        setSuccess("Profile updated successfully!")
      } else {
        // Insert new profile
        const { error } = await supabase
          .from("fitness_partners")
          .insert(profileData)
        
        if (error) throw error
        setHasProfile(true)
        setSuccess("Welcome to the Fitness Partner Network!")
      }
      
      setShowProfileForm(false)
      await loadPartners()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile")
    } finally {
      setSubmitting(false)
    }
  }

  const applyFilters = () => {
    loadPartners()
    setShowFilters(false)
  }

  const clearFilters = () => {
    setFilters({
      country: "",
      city: "",
      gym_name: "",
      experience_level: "",
      fitness_focus: "",
      schedule_preference: ""
    })
    loadPartners()
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
            Accountability Network
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-foreground">Never Train</span>
            <br />
            <span className="text-muted-foreground">Alone Again.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-4 text-pretty">
            Fitness is not a solo journey. Consistency is built through people.
          </p>
          <p className="text-sm text-muted-foreground/70 max-w-2xl mx-auto text-pretty">
            Find accountability partners based on goals, schedule, energy level, training style, and location. You don&apos;t quit when someone is waiting for you.
          </p>
        </motion.div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 max-w-2xl mx-auto"
            >
              <CheckCircle2 className="text-emerald-500" size={20} />
              <span className="text-emerald-700 text-sm">{success}</span>
              <button onClick={() => setSuccess(null)} className="ml-auto text-emerald-500 hover:text-emerald-700">
                <X size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Join Form */}
          <motion.div
            initial={{ opacity: 0, x: -40, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="bg-card rounded-2xl sm:rounded-3xl border border-border p-5 sm:p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-foreground">
                <UserPlus size={20} className="text-background sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground">Join the Network</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Connect with fitness partners nearby</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-12"
                >
                  <Loader2 className="animate-spin text-muted-foreground" size={32} />
                </motion.div>
              ) : !user ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-accent mx-auto mb-4 flex items-center justify-center">
                    <Users size={28} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Sign Up to Join</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Create an account to connect with fitness partners and share your profile
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const heroSection = document.getElementById("get-started")
                      heroSection?.scrollIntoView({ behavior: "smooth" })
                    }}
                    className="px-8 py-3 bg-foreground text-background rounded-xl font-semibold flex items-center justify-center gap-2 mx-auto hover:bg-foreground/90 transition-all"
                  >
                    <Sparkles size={18} />
                    Get Started
                  </motion.button>
                </motion.div>
              ) : hasProfile ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {formData.full_name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">Welcome, {formData.full_name}!</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Your profile is {formData.is_visible ? "visible" : "hidden"} to other members
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <Instagram size={16} className="text-pink-500" />
                    <span className="text-sm text-foreground">@{formData.instagram_id}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowProfileForm(true)}
                    className="px-6 py-2.5 bg-accent text-foreground rounded-xl font-medium text-sm hover:bg-accent/80 transition-all"
                  >
                    Edit Profile
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <UserPlus size={28} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Complete Your Profile</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Add your details to connect with fitness partners nearby
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowProfileForm(true)}
                    className="px-8 py-3 bg-foreground text-background rounded-xl font-semibold flex items-center justify-center gap-2 mx-auto hover:bg-foreground/90 transition-all"
                  >
                    <Sparkles size={18} />
                    Create Profile
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats */}
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border grid grid-cols-3 gap-2 sm:gap-4">
              {[
                { icon: Users, label: "Members", value: partners.length > 0 ? `${partners.length}+` : "Join!" },
                { icon: MapPin, label: "Cities", value: "100+" },
                { icon: MessageCircle, label: "Active", value: "24/7" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <stat.icon size={18} className="text-primary mx-auto mb-1.5 sm:mb-2 sm:w-5 sm:h-5" />
                  <div className="text-base sm:text-lg font-bold text-foreground">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</div>
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
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{partners.length} active</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(true)}
                  className="p-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
                >
                  <Filter size={16} className="text-foreground" />
                </motion.button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-muted-foreground" size={32} />
              </div>
            ) : partners.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-2xl border border-border">
                <Users size={40} className="text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-2">No partners found</h4>
                <p className="text-sm text-muted-foreground mb-4">Be the first to join or adjust your filters</p>
                <button onClick={clearFilters} className="text-sm text-primary hover:underline">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                {/* Sort trainers to the top */}
                {[...partners].sort((a, b) => (b.is_trainer ? 1 : 0) - (a.is_trainer ? 1 : 0)).map((partner, index) => (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className={`relative bg-card rounded-xl sm:rounded-2xl border p-3 sm:p-4 hover:shadow-lg transition-all duration-300 group cursor-pointer ${
                      partner.is_trainer 
                        ? "border-amber-500/50 hover:border-amber-500 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent" 
                        : "border-emerald-500/30 hover:border-emerald-500/50 bg-gradient-to-br from-emerald-500/5 to-transparent"
                    }`}
                  >
                    {/* Trainer or Verified badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                      className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg ${
                        partner.is_trainer 
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" 
                          : "bg-emerald-500 text-white"
                      }`}
                    >
                      {partner.is_trainer ? (
                        <>
                          <Star size={10} />
                          Fitacle Trainer
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={10} />
                          Verified
                        </>
                      )}
                    </motion.div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 sm:block">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-base sm:text-lg font-bold transition-colors duration-300 shrink-0 ${
                          partner.is_trainer 
                            ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-700 group-hover:from-amber-500 group-hover:to-orange-500 group-hover:text-white" 
                            : "bg-emerald-500/20 text-emerald-700 group-hover:bg-emerald-500 group-hover:text-white"
                        }`}>
                          {partner.avatar_initial || partner.full_name.charAt(0).toUpperCase()}
                        </div>
                        
                        <div className="sm:hidden flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <a 
                              href={`https://instagram.com/${partner.instagram_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-sm text-foreground hover:text-primary transition-colors flex items-center gap-1"
                            >
                              <Instagram size={12} className="text-pink-500" />
                              @{partner.instagram_id}
                            </a>
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-700">
                              {partner.experience_level}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{partner.full_name}</p>
                        </div>
                        
                        <a 
                          href={`https://instagram.com/${partner.instagram_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sm:hidden p-2 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white shrink-0"
                        >
                          <Instagram size={16} />
                        </a>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="hidden sm:flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">{partner.full_name}</span>
                          <a 
                            href={`https://instagram.com/${partner.instagram_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                          >
                            <Instagram size={14} className="text-pink-500" />
                            @{partner.instagram_id}
                          </a>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-700">
                            {partner.experience_level}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                          <span className="text-[11px] sm:text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin size={10} className="sm:w-3 sm:h-3 shrink-0" />
                            <span className="truncate">{partner.city}, {partner.country}</span>
                          </span>
                          <span className="text-[11px] sm:text-sm text-muted-foreground flex items-center gap-1">
                            <Building2 size={10} className="sm:w-3 sm:h-3 shrink-0" />
                            <span className="truncate">{partner.gym_name}</span>
                          </span>
                          <span className="text-[11px] sm:text-sm text-muted-foreground flex items-center gap-1">
                            <Dumbbell size={10} className="sm:w-3 sm:h-3 shrink-0" />
                            <span className="truncate">{partner.fitness_focus}</span>
                          </span>
                          <span className="text-[11px] sm:text-sm text-muted-foreground flex items-center gap-1">
                            <Clock size={10} className="sm:w-3 sm:h-3 shrink-0" />
                            {partner.usual_gym_time}
                          </span>
                        </div>
                        
                        {/* Note: Body stats (weight, height, age, body fat) are kept private and not displayed publicly */}
                      </div>
                      
                      <a 
                        href={`https://instagram.com/${partner.instagram_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:block p-2.5 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <Instagram size={18} />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <button className="w-full py-3.5 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300 text-sm font-medium">
              View All Partners
            </button>
          </motion.div>
        </div>
      </div>

      {/* Profile Form Modal */}
      <AnimatePresence>
        {showProfileForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm overflow-y-auto"
            onClick={() => setShowProfileForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl overflow-hidden my-8"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">
                    {hasProfile ? "Edit Your Profile" : "Create Your Profile"}
                  </h2>
                  <button onClick={() => setShowProfileForm(false)} className="p-2 hover:bg-accent rounded-lg transition-colors">
                    <X size={20} className="text-muted-foreground" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmitProfile} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => {
                          setFormData({ ...formData, full_name: e.target.value })
                          if (fieldErrors.full_name) setFieldErrors({ ...fieldErrors, full_name: "" })
                        }}
                        placeholder="Nithin Francis"
                        className={`w-full px-3 py-2.5 bg-input border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${fieldErrors.full_name ? "border-red-500" : "border-border"}`}
                      />
                      {fieldErrors.full_name && <p className="text-xs text-red-500 mt-1">{fieldErrors.full_name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">Instagram *</label>
                      <div className="relative">
                        <Instagram size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          value={formData.instagram_id}
                          onChange={(e) => {
                            setFormData({ ...formData, instagram_id: e.target.value })
                            if (fieldErrors.instagram_id) setFieldErrors({ ...fieldErrors, instagram_id: "" })
                          }}
                          placeholder="_its_nithin_"
                          className={`w-full pl-9 pr-3 py-2.5 bg-input border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${fieldErrors.instagram_id ? "border-red-500" : "border-border"}`}
                        />
                      </div>
                      {fieldErrors.instagram_id && <p className="text-xs text-red-500 mt-1">{fieldErrors.instagram_id}</p>}
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Age</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formData.age}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '')
                        setFormData({ ...formData, age: val })
                        if (fieldErrors.age) setFieldErrors({ ...fieldErrors, age: "" })
                      }}
                      placeholder="28"
                      className={`w-full px-3 py-2.5 bg-input border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${fieldErrors.age ? "border-red-500" : "border-border"}`}
                    />
                    {fieldErrors.age && <p className="text-xs text-red-500 mt-1">{fieldErrors.age}</p>}
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">Country *</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => {
                          setFormData({ ...formData, country: e.target.value })
                          if (fieldErrors.country) setFieldErrors({ ...fieldErrors, country: "" })
                        }}
                        placeholder="United Kingdom"
                        className={`w-full px-3 py-2.5 bg-input border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${fieldErrors.country ? "border-red-500" : "border-border"}`}
                      />
                      {fieldErrors.country && <p className="text-xs text-red-500 mt-1">{fieldErrors.country}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">City *</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => {
                          setFormData({ ...formData, city: e.target.value })
                          if (fieldErrors.city) setFieldErrors({ ...fieldErrors, city: "" })
                        }}
                        placeholder="Telford"
                        className={`w-full px-3 py-2.5 bg-input border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${fieldErrors.city ? "border-red-500" : "border-border"}`}
                      />
                      {fieldErrors.city && <p className="text-xs text-red-500 mt-1">{fieldErrors.city}</p>}
                    </div>
                  </div>

                  {/* Gym Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">Gym Name *</label>
                      <input
                        type="text"
                        value={formData.gym_name}
                        onChange={(e) => {
                          setFormData({ ...formData, gym_name: e.target.value })
                          if (fieldErrors.gym_name) setFieldErrors({ ...fieldErrors, gym_name: "" })
                        }}
                        placeholder="The Gym Group"
                        className={`w-full px-3 py-2.5 bg-input border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${fieldErrors.gym_name ? "border-red-500" : "border-border"}`}
                      />
                      {fieldErrors.gym_name && <p className="text-xs text-red-500 mt-1">{fieldErrors.gym_name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">Usual Gym Time *</label>
                      <select
                        value={formData.usual_gym_time}
                        onChange={(e) => setFormData({ ...formData, usual_gym_time: e.target.value })}
                        className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                        required
                      >
                        {gymTimeOptions.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Body Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">Weight (kg)</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={formData.weight_kg}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.]/g, '')
                          setFormData({ ...formData, weight_kg: val })
                          if (fieldErrors.weight_kg) setFieldErrors({ ...fieldErrors, weight_kg: "" })
                        }}
                        placeholder="94"
                        className={`w-full px-3 py-2.5 bg-input border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${fieldErrors.weight_kg ? "border-red-500" : "border-border"}`}
                      />
                      {fieldErrors.weight_kg && <p className="text-xs text-red-500 mt-1">{fieldErrors.weight_kg}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">Height (cm)</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={formData.height_cm}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.]/g, '')
                          setFormData({ ...formData, height_cm: val })
                          if (fieldErrors.height_cm) setFieldErrors({ ...fieldErrors, height_cm: "" })
                        }}
                        placeholder="183"
                        className={`w-full px-3 py-2.5 bg-input border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${fieldErrors.height_cm ? "border-red-500" : "border-border"}`}
                      />
                      {fieldErrors.height_cm && <p className="text-xs text-red-500 mt-1">{fieldErrors.height_cm}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">Body Fat %</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={formData.body_fat_percentage}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.]/g, '')
                          setFormData({ ...formData, body_fat_percentage: val })
                          if (fieldErrors.body_fat_percentage) setFieldErrors({ ...fieldErrors, body_fat_percentage: "" })
                        }}
                        placeholder="18"
                        className={`w-full px-3 py-2.5 bg-input border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all ${fieldErrors.body_fat_percentage ? "border-red-500" : "border-border"}`}
                      />
                      {fieldErrors.body_fat_percentage && <p className="text-xs text-red-500 mt-1">{fieldErrors.body_fat_percentage}</p>}
                    </div>
                  </div>

                  {/* Fitness Preferences */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">Fitness Focus</label>
                      <select
                        value={formData.fitness_focus}
                        onChange={(e) => setFormData({ ...formData, fitness_focus: e.target.value })}
                        className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                      >
                        {fitnessFocusOptions.map((focus) => (
                          <option key={focus} value={focus}>{focus}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">Experience Level</label>
                      <select
                        value={formData.experience_level}
                        onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                        className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                      >
                        {experienceLevels.map((level) => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Schedule Preference</label>
                    <select
                      value={formData.schedule_preference}
                      onChange={(e) => setFormData({ ...formData, schedule_preference: e.target.value })}
                      className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                    >
                      {scheduleOptions.map((schedule) => (
                        <option key={schedule} value={schedule}>{schedule}</option>
                      ))}
                    </select>
                  </div>

                  {/* Are you a trainer? */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Star size={18} className={formData.is_trainer ? "text-amber-500" : "text-muted-foreground"} />
                      <div>
                        <p className="text-sm font-medium text-foreground">Are you a certified trainer?</p>
                        <p className="text-xs text-muted-foreground">
                          Get highlighted as a Fitacle Community Trainer
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newValue = !formData.is_trainer
                        setFormData({ ...formData, is_trainer: newValue })
                        if (newValue) setShowTrainerNote(true)
                      }}
                      className={`relative w-12 h-6 rounded-full transition-colors ${formData.is_trainer ? "bg-amber-500" : "bg-muted"}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.is_trainer ? "left-7" : "left-1"}`} />
                    </button>
                  </div>

                  {/* Trainer Verification Note Popup */}
                  <AnimatePresence>
                    {showTrainerNote && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl"
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">Verification Notice</p>
                            <p className="text-xs text-muted-foreground">
                              Fitacle may contact you for verification. You may be asked to provide certification details at a later stage.
                            </p>
                            <button
                              type="button"
                              onClick={() => setShowTrainerNote(false)}
                              className="mt-2 text-xs text-amber-600 hover:text-amber-500 font-medium"
                            >
                              I understand
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Visibility Toggle */}
                  <div className="flex items-center justify-between p-4 bg-accent rounded-xl">
                    <div className="flex items-center gap-3">
                      {formData.is_visible ? <Eye size={18} className="text-emerald-500" /> : <EyeOff size={18} className="text-muted-foreground" />}
                      <div>
                        <p className="text-sm font-medium text-foreground">Profile Visibility</p>
                        <p className="text-xs text-muted-foreground">
                          {formData.is_visible ? "Your profile is visible to others" : "Your profile is hidden"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, is_visible: !formData.is_visible })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${formData.is_visible ? "bg-emerald-500" : "bg-muted"}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.is_visible ? "left-7" : "left-1"}`} />
                    </button>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: submitting ? 1 : 1.01 }}
                    whileTap={{ scale: submitting ? 1 : 0.99 }}
                    className="w-full py-3 bg-foreground text-background rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        {hasProfile ? "Update Profile" : "Create Profile"}
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Filter size={20} />
                    Find Partners
                  </h2>
                  <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-accent rounded-lg transition-colors">
                    <X size={20} className="text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Country</label>
                    <input
                      type="text"
                      value={filters.country}
                      onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                      placeholder="Search by country..."
                      className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">City</label>
                    <input
                      type="text"
                      value={filters.city}
                      onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                      placeholder="Search by city..."
                      className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Gym Name</label>
                    <input
                      type="text"
                      value={filters.gym_name}
                      onChange={(e) => setFilters({ ...filters, gym_name: e.target.value })}
                      placeholder="Search by gym..."
                      className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">Experience</label>
                      <select
                        value={filters.experience_level}
                        onChange={(e) => setFilters({ ...filters, experience_level: e.target.value })}
                        className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                      >
                        <option value="">All levels</option>
                        {experienceLevels.map((level) => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1.5">Focus</label>
                      <select
                        value={filters.fitness_focus}
                        onChange={(e) => setFilters({ ...filters, fitness_focus: e.target.value })}
                        className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                      >
                        <option value="">All focus</option>
                        {fitnessFocusOptions.map((focus) => (
                          <option key={focus} value={focus}>{focus}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Schedule</label>
                    <select
                      value={filters.schedule_preference}
                      onChange={(e) => setFilters({ ...filters, schedule_preference: e.target.value })}
                      className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                    >
                      <option value="">Any schedule</option>
                      {scheduleOptions.map((schedule) => (
                        <option key={schedule} value={schedule}>{schedule}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="flex-1 py-2.5 bg-accent text-foreground rounded-xl font-medium text-sm hover:bg-accent/80 transition-all"
                    >
                      Clear
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={applyFilters}
                      className="flex-1 py-2.5 bg-foreground text-background rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Search size={16} />
                      Apply Filters
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
