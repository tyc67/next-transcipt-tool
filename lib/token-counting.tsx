import { encode } from 'gpt-3-encoder'
import { ChatCompletionRequestMessage } from 'openai'

export const calculateTokens = (messages: Array<ChatCompletionRequestMessage>) => {
  let count = 0
  messages.slice(0, -1).forEach((message) => {
    count += 4
    if (message.content !== undefined) {
      let encodedContent = encode(message.content)
      count += encodedContent.length
    }
  })
  let last = messages.at(messages.length - 1) as ChatCompletionRequestMessage
  if (last.content !== undefined) {
    let encodedContent = encode(last.content)
    count += encodedContent.length
  }
  return count
}
