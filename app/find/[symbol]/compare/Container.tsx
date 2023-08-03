'use client'

import { useState } from 'react'
import WorkSpace from '../Workspace'
import SearchInput from '@/components/ui/SearchInput'
import TranscriptList from '../TranscriptsList'
import { useTranscriptList } from '@/hooks/useTranscriptList'
import { supabaseTranscript } from '@/types/earnings'
import CompareAsking from './compareAsking'

export default function Container() {
  const [searchInput, setSearchInput] = useState<string>('')
  const [selectedTranscript, setSelectedTranscript] = useState<supabaseTranscript | null>(null)
  const [selectedTransciptList, setSelectedTranscriptList] = useState<supabaseTranscript[]>([])
  const { data: earningsData, error } = useTranscriptList(searchInput)

  const handleSelectedTranscript = (item: supabaseTranscript) => {
    setSelectedTranscript(item)
    const itemExists = selectedTransciptList.some(
      (selectedItem) => selectedItem.parent_transcript_id === item.parent_transcript_id
    )
    if (!itemExists) {
      setSelectedTranscriptList((prev) => [...prev, item])
    }
  }

  const handleRemoveItem = (item: string) => {
    setSelectedTranscriptList((prev) => prev.filter((data) => data.parent_transcript_id !== item))
  }

  return (
    <>
      <WorkSpace>
        <p className="p-2 font-semibold text-slate-900">
          choose the transcripts you want to compare
        </p>
        <SearchInput
          value={searchInput}
          placeholder={'search any stock...'}
          onChange={(value) => setSearchInput(value.trim().replace(/\s/g, '').toUpperCase())}
        />
        <TranscriptList
          data={earningsData}
          selectedItem={selectedTranscript?.parent_transcript_id}
          onSelect={handleSelectedTranscript}
        />
        <div className="flex flex-col gap-2 rounded-md bg-slate-50 p-2 hover:bg-slate-100">
          {selectedTransciptList.map((d: supabaseTranscript) => (
            <button key={d.id} onClick={() => handleRemoveItem(d.parent_transcript_id)}>
              <p className="border-gray-300 hover:border-b-2">{d.heading}</p>
            </button>
          ))}
        </div>
      </WorkSpace>
      <WorkSpace>
        <CompareAsking selectedTranscriptList={selectedTransciptList} />
      </WorkSpace>
    </>
  )
}
