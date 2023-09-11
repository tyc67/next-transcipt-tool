import supabase from '@/utils/supabase'
import { fetchResources } from './indexResource'
import textSplitter from '@/lib/text-splitting'
import { openaiEmbedding } from './openai-embedding'
import { randomUUID } from 'crypto'
import { insertTranscriptSections } from './insertTranscriptSections'
import { insertTranscript } from './insertTranscript'
import { openai16k } from './openai-16k'

export default async function generateEmbeddings(stock?: string) {
  const allSources = await fetchResources()
  const { data: allChecksums, error } = await supabase
    .from('transcript')
    .select('id,checksum,parent_transcript_id')

  let embeddingSources = allSources
  let existingTranscript = allChecksums

  if (stock) {
    embeddingSources = allSources.filter((item) => item.detail?.symbol === stock)
    const { data: stockChecksums, error } = await supabase
      .from('transcript')
      .select('id,checksum,parent_transcript_id')
      .eq('symbol', stock)

    existingTranscript = stockChecksums
  }

  const existingChecksums = existingTranscript?.map((entry) => entry.checksum)

  for (const source of embeddingSources) {
    const transcriptId = randomUUID()
    const { checksum, sections } = await source.load()

    const isMatchExistingChecksum = existingChecksums?.includes(checksum)
    if (isMatchExistingChecksum) {
      continue
    }
    const context16k = sections[0].content
    const questions16k = [
      `please help me in summarizing the key points from the company's conference call`,
      `Please help me summarize the main topics of interest raised by analysts during the conference call, along with the corresponding answers, using bullet points.`,
      `please help me in identifying high-frequency topics, using bullet points`,
    ]

    const results16k = await Promise.all(
      questions16k.map((question) => openai16k({ context: context16k, question }))
    )
    const companyKeypoint = results16k[0].openaiAnswer.split('\n').map((word) => word.trim())
    const analystKeypoint = results16k[1].openaiAnswer.split('\n').map((word) => word.trim())
    const frequentTopics = results16k[2].openaiAnswer

    const supabaseTranscriptTable = insertTranscript(
      transcriptId,
      source,
      sections,
      companyKeypoint,
      analystKeypoint,
      frequentTopics
    )

    const [{ content, heading }] = sections
    const splitedDocuments = await textSplitter(content)

    try {
      const embeddingPromises = splitedDocuments.map((document) =>
        openaiEmbedding(document.pageContent)
      )
      const embeddingResults = await Promise.all(embeddingPromises)

      if (heading !== undefined) {
        const supabasePromises = embeddingResults.map((results) =>
          insertTranscriptSections(
            transcriptId,
            source,
            heading,
            results.content,
            results.embeddings,
            results.tokenUsage
          )
        )
        const supabaseTranscriptSectionTable = await Promise.all(supabasePromises)
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }
}
