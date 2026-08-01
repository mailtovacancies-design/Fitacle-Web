"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, Send, Loader2, CheckCircle2, ArrowLeft, MessageSquare } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email, and message.")
      return
    }

    const supabase = createClient()
    if (!supabase) {
      setError("Messaging is not available right now. Please email us at contact@fitacle.com.")
      return
    }

    setLoading(true)
    try {
      const { data: userData } = await supabase.auth.getUser()
      const { error: insertError } = await supabase.from("contact_messages").insert({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || null,
        message: message.trim(),
        user_id: userData.user?.id ?? null,
      })
      if (insertError) throw insertError
      setSent(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 grid place-items-center">
            <MessageSquare size={22} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">Contact us</h1>
        </div>
        <p className="text-muted-foreground mb-8 text-pretty">
          Questions, feedback, or need a hand? Send us a message and our team will get back to you. You can also email{" "}
          <a href="mailto:contact@fitacle.com" className="text-emerald-600 hover:underline">
            contact@fitacle.com
          </a>
          .
        </p>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-8 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 grid place-items-center mx-auto mb-4">
              <CheckCircle2 className="text-emerald-600" size={28} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Message sent</h2>
            <p className="text-sm text-muted-foreground mb-6 text-pretty">
              Thanks for reaching out, {name.split(" ")[0] || "there"}. We&apos;ll reply to{" "}
              <span className="font-medium text-foreground">{email}</span> as soon as we can.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-colors"
            >
              Back to home
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-1.5">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition"
                  required
                  maxLength={120}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-1.5">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition"
                  required
                  maxLength={200}
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-sm font-medium text-foreground mb-1.5">
                Subject <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                id="contact-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What's this about?"
                className="w-full px-3.5 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition"
                maxLength={200}
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-1.5">
                Message
              </label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us how we can help..."
                rows={6}
                className="w-full px-3.5 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition resize-y"
                required
                maxLength={4000}
              />
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
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {loading ? "Sending..." : "Send message"}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
