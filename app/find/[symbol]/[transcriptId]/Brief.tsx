import React, { useEffect, useState } from 'react'
import Spinner from '@/components/ui/Spinner'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Brief({ transcriptId }: { transcriptId: string | undefined }) {
  const supabase = createClientComponentClient()
  const [companyKeypoint, setCompanyKeyPoint] = useState<string[] | null>(null)
  const [anaylistKeypoint, setAnaylistKeypoint] = useState<string[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getKeypoint = async () => {
      const { data } = await supabase
        .from('transcript')
        .select('keypoint_company,keypoint_analyst')
        .eq('parent_transcript_id', transcriptId)

      if (data && data.length !== 0) {
        setCompanyKeyPoint(JSON.parse(data[0].keypoint_company))
        setAnaylistKeypoint(JSON.parse(data[0].keypoint_analyst))
        setIsLoading(false)
      }
    }
    if (transcriptId) {
      setIsLoading(true)
      getKeypoint()
    }
  }, [supabase, transcriptId])

  // console.log('key-point: ', companyKeypoint?.length)
  // console.log({ transcriptId })

  return (
    <>
      {isLoading ? (
        <>
          <span className="item-center flex flex-row gap-2 p-2">
            <Spinner size="md" />
          </span>
        </>
      ) : null}
      {companyKeypoint ? (
        <div className="relative flex flex-col justify-between gap-2  p-2 shadow-sm">
          <p className="font-bold">what comapny said:</p>
          {companyKeypoint.map((d, idx) => (
            <p key={idx}>{d}</p>
          ))}
        </div>
      ) : null}
      {anaylistKeypoint ? (
        <div className="relative flex flex-col justify-between gap-2  p-2 shadow-sm">
          <p className="font-bold">what analyst said:</p>
          {anaylistKeypoint.map((d, idx) => (
            <p key={idx}>{d}</p>
          ))}
        </div>
      ) : null}
    </>
  )
}
