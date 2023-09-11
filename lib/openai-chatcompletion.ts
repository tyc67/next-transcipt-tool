import { ApplicationError, UserError } from './errors'

export async function openaiChatCompletion(message: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      },

      body: JSON.stringify({
        model: 'gpt-3.5-turbo-16k',
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant. Given the following sections, answer the question using only that information,
          outputted in markdown format. If you are unsure and the answer is not explicitly written in the given context,
          say "Apologies, I can't respond to context-related questions. Please try different keywords."`,
          },
          { role: 'user', content: message },
        ],
        temperature: 0,
      }),
    })
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`)
    }
    const responseData = await response.json()
    const openaiResponse = responseData.choices[0].message.content

    return openaiResponse
  } catch (err: unknown) {
    if (err instanceof UserError) {
      return new Response(
        JSON.stringify({
          error: err.message,
          data: err.data,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    } else if (err instanceof ApplicationError) {
      return new Response(
        JSON.stringify({
          error: err.message,
          data: err.data,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  }
}
