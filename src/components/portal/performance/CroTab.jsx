import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FlaskConical, Trophy } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../contexts/AuthContext'

const card = { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem' }

const STATUS = {
  running:   { label: 'Running',   color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  completed: { label: 'Completed', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  paused:    { label: 'Paused',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
}

function TestCard({ test, delay }) {
  const st = STATUS[test.status] ?? STATUS.running
  const aWins = test.winner === 'a'
  const bWins = test.winner === 'b'
  const aRate = test.variant_a_rate
  const bRate = test.variant_b_rate

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}
      style={card} className="p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-white">{test.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{test.page} · {test.visitors?.toLocaleString()} visitors</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: st.bg, color: st.color }}>{st.label}</span>
      </div>

      {/* Variant bars */}
      <div className="space-y-2.5">
        {[
          { label: test.variant_a_label, rate: aRate, wins: aWins, key: 'a' },
          { label: test.variant_b_label, rate: bRate, wins: bWins, key: 'b' },
        ].map(v => {
          const maxRate = Math.max(aRate ?? 0, bRate ?? 0)
          const barPct  = maxRate > 0 ? ((v.rate ?? 0) / maxRate) * 100 : 0
          return (
            <div key={v.key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400">{v.label}</span>
                  {v.wins && <Trophy size={11} color="#f59e0b" />}
                </div>
                <span className="text-xs font-bold" style={{ color: v.wins ? '#10b981' : '#9ca3af' }}>
                  {v.rate != null ? `${v.rate}%` : '—'}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${barPct}%`, background: v.wins ? 'linear-gradient(90deg,#10b981,#34d399)' : 'rgba(59,130,246,0.5)' }} />
              </div>
            </div>
          )
        })}
      </div>

      {test.improvement != null && (
        <div className="flex items-center justify-between text-xs pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-gray-500">Improvement</span>
          <span className="font-semibold" style={{ color: test.improvement > 0 ? '#10b981' : '#f87171' }}>
            {test.improvement > 0 ? '+' : ''}{test.improvement}%
          </span>
        </div>
      )}
    </motion.div>
  )
}

export default function CroTab() {
  const { user } = useAuth()
  const [tests, setTests]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('cro_tests').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { setTests(data ?? []); setLoading(false) })
  }, [user.id])

  if (loading) return <div className="h-48 flex items-center justify-center"><p className="text-sm text-gray-600">Loading…</p></div>

  if (!tests.length) return (
    <div style={card} className="p-14 text-center">
      <FlaskConical size={32} color="#374151" className="mx-auto mb-3" />
      <p className="text-sm text-gray-500">CRO tests will appear here once experiments are running.</p>
    </div>
  )

  const running   = tests.filter(t => t.status === 'running')
  const completed = tests.filter(t => t.status === 'completed')

  return (
    <div className="space-y-6">
      {running.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-white mb-3">Running Tests</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {running.map((t, i) => <TestCard key={t.id} test={t} delay={i * 0.07} />)}
          </div>
        </div>
      )}
      {completed.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-white mb-3">Completed Tests</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.map((t, i) => <TestCard key={t.id} test={t} delay={i * 0.07} />)}
          </div>
        </div>
      )}
    </div>
  )
}
