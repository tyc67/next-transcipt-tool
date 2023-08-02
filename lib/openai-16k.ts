import { ApplicationError, UserError } from '@/lib/errors'
import { openaiChatCompletion } from '@/lib/openai-chatcompletion'
import { encode, decode } from 'gpt-3-encoder'

export interface Request16K {
  context: string
  question: string
}

export async function openai16k(req: Request16K) {
  try {
    console.log('16k-api-req: ', req)

    const question = req.question
    const context = req.context

    const prompt = `
    Context sections:
    ${context}
    
    Question: """
    ${question}
    """
    
    Answer as markdown:`

    const openaiAnswer: string = await openaiChatCompletion(prompt)
    console.log('16k-api-res: ', openaiAnswer)

    return { question, openaiAnswer }
  } catch (err: any) {
    console.log(err)
    throw new UserError(err)
  }
}
