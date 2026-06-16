import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, BookOpen, FileText, Mail, Layout, Image } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../contexts/AuthContext'

const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }

const TYPES = {
  blog:           { label: 'Blog Article',    icon: BookOpen,  color: '#60a5fa', bg: 'rgba(96,165,250,0.12)'  },
  landing_page:   { label: 'Landing Page',    icon: Layout,    color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  case_study:     { label: 'Case Study',      icon: FileText,  color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
  email_sequence: { label: 'Email Sequence',  icon: Mail,      color: '#fb923c', bg: 'rgba(251,146,60,0.12)'  },
  social:         { label: 'Social Content',  icon: Image,     color: '#f472b6', bg: 'rgba(244,114,182,0.12)' },
}

const STATUS = {
  published: { label: 'Published', color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
  in_review: { label: 'In Review', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  draft:     { label: 'Draft',     color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
}

const TYPE_FILTERS = ['all', ...Object.keys(TYPES)]

export default function ContentLibrary() {
  const { user } = useAuth()
  const [items, setItems]     = useState([])
  const [filter, setFilter]   = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('content_library').select('*').eq('user_id', user.id)
      .order('published_date', { ascending: false, nullsFirst: false })
      .then(({ data }) => { setItems(data ?? []); setLoading(false) })
  }, [user.id])

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter)

  const published = items.filter(i => i.status === 'published').length
  const inReview  = items.filter(i => i.status === 'in_review').length
  const draft     = items.filter(i => i.status === 'draft').length

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="flex gap-2">
        {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3b82f6', animationDelay: `${i*0.15}s` }} />)}
      </div>
    </div>
  )

  return (
    <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Published', value: published, color: '#34d399' },
          { label: 'In Review', value: inReview,  color: '#f59e0b' },
          { label: 'Draft',     value: draft,      color: '#6b7280' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }} style={card} className="p-4 text-center">
            <p className="text-2xl font-extrabold text-white">{s.value}</p>
            <p className="text-xs font-semibold mt-1" style={{ color: s.color }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-2">
        {TYPE_FILTERS.map(f => {
          const t = TYPES[f]
          const isActive = filter === f
          return (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all capitalize"
              style={isActive
                ? { background: t ? t.bg : 'rgba(59,130,246,0.2)', color: t?.color ?? '#93c5fd', border: `1px solid ${t?.color ?? '#60a5fa'}50` }
                : { background: 'rgba(255,255,255,0.05)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)' }
              }>
              {t ? t.label : 'All'}
            </button>
          )
        })}
      </div>

      {/* Content list */}
      {filtered.length === 0 ? (
        <div style={card} className="p-12 text-center">
          <BookOpen size={30} color="#374151" className="mx-auto mb-3" />
          <p className="text-sm text-gray-500">No content found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, i) => {
            const t  = TYPES[item.type]  ?? TYPES.blog
            const st = STATUS[item.status] ?? STATUS.draft
            const Icon = t.icon
            const date = item.published_date
              ? new Date(item.published_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              : null

            return (
              <motion.div key={item.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                style={card} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: t.bg }}>
                    <Icon size={16} color={t.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-white leading-snug">{item.title}</p>
                          {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer"
                              className="text-gray-600 hover:text-blue-400 transition-colors flex-shrink-0">
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: t.bg, color: t.color }}>{t.label}</span>
                      </div>
                    </div>
                    {date && (
                      <p className="text-xs text-gray-600 mt-2">Published {date}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
