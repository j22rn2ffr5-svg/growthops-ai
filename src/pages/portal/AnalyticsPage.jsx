import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, ArrowRight, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const REPORT_ICONS = {
  'Content & Landing Pages': '📄',
  'Leads & Conversions': '🎯',
  'Audience': '👥',
  'SEO & Search': '🔍',
  'Paid Ads': '💰',
  'Overview': '📊',
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [dashboards, setDashboards] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('client_dashboards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at')
      .then(({ data }) => {
        setDashboards(data ?? [])
        setLoading(false)
      })
  }, [user.id])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-extrabold text-white mb-1">Analytics</h1>
        <p className="text-sm text-gray-500">Your live reporting dashboards.</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="flex gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3b82f6', animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      ) : dashboards.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl p-16 text-center"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
        >
          <BarChart3 size={48} color="#1f2937" className="mx-auto mb-4" />
          <h2 className="text-base font-bold text-white mb-2">No dashboards set up yet</h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            Your analytics dashboards will be added here once your reporting is live. We'll let you know when they're ready.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboards.map((db, i) => (
            <motion.div
              key={db.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              onClick={() => navigate(`/portal/analytics/${db.id}`)}
              className="group cursor-pointer rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
              onMouseEnter={e => e.currentTarget.style.border = '1px solid rgba(59,130,246,0.4)'}
              onMouseLeave={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}
                >
                  {REPORT_ICONS[db.name] ?? '📊'}
                </div>
                <ArrowRight size={16} color="#6b7280" className="mt-1 group-hover:text-blue-400 transition-colors" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">{db.name}</h3>
                <p className="text-xs text-gray-500">
                  {db.embed_url && !db.embed_url.includes('REPLACE_WITH') ? 'Live report' : 'Being configured'}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {db.embed_url && !db.embed_url.includes('REPLACE_WITH') ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                ) : (
                  <Clock size={12} color="#6b7280" />
                )}
                <span className="text-xs text-gray-500">
                  {db.embed_url && !db.embed_url.includes('REPLACE_WITH') ? 'Active' : 'Coming soon'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
