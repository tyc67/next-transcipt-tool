import { useState } from 'react'
import BarchartTest, { type BarChartTestProps } from './ui/BarChartTest'
import { type GraphData } from '@/lib/getFinancialData'

interface GraphRevenueEarningsProps {
  financialData: GraphData
}

export default function GraphRevenueEarnings({ financialData }: GraphRevenueEarningsProps) {
  const [barchartData, setBarchartData] = useState<BarChartTestProps['chartData'] | undefined>(
    financialData.annual
  )
  const [barchartTitle, setBarchartTitle] = useState<string | null>('annual')

  const handleSelectAnnual = () => {
    setBarchartData(financialData.annual)
    setBarchartTitle('annual')
  }

  const handleSelectQuarterly = () => {
    setBarchartData(financialData.quarterly)
    setBarchartTitle('quarterly')
  }

  return (
    <>
      <span className="flex flex-row items-center gap-2 p-1">
        <div
          className={`cursor-pointer border-b-2 text-xs ${
            barchartTitle === 'annual'
              ? 'border-gray-500'
              : 'border-transparent hover:border-gray-300'
          }`}
          onClick={() => handleSelectAnnual()}
        >
          Annual
        </div>
        <div
          className={`cursor-pointer border-b-2 text-xs ${
            barchartTitle === 'quarterly'
              ? 'border-gray-500'
              : 'border-transparent hover:border-gray-300'
          }`}
          onClick={() => handleSelectQuarterly()}
        >
          Quarterly
        </div>
        <div className="ml-auto flex flex-row items-center">
          <svg className="h-5 w-6" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-75"
              cx={12}
              cy={12}
              r="6"
              stroke="red"
              strokeWidth="0"
              fill="#22c55e"
            />
          </svg>
          <p className="text-xs">Revenue</p>
        </div>
        <div className="mr-3 flex flex-row items-center">
          <svg className="h-5 w-6" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-75"
              cx={12}
              cy={12}
              r="6"
              stroke="red"
              strokeWidth="0"
              fill="#3b82f6"
            />
          </svg>
          <p className="text-xs">Earnings</p>
        </div>
      </span>
      <BarchartTest chartData={barchartData} containerWidth={600} containerHeight={400} />
    </>
  )
}
