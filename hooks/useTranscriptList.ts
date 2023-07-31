import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const useTranscriptList = (id: string) => {
  const supabase = createClientComponentClient()

  const [data, setData] = useState<any[] | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchTranscriptData = async () => {
      try {
        setIsLoading(true)
        const { data: transcriptData, error } = await supabase
          .from('transcript')
          .select()
          .eq('symbol', id)

        setData(transcriptData)
      } catch (err: any) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTranscriptData()
  }, [id, supabase])

  return { data, error, isLoading }
}
