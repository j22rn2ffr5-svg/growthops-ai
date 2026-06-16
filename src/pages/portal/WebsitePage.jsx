import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Globe, ExternalLink, TrendingUp, TrendingDown, Zap, Search, ShieldCheck, Star, Calendar, Tag } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }

const STATUS = {
  live:        { label: 'Live',        color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  development: { label: 'In Development', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  maintenance: { label: 'Maintenance', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
}

const UPDATE_TYPES = {
  content:     { label: 'Content',     color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  design:      { label: 'Design',      color: '#60a5fa', bg: 'rgba(96,165,250,0.12)'  },
  technical:   { label: 'Technical',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  performance: { label: 'Performance', color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
  seo:         { label: 'SEO',         color: '#fb923c', bg: 'rgba(251,146,60,0.12)'  },
}

function ScoreRing({ score, label, icon: Icon, color }) {
  const radius = 28
  const circ = 2 * Math.PI * radius
  const fill = (score / 100) * circ

  return (
    <div style={card} className="p-5 flex flex-col items-center gap-3">
      <div className="relative w-20 h-20">
        <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
          <motion.circle
            cx="40" cy="40" r={radius} fill="none"
            stroke={color} strokeWidth="7"
            strokeDasharray={circ}
            strokeDashoffset={circ}
            strokeLinecap="round"
            animate={{ strokeDashoffset: circ - fill }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-extrabold text-white">{score}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Icon size={12} color={color} />
        <span className="text-xs font-semibold text-gray-400">{label}</span>
      </div>
    </div>
  )
}

function UpdateRow({ update, i, total }) {
  const t = UPDATE_TYPES[update.type] ?? UPDATE_TYPES.content
  const date = update.update_date
    ? new Date(update.update_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

  return (
    <div
      className="flex items-start gap-4 px-5 py-4"
      style={{ borderBottom: i < total - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
    >
      <span className="text-xs font-semibold px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5" style={{ background: t.bg, color: t.color }}>{t.label}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{update.title}</p>
        {update.description && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{update.description}</p>}
      </div>
      <span className="text-xs text-gray-600 flex-shrink-0 mt-0.5">{date}</span>
    </div>
  )
}

export default function WebsitePage() {
  const { user } = useAuth()
  const [info, setInfo]       = useState(null)
  const [scores, setScores]   = useState(null)
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [infoRes, scoresRes, updatesRes] = await Promise.all([
        supabase.from('website_info').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('website_scores').select('*').eq('user_id', user.id).order('recorded_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('website_updates').select('*').eq('user_id', user.id).order('update_date', { ascending: false }).limit(10),
      ])
      setInfo(infoRes.data)
      setScores(scoresRes.data)
      setUpdates(updatesRes.data ?? [])
      setLoading(false)
    }
    load()
  }, [user.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex gap-2">
          {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3b82f6', animationDelay: `${i*0.15}s` }} />)}
        </div>
      </div>
    )
  }

  const st = STATUS[info?.status ?? 'live']
  const launchDate = info?.launch_date
    ? new Date(info.launch_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-extrabold text-white mb-1">Website</h1>
        <p className="text-sm text-gray-500">Your website performance, recent changes, and health metrics.</p>
      </motion.div>

      {/* Overview card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
        style={card} className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)' }}>
              <Globe size={22} color="white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {info?.url && (
                  <a href={info.url} target="_blank" rel="noopener noreferrer"
                    className="text-base font-bold text-white hover:text-blue-300 transition-colors flex items-center gap-1.5"
                    style={{ textDecoration: 'none' }}>
                    {info.url.replace('https://', '')} <ExternalLink size={13} />
                  </a>
                )}
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>{st.label}</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                {launchDate && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar size={11} /> Launched {launchDate}
                  </span>
                )}
                {info?.tech_stack?.length > 0 && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Tag size={11} /> {info.tech_stack.join(' · ')}
                  </span>
                )}
              </div>
            </div>
          </div>
          {scores && (
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-600 mb-0.5">Last audit</p>
              <p className="text-xs text-gray-500">
                {new Date(scores.recorded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          )}
        </div>

        {info?.notes && (
          <p className="mt-4 text-xs text-gray-600 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {info.notes}
          </p>
        )}
      </motion.div>

      {/* Score rings */}
      {scores && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <h2 className="text-sm font-bold text-white mb-3">Lighthouse Scores</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ScoreRing score={scores.performance_score}    label="Performance"    icon={Zap}        color="#f59e0b" />
            <ScoreRing score={scores.seo_score}            label="SEO"            icon={Search}     color="#60a5fa" />
            <ScoreRing score={scores.accessibility_score}  label="Accessibility"  icon={Star}       color="#a78bfa" />
            <ScoreRing score={scores.best_practices_score} label="Best Practices" icon={ShieldCheck} color="#34d399" />
          </div>
          <p className="text-xs text-gray-700 mt-2">Scores are out of 100. 90+ is excellent, 50–89 needs improvement, below 50 is poor.</p>
        </motion.div>
      )}

      {/* Update log */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
        <h2 className="text-sm font-bold text-white mb-3">Recent Updates</h2>
        {updates.length === 0 ? (
          <div style={{ ...card, padding: '3rem', textAlign: 'center' }}>
            <p className="text-sm text-gray-600">No updates logged yet.</p>
          </div>
        ) : (
          <div style={{ ...card, overflow: 'hidden' }}>
            {updates.map((u, i) => <UpdateRow key={u.id} update={u} i={i} total={updates.length} />)}
          </div>
        )}
      </motion.div>
    </div>
  )
}
