import { useParams, useRouter } from 'next/navigation'
import { useUpdateTranscript } from '@/hooks/useUpdateTranscript'
import { useEffect, useState } from 'react'
import { type AlphaVantageApiResponseOverview, TransformedDailyData } from '@/hooks/useAlphaVantage'
import IconButton from '@/components/ui/IconButton'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'

const initialStockInfo = {
  name: '',
  exchange: '',
  currency: '',
  price: '',
  priceDifference: '',
  priceDifferencePercentage: '',
  priceRefreshedTime: '',
  colorSwitch: 'zero',
}

type StockInfo = typeof initialStockInfo

export default function BasicInfo({
  alphaVantageData,
}: {
  alphaVantageData: {
    overview: AlphaVantageApiResponseOverview
    daily: TransformedDailyData
  }
}) {
  const params = useParams()
  const router = useRouter()
  const [stockInfo, setStockInfo] = useState<StockInfo>(initialStockInfo)
  const { isLoading, updateTranscript } = useUpdateTranscript()

  useEffect(() => {
    const convertData = () => {
      const diff =
        parseFloat(alphaVantageData.daily.ohlcv[0].close) -
        parseFloat(alphaVantageData.daily.ohlcv[1].close)
      const colorSwitch = diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'zero'
      const diffPricePercentage = (diff / parseFloat(alphaVantageData.daily.ohlcv[1].close)) * 100
      const currentPrice = parseFloat(alphaVantageData.daily.ohlcv[0].close)
      const convertedData: StockInfo = {
        name: alphaVantageData.overview.Name,
        exchange: alphaVantageData.overview.Exchange,
        currency: alphaVantageData.overview.Currency,
        price: currentPrice.toFixed(2),
        priceDifference: diff.toFixed(2),
        priceDifferencePercentage: diffPricePercentage.toFixed(2),
        priceRefreshedTime: alphaVantageData.daily.meta.lastRefreshed,
        colorSwitch: colorSwitch,
      }
      setStockInfo(convertedData)
    }
    if (alphaVantageData.daily && alphaVantageData.overview) {
      convertData()
    }
  }, [alphaVantageData])

  const handleUpdateAction = async () => {
    const response = await updateTranscript(params.symbol)
    if (response?.ok) {
      router.refresh()
    }
  }

  return (
    <div data-test-id="symbol-info" className="mx-2 mb-6">
      <span className="flex flex-row items-baseline">
        <p className="mr-3 py-2 text-3xl font-semibold text-slate-900 dark:text-slate-200">
          {params.symbol}
        </p>
        <p className="text-base text-slate-900 dark:text-slate-200">{stockInfo.name}</p>
        <div className="ml-auto">
          <IconButton isLoading={isLoading} onClick={() => handleUpdateAction()}>
            <CloudArrowUpIcon className="h-5 w-5" />
          </IconButton>
        </div>
      </span>
      <span className="flex flex-row items-baseline gap-2">
        <p className="text-2xl text-slate-900 dark:text-slate-200">${stockInfo.price}</p>
        {stockInfo.colorSwitch === 'negative' ? (
          <p className="text-sm text-red-500">{`${stockInfo.priceDifference} (${stockInfo.priceDifferencePercentage}%)`}</p>
        ) : (
          <p className="text-sm text-green-700">{`${stockInfo.priceDifference} (+${stockInfo.priceDifferencePercentage}%)`}</p>
        )}
      </span>
      <span className="flex flex-row items-baseline gap-1 text-[10px] text-slate-500">
        <p>{stockInfo.exchange}</p>
        <p>|</p>
        <p>${stockInfo.currency}</p>
        <p>|</p>
        <p>4:00 PM {stockInfo.priceRefreshedTime}</p>
      </span>
    </div>
  )
}
