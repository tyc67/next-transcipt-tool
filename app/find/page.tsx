import SearchBar from './SearchBar'
import { Metadata } from 'next'

export const revalidate = 0

export const metadata: Metadata = {
  title: `find transcript`,
  description: 'earnings transcript',
}

export default function Page() {
  // console.log('Good Day, Next.js! [find] page.tsx render')
  return <SearchBar />
}
