import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, BarChart3, AlertCircle,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { statusConfig, priorityConfig } from './TicketsPage'
import ProjectTracker from '../../components/portal/ProjectTracker'
import MilestonesTracker from '../../components/portal/MilestonesTracker'
import GettingStarted from '../../components/portal/GettingStarted'

const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }

function SectionHeader({ number, title, to }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        {number && <span className="text-xs font-bold text-gray-600 tabular-nums">{number}</span>}
        <h2 className="text-sm font-bold text-white">{title}</h2>
      </div>
      {to && (
        <Link to={to} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors" style={{ textDecoration: 'none' }}>
          View all <ArrowRight size={11} />
        </Link>
      )}
    </div>
  )
}

function MiniStat({ label, value, sub, color = '#60a5fa' }) {
  return (
    <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-extrabold" style={{ color }}>{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
    </div>
  )
}

function NeedsSetup({ description }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.12)' }}>
      <AlertCircle size={14} color="#f59e0b" className="flex-shrink-0 mt-0.5" />
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </div>
  )
}

function FunnelBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs font-bold text-white">{count} <span className="text-gray-600 font-normal">({pct}%)</span></span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <motion.div className="h-full rounded-full" style={{ background: color }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }} />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(true)

  const [tickets, setTickets]         = useState([])
  const [leads, setLeads]             = useState([])
  const [websiteScore, setWebsiteScore] = useState(null)
  const [contentCount, setContentCount] = useState(0)
  const [topKeyword, setTopKeyword]   = useState(null)
  const [seoCount, setSeoCount]       = useState(0)
  const [milestones, setMilestones]   = useState([])
  const [hasWebsiteInfo, setHasWebsiteInfo] = useState(false)
  const [adsCampaigns, setAdsCampaigns] = useState([])
  const [emailCampaigns, setEmailCampaigns] = useState([])
  const [dashboards, setDashboards]   = useState([])

  useEffect(() => {
    async function fetchAll() {
      const [
        ticketsRes, leadsRes, scoresRes, contentRes,
        keywordsRes, seoCountRes, milestonesRes,
        websiteInfoRes, adsRes, emailRes, dashboardsRes,
      ] = await Promise.all([
        supabase.from('tickets').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('leads').select('*').eq('user_id', user.id),
        supabase.from('website_scores').select('*').eq('user_id', user.id).order('recorded_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('content_library').select('id', { count: 'exact' }).eq('user_id', user.id).eq('status', 'published'),
        supabase.from('seo_keywords').select('*').eq('user_id', user.id).order('position').limit(1).maybeSingle(),
        supabase.from('seo_keywords').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('client_milestones').select('*').eq('user_id', user.id).order('sort_order').order('created_at'),
        supabase.from('website_info').select('id').eq('user_id', user.id).maybeSingle(),
        supabase.from('ads_campaigns').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('email_campaigns').select('*').eq('user_id', user.id).order('sent_at', { ascending: false }).limit(5),
        supabase.from('client_dashboards').select('*').eq('user_id', user.id).order('created_at'),
      ])
      setTickets(ticketsRes.data ?? [])
      setLeads(leadsRes.data ?? [])
      setWebsiteScore(scoresRes.data)
      setContentCount(contentRes.count ?? 0)
      setTopKeyword(keywordsRes.data)
      setSeoCount(seoCountRes.count ?? 0)
      setMilestones(milestonesRes.data ?? [])
      setHasWebsiteInfo(!!websiteInfoRes.data)
      setAdsCampaigns(adsRes.data ?? [])
      setEmailCampaigns(emailRes.data ?? [])
      setDashboards(dashboardsRes.data ?? [])
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

  // Lead calculations
  const thirtyDaysAgo     = Date.now() - 30 * 86400000
  const newLeadsMonth     = leads.filter(l => new Date(l.created_at) > thirtyDaysAgo).length
  const wonLeads          = leads.filter(l => l.status === 'won').length
  const wonThisMonth      = leads.filter(l => l.status === 'won' && new Date(l.created_at) > thirtyDaysAgo).length
  const qualifiedLeads    = leads.filter(l => ['qualified','proposal','won'].includes(l.status)).length
  const contactedLeads    = leads.filter(l => ['contacted','qualified','proposal','won'].includes(l.status)).length
  const sourceCounts      = leads.reduce((acc, l) => { if (l.source) acc[l.source] = (acc[l.source] || 0) + 1; return acc }, {})
  const topSource         = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
  const pipelineValue     = leads.filter(l => !['lost','won'].includes(l.status) && l.value).reduce((s, l) => s + (parseFloat(l.value) || 0), 0)

  // Ads calculations
  const activeAds  = adsCampaigns.filter(c => c.status === 'active')
  const totalSpend = activeAds.reduce((s, c) => s + (parseFloat(c.spend) || 0), 0)
  const roasItems  = activeAds.filter(c => c.roas)
  const avgRoas    = roasItems.length > 0 ? (roasItems.reduce((s, c) => s + parseFloat(c.roas), 0) / roasItems.length).toFixed(1) : null

  // Email calculations
  const openRateItems = emailCampaigns.filter(e => e.open_rate)
  const avgOpenRate   = openRateItems.length > 0 ? Math.round(openRateItems.reduce((s, e) => s + parseFloat(e.open_rate), 0) / openRateItems.length) : null

  const openTickets = tickets.filter(t => t.status === 'open')

  return (
    <div className="max-w-5xl mx-auto space-y-5">

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

      {isOnboarding && hasNoData ? (
        <GettingStarted
          businessName={profile?.business_name}
          accountManager={profile?.account_manager}
          checks={{
            hasWebsite:   hasWebsiteInfo,
            hasSeo:       seoCount > 0,
            hasContent:   contentCount > 0,
            hasLeads:     leads.length > 0,
            hasAnalytics: dashboards.length > 0,
          }}
        />
      ) : (
      <>

      {/* ── 01. LEAD GENERATION ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.06 }} style={card} className="p-5">
        <SectionHeader number="01" title="Lead Generation" to="/portal/pipeline" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MiniStat label="New Leads (30d)" value={newLeadsMonth} sub="this month" color="#34d399" />
          <MiniStat label="Total Leads" value={leads.length} sub="all time" color="#60a5fa" />
          <MiniStat label="Won This Month" value={wonThisMonth} color="#a78bfa" />
          <MiniStat label="Top Source" value={topSource ?? '—'} sub={topSource ? `${sourceCounts[topSource]} leads` : 'no data yet'} color="#f59e0b" />
        </div>
        {pipelineValue > 0 && (
          <p className="text-xs text-gray-500 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            Active pipeline value: <span className="text-white font-semibold">£{pipelineValue.toLocaleString('en-GB')}</span>
          </p>
        )}
      </motion.div>

      {/* ── 02–04. CONVERSIONS, TRAFFIC & SOURCES ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.09 }} style={card} className="p-5">
        <SectionHeader number="02–04" title="Conversions, Traffic & Sources" to="/portal/analytics" />
        {dashboards.length > 0 ? (
          <div className="grid sm:grid-cols-3 gap-3">
            {dashboards.map(d => (
              <Link key={d.id} to="/portal/analytics" style={{ textDecoration: 'none' }}>
                <div className="flex items-center gap-3 p-3 rounded-xl transition-all"
                  style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.14)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.06)'}>
                  <BarChart3 size={14} color="#60a5fa" className="flex-shrink-0" />
                  <span className="text-sm text-gray-200 font-medium flex-1 truncate">{d.name}</span>
                  <ArrowRight size={12} color="#60a5fa" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <NeedsSetup description="Conversions, traffic volume, and traffic sources all come from Google Analytics 4. Ask your account manager to connect your GA4 dashboard to unlock these sections." />
        )}
      </motion.div>

      {/* ── 05. PAID ADVERTISING ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.12 }} style={card} className="p-5">
        <SectionHeader number="05" title="Paid Advertising" to="/portal/marketing" />
        {adsCampaigns.length === 0 ? (
          <p className="text-xs text-gray-600 py-1">No paid campaigns set up yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MiniStat label="Active Campaigns" value={activeAds.length} color="#f472b6" />
            <MiniStat label="Total Spend" value={totalSpend > 0 ? `£${totalSpend.toLocaleString('en-GB', { maximumFractionDigits: 0 })}` : '—'} sub="active campaigns" color="#fb923c" />
            <MiniStat label="Avg ROAS" value={avgRoas ? `${avgRoas}x` : '—'} sub="return on ad spend" color="#34d399" />
            <MiniStat label="Total Campaigns" value={adsCampaigns.length} sub="all time" color="#60a5fa" />
          </div>
        )}
      </motion.div>

      {/* ── 06. SITE HEALTH ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} style={card} className="p-5">
        <SectionHeader number="06" title="Site Health" to="/portal/website" />
        {!websiteScore ? (
          <p className="text-xs text-gray-600 py-1">No Lighthouse scores recorded yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MiniStat label="Performance" value={websiteScore.performance_score ?? '—'} sub="/ 100" color="#f59e0b" />
            <MiniStat label="SEO" value={websiteScore.seo_score ?? '—'} sub="/ 100" color="#60a5fa" />
            <MiniStat label="Accessibility" value={websiteScore.accessibility_score ?? '—'} sub="/ 100" color="#a78bfa" />
            <MiniStat label="Best Practices" value={websiteScore.best_practices_score ?? '—'} sub="/ 100" color="#34d399" />
          </div>
        )}
      </motion.div>

      {/* ── 07. PAGE PERFORMANCE ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.18 }} style={card} className="p-5">
        <SectionHeader number="07" title="Page Performance" to="/portal/website" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <MiniStat label="Top Keyword Rank" value={topKeyword ? `#${topKeyword.position}` : '—'} sub={topKeyword?.keyword ?? 'no keywords yet'} color="#a78bfa" />
          <MiniStat label="Keywords Tracked" value={seoCount} color="#60a5fa" />
          <MiniStat label="Content Published" value={contentCount} sub="live pieces" color="#34d399" />
        </div>
      </motion.div>

      {/* ── 08. CRM PIPELINE ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.21 }} style={card} className="p-5">
        <SectionHeader number="08" title="CRM — Lead Pipeline" to="/portal/pipeline" />
        {leads.length === 0 ? (
          <p className="text-xs text-gray-600 py-1">No leads in the pipeline yet.</p>
        ) : (
          <div className="space-y-3">
            <FunnelBar label="Total Leads"  count={leads.length}   total={leads.length} color="#6b7280" />
            <FunnelBar label="Contacted"    count={contactedLeads} total={leads.length} color="#3b82f6" />
            <FunnelBar label="Qualified"    count={qualifiedLeads} total={leads.length} color="#8b5cf6" />
            <FunnelBar label="Won"          count={wonLeads}       total={leads.length} color="#10b981" />
          </div>
        )}
      </motion.div>

      {/* ── 09–11. EMAIL / SOCIAL / COMPETITORS ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.24 }}>
        <div className="grid sm:grid-cols-3 gap-4">

          {/* Email */}
          <div style={card} className="p-5">
            <SectionHeader number="09" title="Email" to="/portal/marketing" />
            {emailCampaigns.length === 0 ? (
              <p className="text-xs text-gray-600">No email campaigns yet.</p>
            ) : (
              <div className="space-y-3">
                <MiniStat label="Campaigns Sent" value={emailCampaigns.length} color="#60a5fa" />
                {avgOpenRate !== null && <MiniStat label="Avg Open Rate" value={`${avgOpenRate}%`} color="#34d399" />}
              </div>
            )}
          </div>

          {/* Social */}
          <div style={card} className="p-5">
            <SectionHeader number="10" title="Social Media" />
            <NeedsSetup description="Connect your social accounts to show reach, engagement and follower growth." />
          </div>

          {/* Competitors */}
          <div style={card} className="p-5">
            <SectionHeader number="11" title="Competitors" />
            <NeedsSetup description="Competitor tracking requires a Semrush or Ahrefs connection — ask your account manager." />
          </div>

        </div>
      </motion.div>

      {/* Open tickets (if any) */}
      {openTickets.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.27 }} style={card} className="p-5">
          <SectionHeader title="Open Support Tickets" to="/portal/tickets" />
          <div className="space-y-2">
            {openTickets.slice(0, 3).map(ticket => {
              const sc = statusConfig[ticket.status]    ?? statusConfig.open
              const pc = priorityConfig[ticket.priority] ?? priorityConfig.normal
              return (
                <Link key={ticket.id} to={`/portal/tickets/${ticket.id}`} style={{ textDecoration: 'none' }}>
                  <div className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                    style={{ background: 'rgba(255,255,255,0.02)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
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

      </>
      )}
    </div>
  )
}
