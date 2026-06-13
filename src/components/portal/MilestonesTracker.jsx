import { Check, Clock, Circle, CalendarDays } from 'lucide-react'

const statusConfig = {
  pending:     { icon: Circle, color: '#4b5563', label: 'Pending'     },
  in_progress: { icon: Clock,  color: '#f59e0b', label: 'In Progress' },
  completed:   { icon: Check,  color: '#34d399', label: 'Done'        },
}

export default function MilestonesTracker({ milestones = [] }) {
  if (milestones.length === 0) return null

  const completed = milestones.filter(m => m.status === 'completed').length
  const progress  = Math.round((completed / milestones.length) * 100)

  return (
    <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Milestones & Deliverables</p>
        <span className="text-xs text-gray-500">{completed} of {milestones.length} complete</span>
      </div>

      <div className="h-1.5 rounded-full mb-5" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #3b82f6, #7c3aed)' }}
        />
      </div>

      <div className="space-y-3">
        {milestones.map(m => {
          const sc      = statusConfig[m.status] ?? statusConfig.pending
          const Icon    = sc.icon
          const due     = m.due_date ? new Date(m.due_date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : null
          const overdue = m.due_date && m.status !== 'completed' && new Date(m.due_date) < new Date()

          return (
            <div key={m.id} className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={
                  m.status === 'completed'
                    ? { background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }
                    : { background: 'rgba(255,255,255,0.05)', border: `1px solid ${sc.color}40` }
                }
              >
                <Icon size={12} color={m.status === 'completed' ? 'white' : sc.color} strokeWidth={2.5} />
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium leading-snug"
                  style={{
                    color: m.status === 'completed' ? '#6b7280' : 'white',
                    textDecoration: m.status === 'completed' ? 'line-through' : 'none',
                  }}
                >
                  {m.title}
                </p>
                {m.description && (
                  <p className="text-xs text-gray-600 mt-0.5">{m.description}</p>
                )}
                {due && (
                  <div className="flex items-center gap-1 mt-1">
                    <CalendarDays size={10} color={overdue ? '#f87171' : '#4b5563'} />
                    <span className="text-xs" style={{ color: overdue ? '#f87171' : '#4b5563' }}>
                      {overdue ? 'Overdue · ' : ''}{due}
                    </span>
                  </div>
                )}
              </div>

              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{
                  background: m.status === 'completed' ? 'rgba(52,211,153,0.1)' : m.status === 'in_progress' ? 'rgba(245,158,11,0.1)' : 'rgba(107,114,128,0.1)',
                  color: sc.color,
                }}
              >
                {sc.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
