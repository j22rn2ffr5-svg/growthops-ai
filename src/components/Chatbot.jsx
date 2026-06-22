import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot, RotateCcw } from 'lucide-react'

// ─── localStorage persistence ─────────────────────────────────────────────────
const STORAGE_KEY = 'Stragyx_chat'
const SESSION_TTL  = 7 * 24 * 60 * 60 * 1000 // 7 days

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data.savedAt || Date.now() - data.savedAt > SESSION_TTL) return null
    return data
  } catch {
    return null
  }
}

function saveSession(sessionId, messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      sessionId,
      messages,
      savedAt: Date.now(),
    }))
  } catch {
    // localStorage unavailable or full — fail silently
  }
}

function clearSession() {
  try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
}

// ─── Welcome message ──────────────────────────────────────────────────────────
const WELCOME = {
  role: 'assistant',
  content: "Hi there 👋 I'm the Stragyx assistant. I can answer questions about our services, packages, and pricing — or help you work out which solution might fit your business. What are you looking to improve?",
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex justify-start">
      <div
        className="px-4 py-3 rounded-2xl"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderBottomLeftRadius: '4px',
        }}
      >
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#60a5fa' }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Chatbot() {
  // Restore session from localStorage on first render
  const [sessionId, setSessionId] = useState(() => {
    const saved = loadSession()
    return saved?.sessionId ?? crypto.randomUUID()
  })

  const [messages, setMessages] = useState(() => {
    const saved = loadSession()
    return saved?.messages ?? [WELCOME]
  })

  const [open, setOpen]               = useState(false)
  const [input, setInput]             = useState('')
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const bottomRef   = useRef(null)
  const inputRef    = useRef(null)
  const textareaRef = useRef(null)

  // Persist to localStorage whenever messages change
  useEffect(() => {
    saveSession(sessionId, messages)
  }, [sessionId, messages])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input when opened, clear unread dot
  useEffect(() => {
    if (open) {
      setHasNewMessage(false)
      setShowClearConfirm(false)
      setTimeout(() => inputRef.current?.focus(), 250)
    }
  }, [open])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 80) + 'px'
  }, [input])

  // Clear chat and start fresh
  const handleClear = useCallback(() => {
    clearSession()
    const newId = crypto.randomUUID()
    setSessionId(newId)
    setMessages([WELCOME])
    setError(null)
    setInput('')
    setShowClearConfirm(false)
  }, [])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg  = { role: 'user', content: text }
    const updated  = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages:  updated.map(m => ({ role: m.role, content: m.content })),
          sessionId,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')

      const assistantMsg = { role: 'assistant', content: data.content }
      setMessages(prev => [...prev, assistantMsg])

      if (!open) setHasNewMessage(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const canSend = input.trim().length > 0 && !loading
  const isReturning = messages.length > 1

  return (
    <>
      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-5 z-50 flex flex-col rounded-2xl overflow-hidden"
            style={{
              width: '360px',
              height: '520px',
              background: '#0b1526',
              border: '1px solid rgba(96,165,250,0.2)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.12))',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
                >
                  <Bot size={17} color="white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-none">Stragyx</p>
                  <p className="text-xs mt-0.5" style={{ color: '#34d399' }}>● Online now</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Clear chat button */}
                {isReturning && (
                  <div className="relative">
                    <button
                      onClick={() => setShowClearConfirm(prev => !prev)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                      style={{ color: '#4b5563' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#9ca3af'}
                      onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}
                      title="New conversation"
                    >
                      <RotateCcw size={14} />
                    </button>

                    {/* Confirm popover */}
                    <AnimatePresence>
                      {showClearConfirm && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-9 z-10 rounded-xl p-3 text-xs whitespace-nowrap"
                          style={{
                            background: '#0f1f38',
                            border: '1px solid rgba(255,255,255,0.12)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                          }}
                        >
                          <p className="text-gray-300 mb-2">Start a new conversation?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={handleClear}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                              style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
                            >
                              Clear & restart
                            </button>
                            <button
                              onClick={() => setShowClearConfirm(false)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                              style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.08)' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Close button */}
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                  style={{ color: '#4b5563' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#e5e7eb'}
                  onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}
                  aria-label="Close chat"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Returning user banner */}
            {isReturning && messages.length > 1 && (
              <div
                className="text-center py-1.5 text-xs"
                style={{
                  background: 'rgba(59,130,246,0.06)',
                  borderBottom: '1px solid rgba(59,130,246,0.1)',
                  color: '#60a5fa',
                }}
              >
                Continuing your previous conversation
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[82%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
                    style={
                      msg.role === 'user'
                        ? {
                            background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
                            color: 'white',
                            borderRadius: '16px 16px 4px 16px',
                          }
                        : {
                            background: 'rgba(255,255,255,0.06)',
                            color: '#cbd5e1',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '16px 16px 16px 4px',
                          }
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && <TypingDots />}

              {error && (
                <p className="text-xs text-center px-4" style={{ color: '#f87171' }}>
                  {error}
                </p>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div
              className="flex-shrink-0 p-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div
                className="flex items-end gap-2 rounded-xl px-3 py-2.5"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <textarea
                  ref={el => { inputRef.current = el; textareaRef.current = el }}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  rows={1}
                  disabled={loading}
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none resize-none leading-relaxed"
                  style={{ maxHeight: '80px' }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!canSend}
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                  style={{
                    background: canSend
                      ? 'linear-gradient(135deg, #3b82f6, #7c3aed)'
                      : 'rgba(255,255,255,0.05)',
                  }}
                  aria-label="Send message"
                >
                  <Send size={13} color={canSend ? 'white' : '#374151'} />
                </button>
              </div>
              <p className="text-xs text-center mt-2" style={{ color: '#374151' }}>
                Enter to send · Shift+Enter for new line
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating toggle button ── */}
      <motion.button
        onClick={() => setOpen(prev => !prev)}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
          boxShadow: '0 8px 32px rgba(59,130,246,0.45)',
        }}
        aria-label={open ? 'Close chat' : 'Chat with us'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} color="white" />
            </motion.div>
          ) : (
            <motion.div
              key="msg"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageSquare size={22} color="white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread dot */}
        <AnimatePresence>
          {hasNewMessage && !open && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
              style={{ background: '#34d399' }}
            />
          )}
        </AnimatePresence>
      </motion.button>
    </>
  )
}
