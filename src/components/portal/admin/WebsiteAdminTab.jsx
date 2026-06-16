import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Save } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }
const inp  = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', color: 'white', outline: 'none', padding: '8px 12px', fontSize: '14px', width: '100%' }

const UPDATE_TYPES = ['content','design','technical','performance','seo']

function Section({ title, children }) {
  return (
    <div style={card} className="p-5 space-y-4">
      <h3 className="text-sm font-bold text-white">{title}</h3>
      {children}
    </div>
  )
}

function Label({ children }) {
  return <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{children}</label>
}

export default function WebsiteAdminTab({ clientId }) {
  // --- Site Info ---
  const [info, setInfo]         = useState(null)
  const [infoForm, setInfoForm] = useState({ url: '', status: 'live', launch_date: '', tech_stack: '', notes: '' })
  const [infoSaving, setInfoSaving] = useState(false)

  // --- Scores ---
  const [scoreForm, setScoreForm] = useState({ performance_score: '', seo_score: '', accessibility_score: '', best_practices_score: '', recorded_at: '' })
  const [scores, setScores]       = useState([])
  const [scoreSaving, setScoreSaving] = useState(false)

  // --- Updates ---
  const [updates, setUpdates]   = useState([])
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [editUpdateId, setEditUpdateId]     = useState(null)
  const [updateForm, setUpdateForm]         = useState({ title: '', description: '', type: 'content', update_date: '' })
  const [updateSaving, setUpdateSaving]     = useState(false)

  useEffect(() => { loadAll() }, [clientId])

  async function loadAll() {
    const [infoRes, scoresRes, updatesRes] = await Promise.all([
      supabase.from('website_info').select('*').eq('user_id', clientId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('website_scores').select('*').eq('user_id', clientId).order('recorded_at', { ascending: false }).limit(5),
      supabase.from('website_updates').select('*').eq('user_id', clientId).order('update_date', { ascending: false }),
    ])
    if (infoRes.data) {
      setInfo(infoRes.data)
      setInfoForm({
        url: infoRes.data.url ?? '',
        status: infoRes.data.status ?? 'live',
        launch_date: infoRes.data.launch_date ?? '',
        tech_stack: (infoRes.data.tech_stack ?? []).join(', '),
        notes: infoRes.data.notes ?? '',
      })
    }
    setScores(scoresRes.data ?? [])
    setUpdates(updatesRes.data ?? [])
  }

  async function saveInfo() {
    setInfoSaving(true)
    const payload = {
      user_id: clientId,
      url: infoForm.url,
      status: infoForm.status,
      launch_date: infoForm.launch_date || null,
      tech_stack: infoForm.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
      notes: infoForm.notes || null,
    }
    if (info?.id) {
      await supabase.from('website_info').update(payload).eq('id', info.id)
    } else {
      const { data } = await supabase.from('website_info').insert(payload).select().single()
      if (data) setInfo(data)
    }
    setInfoSaving(false)
  }

  async function addScore() {
    if (!scoreForm.performance_score) return
    setScoreSaving(true)
    await supabase.from('website_scores').insert({
      user_id: clientId,
      performance_score:    Number(scoreForm.performance_score),
      seo_score:            Number(scoreForm.seo_score),
      accessibility_score:  Number(scoreForm.accessibility_score),
      best_practices_score: Number(scoreForm.best_practices_score),
      recorded_at: scoreForm.recorded_at || new Date().toISOString().slice(0, 10),
    })
    setScoreForm({ performance_score: '', seo_score: '', accessibility_score: '', best_practices_score: '', recorded_at: '' })
    setScoreSaving(false)
    const { data } = await supabase.from('website_scores').select('*').eq('user_id', clientId).order('recorded_at', { ascending: false }).limit(5)
    setScores(data ?? [])
  }

  function startEditUpdate(u) {
    setEditUpdateId(u.id)
    setUpdateForm({ title: u.title, description: u.description ?? '', type: u.type ?? 'content', update_date: u.update_date ?? '' })
    setShowUpdateForm(false)
  }

  async function saveUpdate() {
    setUpdateSaving(true)
    const payload = { user_id: clientId, title: updateForm.title.trim(), description: updateForm.description || null, type: updateForm.type, update_date: updateForm.update_date || null }
    if (editUpdateId) {
      await supabase.from('website_updates').update(payload).eq('id', editUpdateId)
    } else {
      await supabase.from('website_updates').insert(payload)
    }
    setUpdateSaving(false)
    setShowUpdateForm(false)
    setEditUpdateId(null)
    setUpdateForm({ title: '', description: '', type: 'content', update_date: '' })
    const { data } = await supabase.from('website_updates').select('*').eq('user_id', clientId).order('update_date', { ascending: false })
    setUpdates(data ?? [])
  }

  async function deleteUpdate(id) {
    await supabase.from('website_updates').delete().eq('id', id)
    setUpdates(prev => prev.filter(u => u.id !== id))
  }

  const setI = k => e => setInfoForm(f => ({ ...f, [k]: e.target.value }))
  const setS = k => e => setScoreForm(f => ({ ...f, [k]: e.target.value }))
  const setU = k => e => setUpdateForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="space-y-5">
      {/* Site Info */}
      <Section title="Site Details">
        <div className="grid sm:grid-cols-2 gap-3">
          <div><Label>URL</Label><input style={inp} value={infoForm.url} onChange={setI('url')} placeholder="https://www.example.com" /></div>
          <div><Label>Status</Label>
            <select style={inp} value={infoForm.status} onChange={setI('status')}>
              <option value="live">Live</option>
              <option value="development">In Development</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div><Label>Launch Date</Label><input style={{ ...inp, colorScheme: 'dark' }} type="date" value={infoForm.launch_date} onChange={setI('launch_date')} /></div>
          <div><Label>Tech Stack (comma-separated)</Label><input style={inp} value={infoForm.tech_stack} onChange={setI('tech_stack')} placeholder="WordPress, Cloudflare, WP Rocket" /></div>
          <div className="sm:col-span-2"><Label>Notes</Label><input style={inp} value={infoForm.notes} onChange={setI('notes')} placeholder="Any notes about the site" /></div>
        </div>
        <button onClick={saveInfo} disabled={infoSaving}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', opacity: infoSaving ? 0.6 : 1 }}>
          <Save size={13} />{infoSaving ? 'Saving…' : 'Save Site Details'}
        </button>
      </Section>

      {/* Scores */}
      <Section title="Add Lighthouse Score Snapshot">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[['Performance', 'performance_score'], ['SEO', 'seo_score'], ['Accessibility', 'accessibility_score'], ['Best Practices', 'best_practices_score']].map(([label, key]) => (
            <div key={key}><Label>{label}</Label><input style={inp} type="number" min="0" max="100" value={scoreForm[key]} onChange={setS(key)} placeholder="0–100" /></div>
          ))}
        </div>
        <div className="flex items-end gap-3">
          <div className="flex-1 max-w-xs"><Label>Audit Date</Label><input style={{ ...inp, colorScheme: 'dark' }} type="date" value={scoreForm.recorded_at} onChange={setS('recorded_at')} /></div>
          <button onClick={addScore} disabled={scoreSaving || !scoreForm.performance_score}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', opacity: scoreSaving || !scoreForm.performance_score ? 0.5 : 1 }}>
            <Plus size={13} />{scoreSaving ? 'Saving…' : 'Add Scores'}
          </button>
        </div>
        {scores.length > 0 && (
          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <table className="w-full text-xs">
              <thead><tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                {['Date','Perf','SEO','Access.','Best Prac.'].map(h => <th key={h} className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">{h}</th>)}
              </tr></thead>
              <tbody>{scores.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: i < scores.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <td className="px-4 py-2 text-gray-400">{new Date(s.recorded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-4 py-2 text-white font-bold">{s.performance_score}</td>
                  <td className="px-4 py-2 text-white font-bold">{s.seo_score}</td>
                  <td className="px-4 py-2 text-white font-bold">{s.accessibility_score}</td>
                  <td className="px-4 py-2 text-white font-bold">{s.best_practices_score}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Updates */}
      <Section title="Website Updates">
        <div className="flex justify-end">
          {!showUpdateForm && !editUpdateId && (
            <button onClick={() => setShowUpdateForm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
              <Plus size={11} /> Add Update
            </button>
          )}
        </div>

        {(showUpdateForm || editUpdateId) && (
          <div className="space-y-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2"><Label>Title</Label><input style={inp} value={updateForm.title} onChange={setU('title')} placeholder="e.g. Homepage hero refresh" /></div>
              <div><Label>Type</Label>
                <select style={inp} value={updateForm.type} onChange={setU('type')}>
                  {UPDATE_TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div><Label>Date</Label><input style={{ ...inp, colorScheme: 'dark' }} type="date" value={updateForm.update_date} onChange={setU('update_date')} /></div>
              <div className="sm:col-span-2"><Label>Description</Label><textarea style={{ ...inp, resize: 'none' }} rows={2} value={updateForm.description} onChange={setU('description')} placeholder="What was changed and why?" /></div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowUpdateForm(false); setEditUpdateId(null) }} className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors">Cancel</button>
              <button onClick={saveUpdate} disabled={updateSaving || !updateForm.title.trim()}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)' }}>
                {updateSaving ? 'Saving…' : editUpdateId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {updates.map(u => (
            <div key={u.id} className="flex items-start gap-3 px-4 py-3 rounded-xl group"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-white font-medium">{u.title}</p>
                  <span className="text-xs px-1.5 py-0.5 rounded text-gray-500 capitalize" style={{ background: 'rgba(255,255,255,0.05)' }}>{u.type}</span>
                </div>
                {u.description && <p className="text-xs text-gray-500 mt-0.5">{u.description}</p>}
                {u.update_date && <p className="text-xs text-gray-600 mt-0.5">{new Date(u.update_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onClick={() => startEditUpdate(u)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"><Pencil size={12} color="#9ca3af" /></button>
                <button onClick={() => deleteUpdate(u.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/10 transition-colors"><Trash2 size={12} color="#f87171" /></button>
              </div>
            </div>
          ))}
          {updates.length === 0 && !showUpdateForm && (
            <p className="text-xs text-gray-600 py-2">No updates yet.</p>
          )}
        </div>
      </Section>
    </div>
  )
}
