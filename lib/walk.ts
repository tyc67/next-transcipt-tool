import { readdir, stat } from 'fs/promises'
import { basename, dirname, join } from 'path'

export type WalkEntry = {
  path: string
  parentPath?: string
}

export async function walk(resourceId: string, parentPath?: string): Promise<WalkEntry[]> {
  console.log(`walk-docs: go through ${resourceId}`)
  const immediateFiles = await readdir(resourceId)
  const recursiveFiles = await Promise.all(
    immediateFiles.map(async (file) => {
      const path = join(resourceId, file)
      const stats = await stat(path)
      if (stats.isDirectory()) {
        const docPath = `${basename(path)}.md`

        return walk(
          path,
          immediateFiles.includes(docPath) ? join(dirname(path), docPath) : parentPath
        )
      } else if (stats.isFile()) {
        return [{ path: path, parentPath }]
      } else {
        return []
      }
    })
  )

  // reduce method ?
  const flattenFiles = recursiveFiles.reduce(
    (all, folderContents) => all.concat(folderContents),
    []
  )

  return flattenFiles.sort((a, b) => a.path.localeCompare(b.path))
}
