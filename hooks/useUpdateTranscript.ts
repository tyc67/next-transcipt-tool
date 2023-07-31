import { useState, useCallback } from 'react'

export const useUpdateTranscript = () => {
  const [data, setData] = useState<any[] | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const updateTranscript = useCallback(async (symbol: string) => {
    try {
      setIsLoading(true)
      const res = await fetch(`http://localhost:3000/ingest-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol }),
      })
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`)
      }
      const responseData = await res.json()
      console.log({ responseData })
      setData(responseData)
    } catch (err: any) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { data, error, isLoading, updateTranscript }
}
