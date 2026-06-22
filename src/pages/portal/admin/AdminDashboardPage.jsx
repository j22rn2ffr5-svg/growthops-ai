import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Ticket, Users, MessageSquare, ArrowRight } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { statusConfig, priorityConfig } from '../TicketsPage'

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
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={17} color={color} />
        </div>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-extrabold text-white">{value}</p>
    </motion.div>
  )
}

export default function AdminDashboardPage() {
  const [tickets, setTickets]       = useState([])
  const [clients, setClients]       = useState([])
  const [enquiries, setEnquiries]   = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [ticketsRes, clientsRes, enquiriesRes] = await Promise.all([
        supabase.from('tickets').select('*').order('created_at', { ascending: false }),
        supabase.from('client_profiles').select('*'),
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(5),
      ])
      setTickets(ticketsRes.data ?? [])
      setClients(clientsRes.data ?? [])
      setEnquiries(enquiriesRes.data ?? [])
      setLoading(false)
    }
    fetchData()
  }, [])

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
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-extrabold text-white mb-1">Admin Overview</h1>
        <p className="text-sm text-gray-500">All clients and tickets across Stragyx.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon={Ticket}       label="Open Tickets"  value={openTickets}      color="#60a5fa" delay={0.05} />
        <StatCard icon={Ticket}       label="In Progress"   value={inProgress}       color="#f59e0b" delay={0.1}  />
        <StatCard icon={Users}        label="Clients"       value={clients.length}   color="#34d399" delay={0.15} />
      </div>

      {/* Recent tickets */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Recent Tickets</h2>
          <Link to="/portal/admin/tickets" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1" style={{ textDecoration: 'none' }}>
            View all <ArrowRight size={12} />
          </Link>
        </div>
        {tickets.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
            <p className="text-sm text-gray-500">No tickets yet.</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            {tickets.slice(0, 5).map((ticket, i) => {
              const sc = statusConfig[ticket.status]    ?? statusConfig.open
              const pc = priorityConfig[ticket.priority] ?? priorityConfig.normal
              return (
                <Link key={ticket.id} to="/portal/admin/tickets" style={{ textDecoration: 'none' }}>
                  <div
                    className="flex items-center gap-4 px-5 py-4 transition-colors"
                    style={{
                      borderBottom: i < Math.min(tickets.length, 5) - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
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

      {/* Recent enquiries */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">Recent Enquiries</h2>
          <Link to="/portal/admin/enquiries" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1" style={{ textDecoration: 'none' }}>
            View all <ArrowRight size={12} />
          </Link>
        </div>
        {enquiries.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
            <p className="text-sm text-gray-500">No enquiries yet.</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            {enquiries.map((e, i) => (
              <div
                key={e.id}
                className="flex items-start gap-4 px-5 py-4"
                style={{
                  borderBottom: i < enquiries.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{e.name} {e.business ? `— ${e.business}` : ''}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{e.message}</p>
                </div>
                <a href={`mailto:${e.email}`} className="text-xs text-blue-400 hover:text-blue-300 flex-shrink-0" style={{ textDecoration: 'none' }}>{e.email}</a>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
