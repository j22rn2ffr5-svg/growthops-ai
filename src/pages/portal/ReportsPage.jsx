import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Printer, ChevronDown, ChevronUp, Users, Ticket, Globe,
  TrendingUp, BookOpen, Wrench, BarChart3, CheckCircle2, Clock,
  ArrowUpRight, ArrowDownRight, Minus, Zap
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }

function monthBounds(ym) {
  const [y, m] = ym.split('-').map(Number)
  const start = new Date(y, m - 1, 1).toISOString()
  const end   = new Date(y, m, 0, 23, 59, 59).toISOString()
  return { start, end }
}

function StatCard({ icon: Icon, color, label, value, sub }) {
  return (
    <div style={{ ...card, padding: '1.25rem' }} className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
        <Icon size={16} color={color} />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-white leading-none">{value ?? '—'}</p>
        <p className="text-xs font-semibold mt-1" style={{ color }}>{label}</p>
        {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function Section({ title, icon: Icon, color, children }) {
  return (
    <div className="space-y-3 print-section">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={14} color={color} />
        </div>
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function ChangeIcon({ val }) {
  if (!val || val === 0) return <Minus size={12} color="#6b7280" />
  if (val > 0) return <ArrowDownRight size={12} color="#34d399" /> // lower rank = better
  return <ArrowUpRight size={12} color="#f87171" />
}

export default function ReportsPage() {
  const { user, profile } = useAuth()
  const now = new Date()
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const printRef = useRef()

  async function generate() {
    setLoading(true)
    setReport(null)
    const { start, end } = monthBounds(selectedMonth)
    const uid = user.id

    const [
      { data: leads },
      { data: tickets },
      { data: scores },
      { data: content },
      { data: seo },
      { data: maintenance },
      { data: updates },
      { data: milestones },
    ] = await Promise.all([
      supabase.from('leads').select('*').eq('user_id', uid).gte('created_at', start).lte('created_at', end),
      supabase.from('tickets').select('*').eq('user_id', uid).gte('created_at', start).lte('created_at', end),
      supabase.from('website_scores').select('*').eq('user_id', uid).gte('created_at', start).lte('created_at', end).order('created_at', { ascending: false }).limit(1),
      supabase.from('content_library').select('*').eq('user_id', uid),
      supabase.from('seo_keywords').select('*').eq('user_id', uid).order('position', { ascending: true }),
      supabase.from('maintenance_logs').select('*').eq('user_id', uid).eq('month', selectedMonth),
      supabase.from('website_updates').select('*').eq('user_id', uid).gte('update_date', start.slice(0,10)).lte('update_date', end.slice(0,10)),
      supabase.from('client_milestones').select('*').eq('user_id', uid).gte('due_date', start.slice(0,10)).lte('due_date', end.slice(0,10)),
    ])

    setReport({
      leads:       leads ?? [],
      tickets:     tickets ?? [],
      score:       scores?.[0] ?? null,
      content:     content ?? [],
      seo:         seo ?? [],
      maintenance: maintenance ?? [],
      updates:     updates ?? [],
      milestones:  milestones ?? [],
    })
    setLoading(false)
  }

  function handlePrint() {
    window.print()
  }

  const [y, m] = selectedMonth.split('-')
  const monthLabel = new Date(Number(y), Number(m) - 1, 1)
    .toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #report-print-area { display: block !important; }
          #report-print-area { background: white !important; color: black !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap no-print">
          <div>
            <h1 className="text-xl font-bold text-white">Monthly Reports</h1>
            <p className="text-sm text-gray-500 mt-0.5">Generate a summary report for any month</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap no-print">
          <input
            type="month"
            value={selectedMonth}
            max={defaultMonth}
            onChange={e => { setSelectedMonth(e.target.value); setReport(null) }}
            className="rounded-xl px-4 py-2.5 text-sm text-white outline-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
          >
            <FileText size={14} />
            {loading ? 'Generating…' : 'Generate Report'}
          </button>
          {report && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.09)' }}
            >
              <Printer size={14} />
              Print / Save PDF
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="flex gap-2">
              {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3b82f6', animationDelay: `${i*0.15}s` }} />)}
            </div>
          </div>
        )}

        {/* Report */}
        <AnimatePresence>
        {report && (
          <motion.div id="report-print-area" ref={printRef}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="space-y-7">

            {/* Report header */}
            <div style={{ ...card, padding: '1.5rem' }} className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>
                  <Zap size={18} color="white" fill="white" />
                </div>
                <div>
                  <p className="text-base font-bold text-white">Stragyx</p>
                  <p className="text-xs text-gray-500">Monthly Performance Report</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-extrabold text-white">{monthLabel}</p>
                {profile?.business_name && <p className="text-xs text-gray-500 mt-0.5">{profile.business_name}</p>}
                <p className="text-xs text-gray-600 mt-0.5">Generated {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Stat overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={Users}    color="#60a5fa" label="New Leads"           value={report.leads.length} />
              <StatCard icon={Ticket}   color="#f59e0b" label="Support Tickets"     value={report.tickets.length}
                sub={`${report.tickets.filter(t => t.status === 'resolved').length} resolved`} />
              <StatCard icon={Globe}    color="#34d399" label="Lighthouse Score"
                value={report.score ? `${report.score.performance}` : null}
                sub={report.score ? 'Performance' : 'No snapshot this month'} />
              <StatCard icon={BookOpen} color="#a78bfa" label="Content Published"
                value={report.content.filter(c => c.status === 'published').length} />
            </div>

            {/* Lead Pipeline */}
            {report.leads.length > 0 && (
              <Section title="Lead Pipeline" icon={Users} color="#60a5fa">
                <div style={card} className="overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        {['Name','Source','Status','Value'].map(h => (
                          <th key={h} className="text-left px-4 py-2.5 text-gray-500 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {report.leads.map((l, i) => (
                        <tr key={l.id} style={i < report.leads.length-1 ? { borderBottom: '1px solid rgba(255,255,255,0.04)' } : {}}>
                          <td className="px-4 py-2.5 text-white font-medium">{l.name || '—'}</td>
                          <td className="px-4 py-2.5 text-gray-400 capitalize">{l.source || '—'}</td>
                          <td className="px-4 py-2.5 capitalize text-gray-400">{l.status || '—'}</td>
                          <td className="px-4 py-2.5 text-gray-400">{l.value ? `£${Number(l.value).toLocaleString()}` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            )}

            {/* Support */}
            {report.tickets.length > 0 && (
              <Section title="Support Tickets" icon={Ticket} color="#f59e0b">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Total',    val: report.tickets.length,                                             color: '#f59e0b' },
                    { label: 'Resolved', val: report.tickets.filter(t => t.status === 'resolved').length,        color: '#34d399' },
                    { label: 'Open',     val: report.tickets.filter(t => t.status !== 'resolved').length,        color: '#f87171' },
                  ].map(s => (
                    <div key={s.label} style={card} className="p-3 text-center">
                      <p className="text-xl font-extrabold text-white">{s.val}</p>
                      <p className="text-xs font-semibold mt-0.5" style={{ color: s.color }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                <div style={card} className="overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        {['Subject','Priority','Status','Date'].map(h => (
                          <th key={h} className="text-left px-4 py-2.5 text-gray-500 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {report.tickets.map((t, i) => (
                        <tr key={t.id} style={i < report.tickets.length-1 ? { borderBottom: '1px solid rgba(255,255,255,0.04)' } : {}}>
                          <td className="px-4 py-2.5 text-white font-medium">{t.subject}</td>
                          <td className="px-4 py-2.5 capitalize text-gray-400">{t.priority || '—'}</td>
                          <td className="px-4 py-2.5 capitalize text-gray-400">{t.status}</td>
                          <td className="px-4 py-2.5 text-gray-500">{new Date(t.created_at).toLocaleDateString('en-GB')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            )}

            {/* Website */}
            {report.score && (
              <Section title="Website Performance" icon={Globe} color="#34d399">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Performance',    val: report.score.performance,    color: '#34d399' },
                    { label: 'SEO',            val: report.score.seo,            color: '#60a5fa' },
                    { label: 'Accessibility',  val: report.score.accessibility,  color: '#a78bfa' },
                    { label: 'Best Practices', val: report.score.best_practices, color: '#f59e0b' },
                  ].map(s => (
                    <div key={s.label} style={card} className="p-3 text-center">
                      <p className="text-2xl font-extrabold" style={{ color: s.val >= 90 ? '#34d399' : s.val >= 70 ? '#f59e0b' : '#f87171' }}>{s.val}</p>
                      <p className="text-xs font-semibold mt-0.5 text-gray-500">{s.label}</p>
                    </div>
                  ))}
                </div>
                {report.updates.length > 0 && (
                  <div style={card} className="overflow-hidden">
                    <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500">Website Updates This Month</p>
                    {report.updates.map((u, i) => (
                      <div key={u.id} className="px-4 py-2.5 flex items-center gap-3"
                        style={i < report.updates.length-1 ? { borderTop: '1px solid rgba(255,255,255,0.04)' } : { borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                        <CheckCircle2 size={13} color="#34d399" className="flex-shrink-0" />
                        <span className="text-xs text-gray-300">{u.description}</span>
                        <span className="text-xs text-gray-600 ml-auto flex-shrink-0">{new Date(u.update_date).toLocaleDateString('en-GB')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            )}

            {/* SEO */}
            {report.seo.length > 0 && (
              <Section title="SEO Rankings" icon={TrendingUp} color="#a78bfa">
                <div style={card} className="overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        {['Keyword','Position','Change','Volume','Page'].map(h => (
                          <th key={h} className="text-left px-4 py-2.5 text-gray-500 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {report.seo.slice(0, 10).map((k, i) => (
                        <tr key={k.id} style={i < Math.min(report.seo.length,10)-1 ? { borderBottom: '1px solid rgba(255,255,255,0.04)' } : {}}>
                          <td className="px-4 py-2.5 text-white font-medium">{k.keyword}</td>
                          <td className="px-4 py-2.5 text-gray-300">#{k.position}</td>
                          <td className="px-4 py-2.5">
                            <span className="flex items-center gap-1">
                              <ChangeIcon val={k.position_change} />
                              <span className={k.position_change < 0 ? 'text-green-400' : k.position_change > 0 ? 'text-red-400' : 'text-gray-600'}>
                                {k.position_change ? Math.abs(k.position_change) : '—'}
                              </span>
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-gray-400">{k.monthly_volume?.toLocaleString() ?? '—'}</td>
                          <td className="px-4 py-2.5 text-gray-500 max-w-[160px] truncate">{k.page_url || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            )}

            {/* Content */}
            {report.content.length > 0 && (
              <Section title="Content Library" icon={BookOpen} color="#f472b6">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Published', val: report.content.filter(c => c.status === 'published').length, color: '#34d399' },
                    { label: 'In Review', val: report.content.filter(c => c.status === 'in_review').length,  color: '#f59e0b' },
                    { label: 'Draft',     val: report.content.filter(c => c.status === 'draft').length,      color: '#6b7280' },
                  ].map(s => (
                    <div key={s.label} style={card} className="p-3 text-center">
                      <p className="text-xl font-extrabold text-white">{s.val}</p>
                      <p className="text-xs font-semibold mt-0.5" style={{ color: s.color }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Maintenance */}
            {report.maintenance.length > 0 && (
              <Section title="Maintenance Log" icon={Wrench} color="#fb923c">
                <div style={card} className="divide-y" style2={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  {report.maintenance.map((log, i) => (
                    <div key={log.id} className="px-4 py-3 flex items-center gap-3"
                      style={i > 0 ? { borderTop: '1px solid rgba(255,255,255,0.04)' } : {}}>
                      {log.status === 'completed'
                        ? <CheckCircle2 size={13} color="#34d399" className="flex-shrink-0" />
                        : <Clock size={13} color="#f59e0b" className="flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white font-medium">{log.task}</p>
                        {log.notes && <p className="text-xs text-gray-600 mt-0.5 truncate">{log.notes}</p>}
                      </div>
                      <span className="text-xs text-gray-600 capitalize flex-shrink-0">{log.category}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Milestones */}
            {report.milestones?.length > 0 && (
              <Section title="Project Milestones" icon={BarChart3} color="#34d399">
                <div style={card} className="overflow-hidden">
                  {report.milestones.map((ms, i) => (
                    <div key={ms.id} className="px-4 py-3 flex items-center gap-3"
                      style={i > 0 ? { borderTop: '1px solid rgba(255,255,255,0.04)' } : {}}>
                      <CheckCircle2 size={13} color={ms.completed ? '#34d399' : '#4b5563'} className="flex-shrink-0" />
                      <p className="text-xs text-white flex-1">{ms.title}</p>
                      {ms.due_date && <span className="text-xs text-gray-600 flex-shrink-0">{new Date(ms.due_date).toLocaleDateString('en-GB')}</span>}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* No data fallback */}
            {report.leads.length === 0 && report.tickets.length === 0 && !report.score &&
             report.content.length === 0 && report.seo.length === 0 && report.maintenance.length === 0 && (
              <div style={card} className="p-12 text-center">
                <FileText size={32} color="#1f2937" className="mx-auto mb-3" />
                <p className="text-sm text-gray-500">No data found for {monthLabel}.</p>
                <p className="text-xs text-gray-600 mt-1">Try selecting a different month or ask your account manager to add data.</p>
              </div>
            )}

            {/* Footer */}
            <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-xs text-gray-700 text-center">Stragyx · Client Portal Report · {monthLabel}</p>
            </div>

          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </>
  )
}
