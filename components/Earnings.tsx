'use client'

import React, { useEffect, useState } from 'react'
import FixedHeightLayout from './ui/FixedHeightLayout'
import Input from './ui/Input'
import supabase from '@/utils/supabase'
import { PostgrestError } from '@supabase/supabase-js'
import MarkdownRenderer from './ui/MarkdownRenderer'
import { supabaseData } from '@/types/earnings'

const initialContent = {
  id: 'test-1',
  symbol: '',
  transcript: '',
}

export default React.memo(function EarningsCall() {
  const [content, setContent] = useState<supabaseData>(initialContent)
  const [fetchError, setFetchError] = useState<PostgrestError | null>(null)

  useEffect(() => {
    const fetchTranscript = async () => {
      if (content.symbol !== '') {
        const { data, error } = await supabase
          .from('transcripts')
          .select()
          .eq('symbol', content.symbol)
        if (error) {
          setFetchError(error)
          setContent(initialContent)
        }
        if (data?.length === 1) {
          setContent({ id: content.id, symbol: content.symbol, transcript: data[0]?.transcript })
          setFetchError(null)
        } else if (data?.length === 0) {
          setContent({ id: content.id, symbol: content.symbol, transcript: 'not found' })
          setFetchError(null)
        }
      }
    }
    fetchTranscript()
  }, [content.id, content.symbol])

  return (
    <>
      <FixedHeightLayout className="m-0 flex flex-1 flex-col gap-4 overflow-y-auto rounded-md bg-white p-4">
        <Input
          value={content.symbol}
          placeholder="symbol"
          onChange={(value) => {
            setContent({ id: content.id, symbol: value.trim(), transcript: content.transcript })
          }}
        />
        <h2 className="text-[1rem] font-[500] text-slate-600">Transcript</h2>
        <div className="relative flex w-full cursor-text rounded-md bg-slate-50 p-2 outline-none outline outline-2 hover:bg-slate-100">
          <MarkdownRenderer markdownContent={content.transcript} />
        </div>
      </FixedHeightLayout>
    </>
  )
})