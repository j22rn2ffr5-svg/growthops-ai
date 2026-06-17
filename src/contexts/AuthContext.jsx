import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

async function fetchUserData(userId) {
  const [profileRes, adminRes] = await Promise.all([
    supabase.from('client_profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('admin_users').select('id').eq('id', userId).maybeSingle(),
  ])
  return {
    profile: profileRes.data ?? null,
    isAdmin: !!adminRes.data,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadingTimeout = setTimeout(() => setLoading(false), 10000)

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user?.id) {
        try {
          const { profile, isAdmin } = await fetchUserData(session.user.id)
          setProfile(profile)
          setIsAdmin(isAdmin)
        } catch {
          // profile fetch failed — still unblock the app
        }
      }
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    }).finally(() => {
      clearTimeout(loadingTimeout)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user?.id) {
        fetchUserData(session.user.id).then(({ profile, isAdmin }) => {
          setProfile(profile)
          setIsAdmin(isAdmin)
        })
      } else {
        setProfile(null)
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/portal`,
    })
    return { error }
  }

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
