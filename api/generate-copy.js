import { GoogleGenerativeAI } from '@google/generative-ai'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' })
  }

  const { tool, platform, tone, businessContext, request, brief } = req.body ?? {}

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  let systemInstruction, userPrompt

  if (tool === 'campaign_brief') {
    systemInstruction = 'You are a strategic marketing consultant. Write a clear, actionable campaign brief summary in plain text (no markdown). Structure it with labelled sections: Overview, Key Messages, Success Metrics, and Recommended Approach.'
    userPrompt = [
      `Campaign: ${brief?.name || 'Untitled'}`,
      `Objective: ${brief?.objective || 'Not specified'}`,
      `Target audience: ${brief?.target_audience || 'Not specified'}`,
      `Budget: ${brief?.budget || 'Not specified'}`,
      `Timeline: ${brief?.timeline || 'Not specified'}`,
      `Channels: ${(brief?.channels || []).join(', ') || 'Not specified'}`,
      `Additional notes: ${brief?.notes || 'None'}`,
    ].join('\n')
  } else {
    const toolDescriptions = {
      social_post:    `an engaging ${platform || 'social media'} post (include relevant hashtags)`,
      ad_copy:        'ad copy with a bold headline, concise body, and clear CTA',
      email_subject:  '5 email subject line options, numbered',
      blog_intro:     'a compelling blog introduction (2–3 paragraphs)',
    }
    const desc = toolDescriptions[tool] ?? 'marketing copy'
    systemInstruction = `You are an expert marketing copywriter. Write ${desc}. Tone: ${tone || 'professional'}. Output only the copy — no preamble, no meta-commentary.`
    userPrompt = `Business: ${businessContext || 'A growing business'}\n\nRequest: ${request}`
  }

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
    })
    return res.status(200).json({ output: result.response.text() })
  } catch (err) {
    console.error('Gemini error:', err)
    return res.status(500).json({ error: 'Failed to generate content. Please try again.' })
  }
}
