import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Trash2, Pencil, CalendarDays, Check, Send, Sparkles, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { statusConfig, priorityConfig } from './TicketsPage'

const PRIORITY_ORDER = ['urgent', 'high', 'normal', 'low']

function ticketRef(ref) {
  return `TK-${String(ref).padStart(3, '0')}`
}

function TaskRow({ task, ticketRefStr, isAdmin, onToggle, onEdit, onDelete }) {
  const due = task.due_date
    ? new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
    : null
  const overdue = task.due_date && !task.completed && new Date(task.due_date) < new Date()

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl group"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <button
        onClick={() => isAdmin && onToggle(task)}
        disabled={!isAdmin}
        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
        style={
          task.completed
            ? { background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }
            : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)' }
        }
      >
        {task.completed && <Check size={11} color="white" strokeWidth={3} />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-mono font-semibold flex-shrink-0" style={{ color: '#4b5563' }}>
            {ticketRefStr}-{task.task_ref}
          </span>
          <p
            className="text-sm font-medium leading-snug truncate"
            style={{
              color: task.completed ? '#6b7280' : 'white',
              textDecoration: task.completed ? 'line-through' : 'none',
            }}
          >
            {task.title}
          </p>
        </div>
        {due && (
          <div className="flex items-center gap-1 mt-0.5 ml-0">
            <CalendarDays size={10} color={overdue ? '#f87171' : '#4b5563'} />
            <span className="text-xs" style={{ color: overdue ? '#f87171' : '#4b5563' }}>
              {overdue ? 'Overdue · ' : ''}{due}
            </span>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Pencil size={11} color="#9ca3af" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={11} color="#f87171" />
          </button>
        </div>
      )}
    </div>
  )
}

function TaskForm({ initial = { title: '', due_date: '' }, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div
      className="space-y-2 p-4 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <input
        type="text"
        placeholder="Task title *"
        value={form.title}
        onChange={set('title')}
        className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
      />
      <input
        type="date"
        value={form.due_date}
        onChange={set('due_date')}
        className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', colorScheme: 'dark' }}
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={!form.title.trim() || saving}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-40 transition-all"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}

export default function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()

  const [ticket, setTicket]           = useState(null)
  const [tasks, setTasks]             = useState([])
  const [replies, setReplies]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [showAddTask, setShowAddTask] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [taskSaving, setTaskSaving]   = useState(false)
  const [replyText, setReplyText]     = useState('')
  const [replySending, setReplySending] = useState(false)
  const [aiLoading, setAiLoading]     = useState(false)
  const [suggestions, setSuggestions] = useState(null) // null | array

  useEffect(() => {
    async function fetchData() {
      try {
        const [ticketRes, tasksRes, repliesRes] = await Promise.all([
          supabase.from('tickets').select('*').eq('id', id).single(),
          supabase.from('ticket_tasks').select('*').eq('ticket_id', id).order('sort_order').order('created_at'),
          supabase.from('ticket_replies').select('*').eq('ticket_id', id).order('created_at', { ascending: true }),
        ])
        if (ticketRes.error || !ticketRes.data) {
          navigate('/portal/tickets', { replace: true })
          return
        }
        if (!isAdmin && ticketRes.data.user_id !== user.id) {
          navigate('/portal/tickets', { replace: true })
          return
        }
        setTicket(ticketRes.data)
        setTasks(tasksRes.data ?? [])
        setReplies(repliesRes.data ?? [])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, user?.id, isAdmin])

  async function handleStatusChange(status) {
    await supabase.from('tickets').update({ status }).eq('id', id)
    setTicket(t => ({ ...t, status }))
  }

  async function handlePriorityChange(priority) {
    await supabase.from('tickets').update({ priority }).eq('id', id)
    setTicket(t => ({ ...t, priority }))
  }

  async function handleToggleTask(task) {
    const completed = !task.completed
    await supabase.from('ticket_tasks').update({ completed }).eq('id', task.id)
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed } : t))
  }

  async function handleAddTask(form) {
    setTaskSaving(true)
    const { data } = await supabase
      .from('ticket_tasks')
      .insert({ ticket_id: id, title: form.title.trim(), due_date: form.due_date || null })
      .select()
      .single()
    if (data) setTasks(prev => [...prev, data])
    setShowAddTask(false)
    setTaskSaving(false)
  }

  async function handleEditTask(form) {
    setTaskSaving(true)
    const { data } = await supabase
      .from('ticket_tasks')
      .update({ title: form.title.trim(), due_date: form.due_date || null })
      .eq('id', editingTask.id)
      .select()
      .single()
    if (data) setTasks(prev => prev.map(t => t.id === editingTask.id ? data : t))
    setEditingTask(null)
    setTaskSaving(false)
  }

  async function handleDeleteTask(taskId) {
    await supabase.from('ticket_tasks').delete().eq('id', taskId)
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  async function handleAISuggest() {
    setAiLoading(true)
    setSuggestions(null)
    try {
      const res = await fetch('/api/suggest-tasks', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          title:       ticket.title,
          description: ticket.description,
          category:    ticket.category,
          adminUserId: user.id,
        }),
      })
      const data = await res.json()
      if (data.tasks) {
        setSuggestions(data.tasks.map(t => ({ ...t, selected: true })))
        setShowAddTask(false)
        setEditingTask(null)
      }
    } catch {
      // silently fail — user can retry
    }
    setAiLoading(false)
  }

  async function handleAddSuggestions() {
    const toAdd = (suggestions ?? []).filter(s => s.selected)
    setTaskSaving(true)
    for (const s of toAdd) {
      const { data } = await supabase
        .from('ticket_tasks')
        .insert({ ticket_id: id, title: s.title, due_date: s.due_date || null })
        .select()
        .single()
      if (data) setTasks(prev => [...prev, data])
    }
    setSuggestions(null)
    setTaskSaving(false)
  }

  async function handleReply() {
    if (!replyText.trim()) return
    setReplySending(true)

    if (isAdmin) {
      // Admin replies go through the API so the client gets an email notification
      await fetch('/api/ticket-reply', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ticketId: id, message: replyText.trim(), adminUserId: user.id }),
      })
    } else {
      // Client replies insert directly — RLS policy allows this for own tickets
      await supabase.from('ticket_replies').insert({
        ticket_id: id,
        user_id:   user.id,
        message:   replyText.trim(),
      })
    }

    setReplyText('')
    const { data } = await supabase
      .from('ticket_replies')
      .select('*')
      .eq('ticket_id', id)
      .order('created_at', { ascending: true })
    setReplies(data ?? [])
    setReplySending(false)
  }

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

  if (!ticket) return null

  const sc             = statusConfig[ticket.status]    ?? statusConfig.open
  const pc             = priorityConfig[ticket.priority] ?? priorityConfig.normal
  const refStr         = ticketRef(ticket.ref)
  const date           = new Date(ticket.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const completedCount = tasks.filter(t => t.completed).length
  const progress       = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <motion.button
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
      >
        <ArrowLeft size={15} /> Back
      </motion.button>

      {/* Ticket header card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl p-6 space-y-4"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-mono font-bold px-2 py-0.5 rounded-md flex-shrink-0"
                style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}
              >
                {refStr}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white mb-1">{ticket.title}</h1>
            <p className="text-xs text-gray-500">{ticket.category} · {date}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize" style={{ background: pc.bg, color: pc.color }}>{ticket.priority ?? 'normal'}</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
          </div>
        </div>

        {ticket.description && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</p>
            <p className="text-sm text-gray-300 leading-relaxed">{ticket.description}</p>
          </div>
        )}

        {/* Admin status/priority controls */}
        {isAdmin && (
          <div className="space-y-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</p>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(statusConfig).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => handleStatusChange(key)}
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
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Priority</p>
              <div className="flex gap-2 flex-wrap">
                {PRIORITY_ORDER.map(p => {
                  const pv = priorityConfig[p]
                  const active = (ticket.priority ?? 'normal') === p
                  return (
                    <button
                      key={p}
                      onClick={() => handlePriorityChange(p)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                      style={
                        active
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
          </div>
        )}
      </motion.div>

      {/* Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="rounded-2xl p-6"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tasks</p>
            {tasks.length > 0 && (
              <p className="text-xs text-gray-600 mt-0.5">{completedCount} of {tasks.length} complete</p>
            )}
          </div>
          {isAdmin && !showAddTask && !editingTask && !suggestions && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleAISuggest}
                disabled={aiLoading}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all disabled:opacity-50"
                style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)' }}
              >
                <Sparkles size={11} />
                {aiLoading ? 'Thinking…' : 'AI Suggest'}
              </button>
              <button
                onClick={() => setShowAddTask(true)}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors"
                style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}
              >
                <Plus size={11} /> Add Task
              </button>
            </div>
          )}
        </div>

        {tasks.length > 0 && (
          <div className="h-1.5 rounded-full mb-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #3b82f6, #7c3aed)' }}
            />
          </div>
        )}

        {/* AI suggestions panel */}
        {suggestions && (
          <div className="mb-4 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(167,139,250,0.25)' }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ background: 'rgba(167,139,250,0.08)' }}>
              <div className="flex items-center gap-2">
                <Sparkles size={13} color="#a78bfa" />
                <span className="text-xs font-semibold" style={{ color: '#a78bfa' }}>AI suggested tasks</span>
              </div>
              <button onClick={() => setSuggestions(null)} className="text-gray-600 hover:text-gray-400 transition-colors">
                <X size={13} />
              </button>
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {suggestions.map((s, i) => {
                const due = s.due_date
                  ? new Date(s.due_date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
                  : null
                return (
                  <label
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
                    style={{ background: s.selected ? 'rgba(167,139,250,0.05)' : 'transparent' }}
                  >
                    <input
                      type="checkbox"
                      checked={s.selected}
                      onChange={() => setSuggestions(prev => prev.map((x, j) => j === i ? { ...x, selected: !x.selected } : x))}
                      className="accent-violet-500 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{s.title}</p>
                      {due && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <CalendarDays size={10} color="#6b7280" />
                          <span className="text-xs text-gray-500">{due}</span>
                        </div>
                      )}
                    </div>
                    <input
                      type="date"
                      value={s.due_date ?? ''}
                      onClick={e => e.stopPropagation()}
                      onChange={e => setSuggestions(prev => prev.map((x, j) => j === i ? { ...x, due_date: e.target.value || null } : x))}
                      className="text-xs text-gray-400 rounded-lg px-2 py-1 outline-none flex-shrink-0"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', colorScheme: 'dark' }}
                    />
                  </label>
                )
              })}
            </div>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-xs text-gray-600">{suggestions.filter(s => s.selected).length} of {suggestions.length} selected</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSuggestions(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Dismiss
                </button>
                <button
                  onClick={handleAddSuggestions}
                  disabled={taskSaving || suggestions.filter(s => s.selected).length === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-40 transition-all"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)' }}
                >
                  <Plus size={11} />
                  {taskSaving ? 'Adding…' : `Add ${suggestions.filter(s => s.selected).length} task${suggestions.filter(s => s.selected).length !== 1 ? 's' : ''}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddTask && (
          <div className="mb-3">
            <TaskForm
              onSave={handleAddTask}
              onCancel={() => setShowAddTask(false)}
              saving={taskSaving}
            />
          </div>
        )}

        {tasks.length === 0 && !showAddTask ? (
          <p className="text-xs text-gray-600 py-2">
            {isAdmin ? 'No tasks yet. Click Add Task to create one.' : 'No tasks have been added yet.'}
          </p>
        ) : (
          <div className="space-y-2">
            {tasks.map(task =>
              editingTask?.id === task.id ? (
                <TaskForm
                  key={task.id}
                  initial={{ title: task.title, due_date: task.due_date ?? '' }}
                  onSave={handleEditTask}
                  onCancel={() => setEditingTask(null)}
                  saving={taskSaving}
                />
              ) : (
                <TaskRow
                  key={task.id}
                  task={task}
                  ticketRefStr={refStr}
                  isAdmin={isAdmin}
                  onToggle={handleToggleTask}
                  onEdit={t => { setEditingTask(t); setShowAddTask(false) }}
                  onDelete={handleDeleteTask}
                />
              )
            )}
          </div>
        )}
      </motion.div>

      {/* Conversation thread */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl p-6 space-y-4"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Conversation</p>

        {replies.length === 0 ? (
          <p className="text-xs text-gray-600 py-2">No messages yet. Send a reply below to start the conversation.</p>
        ) : (
          <div className="space-y-3">
            {replies.map(r => {
              const isSelf   = r.user_id === user.id
              const isAdminMsg = r.user_id !== ticket.user_id
              const senderLabel = isSelf
                ? 'You'
                : isAdminMsg ? 'Support Team' : ticket.user_id && 'Client'
              const time = new Date(r.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
              const dateStr = new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

              return (
                <div key={r.id} className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                  <span className="text-xs text-gray-600 mb-1 px-1">{senderLabel} · {dateStr} {time}</span>
                  <div
                    className="max-w-[80%] px-4 py-2.5 text-sm text-white leading-relaxed"
                    style={isSelf
                      ? { background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', borderRadius: '16px 16px 4px 16px' }
                      : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '16px 16px 16px 4px' }
                    }
                  >
                    {r.message}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Reply input — available to both admin and client */}
        <div className="flex gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleReply() }}
            placeholder={isAdmin ? 'Reply to client… (Ctrl+Enter to send)' : 'Send a message… (Ctrl+Enter to send)'}
            rows={2}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none resize-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
          <button
            onClick={handleReply}
            disabled={replySending || !replyText.trim()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex-shrink-0 self-end"
            style={{ background: replySending || !replyText.trim() ? 'rgba(59,130,246,0.3)' : 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
          >
            <Send size={14} />
            {replySending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
