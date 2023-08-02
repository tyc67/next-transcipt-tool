import { useEffect, useState, useMemo } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const useTranscriptList = (symbol?: string) => {
  const supabase = createClientComponentClient()

  const [data, setData] = useState<any[] | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const memoizedData = useMemo(() => data, [data])
  
  useEffect(() => {
    const fetchTranscriptData = async () => {
      try {
        setIsLoading(true)
        const { data: transcriptData, error } = await supabase
          .from('transcript')
          .select()
          .eq('symbol', symbol)

        setData(transcriptData)
      } catch (err: any) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }
    if (symbol) {
      fetchTranscriptData()
    }
  }, [symbol, supabase])

  return { data: memoizedData, error, isLoading }
}
