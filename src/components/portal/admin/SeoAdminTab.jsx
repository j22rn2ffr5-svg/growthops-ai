import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }
const inp  = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', color: 'white', outline: 'none', padding: '8px 12px', fontSize: '14px', width: '100%' }

const blank = { keyword: '', position: '', position_change: '0', monthly_volume: '', page_url: '' }

export default function SeoAdminTab({ clientId }) {
  const [keywords, setKeywords] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId]     = useState(null)
  const [form, setForm]         = useState(blank)
  const [saving, setSaving]     = useState(false)
  const [loading, setLoading]   = useState(true)

  useEffect(() => { load() }, [clientId])

  async function load() {
    const { data } = await supabase.from('seo_keywords').select('*').eq('user_id', clientId).order('position')
    setKeywords(data ?? [])
    setLoading(false)
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  function startEdit(kw) {
    setEditId(kw.id)
    setForm({ keyword: kw.keyword, position: kw.position ?? '', position_change: kw.position_change ?? 0, monthly_volume: kw.monthly_volume ?? '', page_url: kw.page_url ?? '' })
    setShowForm(false)
  }

  async function save() {
    if (!form.keyword.trim() || !form.position) return
    setSaving(true)
    const payload = {
      user_id: clientId,
      keyword: form.keyword.trim(),
      position: Number(form.position),
      position_change: Number(form.position_change) || 0,
      monthly_volume: form.monthly_volume ? Number(form.monthly_volume) : null,
      page_url: form.page_url || null,
    }
    if (editId) {
      await supabase.from('seo_keywords').update(payload).eq('id', editId)
    } else {
      await supabase.from('seo_keywords').insert(payload)
    }
    setSaving(false); setShowForm(false); setEditId(null); setForm(blank)
    load()
  }

  async function del(id) {
    await supabase.from('seo_keywords').delete().eq('id', id)
    setKeywords(prev => prev.filter(k => k.id !== id))
  }

  const Form = () => (
    <div className="space-y-3 p-4 rounded-xl mb-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Keyword</label>
          <input style={inp} value={form.keyword} onChange={set('keyword')} placeholder="e.g. recruitment agency london" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Position</label>
          <input style={inp} type="number" min="1" value={form.position} onChange={set('position')} placeholder="e.g. 4" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Change (+ up, - down)</label>
          <input style={inp} type="number" value={form.position_change} onChange={set('position_change')} placeholder="e.g. +3 or -1" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Monthly Volume</label>
          <input style={inp} type="number" min="0" value={form.monthly_volume} onChange={set('monthly_volume')} placeholder="e.g. 1200" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Ranking Page URL</label>
          <input style={inp} value={form.page_url} onChange={set('page_url')} placeholder="e.g. /services/recruitment" />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={() => { setShowForm(false); setEditId(null); setForm(blank) }} className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-300">Cancel</button>
        <button onClick={save} disabled={saving || !form.keyword.trim() || !form.position}
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
        <h3 className="text-sm font-bold text-white">Keyword Rankings <span className="text-gray-600 font-normal">({keywords.length})</span></h3>
        {!showForm && !editId && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
            <Plus size={11} /> Add Keyword
          </button>
        )}
      </div>

      {showForm && <Form />}

      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <table className="w-full text-sm">
          <thead><tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            {['Keyword','Pos.','Change','Volume','Page URL',''].map((h, i) => <th key={i} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">{h}</th>)}
          </tr></thead>
          <tbody>
            {keywords.map((kw, i) => (
              editId === kw.id
                ? <tr key={kw.id}><td colSpan={6} className="p-0"><Form /></td></tr>
                : (
                  <tr key={kw.id} className="group" style={{ borderBottom: i < keywords.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <td className="px-4 py-3 text-gray-200 font-medium">{kw.keyword}</td>
                    <td className="px-4 py-3 text-white font-bold">#{kw.position}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${kw.position_change > 0 ? 'text-green-400' : kw.position_change < 0 ? 'text-red-400' : 'text-gray-600'}`}>
                        {kw.position_change > 0 ? `+${kw.position_change}` : kw.position_change === 0 ? '—' : kw.position_change}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{kw.monthly_volume?.toLocaleString() ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs font-mono truncate max-w-xs">{kw.page_url ?? '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(kw)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10"><Pencil size={11} color="#9ca3af" /></button>
                        <button onClick={() => del(kw.id)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-500/10"><Trash2 size={11} color="#f87171" /></button>
                      </div>
                    </td>
                  </tr>
                )
            ))}
            {keywords.length === 0 && !showForm && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-xs text-gray-600">No keywords tracked yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
