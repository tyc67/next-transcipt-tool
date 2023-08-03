'use client'

import WorkSpace from '../Workspace'
import Transcript from './Transcript'
import UserAsking from './UserAsking'
import Brief from './Brief'
import HashtagManager from './HashtagManager'
import { TranscriptContext } from '../TranscriptContext'
import { useContext, useState } from 'react'

interface ContainerProps {
  selectedTranscriptContent: string
  selectedTranscriptId: string
  selectedTranscriptTopics: string
  selectedTranscriptHashTag: string[]
}

export default function Container({
  selectedTranscriptContent,
  selectedTranscriptId,
  selectedTranscriptTopics,
  selectedTranscriptHashTag,
}: ContainerProps) {
  const { transcript, setTranscript } = useContext(TranscriptContext)
  console.log('transcriptId_Context:', transcript)
  console.log('transcriptId_ServerComponent:', selectedTranscriptId)

  const [hashTab, setHashTab] = useState(false)

  console.log(selectedTranscriptHashTag)
  return (
    <>
      <WorkSpace>
        <p>fetch data in server component</p>
        <div className="flex flex-row gap-2">
          {selectedTranscriptHashTag?.map((tag, idx) => (
            <div key={idx} className="rounded-md text-sm bg-yellow-200 p-1">
              {tag}
            </div>
          ))}
        </div>
        <Transcript content={selectedTranscriptContent} />
      </WorkSpace>
      <WorkSpace>
        <span className="flex flex-row gap-4">
          <p>fetch data in client component</p>
          <div
            className="cursor-pointer rounded-md bg-slate-300 px-2"
            onClick={() => setHashTab(!hashTab)}
          >
            hashtag
          </div>
        </span>
        {hashTab ? (
          <HashtagManager topics={selectedTranscriptTopics} transcriptId={selectedTranscriptId} />
        ) : (
          <>
            <div className=" max-h-[60%] min-h-[60%] overflow-y-auto rounded-md bg-slate-50 p-2  hover:bg-slate-100">
              <Brief transcriptId={transcript} />
            </div>
            <div className="relative flex h-full w-full flex-col overflow-y-auto  p-2 outline-none outline outline-2">
              <UserAsking transcriptId={transcript} />
            </div>
          </>
        )}
      </WorkSpace>
    </>
  )
}
