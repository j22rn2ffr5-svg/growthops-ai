import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Building2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading]     = useState(true)
  const [expanded, setExpanded]   = useState(null)

  useEffect(() => {
    supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setEnquiries(data ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-extrabold text-white mb-1">Enquiries</h1>
        <p className="text-sm text-gray-500">All contact form submissions.</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="flex gap-2">
            {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3b82f6', animationDelay: `${i * 0.15}s` }} />)}
          </div>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
          <Mail size={36} color="#374151" className="mx-auto mb-3" />
          <p className="text-sm text-gray-500">No enquiries yet.</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="space-y-3">
          {enquiries.map(e => {
            const date = new Date(e.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            const isExpanded = expanded === e.id
            return (
              <div key={e.id} className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                <button
                  onClick={() => setExpanded(isExpanded ? null : e.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors"
                  style={{ background: isExpanded ? 'rgba(59,130,246,0.05)' : 'rgba(255,255,255,0.015)' }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{e.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail size={11} /> {e.email}
                      </span>
                      {e.business && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Building2 size={11} /> {e.business}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-gray-600">{date}</span>
                    <a
                      href={`mailto:${e.email}`}
                      onClick={ev => ev.stopPropagation()}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)', textDecoration: 'none' }}
                    >
                      Reply
                    </a>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.01)' }}>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message</p>
                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{e.message}</p>
                  </div>
                )}
              </div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
