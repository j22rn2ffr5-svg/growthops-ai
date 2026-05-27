import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { BellOff, ClipboardList, BarChart2, Unplug } from 'lucide-react'

const problems = [
  {
    icon: BellOff,
    title: 'Missed Enquiries',
    description:
      'Leads arrive through multiple channels — phone, email, social, forms — but without a system in place, many go unanswered or receive slow responses that cost you the sale.',
    color: '#f87171',
    bg: 'rgba(248,113,113,0.08)',
    border: 'rgba(248,113,113,0.15)',
  },
  {
    icon: ClipboardList,
    title: 'Manual Admin',
    description:
      'Time spent on repetitive tasks — chasing quotes, re-entering data, manually sending follow-ups — drains resource that should be going into growing the business.',
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.08)',
    border: 'rgba(251,146,60,0.15)',
  },
  {
    icon: BarChart2,
    title: 'Poor Conversion Tracking',
    description:
      'Without clear visibility into where leads come from and which convert to revenue, marketing spend is guesswork and profitable channels go unscaled.',
    color: '#facc15',
    bg: 'rgba(250,204,21,0.08)',
    border: 'rgba(250,204,21,0.15)',
  },
  {
    icon: Unplug,
    title: 'Disconnected Systems',
    description:
      'When your CRM, website, email platform, and ad accounts don\'t talk to each other, you lose data, context, and continuity — and customers feel the friction.',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.15)',
  },
]

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
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

export default function Problem() {
  return (
    <section id="problem" className="py-24 md:py-32 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(239,68,68,0.04) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-16">
            <span className="section-label" style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
              The Problem
            </span>
            <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Most businesses are losing leads{' '}
              <span style={{ color: '#f87171' }}>without realising it.</span>
            </h2>
            <p className="mt-5 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Small and medium-sized businesses often have disconnected tools, slow follow-up, poor
              tracking, outdated websites, weak automation, and no clear view of what marketing
              activity is actually producing revenue.
            </p>
          </div>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {problems.map((p, i) => {
            const Icon = p.icon
            return (
              <FadeUp key={p.title} delay={i * 0.1}>
                <div
                  className="rounded-2xl p-6 h-full card-hover"
                  style={{ background: p.bg, border: `1px solid ${p.border}` }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: `${p.color}18` }}
                  >
                    <Icon size={22} color={p.color} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{p.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{p.description}</p>
                </div>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}
