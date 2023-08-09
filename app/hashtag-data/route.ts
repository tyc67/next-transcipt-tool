import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export interface HashtagRequest {
  transcriptId: string
  hashtagInput: string
}

export async function POST(req: NextRequest) {
  const reqData: HashtagRequest = await req.json()
  const supabase = createRouteHandlerClient({ cookies })

  const { data: existHashtag, error: existHashtagError } = await supabase
    .from('transcript')
    .select('parent_transcript_id,hashtag')
    .eq('parent_transcript_id', reqData.transcriptId)

  const hashtagData: any[] = existHashtag?.[0].hashtag
  const isHashtagExist = hashtagData.includes(reqData.hashtagInput)

  let resStatus = 0

  if (!isHashtagExist) {
    const { error, status } = await supabase
      .from('transcript')
      .update({ hashtag: [...hashtagData, reqData.hashtagInput] })
      .eq('parent_transcript_id', reqData.transcriptId)

    resStatus = status
  } else {
    const filteredData = hashtagData.filter((item) => item !== reqData.hashtagInput)

    const { error, status } = await supabase
      .from('transcript')
      .update({ hashtag: filteredData })
      .eq('parent_transcript_id', reqData.transcriptId)

    resStatus = status
  }

  return NextResponse.json({ resStatus })
}
