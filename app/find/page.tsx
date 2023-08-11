import SearchBar from './SearchBar'
import { Metadata } from 'next'

export const revalidate = 0

export const metadata: Metadata = {
  title: `TT:TT`,
  description: 'earnings transcript',
}

export default function Page() {
  // console.log('Good Day, Next.js! [find] page.tsx render')
  return (
    <div className="flex h-[100vh] w-full items-center justify-center bg-gray-100 p-2 text-slate-600">
      <div className='flex flex-col items-center gap-2 w-80 h-[22rem]'>
        <p className='font-mono text-2xl font-bold text-indigo-500	'>TT: Transcript Tool</p>
        <SearchBar />
      </div>
    </div>
  )
}
