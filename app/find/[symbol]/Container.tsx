'use client'

import { useContext, useEffect, useState } from 'react'
import { SupabaseTranscript } from '@/types/earnings'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { TranscriptContext } from './TranscriptContext'
import GraphRevenueEarnings from '@/components/GraphRevenueEarnings'
import GraphConsensusEPS from '@/components/GraphConsensusEPS'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import BasicInfo from './BasicInfo'
import Brief from './Brief'
import UserAsking from './UserAsking'
import AddComparison from './AddComparison'
import { type TransformedDailyData, AlphaVantageApiResponseOverview } from '@/hooks/useAlphaVantage'
import { type GraphData } from '@/lib/getFinancialData'

interface ContainerProps {
  supabaseData: SupabaseTranscript[]
  alphaVantageData: {
    overview: AlphaVantageApiResponseOverview
    daily: TransformedDailyData
  }
  financialData: GraphData
}

export default function Container({
  supabaseData: earningsData,
  alphaVantageData,
  financialData,
}: ContainerProps) {
  const latestTranscript = earningsData.at(-1) || null
  const [selectedTranscript, setSelectedTranscript] = useState<SupabaseTranscript | null>(
    latestTranscript
  )
  const [semanticQueryList, setSemanticQueryList] = useState<SupabaseTranscript[]>([])
  const [semanticQueryStock, setSemanticQueryStock] = useState<string[]>([])
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const { transcript, setTranscript } = useContext(TranscriptContext)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchQueryData = async () => {
      const { data, error } = await supabase
        .from('transcript')
        .select()
        .in('symbol', semanticQueryStock)

      if (data) {
        data.sort((a, b) => a.symbol.localeCompare(b.symbol))
        setSemanticQueryList(data)
      }
    }
    if (semanticQueryStock) {
      fetchQueryData()
    }
  }, [semanticQueryStock, supabase])

  const handleSelectQueryStock = (item: string[]) => {
    setSemanticQueryStock(item)
  }

  return (
    <>
      <BasicInfo alphaVantageData={alphaVantageData} />
      <p className="mx-2 font-medium text-blue-500 text-opacity-90">Estimates</p>
      <div id="graph" className="flex flex-col md:flex-row">
        <div className="mx-2 mb-4 w-full bg-slate-50  dark:bg-gray-700 dark:text-slate-200 md:w-1/2">
          <GraphRevenueEarnings financialData={financialData} />
        </div>
        <div className="mx-2 mb-4 w-full bg-slate-50  dark:bg-gray-700 dark:text-slate-200 md:w-1/2">
          <GraphConsensusEPS financialData={financialData} />
        </div>
      </div>
      <span className="mb-2 flex flex-col md:flex-row md:items-center">
        <p className="mx-2 font-medium text-blue-500 text-opacity-90">Transcripts</p>
        <select
          data-test-id="transcript-select"
          className=" mx-2 w-[240px] overflow-y-hidden border border-gray-400 outline-none focus:border-blue-500 dark:bg-gray-600 dark:text-slate-200"
          onChange={(e) => {
            const selectedId = e.target.value
            const selectedData = earningsData.find((data) => data.id === selectedId)
            setSelectedTranscript(selectedData || null)
          }}
        >
          <option value={selectedTranscript?.id}>
            {selectedTranscript?.heading.split(',')[1]}
          </option>
          {earningsData
            .filter((data) => data.id !== selectedTranscript?.id)
            .map((data, idx) => (
              <option key={data.id} value={data.id}>
                {data.heading.split(',')[1]}
              </option>
            ))}
        </select>
      </span>
      <div className="flex flex-col md:flex-row">
        <div className="mx-2 mb-4 h-[300px] w-full overflow-y-auto bg-slate-50 dark:bg-gray-700 dark:text-slate-200 md:h-[600px] md:w-1/2">
          {selectedTranscript?.content ? (
            <div className="overflow-y-autop-4 cursor-text p-2">
              <MarkdownRenderer markdownContent={selectedTranscript.content} />
            </div>
          ) : null}
        </div>
        <div className="mx-2 mb-4 h-[300px] w-full overflow-y-auto bg-slate-50  dark:bg-gray-700  dark:text-slate-200 md:h-[600px] md:w-1/2 ">
          <div className="overflow-y-autop-4 cursor-text">
            <Brief transcriptId={selectedTranscript?.parent_transcript_id} />
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="mx-2 mb-4 w-full bg-slate-50 dark:bg-gray-700 dark:text-slate-200">
          <AddComparison onSelect={handleSelectQueryStock} />
          <p className="mx-2 font-semibold text-blue-500 text-opacity-90">Enter your question 👇</p>
          <UserAsking queryList={semanticQueryList} />
        </div>
      </div>
    </>
  )
}
