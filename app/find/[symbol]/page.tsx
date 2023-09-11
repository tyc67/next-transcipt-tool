import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/nextAuth'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getSupabaseData } from '@/lib/getSupabaseData'
import { getFinancialData } from '@/lib/getFinancialData'
import Container from './Container'
import {
  useAlphaVantageGenericServerSideProps,
  type TransformedDailyData,
  AlphaVantageApiResponseOverview,
} from '@/hooks/useAlphaVantage'

const revalidate = 900

export const metadata: Metadata = {
  title: `company transcript`,
  description: 'earnings transcript',
}

export default async function Page({ params: { symbol } }: { params: { symbol: string } }) {
  const session = await getServerSession(authOptions)
  const supabaseData = await getSupabaseData(symbol)
  const graphData = await getFinancialData(symbol)
  if (!session) {
    redirect('/api/auth/signin')
  }

  if (supabaseData.length === 0) {
    notFound()
  }

  const overview = (await useAlphaVantageGenericServerSideProps(
    symbol,
    'OVERVIEW'
  )) as AlphaVantageApiResponseOverview
  const daily = (await useAlphaVantageGenericServerSideProps(
    symbol,
    'TIME_SERIES_DAILY'
  )) as TransformedDailyData
  const alphaVantageData = { overview: overview, daily: daily }

  return (
    <>
      <Container
        supabaseData={supabaseData}
        alphaVantageData={alphaVantageData}
        financialData={graphData}
      />
    </>
  )
}
