import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle2, Clock, MessageSquare, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SEO from '../components/SEO'

const infoCards = [
  {
    icon: Clock,
    title: 'Response time',
    detail: 'We respond to all enquiries within one business day.',
    color: '#60a5fa',
  },
  {
    icon: MessageSquare,
    title: 'What to expect',
    detail: "An initial call to understand your business and goals — no pitch, no pressure.",
    color: '#a78bfa',
  },
  {
    icon: Calendar,
    title: 'Prefer to book directly?',
    detail: 'Use our booking page to pick a time that works for you. We\'ll come prepared.',
    color: '#34d399',
    link: '/book',
    linkLabel: 'Book a strategy call',
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    business: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
  }
  const inputFocus = (e) => (e.target.style.borderColor = 'rgba(96,165,250,0.5)')
  const inputBlur = (e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')
  const inputClass =
    'w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200'

  return (
    <>
      <SEO
        title="Contact"
        description="Get in touch with Stragyx. Send us a message and we'll respond within one business day."
        path="/contact"
      />

      <PageHero
        label="Get in Touch"
        title="Let's identify where your business"
        titleAccent="can grow."
        subtitle="Tell us about your business and what you'd like to improve. We'll come back with a clear picture of what's possible."
      />

      <section className="pb-24 md:pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-10">

            {/* Left: info cards */}
            <div className="lg:col-span-2 space-y-5">
              {infoCards.map((card, i) => {
                const Icon = card.icon
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                    className="p-5 rounded-2xl"
                    style={{
                      background: 'rgba(255,255,255,0.025)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${card.color}18` }}
                      >
                        <Icon size={18} color={card.color} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white mb-1">{card.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">{card.detail}</p>
                        {card.link && (
                          <Link
                            to={card.link}
                            className="text-xs font-semibold mt-2 inline-block transition-colors"
                            style={{ color: card.color, textDecoration: 'none' }}
                          >
                            {card.linkLabel} →
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              {/* What happens next */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="p-5 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.07), rgba(139,92,246,0.07))',
                  border: '1px solid rgba(96,165,250,0.18)',
                }}
              >
                <h3 className="text-sm font-bold text-white mb-3">What happens next</h3>
                <ol className="space-y-2.5">
                  {[
                    'We review your enquiry within one business day.',
                    "We'll schedule a 30-minute strategy call.",
                    'We come prepared with initial observations about your business.',
                    "If there's a fit, we scope and quote a tailored solution.",
                  ].map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa' }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-xs text-gray-400 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-20 px-8 rounded-2xl h-full flex flex-col items-center justify-center"
                  style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)' }}
                >
                  <CheckCircle2 size={56} color="#34d399" className="mb-5" />
                  <h3 className="text-2xl font-bold text-white mb-3">Enquiry received — thank you.</h3>
                  <p className="text-gray-400 max-w-md leading-relaxed">
                    We'll review your message and be in touch within one business day. If you have
                    anything urgent, feel free to include it in your message.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  onSubmit={handleSubmit}
                  className="rounded-2xl p-8"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <h2 className="text-lg font-bold text-white mb-6">Tell us about your business</h2>

                  {/* Name + Email */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Jane Smith"
                        className={inputClass}
                        style={inputStyle}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="jane@company.com"
                        className={inputClass}
                        style={inputStyle}
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                      />
                    </div>
                  </div>

                  {/* Business name */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={form.business}
                      onChange={(e) => setForm({ ...form, business: e.target.value })}
                      placeholder="Your Business Ltd"
                      className={inputClass}
                      style={inputStyle}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                    />
                  </div>

                  {/* Message */}
                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      What would you like to improve? <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={6}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="e.g. We're a B2B consultancy. We rely on referrals but want to build a proper pipeline. Our website is outdated and we have no CRM or follow-up system..."
                      className={`${inputClass} resize-none`}
                      style={inputStyle}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full justify-center py-4 text-base">
                    <Send size={17} />
                    Send Enquiry
                  </button>

                  <p className="text-xs text-gray-600 text-center mt-4">
                    We'll review your message and reply within 1–2 business days.
                  </p>
                </motion.form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
