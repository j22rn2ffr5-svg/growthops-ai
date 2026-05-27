import PageHero from '../components/PageHero'
import SEO from '../components/SEO'
import LegalReviewNotice from '../components/LegalReviewNotice'

const sections = [
  {
    title: '1. About these terms',
    content: `These Terms of Service govern your use of the GrowthOps AI website (growthops.ai) and any services provided by GrowthOps AI, operated by Chris Eyres.

By using this website or engaging our services, you agree to these terms. If you do not agree, please do not use the site or our services.`,
  },
  {
    title: '2. Services',
    content: `GrowthOps AI provides AI-powered growth systems, CRM setup, automation workflows, website design and development, digital marketing strategy, and related services for SMBs.

The scope, deliverables, timelines, and pricing of any engagement are set out in a separate Statement of Work or service agreement agreed in writing before work commences.`,
  },
  {
    title: '3. Enquiries and proposals',
    content: `Submitting a contact form or booking a strategy call does not constitute a contract or commitment on either side. Engagements only begin once a written agreement has been signed and any agreed deposit has been received.

We reserve the right to decline any enquiry or proposed engagement at our discretion.`,
  },
  {
    title: '4. Payment terms',
    content: `Payment terms will be specified in your service agreement. Unless stated otherwise:

• Project work typically requires a deposit before work begins
• Remaining balances are due upon project completion or as set out in milestones
• Retainer services are billed monthly in advance
• Late payments may incur interest charges in accordance with the Late Payment of Commercial Debts Act 1998`,
  },
  {
    title: '5. Intellectual property',
    content: `Upon receipt of full payment, intellectual property rights in custom deliverables (websites, copy, creative assets) created specifically for you transfer to you.

We retain the right to display work in our portfolio unless otherwise agreed in writing. Third-party tools, platforms, and software integrated into your systems remain subject to their own licensing terms.`,
  },
  {
    title: '6. Confidentiality',
    content: `We treat all business information you share with us as confidential. We will not share your data, strategies, or commercial information with third parties without your consent, except where required by law.

This obligation survives the end of any engagement.`,
  },
  {
    title: '7. Limitation of liability',
    content: `To the extent permitted by law:

• We are not liable for indirect, consequential, or speculative losses
• Our total liability in connection with any engagement is limited to the fees paid for the specific services giving rise to the claim
• We make no guarantees of specific commercial results. Marketing and growth outcomes depend on many factors outside our control.`,
  },
  {
    title: '8. Website use',
    content: `You may use this website for lawful purposes only. You must not attempt to gain unauthorised access to any part of the site, disrupt its operation, or use it in any way that infringes the rights of others.

We reserve the right to update, change, or remove website content at any time without notice.`,
  },
  {
    title: '9. Governing law',
    content: `These terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.`,
  },
  {
    title: '10. Changes to these terms',
    content: `We may update these terms from time to time. Material changes will be reflected by the updated date above. Continued use of our website or services after changes constitutes acceptance.`,
  },
  {
    title: '11. Contact',
    content: `Questions about these terms: hello@growthops.ai`,
  },
]

export default function TermsPage() {
  return (
    <>
      <SEO
        title="Terms of Service"
        description="Terms governing use of the GrowthOps AI website and services."
        path="/terms-of-service"
      />
      <PageHero
        label="Legal"
        title="Terms of Service"
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
              Please read these terms carefully before using this website or engaging GrowthOps AI
              for services. They set out the basis on which we operate and the conditions of any
              engagement.
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
