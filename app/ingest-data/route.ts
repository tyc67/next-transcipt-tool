import { NextRequest, NextResponse } from 'next/server'
import { UserError } from '@/lib/errors'
import generateEmbeddings from '@/lib/generate-embeddings'

// https://nextjs.org/docs/app/building-your-application/routing/router-handlers
export async function POST(req: NextRequest) {
  try {
    const requestData = await req.json()

    if (!requestData) {
      throw new UserError('Missing request data')
    }
    if (!requestData.symbol) {
      throw new UserError('Missing ingestData in request data')
    }

    if (requestData.symbol === 'admin') {
      const ingestAllDataInDocs = await generateEmbeddings()
    } else {
      const ingestIndividualData = await generateEmbeddings(requestData.symbol)
    }

    return NextResponse.json(requestData)
  } catch (err: any) {
    throw new UserError(err)
  }
}
