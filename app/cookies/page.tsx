import type { Metadata } from "next"
import { LegalPage, LegalSection } from "@/components/legal/legal-page"

export const metadata: Metadata = {
  title: "Cookie Policy | Fitacle",
  description: "How Fitacle uses cookies and similar technologies, and how you can control them.",
  alternates: {
    canonical: "/cookies",
  },
}

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated="August 1, 2026"
      intro="This Cookie Policy explains how Fitacle uses cookies and similar technologies to recognize you when you visit, and the choices you have."
    >
      <LegalSection heading="1. What are cookies?">
        <p>
          Cookies are small text files placed on your device when you visit a website. They help the site work, remember
          your preferences, and understand how it is used. We also use similar technologies such as local storage.
        </p>
      </LegalSection>

      <LegalSection heading="2. Types of cookies we use">
        <ul>
          <li>
            <strong>Strictly necessary:</strong> required for the service to function, including keeping you signed in
            and securing your session. These cannot be switched off.
          </li>
          <li>
            <strong>Functional:</strong> remember your preferences and choices to give you a better experience.
          </li>
          <li>
            <strong>Analytics:</strong> help us understand how visitors use Fitacle so we can improve it. These are only
            set where permitted.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. How we use cookies">
        <p>
          We primarily use essential cookies to authenticate you and keep your session secure. Any non-essential cookies
          are used only with your consent where required by law.
        </p>
      </LegalSection>

      <LegalSection heading="4. Managing cookies">
        <p>
          You can control and delete cookies through your browser settings. Most browsers let you refuse or remove
          cookies. Please note that blocking strictly necessary cookies may prevent parts of Fitacle, such as signing in,
          from working correctly.
        </p>
      </LegalSection>

      <LegalSection heading="5. Changes to this policy">
        <p>
          We may update this Cookie Policy to reflect changes in the technologies we use or for legal reasons. The
          &quot;Last updated&quot; date above shows when it was last revised.
        </p>
      </LegalSection>

      <LegalSection heading="6. Contact">
        <p>
          Questions about our use of cookies? Email <a href="mailto:privacy@fitacle.com">privacy@fitacle.com</a>.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
