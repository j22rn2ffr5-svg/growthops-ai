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
  organic:  { label: 'Organic',  color: '#34d399' },
  paid:     { label: 'Paid',     color: '#60a5fa' },
  referral: { label: 'Referral', color: '#a78bfa' },
  direct:   { label: 'Direct',   color: '#9ca3af' },
  social:   { label: 'Social',   color: '#f472b6' },
  email:    { label: 'Email',    color: '#fb923c' },
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
  const totalValue = leads.reduce((a, l) => a + (l.value ?? 0), 0)
  const wonValue   = leads.filter(l => l.status === 'won').reduce((a, l) => a + (l.value ?? 0), 0)
  const newThisMonth = leads.filter(l => new Date(l.created_at) > new Date(Date.now() - 30 * 86400000)).length

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
        <StatCard label="Total Leads"      value={leads.length}                                                                   delay={0} />
        <StatCard label="New This Month"   value={newThisMonth}                                                                   delay={0.05} />
        <StatCard label="Pipeline Value"   value={`£${totalValue.toLocaleString()}`}                                              delay={0.1} />
        <StatCard label="Won Value"        value={`£${wonValue.toLocaleString()}`}                                                delay={0.15} />
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {statuses.map(s => {
          const st = STATUS[s]
          return (
            <button key={s} onClick={() => setFilter(s)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all capitalize"
              style={filter === s
                ? { background: st ? `${st.bg}` : 'rgba(59,130,246,0.25)', color: st?.color ?? '#93c5fd', border: `1px solid ${st?.color ?? '#60a5fa'}40` }
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
                      <span className="text-xs font-semibold" style={{ color: src.color }}>{src.label}</span>
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
