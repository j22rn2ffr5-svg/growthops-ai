import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, ShieldCheck, RefreshCw, Activity, FileText, Wrench } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../contexts/AuthContext'

const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }

const CATEGORIES = {
  security:   { label: 'Security',    icon: ShieldCheck, color: '#f87171', bg: 'rgba(248,113,113,0.1)'  },
  updates:    { label: 'Updates',     icon: RefreshCw,   color: '#60a5fa', bg: 'rgba(96,165,250,0.1)'   },
  monitoring: { label: 'Monitoring',  icon: Activity,    color: '#34d399', bg: 'rgba(52,211,153,0.1)'   },
  content:    { label: 'Content',     icon: FileText,    color: '#a78bfa', bg: 'rgba(167,139,250,0.1)'  },
  support:    { label: 'Support',     icon: Wrench,      color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'   },
  seo:        { label: 'SEO',         icon: Activity,    color: '#fb923c', bg: 'rgba(251,146,60,0.1)'   },
}

function monthLabel(m) {
  if (!m) return ''
  const [y, mo] = m.split('-')
  return new Date(Number(y), Number(mo) - 1, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

function LogItem({ item }) {
  const cat = CATEGORIES[item.category] ?? CATEGORIES.updates
  const Icon = cat.icon
  const done = item.status === 'completed'

  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: cat.bg }}>
        <Icon size={13} color={cat.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-white">{item.title}</p>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: cat.bg, color: cat.color }}>{cat.label}</span>
        </div>
        {item.description && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.description}</p>}
      </div>
      <div className="flex-shrink-0 flex items-center gap-1.5 mt-0.5">
        {done
          ? <CheckCircle2 size={14} color="#34d399" />
          : <Clock size={14} color="#f59e0b" />
        }
        <span className="text-xs" style={{ color: done ? '#34d399' : '#f59e0b' }}>{done ? 'Done' : 'Scheduled'}</span>
      </div>
    </div>
  )
}

export default function MaintenanceTab() {
  const { user } = useAuth()
  const [logs, setLogs]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('maintenance_logs').select('*').eq('user_id', user.id)
      .order('month', { ascending: false }).order('created_at', { ascending: true })
      .then(({ data }) => { setLogs(data ?? []); setLoading(false) })
  }, [user.id])

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="flex gap-2">
        {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3b82f6', animationDelay: `${i*0.15}s` }} />)}
      </div>
    </div>
  )

  if (!logs.length) return (
    <div style={card} className="p-14 text-center">
      <Wrench size={32} color="#374151" className="mx-auto mb-3" />
      <p className="text-sm text-gray-500">Maintenance logs will appear here each month.</p>
    </div>
  )

  // Group by month
  const grouped = logs.reduce((acc, item) => {
    acc[item.month] = acc[item.month] ?? []
    acc[item.month].push(item)
    return acc
  }, {})
  const months = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">A record of everything completed on your website and systems each month.</p>
      {months.map((month, mi) => (
        <motion.div key={month}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: mi * 0.05 }}
          style={card} className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">{monthLabel(month)}</h3>
            <span className="text-xs text-gray-600">{grouped[month].length} task{grouped[month].length !== 1 ? 's' : ''}</span>
          </div>
          <div>
            {grouped[month].map(item => <LogItem key={item.id} item={item} />)}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
