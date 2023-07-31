import { useState, useEffect } from 'react'

interface InputProps {
  value: string
  placeholder: string
  isReadOnly?: boolean
  onChange: (value: string) => void
}

export default function SearchInput({ value, placeholder, isReadOnly, onChange }: InputProps) {
  const [draft, setDraft] = useState(value)
  useEffect(() => {
    setDraft(value)
  }, [value])
  return (
    <input
      className="w-full rounded-md bg-slate-200 px-4 py-2 text-slate-600 outline-none focus:bg-white"
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
    />
  )
}
