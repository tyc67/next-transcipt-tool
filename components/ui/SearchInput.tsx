import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface InputProps {
  value: string
  placeholder: string
  isReadOnly?: boolean
  onChange: (value: string) => void
  onFocus: () => void
}

export default function SearchInput({
  value,
  placeholder,
  isReadOnly,
  onChange,
  onFocus,
}: InputProps) {
  const [draft, setDraft] = useState(value)
  useEffect(() => {
    setDraft(value)
  }, [value])
  return (
    <div className="flex items-center border border-slate-400 bg-white focus-within:border-blue-500 dark:bg-gray-600 dark:text-slate-300">
      <input
        className="bg-transparent px-4 py-2 placeholder-gray-400 outline-none "
        placeholder={placeholder}
        disabled={isReadOnly}
        value={draft}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur()
          }
        }}
        onChange={(e) => {
          onChange(e.currentTarget.value)
        }}
        onBlur={(e) => {
          const value = e.currentTarget.value ?? ''
          setDraft(value)
        }}
        onFocus={() => onFocus()}
      />
      <MagnifyingGlassIcon className="ml-auto mr-2 h-5 w-5" />
    </div>
  )
}
