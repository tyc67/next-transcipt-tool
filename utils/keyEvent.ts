export const key = (e: React.KeyboardEvent<any> | KeyboardEvent) => {
  const isMeta = e.metaKey || e.ctrlKey
  const isShift = e.shiftKey
  return `${isShift ? '$' : ''}${isMeta ? '^' : ''}${e.key}`
}

export function createKeyHandlersRegistry() {
  const handlers = new Map<string, (e: React.KeyboardEvent<HTMLDivElement>) => void | boolean>()
  const ctx = {
    register: (prefix: string, handler: (e: React.KeyboardEvent<HTMLDivElement>) => void) => {
      handlers.set(prefix, handler)
      return ctx
    },
    handle: (e: React.KeyboardEvent<HTMLDivElement>) => {
      const pat = key(e)
      if (handlers.has(pat)) {
        if (handlers.get(pat)!(e)) {
          e.preventDefault()
        }
      }
    },
  }
  return ctx
}
