"use client"

import { useEffect, useRef, useState } from "react"
import useSWR, { useSWRConfig } from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Loader2 } from "lucide-react"
import { fetchThread, sendMessage, markThreadRead, type DirectMessage } from "@/lib/messages"

interface MessageDialogProps {
  currentUserId: string
  recipient: { userId: string; name: string; initial: string }
  onClose: () => void
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
}

export function MessageDialog({ currentUserId, recipient, onClose }: MessageDialogProps) {
  const { mutate } = useSWRConfig()
  const [draft, setDraft] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const key = ["thread", currentUserId, recipient.userId]
  const {
    data: messages,
    isLoading,
    mutate: mutateThread,
  } = useSWR<DirectMessage[]>(key, () => fetchThread(currentUserId, recipient.userId), {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  })

  // Scroll to the newest message whenever the thread changes.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  // Mark incoming messages as read, then refresh the inbox badge.
  const hasUnreadFromOther = (messages ?? []).some((m) => m.recipient_id === currentUserId && !m.read_at)
  useEffect(() => {
    if (!hasUnreadFromOther) return
    markThreadRead(recipient.userId).then(() => {
      mutate(["inbox", currentUserId])
      mutateThread()
    })
  }, [hasUnreadFromOther, recipient.userId, currentUserId, mutate, mutateThread])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = draft.trim()
    if (!body || sending) return
    setSending(true)
    setError(null)
    try {
      await sendMessage(recipient.userId, body)
      setDraft("")
      await mutateThread()
      mutate(["inbox", currentUserId])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send. Please try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-label={`Conversation with ${recipient.name}`}
      >
        <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full sm:max-w-md bg-card border border-border rounded-t-3xl sm:rounded-3xl shadow-xl overflow-hidden flex flex-col h-[80dvh] sm:h-[70vh] max-h-[640px]"
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <div className="w-10 h-10 rounded-full grid place-items-center font-bold ring-2 ring-emerald-500/30 bg-emerald-500/10 text-emerald-600">
              {recipient.initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground truncate">{recipient.name}</p>
              <p className="text-xs text-muted-foreground">Direct message</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-muted-foreground hover:bg-accent transition-colors"
              aria-label="Close conversation"
            >
              <X size={18} />
            </button>
          </div>

          {/* Thread */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoading ? (
              <div className="h-full grid place-items-center text-muted-foreground">
                <Loader2 size={22} className="animate-spin" />
              </div>
            ) : (messages ?? []).length === 0 ? (
              <div className="h-full grid place-items-center text-center px-6">
                <p className="text-sm text-muted-foreground text-pretty">
                  Say hello to {recipient.name.split(" ")[0]} and start building accountability together.
                </p>
              </div>
            ) : (
              (messages ?? []).map((m) => {
                const fromMe = m.sender_id === currentUserId
                return (
                  <div key={m.id} className={`flex ${fromMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[78%] ${fromMe ? "items-end" : "items-start"} flex flex-col`}>
                      <div
                        className={`px-3.5 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words ${
                          fromMe
                            ? "bg-emerald-600 text-white rounded-br-md"
                            : "bg-accent text-foreground rounded-bl-md"
                        }`}
                      >
                        {m.body}
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 px-1">{formatTime(m.created_at)}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Composer */}
          <form onSubmit={handleSend} className="p-3 border-t border-border">
            {error && <p className="text-xs text-destructive mb-2 px-1">{error}</p>}
            <div className="flex items-end gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                    e.preventDefault()
                    handleSend(e)
                  }
                }}
                rows={1}
                maxLength={2000}
                placeholder={`Message ${recipient.name.split(" ")[0]}…`}
                className="flex-1 resize-none max-h-32 px-4 py-2.5 rounded-2xl bg-input border border-border text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition"
              />
              <button
                type="submit"
                disabled={sending || !draft.trim()}
                className="flex-shrink-0 grid place-items-center w-11 h-11 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                aria-label="Send message"
              >
                {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
