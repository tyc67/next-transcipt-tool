'use client'

import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import CheckListButton from '@/components/ui/CheckListButton'
import { useUpdateTranscript } from '@/hooks/useUpdateTranscript'

export default function Navbar() {
  const router = useRouter()
  const params = useParams()
  // const { isLoading, updateTranscript } = useUpdateTranscript()

  // const handleUpdateAction = async () => {
  //   const response = await updateTranscript(params.symbol)
  //   if (response?.ok) {
  //     router.refresh()
  //   }
  // }

  return (
    <nav className="flex rounded-md bg-white p-2">
      <span className="flex flex-row items-center">
        {/* <CheckListButton
          isLoading={isLoading}
          calltoAction={handleUpdateAction}
          text="update"
          color="blue"
        /> */}

        <div className="flex cursor-pointer flex-row items-center gap-4 ">
          <Link href="/find/compare">
            <p className="rounded-md bg-sky-200 px-2">comparison</p>
          </Link>
          <Link href="/find/admin">
            <p className="rounded-md bg-sky-200 px-2">manager ❎</p>
          </Link>
        </div>
      </span>
    </nav>
  )
}
