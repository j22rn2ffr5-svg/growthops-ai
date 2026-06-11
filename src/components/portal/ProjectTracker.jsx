import { Check } from 'lucide-react'

const STAGES = [
  { key: 'onboarding', label: 'Onboarding',  desc: 'Getting set up'       },
  { key: 'building',   label: 'In Progress', desc: 'Active development'   },
  { key: 'review',     label: 'Review',      desc: 'Your feedback round'  },
  { key: 'live',       label: 'Live',        desc: 'Project launched'     },
]

export default function ProjectTracker({ status = 'onboarding' }) {
  const currentIndex = STAGES.findIndex(s => s.key === status)

  return (
    <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-5">Project Status</p>

      <div className="flex items-start gap-0">
        {STAGES.map((stage, i) => {
          const done    = i < currentIndex
          const active  = i === currentIndex
          const pending = i > currentIndex
          const last    = i === STAGES.length - 1

          return (
            <div key={stage.key} className="flex-1 flex flex-col items-center relative">
              {/* Connector line */}
              {!last && (
                <div
                  className="absolute top-4 left-1/2 w-full h-0.5 -translate-y-1/2"
                  style={{
                    background: done
                      ? 'linear-gradient(90deg, #3b82f6, #3b82f6)'
                      : 'rgba(255,255,255,0.08)',
                    zIndex: 0,
                  }}
                />
              )}

              {/* Circle */}
              <div
                className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                style={
                  done    ? { background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' } :
                  active  ? { background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', boxShadow: '0 0 0 3px rgba(59,130,246,0.25)' } :
                            { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }
                }
              >
                {done ? (
                  <Check size={14} color="white" strokeWidth={2.5} />
                ) : (
                  <span className="text-xs font-bold" style={{ color: active ? 'white' : '#4b5563' }}>{i + 1}</span>
                )}
              </div>

              {/* Label */}
              <div className="mt-2 text-center px-1">
                <p
                  className="text-xs font-semibold leading-tight"
                  style={{ color: active ? 'white' : done ? '#93c5fd' : '#4b5563' }}
                >
                  {stage.label}
                </p>
                <p className="text-xs mt-0.5 hidden sm:block" style={{ color: active ? '#9ca3af' : '#374151' }}>
                  {stage.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
