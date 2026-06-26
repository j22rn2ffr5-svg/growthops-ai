import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Search, Layout, Settings, Bot, Rocket, BarChart3 } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Audit & Strategy',
    description:
      'We review your current website, marketing, tools, and sales process to identify exactly where you\'re losing leads and revenue — then build a growth plan around it.',
    color: '#60a5fa',
  },
  {
    number: '02',
    icon: Layout,
    title: 'Website & Funnel Build',
    description:
      'Your new conversion-focused website or landing page is designed and built to reflect your brand, communicate your value, and turn visitors into enquiries.',
    color: '#a78bfa',
  },
  {
    number: '03',
    icon: Settings,
    title: 'CRM & Automation Setup',
    description:
      'We connect your systems, configure your CRM pipeline, and build the automations that ensure every lead is captured, followed up, and tracked without manual effort.',
    color: '#34d399',
  },
  {
    number: '04',
    icon: Bot,
    title: 'AI & Lead Capture Integration',
    description:
      'AI chatbots and lead capture tools are embedded across your digital presence so potential customers are engaged and qualified immediately, day or night.',
    color: '#f59e0b',
  },
  {
    number: '05',
    icon: Rocket,
    title: 'Marketing & Content Launch',
    description:
      'Your SEO strategy, content plan, and paid campaigns go live — each one aligned with the conversion system and feeding directly into your CRM.',
    color: '#fb923c',
  },
  {
    number: '06',
    icon: BarChart3,
    title: 'Reporting, Optimisation & Support',
    description:
      'Monthly performance reviews surface what\'s working, what to improve, and where to invest next — keeping your growth system continuously improving.',
    color: '#f472b6',
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

export default function Process() {
  return (
    <section id="process" className="py-24 md:py-32 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 40% at 50% 60%, rgba(139,92,246,0.05) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-16">
            <span className="section-label">How It Works</span>
            <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              How we build your{' '}
              <span className="gradient-text">growth system.</span>
            </h2>
            <p className="mt-5 text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
              A structured, six-stage process from initial audit to ongoing optimisation.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <FadeUp key={step.number} delay={i * 0.08}>
                <div
                  className="relative p-6 rounded-2xl h-full card-hover"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  {/* Step number */}
                  <div
                    className="absolute top-5 right-5 text-xs font-bold tabular-nums"
                    style={{ color: 'rgba(255,255,255,0.1)', fontSize: '2.5rem', lineHeight: 1 }}
                  >
                    {step.number}
                  </div>

                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: `${step.color}18` }}
                  >
                    <Icon size={22} color={step.color} />
                  </div>

                  <h3 className="text-base font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>

                  {/* Connector line for non-last items on desktop */}
                  {i < steps.length - 1 && (
                    <div
                      className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-px"
                      style={{ background: `linear-gradient(90deg, ${step.color}40, transparent)` }}
                    />
                  )}
                </div>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}
