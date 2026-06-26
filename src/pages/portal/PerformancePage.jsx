import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, ArrowRight, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const REPORT_ILLUSTRATIONS = {
  'SEO & Search': (
    <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="32" cy="28" r="18" fill="rgba(59,130,246,0.12)" stroke="rgba(59,130,246,0.4)" strokeWidth="2"/>
      <circle cx="32" cy="28" r="12" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.25)" strokeWidth="1.5"/>
      <path d="M45 41 L58 54" stroke="rgba(59,130,246,0.7)" strokeWidth="3" strokeLinecap="round"/>
      <rect x="25" y="32" width="3" height="6" rx="1" fill="rgba(59,130,246,0.6)"/>
      <rect x="30" y="28" width="3" height="10" rx="1" fill="rgba(59,130,246,0.8)"/>
      <rect x="35" y="30" width="3" height="8" rx="1" fill="rgba(59,130,246,0.5)"/>
    </svg>
  ),
  'Paid Ads': (
    <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <polyline points="8,48 22,34 34,40 50,20 66,14" fill="none" stroke="rgba(59,130,246,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8" cy="48" r="2.5" fill="rgba(59,130,246,0.6)"/>
      <circle cx="22" cy="34" r="2.5" fill="rgba(59,130,246,0.6)"/>
      <circle cx="34" cy="40" r="2.5" fill="rgba(59,130,246,0.6)"/>
      <circle cx="50" cy="20" r="2.5" fill="rgba(59,130,246,0.6)"/>
      <circle cx="66" cy="14" r="2.5" fill="rgba(59,130,246,0.9)"/>
      <circle cx="66" cy="14" r="8" fill="rgba(59,130,246,0.2)" stroke="rgba(59,130,246,0.4)" strokeWidth="1.5"/>
      <text x="63" y="18" fill="rgba(255,255,255,0.8)" fontSize="8" fontWeight="bold">£</text>
    </svg>
  ),
}

export default function PerformancePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [dashboards, setDashboards] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('client_dashboards')
      .select('*')
      .eq('user_id', user.id)
      .eq('section', 'performance')
      .order('created_at')
      .then(({ data }) => {
        setDashboards(data ?? [])
        setLoading(false)
      })
  }, [user.id])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-extrabold text-white mb-1">Performance</h1>
        <p className="text-sm text-gray-500">How your marketing channels are performing.</p>
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
          <TrendingUp size={48} color="#1f2937" className="mx-auto mb-4" />
          <h2 className="text-base font-bold text-white mb-2">No performance reports yet</h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            Your SEO and paid ads reports will appear here once your channels are set up.
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
              onClick={() => navigate(`/portal/performance/${db.id}`)}
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
                  className="w-16 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}
                >
                  {REPORT_ILLUSTRATIONS[db.name] ?? <TrendingUp size={24} color="#3b82f6" />}
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
