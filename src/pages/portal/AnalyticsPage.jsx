import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, ArrowRight, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const REPORT_ILLUSTRATIONS = {
  'Content & Landing Pages': (
    <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Browser window */}
      <rect x="6" y="6" width="52" height="40" rx="4" fill="rgba(59,130,246,0.15)" stroke="rgba(59,130,246,0.4)" strokeWidth="1.5"/>
      <rect x="6" y="6" width="52" height="10" rx="4" fill="rgba(59,130,246,0.3)"/>
      <circle cx="13" cy="11" r="2" fill="rgba(255,255,255,0.4)"/>
      <circle cx="20" cy="11" r="2" fill="rgba(255,255,255,0.4)"/>
      <circle cx="27" cy="11" r="2" fill="rgba(255,255,255,0.4)"/>
      {/* Page content lines */}
      <rect x="13" y="22" width="30" height="2.5" rx="1.25" fill="rgba(255,255,255,0.5)"/>
      <rect x="13" y="27" width="22" height="2" rx="1" fill="rgba(255,255,255,0.25)"/>
      <rect x="13" y="31" width="26" height="2" rx="1" fill="rgba(255,255,255,0.25)"/>
      <rect x="13" y="35" width="18" height="2" rx="1" fill="rgba(255,255,255,0.25)"/>
      {/* Cursor */}
      <path d="M62 36 L62 50 L65 46 L68 52 L70 51 L67 45 L72 45 Z" fill="rgba(59,130,246,0.8)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5"/>
    </svg>
  ),
  'Leads & Conversions': (
    <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Funnel */}
      <path d="M10 10 L70 10 L50 28 L50 50 L30 50 L30 28 Z" fill="rgba(59,130,246,0.15)" stroke="rgba(59,130,246,0.4)" strokeWidth="1.5"/>
      <path d="M10 10 L70 10 L55 22 L25 22 Z" fill="rgba(59,130,246,0.3)"/>
      <path d="M25 22 L55 22 L50 34 L30 34 Z" fill="rgba(59,130,246,0.2)"/>
      {/* Arrow down */}
      <path d="M40 52 L36 46 L44 46 Z" fill="rgba(59,130,246,0.8)"/>
      {/* Tick */}
      <circle cx="68" cy="46" r="8" fill="rgba(34,197,94,0.2)" stroke="rgba(34,197,94,0.5)" strokeWidth="1.5"/>
      <path d="M64 46 L67 49 L72 43" stroke="rgba(34,197,94,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  'Audience': (
    <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* People icons */}
      <circle cx="20" cy="22" r="8" fill="rgba(59,130,246,0.3)" stroke="rgba(59,130,246,0.5)" strokeWidth="1.5"/>
      <path d="M8 42 Q8 32 20 32 Q32 32 32 42" fill="rgba(59,130,246,0.2)" stroke="rgba(59,130,246,0.4)" strokeWidth="1.5"/>
      <circle cx="42" cy="20" r="6" fill="rgba(59,130,246,0.2)" stroke="rgba(59,130,246,0.35)" strokeWidth="1.5"/>
      <path d="M32 38 Q32 30 42 30 Q52 30 52 38" fill="rgba(59,130,246,0.15)" stroke="rgba(59,130,246,0.3)" strokeWidth="1.5"/>
      <circle cx="60" cy="24" r="5" fill="rgba(59,130,246,0.15)" stroke="rgba(59,130,246,0.3)" strokeWidth="1.5"/>
      <path d="M51 42 Q51 34 60 34 Q69 34 69 42" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.25)" strokeWidth="1.5"/>
    </svg>
  ),
  'SEO & Search': (
    <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Magnifying glass */}
      <circle cx="32" cy="28" r="18" fill="rgba(59,130,246,0.12)" stroke="rgba(59,130,246,0.4)" strokeWidth="2"/>
      <circle cx="32" cy="28" r="12" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.25)" strokeWidth="1.5"/>
      <path d="M45 41 L58 54" stroke="rgba(59,130,246,0.7)" strokeWidth="3" strokeLinecap="round"/>
      {/* Ranking bars inside lens */}
      <rect x="25" y="32" width="3" height="6" rx="1" fill="rgba(59,130,246,0.6)"/>
      <rect x="30" y="28" width="3" height="10" rx="1" fill="rgba(59,130,246,0.8)"/>
      <rect x="35" y="30" width="3" height="8" rx="1" fill="rgba(59,130,246,0.5)"/>
    </svg>
  ),
  'Paid Ads': (
    <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* ROAS arrow up */}
      <polyline points="8,48 22,34 34,40 50,20 66,14" fill="none" stroke="rgba(59,130,246,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8" cy="48" r="2.5" fill="rgba(59,130,246,0.6)"/>
      <circle cx="22" cy="34" r="2.5" fill="rgba(59,130,246,0.6)"/>
      <circle cx="34" cy="40" r="2.5" fill="rgba(59,130,246,0.6)"/>
      <circle cx="50" cy="20" r="2.5" fill="rgba(59,130,246,0.6)"/>
      <circle cx="66" cy="14" r="2.5" fill="rgba(59,130,246,0.9)"/>
      {/* Currency symbol */}
      <circle cx="66" cy="14" r="8" fill="rgba(59,130,246,0.2)" stroke="rgba(59,130,246,0.4)" strokeWidth="1.5"/>
      <text x="63" y="18" fill="rgba(255,255,255,0.8)" fontSize="8" fontWeight="bold">£</text>
    </svg>
  ),
  'Overview': (
    <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="8" y="32" width="12" height="20" rx="2" fill="rgba(59,130,246,0.4)"/>
      <rect x="24" y="22" width="12" height="30" rx="2" fill="rgba(59,130,246,0.6)"/>
      <rect x="40" y="14" width="12" height="38" rx="2" fill="rgba(59,130,246,0.8)"/>
      <rect x="56" y="26" width="12" height="26" rx="2" fill="rgba(59,130,246,0.5)"/>
      <line x1="6" y1="52" x2="74" y2="52" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    </svg>
  ),
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
      .eq('section', 'analytics')
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
                  className="w-16 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}
                >
                  {REPORT_ILLUSTRATIONS[db.name] ?? <BarChart3 size={24} color="#3b82f6" />}
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
