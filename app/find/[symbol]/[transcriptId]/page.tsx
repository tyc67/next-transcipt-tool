import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Container from './Container'

export const revalidate = 0

export const metadata: Metadata = {
  title: `quarter transcript`,
  description: 'earnings transcript',
}

export default async function Page({
  params: { transcriptId },
}: {
  params: { transcriptId: string }
}) {
  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase
    .from('transcript')
    .select()
    .like('parent_transcript_id', `%${transcriptId}%`)

  // console.log('params: ', transcriptId)
  // console.log('dataServerComponent: ', data)

  if (data?.length === 0) {
    notFound()
  }

  const selectedTranscriptContent = data?.[0].content
  const selectedTranscriptId = data?.[0].parent_transcript_id
  const selectedTranscriptTopics = data?.[0].keypoint_topics
  const selectedTranscriptHashTag = data?.[0].hashtag

  return (
    <>
      <Container
        selectedTranscriptId={selectedTranscriptId}
        selectedTranscriptContent={selectedTranscriptContent}
        selectedTranscriptTopics={selectedTranscriptTopics}
        selectedTranscriptHashTag={selectedTranscriptHashTag}
      />
    </>
  )
}
