"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Lock, User as UserIcon, Loader2, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface CommunityAuthDialogProps {
  open: boolean
  onClose: () => void
  onSignedIn?: () => void
}

type Mode = "signin" | "signup"

export function CommunityAuthDialog({ open, onClose, onSignedIn }: CommunityAuthDialogProps) {
  const [mode, setMode] = useState<Mode>("signin")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkEmail, setCheckEmail] = useState(false)

  const reset = () => {
    setError(null)
    setCheckEmail(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const supabase = createClient()
    if (!supabase) {
      setError("Sign in is not available right now. Please try again later.")
      return
    }

    if (!email.trim() || !password) {
      setError("Please enter your email and password.")
      return
    }
    if (mode === "signup" && password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setLoading(true)
    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo:
              process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
            data: { full_name: fullName.trim() || undefined },
          },
        })
        if (signUpError) throw signUpError
        // If email confirmation is required there is no session yet.
        const { data } = await supabase.auth.getUser()
        if (data.user) {
          onSignedIn?.()
          onClose()
        } else {
          setCheckEmail(true)
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (signInError) throw signInError
        onSignedIn?.()
        onClose()
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={mode === "signin" ? "Sign in" : "Create account"}
        >
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full text-muted-foreground hover:bg-accent transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="p-6 sm:p-8">
              {checkEmail ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="text-emerald-600" size={28} />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">Check your email</h2>
                  <p className="text-sm text-muted-foreground mb-6 text-pretty">
                    {"We sent a confirmation link to "}
                    <span className="font-medium text-foreground">{email}</span>
                    {". Confirm it, then sign in to start posting."}
                  </p>
                  <button
                    onClick={() => {
                      setMode("signin")
                      reset()
                    }}
                    className="w-full py-3 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-colors"
                  >
                    Back to sign in
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      {mode === "signin" ? "Welcome back" : "Join the community"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {mode === "signin"
                        ? "Sign in to post, comment, and connect."
                        : "Create a free account to share your journey."}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === "signup" && (
                      <div>
                        <label htmlFor="auth-name" className="sr-only">
                          Full name
                        </label>
                        <div className="relative">
                          <UserIcon
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                          />
                          <input
                            id="auth-name"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Full name (optional)"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label htmlFor="auth-email" className="sr-only">
                        Email
                      </label>
                      <div className="relative">
                        <Mail
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                          id="auth-email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email address"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="auth-password" className="sr-only">
                        Password
                      </label>
                      <div className="relative">
                        <Lock
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                          id="auth-password"
                          type="password"
                          autoComplete={mode === "signin" ? "current-password" : "new-password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition"
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-60"
                    >
                      {loading && <Loader2 size={16} className="animate-spin" />}
                      {mode === "signin" ? "Sign In" : "Create Account"}
                    </button>
                  </form>

                  <p className="text-sm text-muted-foreground text-center mt-6">
                    {mode === "signin" ? "New to Fitacle?" : "Already have an account?"}{" "}
                    <button
                      onClick={() => {
                        setMode(mode === "signin" ? "signup" : "signin")
                        reset()
                      }}
                      className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      {mode === "signin" ? "Create one" : "Sign in"}
                    </button>
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
