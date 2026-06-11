import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Ticket, BarChart3, User, ArrowRight, Plus, ExternalLink } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { statusConfig, priorityConfig } from './TicketsPage'
import ProjectTracker from '../../components/portal/ProjectTracker'

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="p-5 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon size={17} color={color} />
        </div>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-extrabold text-white">{value}</p>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [profile, setProfile]       = useState(null)
  const [tickets, setTickets]       = useState([])
  const [dashboards, setDashboards] = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [profileRes, ticketsRes, dashboardsRes] = await Promise.all([
        supabase.from('client_profiles').select('*').eq('id', user.id).single(),
        supabase.from('tickets').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('client_dashboards').select('*').eq('user_id', user.id).order('created_at'),
      ])
      setProfile(profileRes.data)
      setTickets(ticketsRes.data ?? [])
      setDashboards(dashboardsRes.data ?? [])
      setLoading(false)
    }
    fetchData()
  }, [user.id])

  const openTickets = tickets.filter(t => t.status === 'open').length
  const inProgress  = tickets.filter(t => t.status === 'in_progress').length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3b82f6', animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-extrabold text-white mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500">
          {profile?.package ? `${profile.package} · ` : ''}
          Account manager: {profile?.account_manager ?? 'Chris Eyres'}
        </p>
      </motion.div>

      {/* Project tracker */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
        <ProjectTracker status={profile?.project_status ?? 'onboarding'} />
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon={Ticket}   label="Open Tickets"  value={openTickets} color="#60a5fa" delay={0.05} />
        <StatCard icon={Ticket}   label="In Progress"   value={inProgress}  color="#f59e0b" delay={0.1} />
        <StatCard icon={User}     label="Account Mgr"   value={profile?.account_manager ?? 'Chris Eyres'} color="#34d399" delay={0.15} />
      </div>

      {/* Analytics dashboards */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Your Dashboards</h2>
          <Link to="/portal/analytics" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1" style={{ textDecoration: 'none' }}>
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {dashboards.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
          >
            <BarChart3 size={32} color="#374151" className="mx-auto mb-3" />
            <p className="text-sm text-gray-500">Your analytics dashboards will appear here once set up.</p>
            <p className="text-xs text-gray-700 mt-1">We'll add these when your reporting is live.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {dashboards.slice(0, 2).map(db => (
              <a
                key={db.id}
                href={db.embed_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-2xl transition-all"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(96,165,250,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.12)' }}>
                  <BarChart3 size={17} color="#60a5fa" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{db.name}</p>
                  <p className="text-xs text-gray-500">Click to open report</p>
                </div>
                <ExternalLink size={13} color="#4b5563" />
              </a>
            ))}
          </div>
        )}
      </motion.div>

      {/* Recent tickets */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Recent Tickets</h2>
          <Link to="/portal/tickets/new" className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', color: 'white', textDecoration: 'none' }}>
            <Plus size={12} /> New Ticket
          </Link>
        </div>

        {tickets.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
          >
            <p className="text-sm text-gray-500">No tickets yet.</p>
            <Link to="/portal/tickets/new" className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block" style={{ textDecoration: 'none' }}>
              Raise your first request →
            </Link>
          </div>
        ) : (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {tickets.map((ticket, i) => {
              const sc = statusConfig[ticket.status]   ?? statusConfig.open
              const pc = priorityConfig[ticket.priority] ?? priorityConfig.normal
              return (
                <Link
                  key={ticket.id}
                  to="/portal/tickets"
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="flex items-center gap-4 px-5 py-4 transition-colors"
                    style={{
                      borderBottom: i < tickets.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent'}
                  >
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
        )}
      </motion.div>
    </div>
  )
}
