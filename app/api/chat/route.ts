import { google } from '@ai-sdk/google'
import { streamText, convertToModelMessages, type UIMessage } from 'ai'

export const maxDuration = 30

const SYSTEM_PROMPT = `You are TACLE AI, a friendly and knowledgeable AI Fitness Companion for the Fitacle platform. You help users with:

- Workout advice and exercise techniques
- Nutrition guidance adapted to different cultures (Indian, Arabic, Asian, European cuisines)
- Fitness goal planning (fat loss, muscle gain, maintaining fitness, building strength, improving endurance)
- Motivation and accountability tips
- Recovery and rest recommendations
- Answering general health and wellness questions

Guidelines:
- Be encouraging and supportive
- Give practical, actionable advice
- Consider cultural food preferences when discussing nutrition
- Always remind users to consult healthcare professionals for medical concerns
- Keep responses concise but helpful (2-3 paragraphs max)
- Use a friendly, conversational tone
- If asked about topics outside fitness/health, politely redirect to fitness topics

You represent Fitacle - "Tackle Your Fitness Limits"`

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json()

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('[TACLE AI] Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
