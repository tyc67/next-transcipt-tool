import React from 'react'
import Spinner from './Spinner'

/**
 * A simple icon button component, the children is a single Ant Icon component.
 */

export const noop = () => {}

export default function IconButton({
  children,
  onClick,
  isLoading,
}: React.PropsWithChildren<{
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  isLoading?: boolean
}>) {
  return (
    <button
      className="fxc flex h-[2rem] w-[2rem] min-w-[2rem] cursor-pointer items-center justify-center rounded-md bg-slate-100 text-[1rem] text-slate-600 hover:bg-slate-200 hover:text-slate-700 active:text-slate-800"
      onClick={isLoading ? noop : onClick}
    >
      {isLoading ? <Spinner size="sm" /> : children}
    </button>
  )
}
