"use client"

import { motion } from "framer-motion"
import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
      >
        <div className="bg-card rounded-3xl border border-border shadow-xl p-8">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
              <Mail className="w-10 h-10 text-green-500" />
            </div>
          </motion.div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Check your email
          </h1>
          <p className="text-muted-foreground mb-6">
            We&apos;ve sent you a confirmation link. Please check your email to verify your account and complete your registration.
          </p>

          <div className="bg-secondary/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or try signing up again.
            </p>
          </div>

          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-foreground font-medium hover:underline underline-offset-4 transition-all"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
