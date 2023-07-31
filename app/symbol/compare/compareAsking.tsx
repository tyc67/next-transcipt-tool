import { useEffect, useState } from 'react'
import TextArea from '@/components/ui/TextArea'
import IconButton from '@/components/ui/IconButton'
import { FireOutlined } from '@ant-design/icons'
import { supabaseTranscript } from '@/types/earnings'
import { useMultiDocument } from '@/hooks/useMultiDocument'

export default function CompareAsking({
  selectedTranscriptList,
  onAnswerChange,
}: {
  selectedTranscriptList: supabaseTranscript[]
  onAnswerChange: (data) => void
}) {
  const [textareaValue, setTextareaValue] = useState<string>('')
  const { data, error, isLoading, fetchQuestionAnswer, fetchAllDocs } = useMultiDocument()

  useEffect(() => {
    onAnswerChange(data)
  }, [data, onAnswerChange])

  const handleTextareaChange = (value: string) => {
    setTextareaValue(value)
  }

  const handleAskAi = () => {
    onAnswerChange(null)
    console.log('multiple docs reasoning...')
    const questionDocuments = selectedTranscriptList.map((list) => ({
      symbol: list.symbol,
      transcriptId: list.parent_transcript_id,
      question: textareaValue,
    }))
    fetchAllDocs(questionDocuments)
  }

  return (
    <>
      <div className="flex flex-col gap-2 p-2">
        <p className="py-2 font-semibold text-slate-900">
          Multiple docs QaReasoning WorkSpace, enter your question below
        </p>
        <span className="m-0 flex gap-2">
          <TextArea value={textareaValue} onChange={handleTextareaChange} />
          <IconButton isLoading={isLoading} onClick={() => handleAskAi()}>
            <FireOutlined />
          </IconButton>
        </span>
      </div>
    </>
  )
}
