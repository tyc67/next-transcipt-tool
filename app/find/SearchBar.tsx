'use client'

import { useState } from 'react'
import { useSymbol, type Company } from '@/hooks/useSymbol'
import SearchInput from '@/components/ui/SearchInput'
import StockMenu from '@/components/ui/StockMenu'
import localforage from 'localforage'

interface SearchBarProps {
  onSelect: (item: string) => void
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [searchInput, setSearchInput] = useState<string>('')
  const [resultItems, setResultItems] = useState<Company[]>([])
  const [isDropDownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const [isRecentOpen, setIsRecentOpen] = useState<boolean>(false)
  const { stockSearch } = useSymbol()

  const handleSearch = (query: string) => {
    setIsRecentOpen(false)
    setIsDropdownOpen(true)
    const transformedQuery = query.trim().replace(/\s/g, '').toUpperCase()
    setSearchInput(transformedQuery)
    const result = stockSearch(transformedQuery)
    setResultItems(result)
  }
  const onFocus = async () => {
    try {
      const recentSymbols = (await localforage.getItem('recent-search')) as string[]
      const recentSearchItems = recentSymbols.reduce((acc, item) => {
        const answer = stockSearch(item)
        return acc.concat(answer)
      }, [] as Company[])

      setIsDropdownOpen(true)
      setResultItems(recentSearchItems)
      setIsRecentOpen(true)
    } catch (err: any) {
      throw new Error(err)
    }
  }
  const onBlur = () => {
    setIsDropdownOpen(false)
  }
  return (
    <div data-test-id="search-container" className="relative">
      <SearchInput
        value={searchInput}
        placeholder={'search any stock...'}
        onChange={(value) => handleSearch(value)}
        onFocus={onFocus}
      />
      {isDropDownOpen && resultItems.length !== 0 ? (
        <div className="absolute max-h-[300px] w-full overflow-y-auto border border-blue-500">
          {isRecentOpen ? (
            <p className="bg-gray-200 px-3 py-1 text-[10px]">Recent Searches</p>
          ) : null}
          <StockMenu items={resultItems} subitem={true} onSelect={onSelect} onBlur={onBlur} />
        </div>
      ) : null}
    </div>
  )
}
