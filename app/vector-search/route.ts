import { NextRequest, NextResponse } from 'next/server'
import { ApplicationError, UserError } from '@/lib/errors'
import { openaiEmbedding } from '@/lib/openai-embedding'
import supabase from '@/utils/supabase'
import { encode, decode } from 'gpt-3-encoder'
import { combinedPrompt } from '@/lib/prompt-template'
import { openaiChatCompletion } from '@/lib/openai-chatcompletion'

export type VectorSearchRequest = {
  symbol: string
  transcriptId: string
  question: string
}

export type VectorSearchResponse = {
  symbol: string
  transcriptId: string
  question: string
  answer: string
}

// export type questionDoc = {
//   query: string
//   embedding: any
// }

export type similarity = {
  id: string
  content: string
  similarity: number
}

// export interface ApiResponseData {
//   data: Qalist[]
// }

// export interface Qalist {
//   q: string
//   a: string
// }

// https://nextjs.org/docs/app/building-your-application/routing/router-handlers
export async function POST(req: NextRequest) {
  try {
    const requestData = (await req.json()) as VectorSearchRequest
    // console.log('vector-search-api: ', requestData)
    if (!requestData) {
      throw new UserError('Missing request data')
    }
    if (!requestData.transcriptId)
      return NextResponse.json({ message: 'transcriptId is undefined' })

    const sanitizedQuery = requestData.question.trim().replaceAll('\n', ' ')
    const { embeddings, tokenUsage } = await openaiEmbedding(sanitizedQuery)
    if (!embeddings) {
      throw new ApplicationError('Failed to create embedding for question', embeddings)
    }

    //TODO: SELECT .... FROM ... WHERE symbol in ["AAPL", "MSFT",....] and quarter... ORDER BY

    // find similar docs from Supabase by PostgreSQL function
    const { error: matchError, data: matchSections } = await supabase.rpc(
      'match_transcript_section',
      {
        embedding: embeddings,
        match_count: 10,
        match_threshold: 0.78,
        match_transcriptid: requestData.transcriptId,
        min_content_length: 50,
      }
    )

    if (matchError) {
      throw new ApplicationError('Failed to match transcript sections', matchError)
    }

    const similarSections = matchSections as similarity[]

    // TODO: tokenizer
    let tokenCount = 0
    let contextText = ''
    for (let i = 0; i < similarSections.length; i++) {
      const str = similarSections[i].content
      contextText += `${str.trim()}\n---\n`
      // const encoded = encode(str)
      // console.log('Encoded this string looks like: ', encoded)

      // console.log('We can look at each token and what it represents')
      // for(let token of encoded){
      //   console.log({token, string: decode([token])})
      // }

      // const decoded = decode(encoded)
      // console.log('We can decode it back into:\n', decoded)
    }
    const promptInput = combinedPrompt(contextText, sanitizedQuery)
    const openaiAnswer = await openaiChatCompletion(promptInput)
    const data = [
      {
        symbol: requestData.symbol,
        transcriptId: requestData.transcriptId,
        question: sanitizedQuery,
        answer: openaiAnswer,
      },
    ]

    // how to define type on Response data?

    return NextResponse.json({ data })
  } catch (err: any) {
    // console.log(err)
    throw new UserError(err)
  }
}
