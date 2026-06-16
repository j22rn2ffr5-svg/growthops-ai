import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ChevronRight, X, Loader2, Sparkles, Trash2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../contexts/AuthContext'

const CHANNELS = ['SEO', 'Google Ads', 'LinkedIn Ads', 'Email', 'Social Media', 'Content Marketing', 'PR', 'Events', 'Referral']

const STATUSES = [
  { id: 'draft',     label: 'Draft',     color: '#6b7280' },
  { id: 'active',    label: 'Active',    color: '#3b82f6' },
  { id: 'completed', label: 'Completed', color: '#10b981' },
]

const EMPTY = { name: '', objective: '', target_audience: '', budget: '', timeline: '', channels: [], notes: '', status: 'draft' }

const card  = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }
const input = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', color: 'white', width: '100%', outline: 'none', padding: '10px 14px', fontSize: '14px' }

function statusOf(id) { return STATUSES.find(s => s.id === id) ?? STATUSES[0] }

export default function CampaignBriefs() {
  const { user } = useAuth()
  const [briefs, setBriefs]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [generating, setGenerating] = useState(false)
  const [aiSummary, setAiSummary]   = useState('')

  useEffect(() => { loadBriefs() }, [user.id])

  async function loadBriefs() {
    const { data } = await supabase
      .from('campaign_briefs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setBriefs(data ?? [])
    setLoading(false)
  }

  function setField(k, v) { setForm(f => ({ ...f, [k]: v })) }
  function toggleChannel(ch) {
    setForm(f => ({
      ...f,
      channels: f.channels.includes(ch) ? f.channels.filter(c => c !== ch) : [...f.channels, ch],
    }))
  }

  async function generateSummary() {
    if (!form.name) return
    setGenerating(true)
    setAiSummary('')
    try {
      const res = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'campaign_brief', brief: form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAiSummary(data.output)
    } catch (err) {
      setAiSummary('Failed to generate summary — please try again.')
    } finally {
      setGenerating(false)
    }
  }

  async function handleSave() {
    if (!form.name.trim()) return
    setSaving(true)
    await supabase.from('campaign_briefs').insert({ user_id: user.id, ...form, ai_summary: aiSummary || null })
    setSaving(false)
    setShowForm(false)
    setForm(EMPTY)
    setAiSummary('')
    loadBriefs()
  }

  async function deleteBrief(id, e) {
    e.stopPropagation()
    await supabase.from('campaign_briefs').delete().eq('id', id)
    setBriefs(prev => prev.filter(b => b.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{briefs.length} brief{briefs.length !== 1 ? 's' : ''}</p>
        <button
          onClick={() => { setForm(EMPTY); setAiSummary(''); setSelected(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
        >
          <Plus size={14} /> New Brief
        </button>
      </div>

      {/* Brief list */}
      {!loading && briefs.length === 0 ? (
        <div style={card} className="p-14 text-center">
          <p className="text-sm text-gray-500">No campaign briefs yet — create your first one.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {briefs.map(brief => {
            const st = statusOf(brief.status)
            return (
              <motion.div
                key={brief.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelected(selected?.id === brief.id ? null : brief)}
                className="group flex items-start justify-between gap-4 p-5 rounded-2xl cursor-pointer transition-colors"
                style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${selected?.id === brief.id ? 'rgba(96,165,250,0.3)' : 'rgba(255,255,255,0.07)'}` }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ background: `${st.color}18`, color: st.color }}>{st.label}</span>
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{brief.name}</p>
                  {brief.objective && <p className="text-xs text-gray-500 mt-1 truncate">{brief.objective}</p>}
                  {brief.channels?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {brief.channels.slice(0, 4).map(ch => (
                        <span key={ch} className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af' }}>{ch}</span>
                      ))}
                      {brief.channels.length > 4 && <span className="text-xs text-gray-600">+{brief.channels.length - 4}</span>}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
                  <button onClick={e => deleteBrief(brief.id, e)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all">
                    <Trash2 size={14} />
                  </button>
                  <ChevronRight size={14} color="#4b5563" className={`transition-transform ${selected?.id === brief.id ? 'rotate-90' : ''}`} />
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Expanded detail */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            style={card} className="p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold text-white">{selected.name}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-600 hover:text-gray-400 flex-shrink-0 ml-4"><X size={16} /></button>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[
                ['Objective',       selected.objective],
                ['Target audience', selected.target_audience],
                ['Budget',          selected.budget],
                ['Timeline',        selected.timeline],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                  <p className="text-gray-300">{value}</p>
                </div>
              ))}
            </div>

            {selected.channels?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Channels</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.channels.map(ch => (
                    <span key={ch} className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'rgba(59,130,246,0.1)', color: '#93c5fd' }}>{ch}</span>
                  ))}
                </div>
              </div>
            )}

            {selected.notes && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Notes</p>
                <p className="text-sm text-gray-300 leading-relaxed">{selected.notes}</p>
              </div>
            )}

            {selected.ai_summary && (
              <div className="rounded-xl p-4" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                <p className="text-xs font-semibold mb-2" style={{ color: '#60a5fa' }}>AI Summary</p>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">{selected.ai_summary}</pre>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* New brief modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl p-6 space-y-4 my-10"
              style={{ background: '#0d1b2e', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">New Campaign Brief</h3>
                <button onClick={() => { setShowForm(false); setAiSummary('') }} className="text-gray-600 hover:text-gray-400"><X size={16} /></button>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'name',            label: 'Campaign name *',   placeholder: 'e.g. Q3 Tech Hiring Push' },
                  { key: 'objective',       label: 'Objective',         placeholder: 'e.g. Generate 50 qualified tech leads by end of Q3' },
                  { key: 'target_audience', label: 'Target audience',   placeholder: 'e.g. CTOs at Series A–C startups in London' },
                  { key: 'budget',          label: 'Budget',            placeholder: 'e.g. £5,000/month' },
                  { key: 'timeline',        label: 'Timeline',          placeholder: 'e.g. July – September 2026' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
                    <input value={form[key]} onChange={e => setField(key, e.target.value)} placeholder={placeholder} style={input} />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Channels</label>
                  <div className="flex flex-wrap gap-1.5">
                    {CHANNELS.map(ch => (
                      <button
                        key={ch}
                        onClick={() => toggleChannel(ch)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={form.channels.includes(ch)
                          ? { background: 'rgba(59,130,246,0.2)', color: '#93c5fd', border: '1px solid rgba(96,165,250,0.35)' }
                          : { background: 'rgba(255,255,255,0.04)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.07)' }
                        }
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                  <div className="flex gap-2">
                    {STATUSES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setField('status', s.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={form.status === s.id
                          ? { background: `${s.color}1a`, color: s.color, border: `1px solid ${s.color}40` }
                          : { background: 'rgba(255,255,255,0.04)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.07)' }
                        }
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Notes <span className="normal-case font-normal text-gray-600">(optional)</span>
                  </label>
                  <textarea
                    rows={3} value={form.notes} onChange={e => setField('notes', e.target.value)}
                    placeholder="Any other context, constraints, or ideas…"
                    className="resize-none"
                    style={{ ...input, padding: '10px 14px' }}
                  />
                </div>
              </div>

              {/* AI Summary section */}
              <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.12)' }}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold" style={{ color: '#60a5fa' }}>AI Campaign Summary</p>
                  <button
                    onClick={generateSummary}
                    disabled={generating || !form.name}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{ background: 'rgba(59,130,246,0.2)', color: '#93c5fd', border: '1px solid rgba(96,165,250,0.3)', opacity: !form.name ? 0.5 : 1 }}
                  >
                    {generating ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
                    {generating ? 'Generating…' : 'Generate'}
                  </button>
                </div>
                {aiSummary
                  ? <pre className="text-xs text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">{aiSummary}</pre>
                  : <p className="text-xs" style={{ color: '#4b5563' }}>Fill in the brief details above, then click Generate for an AI-written campaign summary.</p>
                }
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => { setShowForm(false); setAiSummary('') }}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-400 transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.name.trim()}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: saving ? 'rgba(59,130,246,0.4)' : 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
                >
                  {saving ? 'Saving…' : 'Save brief'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
