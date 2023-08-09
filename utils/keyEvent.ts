/**
 * Returns a string representation of a keyboard event.
 */
export const key = (e: React.KeyboardEvent<any> | KeyboardEvent) => {
  const isMeta = e.metaKey || e.ctrlKey
  const isShift = e.shiftKey
  return `${isShift ? '$' : ''}${isMeta ? '^' : ''}${e.key}`
}

/**
 * Creates a registry of key handlers. The registry is used to handle keyboard events.
 *
 * @returns A registry of key handlers.
 *
 * @example
 * ```ts
 * const registry = createKeyHandlersRegistry();
 * registry.register('ctrl+a', () => console.log('ctrl+a'));
 * registry.register('ctrl+b', () => console.log('ctrl+b'));
 *
 * // ...
 *
 * registry.handle({ key: 'a', ctrlKey: true }
 */
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
