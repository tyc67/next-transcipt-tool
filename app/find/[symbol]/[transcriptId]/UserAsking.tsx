import { useEffect, useState } from 'react'
import TextArea from '@/components/ui/TextArea'
import IconButton from '@/components/ui/IconButton'
import { FireOutlined } from '@ant-design/icons'
import { useAskAi } from '@/hooks/useAskAi'
import { useParams } from 'next/navigation'
import { type VectorSearchRequest, VectorSearchResponse } from '@/app/vector-search/route'

interface UserAskAiProps {
  transcriptId: VectorSearchRequest['transcriptId']
}

export default function UserAsking({ transcriptId }: UserAskAiProps) {
  const params = useParams()
  const symbol = params.symbol
  const [textareaValue, setTextareaValue] = useState<string>('')
  const [aiAnswer, setAiAnswer] = useState<VectorSearchResponse | null>(null)
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
    fetchQuestionAnswer({ symbol, transcriptId, question: textareaValue })
  }

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
