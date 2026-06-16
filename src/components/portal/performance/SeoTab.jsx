import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Search } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../contexts/AuthContext'

const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }

function StatCard({ label, value, sub, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}
      style={card} className="p-5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-extrabold text-white">{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </motion.div>
  )
}

function PositionChange({ change }) {
  if (change === 0) return <span className="flex items-center gap-0.5 text-xs text-gray-600"><Minus size={11} />—</span>
  const up = change > 0
  return (
    <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-green-400' : 'text-red-400'}`}>
      {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {up ? `+${change}` : change}
    </span>
  )
}

export default function SeoTab() {
  const { user } = useAuth()
  const [overviews, setOverviews] = useState([])
  const [keywords, setKeywords]   = useState([])
  const [period, setPeriod]       = useState('')
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    async function load() {
      const [ov, kw] = await Promise.all([
        supabase.from('seo_overview').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('seo_keywords').select('*').eq('user_id', user.id).order('position'),
      ])
      const data = ov.data ?? []
      setOverviews(data)
      if (data.length) setPeriod(data[0].period)
      setKeywords(kw.data ?? [])
      setLoading(false)
    }
    load()
  }, [user.id])

  const active = overviews.find(o => o.period === period) ?? overviews[0]

  if (loading) return <div className="h-48 flex items-center justify-center"><p className="text-sm text-gray-600">Loading…</p></div>

  if (!overviews.length) return (
    <div style={card} className="p-14 text-center">
      <Search size={32} color="#374151" className="mx-auto mb-3" />
      <p className="text-sm text-gray-500">SEO data will appear here once tracking is set up.</p>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center gap-2">
        {overviews.map(o => (
          <button key={o.period} onClick={() => setPeriod(o.period)}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all"
            style={period === o.period
              ? { background: 'rgba(59,130,246,0.25)', color: '#93c5fd', border: '1px solid rgba(96,165,250,0.4)' }
              : { background: 'rgba(255,255,255,0.05)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)' }}>
            {o.period}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Organic Sessions" value={active?.organic_sessions?.toLocaleString()} delay={0} />
        <StatCard label="Impressions"      value={active?.impressions?.toLocaleString()} delay={0.05} />
        <StatCard label="Clicks"           value={active?.clicks?.toLocaleString()} delay={0.1} />
        <StatCard label="Avg. Position"    value={active?.avg_position} sub="Lower is better" delay={0.15} />
      </div>

      {/* Keywords table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
        style={card} className="overflow-hidden">
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-sm font-bold text-white">Keyword Rankings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['Keyword', 'Position', 'Change', 'Monthly Volume', 'Page'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keywords.map((kw, i) => (
                <tr key={kw.id} style={{ borderBottom: i < keywords.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                  <td className="px-5 py-3.5 text-gray-200 font-medium">{kw.keyword}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-white font-bold">#{kw.position}</span>
                  </td>
                  <td className="px-5 py-3.5"><PositionChange change={kw.position_change} /></td>
                  <td className="px-5 py-3.5 text-gray-400">{kw.monthly_volume?.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs font-mono">{kw.page_url}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
