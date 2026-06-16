import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }
const inp  = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', color: 'white', outline: 'none', padding: '8px 12px', fontSize: '14px', width: '100%' }

const SOURCES  = ['organic','paid','referral','direct','social','email']
const STATUSES = ['new','contacted','qualified','proposal','won','lost']
const STATUS_COLORS = { new: '#6b7280', contacted: '#3b82f6', qualified: '#8b5cf6', proposal: '#f59e0b', won: '#10b981', lost: '#f87171' }
const SOURCE_COLORS = { organic: '#34d399', paid: '#60a5fa', referral: '#a78bfa', direct: '#9ca3af', social: '#f472b6', email: '#fb923c' }
const blank = { name: '', source: 'organic', status: 'new', value: '' }

export default function LeadsAdminTab({ clientId }) {
  const [leads, setLeads]       = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId]     = useState(null)
  const [form, setForm]         = useState(blank)
  const [saving, setSaving]     = useState(false)
  const [loading, setLoading]   = useState(true)

  useEffect(() => { load() }, [clientId])

  async function load() {
    const { data } = await supabase.from('leads').select('*').eq('user_id', clientId).order('created_at', { ascending: false })
    setLeads(data ?? [])
    setLoading(false)
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  function startEdit(lead) {
    setEditId(lead.id)
    setForm({ name: lead.name, source: lead.source ?? 'organic', status: lead.status ?? 'new', value: lead.value ?? '' })
    setShowForm(false)
  }

  async function save() {
    if (!form.name.trim()) return
    setSaving(true)
    const payload = { user_id: clientId, name: form.name.trim(), source: form.source, status: form.status, value: form.value ? Number(form.value) : null }
    if (editId) {
      await supabase.from('leads').update(payload).eq('id', editId)
    } else {
      await supabase.from('leads').insert(payload)
    }
    setSaving(false); setShowForm(false); setEditId(null); setForm(blank)
    load()
  }

  async function del(id) {
    await supabase.from('leads').delete().eq('id', id)
    setLeads(prev => prev.filter(l => l.id !== id))
  }

  const Form = () => (
    <div className="space-y-3 p-4 rounded-xl mb-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Name / Company</label>
          <input style={inp} value={form.name} onChange={set('name')} placeholder="e.g. Acme Ltd" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Source</label>
          <select style={inp} value={form.source} onChange={set('source')}>
            {SOURCES.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
          <select style={inp} value={form.status} onChange={set('status')}>
            {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Value (£)</label>
          <input style={inp} type="number" min="0" value={form.value} onChange={set('value')} placeholder="e.g. 2500" />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={() => { setShowForm(false); setEditId(null); setForm(blank) }} className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-300">Cancel</button>
        <button onClick={save} disabled={saving || !form.name.trim()}
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
        <h3 className="text-sm font-bold text-white">Leads <span className="text-gray-600 font-normal">({leads.length})</span></h3>
        {!showForm && !editId && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
            <Plus size={11} /> Add Lead
          </button>
        )}
      </div>

      {showForm && <Form />}

      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <table className="w-full text-sm">
          <thead><tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            {['Name','Source','Status','Value','Date',''].map((h, i) => <th key={i} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">{h}</th>)}
          </tr></thead>
          <tbody>
            {leads.map((lead, i) => (
              editId === lead.id
                ? <tr key={lead.id}><td colSpan={6} className="p-0"><Form /></td></tr>
                : (
                  <tr key={lead.id} className="group" style={{ borderBottom: i < leads.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <td className="px-4 py-3 text-white font-medium">{lead.name}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold" style={{ color: SOURCE_COLORS[lead.source] ?? '#9ca3af' }}>{lead.source}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize" style={{ background: `${STATUS_COLORS[lead.status]}18`, color: STATUS_COLORS[lead.status] ?? '#6b7280' }}>{lead.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{lead.value ? `£${Number(lead.value).toLocaleString()}` : '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(lead.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(lead)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10"><Pencil size={11} color="#9ca3af" /></button>
                        <button onClick={() => del(lead.id)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-500/10"><Trash2 size={11} color="#f87171" /></button>
                      </div>
                    </td>
                  </tr>
                )
            ))}
            {leads.length === 0 && !showForm && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-xs text-gray-600">No leads yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
