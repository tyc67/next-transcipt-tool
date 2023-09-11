import { cache } from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const revalidate = 600

interface AnnualData {
  period: string
  revenue: number
  earning: number
}

interface QuarterlyData {
  period: string
  revenue: number
  earning: number
  eps_actual: null | number
  eps_estimate: null | number
}

export interface GraphData {
  annual: AnnualData[]
  quarterly: QuarterlyData[]
}

const initialData: GraphData = {
  annual: [
    { period: '', revenue: 0, earning: 0 },
    { period: '', revenue: 0, earning: 0 },
    { period: '', revenue: 0, earning: 0 },
    { period: '', revenue: 0, earning: 0 },
  ],
  quarterly: [
    { period: '', revenue: 0, earning: 0, eps_actual: null, eps_estimate: null },
    { period: '', revenue: 0, earning: 0, eps_actual: null, eps_estimate: null },
    { period: '', revenue: 0, earning: 0, eps_actual: null, eps_estimate: null },
    { period: '', revenue: 0, earning: 0, eps_actual: null, eps_estimate: null },
  ],
}

export const getFinancialData = cache(async (symbol: string) => {
  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase.from('financial').select().eq('symbol', symbol)
  if (error) {
    throw new Error(`supabaseError: ${error.message}`)
  }

  const convertedData: GraphData = {
    annual: [],
    quarterly: [],
  }
  data.forEach((item) => {
    const { period, type, revenue, earning, eps_actual, eps_estimate } = item
    if (type === 'annual') {
      convertedData.annual.push({ period, revenue, earning })
    } else if (type === 'quarterly') {
      convertedData.quarterly.push({ period, revenue, earning, eps_actual, eps_estimate })
    }
  })

  convertedData.quarterly.sort((a, b) => {
    const [aQuarter, aYear] = a.period.split('Q')
    const [bQuarter, bYear] = b.period.split('Q')
    if (aYear !== bYear) {
      return parseInt(aYear) - parseInt(bYear)
    }
    return parseInt(aQuarter) - parseInt(bQuarter)
  })
  return convertedData
})
