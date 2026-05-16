"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Sparkles, Bot, User } from "lucide-react"
import Image from "next/image"

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { messages, sendMessage, status, error, reload } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (err) => {
      console.error("[v0] Chat error:", err)
    }
  })

  const isLoading = status === "streaming" || status === "submitted"
  const hasError = status === "error" || !!error
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", damping: 15 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-colors flex items-center justify-center ${isOpen ? "hidden" : ""}`}
      >
        <MessageCircle size={24} />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-foreground rounded-full flex items-center justify-center"
        >
          <Sparkles size={10} className="text-background" />
        </motion.div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[90vw] sm:max-w-[380px] h-[100dvh] sm:h-[70vh] sm:max-h-[550px] bg-card border-0 sm:border border-border sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden safe-area-inset-bottom"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
              <div className="flex items-center gap-3">
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
                  <h4 className="font-semibold text-foreground mb-2">Hi! I&apos;m TACLE AI <span className="text-amber-500">⚡</span></h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ask me anything about fitness, nutrition, or workouts!
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["Best exercises for fat loss?", "Indian diet for muscle gain", "How to stay motivated?"].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setInput(q)
                        }}
                        className="text-xs px-3 py-1.5 bg-accent rounded-full text-foreground hover:bg-accent/80 transition-colors"
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
                      {message.parts && message.parts.length > 0 ? (
                        message.parts.map((part, index) => {
                          if (part.type === "text") {
                            return <span key={index}>{part.text}</span>
                          }
                          return null
                        })
                      ) : (
                        <span>{String((message as { content?: string }).content || "")}</span>
                      )}
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
                  <p className="text-sm text-red-500 mb-2">Something went wrong. Please try again.</p>
                  <button
                    onClick={() => reload()}
                    className="text-xs px-3 py-1.5 bg-accent rounded-full text-foreground hover:bg-accent/80 transition-colors"
                  >
                    Retry
                  </button>
                </div>
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
                  className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
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
