'use client'

import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useSymbol, type Company } from '@/hooks/useSymbol'
import SearchInput from '@/components/ui/SearchInput'
import StockMenu from '@/components/ui/StockMenu'

export default function SearchBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [searchInput, setSearchInput] = useState<string>('')
  const [searchResult, setSearchResult] = useState<Company[]>([])
  const [isDropDown, setIsDropdown] = useState<boolean>(false)
  const { data: stockData, error, isLoading } = useSymbol()

  const handleSelect = (item: string) => {
    router.push(`${pathname}/${item}`)
  }

  const handleSearch = (query: string) => {
    setIsDropdown(true)
    const transformedQuery = query.trim().replace(/\s/g, '').toUpperCase()
    setSearchInput(transformedQuery)

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
  // console.log({ isLoading })
  // console.log(stockData)
  // console.log({ searchInput }, { searchResult })

  return (
    <div className="flex h-[100vh] w-full items-center justify-center bg-gray-100 p-2 text-slate-600">
      <div test-id="outer-contain">
        <div className="m-0 w-80">
          <SearchInput
            value={searchInput}
            placeholder={'search any stock...'}
            onChange={(value) => handleSearch(value)}
          />
        </div>
        <div className="relative m-0 h-80 w-80 overflow-y-auto">
          {isDropDown ? <StockMenu items={searchResult} onSelect={handleSelect} /> : null}
        </div>
      </div>
    </div>
  )
}
