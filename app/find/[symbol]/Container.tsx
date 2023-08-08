'use client'

import { useContext, useState } from 'react'
import { supabaseTranscript } from '@/types/earnings'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { TranscriptContext } from './TranscriptContext'
import WorkSpace from './Workspace'
import TranscriptList from './TranscriptsList'
import GraphRevenueEarnings from '@/components/GraphRevenueEarnings'
import GraphConsensuEPS from '@/components/GraphConsensuEPS'

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
        <p>Financial Graph Area</p>
        <GraphRevenueEarnings financialData={dataAMD} />
        <GraphConsensuEPS />

        <p>Revenue & Expenses Breakdown</p>
        <p>Multiples</p>
        <p>Actuals & Forward Estimates</p>
      </WorkSpace>
    </>
  )
}
