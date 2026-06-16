import { GoogleGenerativeAI } from '@google/generative-ai'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' })
  }

  const { tool, platform, tone, businessContext, request, brief, campaignBrief, imageBase64, imageMimeType } = req.body ?? {}

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
    const imageContext = imageBase64 ? ' An image has been provided — analyse it and ensure the copy directly relates to and enhances what is shown in the image.' : ''
    systemInstruction = `You are an expert marketing copywriter. Write ${desc}. Tone: ${tone || 'professional'}.${imageContext} Output only the copy — no preamble, no meta-commentary.`
    const briefLines = campaignBrief ? [
      '\n\nCampaign brief context (use this to inform the copy):',
      `Campaign: ${campaignBrief.name}`,
      campaignBrief.objective       ? `Objective: ${campaignBrief.objective}` : null,
      campaignBrief.target_audience ? `Target audience: ${campaignBrief.target_audience}` : null,
      campaignBrief.channels?.length ? `Channels: ${campaignBrief.channels.join(', ')}` : null,
      campaignBrief.budget          ? `Budget: ${campaignBrief.budget}` : null,
      campaignBrief.timeline        ? `Timeline: ${campaignBrief.timeline}` : null,
    ].filter(Boolean).join('\n') : ''
    userPrompt = `Business: ${businessContext || 'A growing business'}${briefLines}\n\nRequest: ${request}`
  }

  try {
    const parts = []
    if (imageBase64 && imageMimeType) {
      parts.push({ inlineData: { data: imageBase64, mimeType: imageMimeType } })
    }
    parts.push({ text: userPrompt })

    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
    })
    return res.status(200).json({ output: result.response.text() })
  } catch (err) {
    console.error('Gemini error:', err)
    return res.status(500).json({ error: 'Failed to generate content. Please try again.' })
  }
}
