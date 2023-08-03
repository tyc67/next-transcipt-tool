import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect } from 'react'

export default function Transcript({ content }: { content: string }) {
  // const [content, setContent] = useState<string>('')
  // const supabase = createClientComponentClient()
  // useEffect(() => {
  //   const getTranscriptData = async () => {
  //     const { data, error } = await supabase
  //       .from('transcript')
  //       .select()
  //       .eq('parent_transcript_id', transcriptId)

  //     if (data && data.length !== 0) {
  //       setContent(data[0].content)
  //     }
  //   }

  //   getTranscriptData()
  // }, [supabase, transcriptId])

  return (
    <div className="relative flex w-full cursor-text overflow-y-auto rounded-md bg-slate-50 p-2 outline-none outline outline-2 hover:bg-slate-100">
      <MarkdownRenderer markdownContent={content} />
    </div>
  )
}
