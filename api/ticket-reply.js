import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { ticketId, message, adminUserId } = req.body || {}

  if (!ticketId || !message?.trim() || !adminUserId) {
    return res.status(400).json({ error: 'Missing required fields.' })
  }

  // Verify sender is an admin
  const { data: adminCheck } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', adminUserId)
    .single()

  if (!adminCheck) {
    return res.status(403).json({ error: 'Forbidden.' })
  }

  // Insert the reply
  const { error: insertError } = await supabase.from('ticket_replies').insert({
    ticket_id: ticketId,
    user_id:   adminUserId,
    message:   message.trim(),
  })

  if (insertError) {
    console.error('Insert error:', insertError.message)
    return res.status(500).json({ error: 'Failed to save reply.' })
  }

  // Fetch ticket details
  const { data: ticket } = await supabase
    .from('tickets')
    .select('title, user_id')
    .eq('id', ticketId)
    .single()

  if (!ticket) {
    return res.status(200).json({ success: true })
  }

  // Fetch client's email and profile
  const [{ data: authData }, { data: profile }] = await Promise.all([
    supabase.auth.admin.getUserById(ticket.user_id),
    supabase.from('client_profiles').select('business_name').eq('id', ticket.user_id).single(),
  ])

  const clientEmail = authData?.user?.email
  const clientName  = profile?.business_name ?? 'there'

  if (!clientEmail) {
    return res.status(200).json({ success: true })
  }

  // Send email to client
  try {
    await resend.emails.send({
      from:    'Stragyx <onboarding@resend.dev>',
      to:      clientEmail,
      subject: `Re: ${ticket.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <div style="background: #0f172a; padding: 32px; border-radius: 12px 12px 0 0;">
            <p style="color: #60a5fa; font-weight: 700; font-size: 14px; margin: 0 0 8px;">Stragyx</p>
            <h1 style="color: #ffffff; font-size: 20px; margin: 0;">You have a new reply</h1>
          </div>
          <div style="background: #f8fafc; padding: 32px; border-radius: 0 0 12px 12px;">
            <p style="color: #475569; margin: 0 0 8px; font-size: 14px;">Hi ${clientName},</p>
            <p style="color: #475569; margin: 0 0 24px; font-size: 14px;">We've replied to your support ticket: <strong>${ticket.title}</strong></p>

            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <p style="color: #1e293b; font-size: 14px; line-height: 1.6; margin: 0;">${message.trim().replace(/\n/g, '<br>')}</p>
            </div>

            <a href="https://Stragyx.ai/portal/tickets" style="display: inline-block; background: #3b82f6; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">View in Portal</a>

            <p style="color: #94a3b8; font-size: 12px; margin: 24px 0 0;">You're receiving this because you have a support ticket open with Stragyx. Log in to your portal to reply or view your full ticket history.</p>
          </div>
        </div>
      `,
    })
  } catch (emailErr) {
    console.error('Resend error:', emailErr?.message)
    // Reply already saved — don't fail the request
  }

  return res.status(200).json({ success: true })
}
