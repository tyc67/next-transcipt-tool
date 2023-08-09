'use client'

import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import CheckListButton from '@/components/ui/CheckListButton'
import { useUpdateTranscript } from '@/hooks/useUpdateTranscript'

export default function Navbar() {
  const router = useRouter()
  const params = useParams()
  const { isLoading, updateTranscript } = useUpdateTranscript()

  const handleCompare = () => {
    router.push('compare')
  }
  const handleCheckingAction = async () => {
    const response = await updateTranscript(params.symbol)
    if (response?.ok) {
      router.refresh()
    }
  }

  return (
    <nav className="flex rounded-md bg-white p-2">
      <span className="flex flex-row items-center">
        <p className="px-4 py-2 text-xl text-slate-900">{params.symbol}</p>
        <CheckListButton
          isLoading={isLoading}
          calltoAction={handleCheckingAction}
          text="update"
          color="blue"
        />
        <CheckListButton calltoAction={handleCompare} text="compare" color="yellow" />
      </span>
    </nav>
  )
}
