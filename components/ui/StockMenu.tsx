import { useState, useEffect, useRef } from 'react'
import { key } from '@/utils/keyEvent'
import { Company } from '@/hooks/useSymbol'

interface Props {
  items: Company[]
  onSelect: (item: string) => void
}

export default function StockMenu({ items, onSelect }: Props) {
  const menu = useRef<HTMLUListElement | null>(null)
  const [index, setIndex] = useState<number>(0)
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1)
  const themeColor = 'gray'
  const options = items

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const keyHash = key(e)
      switch (keyHash) {
        case 'ArrowUp':
          e.preventDefault()
          setIndex(index - 1 < 0 ? options.length - 1 : index - 1)
          setHoveredIndex(index - 1 < 0 ? options.length - 1 : index - 1)
          break
        case 'ArrowDown':
          e.preventDefault()
          setIndex(index + 1 >= options.length ? 0 : index + 1)
          setHoveredIndex(index + 1 >= options.length ? 0 : index + 1)
          break
        case 'Enter':
          e.preventDefault()
          onSelect(options[index].symbol)
          break
        case 'Escape':
          e.stopPropagation()
          console.log('leave menu')
          break
      }
    }

    menu.current.tabIndex = 0
    menu.current?.addEventListener('keydown', handleKey)
    return () => {
      menu.current?.removeEventListener('keydown', handleKey)
    }
  }, [index, onSelect, options])

  const handleItemHover = (idx: number) => {
    setIndex(idx)
    setHoveredIndex(idx)
  }

  return (
    <>
      <ul ref={menu} className="relative flex flex-col gap-1 bg-white p-2">
        {options.map((data, idx) => (
          <li
            key={idx}
            onClick={() => onSelect(data.symbol)}
            onMouseEnter={() => handleItemHover(idx)}
            onMouseLeave={() => handleItemHover(-1)}
            className={`cursor-pointer p-1 ${
              index === idx || hoveredIndex === idx ? 'bg-gray-200' : ''
            }`}
          >
            <span className="flex flex-row items-baseline gap-2">
              <p className="w-1/5 text-lg font-semibold">{data.symbol}</p>
              <p className="w-4/5 text-sm font-light">{data.company_name}</p>
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}
