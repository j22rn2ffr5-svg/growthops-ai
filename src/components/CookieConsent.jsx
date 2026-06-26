import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie } from 'lucide-react'

const STORAGE_KEY = 'Stragyx_cookie_consent'

export default function CookieConsent() {
  // Lazy initializer reads localStorage once on mount — avoids setState-in-effect
  const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY))

  function dismiss(choice) {
    localStorage.setItem(STORAGE_KEY, choice)
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.35 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[200]"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div
            className="rounded-2xl p-5 shadow-2xl"
            style={{
              background: 'rgba(10, 20, 40, 0.97)',
              border: '1px solid rgba(96,165,250,0.22)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(59,130,246,0.12)' }}
              >
                <Cookie size={17} color="#60a5fa" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">We use cookies</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  We use essential cookies to make this site work. We'd also like to set analytics
                  cookies to understand how you use it.{' '}
                  <Link
                    to="/cookie-policy"
                    className="underline hover:text-blue-400 transition-colors"
                    style={{ color: '#60a5fa' }}
                  >
                    Cookie policy
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => dismiss('accepted')}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150"
                style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
              >
                Accept
              </button>
              <button
                onClick={() => dismiss('declined')}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-300 transition-all duration-150"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
