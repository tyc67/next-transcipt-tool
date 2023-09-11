import { Metadata } from 'next'
import { ArrowSmallRightIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: `TT:TT`,
  description: 'earnings transcript tool',
}

export default function Page() {
  return (
    <div className="flex h-[100vh] w-full flex-col items-center justify-center bg-blue-950 p-2">
      <div
        className="inline text-center"
        style={{
          background: 'linear-gradient(to right, hsl(98, 100%, 62%), hsl(204, 100%, 59%))',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        <h1 className="text-4xl font-bold">Transcript Tool</h1>
        <p className="font-mono">a little tool save your time every day</p>
      </div>

      <a
        href="/find/TSM"
        className="my-3 rounded-lg bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-lime-300 dark:focus:ring-lime-800"
      >
        <span className="flex flex-row items-center">
          Get Started
          <ArrowSmallRightIcon className="ml-2 h-4  w-4 stroke-2" />
        </span>
      </a>
    </div>
  )
}
