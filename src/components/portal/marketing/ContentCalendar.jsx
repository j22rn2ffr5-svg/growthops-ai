import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../contexts/AuthContext'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const PLATFORMS = [
  { id: 'linkedin',  label: 'LinkedIn',    color: '#0a66c2' },
  { id: 'instagram', label: 'Instagram',   color: '#e1306c' },
  { id: 'twitter',   label: 'X (Twitter)', color: '#1da1f2' },
  { id: 'facebook',  label: 'Facebook',    color: '#1877f2' },
  { id: 'email',     label: 'Email',       color: '#10b981' },
  { id: 'blog',      label: 'Blog',        color: '#8b5cf6' },
]

const STATUSES = [
  { id: 'draft',     label: 'Draft',     color: '#6b7280' },
  { id: 'scheduled', label: 'Scheduled', color: '#f59e0b' },
  { id: 'published', label: 'Published', color: '#10b981' },
]

const EMPTY = { title: '', content: '', platforms: ['linkedin'], content_type: 'post', status: 'draft', scheduled_date: '' }

function platformColor(id) {
  const first = (id ?? '').split(',')[0].trim()
  return PLATFORMS.find(p => p.id === first)?.color ?? '#6b7280'
}

export default function ContentCalendar() {
  const { user } = useAuth()
  const today = new Date()
  const [year, setYear]     = useState(today.getFullYear())
  const [month, setMonth]   = useState(today.getMonth())
  const [entries, setEntries] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]     = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadEntries() }, [user.id, year, month])

  async function loadEntries() {
    const pad = n => String(n).padStart(2, '0')
    const start = `${year}-${pad(month + 1)}-01`
    const end   = `${year}-${pad(month + 1)}-${new Date(year, month + 1, 0).getDate()}`
    const { data } = await supabase
      .from('content_calendar')
      .select('*')
      .eq('user_id', user.id)
      .gte('scheduled_date', start)
      .lte('scheduled_date', end)
      .order('scheduled_date')
    setEntries(data ?? [])
  }

  function prevMonth() { month === 0 ? (setYear(y => y - 1), setMonth(11)) : setMonth(m => m - 1) }
  function nextMonth() { month === 11 ? (setYear(y => y + 1), setMonth(0)) : setMonth(m => m + 1) }

  function calendarDays() {
    const first = new Date(year, month, 1).getDay()
    const last  = new Date(year, month + 1, 0).getDate()
    const days  = Array(first).fill(null)
    for (let d = 1; d <= last; d++) days.push(d)
    return days
  }

  function pad(n) { return String(n).padStart(2, '0') }
  function dateStr(day) { return `${year}-${pad(month + 1)}-${pad(day)}` }
  function entriesForDay(day) { return day ? entries.filter(e => e.scheduled_date === dateStr(day)) : [] }
  function isToday(day) { return day && year === today.getFullYear() && month === today.getMonth() && day === today.getDate() }

  function openDay(day) {
    setForm({ ...EMPTY, scheduled_date: dateStr(day) })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.title.trim() || !form.scheduled_date) return
    setSaving(true)
    const { platforms, ...rest } = form
    await supabase.from('content_calendar').insert({ user_id: user.id, ...rest, platform: platforms.join(',') })
    setSaving(false)
    setShowForm(false)
    loadEntries()
  }

  async function deleteEntry(id, e) {
    e.stopPropagation()
    await supabase.from('content_calendar').delete().eq('id', id)
    setEntries(prev => prev.filter(en => en.id !== id))
  }

  return (
    <div>
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <ChevronLeft size={15} />
            </button>
            <span className="text-base font-bold text-white w-44 text-center">{MONTHS[month]} {year}</span>
            <button onClick={nextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <ChevronRight size={15} />
            </button>
          </div>
          <button
            onClick={() => { setForm(EMPTY); setShowForm(true) }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
          >
            <Plus size={14} /> Add entry
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-semibold py-1" style={{ color: '#4b5563' }}>{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays().map((day, idx) => {
            const dayEntries = entriesForDay(day)
            const today_ = isToday(day)
            return (
              <div
                key={idx}
                onClick={() => day && openDay(day)}
                className={`min-h-[78px] rounded-xl p-1.5 ${day ? 'cursor-pointer hover:bg-white/[0.04] transition-colors' : ''}`}
                style={day ? { border: `1px solid ${today_ ? 'rgba(96,165,250,0.35)' : 'rgba(255,255,255,0.05)'}` } : {}}
              >
                {day && (
                  <>
                    <span
                      className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium mb-1"
                      style={today_ ? { background: '#3b82f6', color: 'white' } : { color: '#6b7280' }}
                    >
                      {day}
                    </span>
                    <div className="space-y-0.5">
                      {dayEntries.slice(0, 3).map(e => (
                        <div
                          key={e.id}
                          className="group flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs truncate"
                          style={{ background: `${platformColor(e.platform)}1a`, color: platformColor(e.platform) }}
                        >
                          <span className="flex-1 truncate leading-tight">{e.title}</span>
                          <button onClick={ev => deleteEntry(e.id, ev)} className="opacity-0 group-hover:opacity-100 flex-shrink-0 ml-0.5">
                            <X size={9} />
                          </button>
                        </div>
                      ))}
                      {dayEntries.length > 3 && (
                        <p className="text-xs px-1" style={{ color: '#4b5563' }}>+{dayEntries.length - 3}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Add entry modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.65)' }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl p-6 space-y-4"
              style={{ background: '#0d1b2e', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Add calendar entry</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-600 hover:text-gray-400"><X size={16} /></button>
              </div>

              <div className="space-y-3">
                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Date</label>
                  <input
                    type="date"
                    value={form.scheduled_date}
                    onChange={e => setForm(f => ({ ...f, scheduled_date: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Tech hiring division launch post"
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none placeholder-gray-600"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Platform</label>
                  <div className="flex flex-wrap gap-1.5">
                    {PLATFORMS.map(p => {
                      const active = form.platforms.includes(p.id)
                      return (
                        <button
                          key={p.id}
                          onClick={() => setForm(f => {
                            if (f.platforms.includes(p.id)) return f.platforms.length > 1 ? { ...f, platforms: f.platforms.filter(x => x !== p.id) } : f
                            return { ...f, platforms: [...f.platforms, p.id] }
                          })}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                          style={active
                            ? { background: `${p.color}22`, color: p.color, border: `1px solid ${p.color}55` }
                            : { background: 'rgba(255,255,255,0.04)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)' }
                          }
                        >
                          {p.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                  <div className="flex gap-2">
                    {STATUSES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setForm(f => ({ ...f, status: s.id }))}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={form.status === s.id
                          ? { background: `${s.color}1a`, color: s.color, border: `1px solid ${s.color}40` }
                          : { background: 'rgba(255,255,255,0.04)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)' }
                        }
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Content <span className="normal-case font-normal text-gray-600">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="Paste or draft your content here…"
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none placeholder-gray-600 resize-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim() || !form.scheduled_date}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: saving ? 'rgba(59,130,246,0.4)' : 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
              >
                {saving ? 'Saving…' : 'Add to calendar'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
