import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Info } from 'lucide-react'

const cases = [
  {
    sector: 'Home Improvement',
    label: 'Local trades business',
    color: '#60a5fa',
    borderColor: 'rgba(96,165,250,0.2)',
    bgColor: 'rgba(59,130,246,0.05)',
    problem:
      'Leads from Facebook, Google, phone, and web forms were not being tracked properly. Follow-ups were manual and inconsistent, meaning warm leads were going cold.',
    solution:
      'Built a new conversion-focused website, set up a CRM pipeline with automated SMS/email follow-up, deployed an AI chatbot, and installed a reporting dashboard.',
    results: [
      { metric: '+38%', label: 'Increase in booked consultations' },
      { metric: '< 2 min', label: 'Follow-up time (down from 24 hours)' },
      { metric: '15+ hrs', label: 'Admin saved per week' },
      { metric: 'Full', label: 'Lead source visibility' },
    ],
  },
  {
    sector: 'Private Dental Clinic',
    label: 'Healthcare provider',
    color: '#a78bfa',
    borderColor: 'rgba(167,139,250,0.2)',
    bgColor: 'rgba(139,92,246,0.05)',
    problem:
      'Reception was overloaded with repetitive enquiries and appointment requests. Marketing performance was difficult to measure, making budget decisions difficult.',
    solution:
      'Installed an AI chatbot for common queries, automated appointment enquiry workflows, segmented the CRM, created email nurture sequences, and built a monthly performance dashboard.',
    results: [
      { metric: '42%', label: 'Reduction in repetitive admin enquiries' },
      { metric: '+27%', label: 'Increase in appointment requests' },
      { metric: 'Improved', label: 'Patient follow-up consistency' },
      { metric: 'Clear', label: 'Campaign ROI tracking' },
    ],
  },
  {
    sector: 'B2B Consultancy',
    label: 'Professional services',
    color: '#34d399',
    borderColor: 'rgba(52,211,153,0.2)',
    bgColor: 'rgba(52,211,153,0.05)',
    problem:
      'The business relied heavily on referrals with no scalable lead generation. The website was outdated, and there was no structured follow-up after sending proposals.',
    solution:
      'Redesigned the website with authority positioning, built an SEO content plan, created a LinkedIn lead funnel, set up CRM and automated proposal follow-up, and deployed an analytics dashboard.',
    results: [
      { metric: '3×', label: 'More qualified monthly enquiries' },
      { metric: 'Automated', label: 'Proposal follow-up sequences' },
      { metric: 'Measurable', label: 'Sales pipeline for the first time' },
      { metric: '10+ hrs', label: 'Saved per week for the founder' },
    ],
  },
]

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

export default function CaseStudies() {
  return (
    <section id="case-studies" className="py-24 md:py-32 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(59,130,246,0.04) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-6">
            <span className="section-label">Example Scenarios</span>
            <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              What we build and{' '}
              <span className="gradient-text">how it typically works.</span>
            </h2>
            <p className="mt-5 text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
              Illustrative examples of the systems we build for businesses at different stages.
            </p>
          </div>

          {/* Disclaimer */}
          <div
            className="flex items-center gap-3 max-w-xl mx-auto mb-14 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <Info size={15} className="text-gray-500 flex-shrink-0" />
            <p className="text-xs text-gray-500 leading-relaxed">
              These are example business cases illustrating typical client outcomes. They are not
              verified testimonials or specific client case studies.
            </p>
          </div>
        </FadeUp>

        <div className="grid lg:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <FadeUp key={c.sector} delay={i * 0.12}>
              <div
                className="rounded-2xl overflow-hidden h-full flex flex-col"
                style={{ background: c.bgColor, border: `1px solid ${c.borderColor}` }}
              >
                {/* Header */}
                <div className="px-6 pt-6 pb-5" style={{ borderBottom: `1px solid ${c.borderColor}` }}>
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: c.color }}
                  >
                    {c.label}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">{c.sector}</h3>
                </div>

                <div className="px-6 py-5 flex flex-col gap-5 flex-1">
                  {/* Problem */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">The Challenge</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{c.problem}</p>
                  </div>

                  {/* Solution */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">What We Built</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{c.solution}</p>
                  </div>

                  {/* Results */}
                  <div className="mt-auto">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Illustrative Outcomes</p>
                    <div className="grid grid-cols-2 gap-2">
                      {c.results.map((r) => (
                        <div
                          key={r.label}
                          className="p-3 rounded-xl"
                          style={{ background: 'rgba(0,0,0,0.25)' }}
                        >
                          <div className="text-lg font-bold mb-0.5" style={{ color: c.color }}>
                            {r.metric}
                          </div>
                          <div className="text-xs text-gray-500 leading-snug">{r.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
