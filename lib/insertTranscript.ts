import supabase from '@/utils/supabase'
import { MarkdownSource, Section } from './indexResource'

export const insertTranscript = async (
  transcriptId: string,
  source: MarkdownSource,
  sections: Section[]
): Promise<void> => {
  try {
    const { data, error: insertTranscriptError } = await supabase.from('transcript').insert({
      parent_transcript_id: transcriptId,
      path: source.path,
      meta: source.meta ?? null,
      type: source.type,
      checksum: source.checksum ?? null,
      source: source.source,
      symbol: source.detail?.symbol,
      heading: sections[0].heading,
      company_name: sections[0].heading?.split(',')[0],
      content: sections[0].content,
    })
    if (insertTranscriptError) {
      throw insertTranscriptError
    }
  } catch (error: any) {
    throw new Error('Fail to insert transcript to Supabase:', error.message)
  }
}
