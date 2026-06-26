import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronDown, ChevronUp, MessageSquare, Zap } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

const sevenDaysAgo = () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function stripEnquiryLink(text) {
  return text.replace(/\[ENQUIRY_LINK:[^\]]+\]/g, '').trim()
}

function ConversationRow({ conv, index }) {
  const [open, setOpen] = useState(false)
  const messages = Array.isArray(conv.messages) ? conv.messages : []
  const userMessages = messages.filter(m => m.role === 'user')

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Row header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
        style={{ background: open ? 'rgba(59,130,246,0.05)' : 'transparent' }}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <MessageSquare size={14} color="#60a5fa" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-white">
                {formatDate(conv.created_at)}
              </span>
              <span className="text-xs text-gray-600">at {formatTime(conv.created_at)}</span>
              {conv.lead_captured && (
                <span
                  className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' }}
                >
                  <Zap size={10} /> Lead
                </span>
              )}
            </div>
            {userMessages.length > 0 && (
              <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">
                "{userMessages[0].content}"
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <span className="text-xs text-gray-600">{conv.message_count} messages</span>
          {open ? <ChevronUp size={16} color="#6b7280" /> : <ChevronDown size={16} color="#6b7280" />}
        </div>
      </button>

      {/* Expanded thread */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="p-5 space-y-3 max-h-96 overflow-y-auto">
              {messages.map((msg, i) => {
                const isUser = msg.role === 'user'
                const text = stripEnquiryLink(msg.content)
                return (
                  <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className="max-w-xs sm:max-w-md px-3.5 py-2.5 rounded-xl text-sm leading-relaxed"
                      style={isUser ? {
                        background: 'rgba(59,130,246,0.2)',
                        color: '#bfdbfe',
                        border: '1px solid rgba(59,130,246,0.3)',
                      } : {
                        background: 'rgba(255,255,255,0.04)',
                        color: '#d1d5db',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {text}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setConversations(data ?? [])
        setLoading(false)
      })
  }, [user.id])

  const leads = conversations.filter(c => c.lead_captured).length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <button
          onClick={() => navigate('/portal/automations')}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft size={16} /> Back to Automations
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white mb-1">Chatbot Conversations</h1>
            <p className="text-sm text-gray-500">Last 7 days</p>
          </div>
          {!loading && conversations.length > 0 && (
            <div className="flex gap-4">
              <div className="text-right">
                <p className="text-2xl font-extrabold text-white">{conversations.length}</p>
                <p className="text-xs text-gray-500">Total conversations</p>
              </div>
              {leads > 0 && (
                <div className="text-right">
                  <p className="text-2xl font-extrabold" style={{ color: '#4ade80' }}>{leads}</p>
                  <p className="text-xs text-gray-500">Leads captured</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="flex gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3b82f6', animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      ) : conversations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl flex flex-col items-center justify-center text-center py-20"
          style={{ border: '1px dashed rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)' }}
        >
          <MessageSquare size={32} color="#1f2937" className="mx-auto mb-4" />
          <h3 className="text-base font-bold text-white mb-2">No conversations yet</h3>
          <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
            Chatbot conversations from the last 7 days will appear here automatically.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv, i) => (
            <ConversationRow key={conv.id} conv={conv} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
