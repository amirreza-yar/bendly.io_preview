'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts'
import { useState } from 'react'

import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Bullish1, ArrowLeft2, ArrowRight2 } from '@/components/uikit/icons'
import { Tabs, TabsList, TabsTrigger } from '@/components/uikit/tabs'

// Demo data
const weeklyData = [
  { day: 'Mon', orders: 380 },
  { day: 'Tue', orders: 490 },
  { day: 'Wed', orders: 210 },
  { day: 'Thu', orders: 340 },
  { day: 'Fri', orders: 280 },
  { day: 'Sat', orders: 90 },
  { day: 'Sun', orders: 40 },
]

const monthlyData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  orders: Math.floor(Math.random() * 500),
}))

const yearlyData = Array.from({ length: 12 }, (_, i) => ({
  day: new Date(0, i).toLocaleString('default', { month: 'short' }),
  orders: Math.floor(Math.random() * 600),
}))

const chartConfig = {
  orders: {
    label: 'Orders',
    color: '#9253EA',
  },
} satisfies ChartConfig

export default function OrdersChartCard() {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const chartData =
    period === 'weekly' ? weeklyData : period === 'monthly' ? monthlyData : yearlyData

  return (
    <div className="flex flex-col w-full min-h-[400px] rounded-2xl border bg-white p-4 sm:p-6 lg:p-8 shadow-sm dark:bg-neutral-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h6 className="text-sm md:text-base text-subtitle">Total Orders</h6>

        {/* Controls aligned right */}
        <div className="flex items-center gap-2">
          <select className="rounded-md border bg-transparent pl-3 pr-7 py-2 text-xs md:text-sm">
            <option>Bar</option>
            <option>Line</option>
            <option>Area</option>
          </select>

          <div className="flex rounded-md border divide-x">
            <button className="p-2">
              <ArrowLeft2 className="h-4 w-4" />
            </button>
            <button className="p-2">
              <ArrowRight2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">1,583</h2>
        <div className="mt-2 flex items-center gap-1 text-purple-600">
          <Bullish1 className="h-4 w-4" />
          <span className="text-xs sm:text-sm">+8.2% from previous period</span>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 w-full min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:min-h-[350px] max-h-[400px]">
        <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
          <BarChart data={chartData} margin={{ top: 10, right: 12, bottom: 10, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} tickMargin={10} fontSize={12} />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="orders"
              radius={[6, 6, 0, 0]}
              barSize={Math.max(20, 40 / (chartData.length / 7))} // Responsive bar size
              onMouseOver={(_, index) => setActiveIndex(index)}
              onMouseOut={() => setActiveIndex(null)}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={activeIndex === index ? '#B592F3' : '#9253EA'} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>

      {/* Footer Tabs */}
      <div className="mt-6 sm:mt-8 md:mt-10 flex justify-center ">
        <Tabs defaultValue="weekly" onValueChange={(v) => setPeriod(v as typeof period)}>
          <TabsList className="grid grid-cols-3 w-full sm:w-auto min-w-[200px]  rounded-md border bg-neutral-100 dark:bg-neutral-800">
            <TabsTrigger value="weekly" className="text-xs sm:text-sm">
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs sm:text-sm">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="yearly" className="text-xs sm:text-sm">
              Yearly
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
