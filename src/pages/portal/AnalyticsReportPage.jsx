import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ExternalLink, Clock, Info } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const isPlaceholder = url => !url || url.includes('REPLACE_WITH')

const REPORT_DESCRIPTIONS = {
  'Overview': {
    summary: 'A top-level snapshot of your website\'s performance.',
    metrics: [
      { name: 'Sessions', desc: 'Total number of visits in the selected period. Each session is one person\'s visit, regardless of how many pages they viewed.' },
      { name: 'New Users', desc: 'First-time visitors who have never been to the site before.' },
      { name: 'Engagement Rate', desc: 'Percentage of sessions where someone stayed 10+ seconds, viewed a second page, or completed an action. Higher is better.' },
      { name: 'Bounce Rate', desc: 'Percentage of sessions where someone left without doing anything. Lower is better.' },
      { name: 'Key Events', desc: 'Completed goals such as form submissions, bookings, or calls.' },
      { name: 'Traffic Trend', desc: 'Daily sessions and new users over time — useful for spotting spikes, drops, or growth trends.' },
      { name: 'Traffic Sources', desc: 'Where your visitors are coming from — direct, search, referral, social etc.' },
      { name: 'Device Breakdown', desc: 'Split between desktop and mobile visitors. Important for understanding how your audience browses.' },
    ]
  },
  'Content & Landing Pages': {
    summary: 'How your pages and content are performing.',
    metrics: [
      { name: 'Sessions', desc: 'Total visits across all pages in the selected period.' },
      { name: 'Bounce Rate', desc: 'Percentage of visitors who left without interacting. A high bounce rate on a key page may indicate it needs improvement.' },
      { name: 'Engagement Rate', desc: 'Percentage of sessions with meaningful interaction — inverse of bounce rate.' },
      { name: 'Average Session Duration', desc: 'How long visitors spend on the site on average. Longer durations suggest content is resonating.' },
      { name: 'Views per Session', desc: 'Average number of pages viewed per visit. Higher means visitors are exploring more of your site.' },
      { name: 'Views', desc: 'Total page views across all content in the period.' },
      { name: 'Top Pages', desc: 'Your most visited pages ranked by sessions — shows where your traffic is going.' },
      { name: 'Landing Pages', desc: 'The first pages visitors land on when they arrive at the site. High bounce rates here need attention.' },
    ]
  },
  'Leads & Conversions': {
    summary: 'How many leads your site is generating and from where.',
    metrics: [
      { name: 'Key Events', desc: 'Total completed goals — form fills, bookings, calls, downloads etc.' },
      { name: 'Key Event Rate', desc: 'Percentage of sessions that resulted in a lead or conversion.' },
      { name: 'Event Count', desc: 'Total number of tracked interactions on the site.' },
      { name: 'Event Breakdown', desc: 'Which specific actions visitors are taking — useful for seeing which lead sources are most active.' },
    ]
  },
  'Audience': {
    summary: 'Who is visiting your site and where they are coming from.',
    metrics: [
      { name: 'New vs Returning', desc: 'Balance between first-time and repeat visitors. A healthy mix suggests both acquisition and retention are working.' },
      { name: 'Device Category', desc: 'Desktop vs mobile vs tablet. Use this to prioritise where to focus design improvements.' },
      { name: 'Geography', desc: 'Where in the world your visitors are based. Useful for local businesses to confirm they\'re reaching the right area.' },
    ]
  },
}

function InfoTooltip({ name }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const info = REPORT_DESCRIPTIONS[name]
  if (!info) return null

  return (
    <div className="relative" ref={ref}>
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-center w-6 h-6 rounded-full transition-colors"
        style={{ color: '#6b7280' }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <Info size={16} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-8 z-50 rounded-xl p-4 w-80 shadow-xl"
            style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">{info.summary}</p>
            <div className="space-y-2.5">
              {info.metrics.map(m => (
                <div key={m.name}>
                  <span className="text-xs font-semibold text-white">{m.name} — </span>
                  <span className="text-xs text-gray-400">{m.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AnalyticsReportPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('client_dashboards')
      .select('*')
      .eq('user_id', user.id)
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setDashboard(data)
        setLoading(false)
      })
  }, [user.id, id])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/portal/analytics')}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} /> Back to Analytics
            </button>
          </div>
          {dashboard && !isPlaceholder(dashboard.embed_url) && (
            <a
              href={dashboard.embed_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#9ca3af',
                textDecoration: 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#e5e7eb'}
              onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
            >
              <ExternalLink size={12} /> Open full report
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-white">{dashboard?.name ?? 'Loading...'}</h1>
          {dashboard && <InfoTooltip name={dashboard.name} />}
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="flex gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3b82f6', animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      ) : dashboard && !isPlaceholder(dashboard.embed_url) ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <iframe
            src={dashboard.embed_url}
            title={dashboard.name}
            width="100%"
            height="1100"
            style={{ border: 'none', display: 'block' }}
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl flex flex-col items-center justify-center text-center"
          style={{ border: '1px dashed rgba(255,255,255,0.08)', height: '400px', background: 'rgba(255,255,255,0.01)' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}
          >
            <Clock size={26} color="#3b82f6" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Dashboard being set up</h3>
          <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
            This dashboard is being configured. We'll notify you as soon as it's live.
          </p>
        </motion.div>
      )}
    </div>
  )
}
