import PageHero from '../components/PageHero'
import SEO from '../components/SEO'
import LegalReviewNotice from '../components/LegalReviewNotice'

const sections = [
  {
    title: '1. About Us',
    content: `GrowthOps AI ("GrowthOps AI", "we", "us", "our") is an AI integration and digital operations consultancy helping small and medium-sized businesses adopt, implement, and improve the use of AI tools, automation, websites, CRM systems, and related digital processes.

Our website is: growthops.ai
Contact us at: hello@growthops.ai`,
  },
  {
    title: '2. Definitions',
    content: `"Agreement" means these Terms and Conditions together with any proposal, statement of work, invoice, email confirmation, or other written agreement between us.

"Client", "you", or "your" means the business, organisation, sole trader, partnership, or individual purchasing services from GrowthOps AI.

"Client Materials" means any content, data, documents, branding, images, text, login details, system access, software access, business information, or other materials you provide to us.

"Deliverables" means the work product we create for you as part of the Services, including websites, workflows, automations, chatbot configurations, CRM setups, reports, documentation, copy, code, designs, or other outputs.

"Portal" means any client portal, dashboard, workspace, or shared system we provide or use to communicate with you, manage work, share documents, or provide access to Deliverables.

"Services" means any consulting, website development, AI implementation, chatbot setup, CRM integration, automation, technical support, digital strategy, training, or related work carried out by GrowthOps AI.

"Third-Party Services" means software, platforms, applications, APIs, hosting providers, AI model providers, payment processors, CRM systems, email tools, analytics tools, or other third-party products used in connection with the Services.`,
  },
  {
    title: '3. Basis of Agreement',
    content: `3.1 These Terms apply to all Services we provide unless we agree otherwise in writing.

3.2 The specific Services, fees, timeline, and Deliverables will be set out in a proposal, statement of work, invoice, email, or other written confirmation.

3.3 If there is a conflict between these Terms and a signed proposal or statement of work, the signed proposal or statement of work will take priority for that specific project.

3.4 By accepting a proposal, paying an invoice, giving written approval to proceed, accessing the Portal, or continuing to use our Services, you agree to be bound by these Terms.

3.5 These Terms are intended for business-to-business services. If you are purchasing as a consumer rather than for business purposes, you must tell us before we begin work.`,
  },
  {
    title: '4. Services',
    content: `4.1 We will provide the Services with reasonable skill and care.

4.2 We will use reasonable efforts to meet any agreed timescales, but delivery dates are estimates unless expressly confirmed in writing as fixed deadlines.

4.3 We may use subcontractors, freelancers, software tools, automation platforms, and Third-Party Services to deliver the Services, provided we remain responsible for the overall delivery of our Services to you.

4.4 We may make reasonable changes to the way the Services are delivered where required for technical, operational, legal, security, or third-party platform reasons.

4.5 Unless agreed in writing, the Services do not include legal, financial, tax, accounting, cybersecurity, regulatory, medical, or other professional advice.`,
  },
  {
    title: '5. Client Responsibilities',
    content: `5.1 You agree to provide all information, access, approvals, feedback, content, and Client Materials reasonably required for us to deliver the Services.

5.2 You are responsible for ensuring that all Client Materials you provide are accurate, complete, lawful, and do not infringe the rights of any third party.

5.3 You are responsible for reviewing and approving Deliverables, outputs, integrations, content, AI-generated materials, and system configurations before using them in your business.

5.4 You are responsible for ensuring that your use of the Deliverables complies with all laws, regulations, industry rules, platform terms, and internal policies that apply to your business.

5.5 You must provide timely feedback and approvals. If you delay providing information, access, content, feedback, or approval, this may delay the project and may result in additional fees.

5.6 You are responsible for maintaining the confidentiality and security of any usernames, passwords, API keys, portal logins, and account credentials provided to you or used by your business.

5.7 You must not use the Services, Portal, or Deliverables for unlawful, harmful, fraudulent, misleading, abusive, discriminatory, or otherwise inappropriate purposes.`,
  },
  {
    title: '6. Fees, Payment, and Expenses',
    content: `6.1 Fees will be agreed in advance and set out in the relevant proposal, statement of work, invoice, or written confirmation.

6.2 Unless otherwise agreed in writing, invoices are due within 14 days of the invoice date.

6.3 We may require a deposit, upfront payment, staged payment, or recurring monthly payment before starting or continuing work.

6.4 Where fees are payable monthly, payment must be made in advance unless otherwise agreed in writing.

6.5 All fees are exclusive of VAT unless stated otherwise. VAT will be added where applicable.

6.6 You are responsible for any agreed expenses, third-party software costs, hosting fees, domain costs, plugin fees, AI API usage fees, stock assets, advertising spend, subscriptions, or other external costs required for your project.

6.7 We will tell you where we reasonably expect Third-Party Services to involve separate costs, but you are responsible for checking and accepting the terms and pricing of those Third-Party Services.

6.8 We may pause work, suspend access to Deliverables, or suspend support if invoices remain unpaid after the due date.

6.9 Late payments may incur statutory interest at 8% above the Bank of England base rate, together with any applicable debt recovery costs, in accordance with the Late Payment of Commercial Debts legislation.

6.10 If you dispute an invoice, you must notify us promptly and explain the reason for the dispute. You must still pay any undisputed amount by the due date.`,
  },
  {
    title: '7. Changes to Scope',
    content: `7.1 The agreed scope of work will be set out in the relevant proposal, statement of work, email, or written confirmation.

7.2 Any request that is outside the agreed scope may be treated as additional work and may be charged separately.

7.3 Examples of additional work may include extra pages, new features, additional integrations, major copy changes, additional revisions, new automations, urgent work, rework caused by changed instructions, or work required because third-party platforms change their systems.

7.4 We will aim to confirm any material change in scope, fee, or timeline before carrying out additional chargeable work.`,
  },
  {
    title: '8. Revisions and Approvals',
    content: `8.1 Unless otherwise agreed, the number of revisions included will be set out in the relevant proposal or statement of work.

8.2 If no revision allowance is specified, we will include a reasonable number of minor revisions at our discretion.

8.3 Major changes, repeated revisions, changes in direction, or requests made after approval may be charged separately.

8.4 You are responsible for checking all Deliverables carefully before approval, publication, launch, or business use.

8.5 Once you approve a Deliverable, we will not be responsible for errors, omissions, or issues that would reasonably have been identified during your review, unless caused by our negligence.`,
  },
  {
    title: '9. Third-Party Services',
    content: `9.1 Our Services may involve Third-Party Services, including but not limited to hosting providers, domain registrars, CRM platforms, automation tools, email providers, analytics tools, payment processors, AI API providers, cloud databases, and website platforms.

9.2 Third-Party Services are provided under their own terms and conditions, privacy policies, service levels, and pricing.

9.3 We are not responsible for downtime, data loss, outages, pricing changes, API changes, feature changes, security incidents, policy changes, or other issues caused by Third-Party Services.

9.4 Where we recommend a Third-Party Service, the final decision to use that service remains yours.

9.5 You are responsible for maintaining your own accounts, billing, licences, permissions, and compliance obligations for Third-Party Services unless we agree otherwise in writing.`,
  },
  {
    title: '10. AI Tools and AI Outputs',
    content: `10.1 Some Services may involve the use, configuration, or integration of artificial intelligence tools, machine learning models, large language models, chatbots, image generation tools, AI APIs, or automated decision-support systems.

10.2 AI-generated outputs may be inaccurate, incomplete, biased, unsuitable, outdated, or misleading. You must review all AI-generated outputs before relying on them, publishing them, sending them to customers, or using them in your business.

10.3 We do not guarantee that AI outputs will be accurate, lawful, compliant, original, non-infringing, secure, or suitable for any particular purpose.

10.4 You are responsible for deciding how AI tools are used within your business and for ensuring appropriate human oversight.

10.5 You must not use AI systems we help create or configure for unlawful, discriminatory, harmful, misleading, or high-risk purposes without appropriate professional advice, safeguards, and compliance checks.

10.6 You are responsible for ensuring that any data entered into AI tools is appropriate, lawful, and does not breach confidentiality, privacy, employment, regulatory, or contractual obligations.

10.7 Where AI tools rely on Third-Party Services, their outputs, availability, security, pricing, and performance may depend on those third-party providers.

10.8 We do not guarantee any specific commercial outcome from the use of AI, automation, websites, CRM systems, marketing tools, or digital processes.`,
  },
  {
    title: '11. Intellectual Property',
    content: `11.1 Unless otherwise agreed in writing, you retain ownership of your Client Materials.

11.2 Subject to full payment of all fees owed to us, ownership of bespoke Deliverables created specifically for you will transfer to you.

11.3 We retain ownership of all pre-existing materials, know-how, processes, methods, templates, frameworks, prompts, reusable code, libraries, tools, workflows, documentation structures, and methodologies that we owned or developed before or outside your project.

11.4 Where our pre-existing materials are incorporated into your Deliverables, we grant you a non-exclusive, non-transferable licence to use those materials as part of the Deliverables for your internal business purposes.

11.5 You must not resell, redistribute, sublicense, copy, reverse engineer, or commercially exploit our pre-existing materials as standalone products or services unless we agree in writing.

11.6 Third-Party Services, open-source software, stock assets, fonts, plugins, and other third-party materials may be subject to separate licences and restrictions.

11.7 We may use general knowledge, skills, ideas, methods, and experience gained during the project for our wider business, provided we do not disclose your confidential information.

11.8 We may refer to your business name, logo, and a general description of the work carried out in our portfolio, marketing, proposals, or case studies, unless you ask us not to in writing.`,
  },
  {
    title: '12. Confidentiality',
    content: `12.1 Each party agrees to keep confidential any confidential business, technical, financial, commercial, operational, or proprietary information received from the other party.

12.2 Confidential information must not be disclosed to third parties except where required to deliver the Services, where required by law, where already public, or where the disclosing party has given permission.

12.3 We may share confidential information with subcontractors, advisers, and service providers where reasonably necessary to deliver the Services, provided appropriate confidentiality obligations apply.

12.4 The confidentiality obligations in this section continue for 3 years after the end of the Agreement.

12.5 Confidentiality obligations do not apply to information that is already public, independently developed, lawfully received from another source, or required to be disclosed by law or court order.`,
  },
  {
    title: '13. Data Protection and Privacy',
    content: `13.1 Each party agrees to comply with applicable UK data protection laws, including the UK GDPR and the Data Protection Act 2018.

13.2 Where we process personal data as a controller, we will do so in accordance with our Privacy Policy.

13.3 Where we process personal data on your behalf as a processor, the parties will put in place an appropriate Data Processing Agreement or data processing terms before the relevant processing begins.

13.4 You are responsible for ensuring that you have a lawful basis to collect, use, share, and instruct us to process any personal data you provide to us.

13.5 You are responsible for ensuring that your own privacy notices, cookie notices, consent mechanisms, data retention practices, and marketing permissions are appropriate for your business.

13.6 We will take reasonable technical and organisational measures to protect personal data processed as part of the Services.

13.7 You acknowledge that some Third-Party Services may process personal data outside the United Kingdom. You are responsible for reviewing and accepting the relevant provider terms, privacy policies, and data transfer arrangements unless we agree otherwise in writing.`,
  },
  {
    title: '14. Security',
    content: `14.1 We will take reasonable steps to protect systems, accounts, credentials, and data used in connection with the Services.

14.2 No website, AI system, automation, integration, or digital system can be guaranteed to be completely secure or error-free.

14.3 You are responsible for using strong passwords, enabling multi-factor authentication where available, managing user permissions, removing access when staff leave, and maintaining appropriate internal security controls.

14.4 Unless expressly agreed in writing, our Services do not include penetration testing, formal cybersecurity audits, legal compliance audits, or regulated security certification.`,
  },
  {
    title: '15. Website, Hosting, and Launch',
    content: `15.1 Where we build or assist with a website, you are responsible for reviewing and approving all content, functionality, links, forms, tracking, legal pages, and customer journeys before launch.

15.2 Unless otherwise agreed, you are responsible for domain ownership, hosting accounts, website platform subscriptions, email accounts, backups, and ongoing maintenance after launch.

15.3 We are not responsible for search engine ranking, website traffic, conversions, enquiries, sales, or advertising results unless specific services and success measures are agreed in writing.

15.4 We may provide support after launch if agreed in writing. Otherwise, post-launch support may be charged separately.`,
  },
  {
    title: '16. Support and Maintenance',
    content: `16.1 Ongoing support, maintenance, monitoring, optimisation, reporting, or updates are only included where agreed in writing.

16.2 If support is provided on a monthly retainer, the included support allowance, response times, and scope will be set out in the relevant proposal or agreement.

16.3 Unless otherwise agreed, unused monthly support time does not roll over.

16.4 We may charge separately for urgent support, out-of-hours work, emergency fixes, major changes, third-party platform issues, or issues caused by changes made by you or another supplier.`,
  },
  {
    title: '17. Warranties and Disclaimers',
    content: `17.1 We warrant that we will provide the Services with reasonable skill and care.

17.2 Except as expressly stated in these Terms or required by law, we do not give any warranties, guarantees, or representations about the Services or Deliverables.

17.3 We do not guarantee that any website, automation, AI tool, chatbot, CRM setup, integration, campaign, or digital process will be uninterrupted, error-free, secure, profitable, or achieve any particular business result.

17.4 You acknowledge that digital systems may require ongoing testing, monitoring, updates, maintenance, and improvement.

17.5 You are responsible for making final business decisions based on the Deliverables and for obtaining legal, financial, tax, regulatory, or specialist advice where required.`,
  },
  {
    title: '18. Limitation of Liability',
    content: `18.1 Nothing in these Terms limits or excludes liability for death or personal injury caused by negligence, fraud, fraudulent misrepresentation, or any other liability that cannot legally be limited or excluded.

18.2 Subject to clause 18.1, our total liability to you for all claims arising out of or in connection with the Services shall not exceed the total fees paid by you to us for the relevant Services in the 3 months immediately preceding the event giving rise to the claim.

18.3 Subject to clause 18.1, we will not be liable for indirect, consequential, special, or incidental loss, or for loss of profit, loss of revenue, loss of business, loss of opportunity, loss of goodwill, loss of anticipated savings, loss of data, reputational damage, or business interruption.

18.4 We will not be liable for losses caused by your failure to provide accurate information, timely approvals, required access, lawful Client Materials, or appropriate human review of Deliverables and AI outputs.

18.5 We will not be liable for losses caused by Third-Party Services, including outages, price changes, API changes, data loss, security incidents, or changes to third-party terms or functionality.

18.6 You agree to take reasonable steps to reduce or avoid any loss you may suffer.`,
  },
  {
    title: '19. Indemnity',
    content: `19.1 You agree to indemnify us against losses, damages, claims, costs, and expenses arising from:

(a) Client Materials you provide to us;
(b) your breach of these Terms;
(c) your unlawful or improper use of the Services or Deliverables;
(d) your breach of third-party rights;
(e) your breach of data protection, marketing, advertising, employment, regulatory, or other legal obligations; or
(f) instructions you give us that cause us to breach law, third-party rights, or third-party platform terms.`,
  },
  {
    title: '20. Termination',
    content: `20.1 Either party may terminate an ongoing engagement by giving 14 days' written notice unless a different notice period is agreed in writing.

20.2 If you terminate a project before completion, you must pay for all work completed, costs incurred, committed third-party costs, and non-cancellable expenses up to the termination date.

20.3 We may terminate or suspend the Services immediately if:

(a) you fail to pay an invoice on time;
(b) you materially breach these Terms;
(c) you fail to provide required information, access, or approvals;
(d) you use the Services or Deliverables unlawfully or inappropriately;
(e) continuing the Services would create legal, regulatory, security, reputational, or operational risk for us; or
(f) a Third-Party Service required for the project becomes unavailable or unsuitable.

20.4 Upon termination, we will provide you with completed Deliverables to which you are entitled, subject to payment of all outstanding fees.

20.5 Termination does not affect any rights, obligations, or liabilities that have already arisen.`,
  },
  {
    title: '21. Force Majeure',
    content: `21.1 We will not be liable for delay or failure to perform our obligations where caused by events outside our reasonable control.

21.2 This may include internet outages, cyber incidents, illness, power failures, strikes, supplier failure, changes to law, war, terrorism, natural disasters, platform outages, API failures, or failure of Third-Party Services.`,
  },
  {
    title: '22. Non-Solicitation',
    content: `22.1 During the engagement and for 6 months after it ends, you agree not to knowingly solicit or hire any employee, contractor, or subcontractor of GrowthOps AI who was involved in delivering the Services, without our prior written consent.

22.2 This does not prevent general recruitment advertising that is not specifically targeted at our personnel.`,
  },
  {
    title: '23. Notices',
    content: `23.1 Notices under these Terms must be sent by email unless otherwise agreed.

23.2 Notices to GrowthOps AI should be sent to: hello@growthops.ai

23.3 Notices to you will be sent to the email address you provide to us.

23.4 Notices are treated as received on the next working day after sending, provided no delivery failure message is received.`,
  },
  {
    title: '24. Dispute Resolution',
    content: `24.1 If a dispute arises, both parties agree to first try to resolve it informally and in good faith.

24.2 Either party may raise a dispute by emailing the other party with details of the issue.

24.3 If the dispute cannot be resolved within 30 days, either party may pursue the matter through the courts of England and Wales.

24.4 Nothing in this section prevents either party from seeking urgent court relief where necessary.`,
  },
  {
    title: '25. Governing Law and Jurisdiction',
    content: `25.1 These Terms and any dispute or claim arising out of or in connection with them shall be governed by the laws of England and Wales.

25.2 The courts of England and Wales shall have exclusive jurisdiction to settle any dispute or claim arising out of or in connection with these Terms, the Services, or the Agreement.`,
  },
  {
    title: '26. Changes to These Terms',
    content: `26.1 We may update these Terms from time to time.

26.2 The version in force at the time you agree to purchase Services will apply to that engagement, unless we agree otherwise in writing.

26.3 We will notify active clients of material changes where reasonably practicable.

26.4 Continued use of our Services after updated Terms take effect may constitute acceptance of the updated Terms.`,
  },
  {
    title: '27. General',
    content: `27.1 You may not transfer your rights or obligations under the Agreement without our prior written consent.

27.2 We may transfer our rights and obligations where required as part of a business transfer, restructuring, or change in trading structure, provided this does not materially reduce your rights.

27.3 If any part of these Terms is found to be invalid or unenforceable, the rest of the Terms will continue in effect.

27.4 A failure or delay in enforcing any right under these Terms does not mean that right has been waived.

27.5 Nothing in these Terms creates a partnership, joint venture, employment relationship, or agency relationship between the parties.

27.6 No person other than you and GrowthOps AI has any right to enforce these Terms.`,
  },
  {
    title: '28. Contact',
    content: `For questions about these Terms, please contact:

GrowthOps AI
Email: hello@growthops.ai
Website: growthops.ai`,
  },
]

export default function TermsPage() {
  return (
    <>
      <SEO
        title="Terms and Conditions"
        description="Terms and Conditions governing the use of GrowthOps AI services and client portal."
        path="/terms-of-service"
      />
      <PageHero
        label="Legal"
        title="Terms and Conditions"
        titleAccent=""
        subtitle="Last updated: June 2026"
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
              These Terms and Conditions apply to business clients who purchase services from
              GrowthOps AI. Please read them carefully before using our services, website, client
              portal, or any deliverables we provide. These Terms should be read together with any
              proposal, statement of work, order form, invoice, or written agreement between us.
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
