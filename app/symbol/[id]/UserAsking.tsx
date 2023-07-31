import { useEffect, useState } from 'react'
import TextArea from '@/components/ui/TextArea'
import IconButton from '@/components/ui/IconButton'
import { FireOutlined } from '@ant-design/icons'
import { Qalist, useAskAi } from '@/hooks/useAskAi'

interface UserAskAiProps {
  symbol: string
  transcriptId: string | undefined
}

export default function UserAsking({ symbol, transcriptId }: UserAskAiProps) {
  const [textareaValue, setTextareaValue] = useState<string>('')
  const [aiAnswer, setAiAnswer] = useState<Qalist | null>(null)
  const { data, error, isLoading, fetchQuestionAnswer } = useAskAi()

  useEffect(() => {
    setTextareaValue('')
    setAiAnswer(null)
  }, [transcriptId])

  useEffect(() => {
    setAiAnswer(data)
  }, [data])

  const handleTextareaChange = (value: string) => {
    setTextareaValue(value)
  }

  const handleAskAi = () => {
    console.log('iconbutton fire!')
    fetchQuestionAnswer({ symbol, transcriptId, question: textareaValue })
  }
  console.log({ textareaValue }, { data })

  return (
    <>
      <div className="flex flex-col gap-2 p-2"> 
        <p className="py-2 font-semibold text-slate-900">
          QaReasoning WorkSpace, enter your question below
        </p>
        <span className="m-0 flex gap-2">
          <TextArea value={textareaValue} onChange={handleTextareaChange} />
          <IconButton isLoading={isLoading} onClick={() => handleAskAi()}>
            <FireOutlined />
          </IconButton>
        </span>
        <p className="rounded-md p-2 outline-none hover:bg-slate-100">{aiAnswer?.answer}</p>
      </div>
    </>
  )
}
