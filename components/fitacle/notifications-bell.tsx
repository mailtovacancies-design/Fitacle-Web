"use client"

import { useState } from "react"
import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Loader2, MailOpen } from "lucide-react"
import {
  fetchCurrentUserId,
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  fetchPartnerByUserId,
  type AppNotification,
} from "@/lib/messages"
import { MessageDialog } from "@/components/fitacle/message-dialog"

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function NotificationsBell() {
  const [open, setOpen] = useState(false)
  const [thread, setThread] = useState<{ userId: string; name: string; initial: string } | null>(null)

  const { data: currentUserId } = useSWR("current-user-id", fetchCurrentUserId, {
    revalidateOnFocus: false,
  })

  const { data: notifications, isLoading, mutate } = useSWR<AppNotification[]>(
    currentUserId ? ["notifications", currentUserId] : null,
    () => fetchNotifications(20),
    { refreshInterval: 20000 },
  )

  if (!currentUserId) return null

  const items = notifications ?? []
  const unread = items.filter((n) => !n.is_read).length

  const handleOpenNotification = async (n: AppNotification) => {
    if (!n.is_read) {
      await markNotificationRead(n.id)
      mutate()
    }
    if (n.type === "message" && n.ref_id) {
      const partner = await fetchPartnerByUserId(n.ref_id)
      if (partner) {
        setThread(partner)
        setOpen(false)
      }
    }
  }

  const handleMarkAll = async () => {
    await markAllNotificationsRead()
    mutate()
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="relative grid place-items-center w-10 h-10 rounded-full text-foreground hover:bg-foreground/5 transition-colors"
          aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
          aria-expanded={open}
        >
          <Bell size={20} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 grid place-items-center text-[10px] font-bold rounded-full bg-emerald-500 text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>

        <AnimatePresence>
          {open && (
            <>
              {/* Click-away backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                role="dialog"
                aria-label="Notifications"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                  {unread > 0 && (
                    <button
                      onClick={handleMarkAll}
                      className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="py-10 flex justify-center">
                      <Loader2 size={20} className="animate-spin text-muted-foreground" />
                    </div>
                  ) : items.length === 0 ? (
                    <div className="py-10 px-4 flex flex-col items-center gap-2 text-center">
                      <MailOpen size={24} className="text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">You&apos;re all caught up.</p>
                    </div>
                  ) : (
                    <ul>
                      {items.map((n) => (
                        <li key={n.id}>
                          <button
                            onClick={() => handleOpenNotification(n)}
                            className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-accent transition-colors border-b border-border last:border-b-0 ${
                              n.is_read ? "" : "bg-emerald-500/5"
                            }`}
                          >
                            <span
                              className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                                n.is_read ? "bg-transparent" : "bg-emerald-500"
                              }`}
                              aria-hidden
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium text-foreground truncate">{n.title}</span>
                              {n.body && (
                                <span className="block text-xs text-muted-foreground truncate">{n.body}</span>
                              )}
                              <span className="block text-[11px] text-muted-foreground mt-0.5">
                                {timeAgo(n.created_at)}
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {thread && currentUserId && (
        <MessageDialog
          currentUserId={currentUserId}
          recipient={thread}
          onClose={() => {
            setThread(null)
            mutate()
          }}
        />
      )}
    </>
  )
}
