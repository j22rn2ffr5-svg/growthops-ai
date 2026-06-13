import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Ticket, Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import ProjectTracker from '../../components/portal/ProjectTracker'
import MilestonesTracker from '../../components/portal/MilestonesTracker'

export const statusConfig = {
  open:        { label: 'Open',        color: '#60a5fa', bg: 'rgba(96,165,250,0.12)'  },
  in_progress: { label: 'In Progress', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  resolved:    { label: 'Resolved',    color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
}

export const priorityConfig = {
  low:    { color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
  normal: { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)'  },
  high:   { color: '#fb923c', bg: 'rgba(251,146,60,0.12)'  },
  urgent: { color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
}

const STATUS_FILTERS = ['all', 'open', 'in_progress', 'resolved']

export default function TicketsPage() {
  const { user, profile } = useAuth()
  const [tickets, setTickets]       = useState([])
  const [milestones, setMilestones] = useState([])
  const [loading, setLoading]       = useState(true)
  const [filter, setFilter]         = useState('all')
  const [search, setSearch]         = useState('')

  useEffect(() => {
    async function fetchData() {
      const [ticketsRes, milestonesRes] = await Promise.all([
        supabase.from('tickets').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('client_milestones').select('*').eq('user_id', user.id).order('sort_order').order('created_at'),
      ])
      setTickets(ticketsRes.data ?? [])
      setMilestones(milestonesRes.data ?? [])
      setLoading(false)
    }
    fetchData()
  }, [user.id])

  const filtered = tickets.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter
    const matchesSearch = search === '' || t.title.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Project status + milestones */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
        <ProjectTracker status={profile?.project_status ?? 'onboarding'} />
        <MilestonesTracker milestones={milestones} />
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">Tickets</h1>
          <p className="text-sm text-gray-500">Raise a request, report a bug, or ask a question.</p>
        </div>
        <Link
          to="/portal/tickets/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', textDecoration: 'none' }}
        >
          <Plus size={15} /> New Ticket
        </Link>
      </motion.div>

      {/* Filters + search */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        {/* Status filter tabs */}
        <div
          className="flex gap-1 p-1 rounded-xl flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-150"
              style={
                filter === s
                  ? { background: 'rgba(59,130,246,0.2)', color: '#60a5fa' }
                  : { color: '#6b7280' }
              }
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} color="#4b5563" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tickets…"
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder-gray-600 outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          />
        </div>
      </motion.div>

      {/* Ticket list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3b82f6', animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
          >
            <Ticket size={36} color="#374151" className="mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-3">
              {search ? 'No tickets match your search.' : 'No tickets yet.'}
            </p>
            {!search && (
              <Link
                to="/portal/tickets/new"
                className="text-xs font-semibold px-4 py-2 rounded-lg inline-flex items-center gap-1.5"
                style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa', textDecoration: 'none', border: '1px solid rgba(59,130,246,0.2)' }}
              >
                <Plus size={12} /> Raise your first request
              </Link>
            )}
          </div>
        ) : (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {/* Table header */}
            <div
              className="grid grid-cols-12 gap-4 px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-600"
              style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="col-span-5">Title</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Priority</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Date</div>
            </div>

            {filtered.map((ticket, i) => {
              const sc = statusConfig[ticket.status]    ?? statusConfig.open
              const pc = priorityConfig[ticket.priority] ?? priorityConfig.normal
              const date = new Date(ticket.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
              return (
                <div
                  key={ticket.id}
                  className="grid grid-cols-12 gap-4 px-5 py-4 items-center"
                  style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                  }}
                >
                  <div className="col-span-5">
                    <p className="text-sm font-medium text-white truncate">{ticket.title}</p>
                    {ticket.description && (
                      <p className="text-xs text-gray-600 truncate mt-0.5">{ticket.description}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-gray-400">{ticket.category}</span>
                  </div>
                  <div className="col-span-2">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize"
                      style={{ background: pc.bg, color: pc.color }}
                    >
                      {ticket.priority}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: sc.bg, color: sc.color }}
                    >
                      {sc.label}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-xs text-gray-600">{date}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}
