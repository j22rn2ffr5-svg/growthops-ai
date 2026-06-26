import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MessageSquare } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const sevenDaysAgo = () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

const ChatbotIllustration = (
  <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect x="6" y="8" width="44" height="16" rx="4" fill="rgba(59,130,246,0.15)" stroke="rgba(59,130,246,0.4)" strokeWidth="1.5"/>
    <path d="M14 24 L10 30 L20 24" fill="rgba(59,130,246,0.15)" stroke="rgba(59,130,246,0.4)" strokeWidth="1.2" strokeLinejoin="round"/>
    <rect x="11" y="13" width="20" height="2" rx="1" fill="rgba(255,255,255,0.4)"/>
    <rect x="11" y="18" width="30" height="2" rx="1" fill="rgba(255,255,255,0.2)"/>
    <rect x="28" y="34" width="44" height="16" rx="4" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.3)" strokeWidth="1.5"/>
    <path d="M64 50 L68 56 L58 50" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.3)" strokeWidth="1.2" strokeLinejoin="round"/>
    <rect x="33" y="39" width="28" height="2" rx="1" fill="rgba(255,255,255,0.3)"/>
    <rect x="33" y="44" width="18" height="2" rx="1" fill="rgba(255,255,255,0.18)"/>
    <circle cx="68" cy="10" r="8" fill="rgba(59,130,246,0.12)" stroke="rgba(59,130,246,0.35)" strokeWidth="1.5"/>
    <rect x="64" y="7" width="8" height="6" rx="2" fill="rgba(59,130,246,0.35)"/>
    <circle cx="66" cy="9" r="1" fill="rgba(255,255,255,0.8)"/>
    <circle cx="70" cy="9" r="1" fill="rgba(255,255,255,0.8)"/>
    <rect x="65" y="12" width="6" height="1" rx="0.5" fill="rgba(255,255,255,0.5)"/>
  </svg>
)

export default function AutomationsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [count, setCount] = useState(null)
  const [leadCount, setLeadCount] = useState(null)

  useEffect(() => {
    supabase
      .from('chatbot_conversations')
      .select('id, lead_captured', { count: 'exact' })
      .eq('user_id', user.id)
      .gte('created_at', sevenDaysAgo())
      .then(({ data, count: total }) => {
        setCount(total ?? 0)
        setLeadCount(data?.filter(r => r.lead_captured).length ?? 0)
      })
  }, [user.id])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-extrabold text-white mb-1">Automations</h1>
        <p className="text-sm text-gray-500">Your active automations and chatbot conversations.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate('/portal/automations/chatbot')}
          className="group cursor-pointer rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
          onMouseEnter={e => e.currentTarget.style.border = '1px solid rgba(59,130,246,0.4)'}
          onMouseLeave={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'}
        >
          <div className="flex items-start justify-between">
            <div
              className="w-16 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}
            >
              {ChatbotIllustration}
            </div>
            <ArrowRight size={16} color="#6b7280" className="mt-1" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">Chatbot Conversations</h3>
            <p className="text-xs text-gray-500">Last 7 days</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <MessageSquare size={12} color="#6b7280" />
              <span className="text-xs text-gray-400">
                {count === null ? '—' : `${count} conversation${count !== 1 ? 's' : ''}`}
              </span>
            </div>
            {leadCount > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                <span className="text-xs text-gray-400">{leadCount} lead{leadCount !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
