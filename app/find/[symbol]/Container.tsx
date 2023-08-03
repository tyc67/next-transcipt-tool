'use client'

import { useContext, useState } from 'react'
import { supabaseTranscript } from '@/types/earnings'
import { useParams, usePathname, useRouter } from 'next/navigation'
import WorkSpace from './Workspace'
import TranscriptList from './TranscriptsList'
import { TranscriptContext } from './TranscriptContext'

export default function Container({
  supabaseData: earningsData,
}: {
  supabaseData: supabaseTranscript[]
}) {
  const [selectedTranscript, setSelectedTranscript] = useState<supabaseTranscript | null>(null)
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const { transcript, setTranscript } = useContext(TranscriptContext)

  const handleSelectedTranscript = (item: supabaseTranscript) => {
    setSelectedTranscript(item)
    setTranscript(item.parent_transcript_id)
    const subroute = item.parent_transcript_id.split('-')[0]
    router.push(`${pathname}/${subroute}`)
  }

  // console.log({ earningsData })

  return (
    <>
      <WorkSpace>
        <TranscriptList
          data={earningsData}
          selectedItem={selectedTranscript?.parent_transcript_id}
          onSelect={handleSelectedTranscript}
        />
      </WorkSpace>
      <WorkSpace>
        <p>Graph Area Yahoo finance</p>
      </WorkSpace>
    </>
  )
}
