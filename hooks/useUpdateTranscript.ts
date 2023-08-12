import { useState, useCallback } from 'react'

type IngestDataApiResponse = {
  symbol: string
}

export const useUpdateTranscript = () => {
  const [data, setData] = useState<IngestDataApiResponse | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const updateTranscript = useCallback(async (symbol: string) => {
    try {
      setIsLoading(true)
      const res = await fetch(`${window.location.origin}/ingest-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol }),
      })
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`)
      }
      const responseData: IngestDataApiResponse = await res.json()
      // console.log(responseData.symbol)
      setData(responseData)
      return { ok: true, message: 'updated', data: responseData }
    } catch (err: any) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { data, error, isLoading, updateTranscript }
}
