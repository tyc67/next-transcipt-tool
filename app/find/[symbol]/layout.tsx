import Navbar from '../Navbar'
import Sidebar from '../Sidebar'
import { TranscriptProvider } from './TranscriptContext'

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex justify-center bg-gray-100 dark:bg-gray-800 ">
        <div className="flex h-full w-full max-w-[1280px] justify-end">
          {/* <Sidebar /> */}
          {/* <div style={{ width: `calc(100% - 40px)` }}> */}
          <main className="flex flex-col overflow-auto text-slate-600 ">
            <Navbar />
            <section>
              <TranscriptProvider>{children}</TranscriptProvider>
            </section>
          </main>
          {/* </div> */}
        </div>
      </div>
    </>
  )
}
