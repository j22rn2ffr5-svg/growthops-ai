import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../contexts/AuthContext'

const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }

const STATUS = {
  new:       { label: 'New',       color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
  contacted: { label: 'Contacted', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  qualified: { label: 'Qualified', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)'  },
  proposal:  { label: 'Proposal',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  won:       { label: 'Won',       color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
  lost:      { label: 'Lost',      color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
}

const SOURCE = {
  organic:  { label: 'Organic',   color: '#34d399', bg: 'rgba(52,211,153,0.15)'  },
  paid:     { label: 'Paid',      color: '#60a5fa', bg: 'rgba(96,165,250,0.15)'  },
  referral: { label: 'Referral',  color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
  direct:   { label: 'Direct',    color: '#9ca3af', bg: 'rgba(156,163,175,0.15)' },
  social:   { label: 'Social',    color: '#f472b6', bg: 'rgba(244,114,182,0.15)' },
  email:    { label: 'Email',     color: '#fb923c', bg: 'rgba(251,146,60,0.15)'  },
}

function StatCard({ label, value, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}
      style={card} className="p-5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-extrabold text-white">{value}</p>
    </motion.div>
  )
}

function SourceBreakdown({ leads }) {
  const counts = Object.entries(SOURCE).map(([key, meta]) => ({
    key, ...meta,
    count: leads.filter(l => l.source === key).length,
  })).filter(s => s.count > 0).sort((a, b) => b.count - a.count)

  const max = Math.max(...counts.map(s => s.count), 1)

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
      style={card} className="p-5">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Lead Sources</h3>
      <div className="space-y-3">
        {counts.map(s => (
          <div key={s.key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: s.color }}>{s.label}</span>
              <span className="text-xs text-gray-400">{s.count} lead{s.count !== 1 ? 's' : ''}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <motion.div className="h-full rounded-full"
                style={{ background: s.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(s.count / max) * 100}%` }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function ConversionFunnel({ leads }) {
  const STAGES = [
    { key: 'all',       label: 'Total Leads',  statuses: Object.keys(STATUS) },
    { key: 'contacted', label: 'Contacted',    statuses: ['contacted', 'qualified', 'proposal', 'won'] },
    { key: 'qualified', label: 'Qualified',    statuses: ['qualified', 'proposal', 'won'] },
    { key: 'won',       label: 'Won',          statuses: ['won'] },
  ]

  const counts = STAGES.map(s => ({
    ...s,
    count: s.key === 'all' ? leads.length : leads.filter(l => s.statuses.includes(l.status)).length,
  }))

  const total = counts[0].count || 1

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
      style={card} className="p-5">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Conversion Funnel</h3>
      <div className="space-y-3">
        {counts.map((stage, i) => {
          const pct = Math.round((stage.count / total) * 100)
          const convRate = i > 0 ? Math.round((stage.count / counts[i - 1].count) * 100) : 100
          return (
            <div key={stage.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-300">{stage.label}</span>
                <div className="flex items-center gap-2">
                  {i > 0 && (
                    <span className="text-xs text-gray-600">{convRate}% from prev</span>
                  )}
                  <span className="text-xs font-bold text-white">{stage.count}</span>
                </div>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, #3b82f6, #7c3aed)` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 + i * 0.05 }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default function LeadsTab() {
  const { user } = useAuth()
  const [leads, setLeads]     = useState([])
  const [filter, setFilter]   = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('leads').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { setLeads(data ?? []); setLoading(false) })
  }, [user.id])

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter)
  const totalValue    = leads.reduce((a, l) => a + (l.value ?? 0), 0)
  const wonValue      = leads.filter(l => l.status === 'won').reduce((a, l) => a + (l.value ?? 0), 0)
  const newThisMonth  = leads.filter(l => new Date(l.created_at) > new Date(Date.now() - 30 * 86400000)).length

  const statuses = ['all', ...Object.keys(STATUS)]

  if (loading) return <div className="h-48 flex items-center justify-center"><p className="text-sm text-gray-600">Loading…</p></div>

  if (!leads.length) return (
    <div style={card} className="p-14 text-center">
      <Users size={32} color="#374151" className="mx-auto mb-3" />
      <p className="text-sm text-gray-500">Leads will appear here once your pipeline is active.</p>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Leads"    value={leads.length}                    delay={0}    />
        <StatCard label="New This Month" value={newThisMonth}                    delay={0.05} />
        <StatCard label="Pipeline Value" value={`£${totalValue.toLocaleString()}`} delay={0.1}  />
        <StatCard label="Won Value"      value={`£${wonValue.toLocaleString()}`}  delay={0.15} />
      </div>

      {/* Source breakdown + funnel side by side */}
      <div className="grid md:grid-cols-2 gap-4">
        <SourceBreakdown leads={leads} />
        <ConversionFunnel leads={leads} />
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {statuses.map(s => {
          const st = STATUS[s]
          return (
            <button key={s} onClick={() => setFilter(s)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all capitalize"
              style={filter === s
                ? { background: st ? st.bg : 'rgba(59,130,246,0.25)', color: st?.color ?? '#93c5fd', border: `1px solid ${st?.color ?? '#60a5fa'}40` }
                : { background: 'rgba(255,255,255,0.05)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)' }}>
              {s === 'all' ? 'All' : STATUS[s]?.label}
            </button>
          )
        })}
      </div>

      {/* Leads table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
        style={card} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['Lead', 'Source', 'Status', 'Value', 'Date'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => {
                const st  = STATUS[l.status] ?? STATUS.new
                const src = SOURCE[l.source] ?? SOURCE.direct
                return (
                  <tr key={l.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                    <td className="px-5 py-3.5 text-gray-200 font-medium">{l.name}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ background: src.bg, color: src.color }}>{src.label}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-300 font-semibold">{l.value ? `£${l.value.toLocaleString()}` : '—'}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{new Date(l.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-600">No leads match this filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
