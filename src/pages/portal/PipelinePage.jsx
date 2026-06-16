import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, GitMerge } from 'lucide-react'
import LeadsTab from '../../components/portal/pipeline/LeadsTab'
import CrmTab   from '../../components/portal/pipeline/CrmTab'

const TABS = [
  { id: 'leads', label: 'Leads',    icon: Users,    desc: 'All incoming leads, sources, statuses, and pipeline value.' },
  { id: 'crm',   label: 'Pipeline', icon: GitMerge, desc: 'CRM stage breakdown — leads and value at each stage.' },
]

export default function PipelinePage() {
  const [active, setActive] = useState('leads')
  const tab = TABS.find(t => t.id === active)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-extrabold text-white mb-1">Pipeline</h1>
        <p className="text-sm text-gray-500">{tab?.desc}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
        className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {TABS.map(t => {
          const Icon = t.icon
          const isActive = active === t.id
          return (
            <button key={t.id} onClick={() => setActive(t.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
              style={isActive ? { background: 'rgba(59,130,246,0.2)', color: '#93c5fd' } : { color: '#6b7280' }}>
              <Icon size={14} />{t.label}
            </button>
          )
        })}
      </motion.div>

      <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {active === 'leads' && <LeadsTab />}
        {active === 'crm'   && <CrmTab />}
      </motion.div>
    </div>
  )
}
