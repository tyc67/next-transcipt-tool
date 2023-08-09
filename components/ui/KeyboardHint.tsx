import React from 'react'

export default React.memo(function KeyboardHint({ children }: React.PropsWithChildren) {
  return (
    <kbd className="min-w-[1.5rem] cursor-default rounded-md border-b-4 bg-white p-1 px-2 text-center hover:border-none">
      {children}
    </kbd>
  )
})
