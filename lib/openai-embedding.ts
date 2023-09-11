export async function openaiEmbedding(content: string) {
  const input = content.replace(/\n/g, ' ')
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input,
      }),
    })
    if (!response.ok) {
      throw new Error(`${response.statusText}`)
    }
    const responseData = await response.json()
    const embeddings = responseData.data[0].embedding
    const tokenUsage: string = responseData.usage.total_tokens

    return { content, embeddings, tokenUsage }
  } catch (err: any) {
    throw new Error(err)
  }
}
