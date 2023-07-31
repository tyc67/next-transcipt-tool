'use client'

import React from 'react'
import Spinner from './Spinner'

interface Props {
  color?: Apprentice.Colors
  color2?: Apprentice.Colors
  to?: string
  text?: string
  isSelected?: boolean
  isLoading: boolean
  calltoAction: () => void
}

export default React.memo(function CheckListButton({
  color = 'blue',
  color2,
  to,
  text = 'check transcriptList',
  isSelected,
  isLoading,
  calltoAction,
}: Props) {
  return (
    <div
      id="md-button"
      className={`text-md flex w-[15rem] min-w-[15rem] min-h-[1rem] max-h-[1.5rem] flex-row items-center  gap-4 whitespace-nowrap rounded-md px-4 ${
        isSelected
          ? `bg-${color}-600 hover:bg-${color}-700 text-white`
          : 'bg-white text-slate-600 hover:bg-slate-200 '
      }`}
      onClick={() => calltoAction()}
    >
      <div className="flex flex-row gap-1">
        <svg
          viewBox="0 0 16 16"
          className={`h-3 w-3 ${isSelected ? 'text-white' : `text-${color}-600`}`}
        >
          <circle cx={8} cy={8} r={8} fill="currentColor" />
        </svg>
        {/* <svg
          viewBox="0 0 16 16"
          className={`h-3 w-3 ${isSelected ? 'text-white opacity-70' : `text-${color2 ?? ''}-400`}`}
        >
          {color2 ? <circle cx={8} cy={8} r={8} fill="currentColor" /> : null}
        </svg> */}
      </div>
      <p className="w-full truncate text-left">{text}</p>
      {isLoading ? <Spinner /> : null}
    </div>
  )
})
