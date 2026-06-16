import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, Plus, Trash2, Pencil, X, Database, UserPlus, Eye, EyeOff, RefreshCw, Copy, CheckCircle2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

const PACKAGES = ['Starter System', 'Growth System', 'Scale System']
const inp = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', color: 'white', outline: 'none', padding: '8px 12px', fontSize: '14px', width: '100%' }

function generatePassword() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$'
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function CreateClientForm({ onSuccess, onCancel }) {
  const [form, setForm]         = useState({ email: '', password: generatePassword(), business_name: '', package: '', account_manager: 'Chris Eyres' })
  const [showPass, setShowPass] = useState(false)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState(null)
  const [created, setCreated]   = useState(null)
  const [copied, setCopied]     = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password || !form.business_name) return
    setSaving(true); setError(null)
    try {
      const res = await fetch('/api/create-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create client')
      setCreated({ email: form.email, password: form.password })
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function copyCredentials() {
    await navigator.clipboard.writeText(`Email: ${created.email}\nPassword: ${created.password}`)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  if (created) return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6 space-y-4"
      style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)' }}>
      <div className="flex items-center gap-2">
        <CheckCircle2 size={16} color="#34d399" />
        <p className="text-sm font-bold text-white">Client account created</p>
      </div>
      <div className="rounded-xl p-4 space-y-2 font-mono text-sm" style={{ background: 'rgba(0,0,0,0.25)' }}>
        <p><span className="text-gray-500">Email: </span><span className="text-white">{created.email}</span></p>
        <p><span className="text-gray-500">Password: </span><span className="text-white">{created.password}</span></p>
      </div>
      <div className="flex gap-3">
        <button onClick={copyCredentials}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: copied ? '#34d399' : '#9ca3af' }}>
          {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy credentials'}
        </button>
        <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:text-gray-300 transition-colors">Done</button>
      </div>
    </motion.div>
  )

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6 space-y-5"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">Add New Client</h3>
        <button onClick={onCancel} className="text-gray-600 hover:text-gray-400 transition-colors"><X size={16} /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Business Name *</label>
            <input style={inp} value={form.business_name} onChange={set('business_name')} placeholder="Apex Talent Solutions" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email *</label>
            <input style={inp} type="email" value={form.email} onChange={set('email')} placeholder="client@company.co.uk" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password *</label>
            <div className="relative">
              <input style={{ ...inp, paddingRight: '72px' }} type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} required />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button type="button" onClick={() => setForm(f => ({ ...f, password: generatePassword() }))}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors" title="Generate password">
                  <RefreshCw size={12} color="#6b7280" />
                </button>
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors">
                  {showPass ? <EyeOff size={12} color="#6b7280" /> : <Eye size={12} color="#6b7280" />}
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Package</label>
            <select style={inp} value={form.package} onChange={set('package')}>
              <option value="">No package</option>
              {PACKAGES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Account Manager</label>
            <input style={inp} value={form.account_manager} onChange={set('account_manager')} placeholder="Chris Eyres" />
          </div>
        </div>

        {error && <p className="text-xs text-red-400 px-1">{error}</p>}

        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={saving || !form.email || !form.business_name || !form.password}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40 transition-all"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)' }}>
            <UserPlus size={14} />
            {saving ? 'Creating…' : 'Create Client'}
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-300 transition-colors">Cancel</button>
        </div>
      </form>
    </motion.div>
  )
}

const STAGES = [
  { key: 'onboarding', label: 'Onboarding',  color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  { key: 'building',   label: 'In Progress', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)'  },
  { key: 'review',     label: 'Review',      color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  { key: 'live',       label: 'Live',        color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
]

const MILESTONE_STATUSES = [
  { key: 'pending',     label: 'Pending',     color: '#6b7280' },
  { key: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  { key: 'completed',   label: 'Completed',   color: '#34d399' },
]

const stageMap = Object.fromEntries(STAGES.map(s => [s.key, s]))

const blankForm = { title: '', description: '', due_date: '', status: 'pending' }

function MilestoneForm({ initial = blankForm, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="space-y-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <input
        type="text"
        placeholder="Milestone title *"
        value={form.title}
        onChange={set('title')}
        className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={form.description}
        onChange={set('description')}
        className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
      />
      <div className="flex gap-2">
        <input
          type="date"
          value={form.due_date}
          onChange={set('due_date')}
          className="flex-1 px-3 py-2 rounded-lg text-sm text-white outline-none"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', colorScheme: 'dark' }}
        />
        <select
          value={form.status}
          onChange={set('status')}
          className="flex-1 px-3 py-2 rounded-lg text-sm text-white outline-none"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {MILESTONE_STATUSES.map(s => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </div>
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

export default function AdminClientsPage() {
  const [clients, setClients]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [expanded, setExpanded]       = useState(null)
  const [saving, setSaving]           = useState(null)
  const [milestones, setMilestones]   = useState({})
  const [showAddForm, setShowAddForm] = useState(null)
  const [editingId, setEditingId]     = useState(null)
  const [mSaving, setMSaving]         = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  async function fetchClients() {
    const { data } = await supabase
      .from('client_profiles')
      .select('*')
      .order('created_at', { ascending: false })
    setClients(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchClients() }, [])

  async function fetchMilestones(clientId) {
    const { data } = await supabase
      .from('client_milestones')
      .select('*')
      .eq('user_id', clientId)
      .order('sort_order')
      .order('created_at')
    setMilestones(prev => ({ ...prev, [clientId]: data ?? [] }))
  }

  function handleExpand(clientId) {
    if (expanded === clientId) {
      setExpanded(null)
    } else {
      setExpanded(clientId)
      if (!milestones[clientId]) fetchMilestones(clientId)
    }
  }

  async function handleStageChange(clientId, stage) {
    setSaving(clientId)
    await supabase.from('client_profiles').update({ project_status: stage }).eq('id', clientId)
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, project_status: stage } : c))
    setSaving(null)
  }

  async function handleAddMilestone(clientId, form) {
    setMSaving(true)
    const { data } = await supabase
      .from('client_milestones')
      .insert({ user_id: clientId, title: form.title.trim(), description: form.description.trim() || null, due_date: form.due_date || null, status: form.status })
      .select()
      .single()
    if (data) setMilestones(prev => ({ ...prev, [clientId]: [...(prev[clientId] ?? []), data] }))
    setShowAddForm(null)
    setMSaving(false)
  }

  async function handleEditMilestone(clientId, milestoneId, form) {
    setMSaving(true)
    const { data } = await supabase
      .from('client_milestones')
      .update({ title: form.title.trim(), description: form.description.trim() || null, due_date: form.due_date || null, status: form.status })
      .eq('id', milestoneId)
      .select()
      .single()
    if (data) setMilestones(prev => ({ ...prev, [clientId]: prev[clientId].map(m => m.id === milestoneId ? data : m) }))
    setEditingId(null)
    setMSaving(false)
  }

  async function handleDeleteMilestone(clientId, milestoneId) {
    await supabase.from('client_milestones').delete().eq('id', milestoneId)
    setMilestones(prev => ({ ...prev, [clientId]: prev[clientId].filter(m => m.id !== milestoneId) }))
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">Clients</h1>
          <p className="text-sm text-gray-500">Manage client project status and milestones.</p>
        </div>
        {!showCreateForm && (
          <button onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)' }}>
            <UserPlus size={14} /> Add Client
          </button>
        )}
      </motion.div>

      <AnimatePresence>
        {showCreateForm && (
          <CreateClientForm
            onSuccess={() => { fetchClients(); }}
            onCancel={() => setShowCreateForm(false)}
          />
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="space-y-3">
        {clients.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
            <p className="text-sm text-gray-500">No clients yet.</p>
          </div>
        ) : clients.map(client => {
          const stage      = stageMap[client.project_status ?? 'onboarding'] ?? stageMap.onboarding
          const isExpanded = expanded === client.id
          const isSaving   = saving === client.id
          const cms        = milestones[client.id] ?? []

          return (
            <div key={client.id} className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              {/* Client row */}
              <button
                onClick={() => handleExpand(client.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors"
                style={{ background: isExpanded ? 'rgba(59,130,246,0.05)' : 'rgba(255,255,255,0.015)' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
                >
                  {(client.business_name ?? client.id).slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{client.business_name ?? 'Unnamed client'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{client.package ?? 'No package'} · {client.account_manager ?? 'Chris Eyres'}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: stage.bg, color: stage.color }}>
                    {stage.label}
                  </span>
                  <Link
                    to={`/portal/admin/clients/${client.id}`}
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
                    style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none' }}
                  >
                    <Database size={11} /> Data
                  </Link>
                  <ChevronDown size={14} color="#6b7280" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-4 space-y-6" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>

                  {/* Project stage */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Project Stage</p>
                    <div className="flex gap-2 flex-wrap">
                      {STAGES.map(s => {
                        const active = (client.project_status ?? 'onboarding') === s.key
                        return (
                          <button
                            key={s.key}
                            onClick={() => handleStageChange(client.id, s.key)}
                            disabled={isSaving}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                            style={
                              active
                                ? { background: s.bg, color: s.color, border: `1px solid ${s.color}40` }
                                : { background: 'rgba(255,255,255,0.04)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.07)' }
                            }
                          >
                            {active && <Check size={11} strokeWidth={2.5} />}
                            {s.label}
                          </button>
                        )
                      })}
                    </div>
                    {isSaving && <p className="text-xs text-gray-600 mt-2">Saving…</p>}
                  </div>

                  {/* Milestones */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Milestones & Deliverables</p>
                      {showAddForm !== client.id && (
                        <button
                          onClick={() => { setShowAddForm(client.id); setEditingId(null) }}
                          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors"
                          style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}
                        >
                          <Plus size={11} /> Add
                        </button>
                      )}
                    </div>

                    {showAddForm === client.id && (
                      <div className="mb-3">
                        <MilestoneForm
                          onSave={form => handleAddMilestone(client.id, form)}
                          onCancel={() => setShowAddForm(null)}
                          saving={mSaving}
                        />
                      </div>
                    )}

                    {cms.length === 0 && showAddForm !== client.id ? (
                      <p className="text-xs text-gray-600 py-2">No milestones yet. Click Add to create one.</p>
                    ) : (
                      <div className="space-y-2">
                        {cms.map(m => {
                          const sc  = MILESTONE_STATUSES.find(s => s.key === m.status) ?? MILESTONE_STATUSES[0]
                          const due = m.due_date ? new Date(m.due_date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : null

                          return editingId === m.id ? (
                            <MilestoneForm
                              key={m.id}
                              initial={{ title: m.title, description: m.description ?? '', due_date: m.due_date ?? '', status: m.status }}
                              onSave={form => handleEditMilestone(client.id, m.id, form)}
                              onCancel={() => setEditingId(null)}
                              saving={mSaving}
                            />
                          ) : (
                            <div
                              key={m.id}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl group"
                              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium truncate">{m.title}</p>
                                {m.description && <p className="text-xs text-gray-600 truncate">{m.description}</p>}
                                {due && <p className="text-xs text-gray-600 mt-0.5">Due: {due}</p>}
                              </div>
                              <span
                                className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                                style={{ color: sc.color, background: `${sc.color}18` }}
                              >
                                {sc.label}
                              </span>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => { setEditingId(m.id); setShowAddForm(null) }}
                                  className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                                >
                                  <Pencil size={11} color="#9ca3af" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMilestone(client.id, m.id)}
                                  className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors"
                                >
                                  <Trash2 size={11} color="#f87171" />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
