import supabase from '@/utils/supabase'
import { MarkdownSource } from './indexResource'

export const insertTranscriptSections = async (
  transcriptId: string,
  source: MarkdownSource,
  heading: string,
  content: string,
  embeddings: any,
  tokenUsage: string
): Promise<void> => {
  try {
    const {
      error: insertTranscriptSectionError,
      data: transcriptSection,
      status,
      statusText,
    } = await supabase
      .from('transcript_section')
      .insert({
        parent_transcript_id: transcriptId,
        symbol: source.detail?.symbol,
        year: source.detail?.year,
        quarter: source.detail?.quarter,
        heading: heading,
        content: content,
        embedding: embeddings,
        beat_market: true,
        token_count: tokenUsage,
      })
      .select()
      .limit(1)
      .single()

    if (insertTranscriptSectionError) {
      throw insertTranscriptSectionError
    }
  } catch (err) {
    throw new Error(`Fail to insert ${heading} transcript section to Supabase`)
  }
}
