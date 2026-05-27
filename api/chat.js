import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// ─── Rate limiting ────────────────────────────────────────────────────────────
const rateLimitMap = new Map()
const MAX_MESSAGES = 30
const WINDOW_MS = 60 * 60 * 1000

function isRateLimited(ip) {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now })
    return false
  }
  if (entry.count >= MAX_MESSAGES) return true
  entry.count++
  return false
}

// ─── Email capture (fire webhook once per session) ────────────────────────────
const emailCapturedSessions = new Set()
const EMAIL_REGEX = /[\w.+%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/

function tryFireWebhook(sessionId, email, conversation) {
  if (!process.env.WEBHOOK_URL) return
  fetch(process.env.WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      sessionId,
      timestamp: new Date().toISOString(),
      source: 'website_chatbot',
      page: 'growthops.ai',
      conversation,
    }),
  }).catch((err) => console.error('Webhook fire failed:', err?.message))
}

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `
You are a friendly, knowledgeable assistant for GrowthOps AI — a UK-based agency that helps small and mid-sized businesses grow through practical AI systems, automation, and digital marketing.

Your job is to answer questions honestly, help visitors understand which services suit their situation, and guide interested people towards booking a free strategy call. Keep responses short and conversational — 2–4 sentences where possible, never more than 120 words.

## About GrowthOps AI
GrowthOps AI connects website, CRM, automations, and follow-up into one practical revenue system — so more enquiries turn into booked calls, quotes, and customers. Founded by Chris Eyres. Based in the UK. Website: growthops.ai

## Services
1. Custom Website Design & Development — conversion-focused, mobile-first, SEO-ready
2. AI Chatbot Setup — trained on your business, qualifies leads 24/7, connects to CRM
3. CRM Setup & Optimisation — pipeline setup, deal stages, task automation, team training
4. Business Process Automations — automated follow-up, data sync, workflow automation (clients typically save 10–20 hrs/week)
5. SEO Strategy — keyword research, technical SEO, local SEO, content strategy, monthly reports
6. Content Creation — SEO blogs, landing pages, case studies, email sequences
7. Lead Generation — multi-channel pipeline, LinkedIn outbound, landing pages, lead scoring
8. Paid Advertising — Google Ads, Meta Ads, conversion tracking, weekly optimisation
9. Email & SMS Systems — welcome sequences, nurture campaigns, re-engagement, post-sale
10. Conversion Rate Optimisation — heatmaps, A/B testing, funnel analysis
11. Analytics & Reporting Dashboards — GA4, Looker Studio, full attribution
12. Maintenance & Support — updates, security patches, uptime monitoring

## Packages & Pricing (one-off project fees)
- Launch — from £600: single landing page, CRM connection, basic analytics, 30-day support
- Foundations — from £1,500: multi-page site (up to 6 pages), CRM + pipeline setup, automated email follow-up, monthly report
- Growth System — from £2,500 (most popular): full custom site, AI chatbot, CRM + deal tracking, email/SMS automation, SEO foundations, live dashboard, monthly strategy call
- Scale — custom quote: everything in Growth System plus paid ads, CRO, advanced automation, full attribution, LinkedIn lead gen, AI Voice Agent, dedicated account manager, weekly calls

## Ongoing Retainers (monthly)
- Essential — from £350/month: maintenance, monthly report and review call, CRM housekeeping, minor updates, quarterly strategy check-in
- Active Growth — from £750/month (most popular): everything in Essential + CRO testing, SEO content (2–4 pieces/month), email/SMS management, ad monitoring, dedicated AM, bi-weekly calls
- Full Partnership — from £1,500/month: everything in Active Growth + paid ads management, LinkedIn lead gen, advanced automations, competitor monitoring, weekly calls

## Booking a call
Free 30-minute strategy call at: growthops.ai/book — no pitch, no pressure.

## Email capture
When someone describes a specific business challenge, asks about pricing in detail, or clearly wants to move forward — naturally ask for their email so Chris can follow up. Keep it casual: "What's the best email to reach you on?" or "Drop me your email and I can send you some more detail." Never ask for email in the opening message or before they've engaged.

## Rules
- Never promise specific results (leads, revenue, rankings)
- Never make up facts, client names, or case study figures
- If asked something requiring a specific quote or timeline, say Chris can answer that on a call
- Don't list every service unprompted — respond to what they actually asked
- When someone describes their challenge, respond to their specific situation
- Warm, direct, peer-to-peer tone — no corporate waffle
`.trim()

// ─── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
    .toString().split(',')[0].trim()

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many messages. Please try again in an hour.' })
  }

  const { messages, sessionId } = req.body || {}

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid request body.' })
  }

  const safeMessages = messages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({ role: m.role, content: String(m.content).slice(0, 2000) }))
    .slice(-20)

  if (!safeMessages.length || safeMessages[safeMessages.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Invalid message format.' })
  }

  // ── Email capture: scan user messages, fire webhook once per session ──────
  const sid = String(sessionId || ip).slice(0, 128)
  if (!emailCapturedSessions.has(sid)) {
    for (const msg of safeMessages.filter(m => m.role === 'user')) {
      const match = EMAIL_REGEX.exec(msg.content)
      if (match) {
        emailCapturedSessions.add(sid)
        tryFireWebhook(sid, match[0], safeMessages)
        break
      }
    }
  }

  // ── Call Gemini ───────────────────────────────────────────────────────────
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: { maxOutputTokens: 300 },
    })

    const history = safeMessages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const chat = model.startChat({ history })
    const result = await chat.sendMessage(safeMessages[safeMessages.length - 1].content)
    const text = result.response.text()

    return res.status(200).json({ content: text })
  } catch (err) {
    console.error('Gemini API error:', err?.message ?? err)
    return res.status(500).json({ error: 'Something went wrong. Please try again shortly.' })
  }
}
