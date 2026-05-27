import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Send, CheckCircle2, MessageSquare } from 'lucide-react'

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

const inputClass =
  'w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200'
const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
const onFocus = (e) => (e.target.style.borderColor = 'rgba(96,165,250,0.5)')
const onBlur = (e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', business: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="py-24 md:py-32 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59,130,246,0.06) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-5xl mx-auto px-6">
        <FadeUp>
          <div className="text-center mb-12">
            <span className="section-label">
              <MessageSquare size={12} />
              Get Started
            </span>
            <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Book a free{' '}
              <span className="gradient-text">strategy call.</span>
            </h2>
            <p className="mt-5 text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
              Tell us about your business and what you're trying to solve. We'll review your
              situation and come back with a clear picture of what's possible.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.15}>
          {submitted ? (
            <div
              className="text-center py-20 px-8 rounded-2xl"
              style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)' }}
            >
              <div className="flex justify-center mb-5">
                <CheckCircle2 size={52} color="#34d399" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Message received — thank you.</h3>
              <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                We'll review your message and reply within 1–2 business days.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl p-8 md:p-10"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {/* Name + Email */}
              <div className="grid md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
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
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
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
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
              </div>

              {/* Business name */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={form.business}
                  onChange={(e) => setForm({ ...form, business: e.target.value })}
                  placeholder="Your Business Ltd"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              {/* Message */}
              <div className="mb-7">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  What would you like to improve? <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="e.g. We're a local home improvement company. We get leads from Google Ads but struggle to follow up quickly and have no system to track what converts..."
                  className={`${inputClass} resize-none`}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              <button type="submit" className="btn-primary w-full justify-center py-4 text-base">
                <Send size={17} />
                Send Enquiry
              </button>

              <p className="text-xs text-gray-600 text-center mt-4">
                We'll review your message and reply within 1–2 business days.
              </p>
            </form>
          )}
        </FadeUp>
      </div>
    </section>
  )
}
