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

export type similarity = {
  id: string
  content: string
  similarity: number
}

export async function POST(req: NextRequest) {
  try {
    const requestData = (await req.json()) as VectorSearchRequest

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

    let tokenCount = 0
    let contextText = ''
    for (let i = 0; i < similarSections.length; i++) {
      const str = similarSections[i].content
      contextText += `${str.trim()}\n---\n`
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

    return NextResponse.json({ data })
  } catch (err: any) {
    throw new UserError(err)
  }
}
