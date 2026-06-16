import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }
const inp  = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', color: 'white', outline: 'none', padding: '8px 12px', fontSize: '14px', width: '100%' }

const TYPES    = ['blog','landing_page','case_study','email_sequence','social']
const STATUSES = ['published','in_review','draft']
const STATUS_COLORS = { published: '#34d399', in_review: '#f59e0b', draft: '#6b7280' }
const blank = { title: '', type: 'blog', status: 'draft', url: '', description: '', published_date: '' }

export default function ContentAdminTab({ clientId }) {
  const [items, setItems]       = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId]     = useState(null)
  const [form, setForm]         = useState(blank)
  const [saving, setSaving]     = useState(false)
  const [loading, setLoading]   = useState(true)

  useEffect(() => { load() }, [clientId])

  async function load() {
    const { data } = await supabase.from('content_library').select('*').eq('user_id', clientId)
      .order('published_date', { ascending: false, nullsFirst: false })
    setItems(data ?? [])
    setLoading(false)
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  function startEdit(item) {
    setEditId(item.id)
    setForm({ title: item.title, type: item.type, status: item.status, url: item.url ?? '', description: item.description ?? '', published_date: item.published_date ?? '' })
    setShowForm(false)
  }

  async function save() {
    if (!form.title.trim()) return
    setSaving(true)
    const payload = { user_id: clientId, title: form.title.trim(), type: form.type, status: form.status, url: form.url || null, description: form.description || null, published_date: form.published_date || null }
    if (editId) {
      await supabase.from('content_library').update(payload).eq('id', editId)
    } else {
      await supabase.from('content_library').insert(payload)
    }
    setSaving(false); setShowForm(false); setEditId(null); setForm(blank)
    load()
  }

  async function del(id) {
    await supabase.from('content_library').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const typeLabel = t => t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  const Form = () => (
    <div className="space-y-3 p-4 rounded-xl mb-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label>
          <input style={inp} value={form.title} onChange={set('title')} placeholder="Content title" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Type</label>
          <select style={inp} value={form.type} onChange={set('type')}>
            {TYPES.map(t => <option key={t} value={t}>{typeLabel(t)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
          <select style={inp} value={form.status} onChange={set('status')}>
            {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">URL (if published)</label>
          <input style={inp} value={form.url} onChange={set('url')} placeholder="https://..." />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Published Date</label>
          <input style={{ ...inp, colorScheme: 'dark' }} type="date" value={form.published_date} onChange={set('published_date')} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
          <textarea style={{ ...inp, resize: 'none' }} rows={2} value={form.description} onChange={set('description')} placeholder="Brief description of this content piece" />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={() => { setShowForm(false); setEditId(null); setForm(blank) }} className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-300">Cancel</button>
        <button onClick={save} disabled={saving || !form.title.trim()}
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
        <h3 className="text-sm font-bold text-white">Content Library <span className="text-gray-600 font-normal">({items.length})</span></h3>
        {!showForm && !editId && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
            <Plus size={11} /> Add Content
          </button>
        )}
      </div>

      {showForm && <Form />}

      <div className="space-y-2">
        {items.map(item => (
          editId === item.id ? <Form key={item.id} /> : (
            <div key={item.id} className="flex items-start gap-3 px-4 py-3 rounded-xl group"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm text-white font-medium">{item.title}</p>
                  {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400 transition-colors"><ExternalLink size={11} /></a>}
                </div>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <span className="text-xs px-1.5 py-0.5 rounded text-gray-400" style={{ background: 'rgba(255,255,255,0.05)' }}>{typeLabel(item.type)}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded font-medium capitalize" style={{ background: `${STATUS_COLORS[item.status]}18`, color: STATUS_COLORS[item.status] }}>{item.status.replace('_',' ')}</span>
                  {item.published_date && <span className="text-xs text-gray-600">{new Date(item.published_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                </div>
                {item.description && <p className="text-xs text-gray-500 mt-1">{item.description}</p>}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onClick={() => startEdit(item)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10"><Pencil size={12} color="#9ca3af" /></button>
                <button onClick={() => del(item.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/10"><Trash2 size={12} color="#f87171" /></button>
              </div>
            </div>
          )
        ))}
        {items.length === 0 && !showForm && <p className="text-xs text-gray-600 py-4">No content yet.</p>}
      </div>
    </div>
  )
}
