'use client'

import { createContext, useState } from 'react'

// interface TranscriptContext {
//     transcript: string
//     setTranscript: React.Dispatch<React.SetStateAction<string>>
//   }

export const TranscriptContext = createContext<TranscriptContext | null>(null)

export const TranscriptProvider = ({ children }: { children: any }) => {
  const [transcript, setTranscript] = useState('')

  return (
    <TranscriptContext.Provider value={{ transcript, setTranscript }}>
      {children}
    </TranscriptContext.Provider>
  )
}
