import supabase from '@/utils/supabase'
import { fetchResources } from './indexResource'
import textSplitter from '@/lib/text-splitting'
import { openaiEmbedding } from './openai-embedding'
import { randomUUID } from 'crypto'
import { insertTranscriptSections } from './insertTranscriptSections'
import { insertTranscript } from './insertTranscript'

// fetchSources->indexResource->walk docs->generate docs/mdfiles embeddings->store to supabase

// TODO: how to check which md file is new or have changed -> re-generate and update (CREATE,UPDATE,DELETE mdfiles)

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
  console.log(`Discovered ${embeddingSources.length} files`)
  console.log(embeddingSources)

  const existingChecksums = existingTranscript?.map((entry) => entry.checksum)


  for (const source of embeddingSources) {
    const transcriptId = randomUUID()
    const { checksum, sections } = await source.load()

    const isMatchExistingChecksum = existingChecksums?.includes(checksum)
    if (isMatchExistingChecksum) {
      console.log('data exists in Supabase, skip to the next !')
      continue
    }

    // table: transcript
    const supabaseTranscriptTable = insertTranscript(transcriptId, source, sections)

    // check sections is 1 object
    console.log('section check:', sections.length)
    const [{ content, heading }] = sections
    console.log(`Adding ## ${heading} ## transcript sections with embeddings`)
    const splitedDocuments = await textSplitter(content)
    console.log(`splitted to ${splitedDocuments.length} documents`)

    const embeddingPromises = splitedDocuments.map((document) =>
      openaiEmbedding(document.pageContent)
    )
    const embeddingResults = await Promise.all(embeddingPromises)

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

  // return what value after all for loops has been done? use Promise.all?
}
