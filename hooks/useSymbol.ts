import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface SymbolMap {
  [key: string]: string
}

export interface Company {
  symbol: string
  company_name: string
}

interface SymbolData {
  company: Company[]
  hashMap: SymbolMap
}

export const useSymbol = () => {
  const supabase = createClientComponentClient()
  const [data, setData] = useState<SymbolData | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchSymbolData = async () => {
      try {
        setIsLoading(true)
        const { data: companyData, error } = await supabase
          .from('transcript')
          .select('symbol,company_name')

        const removedDuplicateData = companyData?.filter((item, index, array) => {
          return (
            index ===
            array.findIndex(
              (obj) => obj.symbol === item.symbol && obj.company_name === item.company_name
            )
          )
        })

        // how to solve undefined problem?
        const hashMap: SymbolMap = removedDuplicateData?.reduce((acc, item) => {
          acc[item.symbol] = item.company_name
          return acc
        }, {} as SymbolMap)

        setData({ company: removedDuplicateData, hashMap })
      } catch (err: any) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSymbolData()
  }, [supabase])

  return { data, error, isLoading }
}
