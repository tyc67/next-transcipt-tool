import { supabaseTranscript } from '@/types/earnings'

interface TranscriptslistProps {
  data: supabaseTranscript[]
  selectedItem: string | undefined
  onSelect: (item: supabaseTranscript) => void
}

export default function TranscriptList({
  data,
  selectedItem,
  onSelect,
}: TranscriptslistProps) {
  return (
    <>
      {data?.map((d: supabaseTranscript) => (
        <button
          key={d.id}
          onClick={() => onSelect(d)}
          className="flex w-full justify-items-start px-4"
        >
          <p
            className={`border-b-2 ${
              d.parent_transcript_id === selectedItem
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
