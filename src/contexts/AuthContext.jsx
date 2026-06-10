import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null)
  const [profile, setProfile]         = useState(null)
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 5000)

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      clearTimeout(timeout)
      setUser(session?.user ?? null)
      setLoading(false)
      if (session?.user?.id) {
        const { data } = await supabase
          .from('client_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setProfile(data ?? null)
      }
    }).catch(() => {
      clearTimeout(timeout)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('client_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        console.log('Profile fetch:', { data, error })
        setProfile(data ?? null)
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
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
