import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronDown, Send, LayoutList, Layers } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../contexts/AuthContext'
import { statusConfig, priorityConfig } from '../TicketsPage'

const STATUS_FILTERS = ['all', 'open', 'in_progress', 'resolved']
const PRIORITY_FILTERS = ['all', 'urgent', 'high', 'normal', 'low']

const PRIORITY_ORDER = ['urgent', 'high', 'normal', 'low']
const priorityLabels = { urgent: 'Urgent', high: 'High', normal: 'Normal', low: 'Low' }

const NEW_THRESHOLD_MS = 48 * 60 * 60 * 1000

function isNew(ticket) {
  return ticket.status === 'open' && (Date.now() - new Date(ticket.created_at).getTime()) < NEW_THRESHOLD_MS
}

export default function AdminTicketsPage() {
  const { user }            = useAuth()
  const [tickets, setTickets]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [search, setSearch]     = useState('')
  const [expanded, setExpanded] = useState(null)
  const [replies, setReplies]   = useState({})
  const [replyText, setReplyText] = useState('')
  const [sending, setSending]   = useState(false)
  const [view, setView]           = useState('list')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [collapsedGroups, setCollapsedGroups] = useState({ normal: true, low: true })

  useEffect(() => {
    fetchTickets()
  }, [])

  async function fetchTickets() {
    const { data } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false })
    setTickets(data ?? [])
    setLoading(false)
  }

  async function fetchReplies(ticketId) {
    const { data } = await supabase
      .from('ticket_replies')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true })
    setReplies(prev => ({ ...prev, [ticketId]: data ?? [] }))
  }

  async function handleExpand(ticketId) {
    if (expanded === ticketId) { setExpanded(null); return }
    setExpanded(ticketId)
    setReplyText('')
    await fetchReplies(ticketId)
  }

  async function handleStatusChange(ticketId, status) {
    await supabase.from('tickets').update({ status }).eq('id', ticketId)
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t))
  }

  async function handlePriorityChange(ticketId, priority) {
    await supabase.from('tickets').update({ priority }).eq('id', ticketId)
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, priority } : t))
  }

  function toggleGroup(key) {
    setCollapsedGroups(prev => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleReply(ticketId) {
    if (!replyText.trim()) return
    setSending(true)
    const { error } = await supabase.from('ticket_replies').insert({
      ticket_id: ticketId,
      user_id:   user.id,
      messege:   replyText.trim(),
    })
    if (!error) {
      setReplyText('')
      await fetchReplies(ticketId)
    }
    setSending(false)
  }

  const filtered = tickets.filter(t => {
    const matchesStatus   = filter === 'all' || t.status === filter
    const matchesPriority = priorityFilter === 'all' || (t.priority ?? 'normal') === priorityFilter
    const matchesSearch   = search === '' ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesPriority && matchesSearch
  })

  const backlogGroups = PRIORITY_ORDER.map(priority => ({
    priority,
    tickets: tickets.filter(t => t.status !== 'resolved' && (t.priority ?? 'normal') === priority),
  }))

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">All Tickets</h1>
          <p className="text-sm text-gray-500">Manage and respond to client requests.</p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={() => setView('list')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all" style={view === 'list' ? { background: 'rgba(59,130,246,0.2)', color: '#60a5fa' } : { color: '#6b7280' }}>
            <LayoutList size={13} /> List
          </button>
          <button onClick={() => setView('backlog')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all" style={view === 'backlog' ? { background: 'rgba(59,130,246,0.2)', color: '#60a5fa' } : { color: '#6b7280' }}>
            <Layers size={13} /> Backlog
          </button>
        </div>
      </motion.div>

      {/* Filters — list view only */}
      {view === 'list' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Status filter */}
            <div className="flex gap-1 p-1 rounded-xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {STATUS_FILTERS.map(s => (
                <button key={s} onClick={() => setFilter(s)} className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-150" style={filter === s ? { background: 'rgba(59,130,246,0.2)', color: '#60a5fa' } : { color: '#6b7280' }}>
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="relative flex-1">
              <Search size={14} color="#4b5563" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets…" className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder-gray-600 outline-none" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }} />
            </div>
          </div>
          {/* Priority filter */}
          <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {PRIORITY_FILTERS.map(p => {
              const active = priorityFilter === p
              const pc = p !== 'all' ? priorityConfig[p] : null
              return (
                <button key={p} onClick={() => setPriorityFilter(p)} className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-150"
                  style={active && pc ? { background: pc.bg, color: pc.color } : active ? { background: 'rgba(59,130,246,0.2)', color: '#60a5fa' } : { color: '#6b7280' }}>
                  {p}
                </button>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Ticket list / backlog */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="flex gap-2">
              {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3b82f6', animationDelay: `${i * 0.15}s` }} />)}
            </div>
          </div>
        ) : view === 'backlog' ? (
          <div className="space-y-4">
            {backlogGroups.map(({ priority, tickets: group }) => {
              const pc = priorityConfig[priority]
              const isCollapsed = collapsedGroups[priority]
              return (
                <div key={priority}>
                  <button
                    onClick={() => toggleGroup(priority)}
                    className="w-full flex items-center gap-3 mb-2"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: pc.bg, color: pc.color }}>
                      {priorityLabels[priority]}
                    </span>
                    <span className="text-xs text-gray-600">{group.length} ticket{group.length !== 1 ? 's' : ''}</span>
                    <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    <ChevronDown size={13} color="#4b5563" style={{ transform: isCollapsed ? 'none' : 'rotate(180deg)', transition: 'transform 0.2s' }} />
                  </button>
                  {!isCollapsed && (
                    <div className="space-y-2">
                      {group.length === 0 ? (
                        <p className="text-xs text-gray-600 px-1 pb-2">No tickets</p>
                      ) : group.map(ticket => renderTicket(ticket))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
            <p className="text-sm text-gray-500">No tickets found.</p>
          </div>
        ) : filtered.map(ticket => renderTicket(ticket))}
      </motion.div>
    </div>
  )

  function renderTicket(ticket) {
    const sc = statusConfig[ticket.status]    ?? statusConfig.open
    const pc = priorityConfig[ticket.priority] ?? priorityConfig.normal
    const isExpanded = expanded === ticket.id
    const ticketReplies = replies[ticket.id] ?? []
    const ticketIsNew = isNew(ticket)
    const date = new Date(ticket.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

    return (
      <div key={ticket.id} className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Ticket header */}
        <button
          onClick={() => handleExpand(ticket.id)}
          className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors"
          style={{ background: isExpanded ? 'rgba(59,130,246,0.05)' : 'rgba(255,255,255,0.015)' }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {ticketIsNew && (
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#3b82f6' }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#60a5fa' }} />
                </span>
              )}
              <p className="text-sm font-semibold text-white truncate">{ticket.title}</p>
              {ticketIsNew && <span className="text-xs font-bold px-1.5 py-0.5 rounded-md flex-shrink-0" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>New</span>}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{ticket.category} · {date}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize" style={{ background: pc.bg, color: pc.color }}>{ticket.priority ?? 'normal'}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
            <ChevronDown size={14} color="#6b7280" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </div>
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="px-5 pb-5 space-y-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {/* Description */}
            <div className="pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</p>
              <p className="text-sm text-gray-300 leading-relaxed">{ticket.description}</p>
            </div>

            {/* Priority */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Priority</p>
              <div className="flex gap-2 flex-wrap">
                {PRIORITY_ORDER.map(p => {
                  const pv = priorityConfig[p]
                  const active = (ticket.priority ?? 'normal') === p
                  return (
                    <button
                      key={p}
                      onClick={() => handlePriorityChange(ticket.id, p)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                      style={active
                        ? { background: pv.bg, color: pv.color, border: `1px solid ${pv.color}40` }
                        : { background: 'rgba(255,255,255,0.04)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.07)' }
                      }
                    >
                      {p}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Status update */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</p>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(statusConfig).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => handleStatusChange(ticket.id, key)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={
                      ticket.status === key
                        ? { background: val.bg, color: val.color, border: `1px solid ${val.color}40` }
                        : { background: 'rgba(255,255,255,0.04)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.07)' }
                    }
                  >
                    {val.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Replies */}
            {ticketReplies.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Replies</p>
                <div className="space-y-2">
                  {ticketReplies.map(r => (
                    <div key={r.id} className="flex justify-end">
                      <div
                        className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm text-white leading-relaxed"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', borderRadius: '16px 16px 4px 16px' }}
                      >
                        {r.messege}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reply input */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Reply to Client</p>
              <div className="flex gap-2">
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your reply…"
                  rows={2}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none resize-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
                <button
                  onClick={() => handleReply(ticket.id)}
                  disabled={sending || !replyText.trim()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex-shrink-0"
                  style={{ background: sending || !replyText.trim() ? 'rgba(59,130,246,0.3)' : 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
                >
                  <Send size={14} />
                  {sending ? 'Sending…' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}
