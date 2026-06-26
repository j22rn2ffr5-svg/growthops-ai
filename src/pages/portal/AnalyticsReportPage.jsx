import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const isPlaceholder = url => !url || url.includes('REPLACE_WITH')

export default function AnalyticsReportPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('client_dashboards')
      .select('*')
      .eq('user_id', user.id)
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setDashboard(data)
        setLoading(false)
      })
  }, [user.id, id])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/portal/analytics')}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} /> Back to Analytics
            </button>
          </div>
          {dashboard && !isPlaceholder(dashboard.embed_url) && (
            <a
              href={dashboard.embed_url}
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
          )}
        </div>
        <h1 className="text-2xl font-extrabold text-white">{dashboard?.name ?? 'Loading...'}</h1>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="flex gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3b82f6', animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      ) : dashboard && !isPlaceholder(dashboard.embed_url) ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <iframe
            src={dashboard.embed_url}
            title={dashboard.name}
            width="100%"
            height="1100"
            style={{ border: 'none', display: 'block' }}
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
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
            This dashboard is being configured. We'll notify you as soon as it's live.
          </p>
        </motion.div>
      )}
    </div>
  )
}
