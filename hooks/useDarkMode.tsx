import { useEffect, useState } from 'react'

type LocalStorage = {
  'dark-theme': boolean
  lang: 'en' | 'zh' | 'ja'
}

type LocalStorageKey = keyof LocalStorage

const useLocalStorage = <T extends LocalStorageKey>(key: T, initialValue: LocalStorage[T]) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  const setValue = (value: LocalStorage[T]) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.log(error)
    }
  }
  return [storedValue, setValue]
}

export default function useDarkMode() {
  const [enabled, setEnabled] = useLocalStorage('dark-theme', false)

  useEffect(() => {
    const className = 'dark'
    const bodyClass = window.document.body.classList

    enabled ? bodyClass.add(className) : bodyClass.remove(className)
  }, [enabled])

  return [enabled, setEnabled]
}
