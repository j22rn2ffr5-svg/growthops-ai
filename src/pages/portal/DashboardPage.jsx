import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users, Globe, BookOpen, Ticket, ArrowRight, TrendingUp,
  BarChart3, GitMerge, Workflow, Megaphone, Search, Wrench,
  CheckCircle2, Activity, RefreshCw,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { statusConfig, priorityConfig } from './TicketsPage'
import ProjectTracker from '../../components/portal/ProjectTracker'
import MilestonesTracker from '../../components/portal/MilestonesTracker'
import GettingStarted from '../../components/portal/GettingStarted'

const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }

const QUICK_LINKS = [
  { to: '/portal/analytics',   label: 'Analytics',   icon: BarChart3,  color: '#60a5fa' },
  { to: '/portal/performance', label: 'Performance', icon: TrendingUp, color: '#a78bfa' },
  { to: '/portal/pipeline',    label: 'Pipeline',    icon: GitMerge,   color: '#34d399' },
  { to: '/portal/automations', label: 'Automations', icon: Workflow,   color: '#f59e0b' },
  { to: '/portal/marketing',   label: 'Marketing',   icon: Megaphone,  color: '#f472b6' },
  { to: '/portal/website',     label: 'Website',     icon: Globe,      color: '#60a5fa' },
  { to: '/portal/tickets',     label: 'Support',     icon: Wrench,     color: '#94a3b8' },
]

function StatCard({ icon: Icon, label, value, sub, color, to, delay }) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}
      className="p-5 rounded-2xl h-full transition-all"
      style={card}
      onMouseEnter={e => to && (e.currentTarget.style.borderColor = `${color}50`)}
      onMouseLeave={e => to && (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={17} color={color} />
        </div>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-extrabold text-white">{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </motion.div>
  )
  return to ? <Link to={to} style={{ textDecoration: 'none' }}>{inner}</Link> : inner
}

function FunnelBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs font-bold text-white">{count}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <motion.div className="h-full rounded-full" style={{ background: color }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }} />
      </div>
    </div>
  )
}

const MAINT_CAT_ICONS = { security: Activity, updates: RefreshCw, monitoring: Activity, content: BookOpen, support: Wrench, seo: Search }

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(true)

  const [tickets, setTickets]         = useState([])
  const [leads, setLeads]             = useState([])
  const [websiteScore, setWebsiteScore] = useState(null)
  const [contentCount, setContentCount] = useState(0)
  const [topKeyword, setTopKeyword]   = useState(null)
  const [recentUpdates, setRecentUpdates] = useState([])
  const [recentMaint, setRecentMaint] = useState([])
  const [milestones, setMilestones]   = useState([])
  const [hasWebsiteInfo, setHasWebsiteInfo] = useState(false)
  const [seoCount, setSeoCount]       = useState(0)

  useEffect(() => {
    async function fetchAll() {
      const [
        ticketsRes, leadsRes, scoresRes, contentRes,
        keywordsRes, updatesRes, maintRes, milestonesRes,
        websiteInfoRes, seoCountRes,
      ] = await Promise.all([
        supabase.from('tickets').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('leads').select('*').eq('user_id', user.id),
        supabase.from('website_scores').select('*').eq('user_id', user.id).order('recorded_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('content_library').select('id', { count: 'exact' }).eq('user_id', user.id).eq('status', 'published'),
        supabase.from('seo_keywords').select('*').eq('user_id', user.id).order('position').limit(1).maybeSingle(),
        supabase.from('website_updates').select('*').eq('user_id', user.id).order('update_date', { ascending: false }).limit(3),
        supabase.from('maintenance_logs').select('*').eq('user_id', user.id).order('month', { ascending: false }).order('created_at', { ascending: false }).limit(3),
        supabase.from('client_milestones').select('*').eq('user_id', user.id).order('sort_order').order('created_at'),
        supabase.from('website_info').select('id').eq('user_id', user.id).maybeSingle(),
        supabase.from('seo_keywords').select('id', { count: 'exact' }).eq('user_id', user.id),
      ])
      setTickets(ticketsRes.data ?? [])
      setLeads(leadsRes.data ?? [])
      setWebsiteScore(scoresRes.data)
      setContentCount(contentRes.count ?? 0)
      setTopKeyword(keywordsRes.data)
      setRecentUpdates(updatesRes.data ?? [])
      setRecentMaint(maintRes.data ?? [])
      setMilestones(milestonesRes.data ?? [])
      setHasWebsiteInfo(!!websiteInfoRes.data)
      setSeoCount(seoCountRes.count ?? 0)
      setLoading(false)
    }
    fetchAll()
  }, [user.id])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex gap-2">
        {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3b82f6', animationDelay: `${i*0.15}s` }} />)}
      </div>
    </div>
  )

  const isOnboarding = profile?.project_status === 'onboarding'
  const hasNoData    = leads.length === 0 && tickets.length === 0 && !websiteScore && contentCount === 0

  const openTickets     = tickets.filter(t => t.status === 'open').length
  const newLeadsMonth   = leads.filter(l => new Date(l.created_at) > new Date(Date.now() - 30 * 86400000)).length
  const qualifiedLeads  = leads.filter(l => ['qualified','proposal','won'].includes(l.status)).length
  const wonLeads        = leads.filter(l => l.status === 'won').length
  const contactedLeads  = leads.filter(l => ['contacted','qualified','proposal','won'].includes(l.status)).length

  const activity = [
    ...recentUpdates.map(u => ({ type: 'website', label: u.title, sub: u.type, date: u.update_date, color: '#a78bfa' })),
    ...recentMaint.map(m => ({ type: 'maintenance', label: m.title, sub: m.category, date: m.month, color: '#34d399' })),
  ].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')).slice(0, 5)

  return (
    <div className="max-w-5xl mx-auto space-y-7">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-extrabold text-white mb-1">
          Welcome back{profile?.business_name ? `, ${profile.business_name}` : ''}
        </h1>
        <p className="text-sm text-gray-500">
          {profile?.package ? `${profile.package} · ` : ''}
          Account manager: {profile?.account_manager ?? 'Chris Eyres'}
        </p>
      </motion.div>

      {/* Project tracker */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.04 }} className="space-y-3">
        <ProjectTracker status={profile?.project_status ?? 'onboarding'} />
        {milestones.length > 0 && <MilestonesTracker milestones={milestones} />}
      </motion.div>

      {/* Getting started (onboarding with no data) */}
      {isOnboarding && hasNoData ? (
        <GettingStarted
          businessName={profile?.business_name}
          accountManager={profile?.account_manager}
          checks={{
            hasWebsite:   hasWebsiteInfo,
            hasSeo:       seoCount > 0,
            hasContent:   contentCount > 0,
            hasLeads:     leads.length > 0,
            hasAnalytics: !!profile?.analytics_embed_url,
          }}
        />
      ) : (
      <>
      {/* Headline stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users}    label="New Leads"     value={newLeadsMonth}   sub="last 30 days"       color="#34d399" to="/portal/pipeline"    delay={0.05} />
        <StatCard icon={Globe}    label="Site Score"    value={websiteScore ? `${websiteScore.performance_score}` : '—'} sub="Lighthouse performance" color="#60a5fa" to="/portal/website" delay={0.1} />
        <StatCard icon={BookOpen} label="Content Live"  value={contentCount}    sub="published pieces"   color="#a78bfa" to="/portal/marketing"   delay={0.15} />
        <StatCard icon={Ticket}   label="Open Tickets"  value={openTickets}     sub="awaiting response"  color="#f59e0b" to="/portal/tickets"     delay={0.2} />
      </div>

      {/* Middle row: pipeline funnel + activity feed */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Lead pipeline */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.22 }}
          style={card} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Lead Pipeline</h2>
            <Link to="/portal/pipeline" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors" style={{ textDecoration: 'none' }}>
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {leads.length === 0 ? (
            <p className="text-xs text-gray-600 py-4">No leads yet.</p>
          ) : (
            <div className="space-y-3.5">
              <FunnelBar label="Total Leads"  count={leads.length}   total={leads.length} color="#6b7280" />
              <FunnelBar label="Contacted"    count={contactedLeads} total={leads.length} color="#3b82f6" />
              <FunnelBar label="Qualified"    count={qualifiedLeads} total={leads.length} color="#8b5cf6" />
              <FunnelBar label="Won"          count={wonLeads}       total={leads.length} color="#10b981" />
            </div>
          )}

          {topKeyword && (
            <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Top Ranking Keyword</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300 font-medium">{topKeyword.keyword}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">#{topKeyword.position}</span>
                  {topKeyword.position_change > 0 && <span className="text-xs text-green-400 font-semibold">+{topKeyword.position_change}</span>}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Recent activity */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}
          style={card} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Recent Activity</h2>
          </div>
          {activity.length === 0 ? (
            <p className="text-xs text-gray-600 py-4">No recent activity yet.</p>
          ) : (
            <div className="space-y-3">
              {activity.map((a, i) => {
                const Icon = a.type === 'maintenance' ? (MAINT_CAT_ICONS[a.sub] ?? CheckCircle2) : Globe
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${a.color}18` }}>
                      <Icon size={13} color={a.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200 font-medium leading-snug">{a.label}</p>
                      <p className="text-xs text-gray-600 mt-0.5 capitalize">{a.sub} · {a.date ? new Date(a.date + (a.date.length === 7 ? '-01' : '')).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : ''}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {websiteScore && (
            <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Latest Lighthouse</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: 'Perf', value: websiteScore.performance_score, color: '#f59e0b' },
                  { label: 'SEO',  value: websiteScore.seo_score,         color: '#60a5fa' },
                  { label: 'A11y', value: websiteScore.accessibility_score, color: '#a78bfa' },
                  { label: 'BP',   value: websiteScore.best_practices_score, color: '#34d399' },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-lg font-extrabold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs text-gray-600">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent tickets */}
      {tickets.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.28 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white">Recent Tickets</h2>
            <Link to="/portal/tickets" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors" style={{ textDecoration: 'none' }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            {tickets.map((ticket, i) => {
              const sc = statusConfig[ticket.status]    ?? statusConfig.open
              const pc = priorityConfig[ticket.priority] ?? priorityConfig.normal
              return (
                <Link key={ticket.id} to={`/portal/tickets/${ticket.id}`} style={{ textDecoration: 'none' }}>
                  <div className="flex items-center gap-4 px-5 py-3.5 transition-colors"
                    style={{ borderBottom: i < tickets.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent'}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{ticket.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{ticket.category}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: pc.bg, color: pc.color }}>{ticket.priority}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Quick links */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.32 }}>
        <h2 className="text-sm font-bold text-white mb-3">Quick Links</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {QUICK_LINKS.map(l => {
            const Icon = l.icon
            return (
              <Link key={l.to} to={l.to} style={{ textDecoration: 'none' }}>
                <div className="flex flex-col items-center gap-2 py-4 rounded-2xl transition-all text-center"
                  style={card}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${l.color}40`; e.currentTarget.style.background = `${l.color}08` }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.025)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${l.color}18` }}>
                    <Icon size={16} color={l.color} />
                  </div>
                  <span className="text-xs font-semibold text-gray-400">{l.label}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </motion.div>
      </>
      )}
    </div>
  )
}
