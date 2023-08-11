import { Metadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Container from './Container'

export const metadata: Metadata = {
  title: `backstage`,
  description: 'earnings transcript',
}

export default async function Page({ params }: { params: string }) {
  return (
    <>
      <Container />
    </>
  )
}
