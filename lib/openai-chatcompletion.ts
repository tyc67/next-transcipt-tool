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
          say "Sorry, I don't know how to answer questions that are related to the context.."`,
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
    console.log('openai-chat-api: ', responseData)
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
      // Print out application errors with their additional data
      console.error(`${err.message}: ${JSON.stringify(err.data)}`)
    } else {
      // Print out unexpected errors as is to help with debugging
      console.error(err)
    }

    // TODO: include more response info in debug environments
    return new Response(
      JSON.stringify({
        error: 'There was an error processing your request',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
