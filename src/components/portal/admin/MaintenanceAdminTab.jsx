import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }
const inp  = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', color: 'white', outline: 'none', padding: '8px 12px', fontSize: '14px', width: '100%' }

const CATEGORIES = ['security','updates','monitoring','content','support','seo']
const blank = { month: '', title: '', description: '', category: 'updates', status: 'completed' }

function monthLabel(m) {
  if (!m) return m
  const [y, mo] = m.split('-')
  return new Date(Number(y), Number(mo) - 1, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

export default function MaintenanceAdminTab({ clientId }) {
  const [logs, setLogs]         = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId]     = useState(null)
  const [form, setForm]         = useState(blank)
  const [saving, setSaving]     = useState(false)
  const [loading, setLoading]   = useState(true)

  useEffect(() => { load() }, [clientId])

  async function load() {
    const { data } = await supabase.from('maintenance_logs').select('*').eq('user_id', clientId)
      .order('month', { ascending: false }).order('created_at', { ascending: true })
    setLogs(data ?? [])
    setLoading(false)
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  function startEdit(log) {
    setEditId(log.id)
    setForm({ month: log.month, title: log.title, description: log.description ?? '', category: log.category ?? 'updates', status: log.status ?? 'completed' })
    setShowForm(false)
  }

  async function save() {
    if (!form.title.trim() || !form.month) return
    setSaving(true)
    const payload = { user_id: clientId, month: form.month, title: form.title.trim(), description: form.description || null, category: form.category, status: form.status }
    if (editId) {
      await supabase.from('maintenance_logs').update(payload).eq('id', editId)
    } else {
      await supabase.from('maintenance_logs').insert(payload)
    }
    setSaving(false)
    setShowForm(false)
    setEditId(null)
    setForm(blank)
    load()
  }

  async function del(id) {
    await supabase.from('maintenance_logs').delete().eq('id', id)
    setLogs(prev => prev.filter(l => l.id !== id))
  }

  const grouped = logs.reduce((acc, l) => { acc[l.month] = acc[l.month] ?? []; acc[l.month].push(l); return acc }, {})
  const months  = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  const Form = () => (
    <div className="space-y-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Month</label>
          <input style={{ ...inp, colorScheme: 'dark' }} type="month" value={form.month} onChange={set('month')} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
          <select style={inp} value={form.category} onChange={set('category')}>
            {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label>
          <input style={inp} value={form.title} onChange={set('title')} placeholder="e.g. Plugin updates" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
          <select style={inp} value={form.status} onChange={set('status')}>
            <option value="completed">Completed</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
          <textarea style={{ ...inp, resize: 'none' }} rows={2} value={form.description} onChange={set('description')} placeholder="What was done?" />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={() => { setShowForm(false); setEditId(null); setForm(blank) }} className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-300">Cancel</button>
        <button onClick={save} disabled={saving || !form.title.trim() || !form.month}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)' }}>
          {saving ? 'Saving…' : editId ? 'Update' : 'Add'}
        </button>
      </div>
    </div>
  )

  if (loading) return <div className="flex justify-center py-12"><div className="flex gap-2">{[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3b82f6', animationDelay: `${i*0.15}s` }} />)}</div></div>

  return (
    <div style={card} className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">Maintenance Log</h3>
        {!showForm && !editId && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
            <Plus size={11} /> Add Entry
          </button>
        )}
      </div>

      {showForm && <Form />}

      {months.length === 0 && !showForm ? (
        <p className="text-xs text-gray-600 py-4">No maintenance logs yet.</p>
      ) : (
        <div className="space-y-4">
          {months.map(month => (
            <div key={month}>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{monthLabel(month)}</p>
              <div className="space-y-2">
                {grouped[month].map(log => (
                  editId === log.id ? <Form key={log.id} /> : (
                    <div key={log.id} className="flex items-start gap-3 px-4 py-3 rounded-xl group"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm text-white font-medium">{log.title}</p>
                          <span className="text-xs px-1.5 py-0.5 rounded capitalize" style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af' }}>{log.category}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: log.status === 'completed' ? 'rgba(52,211,153,0.1)' : 'rgba(245,158,11,0.1)', color: log.status === 'completed' ? '#34d399' : '#f59e0b' }}>{log.status}</span>
                        </div>
                        {log.description && <p className="text-xs text-gray-500 mt-0.5">{log.description}</p>}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button onClick={() => startEdit(log)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10"><Pencil size={12} color="#9ca3af" /></button>
                        <button onClick={() => del(log.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/10"><Trash2 size={12} color="#f87171" /></button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
