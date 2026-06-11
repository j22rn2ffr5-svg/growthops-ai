import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

const STAGES = [
  { key: 'onboarding', label: 'Onboarding',  color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  { key: 'building',   label: 'In Progress', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)'  },
  { key: 'review',     label: 'Review',      color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  { key: 'live',       label: 'Live',        color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
]

const stageMap = Object.fromEntries(STAGES.map(s => [s.key, s]))

export default function AdminClientsPage() {
  const [clients, setClients]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [saving, setSaving]     = useState(null)

  useEffect(() => {
    async function fetchClients() {
      const { data } = await supabase
        .from('client_profiles')
        .select('*')
        .order('created_at', { ascending: false })
      setClients(data ?? [])
      setLoading(false)
    }
    fetchClients()
  }, [])

  async function handleStageChange(clientId, stage) {
    setSaving(clientId)
    await supabase
      .from('client_profiles')
      .update({ project_status: stage })
      .eq('id', clientId)
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, project_status: stage } : c))
    setSaving(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3b82f6', animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-extrabold text-white mb-1">Clients</h1>
        <p className="text-sm text-gray-500">Manage client project status and details.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="space-y-3">
        {clients.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
            <p className="text-sm text-gray-500">No clients yet.</p>
          </div>
        ) : clients.map(client => {
          const stage      = stageMap[client.project_status ?? 'onboarding'] ?? stageMap.onboarding
          const isExpanded = expanded === client.id
          const isSaving   = saving === client.id

          return (
            <div key={client.id} className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              <button
                onClick={() => setExpanded(isExpanded ? null : client.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors"
                style={{ background: isExpanded ? 'rgba(59,130,246,0.05)' : 'rgba(255,255,255,0.015)' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
                >
                  {(client.business_name ?? client.id).slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{client.business_name ?? 'Unnamed client'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{client.package ?? 'No package'} · {client.account_manager ?? 'Chris Eyres'}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: stage.bg, color: stage.color }}>
                    {stage.label}
                  </span>
                  <ChevronDown size={14} color="#6b7280" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-4 space-y-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Project Stage</p>
                    <div className="flex gap-2 flex-wrap">
                      {STAGES.map(s => {
                        const active = (client.project_status ?? 'onboarding') === s.key
                        return (
                          <button
                            key={s.key}
                            onClick={() => handleStageChange(client.id, s.key)}
                            disabled={isSaving}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                            style={
                              active
                                ? { background: s.bg, color: s.color, border: `1px solid ${s.color}40` }
                                : { background: 'rgba(255,255,255,0.04)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.07)' }
                            }
                          >
                            {active && <Check size={11} strokeWidth={2.5} />}
                            {s.label}
                          </button>
                        )
                      })}
                    </div>
                    {isSaving && <p className="text-xs text-gray-600 mt-2">Saving…</p>}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
