import type { Metadata } from "next"
import { LegalPage, LegalSection } from "@/components/legal/legal-page"

export const metadata: Metadata = {
  title: "Terms of Service | Fitacle",
  description: "The terms and conditions that govern your use of Fitacle.",
  alternates: {
    canonical: "/terms",
  },
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="August 1, 2026"
      intro="These Terms of Service (&quot;Terms&quot;) govern your access to and use of Fitacle. By creating an account or using the service, you agree to these Terms. Please read them carefully."
    >
      <LegalSection heading="1. Acceptance of terms">
        <p>
          By accessing or using Fitacle, you confirm that you can form a binding contract and that you accept these
          Terms and our <a href="/privacy">Privacy Policy</a>. If you do not agree, do not use the service.
        </p>
      </LegalSection>

      <LegalSection heading="2. Eligibility">
        <p>
          You must be at least 16 years old (or the minimum age of digital consent in your country) to use Fitacle. By
          using the service you represent that you meet this requirement.
        </p>
      </LegalSection>

      <LegalSection heading="3. Your account">
        <ul>
          <li>You are responsible for keeping your login credentials secure.</li>
          <li>You are responsible for all activity that happens under your account.</li>
          <li>You must provide accurate information and keep it up to date.</li>
          <li>Notify us immediately of any unauthorized use of your account.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="4. Health &amp; fitness disclaimer">
        <p>
          Fitacle provides fitness information, AI-generated plans, and scores for general informational purposes only.
          It is <strong>not medical advice</strong> and is not a substitute for professional guidance. Consult a
          qualified healthcare provider before starting any exercise or nutrition program, especially if you have a
          medical condition. You use fitness recommendations at your own risk.
        </p>
      </LegalSection>

      <LegalSection heading="5. Acceptable use">
        <p>When using Fitacle, including community posts and messaging, you agree not to:</p>
        <ul>
          <li>Harass, abuse, threaten, or harm other users.</li>
          <li>Post unlawful, misleading, hateful, or sexually explicit content.</li>
          <li>Spam, advertise, or solicit other users without permission.</li>
          <li>Impersonate any person or misrepresent your affiliation.</li>
          <li>Attempt to access accounts or data that are not yours, or disrupt the service.</li>
        </ul>
        <p>We may remove content and suspend or terminate accounts that violate these rules.</p>
      </LegalSection>

      <LegalSection heading="6. User content">
        <p>
          You retain ownership of the content you post. By posting, you grant Fitacle a non-exclusive, worldwide license
          to host and display that content for the purpose of operating the service. You are solely responsible for the
          content you share.
        </p>
      </LegalSection>

      <LegalSection heading="7. Intellectual property">
        <p>
          Fitacle and its logo, design, and software are owned by us and protected by intellectual property laws. You may
          not copy, modify, or distribute them without our permission.
        </p>
      </LegalSection>

      <LegalSection heading="8. Termination">
        <p>
          You may stop using Fitacle and delete your account at any time. We may suspend or terminate your access if you
          breach these Terms or use the service in a way that could harm us or other users.
        </p>
      </LegalSection>

      <LegalSection heading="9. Limitation of liability">
        <p>
          To the maximum extent permitted by law, Fitacle is provided &quot;as is&quot; without warranties of any kind.
          We are not liable for any indirect, incidental, or consequential damages arising from your use of the service,
          including any injury resulting from following fitness recommendations.
        </p>
      </LegalSection>

      <LegalSection heading="10. Changes to these terms">
        <p>
          We may update these Terms from time to time. Continued use of the service after changes take effect means you
          accept the updated Terms.
        </p>
      </LegalSection>

      <LegalSection heading="11. Contact">
        <p>
          Questions about these Terms? Email <a href="mailto:contact@fitacle.com">contact@fitacle.com</a>.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
