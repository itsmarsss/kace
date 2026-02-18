import { useState } from 'react'

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

export function useKaceAPI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendMessage = async (conversationHistory, patientContext, revealedVitals) => {
    if (!ANTHROPIC_API_KEY) {
      console.warn('ANTHROPIC_API_KEY not set. Using placeholder response.')
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            content: [
              {
                text: 'This is a placeholder response. Set VITE_ANTHROPIC_API_KEY to enable live mode.',
              },
            ],
          })
        }, 800)
      })
    }

    setLoading(true)
    setError(null)

    try {
      const systemPrompt = `You are Kace, a clinical reasoning coach helping a medical student reason through a T2DM medication selection case.

STRICT RULES:
1. Never state the correct drug or correct answer.
2. Respond with exactly ONE question per turn. No more.
3. Your question targets the single most important unaddressed gap, assumption, or unexplored implication in the learner's last message.
4. Use Socratic technique: ask "why", "at what threshold", "what would change your reasoning", "what's the mechanistic reason behind that".
5. Be concise — 2 to 4 sentences maximum including your question.
6. Never confirm whether the learner is right or wrong. Never say "good" or "correct".
7. Never repeat a question you've already asked.

PATIENT CONTEXT:
${patientContext}

REVEALED INFORMATION SO FAR:
${revealedVitals.join(', ') || 'None yet'}`

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 300,
          system: systemPrompt,
          messages: conversationHistory,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { sendMessage, loading, error }
}
