import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../contexts/AuthContext'

const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }

const CAMP_STATUS = {
  sent:      { label: 'Sent',      color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  scheduled: { label: 'Scheduled', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  draft:     { label: 'Draft',     color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
}
const SEQ_STATUS = {
  active: { label: 'Active', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  paused: { label: 'Paused', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  draft:  { label: 'Draft',  color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
}

function StatCard({ label, value, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}
      style={card} className="p-5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-extrabold text-white">{value ?? '—'}</p>
    </motion.div>
  )
}

function pct(n) { return n != null ? `${n}%` : '—' }

export default function EmailSmsTab() {
  const { user } = useAuth()
  const [campaigns, setCampaigns]   = useState([])
  const [sequences, setSequences]   = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('email_campaigns').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('email_sequences').select('*').eq('user_id', user.id).order('created_at'),
    ]).then(([c, s]) => {
      setCampaigns(c.data ?? [])
      setSequences(s.data ?? [])
      setLoading(false)
    })
  }, [user.id])

  const sent     = campaigns.filter(c => c.status === 'sent')
  const avgOpen  = sent.length ? (sent.filter(c => c.open_rate).reduce((a, c) => a + c.open_rate, 0) / sent.filter(c => c.open_rate).length) : null
  const avgClick = sent.length ? (sent.filter(c => c.click_rate).reduce((a, c) => a + c.click_rate, 0) / sent.filter(c => c.click_rate).length) : null
  const activeSeq = sequences.filter(s => s.status === 'active').length

  if (loading) return <div className="h-48 flex items-center justify-center"><p className="text-sm text-gray-600">Loading…</p></div>

  if (!campaigns.length && !sequences.length) return (
    <div style={card} className="p-14 text-center">
      <Mail size={32} color="#374151" className="mx-auto mb-3" />
      <p className="text-sm text-gray-500">Email & SMS data will appear here once campaigns are configured.</p>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Campaigns Sent"   value={sent.length}                                                   delay={0} />
        <StatCard label="Avg. Open Rate"   value={avgOpen ? `${avgOpen.toFixed(1)}%` : '—'}                      delay={0.05} />
        <StatCard label="Avg. Click Rate"  value={avgClick ? `${avgClick.toFixed(1)}%` : '—'}                    delay={0.1} />
        <StatCard label="Active Sequences" value={activeSeq}                                                      delay={0.15} />
      </div>

      {/* Campaigns */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
        style={card} className="overflow-hidden">
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-sm font-bold text-white">Campaigns</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['Name', 'Type', 'Status', 'Sent', 'Open Rate', 'Click Rate', 'Conversions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c, i) => {
                const st = CAMP_STATUS[c.status] ?? CAMP_STATUS.draft
                return (
                  <tr key={c.id} style={{ borderBottom: i < campaigns.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                    <td className="px-5 py-3.5 text-gray-200 font-medium max-w-[200px] truncate">{c.name}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-md"
                        style={{ background: c.type === 'email' ? 'rgba(59,130,246,0.12)' : 'rgba(16,185,129,0.12)', color: c.type === 'email' ? '#93c5fd' : '#34d399' }}>
                        {c.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400">{c.sent_count > 0 ? c.sent_count.toLocaleString() : '—'}</td>
                    <td className="px-5 py-3.5 text-gray-300">{pct(c.open_rate)}</td>
                    <td className="px-5 py-3.5 text-gray-300">{pct(c.click_rate)}</td>
                    <td className="px-5 py-3.5 text-gray-400">{c.conversions > 0 ? c.conversions : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Sequences */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
        style={card} className="overflow-hidden">
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-sm font-bold text-white">Active Sequences</h3>
        </div>
        <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          {sequences.map(s => {
            const st  = SEQ_STATUS[s.status] ?? SEQ_STATUS.draft
            const pct = s.enrolled > 0 ? Math.round((s.completed / s.enrolled) * 100) : 0
            return (
              <div key={s.id} className="px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-white">{s.name}</p>
                    <span className="text-xs px-1.5 py-0.5 rounded uppercase" style={{ background: s.type === 'email' ? 'rgba(59,130,246,0.12)' : 'rgba(16,185,129,0.12)', color: s.type === 'email' ? '#93c5fd' : '#34d399', fontSize: '10px' }}>{s.type}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{s.steps} steps</span>
                    <span>{s.enrolled} enrolled</span>
                    <span>{s.completed} completed</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)', width: '160px' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #3b82f6, #7c3aed)' }} />
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-gray-500">{pct}% complete</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
