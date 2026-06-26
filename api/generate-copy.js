import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' })
  }

  const { tool, platform, tone, businessContext, request, brief, campaignBrief, imageBase64, imageMimeType } = req.body ?? {}

  let systemPrompt, userPrompt

  if (tool === 'campaign_brief') {
    systemPrompt = 'You are a strategic marketing consultant. Write a clear, actionable campaign brief summary in plain text (no markdown). Structure it with labelled sections: Overview, Key Messages, Success Metrics, and Recommended Approach.'
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
    systemPrompt = `You are an expert marketing copywriter. Write ${desc}. Tone: ${tone || 'professional'}.${imageContext} Output only the copy — no preamble, no meta-commentary.`
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
    const userContent = []
    if (imageBase64 && imageMimeType) {
      userContent.push({ type: 'image', source: { type: 'base64', media_type: imageMimeType, data: imageBase64 } })
    }
    userContent.push({ type: 'text', text: userPrompt })

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    })
    return res.status(200).json({ output: response.content[0].text })
  } catch (err) {
    console.error('Claude error:', err?.message ?? err)
    return res.status(500).json({ error: 'Failed to generate content. Please try again.' })
  }
}
