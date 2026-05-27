import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, CheckCircle2, Clock, Shield, MessageSquare } from 'lucide-react'
import PageHero from '../components/PageHero'
import SEO from '../components/SEO'

const expectations = [
  {
    icon: Clock,
    title: '30 minutes',
    detail: 'A focused conversation — not a sales pitch. We\'ll review your situation and be straight about what\'s possible.',
    color: '#60a5fa',
  },
  {
    icon: MessageSquare,
    title: 'We come prepared',
    detail: 'We\'ll take a look at your current setup before the call so we have something useful to say from minute one.',
    color: '#a78bfa',
  },
  {
    icon: Shield,
    title: 'No pressure',
    detail: 'If we don\'t think we can help, we\'ll tell you directly on the call. No pitch, no follow-up pressure.',
    color: '#34d399',
  },
]

const whatWeCover = [
  'Where your current setup is losing leads or wasting time',
  'Which systems would make the biggest difference for your stage',
  'A rough sense of approach and investment before any proposal',
  'Honest advice — even if that means pointing you elsewhere',
]

export default function BookPage() {
  return (
    <>
      <SEO
        title="Book a Free Strategy Call"
        description="Book a free 30-minute strategy call with GrowthOps AI. We'll review your current setup and be straight about what's possible — no pitch, no pressure."
        path="/book"
      />

      <PageHero
        label="Strategy Call"
        title="Let's look at your business"
        titleAccent="honestly."
        subtitle="A free 30-minute call to understand where you are, where you want to be, and whether we're the right fit to help."
      />

      <section className="pb-24 md:pb-32">
        <div className="max-w-5xl mx-auto px-6">

          {/* Expectation cards */}
          <div className="grid md:grid-cols-3 gap-5 mb-16">
            {expectations.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-6 rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}
                  >
                    <Icon size={18} color={item.color} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.detail}</p>
                </motion.div>
              )
            })}
          </div>

          {/* Main booking area */}
          <div className="grid lg:grid-cols-5 gap-10 items-start">

            {/* Left: what we cover */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div
                className="p-7 rounded-2xl mb-6"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <h3 className="text-base font-bold text-white mb-5">What we'll cover</h3>
                <div className="space-y-3">
                  {whatWeCover.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 size={14} color="#60a5fa" className="flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk reversal */}
              <div
                className="p-5 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(139,92,246,0.06))',
                  border: '1px solid rgba(96,165,250,0.15)',
                }}
              >
                <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
                  Our promise
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  If we don't think we can genuinely help your business, we'll tell you
                  directly on the call — no pitch, no pressure, no follow-up emails trying to
                  change your mind.
                </p>
              </div>
            </motion.div>

            {/* Right: Calendly CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="lg:col-span-3"
            >
              <div
                className="rounded-2xl p-10 text-center"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{
                    background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(124,58,237,0.2))',
                    border: '1px solid rgba(96,165,250,0.2)',
                  }}
                >
                  <Calendar size={28} color="#60a5fa" />
                </div>

                <h2 className="text-2xl font-extrabold text-white mb-3 leading-tight">
                  Book your free strategy call
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed mb-8 max-w-sm mx-auto">
                  Pick a time that works for you. You'll receive a confirmation and a short
                  prep email — we won't waste your time on the call.
                </p>

                <a
                  href="https://calendly.com/growthops-ai/strategy-call"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-base px-8 py-4 inline-flex"
                  style={{ textDecoration: 'none' }}
                >
                  <Calendar size={18} />
                  Choose a time
                </a>

                <p className="text-xs text-gray-600 mt-5">
                  Free · 30 minutes · No obligation
                </p>
              </div>

              {/* Alternative */}
              <p className="text-center text-xs text-gray-600 mt-6">
                Prefer to send a message first?{' '}
                <Link
                  to="/contact"
                  className="underline hover:text-gray-400 transition-colors"
                  style={{ textDecoration: 'underline' }}
                >
                  Use the contact form
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
