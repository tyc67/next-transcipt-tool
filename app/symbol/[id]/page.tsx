import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { supabaseTranscript } from '@/types/earnings'
import ContainerTest from './container'

// https://blablablah/symbol/earnings/transcript/....

export const revalidate = 0

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export const metadata: Metadata = {
  title: `symbol transcript`,
  description: 'earnings transcript',
}

// what is component serialized ?
// Next13 fetch data directly inside server components, and cached automatically inside of app router
export default async function Post({ params: { id } }: { params: { id: string } }) {
  console.log(
    'Good Day, Next.js! This is a symbol[id] server component wrap with client components'
  )

  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase.from('transcript').select().eq('symbol', id)
  const supabaseData = data as supabaseTranscript[]

  // if (supabaseData.length === 0) {
  //   notFound()
  // }
  if (error) {
    console.log('Error: ', error.message)
    // throw new Error (error.message)
  }

  return (
    <>
      <ContainerTest supabaseData={supabaseData} symbol={id} />
    </>
  )
}
