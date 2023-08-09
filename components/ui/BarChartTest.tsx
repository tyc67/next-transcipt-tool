import { useState } from 'react'

export interface BarChartTestProps {
  containerHeight?: number
  containerWidth?: number
  barColor1?: string
  barColor2?: string
  labelColor?: string
  chartData?: { period: string; revenue: number; earning: number }[]
}

export default function BarchartTest({
  containerHeight = 300,
  containerWidth = 300,
  barColor1 = '#22c55e',
  barColor2 = '#3b82f6',
  labelColor = '#a1a1aa',
  chartData = [],
}: BarChartTestProps) {
  const margin = { top: 20, right: 20, bottom: 40, left: 40 }
  const axisColor = 'black'
  const axisWidth = 1
  const labelfontSize = 11
  const barWidth = 10
  const labelX = chartData.map((data) => data.period)
  const axis_x_count = labelX.length
  const dataR = chartData.map((data) => data.revenue)
  const dataE = chartData.map((data) => data.earning)
  const dataY = chartData.flatMap((item) => [item.revenue, item.earning])

  const [squarePosition, setSquarePosition] = useState({
    id: null,
    top: 0,
    height: 0,
    isHovering: false,
  })

  const handleMouseOver = (e: any) => {
    const { id } = e.target
    const { top, height } = e.target.getBoundingClientRect()
    setSquarePosition({ id, top, height, isHovering: true })
  }

  const handleMouseLeave = () => {
    setSquarePosition((prevPosition) => ({ ...prevPosition, isHovering: false }))
  }

  const drawSquarePath = (Sx: number, Sy: number) => {
    const offset = 5
    const squareWidth = 50
    const x = Sx + offset
    const y = Sy

    return `M${x},${y} L${x},${y + squareWidth} L${x + squareWidth},${y + squareWidth} L${
      x + squareWidth
    },${y} Z`
  }

  function scaleData(data: any[], maxScale = containerHeight - margin.top - margin.bottom) {
    const maxData = Math.max(...data)

    const scaledData = data.map((value) => {
      const scaledValue = (value / maxData) * maxScale
      return scaledValue
    })

    return scaledData
  }

  const scaledDataR = scaleData(dataR)

  function scaleData2(data: any[], maxScale = containerHeight - margin.top - margin.bottom) {
    const maxData = Math.max(...dataR)

    const scaledData = data.map((value) => {
      const scaledValue = (value / maxData) * maxScale
      return scaledValue
    })

    return scaledData
  }

  const scaledDataE = scaleData2(dataE)

  function findDigits(data: number[]) {
    let digitFrequency: any = {}
    let mostNumDigits = -1
    let maxFrequency = 0

    data.forEach((value) => {
      const numDigits = Math.floor(Math.log10(Math.abs(value * 1000))) + 1

      digitFrequency[numDigits] = (digitFrequency[numDigits] || 0) + 1

      if (digitFrequency[numDigits] > maxFrequency) {
        mostNumDigits = numDigits
        maxFrequency = digitFrequency[numDigits]
      }
    })
    if (mostNumDigits === -1) return []
    const numUnit = Math.pow(10, mostNumDigits - 1)
    const maxValue = Math.max(...data.map((value) => value * 1000))
    const minValue = Math.min(
      ...data.map((value) => value * 1000).filter((number) => number > numUnit)
    )
    const nextMaxValue = Math.ceil(maxValue / numUnit) * numUnit
    const nextMinValue = Math.ceil(minValue / numUnit) * numUnit
    // console.log(data.map((value) => value * 1000).sort((a, b) => b - a))
    // console.log(
    //   data
    //     .map((value) => value * 1000)
    //     .filter((number) => number > numUnit)
    //     .sort((a, b) => b - a)
    // )
    // console.log({ nextMaxValue }, { nextMinValue })
    // console.log(maxValue, minValue)
    const segment = 10
    let step = (nextMaxValue - nextMinValue) / (segment - 1)
    // console.log(step)

    const descendingValues = Array.from({ length: segment }, (_, i) => nextMaxValue - i * step)
    const descendingValues1 = Array.from(
      { length: segment },
      (_, index) => nextMaxValue - index * step
    )
    // console.log(descendingValues)
    return descendingValues
  }
  const scaleOfAxisY = findDigits(dataY)

  function formatNumber(num: any) {
    const suffixes = ['', 'K', 'M', 'B', 'T']
    const number = parseFloat(num)
    const tier = Math.floor(Math.log10(Math.abs(number)) / 3)
    const scaledNumber = number / Math.pow(1000, tier)

    return scaledNumber.toFixed(1) + suffixes[tier]
  }
  const formattedLabelY = scaleOfAxisY.map((number) => formatNumber(number))
  const axis_y_count = formattedLabelY.length

  // var(--font-size-1)
  // font-size: --var-font-size-1;
  // h-[--var-font-size-1] -> height: --var-font-size-1;
  // height: ${containerHeight}px;
  // document.createElement('div').getBoundingClientRect();
  // document.createElement('div').offsetHeight;
  // document.createElement('div').offsetTop;
  return (
    <>
      {/* <div className={`bg-transparent`} style={{ height: containerHeight, width: containerWidth }}> */}
      <svg className="bg-slate-50" viewBox={`0 0 ${containerWidth} ${containerHeight}`}>
        {formattedLabelY.map((data, idx) => {
          const offset = 1
          const y =
            ((containerHeight - margin.top - margin.bottom) / axis_y_count + 1) * idx +
            margin.top / 2
          return (
            <g key={`axis-y-label-${idx}`}>
              <text
                x={margin.left - labelfontSize * 1.75}
                y={y}
                fill={labelColor}
                textAnchor="middle"
                fontSize={labelfontSize}
              >
                {data}
              </text>
              <line
                x1={margin.left}
                y1={y}
                x2={containerWidth - margin.right}
                y2={y}
                strokeWidth={axisWidth}
                stroke={labelColor}
              ></line>
            </g>
          )
        })}
        {/* <path d="M0 0 L0,100 L5,100 L5,0 Z" stroke="red" strokeWidth="2" fill="yellow" /> */}
        <g key="x-axis">
          <path
            d={`M${margin.left},${containerHeight - margin.bottom} L${
              containerWidth - margin.right
            },${containerHeight - margin.bottom}`}
            strokeWidth={axisWidth}
            stroke={axisColor}
          />
        </g>
        {labelX.map((data, idx) => {
          const x =
            ((containerWidth - margin.left - margin.right) / (axis_x_count + 1)) * (idx + 1.1)
          const y = containerHeight - margin.bottom + labelfontSize * 2.5

          return (
            <g key={`axis-x-label-${idx}`}>
              <text x={x} y={y} fill={labelColor} textAnchor="middle" fontSize={labelfontSize}>
                {data}
              </text>
            </g>
          )
        })}

        {scaledDataR.map((data, idx) => {
          const x = ((containerWidth - margin.left - margin.right) / (axis_x_count + 1)) * (idx + 1)
          const y = containerHeight - data - margin.bottom

          return (
            <g key={`data-r-${idx}`}>
              <path
                id={`data-r-${idx}`}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
                d={`M${x} ${containerHeight - margin.bottom} L${x},${y} L${x + barWidth},${y} L${
                  x + barWidth
                },${containerHeight - margin.bottom} Z`}
                stroke={barColor1}
                strokeWidth="0"
                fill={barColor1}
              />
              {squarePosition.isHovering && squarePosition.id === `data-r-${idx}` && (
                <>
                  <path
                    className="opacity-75"
                    d={drawSquarePath(x + barWidth, y)}
                    stroke={labelColor}
                    strokeWidth="1"
                    fill="white"
                  />
                  <circle
                    className="opacity-75"
                    cx={x + barWidth * 2}
                    cy={y + barWidth}
                    r="3"
                    stroke={barColor1}
                    strokeWidth="0"
                    fill={barColor1}
                  />
                  <text
                    x={x + barWidth * 2.5}
                    y={y + 15}
                    fill={labelColor}
                    textAnchor="start"
                    fontSize={labelfontSize}
                  >
                    {formatNumber(dataR[idx] * 1000)}
                  </text>
                  <circle
                    className="opacity-75"
                    cx={x + barWidth * 2}
                    cy={y + barWidth * 3}
                    r="3"
                    stroke={barColor2}
                    strokeWidth="0"
                    fill={barColor2}
                  />
                  <text
                    x={x + barWidth * 2.5}
                    y={y + 15 + barWidth * 2}
                    fill={labelColor}
                    textAnchor="start"
                    fontSize={labelfontSize}
                  >
                    {formatNumber(dataE[idx] * 1000)}
                  </text>
                </>
              )}
            </g>
          )
        })}
        {scaledDataE.map((data, idx) => {
          const x =
            ((containerWidth - margin.left - margin.right) / (axis_x_count + 1)) * (idx + 1.15)
          const y = containerHeight - data - margin.bottom

          return (
            <g key={idx}>
              <path
                d={`M${x} ${containerHeight - margin.bottom} L${x},${y} L${x + barWidth},${y} L${
                  x + barWidth
                },${containerHeight - margin.bottom} Z`}
                stroke={barColor2}
                strokeWidth="0"
                fill={barColor2}
              />
            </g>
          )
        })}
      </svg>
      {/* </div> */}
    </>
  )
}
