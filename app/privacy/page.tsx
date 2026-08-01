import type { Metadata } from "next"
import { LegalPage, LegalSection } from "@/components/legal/legal-page"

export const metadata: Metadata = {
  title: "Privacy Policy | Fitacle",
  description:
    "How Fitacle collects, uses, stores, and protects your personal data, including your rights under the UK/EU GDPR and India's DPDP Act.",
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="August 1, 2026"
      intro="Fitacle (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This policy explains what personal data we collect, why we collect it, how we use and share it, and the rights you have over it. It applies to visitors and registered users of the Fitacle website and services worldwide."
    >
      <LegalSection heading="1. Who we are (Data Controller)">
        <p>
          Fitacle is the data controller responsible for your personal data. For any privacy questions or to exercise
          your rights, contact us at <a href="mailto:privacy@fitacle.com">privacy@fitacle.com</a>.
        </p>
      </LegalSection>

      <LegalSection heading="2. Data we collect">
        <ul>
          <li><strong>Account data:</strong> name, email address, and password (stored only as a secure hash).</li>
          <li>
            <strong>Profile &amp; fitness data:</strong> details you choose to provide such as age, height, weight,
            fitness goals, activity level, workout schedule, gym, city, and country.
          </li>
          <li><strong>Community &amp; messaging data:</strong> posts, comments, and direct messages you send to other members.</li>
          <li><strong>Technical data:</strong> IP address, device and browser type, and cookie identifiers.</li>
          <li><strong>Usage data:</strong> how you interact with the app, such as pages viewed and features used.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. How and why we use your data">
        <p>We process your data to:</p>
        <ul>
          <li>Create and manage your account and authenticate you.</li>
          <li>Provide core features such as body analysis, AI plans, the Fitacle Score, partner matching, and messaging.</li>
          <li>Match you with relevant training partners based on your profile.</li>
          <li>Keep the service secure and prevent fraud or abuse.</li>
          <li>Communicate with you about your account and important service updates.</li>
          <li>Improve our products and understand how the service is used.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="4. Legal bases for processing (UK/EU GDPR)">
        <p>Where the UK or EU GDPR applies, we rely on the following legal bases:</p>
        <ul>
          <li><strong>Contract:</strong> to provide the service you sign up for.</li>
          <li><strong>Consent:</strong> for optional features and non-essential cookies. You may withdraw consent at any time.</li>
          <li><strong>Legitimate interests:</strong> to secure, maintain, and improve the service, balanced against your rights.</li>
          <li><strong>Legal obligation:</strong> where we must retain or disclose data to comply with the law.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="5. Your rights">
        <p>
          Depending on where you live, you have rights over your personal data. Under the <strong>UK/EU GDPR</strong>{" "}
          these include the rights to access, rectify, erase, restrict or object to processing, data portability, and to
          withdraw consent. Under <strong>India&apos;s Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> you
          have the right to access and correct your data, the right to erasure, the right to grievance redressal, and the
          right to nominate another person to exercise your rights. Residents of other regions (including the CCPA in
          California) have comparable rights.
        </p>
        <p>
          To exercise any right, email <a href="mailto:privacy@fitacle.com">privacy@fitacle.com</a>. You also have the
          right to lodge a complaint with your local data protection authority (for example, the UK ICO or the Data
          Protection Board of India).
        </p>
      </LegalSection>

      <LegalSection heading="6. Data sharing">
        <p>
          We do not sell your personal data. We share it only with trusted service providers that help us run the
          service (such as our hosting and database provider) under contracts that require them to protect it. Profile
          information you choose to make visible (such as your name and fitness focus) is shown to other signed-in
          members to enable partner matching.
        </p>
      </LegalSection>

      <LegalSection heading="7. International transfers">
        <p>
          Your data may be processed in countries other than your own. Where we transfer data internationally, we use
          appropriate safeguards such as Standard Contractual Clauses or transfers to countries with an adequacy
          decision.
        </p>
      </LegalSection>

      <LegalSection heading="8. Data retention">
        <p>
          We keep your personal data for as long as your account is active and as needed to provide the service. When
          you delete your account, we delete or anonymize your personal data unless we are legally required to retain it.
        </p>
      </LegalSection>

      <LegalSection heading="9. Security">
        <p>
          We use industry-standard measures including encryption in transit, hashed passwords, and row-level access
          controls so that users can only access their own private data. No method of transmission is completely secure,
          but we work continuously to protect your information.
        </p>
      </LegalSection>

      <LegalSection heading="10. Children">
        <p>
          Fitacle is not intended for children under 16 (or the minimum age required in your country). We do not
          knowingly collect data from children. If you believe a child has provided us data, contact us and we will
          delete it.
        </p>
      </LegalSection>

      <LegalSection heading="11. Changes to this policy">
        <p>
          We may update this policy from time to time. We will post the updated version here and revise the &quot;Last
          updated&quot; date above. Significant changes will be communicated to you where required.
        </p>
      </LegalSection>

      <LegalSection heading="12. Contact us">
        <p>
          Questions about this policy or your data? Email us at{" "}
          <a href="mailto:privacy@fitacle.com">privacy@fitacle.com</a>.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
