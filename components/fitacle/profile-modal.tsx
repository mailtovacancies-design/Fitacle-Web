"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Instagram, Star, X, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

const experienceLevels = ["Beginner", "Intermediate", "Advanced", "Pro"]
const fitnessFocusOptions = ["Strength Training", "Bodybuilding", "CrossFit", "HIIT", "Running", "Cycling", "Powerlifting", "Calisthenics", "Yoga", "Swimming", "Boxing", "Martial Arts", "Other"]
const scheduleOptions = ["Morning", "Afternoon", "Evening", "Night", "Flexible"]
const gymTimeOptions = ["5-7 AM", "7-9 AM", "9-11 AM", "11 AM-1 PM", "1-3 PM", "3-5 PM", "5-7 PM", "7-9 PM", "9-11 PM", "Flexible"]

interface ProfileModalProps {
  open: boolean
  onClose: () => void
}

export function ProfileModal({ open, onClose }: ProfileModalProps) {
  const [user, setUser] = useState<User | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [, setSuccess] = useState<string | null>(null)
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

  // Check user and load existing profile
  useEffect(() => {
    const checkUserAndLoadData = async () => {
      try {
        const supabase = createClient()
        if (!supabase) return
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
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
              age: profile.age?.toString() || "",
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
              is_visible: profile.is_visible,
              is_trainer: profile.is_trainer || false
            })
          }
        }
      } catch {
        // Supabase not configured
      }
    }

    checkUserAndLoadData()
  }, [])

  // Validation function
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.full_name.trim() || formData.full_name.trim().length < 2) {
      errors.full_name = "Please enter your full name (min 2 characters)"
    }

    if (!formData.instagram_id.trim() || formData.instagram_id.trim().length < 2) {
      errors.instagram_id = "Please enter a valid Instagram username"
    }

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
        const { error } = await supabase
          .from("fitness_partners")
          .update(profileData)
          .eq("user_id", user.id)

        if (error) throw error
        setSuccess("Profile updated successfully!")
      } else {
        const { error } = await supabase
          .from("fitness_partners")
          .insert(profileData)

        if (error) throw error
        setHasProfile(true)
        setSuccess("Welcome to the Fitness Partner Network!")
      }

      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl overflow-hidden my-8"
          >
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  {hasProfile ? "Edit Your Profile" : "Create Your Profile"}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${formData.is_trainer ? "bg-amber-500" : "bg-muted"}`}
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
                    className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${formData.is_visible ? "bg-emerald-500" : "bg-muted"}`}
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
  )
}
