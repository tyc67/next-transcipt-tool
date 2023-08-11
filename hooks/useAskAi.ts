import { useState, useCallback } from 'react'
import { type VectorSearchRequest, VectorSearchResponse } from '../app/vector-search/route'

export const useAskAi = () => {
  const [data, setData] = useState<VectorSearchResponse | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // should i combine useAskAi and useQuestion hooks?

  const fetchQuestionAnswer = useCallback(async (query: VectorSearchRequest) => {
    try {
      setIsLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/vector-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      })
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`)
      }
      const responseData = await res.json()
      setData(responseData.data[0])
    } catch (err: any) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [])
  return { data, error, isLoading, fetchQuestionAnswer }
}
