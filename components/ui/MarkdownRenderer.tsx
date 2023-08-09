'use client'

import React, { useState, useEffect } from 'react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeReact from 'rehype-react'

const MarkdownRenderer = ({ markdownContent }: { markdownContent: string }) => {
  const [renderContent, setRenderContent] = useState<string>('')
  useEffect(() => {
    const markdownParser = async () => {
      try {
        const parsedContent = await unified()
          .use(remarkParse)
          .use(remarkRehype, { allowDangerousHtml: true })
          .use(rehypeRaw)
          .use(rehypeSanitize)
          .use(rehypeStringify)
          .process(markdownContent)

        const html = document.createElement('div')
        html.textContent = String(parsedContent)
        setRenderContent(html.textContent)
      } catch (error: any) {
        throw error
      }
    }
    markdownParser()
  }, [markdownContent])

  return (
    <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: renderContent }}></div>
  )
}

export default MarkdownRenderer
