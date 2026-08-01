"use client"

import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { X, Inbox as InboxIcon, Loader2, ChevronRight } from "lucide-react"
import { fetchInbox, type Conversation } from "@/lib/messages"

interface MessageInboxProps {
  currentUserId: string
  onClose: () => void
  onOpenThread: (recipient: { userId: string; name: string; initial: string }) => void
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  return `${days}d`
}

export function MessageInbox({ currentUserId, onClose, onOpenThread }: MessageInboxProps) {
  const { data: conversations, isLoading } = useSWR<Conversation[]>(
    ["inbox", currentUserId],
    () => fetchInbox(currentUserId),
    { refreshInterval: 8000 },
  )

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[105] flex items-end sm:items-center justify-center p-0 sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Your messages"
      >
        <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full sm:max-w-md bg-card border border-border rounded-t-3xl sm:rounded-3xl shadow-xl overflow-hidden flex flex-col h-[70dvh] sm:h-[60vh] max-h-[560px]"
        >
          <div className="flex items-center gap-2 p-4 border-b border-border">
            <InboxIcon size={18} className="text-emerald-600" />
            <h2 className="font-semibold text-foreground flex-1">Messages</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-muted-foreground hover:bg-accent transition-colors"
              aria-label="Close messages"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="h-full grid place-items-center text-muted-foreground">
                <Loader2 size={22} className="animate-spin" />
              </div>
            ) : (conversations ?? []).length === 0 ? (
              <div className="h-full grid place-items-center text-center px-8">
                <p className="text-sm text-muted-foreground text-pretty">
                  No messages yet. Reach out to a partner from the list below to get started.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {(conversations ?? []).map((c) => (
                  <li key={c.otherId}>
                    <button
                      onClick={() => onOpenThread({ userId: c.otherId, name: c.name, initial: c.initial })}
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-accent/60 transition-colors"
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-11 h-11 rounded-full grid place-items-center font-bold ring-2 ring-emerald-500/30 bg-emerald-500/10 text-emerald-600">
                          {c.initial}
                        </div>
                        {c.unread > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 grid place-items-center text-[10px] font-bold rounded-full bg-emerald-600 text-white">
                            {c.unread}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`truncate ${c.unread > 0 ? "font-bold text-foreground" : "font-medium text-foreground"}`}>
                            {c.name}
                          </p>
                          <span className="text-[11px] text-muted-foreground flex-shrink-0">{timeAgo(c.lastAt)}</span>
                        </div>
                        <p className={`text-sm truncate ${c.unread > 0 ? "text-foreground" : "text-muted-foreground"}`}>
                          {c.lastFromMe ? "You: " : ""}
                          {c.lastBody}
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
