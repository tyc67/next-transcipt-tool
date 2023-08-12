import { useState, useCallback } from 'react'
import { type VectorSearchRequest } from '../app/vector-search/route'

export const useMultiDocument = () => {
  const [data, setData] = useState<any[] | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchQuestionAnswer = useCallback(async (query: VectorSearchRequest) => {
    try {
      setIsLoading(true)
      const res = await fetch(`${window.location.origin}/vector-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      })
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`)
      }
      const responseData = await res.json()
      return responseData.data[0]
    } catch (err: any) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchAllDocs = useCallback(
    async (documents: VectorSearchRequest[]) => {
      try {
        setData(null)
        const results = await Promise.all(
          documents.map((doc: VectorSearchRequest) =>
            fetchQuestionAnswer({
              symbol: doc.symbol,
              transcriptId: doc.transcriptId,
              question: doc.question,
            })
          )
        )
        setData(results)
      } catch (err: any) {
        setError(err)
      }
    },
    [fetchQuestionAnswer]
  )

  return { data, error, isLoading, fetchQuestionAnswer, fetchAllDocs }
}
