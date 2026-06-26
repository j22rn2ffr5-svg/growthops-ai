import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const CATEGORIES = [
  'Content Update',
  'Bug / Broken Page',
  'New Feature Request',
  'Analytics Question',
  'SEO Query',
  'Automation / CRM',
  'General Query',
]

const PRIORITIES = [
  { value: 'low',    label: 'Low',    desc: 'No rush — when you get a chance' },
  { value: 'normal', label: 'Normal', desc: 'Standard request' },
  { value: 'high',   label: 'High',   desc: 'Affects business operations' },
  { value: 'urgent', label: 'Urgent', desc: 'Site down or critical issue' },
]

const inputClass = 'w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200'
const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
const onFocus = e => (e.target.style.borderColor = 'rgba(96,165,250,0.5)')
const onBlur  = e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')

export default function NewTicketPage() {
  const { user }   = useAuth()
  const navigate   = useNavigate()

  const [form, setForm] = useState({
    title:       '',
    category:    '',
    priority:    'normal',
    description: '',
  })
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [submitted, setSubmitted] = useState(false)

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.category) { setError('Please select a category.'); return }

    setLoading(true)
    setError(null)

    const { error: dbError } = await supabase.from('tickets').insert({
      user_id:     user.id,
      title:       form.title.trim(),
      category:    form.category,
      priority:    form.priority,
      description: form.description.trim(),
      status:      'open',
    })

    setLoading(false)
    if (dbError) {
      setError('Failed to submit ticket. Please try again.')
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl p-10 text-center"
          style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)' }}
        >
          <CheckCircle2 size={52} color="#34d399" className="mx-auto mb-5" />
          <h2 className="text-xl font-bold text-white mb-2">Ticket submitted</h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            We'll review your request and get back to you within one business day.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/portal/tickets"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none' }}
            >
              View all tickets
            </Link>
            <button
              onClick={() => { setSubmitted(false); setForm({ title: '', category: '', priority: 'normal', description: '' }) }}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
            >
              Submit another
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Link
          to="/portal/tickets"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 mb-4 transition-colors"
          style={{ textDecoration: 'none' }}
        >
          <ArrowLeft size={13} /> Back to tickets
        </Link>
        <h1 className="text-2xl font-extrabold text-white mb-1">New Ticket</h1>
        <p className="text-sm text-gray-500">Tell us what you need — we'll pick it up within one business day.</p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        onSubmit={handleSubmit}
        className="rounded-2xl p-7 space-y-5"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {error && (
          <div
            className="px-4 py-3 rounded-xl text-sm"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
          >
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="e.g. Update hero copy on homepage"
            className={inputClass}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Category <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => set('category', cat)}
                className="px-3 py-2 rounded-xl text-xs font-medium text-left transition-all duration-150"
                style={
                  form.category === cat
                    ? { background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(96,165,250,0.4)', color: '#93c5fd' }
                    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#6b7280' }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Priority
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRIORITIES.map(p => (
              <button
                key={p.value}
                type="button"
                onClick={() => set('priority', p.value)}
                className="px-3 py-2.5 rounded-xl text-left transition-all duration-150"
                style={
                  form.priority === p.value
                    ? { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(96,165,250,0.35)', color: 'white' }
                    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#6b7280' }
                }
              >
                <p className="text-xs font-semibold">{p.label}</p>
                <p className="text-xs opacity-60 mt-0.5 leading-tight">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Describe what you need in as much detail as possible. Include URLs, examples, or screenshots if relevant."
            className={`${inputClass} resize-none`}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{
            background: loading
              ? 'rgba(59,130,246,0.4)'
              : 'linear-gradient(135deg, #3b82f6, #7c3aed)',
          }}
        >
          <Send size={15} />
          {loading ? 'Submitting…' : 'Submit Ticket'}
        </button>

        <p className="text-xs text-gray-600 text-center">
          We'll review and respond within one business day.
        </p>
      </motion.form>
    </div>
  )
}
