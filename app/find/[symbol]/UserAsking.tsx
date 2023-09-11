import { useState } from 'react'
import TextArea from '@/components/ui/TextArea'
import IconButton from '@/components/ui/IconButton'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import Spinner from '@/components/ui/Spinner'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { useParams } from 'next/navigation'
import { useMultiDocument } from '@/hooks/useMultiDocument'
import { SupabaseTranscript } from '@/types/earnings'

export default function UserAsking({ queryList }: { queryList: SupabaseTranscript[] }) {
  const params = useParams()

  const [textareaValue, setTextareaValue] = useState<string>('')
  const {
    data: semanticSearchAnswer,
    error,
    isLoading,
    fetchQuestionAnswer,
    fetchAllDocs,
  } = useMultiDocument()

  const handleTextareaChange = (value: string) => {
    setTextareaValue(value)
  }

  const handleAskAi = () => {
    const questionDocuments = queryList.map((list) => ({
      symbol: list.symbol,
      transcriptId: list.parent_transcript_id,
      question: textareaValue,
    }))
    fetchAllDocs(questionDocuments)
  }

  return (
    <>
      <div
        data-test-id="qa-workspace"
        className="m-2 flex flex-col gap-2 rounded-md bg-gray-200 dark:bg-gray-600"
      >
        <div className="min-h-[100px] p-2">
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            semanticSearchAnswer?.map((data, idx) => (
              <div key={idx}>
                <p>-{data.symbol} :</p>
                <MarkdownRenderer markdownContent={data.answer} />
              </div>
            ))
          )}
        </div>
        <span className="m-0 flex flex-row gap-2 p-2">
          <TextArea value={textareaValue} onChange={handleTextareaChange} />
          <IconButton isLoading={isLoading} onClick={() => handleAskAi()}>
            <PaperAirplaneIcon className="h-5 w-5" />
          </IconButton>
        </span>
      </div>
    </>
  )
}
