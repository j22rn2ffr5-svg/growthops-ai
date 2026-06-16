import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Megaphone } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../contexts/AuthContext'

const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }

const STATUS = {
  active: { label: 'Active',  color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  paused: { label: 'Paused',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  ended:  { label: 'Ended',   color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
}

const PLATFORMS = ['all', 'google', 'meta']
const PLATFORM_LABEL = { all: 'All Platforms', google: 'Google Ads', meta: 'Meta Ads' }

function sum(arr, key) { return arr.reduce((acc, c) => acc + (c[key] ?? 0), 0) }
function avg(arr, key) { const vals = arr.filter(c => c[key] != null); return vals.length ? (vals.reduce((a, c) => a + c[key], 0) / vals.length) : null }
function fmt(n, dp = 2) { return n != null ? n.toFixed(dp) : '—' }

function StatCard({ label, value, sub, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}
      style={card} className="p-5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-extrabold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </motion.div>
  )
}

export default function PaidAdsTab() {
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState([])
  const [platform, setPlatform]   = useState('all')
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    supabase.from('ads_campaigns').select('*').eq('user_id', user.id).order('spend', { ascending: false })
      .then(({ data }) => { setCampaigns(data ?? []); setLoading(false) })
  }, [user.id])

  const filtered = platform === 'all' ? campaigns : campaigns.filter(c => c.platform === platform)

  const totalSpend       = sum(filtered, 'spend')
  const totalImpressions = sum(filtered, 'impressions')
  const totalClicks      = sum(filtered, 'clicks')
  const totalConversions = sum(filtered, 'conversions')
  const avgRoas          = avg(filtered, 'roas')

  if (loading) return <div className="h-48 flex items-center justify-center"><p className="text-sm text-gray-600">Loading…</p></div>

  if (!campaigns.length) return (
    <div style={card} className="p-14 text-center">
      <Megaphone size={32} color="#374151" className="mx-auto mb-3" />
      <p className="text-sm text-gray-500">Paid advertising data will appear here once campaigns are live.</p>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Platform filter */}
      <div className="flex items-center gap-2">
        {PLATFORMS.map(p => (
          <button key={p} onClick={() => setPlatform(p)}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all capitalize"
            style={platform === p
              ? { background: 'rgba(59,130,246,0.25)', color: '#93c5fd', border: '1px solid rgba(96,165,250,0.4)' }
              : { background: 'rgba(255,255,255,0.05)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)' }}>
            {PLATFORM_LABEL[p]}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Spend"    value={`£${totalSpend.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} delay={0} />
        <StatCard label="Impressions"    value={totalImpressions.toLocaleString()} delay={0.05} />
        <StatCard label="Clicks"         value={totalClicks.toLocaleString()} delay={0.1} />
        <StatCard label="Conversions"    value={totalConversions} delay={0.15} />
        <StatCard label="Avg. ROAS"      value={avgRoas ? `${fmt(avgRoas, 1)}×` : '—'} sub="Return on ad spend" delay={0.2} />
      </div>

      {/* Campaigns table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}
        style={card} className="overflow-hidden">
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-sm font-bold text-white">Campaigns — {PLATFORM_LABEL[platform]}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['Campaign', 'Platform', 'Status', 'Spend', 'Impressions', 'Clicks', 'Conversions', 'ROAS'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const st = STATUS[c.status] ?? STATUS.active
                return (
                  <tr key={c.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                    <td className="px-5 py-3.5 text-gray-200 font-medium max-w-[180px] truncate">{c.name}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-semibold capitalize px-2 py-0.5 rounded-md"
                        style={{ background: c.platform === 'google' ? 'rgba(59,130,246,0.12)' : 'rgba(139,92,246,0.12)', color: c.platform === 'google' ? '#93c5fd' : '#c4b5fd' }}>
                        {c.platform === 'google' ? 'Google' : 'Meta'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-300">£{c.spend?.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-gray-400">{c.impressions?.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-gray-400">{c.clicks?.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-gray-400">{c.conversions}</td>
                    <td className="px-5 py-3.5 text-gray-300 font-semibold">{c.roas ? `${c.roas}×` : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
