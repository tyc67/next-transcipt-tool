import { useState } from 'react'
import { type GraphData } from '@/lib/getFinancialData'

interface GraphConsensuEPSProps {
  financialData: GraphData
}

export default function GraphConsensusEPS({ financialData }: GraphConsensuEPSProps) {
  const dotColor1 = '#155e75'
  const dotColor2 = '#9f1239'
  const dotRadius = 7

  const containerWidth = 600
  const containerHeight = 400
  const margin = { top: 40, right: 20, bottom: 40, left: 50 }
  const axisColor = 'black'
  const axisWidth = 1
  const labelFontSize = 14
  const labelColor = '#a1a1aa'
  const labelX = financialData.quarterly.map((data) => data.period)
  const axis_x_count = labelX.length
  const dataActual = financialData.quarterly
    .map((data) => data.eps_actual)
    .filter((value) => value !== null) as number[]
  const dataEstimate = financialData.quarterly
    .map((data) => data.eps_estimate)
    .filter((value) => value !== null) as number[]

  const [dotPosition, setDotPosition] = useState({
    id: null,
    top: 0,
    height: 0,
    isHovering: false,
  })

  const maxActual = Math.ceil(Math.max(...dataActual))
  const maxEstimate = Math.ceil(Math.max(...dataEstimate))

  const scaledDataActual = dataActual.map(
    (value) => (value / maxActual) * (containerHeight - margin.top - margin.bottom)
  )
  const scaledDataEstimate = dataEstimate.map(
    (value) => (value / maxEstimate) * (containerHeight - margin.top - margin.bottom)
  )

  const handleMouseOver = (e: any) => {
    const { id } = e.target
    const { top, height } = e.target.getBoundingClientRect()
    setDotPosition({ id, top, height, isHovering: true })
  }

  const handleMouseLeave = () => {
    setDotPosition((prevPosition) => ({ ...prevPosition, isHovering: false }))
  }

  const drawDashLine = (Sx: number, Sy: number, offset: number) => {
    const x = Sx + offset
    const y = Sy

    return `M${x},0 L${x},${containerHeight - margin.bottom} M${0 + margin.left},${y} L${
      containerWidth - margin.right
    },${y}`
  }

  const drawSquare = (Sx: number, Sy: number, offset: number, idx: number) => {
    const adjustPoint = -10
    const squareWidth = -50
    const x = Sx + offset + adjustPoint
    const y = Sy + adjustPoint

    return (
      <>
        <path
          className="opacity-75"
          d={`M${x},${y} L${x},${y + squareWidth} L${x + squareWidth},${y + squareWidth} L${
            x + squareWidth
          },${y} Z`}
          stroke={labelColor}
          strokeWidth="1"
          fill="white"
        />
        <circle
          className="opacity-75"
          cx={x + squareWidth - adjustPoint}
          cy={y + squareWidth - adjustPoint * 1.5}
          r="3"
          stroke={dotColor1}
          strokeWidth="0"
          fill={dotColor1}
        />
        <text
          x={x + squareWidth - adjustPoint * 1.7}
          y={y + squareWidth - adjustPoint * 2}
          fill={labelColor}
          textAnchor="start"
          fontSize={labelFontSize}
        >
          {dataEstimate[idx]}
        </text>
        <circle
          className="opacity-75"
          cx={x + squareWidth - adjustPoint}
          cy={y + squareWidth - adjustPoint * 3.5}
          r="3"
          stroke={dotColor2}
          strokeWidth="0"
          fill={dotColor2}
        />
        <text
          x={x + squareWidth - adjustPoint * 1.7}
          y={y + squareWidth - adjustPoint * 4}
          fill={labelColor}
          textAnchor="start"
          fontSize={labelFontSize}
        >
          {dataActual[idx]}
        </text>
      </>
    )
  }

  return (
    <>
      <span className=" flex flex-row items-center p-1">
        <svg className="h-5 w-6" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-75"
            cx={12}
            cy={12}
            r="6"
            stroke="red"
            strokeWidth="0"
            fill={dotColor1}
          />
        </svg>
        <p className="text-xs">Consensus EPS</p>
        <div className="ml-auto flex flex-row items-center">
          <svg className="h-5 w-6" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-75"
              cx={12}
              cy={12}
              r="6"
              stroke="red"
              strokeWidth="0"
              fill={dotColor1}
            />
          </svg>
          <p className="text-xs">Estimate</p>
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
              fill={dotColor2}
            />
          </svg>
          <p className="text-xs">Actual</p>
        </div>
      </span>

      <svg className="bg-transparent" viewBox={`0 0 ${containerWidth} ${containerHeight}`}>
        <g key="x-axis">
          <path
            d={`M${margin.left},${containerHeight - margin.bottom} L${
              containerWidth - margin.right
            },${containerHeight - margin.bottom}`}
            strokeWidth={axisWidth}
            stroke={axisColor}
          />
        </g>
        {scaledDataEstimate.map((data, idx) => {
          const x = ((containerWidth - margin.left - margin.right) / (axis_x_count + 1)) * (idx + 1)
          const y = containerHeight - data - margin.bottom
          const offset = 10
          return (
            <g key={`estimate-${idx}`}>
              <circle
                id={`estimate-${idx}`}
                className="opacity-75"
                cx={x + offset}
                cy={y}
                r={dotRadius}
                stroke={dotColor1}
                strokeWidth="0"
                fill={dotColor1}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
              />
              {dotPosition.isHovering && dotPosition.id === `estimate-${idx}` && (
                <>
                  <path
                    d={drawDashLine(x, y, offset)}
                    stroke={labelColor}
                    strokeWidth="1"
                    strokeDasharray={7}
                  />
                  {drawSquare(x, y, offset, idx)}
                </>
              )}
            </g>
          )
        })}

        {scaledDataActual.map((data, idx) => {
          const x = ((containerWidth - margin.left - margin.right) / (axis_x_count + 1)) * (idx + 1)
          const y = containerHeight - data - margin.bottom
          const offset = 10
          return (
            <g key={`actual-${idx}`}>
              <circle
                id={`actual-${idx}`}
                className="opacity-75"
                cx={x + offset}
                cy={y}
                r={dotRadius}
                stroke={dotColor2}
                strokeWidth="0"
                fill={dotColor2}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
              />
              {dotPosition.isHovering && dotPosition.id === `actual-${idx}` && (
                <>
                  <path
                    d={drawDashLine(x, y, offset)}
                    stroke={labelColor}
                    strokeWidth="1"
                    strokeDasharray={7}
                  />
                  {drawSquare(x, y, offset, idx)}
                </>
              )}
            </g>
          )
        })}
        {labelX.map((data, idx) => {
          const x =
            ((containerWidth - margin.left - margin.right) / (axis_x_count + 1)) * (idx + 1.1)
          const y = containerHeight - margin.bottom + labelFontSize * 2.5

          return (
            <g key={`axis-x-label-${idx}`}>
              <text x={x} y={y} fill={labelColor} textAnchor="middle" fontSize={labelFontSize}>
                {data}
              </text>
            </g>
          )
        })}
      </svg>
    </>
  )
}
