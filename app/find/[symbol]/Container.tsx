'use client'

import { useContext, useState } from 'react'
import { supabaseTranscript } from '@/types/earnings'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { TranscriptContext } from './TranscriptContext'
import WorkSpace from '../../../components/Workspace'
import TranscriptList from './TranscriptsList'
import GraphRevenueEarnings from '@/components/GraphRevenueEarnings'
import GraphConsensusEPS from '@/components/GraphConsensusEPS'
import CheckListButton from '@/components/ui/CheckListButton'
import { useUpdateTranscript } from '@/hooks/useUpdateTranscript'

const dataTSM = {
  annual: [
    { period: '2019', revenue: 1069988843, earning: 345263668 },
    { period: '2020', revenue: 1339238429, earning: 517885387 },
    { period: '2021', revenue: 1587415037, earning: 588918059 },
    { period: '2022', revenue: 2263891292, earning: 1016530249 },
  ],
  quarterly: [
    { period: '3Q2022', revenue: 613142743, earning: 280865780 },
    { period: '4Q2022', revenue: 625530000, earning: 295904000 },
    { period: '2Q2023', revenue: 508632973, earning: 206986561 },
    { period: '3Q2023', revenue: 480841000, earning: 181799000 },
  ],
}

const dataAMD = {
  annual: [
    { period: '2019', revenue: 6731000, earning: 341000 },
    { period: '2020', revenue: 9763000, earning: 2490000 },
    { period: '2021', revenue: 16434000, earning: 3162000 },
    { period: '2022', revenue: 23601000, earning: 1320000 },
  ],
  quarterly: [
    { period: '4Q2022', revenue: 5565000, earning: 66000 },
    { period: '1Q2023', revenue: 5599000, earning: 21000 },
    { period: '2Q2023', revenue: 5353000, earning: -139000 },
    { period: '3Q2023', revenue: 5359000, earning: 27000 },
  ],
  eps: [
    { period: '4Q2022', actual: 0.69, estimate: 0.67 },
    { period: '1Q2023', actual: 0.6, estimate: 0.56 },
    { period: '2Q2023', actual: 0.58, estimate: 0.57 },
    { period: '3Q2023', actual: null, estimate: 0.68 },
  ],
}

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
  const { isLoading, updateTranscript } = useUpdateTranscript()

  const handleSelectedTranscript = (item: supabaseTranscript) => {
    setSelectedTranscript(item)
    setTranscript(item.parent_transcript_id)
    const subroute = item.parent_transcript_id.split('-')[0]
    router.push(`${pathname}/${subroute}`)
  }

  const handleUpdateAction = async () => {
    const response = await updateTranscript(params.symbol)
    if (response?.ok) {
      router.refresh()
    }
  }

  // console.log({ earningsData })

  return (
    <>
      <WorkSpace>
        <div className="px-4 text-slate-900">
          <span className="flex flex-row items-baseline">
            <p className="mr-3 py-2 text-3xl font-semibold">{params.symbol}</p>
            <p className="text-base">Apple Inc.</p>
            <div className="ml-auto">
              <CheckListButton
                isLoading={isLoading}
                calltoAction={handleUpdateAction}
                text="update"
                color="blue"
              />
            </div>
          </span>
          <span className="flex flex-row items-baseline gap-2">
            <p className="text-2xl">$177.87</p>
            <p className="text-sm text-red-500">-0.22 (-0.12%)</p>
            <p className="text-[10px] text-slate-500">4:00 PM 08/10/23</p>
          </span>
        </div>
        <TranscriptList
          data={earningsData}
          selectedItem={selectedTranscript?.parent_transcript_id}
          onSelect={handleSelectedTranscript}
        />
      </WorkSpace>
      <WorkSpace>
        <div className="h-1/2 w-2/3 overflow-y-hidden">
          <GraphRevenueEarnings financialData={dataAMD} />
        </div>
        <div className="h-1/2 w-2/3 overflow-y-hidden">
          <GraphConsensusEPS financialData={dataAMD} />
          {/* <p>Revenue & Expenses Breakdown</p>
          <p>Multiples</p>
          <p>Actuals & Forward Estimates</p> */}
        </div>
      </WorkSpace>
    </>
  )
}
