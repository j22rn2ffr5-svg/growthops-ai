import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { CheckCircle2, Layers } from 'lucide-react'
import { Link } from 'react-router-dom'

const pillars = [
  'Website & Funnel Development',
  'CRM Setup & Integration',
  'Marketing Automation',
  'AI Chatbots & Lead Capture',
  'SEO & Content Strategy',
  'Paid Advertising Management',
  'Analytics & Reporting',
  'Conversion Rate Optimisation',
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

export default function Solution() {
  return (
    <section
      id="solution"
      className="py-24 md:py-32 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(59,130,246,0.06) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <FadeUp>
              <span className="section-label mb-5 inline-flex">
                <Layers size={12} />
                The Solution
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mt-5">
                One integrated system for growth,{' '}
                <span className="gradient-text">automation, and performance.</span>
              </h2>
              <p className="mt-6 text-lg text-gray-400 leading-relaxed">
                We don't sell individual services in isolation. Stragyx combines website
                development, CRM, automation, AI, SEO, paid ads, content, analytics, and
                conversion optimisation into one joined-up operating system — built specifically
                around how your business works.
              </p>
              <p className="mt-4 text-lg text-gray-400 leading-relaxed">
                Instead of managing five different agencies and a stack of disconnected tools,
                you get a single partner and a single strategy that moves all parts of your
                growth engine in the same direction.
              </p>
              <Link to="/book" className="btn-primary mt-8 inline-flex" style={{ textDecoration: 'none' }}>
                Get a Free Audit
              </Link>
            </FadeUp>
          </div>

          {/* Right: pillars grid */}
          <FadeUp delay={0.2}>
            <div className="grid grid-cols-2 gap-3">
              {pillars.map((p, i) => (
                <motion.div
                  key={p}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <CheckCircle2 size={16} color="#3b82f6" className="flex-shrink-0" />
                  <span className="text-sm text-gray-300 font-medium">{p}</span>
                </motion.div>
              ))}
            </div>

            {/* Visual connector card */}
            <div
              className="mt-4 p-5 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
                border: '1px solid rgba(96,165,250,0.2)',
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#4ade80', boxShadow: '0 0 8px #4ade80' }}
                />
                <span className="text-sm font-semibold text-white">All systems connected</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Every service shares data and strategy. Your CRM informs your ads, your website
                feeds your automation, and your analytics surface exactly what's working.
              </p>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
