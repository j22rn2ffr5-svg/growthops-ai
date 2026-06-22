import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { title, description, category, adminUserId } = req.body || {}

  if (!title || !adminUserId) {
    return res.status(400).json({ error: 'Missing required fields.' })
  }

  const { data: adminCheck } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', adminUserId)
    .single()

  if (!adminCheck) {
    return res.status(403).json({ error: 'Forbidden.' })
  }

  const today = new Date().toISOString().split('T')[0]

  const prompt = `You are a project manager breaking down a client support ticket into actionable tasks.

Ticket title: ${title}
Category: ${category ?? 'General'}
Description: ${description ?? 'No description provided.'}
Today's date: ${today}

Suggest 3–6 specific, actionable tasks to resolve this ticket. Space due dates realistically from today (working days). Keep titles concise (max 60 characters).

Respond with ONLY a valid JSON array — no markdown, no explanation:
[{"title":"Task title","due_date":"YYYY-MM-DD"},...]`

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = response.content[0].text.trim()

    // Strip any markdown code fences if present
    const json = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    const tasks = JSON.parse(json)

    if (!Array.isArray(tasks)) throw new Error('Not an array')

    return res.status(200).json({
      tasks: tasks.slice(0, 8).map(t => ({
        title:    String(t.title ?? '').slice(0, 60),
        due_date: t.due_date ?? null,
      })),
    })
  } catch (err) {
    console.error('suggest-tasks error:', err?.message)
    return res.status(500).json({ error: 'AI suggestion failed. Please try again.' })
  }
}
