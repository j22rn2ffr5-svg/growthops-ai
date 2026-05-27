import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { X, CheckCircle2, DollarSign } from 'lucide-react'

const inHouseItems = [
  'Web developer / designer',
  'Marketing manager',
  'Automation specialist',
  'Data analyst',
  'CRM administrator',
  'Content writer',
  'Paid ads manager',
  'SEO specialist',
]

const agencyItems = [
  { text: 'One joined-up strategy', good: true },
  { text: 'Significantly lower overhead', good: true },
  { text: 'Faster time to implementation', good: true },
  { text: 'No recruitment or HR overhead', good: true },
  { text: 'Measurable, accountable performance', good: true },
  { text: 'Less management required', good: true },
  { text: 'Scales with your business', good: true },
  { text: 'One point of contact', good: true },
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

export default function ROI() {
  return (
    <section id="roi" className="py-24 md:py-32 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(59,130,246,0.05) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-16">
            <span className="section-label">
              <DollarSign size={12} />
              Return on Investment
            </span>
            <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Reduce overheads.{' '}
              <span className="gradient-text">Increase performance.</span>
            </h2>
            <p className="mt-5 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Hiring individual specialists across web, marketing, automation, CRM, analytics, and
              content can cost hundreds of thousands per year. GrowthOps AI gives you access to a
              complete growth infrastructure at a fraction of that cost.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* In-house */}
          <FadeUp delay={0.1}>
            <div
              className="rounded-2xl p-6 h-full"
              style={{
                background: 'rgba(248,113,113,0.05)',
                border: '1px solid rgba(248,113,113,0.15)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(248,113,113,0.12)' }}
                >
                  <X size={18} color="#f87171" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">In-House Team</div>
                  <div className="text-xs text-gray-500">High cost, slow to build</div>
                </div>
              </div>
              <div className="space-y-2.5">
                {inHouseItems.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400/50 flex-shrink-0" />
                    <span className="text-sm text-gray-400">{item}</span>
                  </div>
                ))}
              </div>
              <div
                className="mt-6 px-4 py-3 rounded-xl text-center"
                style={{ background: 'rgba(248,113,113,0.08)' }}
              >
                <div className="text-xs text-gray-500 mb-1">Typical annual cost</div>
                <div className="text-xl font-bold text-red-400">£250,000 – £450,000+</div>
                <div className="text-xs text-gray-600 mt-1">Salaries, benefits, tools, management overhead</div>
              </div>
            </div>
          </FadeUp>

          {/* Agency */}
          <FadeUp delay={0.2}>
            <div
              className="rounded-2xl p-6 h-full relative"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.07) 0%, rgba(139,92,246,0.07) 100%)',
                border: '1px solid rgba(96,165,250,0.2)',
              }}
            >
              <div
                className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}
              >
                Recommended
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(59,130,246,0.15)' }}
                >
                  <CheckCircle2 size={18} color="#60a5fa" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">GrowthOps AI System</div>
                  <div className="text-xs text-gray-500">Complete growth infrastructure</div>
                </div>
              </div>
              <div className="space-y-2.5">
                {agencyItems.map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <CheckCircle2 size={14} color="#34d399" className="flex-shrink-0" />
                    <span className="text-sm text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
              <div
                className="mt-6 px-4 py-3 rounded-xl text-center"
                style={{
                  background: 'rgba(59,130,246,0.08)',
                  border: '1px solid rgba(59,130,246,0.15)',
                }}
              >
                <div className="text-xs text-gray-500 mb-1">Investment</div>
                <div className="text-xl font-bold gradient-text">A fraction of the cost</div>
                <div className="text-xs text-gray-600 mt-1">Request a custom quote for your business</div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
