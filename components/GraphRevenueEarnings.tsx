import BarchartTest, { type BarChartTestProps } from './ui/BarChartTest'
import { useState } from 'react'

export interface financialData {
  annual: { period: string; revenue: number; earning: number }[]
  quarterly: { period: string; revenue: number; earning: number }[]
  eps: { period: string; actual: number | null; estimate: number }[]
}

interface GraphRevenueEarningsProps {
  financialData: financialData
}

export default function GraphRevenueEarnings({ financialData }: GraphRevenueEarningsProps) {
  const [graphData, setGraphData] = useState<BarChartTestProps['chartData'] | undefined>(
    financialData.annual
  )
  const [graphTitle, setGraphTitle] = useState<string | null>('annual')

  const handleSelectAnnual = () => {
    setGraphData(financialData.annual)
    setGraphTitle('annual')
  }

  const handleSelectQuarterly = () => {
    setGraphData(financialData.quarterly)
    setGraphTitle('quarterly')
  }

  return (
    <>
      <span className="flex flex-row items-center gap-2 p-1">
        <div
          className={`cursor-pointer border-b-2 text-xs ${
            graphTitle === 'annual' ? 'border-gray-500' : 'border-transparent hover:border-gray-300'
          }`}
          onClick={() => handleSelectAnnual()}
        >
          Annual
        </div>
        <div
          className={`cursor-pointer border-b-2 text-xs ${
            graphTitle === 'quarterly'
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
      <BarchartTest chartData={graphData} containerWidth={600} containerHeight={400} />
    </>
  )
}
