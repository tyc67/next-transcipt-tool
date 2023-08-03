import Navbar from './Navbar'
import { TranscriptProvider } from './TranscriptContext'

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex h-[100vh] w-full flex-col gap-2 bg-gray-100 p-2 text-slate-600">
        <Navbar />
        <section className="flex h-[90vh] flex-row gap-2">
          <TranscriptProvider>{children}</TranscriptProvider>
        </section>
      </main>
    </>
  )
}
