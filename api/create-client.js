import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.VITE_SUPABASE_URL

  if (!serviceKey)   return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY is not configured on the server.' })
  if (!supabaseUrl)  return res.status(500).json({ error: 'VITE_SUPABASE_URL is not configured on the server.' })

  const { email, password, business_name, package: pkg, account_manager } = req.body ?? {}

  if (!email?.trim())         return res.status(400).json({ error: 'Email is required.' })
  if (!password || password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' })
  if (!business_name?.trim()) return res.status(400).json({ error: 'Business name is required.' })

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: email.trim().toLowerCase(),
    password,
    email_confirm: true,
  })

  if (authError) return res.status(400).json({ error: authError.message })

  const userId = authData.user.id

  const { error: profileError } = await admin.from('client_profiles').insert({
    id: userId,
    business_name: business_name.trim(),
    package: pkg || null,
    account_manager: account_manager?.trim() || 'Chris Eyres',
    project_status: 'onboarding',
  })

  if (profileError) {
    await admin.auth.admin.deleteUser(userId)
    return res.status(500).json({ error: 'Profile creation failed: ' + profileError.message })
  }

  return res.status(200).json({ success: true, userId, email: email.trim().toLowerCase() })
}
