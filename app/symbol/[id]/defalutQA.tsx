'use client'

import React, { useEffect, useState } from 'react'
import Spinner from '@/components/ui/Spinner'
import { basicQuestions } from '@/lib/basic-question'
import { useQuestion } from '@/hooks/useQuestion'
import { useRouter } from 'next/navigation'

export default function DefaultQA({
  symbol,
  transcriptId,
}: {
  symbol: string
  transcriptId: string | undefined
}) {
  console.log('defaultQA component:', { symbol }, { transcriptId })

  // const router = useRouter()
  const questions = [basicQuestions[0], basicQuestions[1]]
  const { data: preSummary, error, isLoading } = useQuestion({ symbol, transcriptId, questions })

  return (
    <>
      <div className="relative flex flex-col justify-between gap-2  p-2 shadow-sm">
        {isLoading ? (
          <>
            <span className="item-center flex flex-row gap-2 p-2">
              <p className="text-sm">Creating vector-search result brief ,be patient...</p>
              <Spinner size="md" />
            </span>
          </>
        ) : null}
        {preSummary
          ? preSummary?.map((d, idx: number) => (
              <div key={idx}>
                <p className="font-bold">{d.question}</p>
                <p>-{d.answer}</p>
              </div>
            ))
          : null}
      </div>
    </>
  )
}
