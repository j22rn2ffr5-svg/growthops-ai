import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, ExternalLink, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const isPlaceholder = url => !url || url.includes('REPLACE_WITH')

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [dashboards, setDashboards] = useState([])
  const [loading, setLoading]       = useState(true)
  const [active, setActive]         = useState(null)

  useEffect(() => {
    supabase
      .from('client_dashboards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at')
      .then(({ data }) => {
        const items = data ?? []
        setDashboards(items)
        if (items.length > 0) setActive(items[0].id)
        setLoading(false)
      })
  }, [user.id])

  const activeDash = dashboards.find(d => d.id === active)

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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Tab selector */}
          {dashboards.length > 1 && (
            <div
              className="flex gap-1 p-1 rounded-xl w-fit"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {dashboards.map(db => (
                <button
                  key={db.id}
                  onClick={() => setActive(db.id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                  style={
                    active === db.id
                      ? { background: 'rgba(59,130,246,0.2)', color: '#93c5fd' }
                      : { color: '#6b7280' }
                  }
                >
                  {db.name}
                </button>
              ))}
            </div>
          )}

          {/* Dashboard header */}
          {activeDash && (
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">{activeDash.name}</h2>
              <a
                href={activeDash.embed_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#9ca3af',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#e5e7eb'}
                onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
              >
                <ExternalLink size={12} /> Open full report
              </a>
            </div>
          )}

          {/* Full-width report iframe */}
          {activeDash && !isPlaceholder(activeDash.embed_url) ? (
            <motion.div
              key={activeDash.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
            >
              <iframe
                src={activeDash.embed_url}
                title={activeDash.name}
                width="100%"
                height="800"
                style={{ border: 'none', display: 'block' }}
                allowFullScreen
                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              />
            </motion.div>
          ) : (
            <motion.div
              key={activeDash?.id + '-placeholder'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl flex flex-col items-center justify-center text-center"
              style={{ border: '1px dashed rgba(255,255,255,0.08)', height: '400px', background: 'rgba(255,255,255,0.01)' }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}
              >
                <Clock size={26} color="#3b82f6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Dashboard being set up</h3>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                Your <span className="text-gray-400">{activeDash?.name}</span> dashboard is being configured. We'll notify you as soon as it's live.
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}
