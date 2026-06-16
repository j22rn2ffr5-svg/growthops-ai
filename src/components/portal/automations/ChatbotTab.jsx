import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../contexts/AuthContext'

const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }

function StatCard({ label, value, sub, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}
      style={card} className="p-5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-extrabold text-white">{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </motion.div>
  )
}

export default function ChatbotTab() {
  const { user } = useAuth()
  const [stats, setStats]     = useState([])
  const [period, setPeriod]   = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('chatbot_stats').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => {
        setStats(data ?? [])
        if (data?.length) setPeriod(data[0].period)
        setLoading(false)
      })
  }, [user.id])

  const active = stats.find(s => s.period === period) ?? stats[0]
  const captureRate = active?.conversations > 0
    ? ((active.leads_captured / active.conversations) * 100).toFixed(1)
    : null
  const questions = Array.isArray(active?.top_questions) ? active.top_questions : []
  const maxCount  = questions.length ? Math.max(...questions.map(q => q.count), 1) : 1

  if (loading) return <div className="h-48 flex items-center justify-center"><p className="text-sm text-gray-600">Loading…</p></div>

  if (!stats.length) return (
    <div style={card} className="p-14 text-center">
      <Bot size={32} color="#374151" className="mx-auto mb-3" />
      <p className="text-sm text-gray-500">Chatbot analytics will appear here once your bot is live.</p>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center gap-2">
        {stats.map(s => (
          <button key={s.period} onClick={() => setPeriod(s.period)}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all"
            style={period === s.period
              ? { background: 'rgba(59,130,246,0.25)', color: '#93c5fd', border: '1px solid rgba(96,165,250,0.4)' }
              : { background: 'rgba(255,255,255,0.05)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)' }}>
            {s.period}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Conversations"  value={active?.conversations}  delay={0} />
        <StatCard label="Leads Captured" value={active?.leads_captured} delay={0.05} />
        <StatCard label="Capture Rate"   value={captureRate ? `${captureRate}%` : '—'} sub="Leads / conversations" delay={0.1} />
        <StatCard label="Avg. Messages"  value={active?.avg_messages}   sub="Per conversation" delay={0.15} />
      </div>

      {/* Top questions */}
      {questions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
          style={card} className="p-6">
          <h3 className="text-sm font-bold text-white mb-5">Top Questions from Visitors</h3>
          <div className="space-y-4">
            {questions.map((q, i) => {
              const barPct = Math.round((q.count / maxCount) * 100)
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm text-gray-300">{q.q}</p>
                    <span className="text-xs font-semibold text-gray-500 ml-3 flex-shrink-0">{q.count}×</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barPct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.08 + 0.3, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #3b82f6, #7c3aed)' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}
