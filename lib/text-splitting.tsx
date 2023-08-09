import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

export default async function textSplitter(text: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })

  const splitedText = await splitter.createDocuments([text])

  return splitedText
}
