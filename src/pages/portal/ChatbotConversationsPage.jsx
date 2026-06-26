import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const sevenDaysAgo = () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

function stripEnquiryLink(text) {
  return (text ?? '').replace(/\[ENQUIRY_LINK:[^\]]*\]/g, '').trim()
}

function firstUserMessage(messages) {
  const msg = (messages ?? []).find(m => m.role === 'user')
  if (!msg) return '—'
  const text = stripEnquiryLink(msg.content)
  return text.length > 80 ? text.slice(0, 80) + '…' : text
}

function ConversationRow({ conv }) {
  const [open, setOpen] = useState(false)
  const date = new Date(conv.last_message_at ?? conv.created_at)

  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              {' · '}
              {date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-xs text-gray-600">{conv.message_count} messages</span>
            {conv.lead_captured && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80' }}>
                Lead
              </span>
            )}
          </div>
          <p className="text-sm text-gray-300 truncate">{firstUserMessage(conv.messages)}</p>
        </div>
        <div className="flex-shrink-0 text-gray-600">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-2">
          {(conv.messages ?? []).map((msg, i) => {
            const text = stripEnquiryLink(msg.content)
            if (!text) return null
            const isUser = msg.role === 'user'
            return (
              <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[75%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed"
                  style={isUser
                    ? { background: 'rgba(59,130,246,0.2)', color: '#bfdbfe' }
                    : { background: 'rgba(255,255,255,0.05)', color: '#d1d5db' }}
                >
                  {text}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function ChatbotConversationsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('chatbot_conversations')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', sevenDaysAgo())
      .order('last_message_at', { ascending: false })
      .then(({ data }) => {
        setConversations(data ?? [])
        setLoading(false)
      })
  }, [user.id])

  const leadCount = conversations.filter(c => c.lead_captured).length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <button
          onClick={() => navigate('/portal/automations')}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft size={16} /> Back to Automations
        </button>
        <h1 className="text-2xl font-extrabold text-white mb-1">Chatbot Conversations</h1>
        <p className="text-sm text-gray-500">Last 7 days</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Conversations', value: loading ? '—' : conversations.length },
          { label: 'Leads Captured', value: loading ? '—' : leadCount },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.07 }}
            className="p-5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{s.label}</p>
            <p className="text-2xl font-extrabold text-white">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Conversations list */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-sm font-bold text-white">All Conversations</h3>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3b82f6', animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-8">
            <MessageSquare size={32} color="#374151" className="mb-3" />
            <p className="text-sm text-gray-500">No conversations in the last 7 days.</p>
          </div>
        ) : (
          conversations.map(conv => <ConversationRow key={conv.id} conv={conv} />)
        )}
      </motion.div>
    </div>
  )
}
