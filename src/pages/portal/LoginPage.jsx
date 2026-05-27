import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import SEO from '../../components/SEO'

export default function LoginPage() {
  const { signIn, resetPassword } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [mode, setMode]           = useState('login') // 'login' | 'reset'
  const [resetSent, setResetSent] = useState(false)

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
  }
  const focusStyle = { borderColor: 'rgba(96,165,250,0.5)' }
  const blurStyle  = { borderColor: 'rgba(255,255,255,0.08)' }

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signIn(email, password)
    if (error) {
      setError('Incorrect email or password. Please try again.')
      setLoading(false)
    } else {
      navigate('/portal')
    }
  }

  async function handleReset(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await resetPassword(email)
    setLoading(false)
    if (error) {
      setError('Could not send reset email. Please check the address and try again.')
    } else {
      setResetSent(true)
    }
  }

  return (
    <>
      <SEO title="Client Portal" description="GrowthOps AI client portal login." path="/portal/login" />

      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: '#060f1c' }}
      >
        {/* Background orb */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 50% 40% at 50% 40%, rgba(59,130,246,0.08) 0%, transparent 70%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative w-full max-w-sm"
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link to="/" style={{ textDecoration: 'none' }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
                >
                  <Zap size={18} color="white" fill="white" />
                </div>
                <div>
                  <p className="text-base font-bold text-white leading-none">GrowthOps AI</p>
                  <p className="text-xs" style={{ color: '#60a5fa' }}>Client Portal</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {mode === 'login' ? (
              <>
                <h1 className="text-xl font-bold text-white mb-1">Welcome back</h1>
                <p className="text-sm text-gray-500 mb-7">Sign in to your client portal.</p>

                {error && (
                  <div
                    className="mb-5 px-4 py-3 rounded-xl text-sm"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
                  >
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail size={14} color="#4b5563" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
                        style={inputStyle}
                        onFocus={e => Object.assign(e.target.style, focusStyle)}
                        onBlur={e => Object.assign(e.target.style, blurStyle)}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={14} color="#4b5563" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPass ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
                        style={inputStyle}
                        onFocus={e => Object.assign(e.target.style, focusStyle)}
                        onBlur={e => Object.assign(e.target.style, blurStyle)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(p => !p)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
                      >
                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                    style={{
                      background: loading
                        ? 'rgba(59,130,246,0.4)'
                        : 'linear-gradient(135deg, #3b82f6, #7c3aed)',
                    }}
                  >
                    {loading ? 'Signing in…' : <>Sign In <ArrowRight size={15} /></>}
                  </button>
                </form>

                <button
                  onClick={() => { setMode('reset'); setError(null) }}
                  className="w-full text-center text-xs text-gray-600 hover:text-gray-400 mt-5 transition-colors"
                >
                  Forgot your password?
                </button>
              </>
            ) : (
              <>
                <h1 className="text-xl font-bold text-white mb-1">Reset password</h1>
                <p className="text-sm text-gray-500 mb-7">
                  Enter your email and we'll send a reset link.
                </p>

                {resetSent ? (
                  <div
                    className="px-4 py-4 rounded-xl text-sm text-center"
                    style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' }}
                  >
                    Check your inbox — reset link sent.
                  </div>
                ) : (
                  <>
                    {error && (
                      <div
                        className="mb-5 px-4 py-3 rounded-xl text-sm"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
                      >
                        {error}
                      </div>
                    )}
                    <form onSubmit={handleReset} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Email address
                        </label>
                        <div className="relative">
                          <Mail size={14} color="#4b5563" className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"
                            style={inputStyle}
                            onFocus={e => Object.assign(e.target.style, focusStyle)}
                            onBlur={e => Object.assign(e.target.style, blurStyle)}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl text-sm font-semibold text-white"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
                      >
                        {loading ? 'Sending…' : 'Send reset link'}
                      </button>
                    </form>
                  </>
                )}

                <button
                  onClick={() => { setMode('login'); setError(null); setResetSent(false) }}
                  className="w-full text-center text-xs text-gray-600 hover:text-gray-400 mt-5 transition-colors"
                >
                  ← Back to sign in
                </button>
              </>
            )}
          </div>

          <p className="text-center text-xs text-gray-700 mt-5">
            Don't have access?{' '}
            <Link to="/contact" className="text-blue-500 hover:text-blue-400" style={{ textDecoration: 'none' }}>
              Contact us →
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  )
}
