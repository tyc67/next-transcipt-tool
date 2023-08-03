import { Metadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Container from './Container'

export const revalidate = 0

export const metadata: Metadata = {
  title: `quarter transcript`,
  description: 'earnings transcript',
}

export default async function Page({ params }: { params: string }) {
  console.log('params: ', params)

  return (
    <>
      <Container />
    </>
  )
}
