"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Loader2, Lock, Check, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false)
  const [hasSession, setHasSession] = useState(false)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  // On load, establish the recovery session from the URL (PKCE code or hash tokens).
  useEffect(() => {
    const supabase = createClient()
    if (!supabase) {
      setError("Password reset is not available right now.")
      setReady(true)
      return
    }

    const init = async () => {
      try {
        const url = new URL(window.location.href)
        const code = url.searchParams.get("code")
        if (code) {
          await supabase.auth.exchangeCodeForSession(code)
        }
      } catch {
        // If exchange fails, we fall back to checking for an existing session below.
      }

      const { data } = await supabase.auth.getSession()
      setHasSession(!!data.session)
      setReady(true)
    }

    // onAuthStateChange fires PASSWORD_RECOVERY when arriving via the hash flow.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setHasSession(true)
    })

    init()
    return () => sub.subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }

    const supabase = createClient()
    if (!supabase) {
      setError("Password reset is not available right now.")
      return
    }

    setSubmitting(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setSubmitting(false)

    if (updateError) {
      setError(updateError.message)
    } else {
      setDone(true)
      setTimeout(() => {
        window.location.href = "/"
      }, 2500)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-xl p-6 sm:p-8"
      >
        <div className="flex justify-center mb-4">
          <Image
            src="/images/fitacle-logo.png"
            alt="Fitacle"
            width={40}
            height={40}
            className="rounded-lg object-contain"
          />
        </div>

        {done ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <Check className="text-emerald-600" size={28} />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-1">Password updated</h1>
            <p className="text-sm text-muted-foreground">Redirecting you to Fitacle…</p>
          </div>
        ) : !ready ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="animate-spin text-muted-foreground" size={24} />
            <p className="text-sm text-muted-foreground">Verifying your reset link…</p>
          </div>
        ) : !hasSession ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-600" size={28} />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">Link expired or invalid</h1>
            <p className="text-sm text-muted-foreground mb-6 text-pretty">
              This password reset link is no longer valid. Please request a new one from the sign-in screen.
            </p>
            <Link
              href="/"
              className="inline-block w-full py-3 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-colors"
            >
              Back to Fitacle
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-center text-foreground mb-1">Set a new password</h1>
            <p className="text-center text-sm text-muted-foreground mb-6">
              Choose a strong password you don&apos;t use elsewhere.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition"
                />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition"
                />
              </div>

              {error && (
                <p className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                  <AlertCircle size={16} />
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-60"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                Update Password
              </button>
            </form>
          </>
        )}
      </motion.div>
    </main>
  )
}
