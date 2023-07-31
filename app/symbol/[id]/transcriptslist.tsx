'use client'

import { supabaseTranscript } from '@/types/earnings'

interface TranscriptslistProps {
  earnigsData: supabaseTranscript[]
  transcriptId: string | undefined
  onSelect: (item: supabaseTranscript) => void
}

// co-locate components along with pages.tsx
export default function TranscriptList({
  earnigsData,
  transcriptId,
  onSelect,
}: TranscriptslistProps) {
  return (
    <>
      {earnigsData?.map((d: supabaseTranscript) => (
        <button
          key={d.id}
          onClick={() => onSelect(d)}
          className="flex w-full justify-items-start px-4"
        >
          <p
            className={`border-b-2 ${
              d.parent_transcript_id === transcriptId
                ? 'border-red-500'
                : 'border-gray-300 hover:border-gray-500'
            }`}
          >
            {d.heading}
          </p>
        </button>
      ))}
    </>
  )
}
