'use client'

import { createContext, useState } from 'react'

export const TranscriptContext = createContext<any | null>(null)

export const TranscriptProvider = ({ children }: { children: any }) => {
  const [transcript, setTranscript] = useState('')

  return (
    <TranscriptContext.Provider value={{ transcript, setTranscript }}>
      {children}
    </TranscriptContext.Provider>
  )
}
