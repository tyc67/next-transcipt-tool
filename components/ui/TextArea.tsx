import * as React from 'react'

interface TextAreaProps {
  defaultValue?: string
  value?: string
  placeholder?: string
  isReadOnly?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onMouseUp?: (e: React.MouseEvent<HTMLTextAreaElement>) => void
  onChange?: (value: string) => void
}

export default function TextArea({
  placeholder,
  defaultValue,
  isReadOnly,
  value,
  onChange,
  onKeyDown,
  onMouseUp,
}: TextAreaProps) {
  const [height, setHeight] = React.useState(0)
  const el = React.useRef<HTMLTextAreaElement | null>(null)

  React.useEffect(() => {
    if (el.current != null) {
      setHeight(el.current.scrollHeight)
    }
  }, [])

  return (
    <textarea
      ref={el}
      style={{ height }}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onKeyDown={onKeyDown}
      onMouseUp={onMouseUp}
      disabled={isReadOnly}
      onInput={() => {
        if (el.current != null) {
          setHeight(el.current.scrollHeight)
        }
      }}
      value={value}
      onChange={(e) => onChange?.(e.currentTarget.value)}
      className={`h-[auto] w-full rounded-md bg-slate-100 p-2 text-slate-600 outline-none focus:bg-slate-200 ${
        isReadOnly ? 'cursor-not-allowed' : ''
      }`}
    />
  )
}
