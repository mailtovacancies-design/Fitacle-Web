import type { Metadata } from "next"
import { LegalPage } from "@/components/legal/legal-page"

export const metadata: Metadata = {
  title: "Help Center | Fitacle",
  description: "Find answers to common questions about Fitacle — your account, Fitacle Score, messaging, finding partners, privacy, and more.",
}

export default function HelpPage() {
  return (
    <LegalPage title="Help Center" updated="Last updated: August 2026">
      <p>
        Welcome to the Fitacle Help Center. Below are answers to the questions we hear most often. If you can&apos;t
        find what you need, reach out via our <a href="/contact">Contact page</a> and we&apos;ll be happy to help.
      </p>

      <h2>Getting started</h2>
      <h3>What is Fitacle?</h3>
      <p>
        Fitacle helps you build consistent fitness habits by combining a daily Fitacle Score with AI insights from
        your activity, and by connecting you with accountability partners and trainers in your area.
      </p>
      <h3>How do I create an account?</h3>
      <p>
        Click <strong>Sign up</strong> on the homepage. You can register with your email and a password, or continue
        with Google. After signing up with email, check your inbox for a confirmation link before signing in.
      </p>
      <h3>Is Fitacle free?</h3>
      <p>
        Creating an account, building your profile, viewing your Fitacle Score, and messaging partners are free.
        Some advanced features may be offered as part of a premium plan in the future.
      </p>

      <h2>Your Fitacle Score</h2>
      <h3>How is my score calculated?</h3>
      <p>
        Your daily Fitacle Score is generated from the activity you log, producing AI insights and recommendations
        tailored to your patterns. The more consistently you log, the more useful your recommendations become.
      </p>
      <h3>Why did my score change?</h3>
      <p>
        Scores reflect recent activity trends. Changes are normal and are meant to guide you — the goal is steady
        progress over time, not a perfect number every day.
      </p>

      <h2>Finding &amp; messaging partners</h2>
      <h3>How do I find a training partner?</h3>
      <p>
        Visit the <strong>Never Train Alone</strong> section. You must be signed in to browse members. Use the
        filters to narrow by goal, activity, schedule, and location, then send a message to anyone you&apos;d like to
        connect with.
      </p>
      <h3>How does messaging work?</h3>
      <p>
        Click the message icon on a member&apos;s card to open a conversation. You&apos;ll receive a notification
        when someone messages you, visible from the bell icon in the navigation bar. You can only read and send
        messages that belong to you.
      </p>
      <h3>Can I control who contacts me?</h3>
      <p>
        Only signed-in members can send messages. If you experience unwanted contact, use the <a href="/contact">Contact
        page</a> to report it and we&apos;ll investigate.
      </p>

      <h2>Account &amp; security</h2>
      <h3>I forgot my password. What do I do?</h3>
      <p>
        On the sign-in screen, click <strong>Forgot password?</strong> and enter your email. We&apos;ll send you a
        secure link to set a new password.
      </p>
      <h3>How do I edit my profile?</h3>
      <p>
        Open the user menu in the top navigation and choose <strong>Edit Profile</strong> to update your activity,
        location, schedule, goal, and other details.
      </p>
      <h3>How do I delete my account?</h3>
      <p>
        You can request account deletion at any time via the <a href="/contact">Contact page</a>. We will remove your
        personal data in line with our <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>Privacy &amp; data</h2>
      <p>
        We take your privacy seriously and comply with applicable data protection laws, including the UK/EU GDPR and
        India&apos;s Digital Personal Data Protection Act. Learn more in our <a href="/privacy">Privacy Policy</a> and{" "}
        <a href="/cookies">Cookie Policy</a>.
      </p>

      <h2>Still need help?</h2>
      <p>
        Head to our <a href="/contact">Contact page</a> to reach the Fitacle team directly. We aim to respond to all
        inquiries within a few business days.
      </p>
    </LegalPage>
  )
}
