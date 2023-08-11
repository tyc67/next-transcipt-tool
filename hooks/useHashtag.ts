import { useState, useCallback } from 'react'
import { type HashtagRequest } from '@/app/hashtag-data/route'

export const useHashtag = () => {
  const [data, setData] = useState<any[] | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchHashtag = useCallback(async (query: HashtagRequest) => {
    try {
      setIsLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/hashtag-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      })
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`)
      }
      const responseData = await res.json()
      setData(responseData)
      return { ok: true, status: responseData.resStatus, message: 'hashtag updated' }
    } catch (err: any) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { data, error, isLoading, fetchHashtag }
}
