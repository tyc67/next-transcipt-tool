import Input from '@/components/ui/Input'
import IconButton from '@/components/ui/IconButton'
import { FireOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useHashtag } from '@/hooks/useHashtag'

interface HashtagProps {
  topics: string
  transcriptId: string
}

export default function HashtagManager({ topics, transcriptId }: HashtagProps) {
  const keyPoints = topics.split('\n')

  const [hashtagInput, setHashtagInput] = useState<string>('')
  const { isLoading, fetchHashtag } = useHashtag()

  const handleInputChange = (value: string) => {
    setHashtagInput(value.trim().toLocaleLowerCase())
  }

  const handleCreateHashtag = async () => {
    const res = await fetchHashtag({ transcriptId, hashtagInput })
    // is undefined type correct?
    console.log(res)
    if (res?.ok) {
      setHashtagInput('')
    }
  }

  return (
    <>
      <div className="h-[70%] overflow-y-auto rounded-md bg-slate-50 p-2 hover:bg-slate-100">
        <p>create hashtag for quarter earnings call transcript</p>
        {keyPoints.map((d, idx) => (
          <p key={idx}>{d}</p>
        ))}
      </div>
      <span className="m-0 flex flex-col gap-2">
        <p className="py-2 font-semibold text-slate-900">Hashtag Manager</p>
        <span className="flex flex-row gap-2">
          <Input
            value={hashtagInput}
            placeholder="assign hashtag here"
            onChange={handleInputChange}
          />
          <IconButton isLoading={isLoading} onClick={handleCreateHashtag}>
            <FireOutlined />
          </IconButton>
        </span>
      </span>
    </>
  )
}
