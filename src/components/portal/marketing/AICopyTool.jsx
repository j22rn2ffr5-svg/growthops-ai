import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Copy, Bookmark, Trash2, Check, Loader2, FileText, X, ImagePlus, ArrowLeft, Edit3 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../contexts/AuthContext'

const TOOLS = [
  { id: 'social_post',    label: 'Social Post' },
  { id: 'ad_copy',        label: 'Ad Copy' },
  { id: 'email_subject',  label: 'Email Subjects' },
  { id: 'blog_intro',     label: 'Blog Intro' },
]

const PLATFORMS = ['LinkedIn', 'Instagram', 'X (Twitter)', 'Facebook']

const TONES = [
  { id: 'professional',    label: 'Professional' },
  { id: 'friendly',        label: 'Friendly' },
  { id: 'bold',            label: 'Bold' },
  { id: 'conversational',  label: 'Conversational' },
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

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload  = () => resolve({ base64: reader.result.split(',')[1], mimeType: file.type })
    reader.onerror = reject
  })
}

// ─── Review Screen ───────────────────────────────────────────────────────────
function ReviewScreen({ imagePreview, output, platforms, onBack, onSave, onCopy, saved, copied }) {
  const [copy, setCopy] = useState(output)

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
      >
        <ArrowLeft size={14} /> Back to edit
      </button>

      <div className={`gap-6 ${imagePreview ? 'grid lg:grid-cols-2' : ''}`}>
        {/* Image */}
        {imagePreview && (
          <div style={card} className="overflow-hidden rounded-2xl">
            <img src={imagePreview} alt="Post image" className="w-full object-cover" style={{ maxHeight: '420px' }} />
            <div className="px-4 py-3 flex flex-wrap gap-1.5">
              {platforms.map(p => (
                <span key={p} className="text-xs px-2 py-0.5 rounded-md font-medium"
                  style={{ background: 'rgba(59,130,246,0.12)', color: '#93c5fd' }}>{p}</span>
              ))}
            </div>
          </div>
        )}

        {/* Copy editor */}
        <div style={card} className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-white">Generated copy</p>
            <Edit3 size={13} color="#4b5563" />
          </div>
          <textarea
            value={copy}
            onChange={e => setCopy(e.target.value)}
            rows={imagePreview ? 12 : 8}
            className="flex-1 resize-none text-sm text-gray-200 leading-relaxed outline-none rounded-xl p-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', minHeight: '180px' }}
          />
          <div className="flex gap-3">
            <button
              onClick={() => onCopy(copy)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: copied ? '#34d399' : '#9ca3af' }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={() => onSave(copy)}
              disabled={saved}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: saved ? 'rgba(52,211,153,0.1)' : 'linear-gradient(135deg, #3b82f6, #7c3aed)',
                border: saved ? '1px solid rgba(52,211,153,0.3)' : 'none',
                color: saved ? '#34d399' : 'white',
              }}
            >
              <Bookmark size={14} />
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AICopyTool() {
  const { user, profile } = useAuth()
  const [tool, setTool]             = useState('social_post')
  const [platforms, setPlatforms]   = useState(['LinkedIn'])
  const [tone, setTone]             = useState('professional')
  const [context, setContext]       = useState('')
  const [request, setRequest]       = useState('')
  const [output, setOutput]         = useState('')
  const [generating, setGenerating] = useState(false)
  const [error, setError]           = useState(null)
  const [copied, setCopied]         = useState(false)
  const [saved, setSaved]           = useState(false)
  const [savedCopies, setSavedCopies] = useState([])
  const [briefs, setBriefs]         = useState([])
  const [selectedBrief, setSelectedBrief] = useState(null)
  const [imageFile, setImageFile]   = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [reviewMode, setReviewMode] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (profile?.business_name) setContext(profile.business_name)
  }, [profile])

  useEffect(() => { loadSaved(); loadBriefs() }, [user.id])

  async function loadSaved() {
    const { data } = await supabase
      .from('marketing_copies')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
    setSavedCopies(data ?? [])
  }

  async function loadBriefs() {
    const { data } = await supabase
      .from('campaign_briefs')
      .select('id, name, objective, target_audience, channels, budget, timeline')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setBriefs(data ?? [])
  }

  function handleBriefSelect(e) {
    const id = e.target.value
    if (!id) { setSelectedBrief(null); return }
    setSelectedBrief(briefs.find(b => b.id === id) ?? null)
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { alert('Image must be under 3MB.'); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function clearImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleGenerate() {
    if (!request.trim()) return
    setGenerating(true)
    setError(null)
    setOutput('')
    setSaved(false)
    setCopied(false)
    try {
      let imageBase64 = null, imageMimeType = null
      if (imageFile && tool === 'social_post') {
        const img = await fileToBase64(imageFile)
        imageBase64  = img.base64
        imageMimeType = img.mimeType
      }

      const res = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool,
          platform: tool === 'social_post' ? platforms.join(', ') : null,
          tone,
          businessContext: context,
          request: request.trim(),
          campaignBrief: selectedBrief ?? null,
          imageBase64,
          imageMimeType,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setOutput(data.output)
      if (tool === 'social_post') setReviewMode(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  async function handleSave(text = output) {
    if (!text || saved) return
    const { error: dbErr } = await supabase.from('marketing_copies').insert({
      user_id: user.id, tool,
      platform: tool === 'social_post' ? platforms.join(', ') : null,
      tone, prompt: request, output: text,
    })
    if (!dbErr) { setSaved(true); loadSaved() }
  }

  async function handleCopy(text = output) {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function deleteCopy(id) {
    await supabase.from('marketing_copies').delete().eq('id', id)
    setSavedCopies(prev => prev.filter(c => c.id !== id))
  }

  const toolLabel = TOOLS.find(t => t.id === tool)?.label ?? ''

  // ── Review screen (social post only) ──────────────────────────────────────
  if (reviewMode && tool === 'social_post') {
    return (
      <ReviewScreen
        imagePreview={imagePreview}
        output={output}
        platforms={platforms}
        copied={copied}
        saved={saved}
        onBack={() => setReviewMode(false)}
        onCopy={handleCopy}
        onSave={handleSave}
      />
    )
  }

  // ── Form view ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div style={card} className="p-6 space-y-5">

        {/* Tool */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Content type</label>
          <div className="flex flex-wrap gap-2">
            {TOOLS.map(t => (
              <Pill key={t.id} active={tool === t.id} onClick={() => { setTool(t.id); setReviewMode(false); clearImage() }}>
                {t.label}
              </Pill>
            ))}
          </div>
        </div>

        {/* Platform (social only) */}
        {tool === 'social_post' && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Platform</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p => (
                <Pill
                  key={p}
                  active={platforms.includes(p)}
                  onClick={() => setPlatforms(prev => {
                    if (prev.includes(p)) return prev.length > 1 ? prev.filter(x => x !== p) : prev
                    return [...prev, p]
                  })}
                >
                  {p}
                </Pill>
              ))}
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

        {/* Campaign brief selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Campaign brief <span className="normal-case font-normal text-gray-600">(optional)</span>
          </label>
          <select
            value={selectedBrief?.id ?? ''}
            onChange={handleBriefSelect}
            style={{ ...input, padding: '10px 14px', fontSize: '14px', cursor: 'pointer' }}
          >
            <option value="">No brief selected</option>
            {briefs.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <AnimatePresence>
            {selectedBrief && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-2 rounded-xl p-4 space-y-2"
                style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText size={12} color="#60a5fa" />
                    <span className="text-xs font-semibold" style={{ color: '#60a5fa' }}>{selectedBrief.name}</span>
                  </div>
                  <button onClick={() => setSelectedBrief(null)} className="text-gray-600 hover:text-gray-400 flex-shrink-0">
                    <X size={13} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                  {selectedBrief.objective && (
                    <div className="col-span-2">
                      <span className="text-gray-600">Objective: </span>
                      <span className="text-gray-400">{selectedBrief.objective}</span>
                    </div>
                  )}
                  {selectedBrief.target_audience && (
                    <div className="col-span-2">
                      <span className="text-gray-600">Audience: </span>
                      <span className="text-gray-400">{selectedBrief.target_audience}</span>
                    </div>
                  )}
                  {selectedBrief.channels?.length > 0 && (
                    <div>
                      <span className="text-gray-600">Channels: </span>
                      <span className="text-gray-400">{selectedBrief.channels.join(', ')}</span>
                    </div>
                  )}
                  {selectedBrief.budget && (
                    <div>
                      <span className="text-gray-600">Budget: </span>
                      <span className="text-gray-400">{selectedBrief.budget}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs" style={{ color: '#4b5563' }}>This brief will be included in the AI prompt as campaign context.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Image upload (social post only) */}
        {tool === 'social_post' && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Post image <span className="normal-case font-normal text-gray-600">(optional — AI will write copy to match)</span>
            </label>
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src={imagePreview} alt="Preview" className="w-full object-cover max-h-48" />
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.65)' }}
                >
                  <X size={12} color="white" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center gap-2 py-5 rounded-xl transition-colors"
                style={{ border: '1px dashed rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.02)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              >
                <ImagePlus size={20} color="#4b5563" />
                <span className="text-xs text-gray-600">Click to upload image · JPG, PNG, WebP · Max 3MB</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        )}

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

      {/* Output (non-social-post tools) */}
      <AnimatePresence>
        {output && tool !== 'social_post' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={card} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Generated {toolLabel}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: copied ? '#34d399' : '#9ca3af' }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() => handleSave()}
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
          <h3 className="text-sm font-bold text-white">Saved copies</h3>
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
