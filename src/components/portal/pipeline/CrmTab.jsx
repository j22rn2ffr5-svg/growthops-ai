import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GitMerge } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../contexts/AuthContext'

const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }

export default function CrmTab() {
  const { user } = useAuth()
  const [stages, setStages]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('pipeline_stages').select('*').eq('user_id', user.id).order('stage_order')
      .then(({ data }) => { setStages(data ?? []); setLoading(false) })
  }, [user.id])

  if (loading) return <div className="h-48 flex items-center justify-center"><p className="text-sm text-gray-600">Loading…</p></div>

  if (!stages.length) return (
    <div style={card} className="p-14 text-center">
      <GitMerge size={32} color="#374151" className="mx-auto mb-3" />
      <p className="text-sm text-gray-500">Your CRM pipeline will appear here once configured.</p>
    </div>
  )

  const totalLeads = stages.reduce((a, s) => a + s.lead_count, 0)
  const totalValue = stages.reduce((a, s) => a + (s.stage_value ?? 0), 0)
  const maxCount   = Math.max(...stages.map(s => s.lead_count), 1)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={card} className="p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Pipeline Leads</p>
          <p className="text-2xl font-extrabold text-white">{totalLeads}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} style={card} className="p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Pipeline Value</p>
          <p className="text-2xl font-extrabold text-white">£{totalValue.toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Stage cards */}
      <div className="space-y-3">
        {stages.map((stage, i) => {
          const barPct = Math.round((stage.lead_count / maxCount) * 100)
          return (
            <motion.div key={stage.id}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: i * 0.07 }}
              style={card} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: stage.color }} />
                  <p className="text-sm font-bold text-white">{stage.name}</p>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Leads</p>
                    <p className="text-base font-bold text-white">{stage.lead_count}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Value</p>
                    <p className="text-base font-bold text-white">£{stage.stage_value?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barPct}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 + 0.3, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: stage.color }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
