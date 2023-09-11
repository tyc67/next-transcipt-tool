import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSymbol, type Company } from '@/hooks/useSymbol'
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import StockMenu from '@/components/ui/StockMenu'

interface AddComparisonProps {
  onSelect: (list: string[]) => void
}

export default function AddComparison({ onSelect }: AddComparisonProps) {
  const placeholder = 'add company'
  const params = useParams()
  const [searchInput, setSearchInput] = useState<string>('')
  const [searchResult, setSearchResult] = useState<Company[]>([])
  const [isDropDownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const [selectedItemList, setSelectedItemList] = useState<string[]>([params.symbol])
  const { stockSearch } = useSymbol()

  useEffect(() => {
    onSelect(selectedItemList)
  }, [onSelect, selectedItemList])

  const handleSearch = (query: string) => {
    setIsDropdownOpen(true)
    const transformedQuery = query.trim().replace(/\s/g, '').toUpperCase()
    setSearchInput(transformedQuery)
    const result = stockSearch(transformedQuery)
    setSearchResult(result)
  }

  const handleAddCompany = (item: string) => {
    setIsDropdownOpen(!isDropDownOpen)
    const itemExists = selectedItemList.some((selectedItem) => selectedItem === item)
    if (!itemExists) {
      setSelectedItemList([...selectedItemList, item])
    }
  }

  const handleRemoveCompany = (item: string) => {
    setSelectedItemList((prev) => prev.filter((items) => items !== item))
  }

  const onBlur = () => {
    setIsDropdownOpen(false)
  }

  return (
    <span className="flex flex-row items-baseline gap-5 p-2">
      <div data-test-id="add-container" className="relative w-[150px]">
        <div className="flex w-fit items-center rounded-2xl border border-slate-400 bg-white focus-within:border-blue-500 dark:bg-gray-700">
          <input
            className=" w-[135px] bg-transparent px-4 py-1 outline-none "
            placeholder={placeholder}
            value={searchInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur()
              }
            }}
            onChange={(e) => {
              handleSearch(e.currentTarget.value)
            }}
          />
          <PlusCircleIcon className="ml-auto mr-2 h-5 w-5" />
        </div>
        {isDropDownOpen && searchResult.length !== 0 ? (
          <div className="absolute left-2 top-11 max-h-[150px] w-full overflow-y-auto border border-blue-500">
            <StockMenu
              items={searchResult}
              subitem={false}
              onSelect={handleAddCompany}
              onBlur={onBlur}
            />
          </div>
        ) : null}
      </div>
      <div data-test-id="select-items" className="flex flex-row gap-2 self-center">
        {selectedItemList.map((item, idx) => (
          <div key={idx} className="w-fit rounded-lg border px-2 text-sm">
            <span className="flex flex-row items-center space-x-2">
              <p>{item}</p>
              <XMarkIcon
                style={{ fontSize: '10px', width: '10px', height: '10px' }}
                onClick={() => handleRemoveCompany(item)}
              />
            </span>
          </div>
        ))}
      </div>
    </span>
  )
}
