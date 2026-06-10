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

  const { name, email, business, message } = req.body || {}

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields.' })
  }

  // 1. Store in Supabase
  const { error: dbError } = await supabase.from('contact_submissions').insert({
    name:     name.trim(),
    email:    email.trim().toLowerCase(),
    business: business?.trim() ?? '',
    message:  message.trim(),
  })

  if (dbError) {
    console.error('Supabase insert error:', dbError.message)
    return res.status(500).json({ error: 'Failed to save submission.' })
  }

  // 2. Send email notification via Resend
  try {
    await resend.emails.send({
      from:    'GrowthOps AI <notifications@growthops.ai>',
      to:      'chriseyres89@gmail.com',
      subject: `New enquiry from ${name}${business ? ` — ${business}` : ''}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e293b;">New contact form submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #64748b; width: 120px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            ${business ? `<tr><td style="padding: 8px 0; color: #64748b;">Business</td><td style="padding: 8px 0;">${business}</td></tr>` : ''}
            <tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;">Message</td><td style="padding: 8px 0;">${message.replace(/\n/g, '<br>')}</td></tr>
          </table>
          <div style="margin-top: 24px;">
            <a href="mailto:${email}" style="background: #3b82f6; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">Reply to ${name}</a>
          </div>
        </div>
      `,
    })
  } catch (emailErr) {
    // Don't fail the request if email fails — submission is already saved in Supabase
    console.error('Resend error:', emailErr?.message)
  }

  return res.status(200).json({ success: true })
}
