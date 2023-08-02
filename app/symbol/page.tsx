'use client'

import { cookies } from 'next/headers'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSymbol, type Company } from '@/hooks/useSymbol'
import SearchInput from '@/components/ui/SearchInput'
import StockMenu from '@/components/ui/StockMenu'

export default function SymbolPage() {
  const router = useRouter()
  const [symbolInput, setSymbolInput] = useState<string>('')
  const [searchResult, setSearchResult] = useState<Company[]>([])
  const [isDropDown, setIsDropdown] = useState<boolean>(false)
  const { data: stockData, error, isLoading } = useSymbol()

  const handleSelect = (item: string) => {
    router.push(`/symbol/${item}`)
  }

  // TODO: edge case if query is ' '
  // TODO: recent search ?
  const handleSymbolSearch = (query: string) => {
    setIsDropdown(true)
    const transformedQuery = query.trim().replace(/\s/g, '').toUpperCase()
    setSymbolInput(transformedQuery)

    const results = []
    const stockSymbolMap = stockData?.hashMap
    for (const symbol in stockSymbolMap) {
      if (symbol.startsWith(transformedQuery)) {
        results.push({ symbol, company_name: stockSymbolMap[symbol] })
      }
    }
    results.sort((a, b) => a.symbol.localeCompare(b.symbol))
    setSearchResult(results)
  }
  console.log({isLoading})
  console.log(stockData)
  console.log({ symbolInput }, { searchResult })
  return (
    <div className="flex h-[100vh] w-full items-center justify-center bg-gray-100 p-2 text-slate-600">
      <div test-id="outer-contain">
        <div className="m-0 w-80">
          <SearchInput
            value={symbolInput}
            placeholder={'search any stock...'}
            onChange={(value) => handleSymbolSearch(value)}
          />
        </div>
        <div className="relative m-0 h-80 w-80 overflow-y-auto">
          {isDropDown ? <StockMenu items={searchResult} onSelect={handleSelect} /> : null}
        </div>
      </div>
    </div>
  )
}
