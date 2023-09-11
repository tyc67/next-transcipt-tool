import { Metadata } from 'next'
import Container from './Container'

export const metadata: Metadata = {
  title: `mobile-search`,
  description: 'search any company',
}

export default async function Page({ params }: { params: string }) {
  return (
    <>
      <Container />
    </>
  )
}
