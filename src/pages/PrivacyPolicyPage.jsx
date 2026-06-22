import PageHero from '../components/PageHero'
import SEO from '../components/SEO'
import LegalReviewNotice from '../components/LegalReviewNotice'

const sections = [
  {
    title: '1. Who we are',
    content: `Stragyx is operated by Chris Eyres ("we", "us", "our"). We provide AI-powered growth systems, CRM setup, automation, and digital marketing services for small and medium-sized businesses.

For questions about this policy, contact us at: hello@stragyx.com`,
  },
  {
    title: '2. What information we collect',
    content: `We collect information you provide directly to us, including:

• Name and email address (via contact and booking forms)
• Business name and details you share in enquiries
• Any other information you choose to include in your message

We may also collect technical data automatically when you visit our website, such as your IP address, browser type, pages visited, and time spent on pages — where you have consented to analytics cookies.`,
  },
  {
    title: '3. How we use your information',
    content: `We use the information we collect to:

• Respond to your enquiries and book strategy calls
• Provide and manage the services you have engaged us to deliver
• Send relevant follow-up communications related to your enquiry
• Improve our website and services
• Comply with legal and regulatory obligations

We do not sell, rent, or share your personal data with third parties for marketing purposes.`,
  },
  {
    title: '4. Legal basis for processing (UK GDPR)',
    content: `Under UK GDPR, we rely on the following legal bases for processing your data:

• Legitimate interests — to respond to enquiries and communicate about our services
• Contract — to deliver services you have agreed to receive
• Legal obligation — where we are required to retain data by law
• Consent — for analytics cookies, where you have explicitly agreed`,
  },
  {
    title: '5. How long we keep your data',
    content: `We retain personal data for as long as necessary to fulfil the purposes for which it was collected. Enquiry data is typically held for up to 2 years. Client project data may be held for up to 6 years for accounting and legal compliance purposes.

You may request deletion of your data at any time (see Section 7).`,
  },
  {
    title: '6. Cookies',
    content: `We use cookies to make our website function correctly and, where consented, to understand how visitors use it. See our Cookie Policy for full details.`,
  },
  {
    title: '7. Your rights',
    content: `Under UK data protection law, you have the right to:

• Access the personal data we hold about you
• Request correction of inaccurate data
• Request deletion of your data (right to erasure)
• Object to or restrict how we process your data
• Request a copy of your data in a portable format
• Withdraw consent at any time (where consent is the basis for processing)

To exercise any of these rights, contact us at hello@stragyx.com. We will respond within one calendar month.

You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk.`,
  },
  {
    title: '8. Third-party services',
    content: `We may use third-party tools to deliver our services, including:

• Calendly — for booking strategy calls
• Email service providers — for communications
• Analytics tools — where you have consented via our cookie banner

Each third-party provider has its own privacy policy. We will not use your data with third parties beyond what is necessary to deliver our services.`,
  },
  {
    title: '9. Changes to this policy',
    content: `We may update this Privacy Policy from time to time. If we make material changes, we will update the date at the top of this page. Continued use of our website after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: '10. Contact',
    content: `For any data protection queries, contact:

Stragyx
Email: hello@stragyx.com`,
  },
]

export default function PrivacyPolicyPage() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="How Stragyx collects, uses, and protects your personal data."
        path="/privacy-policy"
      />
      <PageHero
        label="Legal"
        title="Privacy Policy"
        titleAccent=""
        subtitle="Last updated: May 2025"
      />
      <LegalReviewNotice />

      <section className="pb-24 md:pb-32 pt-10">
        <div className="max-w-3xl mx-auto px-6">
          <div
            className="p-8 rounded-2xl mb-10"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <p className="text-sm text-gray-400 leading-relaxed">
              This Privacy Policy explains how Stragyx collects, uses, and protects your
              personal data. We are committed to handling your data with care and in accordance with
              UK GDPR and the Data Protection Act 2018.
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-lg font-bold text-white mb-4">{section.title}</h2>
                <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
