'use client'

import { Metadata } from 'next'
import { useState } from 'react'
import TranscriptList from '../[id]/transcriptslist'
import FixedHeightLayout from '@/components/ui/FixedHeightLayout'
import { supabaseTranscript } from '@/types/earnings'
import { useTranscriptList } from '@/hooks/useTranscriptList'
import CompareAsking from './compareAsking'
import Input from '@/components/ui/Input'

// why metadata is not wokring as it expected ?
const metadata: Metadata = {
  title: `compare transcript`,
  description: 'earnings transcript',
}

export default function ComparePage() {
  const [compareInput, setCompareInput] = useState<string>('')
  const [selectedTranscript, setSelectedTranscript] = useState<supabaseTranscript | null>(null)
  const [selectedTransciptList, setSelectedTranscriptList] = useState<supabaseTranscript[]>([])
  const [aiAnswer, setAiAnswer] = useState(null)

  const { data: earningsData, error } = useTranscriptList(compareInput)

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

  const handleAnswerChange = (data) => {
    if (data) {
      setAiAnswer(data)
    }
  }

  // why render 5 times at initial entry?

  console.log(earningsData)
  console.log({ selectedTransciptList })
  console.log({ aiAnswer })

  return (
    <>
      <div className="flex h-[100vh] w-full flex-col gap-2 bg-gray-100 p-2 text-slate-600">
        <section className="flex flex-1 rounded-md bg-white p-2">
          <span className="flex flex-row items-center">
            <Input
              value={compareInput}
              placeholder={'search any stock...'}
              onChange={(value) => setCompareInput(value.trim().replace(/\s/g, '').toUpperCase())}
            />
          </span>
        </section>
        <section className="flex flex-row gap-2">
          <FixedHeightLayout className="m-0 flex flex-1 flex-col gap-4 overflow-y-auto rounded-md bg-white p-4">
            <div className=" max-h-[35%] min-h-[35%] overflow-y-auto p-2">
              <TranscriptList
                earnigsData={earningsData}
                transcriptId={selectedTranscript?.parent_transcript_id}
                onSelect={handleSelectedTranscript}
              />
            </div>
            <div className="relative flex w-full cursor-text flex-col gap-2 overflow-y-auto rounded-md bg-slate-50 p-2 outline-none outline outline-2 hover:bg-slate-100">
              {selectedTransciptList.map((d: supabaseTranscript) => (
                <button key={d.id} onClick={() => handleRemoveItem(d.parent_transcript_id)}>
                  <p className="border-gray-300 hover:border-b-2">{d.heading}</p>
                </button>
              ))}
            </div>
          </FixedHeightLayout>
          <FixedHeightLayout className="m-0 flex flex-1 flex-col gap-4 rounded-md bg-white p-4">
            <div className=" max-h-[35%] min-h-[35%] overflow-y-auto p-2">
              <CompareAsking
                selectedTranscriptList={selectedTransciptList}
                onAnswerChange={handleAnswerChange}
              />
            </div>
            <div className="relative flex w-full cursor-text flex-col overflow-y-auto rounded-md bg-slate-50 p-2 outline-none outline outline-2 hover:bg-slate-100">
              {aiAnswer?.map((data, idx) => (
                <div key={idx} className="rounded-md p-2 outline-none hover:bg-slate-100">
                  <p>-{data.symbol}:</p>
                  <p>{data.answer}</p>
                </div>
              ))}
            </div>
          </FixedHeightLayout>
        </section>
      </div>
    </>
  )
}
