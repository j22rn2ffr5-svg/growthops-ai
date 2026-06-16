import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Workflow, CheckCircle2, PauseCircle, Clock } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../contexts/AuthContext'

const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }

const TYPE_LABEL = {
  lead_followup: 'Lead Follow-up',
  reminder:      'Reminder',
  onboarding:    'Onboarding',
  nurture:       'Nurture',
  notification:  'Notification',
}

function timeAgo(ts) {
  if (!ts) return 'Never'
  const diff = Date.now() - new Date(ts)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (h < 1) return 'Just now'
  if (h < 24) return `${h}h ago`
  return `${d}d ago`
}

export default function AutomationsTab() {
  const { user } = useAuth()
  const [automations, setAutomations] = useState([])
  const [filter, setFilter]           = useState('all')
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    supabase.from('automations').select('*').eq('user_id', user.id).order('run_count', { ascending: false })
      .then(({ data }) => { setAutomations(data ?? []); setLoading(false) })
  }, [user.id])

  const filtered   = filter === 'all' ? automations : automations.filter(a => a.status === filter)
  const activeCount = automations.filter(a => a.status === 'active').length
  const totalRuns   = automations.reduce((sum, a) => sum + (a.run_count ?? 0), 0)

  if (loading) return <div className="h-48 flex items-center justify-center"><p className="text-sm text-gray-600">Loading…</p></div>

  if (!automations.length) return (
    <div style={card} className="p-14 text-center">
      <Workflow size={32} color="#374151" className="mx-auto mb-3" />
      <p className="text-sm text-gray-500">Your automations will appear here once they're configured.</p>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Automations', value: activeCount },
          { label: 'Total Runs',         value: totalRuns.toLocaleString() },
          { label: 'Paused',             value: automations.filter(a => a.status === 'paused').length },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }}
            style={card} className="p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{s.label}</p>
            <p className="text-2xl font-extrabold text-white">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'active', 'paused'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all capitalize"
            style={filter === f
              ? { background: 'rgba(59,130,246,0.25)', color: '#93c5fd', border: '1px solid rgba(96,165,250,0.4)' }
              : { background: 'rgba(255,255,255,0.05)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)' }}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* List */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
        style={card} className="divide-y" style2={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        {filtered.map((a, i) => {
          const isActive = a.status === 'active'
          return (
            <div key={a.id} className="px-5 py-4 flex items-center gap-4" style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div className="flex-shrink-0">
                {isActive
                  ? <CheckCircle2 size={18} color="#10b981" />
                  : <PauseCircle  size={18} color="#f59e0b" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{a.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{a.trigger_description}</p>
              </div>
              <div className="flex items-center gap-6 flex-shrink-0 text-right">
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Type</p>
                  <p className="text-xs text-gray-400">{TYPE_LABEL[a.type] ?? a.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Runs</p>
                  <p className="text-sm font-bold text-white">{a.run_count?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Success</p>
                  <p className="text-sm font-bold" style={{ color: (a.success_rate ?? 100) >= 95 ? '#10b981' : '#f59e0b' }}>{a.success_rate}%</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-xs text-gray-600 mb-0.5">Last run</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1"><Clock size={10} />{timeAgo(a.last_run)}</p>
                </div>
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
