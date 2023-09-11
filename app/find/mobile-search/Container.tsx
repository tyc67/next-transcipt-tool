'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import SearchInput from '@/components/ui/SearchInput'
import { useSymbol, type Company } from '@/hooks/useSymbol'
import localforage from 'localforage'

export default function Container() {
  const router = useRouter()
  const [searchInput, setSearchInput] = useState<string>('')
  const [resultItems, setResultItems] = useState<Company[]>([])
  const [isRecentOpen, setIsRecentOpen] = useState<boolean>(false)
  const { stockSearch } = useSymbol()

  const handleSearch = (query: string) => {
    setIsRecentOpen(false)
    const transformedQuery = query.trim().replace(/\s/g, '').toUpperCase()
    setSearchInput(transformedQuery)
    const result = stockSearch(transformedQuery)
    setResultItems(result)
  }

  const onSelect = async (item: string) => {
    router.push(`/find/${item}`)
    try {
      const recentSearches = ((await localforage.getItem('recent-search')) as string[]) || []
      if (!recentSearches.includes(item)) {
        recentSearches.push(item)
      }
      if (recentSearches.length > 5) {
        recentSearches.shift()
      }
      await localforage.setItem('recent-search', recentSearches)
    } catch (err: any) {
      throw new Error(err)
    }
  }

  const onFocus = async () => {
    try {
      const recentSymbols = (await localforage.getItem('recent-search')) as string[]
      const recentSearchItems = recentSymbols.reduce((acc, item) => {
        const answer = stockSearch(item)
        return acc.concat(answer)
      }, [] as Company[])
      setResultItems(recentSearchItems)
      setIsRecentOpen(true)
    } catch (err: any) {
      throw new Error(err)
    }
  }
  return (
    <div className="h-screen w-screen bg-gray-300">
      <div className="inline-flex h-[60px] w-full items-center px-3 text-gray-700">
        <SearchInput
          value={searchInput}
          placeholder={'search any stock...'}
          onChange={(value) => handleSearch(value)}
          onFocus={onFocus}
        />
        <button className="ml-auto border-none" onClick={() => router.back()}>
          Cancel
        </button>
      </div>
      <div className="text-gray-700">
        {isRecentOpen ? <p className="bg-gray-400 px-4 py-1 text-xs">Recent Searches</p> : null}
        <ul>
          {resultItems.map((data, idx) => (
            <li key={idx} className="cursor-pointer p-1" onClick={() => onSelect(data.symbol)}>
              <span className="inline-flex w-full gap-2 px-4 py-1">
                <p className="w-1/4">{data.symbol}</p>
                <p className="w-full">{data.company_name}</p>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
