"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"
import { motion, AnimatePresence, useDragControls } from "framer-motion"
import { MessageCircle, X, Send, Sparkles, Bot, User, GripVertical } from "lucide-react"
import Image from "next/image"

// Rotating welcome greetings shown inside the chat window (never as popups).
const WELCOME_GREETINGS = [
  "Hi! I'm TACLE AI. What can we work on today?",
  "Ready to tackle your fitness limits? Ask me anything.",
  "Hey there! Fitness, food, or motivation - where do we start?",
  "Welcome back! Let's make today count. What's on your mind?",
  "Hi! Need a plan, a push, or a training partner? I've got you.",
]

// Conversation starters. Mix of fitness Q&A and partner-feature nudges.
const STARTER_PROMPTS = [
  "Best exercises for fat loss?",
  "Indian diet for muscle gain",
  "How to stay motivated?",
  "Build me a free AI fitness plan",
  "Looking for a gym buddy or someone to join my fitness journey?",
  "I keep training alone - can you help?",
  "How do I find a workout partner?",
  "Find me a walking partner",
  "Anyone to walk my dog with?",
  "Beginner full-body workout plan",
  "Ready to stop training alone?",
  "Find me an accountability partner",
  "Healthy high-protein snacks",
]

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// Proactive teaser bubbles shown ONCE above the chat button to spark engagement.
// Each carries a `prompt` that is auto-sent into the chat when tapped.
type Teaser = { text: string; prompt: string }
const TEASERS: Teaser[] = [
  { text: "Want a workout that fits your schedule?", prompt: "Build me a workout plan that fits a busy schedule" },
  { text: "Not sure what to eat for your goal?", prompt: "What should I eat to reach my fitness goal?" },
  { text: "Struggling to stay consistent? Let's fix that.", prompt: "How do I stay consistent with my fitness routine?" },
  { text: "Want a free AI fitness plan in seconds?", prompt: "Create a personalized AI fitness plan for me" },
  { text: "Training alone? Find your Fitness Partner.", prompt: "How do I find a fitness partner on Fitacle?" },
  { text: "Curious how many calories you need?", prompt: "How many calories should I eat per day?" },
]

// Non-spam timing: one gentle nudge per session, snooze-aware across visits.
const TEASER_STORAGE_KEY = "fitacle_chat_teaser_v2"
const TEASER_FIRST_DELAY_MS = 15_000 // wait 15s so it never interrupts arrival
const TEASER_AUTO_HIDE_MS = 12_000 // auto-dismiss if ignored
const TEASER_DISMISS_SNOOZE_MS = 12 * 60 * 60_000 // 12h after manual dismiss
const TEASER_OPEN_SNOOZE_MS = 24 * 60 * 60_000 // 24h once they engage

type TeaserState = { snoozeUntil?: number }
function readTeaserState(): TeaserState {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(sessionStorage.getItem(TEASER_STORAGE_KEY) || localStorage.getItem(TEASER_STORAGE_KEY) || "{}") as TeaserState
  } catch {
    return {}
  }
}
function writeTeaserState(next: TeaserState) {
  try {
    localStorage.setItem(TEASER_STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* ignore private-mode/quota errors */
  }
}

// In-conversation follow-up suggestions. These appear inside the chat (never as
// popups), rotate randomly, and gently promote Fitacle features so the assistant
// keeps the conversation going naturally.
const IN_CHAT_SUGGESTIONS = [
  "Build me a free AI fitness plan",
  "Find my fitness partner",
  "I don't want to train alone",
  "Find me a walking partner",
  "Anyone to walk my dog with?",
  "I need an accountability partner",
  "What should I eat for my goal?",
  "How do I stay consistent?",
  "A workout that fits a busy schedule",
  "How many calories should I eat?",
  "Best exercises for fat loss",
  "Match me with a running partner",
]

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDesktop, setIsDesktop] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()
  const constraintsRef = useRef<HTMLDivElement>(null)

  const [teaser, setTeaser] = useState<Teaser | null>(null)
  const teaserShownRef = useRef(false)
  const teaserHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [input, setInput] = useState("")
  const [greeting, setGreeting] = useState(WELCOME_GREETINGS[0])
  const [starters, setStarters] = useState<string[]>(() => STARTER_PROMPTS.slice(0, 3))
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "submitted" || status === "streaming"
  const hasError = !!error

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  // Extract plain text from a UIMessage's parts array (AI SDK v6)
  const getMessageText = (message: UIMessage) =>
    message.parts
      ?.filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("") ?? ""
  
  // Shuffle greeting + starters each time the chat opens on an empty conversation
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setGreeting(WELCOME_GREETINGS[Math.floor(Math.random() * WELCOME_GREETINGS.length)])
      setStarters(pickRandom(STARTER_PROMPTS, 3))
    }
  }, [isOpen, messages.length])

  // Check if desktop on mount and resize
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 640)
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])
  
  // Reset position when window resizes
  useEffect(() => {
    const handleResize = () => setPosition({ x: 0, y: 0 })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Open the chat, optionally auto-sending a starter prompt.
  const openChat = (prompt?: string) => {
    setTeaser(null)
    if (teaserHideTimer.current) clearTimeout(teaserHideTimer.current)
    writeTeaserState({ snoozeUntil: Date.now() + TEASER_OPEN_SNOOZE_MS })
    setIsOpen(true)
    if (prompt && !isLoading) {
      // small delay so the window mounts before the message appears
      setTimeout(() => sendMessage({ text: prompt }), 250)
    }
  }

  // Show ONE proactive teaser per session (non-spam). It waits, auto-hides if
  // ignored, never appears while the chat is open, and respects the snooze window.
  useEffect(() => {
    const state = readTeaserState()
    if (state.snoozeUntil && Date.now() < state.snoozeUntil) return
    if (teaserShownRef.current) return

    const showTimer = setTimeout(() => {
      if (isOpen || teaserShownRef.current) return
      teaserShownRef.current = true
      setTeaser(TEASERS[Math.floor(Math.random() * TEASERS.length)])
      // mark shown for this session so a reload within the tab won't repeat it
      try {
        sessionStorage.setItem(TEASER_STORAGE_KEY, JSON.stringify({ snoozeUntil: Date.now() + TEASER_OPEN_SNOOZE_MS }))
      } catch {
        /* ignore */
      }
      teaserHideTimer.current = setTimeout(() => setTeaser(null), TEASER_AUTO_HIDE_MS)
    }, TEASER_FIRST_DELAY_MS)

    return () => {
      clearTimeout(showTimer)
      if (teaserHideTimer.current) clearTimeout(teaserHideTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Hide the teaser the moment the chat opens.
  useEffect(() => {
    if (isOpen) setTeaser(null)
  }, [isOpen])

  const dismissTeaser = () => {
    setTeaser(null)
    if (teaserHideTimer.current) clearTimeout(teaserHideTimer.current)
    writeTeaserState({ snoozeUntil: Date.now() + TEASER_DISMISS_SNOOZE_MS })
  }

  // Rotating in-chat suggestions shown after the assistant replies.
  const [suggestions, setSuggestions] = useState<string[]>(() => pickRandom(IN_CHAT_SUGGESTIONS, 3))
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      setSuggestions(pickRandom(IN_CHAT_SUGGESTIONS, 3))
    }
  }, [isLoading, messages.length])

  return (
    <>
      {/* Drag constraints container */}
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-40" />

      {/* Proactive engagement teaser (one gentle, dismissible nudge) */}
      <AnimatePresence>
        {teaser && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-36 right-4 sm:bottom-24 sm:right-6 z-40 w-[calc(100vw-5rem)] max-w-[250px]"
          >
            <div className="relative rounded-2xl rounded-br-md bg-card border border-border shadow-xl p-3 pr-8">
              <button
                onClick={dismissTeaser}
                aria-label="Dismiss message"
                className="absolute top-1.5 right-1.5 p-1 rounded-md text-muted-foreground hover:bg-accent transition-colors"
              >
                <X size={13} />
              </button>
              <button
                onClick={() => openChat(teaser.prompt)}
                className="flex items-start gap-2 text-left w-full"
              >
                <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 grid place-items-center">
                  <Sparkles size={13} />
                </span>
                <span className="text-[13px] leading-snug text-foreground text-pretty">{teaser.text}</span>
              </button>
            </div>
            {/* little pointer toward the chat button */}
            <div className="absolute -bottom-1 right-6 w-3 h-3 rotate-45 bg-card border-b border-r border-border" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button - Draggable */}
      <motion.button
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        whileDrag={{ scale: 1.1 }}
        initial={{ scale: 0 }}
        animate={{
          scale: 1,
          y: [0, -6, 0],
        }}
        transition={{
          scale: { delay: 1, type: "spring", damping: 15 },
          y: { delay: 1.6, duration: 3.5, repeat: Infinity, ease: "easeInOut" },
        }}
        onClick={() => openChat()}
        className={`fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 w-14 h-14 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-colors flex items-center justify-center cursor-grab active:cursor-grabbing ${isOpen ? "hidden" : ""}`}
      >
        {/* Soft expanding glow rings (GPU transform/opacity only) */}
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-emerald-500/50"
          animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-emerald-400/40"
          animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
        />
        {/* Steady gentle glow */}
        <motion.span
          aria-hidden
          className="absolute -inset-1 rounded-full bg-emerald-500/30 blur-md"
          animate={{ opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <MessageCircle size={24} className="relative z-10" />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 z-10 w-4 h-4 bg-foreground rounded-full flex items-center justify-center"
        >
          <Sparkles size={10} className="text-background" />
        </motion.div>
      </motion.button>

      {/* Chat Window - Draggable on desktop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag={isDesktop}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, ...position }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onDragEnd={(_, info) => setPosition({ x: position.x + info.offset.x, y: position.y + info.offset.y })}
            className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[60] w-full sm:w-[90vw] sm:max-w-[380px] h-[85dvh] sm:h-[70vh] sm:max-h-[550px] bg-card border-0 sm:border border-border sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden safe-area-inset-bottom"
          >
            {/* Header with drag handle */}
            <div 
              className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-emerald-500/10 to-teal-500/10 cursor-grab active:cursor-grabbing sm:cursor-grab"
              onPointerDown={(e) => { if (isDesktop) dragControls.start(e) }}
            >
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center text-muted-foreground mr-1">
                  <GripVertical size={16} />
                </div>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Image
                      src="/images/fitacle-logo.png"
                      alt="Fitacle AI"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm flex items-center gap-1">TACLE AI <span className="text-amber-500">⚡</span></h3>
                  <p className="text-xs text-muted-foreground">Your AI Fitness Companion</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Bot size={32} className="text-emerald-500" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center justify-center gap-1">
                    TACLE AI <span className="text-amber-500">⚡</span>
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4 text-pretty">{greeting}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {starters.map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          if (isLoading) return
                          sendMessage({ text: q })
                        }}
                        className="text-xs px-3 py-2 bg-accent rounded-full text-foreground hover:bg-accent/80 active:scale-95 transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user" ? "bg-foreground" : "bg-emerald-500"
                  }`}>
                    {message.role === "user" ? (
                      <User size={16} className="text-background" />
                    ) : (
                      <Bot size={16} className="text-white" />
                    )}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    message.role === "user" 
                      ? "bg-foreground text-background rounded-tr-md" 
                      : "bg-accent text-foreground rounded-tl-md"
                  }`}>
                    <div className="text-sm whitespace-pre-wrap">
                      {getMessageText(message)}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="bg-accent rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                          className="w-2 h-2 rounded-full bg-muted-foreground"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {hasError && (
                <div className="text-center py-4">
                  <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
                </div>
              )}

              {/* In-conversation suggestions (never popups) - keep the chat flowing */}
              {messages.length > 0 && !isLoading && !hasError && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap gap-2 pt-1"
                >
                  <span className="w-full text-[11px] text-muted-foreground flex items-center gap-1">
                    <Sparkles size={11} className="text-emerald-500" /> You might also ask
                  </span>
                  {suggestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => { if (!isLoading) sendMessage({ text: q }) }}
                      className="text-xs px-3 py-1.5 bg-emerald-500/10 text-emerald-700 rounded-full hover:bg-emerald-500/20 active:scale-95 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 pb-safe border-t border-border bg-card">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about fitness..."
                  disabled={isLoading}
                  enterKeyHint="send"
                  className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-base sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                  autoComplete="off"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Send size={18} />
                </motion.button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                Powered by TACLE AI - For general guidance only
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
