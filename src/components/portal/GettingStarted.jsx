import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  CheckCircle2, Circle, Zap, Globe, Users, BookOpen,
  TrendingUp, BarChart3, Workflow, Megaphone, ArrowRight,
  Ticket, FileText, GitMerge,
} from 'lucide-react'

const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }

const WHAT_TO_EXPECT = [
  { icon: Globe,      color: '#60a5fa', label: 'Website',     desc: 'Lighthouse scores, update log, and your live site overview.' },
  { icon: TrendingUp, color: '#a78bfa', label: 'Performance', desc: 'SEO rankings, paid ads, email campaigns, and CRO tests.' },
  { icon: GitMerge,   color: '#34d399', label: 'Pipeline',    desc: 'Every lead tracked from first touch to closed deal.' },
  { icon: Megaphone,  color: '#f472b6', label: 'Marketing',   desc: 'Content calendar, AI copy tools, and campaign briefs.' },
  { icon: Workflow,   color: '#f59e0b', label: 'Automations', desc: 'Live status of your n8n workflows and chatbot stats.' },
  { icon: BarChart3,  color: '#60a5fa', label: 'Analytics',   desc: 'Google Analytics embedded directly in your portal.' },
]

export default function GettingStarted({ businessName, accountManager, checks }) {
  const { hasWebsite, hasSeo, hasContent, hasLeads, hasAnalytics } = checks

  const steps = [
    { done: true,         label: 'Portal account created',      desc: 'You\'re in — your client portal is live.' },
    { done: hasWebsite,   label: 'Website details connected',   desc: 'We\'ll add your site info, scores, and update log.' },
    { done: hasSeo,       label: 'SEO tracking started',        desc: 'Your keyword rankings will appear in Performance.' },
    { done: hasContent,   label: 'Content plan ready',          desc: 'Your content library and calendar will populate here.' },
    { done: hasLeads,     label: 'Leads pipeline active',       desc: 'We\'ll import your leads and start tracking conversions.' },
    { done: hasAnalytics, label: 'Analytics dashboard linked',  desc: 'Your Google Analytics report will be embedded shortly.' },
  ]

  const completedCount = steps.filter(s => s.done).length
  const progressPct = Math.round((completedCount / steps.length) * 100)

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        className="rounded-2xl p-7 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(124,58,237,0.15) 100%)', border: '1px solid rgba(99,102,241,0.25)' }}>
        {/* Decorative glow */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>
              <Zap size={17} color="white" fill="white" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#93c5fd' }}>Welcome to GrowthOps</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-2">
            {businessName ? `Great to have you, ${businessName}` : 'Your portal is being set up'}
          </h1>
          <p className="text-sm text-gray-400 max-w-xl leading-relaxed">
            We're getting everything configured for you. Your account manager{accountManager ? ` (${accountManager})` : ''} will
            populate your data over the next few days. In the meantime, here's what to expect.
          </p>
          <Link to="/portal/tickets/new" style={{ textDecoration: 'none' }}>
            <button className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
              <Ticket size={14} /> Have a question? Raise a ticket <ArrowRight size={13} />
            </button>
          </Link>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Setup checklist */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
          style={card} className="p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-bold text-white">Setup Checklist</h2>
            <span className="text-xs font-semibold" style={{ color: progressPct === 100 ? '#34d399' : '#60a5fa' }}>
              {completedCount}/{steps.length} complete
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1 rounded-full mb-5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #3b82f6, #7c3aed)' }}
              initial={{ width: 0 }} animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }} />
          </div>

          <div className="space-y-3">
            {steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                className="flex items-start gap-3">
                {step.done
                  ? <CheckCircle2 size={17} color="#34d399" className="flex-shrink-0 mt-0.5" />
                  : <Circle      size={17} color="#374151"  className="flex-shrink-0 mt-0.5" />}
                <div>
                  <p className="text-sm font-medium leading-snug" style={{ color: step.done ? '#fff' : '#6b7280' }}>
                    {step.label}
                  </p>
                  {!step.done && (
                    <p className="text-xs text-gray-600 mt-0.5">{step.desc}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What to expect */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.12 }}
          style={card} className="p-5">
          <h2 className="text-sm font-bold text-white mb-4">What's Coming</h2>
          <div className="space-y-3.5">
            {WHAT_TO_EXPECT.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div key={item.label} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
                  className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${item.color}18` }}>
                    <Icon size={13} color={item.color} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-300">{item.label}</p>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick explore links */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Explore the portal</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { to: '/portal/tickets/new', icon: Ticket,   color: '#60a5fa', label: 'Raise a Support Ticket', desc: 'Log an issue or ask a question' },
            { to: '/portal/reports',     icon: FileText,  color: '#a78bfa', label: 'View Reports',           desc: 'Monthly performance summaries' },
            { to: '/portal/marketing',   icon: Megaphone, color: '#f472b6', label: 'Marketing Tools',        desc: 'AI copy generator & calendar' },
          ].map(l => {
            const Icon = l.icon
            return (
              <Link key={l.to} to={l.to} style={{ textDecoration: 'none' }}>
                <div className="p-4 rounded-2xl transition-all h-full"
                  style={card}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${l.color}40`; e.currentTarget.style.background = `${l.color}08` }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.025)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: `${l.color}18` }}>
                    <Icon size={15} color={l.color} />
                  </div>
                  <p className="text-xs font-semibold text-white leading-snug">{l.label}</p>
                  <p className="text-xs text-gray-600 mt-1">{l.desc}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
