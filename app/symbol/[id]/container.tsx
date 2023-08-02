'use client'

import { useState } from 'react'
import FixedHeightLayout from '@/components/ui/FixedHeightLayout'
import CheckListButton from '@/components/ui/CheckListButton'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import RealtimePosts from './realtime-posts'
import TranscriptList from './transcriptslist'
import { supabaseTranscript } from '@/types/earnings'
import { useRouter } from 'next/navigation'
import Brief from './Brief'
import UserAsking from '@/app/symbol/[id]/UserAsking'
import { useUpdateTranscript } from '@/hooks/useUpdateTranscript'

//TODO: waht is SSL/TLS handshake?

export default function ContainerTest({
  supabaseData: earningsData,
  symbol,
}: {
  supabaseData: supabaseTranscript[]
  symbol: string
}) {
  const [selectedTranscript, setSelectedTranscript] = useState<supabaseTranscript | null>(null)
  const router = useRouter()
  const { isLoading, updateTranscript } = useUpdateTranscript()

  const handleSelectedTranscript = (item: supabaseTranscript) => {
    setSelectedTranscript(item)
  }

  const handleCompare = () => {
    router.push('/symbol/compare')
  }

  // do i really need this button function? maybe handle this action in CI/CD phases.
  const handleCheckingAction = async () => {
    console.log('checking and up-to-date')
    const response = await updateTranscript(symbol)
    if (response?.ok) {
      router.refresh()
      // how to control only re-render list component?
    }
  }

  return (
    <>
      <main className="flex h-[100vh] w-full flex-col gap-2 bg-gray-100 p-2 text-slate-600">
        <section className="flex flex-1 rounded-md bg-white p-2">
          <span className="flex flex-row items-center">
            <p className="px-4 py-2 text-xl text-slate-900">{symbol}</p>
            <CheckListButton isLoading={isLoading} calltoAction={handleCheckingAction} />
            <div
              className="text-md flex flex-row items-center  gap-4 whitespace-nowrap rounded-md bg-white px-4 hover:bg-slate-200"
              onClick={() => handleCompare()}
            >
              <svg viewBox="0 0 16 16" className="h-3 w-3  text-red-600">
                <circle cx={8} cy={8} r={8} fill="currentColor" />
              </svg>
              <p className="w-full truncate text-left">comparing</p>
            </div>
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
              {/* <RealtimePosts serverPosts={earningsData} /> */}
            </div>
            <div className="relative flex w-full cursor-text overflow-y-auto rounded-md bg-slate-50 p-2 outline-none outline outline-2 hover:bg-slate-100">
              <MarkdownRenderer markdownContent={selectedTranscript?.content} />
            </div>
          </FixedHeightLayout>
          <FixedHeightLayout className="m-0 flex flex-1 flex-col gap-4 rounded-md bg-white p-4">
            <div className=" max-h-[35%] min-h-[35%] overflow-y-auto p-2">
              <UserAsking symbol={symbol} transcriptId={selectedTranscript?.parent_transcript_id} />
            </div>
            <div className="relative flex w-full cursor-text flex-col overflow-y-auto rounded-md bg-slate-50 p-2 outline-none outline outline-2 hover:bg-slate-100">
              <Brief transcriptId={selectedTranscript?.parent_transcript_id} />
            </div>
          </FixedHeightLayout>
        </section>
      </main>
    </>
  )
}
