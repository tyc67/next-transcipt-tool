import { useEffect, useState } from 'react'
import { type VectorSearchRequest } from '@/app/vector-search/route'

interface UseQuestionProps {
  symbol: string
  transcriptId: string
  questions: string[]
}

export const useQuestion = ({ symbol, transcriptId, questions }: UseQuestionProps) => {
  const [data, setData] = useState<any[] | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchQuestionAnswer = async ({ symbol, transcriptId, question }: VectorSearchRequest) => {
      try {
        setIsLoading(true)
        const res = await fetch(`${window.location.origin}/vector-search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbol, transcriptId, question }),
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
    }
    const fetchAllQuestions = async () => {
      try {
        setData(null)
        const results = await Promise.all(
          questions.map((question) => fetchQuestionAnswer({ symbol, transcriptId, question }))
        )
        setData(results)
      } catch (err: any) {
        setError(err)
      }
    }
    if (transcriptId) {
      fetchAllQuestions()
    }
  }, [symbol, transcriptId])

  // how to solve questions array as an dependency?
  // how to solve answer render lag?

  return { data, error, isLoading }
}
