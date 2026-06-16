import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Copy, Bookmark, Trash2, Check, Loader2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../contexts/AuthContext'

const TOOLS = [
  { id: 'social_post',    label: 'Social Post' },
  { id: 'ad_copy',       label: 'Ad Copy' },
  { id: 'email_subject', label: 'Email Subjects' },
  { id: 'blog_intro',    label: 'Blog Intro' },
]

const PLATFORMS = ['LinkedIn', 'Instagram', 'X (Twitter)', 'Facebook']

const TONES = [
  { id: 'professional',    label: 'Professional' },
  { id: 'friendly',       label: 'Friendly' },
  { id: 'bold',           label: 'Bold' },
  { id: 'conversational', label: 'Conversational' },
]

const card  = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }
const input = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', color: 'white', width: '100%', outline: 'none' }

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150"
      style={active
        ? { background: 'rgba(59,130,246,0.25)', color: '#93c5fd', border: '1px solid rgba(96,165,250,0.4)' }
        : { background: 'rgba(255,255,255,0.05)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)' }
      }
    >
      {children}
    </button>
  )
}

export default function AICopyTool() {
  const { user, profile } = useAuth()
  const [tool, setTool]         = useState('social_post')
  const [platform, setPlatform] = useState('LinkedIn')
  const [tone, setTone]         = useState('professional')
  const [context, setContext]   = useState('')
  const [request, setRequest]   = useState('')
  const [output, setOutput]     = useState('')
  const [generating, setGenerating] = useState(false)
  const [error, setError]       = useState(null)
  const [copied, setCopied]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [savedCopies, setSavedCopies] = useState([])

  useEffect(() => {
    if (profile?.business_name) setContext(profile.business_name)
  }, [profile])

  useEffect(() => { loadSaved() }, [user.id])

  async function loadSaved() {
    const { data } = await supabase
      .from('marketing_copies')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
    setSavedCopies(data ?? [])
  }

  async function handleGenerate() {
    if (!request.trim()) return
    setGenerating(true)
    setError(null)
    setOutput('')
    setSaved(false)
    try {
      const res = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool,
          platform: tool === 'social_post' ? platform : null,
          tone,
          businessContext: context,
          request: request.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setOutput(data.output)
    } catch (err) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  async function handleSave() {
    if (!output || saved) return
    const { error: dbErr } = await supabase.from('marketing_copies').insert({
      user_id: user.id, tool,
      platform: tool === 'social_post' ? platform : null,
      tone, prompt: request, output,
    })
    if (!dbErr) { setSaved(true); loadSaved() }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function deleteCopy(id) {
    await supabase.from('marketing_copies').delete().eq('id', id)
    setSavedCopies(prev => prev.filter(c => c.id !== id))
  }

  const toolLabel = TOOLS.find(t => t.id === tool)?.label ?? ''

  return (
    <div className="space-y-5">
      {/* Input card */}
      <div style={card} className="p-6 space-y-5">

        {/* Tool */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Content type</label>
          <div className="flex flex-wrap gap-2">
            {TOOLS.map(t => <Pill key={t.id} active={tool === t.id} onClick={() => setTool(t.id)}>{t.label}</Pill>)}
          </div>
        </div>

        {/* Platform (social only) */}
        {tool === 'social_post' && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Platform</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p => <Pill key={p} active={platform === p} onClick={() => setPlatform(p)}>{p}</Pill>)}
            </div>
          </div>
        )}

        {/* Tone */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Tone</label>
          <div className="flex flex-wrap gap-2">
            {TONES.map(t => <Pill key={t.id} active={tone === t.id} onClick={() => setTone(t.id)}>{t.label}</Pill>)}
          </div>
        </div>

        {/* Business context */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Business context</label>
          <input
            value={context}
            onChange={e => setContext(e.target.value)}
            placeholder="e.g. Apex Talent Solutions — a recruitment consultancy"
            style={{ ...input, padding: '10px 14px', fontSize: '14px' }}
          />
        </div>

        {/* Request */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">What would you like to create?</label>
          <textarea
            rows={4}
            value={request}
            onChange={e => setRequest(e.target.value)}
            placeholder={
              tool === 'social_post'    ? 'e.g. A post announcing our new tech hiring division launching this month' :
              tool === 'ad_copy'        ? 'e.g. An ad for our candidate screening service targeting HR managers at scale-ups' :
              tool === 'email_subject'  ? 'e.g. Subject lines for a re-engagement email to candidates who signed up 3 months ago' :
              'e.g. A blog post about how AI is changing recruitment in 2026'
            }
            className="resize-none"
            style={{ ...input, padding: '12px 14px', fontSize: '14px' }}
          />
        </div>

        {error && (
          <p className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            {error}
          </p>
        )}

        <button
          onClick={handleGenerate}
          disabled={generating || !request.trim()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: generating || !request.trim() ? 'rgba(59,130,246,0.35)' : 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
        >
          {generating ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          {generating ? 'Generating…' : `Generate ${toolLabel}`}
        </button>
      </div>

      {/* Output */}
      <AnimatePresence>
        {output && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={card} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Generated {toolLabel}</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: copied ? '#34d399' : '#9ca3af' }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saved}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ background: saved ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.06)', border: `1px solid ${saved ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.1)'}`, color: saved ? '#34d399' : '#9ca3af' }}
                >
                  <Bookmark size={12} />
                  {saved ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-sans">{output}</pre>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved copies */}
      {savedCopies.length > 0 && (
        <div style={card} className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">Saved copies</h3>
          <div className="space-y-3">
            {savedCopies.map(copy => (
              <div key={copy.id} className="group rounded-xl p-4 space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'rgba(59,130,246,0.15)', color: '#93c5fd' }}>
                      {TOOLS.find(t => t.id === copy.tool)?.label ?? copy.tool}
                    </span>
                    {copy.platform && (
                      <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af' }}>{copy.platform}</span>
                    )}
                  </div>
                  <button onClick={() => deleteCopy(copy.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-red-400">
                    <Trash2 size={13} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 truncate italic">"{copy.prompt}"</p>
                <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">{copy.output}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
