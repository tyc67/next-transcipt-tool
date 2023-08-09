import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { supabaseTranscript } from '@/types/earnings'

import Container from './Container'
export const revalidate = 0

// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
export const metadata: Metadata = {
  title: `company transcript`,
  description: 'earnings transcript',
}

// what is component serialized ?
// Next13 fetch data directly inside server components, and cached automatically inside of app router
export default async function Page({ params: { symbol } }: { params: { symbol: string } }) {
  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase.from('transcript').select().eq('symbol', symbol)
  const supabaseData = data as supabaseTranscript[]

  // if (supabaseData.length === 0) {
  //   notFound()
  // }
  if (error) {
    // console.log('Error: ', error.message)
    throw new Error(error.message)
  }

  return (
    <>
      <Container supabaseData={supabaseData} />
    </>
  )
}
