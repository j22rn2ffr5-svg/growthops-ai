import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, ShieldCheck, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

function Section({ title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl p-6"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <h2 className="text-sm font-bold text-white mb-5">{title}</h2>
      {children}
    </motion.div>
  )
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
}

const inputFocusStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(96,165,250,0.4)',
  outline: 'none',
}

function TextInput({ value, onChange, placeholder, disabled, type = 'text' }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      style={focused ? inputFocusStyle : inputStyle}
    />
  )
}

export default function SettingsPage() {
  const { user, profile } = useAuth()

  const [businessName, setBusinessName] = useState(profile?.business_name ?? '')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSaved, setProfileSaved]   = useState(false)
  const [profileError, setProfileError]   = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving]   = useState(false)
  const [passwordSaved, setPasswordSaved]     = useState(false)
  const [passwordError, setPasswordError]     = useState('')

  async function handleProfileSave(e) {
    e.preventDefault()
    if (!businessName.trim()) return
    setProfileSaving(true)
    setProfileError('')
    const { error } = await supabase
      .from('client_profiles')
      .update({ business_name: businessName.trim() })
      .eq('id', user.id)
    if (error) {
      setProfileError('Failed to save. Please try again.')
    } else {
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    }
    setProfileSaving(false)
  }

  async function handlePasswordChange(e) {
    e.preventDefault()
    setPasswordError('')
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }
    setPasswordSaving(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setPasswordError(error.message ?? 'Failed to update password.')
    } else {
      setPasswordSaved(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordSaved(false), 3000)
    }
    setPasswordSaving(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-extrabold text-white mb-1">Settings</h1>
        <p className="text-sm text-gray-500">Manage your profile and account details.</p>
      </motion.div>

      {/* Profile */}
      <Section title="Profile" delay={0.05}>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <Field label="Email">
            <TextInput value={user?.email ?? ''} disabled />
            <p className="text-xs text-gray-600 mt-1">Contact us to update your email address.</p>
          </Field>
          <Field label="Business Name">
            <TextInput
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              placeholder="Your company name"
            />
          </Field>
          {profileError && <p className="text-xs text-red-400">{profileError}</p>}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={profileSaving || !businessName.trim()}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
            >
              {profileSaving ? 'Saving…' : 'Save changes'}
            </button>
            {profileSaved && (
              <span className="flex items-center gap-1.5 text-xs text-green-400">
                <CheckCircle size={13} /> Saved
              </span>
            )}
          </div>
        </form>
      </Section>

      {/* Password */}
      <Section title="Change Password" delay={0.1}>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Field label="New Password">
            <TextInput
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </Field>
          <Field label="Confirm New Password">
            <TextInput
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
            />
          </Field>
          {passwordError && <p className="text-xs text-red-400">{passwordError}</p>}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={passwordSaving || !newPassword || !confirmPassword}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
            >
              {passwordSaving ? 'Updating…' : 'Update password'}
            </button>
            {passwordSaved && (
              <span className="flex items-center gap-1.5 text-xs text-green-400">
                <CheckCircle size={13} /> Password updated
              </span>
            )}
          </div>
        </form>
      </Section>

      {/* Plan info — read only */}
      <Section title="Your Plan" delay={0.15}>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-xs text-gray-500">Package</span>
            <span className="text-sm font-semibold text-white">{profile?.package ?? '—'}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-xs text-gray-500">Account Manager</span>
            <span className="text-sm font-semibold text-white">{profile?.account_manager ?? 'Chris Eyres'}</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-4">To change your plan, get in touch at <a href="mailto:hello@stragyx.com" className="text-blue-400 hover:text-blue-300">hello@stragyx.com</a>.</p>
      </Section>
    </div>
  )
}
