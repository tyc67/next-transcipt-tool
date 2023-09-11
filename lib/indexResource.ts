import { readFile } from 'fs/promises'
import { walk } from './walk'
import { createHash } from 'crypto'
import { RootContent, Root } from 'mdast'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toMarkdown } from 'mdast-util-to-markdown'
import { toString } from 'mdast-util-to-string'
import { u } from 'unist-builder'

export type Json = Record<
  string,
  string | number | boolean | null | Json[] | { [key: string]: Json }
>

export type Section = {
  content: string
  heading?: string
  slug?: string
}

export type Filename = {
  symbol: string
  year: string
  quarter: string
}

export abstract class BaseSource {
  checksum?: string
  meta?: Json
  sections?: Section[]
  file?: Filename

  constructor(
    public source: string,
    public path: string,
    public parentPath?: string,
    public detail?: Filename
  ) {}

  abstract load(): Promise<{
    checksum: string
    meta?: Json
    sections: Section[]
  }>
}

export type ProcessedMd = {
  checksum: string
  meta?: Json
  sections: Section[]
}

/**
 * Splits a `mdast` tree into multiple trees based on
 * a predicate function. Will include the splitting node
 * at the beginning of each tree.
 *
 * Useful to split a markdown file into smaller sections.
 */
export function splitTreeBy(tree: Root, predicate: (node: RootContent) => boolean) {
  return tree.children.reduce<Root[]>((trees, node) => {
    const [lastTree] = trees.slice(-1)

    if (!lastTree || predicate(node)) {
      const tree: Root = u('root', [node])
      return trees.concat(tree)
    }

    lastTree.children.push(node)
    return trees
  }, [])
}
export function parseHeading(heading: string): { heading: string; customAnchor?: string } {
  const match = heading.match(/(.*) *\[#(.*)\]/)
  if (match) {
    const [, heading, customAnchor] = match
    return { heading, customAnchor }
  }
  return { heading }
}

export function processMdForSearch(content: string): ProcessedMd {
  const checksum = createHash('sha256').update(content).digest('base64')
  const mdTree = fromMarkdown(content)
  const sectionTrees = splitTreeBy(mdTree, (node) => node.type === 'heading')
  const sections = sectionTrees.map((tree) => {
    const [firstNode] = tree.children
    const content = toMarkdown(tree)
    const rawHeading: string | undefined =
      firstNode.type === 'heading' ? toString(firstNode) : undefined

    if (!rawHeading) {
      return { content }
    }

    const { heading } = parseHeading(rawHeading)

    return {
      content,
      heading,
    }
  })
  return {
    checksum,
    sections,
  }
}

export class MarkdownSource extends BaseSource {
  type = 'markdown' as const

  constructor(source: string, public filePath: string, public parentFilePath?: string) {
    const lastData = filePath.split('/').pop()
    const [symbol, year, quarter, extension] = lastData?.split(/[_\.]/) ?? []
    const filename = { symbol, year, quarter }

    const path = filePath.replace(/^pages/, '').replace(/\.mdx?$/, '')
    const parentPath = parentFilePath?.replace(/^pages/, '').replace(/\.mdx?$/, '')

    super(source, path, parentPath, filename)
  }

  async load() {
    const contents = await readFile(this.filePath, 'utf8')

    const { checksum, meta, sections } = processMdForSearch(contents)

    this.checksum = checksum
    this.meta = meta
    this.sections = sections

    return {
      checksum,
      meta,
      sections,
    }
  }
}

const Constants = {
  resources: {
    transcripts: 'app/docs',
  },
}

export async function fetchResources() {
  const guideResources = (await walk(Constants.resources.transcripts)).map(
    (entry) => new MarkdownSource('docs', entry.path)
  )
  const sources: MarkdownSource[] = [...guideResources]
  return sources
}
