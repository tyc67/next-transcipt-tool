interface AlphaVantageApiResponseDaily {
  'Meta Data': {
    '1. Information': string
    '2. Symbol': string
    '3. Last Refreshed': string
    '4. Output Size': string
    '5. Time Zone': string
  }
  'Time Series (Daily)': {
    [key: string]: {
      '1. open': string
      '2. high': string
      '3. low': string
      '4. close': string
      '5. volume': string
    }
  }
}

export interface AlphaVantageApiResponseOverview {
  Symbol: string
  AssetType: string
  Name: string
  Description: string
  CIK: string
  Exchange: string
  Currency: string
  Country: string
  Sector: string
  Industry: string
  Address: string
  FiscalYearEnd: string
  LatestQuarter: string
  MarketCapitalization: string
  EBITDA: string
  PERatio: string
  PEGRatio: string
  BookValue: string
  DividendPerShare: string
  DividendYield: string
  EPS: string
  RevenuePerShareTTM: string
  ProfitMargin: string
  OperatingMarginTTM: string
  ReturnOnAssetsTTM: string
  ReturnOnEquityTTM: string
  RevenueTTM: string
  GrossProfitTTM: string
  DilutedEPSTTM: string
  QuarterlyEarningsGrowthYOY: string
  QuarterlyRevenueGrowthYOY: string
  AnalystTargetPrice: string
  TrailingPE: string
  ForwardPE: string
  PriceToSalesRatioTTM: string
  PriceToBookRatio: string
  EVToRevenue: string
  EVToEBITDA: string
  Beta: string
  '52WeekHigh': string
  '52WeekLow': string
  '50DayMovingAverage': string
  '200DayMovingAverage': string
  SharesOutstanding: string
  DividendDate: string
  ExDividendDate: string
}

type AlphaVantageApi = {
  TIME_SERIES_DAILY: AlphaVantageApiResponseDaily
  OVERVIEW: AlphaVantageApiResponseOverview
}

export async function useAlphaVantageGenericServerSideProps<Api extends keyof AlphaVantageApi>(
  symbol: string,
  apis: Api
) {
  const apiUrl = `https://www.alphavantage.co/query?function=${apis}&symbol=${symbol}&apikey='${process.env.ALPHA_VANTAGE_KEY}'`

  try {
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'User-Agent': 'request' },
      next: { revalidate: 900 },
    })

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`)
    }

    const data = await res.json()

    if (!data || Object.keys(data).length < 2) {
      return null
    }

    if (apis === 'TIME_SERIES_DAILY') {
      return transformDaily(data) as TransformedDailyData
    } else if (apis === 'OVERVIEW') {
      return data as AlphaVantageApi[Api]
    }

    return null
  } catch (err: any) {
    throw new Error(err)
  }
}

export interface TransformedDailyData {
  meta: {
    information: string
    symbol: string
    lastRefreshed: string
    outputSize: string
    timeZone: string
  }
  ohlcv: {
    date: string
    open: string
    high: string
    low: string
    close: string
    volume: string
  }[]
}

function transformDaily(rawData: any): TransformedDailyData {
  const transformed: TransformedDailyData = {
    meta: {
      information: rawData['Meta Data']['1. Information'],
      symbol: rawData['Meta Data']['2. Symbol'],
      lastRefreshed: rawData['Meta Data']['3. Last Refreshed'],
      outputSize: rawData['Meta Data']['4. Output Size'],
      timeZone: rawData['Meta Data']['5. Time Zone'],
    },
    ohlcv: [],
  }

  for (const date in rawData['Time Series (Daily)']) {
    const dailyData = rawData['Time Series (Daily)'][date]
    transformed.ohlcv.push({
      date,
      open: dailyData['1. open'],
      high: dailyData['2. high'],
      low: dailyData['3. low'],
      close: dailyData['4. close'],
      volume: dailyData['5. volume'],
    })
  }
  return transformed
}
