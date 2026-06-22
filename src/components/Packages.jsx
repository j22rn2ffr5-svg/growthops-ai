import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { CheckCircle2, ArrowRight, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const packages = [
  {
    name: 'Launch',
    tagline: 'A fast, professional online presence to start generating leads.',
    color: '#60a5fa',
    borderColor: 'rgba(96,165,250,0.2)',
    bgColor: 'rgba(59,130,246,0.05)',
    featured: false,
    includes: [
      'AI-assisted website build',
      'Mobile-first, fast-loading design',
      'Lead capture form',
      'Analytics and tracking setup',
      '1 month of support during setup',
      'Full handover on completion',
    ],
  },
  {
    name: 'Foundations',
    tagline: 'A proper multi-page website with the systems to back it up.',
    color: '#c084fc',
    borderColor: 'rgba(192,132,252,0.2)',
    bgColor: 'rgba(168,85,247,0.05)',
    featured: false,
    includes: [
      'Custom multi-page website (up to 6 pages)',
      'CRM setup and lead pipeline',
      'Automated email follow-up sequence',
      'Analytics and conversion tracking',
      'Monthly performance report',
    ],
  },
  {
    name: 'Growth System',
    tagline: 'A complete system to generate, nurture, and convert more leads.',
    color: '#a78bfa',
    borderColor: 'rgba(167,139,250,0.35)',
    bgColor: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.08) 100%)',
    featured: true,
    includes: [
      'Custom multi-page website design and development',
      'Full CRM pipeline setup and deal tracking',
      'AI chatbot trained on your business',
      'Email and SMS follow-up automation',
      'SEO strategy and content foundations',
      'Live reporting dashboard',
      'Monthly strategy review call',
    ],
  },
  {
    name: 'Scale',
    tagline: 'Your entire growth function, managed and scaled.',
    color: '#34d399',
    borderColor: 'rgba(52,211,153,0.2)',
    bgColor: 'rgba(52,211,153,0.04)',
    featured: false,
    includes: [
      'Everything in Growth System',
      'Paid advertising management (Google and Meta)',
      'Advanced multi-step automation workflows',
      'Conversion rate optimisation programme',
      'Full analytics and attribution dashboard',
      'Dedicated account manager',
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

export default function Packages() {
  return (
    <section id="packages" className="py-24 md:py-32 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(59,130,246,0.05) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-16">
            <span className="section-label">Packages</span>
            <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Choose the right system{' '}
              <span className="gradient-text">for your stage.</span>
            </h2>
            <p className="mt-5 text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
              Every engagement is tailored to your business. These packages give you a starting
              point — pricing is bespoke based on your requirements.
            </p>
          </div>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {packages.map((pkg, i) => (
            <FadeUp key={pkg.name} delay={i * 0.1}>
              <div
                className="rounded-2xl overflow-hidden relative h-full flex flex-col"
                style={{
                  background: pkg.bgColor,
                  border: `1px solid ${pkg.borderColor}`,
                  ...(pkg.featured ? { boxShadow: '0 0 60px rgba(139,92,246,0.15)' } : {}),
                }}
              >
                {pkg.featured && (
                  <div
                    className="flex items-center justify-center gap-2 py-2 text-xs font-bold tracking-widest uppercase"
                    style={{
                      background: 'linear-gradient(90deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))',
                      borderBottom: '1px solid rgba(167,139,250,0.2)',
                      color: '#c4b5fd',
                    }}
                  >
                    <Zap size={11} fill="currentColor" />
                    Most Popular
                  </div>
                )}

                <div className="p-7 flex flex-col flex-1">
                  <span
                    className="text-xs font-bold uppercase tracking-widest mb-3"
                    style={{ color: pkg.color }}
                  >
                    {pkg.name}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2 leading-snug">{pkg.tagline}</h3>

                  <div className="mt-6 space-y-3 flex-1">
                    {pkg.includes.map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <CheckCircle2 size={15} color={pkg.color} className="flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300 leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/book"
                    className="mt-8 flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={
                      pkg.featured
                        ? {
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            color: 'white',
                            boxShadow: '0 0 24px rgba(59,130,246,0.35)',
                            textDecoration: 'none',
                          }
                        : {
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'white',
                            textDecoration: 'none',
                          }
                    }
                  >
                    Book a Free Strategy Call
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.4}>
          <p className="text-center text-sm text-gray-600 mt-8">
            Not sure which is right for you?{' '}
            <Link to="/book" className="text-blue-400 hover:text-blue-300 transition-colors" style={{ textDecoration: 'none' }}>
              Book a free strategy call
            </Link>{' '}
            and we'll work out the best fit together.
          </p>
        </FadeUp>
      </div>
    </section>
  )
}
