import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Info, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react'
import PageHero from '../components/PageHero'
import CTA from '../components/CTA'
import SEO from '../components/SEO'

const cases = [
  {
    sector: 'Home Improvement Company',
    type: 'Local trades business',
    color: '#60a5fa',
    borderColor: 'rgba(96,165,250,0.2)',
    bgColor: 'rgba(59,130,246,0.05)',
    challenge: {
      headline: 'Leads arriving from multiple channels with no system to track or follow up.',
      detail:
        'The business was generating enquiries through Facebook Ads, Google Ads, phone calls, and website contact forms — but had no single system tying them together. Follow-up was handled manually by whoever was available, leading to inconsistent response times and lost opportunities. There was no visibility into which channel was producing the best leads, making it impossible to optimise marketing spend.',
      painPoints: [
        'Enquiries from multiple channels with no central tracking',
        'Manual and inconsistent follow-up by the team',
        'Response times averaging 24 hours or more',
        'No view of which marketing channel was producing revenue',
        'Admin taking 15+ hours per week of team time',
      ],
    },
    solution: {
      headline: 'A connected website, CRM, automation, and reporting system built from scratch.',
      detail:
        'We rebuilt the website with conversion in mind — stronger calls to action, clearer service messaging, and a faster mobile experience. We then connected all lead sources into a single CRM pipeline, built automated SMS and email follow-up triggered on lead submission, and deployed an AI chatbot to handle out-of-hours enquiries. A reporting dashboard was built to show lead source, volume, and conversion rate in real time.',
      services: [
        'New conversion-focused website',
        'CRM pipeline with deal stage tracking',
        'Automated SMS follow-up within 2 minutes of enquiry',
        'Automated email nurture sequence',
        'AI chatbot for out-of-hours enquiries',
        'Live reporting dashboard (lead source and conversion)',
      ],
    },
    results: [
      { metric: '+38%', label: 'Increase in booked consultations' },
      { metric: '< 2 min', label: 'Average follow-up time (was 24 hrs)' },
      { metric: '15+ hrs', label: 'Admin time saved per week' },
      { metric: 'Full', label: 'Lead source visibility achieved' },
    ],
    outcome:
      'The business now has a clear view of what\'s generating revenue, spends significantly less time on admin, and responds to enquiries faster than any competitor in their area.',
  },
  {
    sector: 'Private Dental Clinic',
    type: 'Healthcare provider',
    color: '#a78bfa',
    borderColor: 'rgba(167,139,250,0.2)',
    bgColor: 'rgba(139,92,246,0.05)',
    challenge: {
      headline: 'Reception team overwhelmed with repetitive enquiries and no marketing visibility.',
      detail:
        'The clinic\'s reception team was spending a significant portion of each day answering the same questions — opening hours, pricing, appointment availability — via phone and email. This left less time for high-value patient interactions. Meanwhile, the clinic had been running Google and Meta ads for several months but had no way to measure which campaigns were driving actual appointments.',
      painPoints: [
        'Reception spending hours daily on repetitive patient queries',
        'No system to track which marketing activity produced appointments',
        'Inconsistent follow-up after initial patient enquiries',
        'No patient segmentation or re-engagement process',
        'Marketing budget being spent without measurable results',
      ],
    },
    solution: {
      headline: 'AI chatbot, automated workflows, CRM segmentation, and a performance dashboard.',
      detail:
        'We deployed an AI chatbot trained on the clinic\'s services, FAQs, and pricing to handle common queries automatically. Appointment enquiry workflows were automated so patients received an immediate response and booking link. The CRM was segmented by treatment type and patient status, enabling targeted email campaigns. A monthly performance dashboard was built connecting ad spend to actual appointment requests.',
      services: [
        'AI chatbot trained on clinic FAQs, pricing, and services',
        'Automated appointment enquiry response and booking workflow',
        'CRM segmentation by treatment type and patient status',
        'Email nurture campaigns for new and lapsed patients',
        'Conversion tracking linked to ad campaigns',
        'Monthly performance dashboard with ROI reporting',
      ],
    },
    results: [
      { metric: '42%', label: 'Reduction in repetitive admin enquiries' },
      { metric: '+27%', label: 'Increase in appointment requests' },
      { metric: 'Consistent', label: 'Patient follow-up for the first time' },
      { metric: 'Clear', label: 'Campaign ROI visibility' },
    ],
    outcome:
      'Reception now focuses on high-value patient interactions. The clinic has measurable marketing performance for the first time and can allocate budget confidently.',
  },
  {
    sector: 'B2B Management Consultancy',
    type: 'Professional services firm',
    color: '#34d399',
    borderColor: 'rgba(52,211,153,0.2)',
    bgColor: 'rgba(52,211,153,0.04)',
    challenge: {
      headline: 'No scalable lead generation system and a sales process that relied entirely on referrals.',
      detail:
        'The consultancy had grown well through referrals but had hit a ceiling. The founder wanted to diversify lead sources but had no structured approach to outbound, content, or digital. The website was outdated and failed to convey the firm\'s expertise. There was also no CRM — proposals were tracked manually via spreadsheet and follow-up often fell through the cracks, particularly after sending a proposal.',
      painPoints: [
        'Entirely referral-dependent with no scalable lead channel',
        'Outdated website that failed to position the firm\'s authority',
        'No structured outbound or content strategy',
        'Proposals tracked manually via spreadsheet',
        'Inconsistent follow-up after proposals sent',
        'Founder spending 10+ hours per week on sales admin',
      ],
    },
    solution: {
      headline: 'Authority website, SEO strategy, LinkedIn funnel, CRM, and automated proposal follow-up.',
      detail:
        'We redesigned the website to lead with outcomes and credibility — including sector expertise, case study content, and clear service positioning. An SEO content plan was developed around the firm\'s target sectors. A structured LinkedIn outbound campaign was built and connected to a CRM pipeline. Automated proposal follow-up sequences were built so no opportunity was lost due to lack of contact. A performance dashboard tracked pipeline value and lead source.',
      services: [
        'Authority-positioned website redesign',
        'SEO content strategy and article production',
        'LinkedIn outbound lead generation campaign',
        'CRM pipeline setup and deal stage configuration',
        'Automated proposal follow-up email sequence',
        'Sales pipeline and lead source dashboard',
      ],
    },
    results: [
      { metric: '3×', label: 'More qualified monthly enquiries' },
      { metric: 'Automated', label: 'Proposal follow-up — zero manual effort' },
      { metric: 'Measurable', label: 'Sales pipeline for the first time' },
      { metric: '10+ hrs', label: 'Saved per week for the founder' },
    ],
    outcome:
      'The firm now has a predictable pipeline with multiple lead sources. The founder spends time on client delivery, not chasing proposals — and can see exactly where each opportunity came from.',
  },
]

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay }}
    >
      {children}
    </motion.div>
  )
}

export default function CaseStudiesPage() {
  return (
    <>
      <SEO
        title="Example Growth Systems"
        description="See the types of AI, CRM, and automation systems GrowthOps AI builds for SMBs — with the challenges, approach, and typical outcomes."
        path="/case-studies"
      />

      <PageHero
        label="Example Growth Systems"
        title="The systems we build and"
        titleAccent="how they perform."
        subtitle="Three detailed scenarios showing the challenges, approach, and typical outcomes for businesses at different stages."
      />

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto px-6 mb-14">
        <div
          className="flex items-start gap-3 px-5 py-4 rounded-xl max-w-2xl mx-auto"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <Info size={15} className="text-gray-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 leading-relaxed">
            These are illustrative examples showing the types of systems we build and the kinds of
            outcomes businesses can expect. They are not named client testimonials. Real client
            results will be published as projects are completed. Outcomes vary by business, market,
            and implementation.
          </p>
        </div>
      </div>

      <section className="pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          {cases.map((c) => (
            <FadeUp key={c.sector} delay={0.05}>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: c.bgColor, border: `1px solid ${c.borderColor}` }}
              >
                {/* Header */}
                <div
                  className="px-8 md:px-10 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  style={{ borderBottom: `1px solid ${c.borderColor}` }}
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: c.color }}>
                      {c.type}
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">{c.sector}</h2>
                  </div>
                  <div
                    className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: `${c.color}18`, color: c.color, border: `1px solid ${c.borderColor}` }}
                  >
                    <TrendingUp size={12} />
                    Example outcomes
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-0">
                  {/* Challenge */}
                  <div className="px-8 md:px-10 py-8" style={{ borderBottom: `1px solid ${c.borderColor}` }}>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">The Challenge</p>
                    <p className="text-base font-semibold text-white mb-3 leading-snug">{c.challenge.headline}</p>
                    <p className="text-sm text-gray-400 leading-relaxed mb-5">{c.challenge.detail}</p>
                    <div className="space-y-2">
                      {c.challenge.painPoints.map((p) => (
                        <div key={p} className="flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400/50 flex-shrink-0 mt-2" />
                          <span className="text-xs text-gray-500 leading-relaxed">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Solution */}
                  <div
                    className="px-8 md:px-10 py-8"
                    style={{
                      borderBottom: `1px solid ${c.borderColor}`,
                      borderLeft: `1px solid ${c.borderColor}`,
                    }}
                  >
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">What We Built</p>
                    <p className="text-base font-semibold text-white mb-3 leading-snug">{c.solution.headline}</p>
                    <p className="text-sm text-gray-400 leading-relaxed mb-5">{c.solution.detail}</p>
                    <div className="space-y-2">
                      {c.solution.services.map((s) => (
                        <div key={s} className="flex items-start gap-2.5">
                          <CheckCircle2 size={13} color={c.color} className="flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-gray-400 leading-relaxed">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="px-8 md:px-10 py-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-5">Typical Outcomes</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {c.results.map((r) => (
                      <div
                        key={r.label}
                        className="p-4 rounded-xl text-center"
                        style={{ background: 'rgba(0,0,0,0.25)' }}
                      >
                        <div className="text-2xl font-bold mb-1" style={{ color: c.color }}>{r.metric}</div>
                        <div className="text-xs text-gray-500 leading-snug">{r.label}</div>
                      </div>
                    ))}
                  </div>
                  <div
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: `${c.color}0d`, border: `1px solid ${c.borderColor}` }}
                  >
                    <TrendingUp size={15} color={c.color} className="flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-300 leading-relaxed">{c.outcome}</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* CTA nudge */}
        <FadeUp delay={0.1}>
          <div className="max-w-7xl mx-auto px-6 mt-10">
            <div
              className="rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))',
                border: '1px solid rgba(96,165,250,0.18)',
              }}
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  See what this could look like for your business.
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
                  Book a free strategy call and we'll review your current situation — identifying
                  exactly where the biggest opportunities are for your specific business.
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  No pressure. If we don't think we can help, we'll tell you directly.
                </p>
              </div>
              <Link
                to="/book"
                className="btn-primary text-sm flex-shrink-0"
                style={{ textDecoration: 'none' }}
              >
                Book a Strategy Call <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </FadeUp>
      </section>

      <CTA />
    </>
  )
}
