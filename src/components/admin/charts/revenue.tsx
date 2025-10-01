'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Bar, BarChart, Cell } from 'recharts'
import { useState } from 'react'

import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Bullish1, ArrowLeft2, ArrowRight2 } from '@/components/uikit/icons'
import { Tabs, TabsList, TabsTrigger } from '@/components/uikit/tabs'
import { Select } from '@/components/uikit/select'

// Demo data
const weeklyData = [
  { day: 'Mon', revenue: 21000 },
  { day: 'Tue', revenue: 18000 },
  { day: 'Wed', revenue: 25000 },
  { day: 'Thu', revenue: 39850 },
  { day: 'Fri', revenue: 22000 },
  { day: 'Sat', revenue: 5000 },
  { day: 'Sun', revenue: 2000 },
]

const weeklyData2 = [
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
  revenue: Math.floor(Math.random() * 40000),
}))

const yearlyData = Array.from({ length: 12 }, (_, i) => ({
  day: new Date(0, i).toLocaleString('default', { month: 'short' }),
  revenue: Math.floor(Math.random() * 50000),
}))

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: '#22c55e',
  },
} satisfies ChartConfig

export default function RevenueChartCard() {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly')

  const [chartType, setChartType] = useState('AR')

  const chartData =
    period === 'weekly' ? weeklyData : period === 'monthly' ? monthlyData : yearlyData

  return (
    <div className="w-full rounded-2xl border bg-white p-4 sm:p-6 lg:p-8 shadow-sm dark:bg-neutral-900 h-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
        <div>
          <h6 className="text-sm md:text-base text-subtitle">Total Revenue</h6>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Select
            items={[
              { value: 'AR', label: 'Area' },
              { value: 'BA', label: 'Bar' },
            ]}
            defaultValue="AR"
            onValueChange={(val) => {
              setChartType(val)
            }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">$45,577.00</h2>
        <div className="mt-2 flex items-center gap-1 text-green-600">
          <Bullish1 className="h-4 w-4" />
          <span className="text-xs sm:text-sm">+4.2% from previous period</span>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 w-full">
        {chartType === 'AR' ? (
          <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
            <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                fill="url(#fillRevenue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[350px] w-full">
            <BarChart data={weeklyData2} margin={{ top: 10, right: 12, bottom: 10, left: 0 }}>
              <CartesianGrid vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={12}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={10} fontSize={12} />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="orders"
                radius={[6, 6, 0, 0]}
                barSize={Math.max(20, 40 / (weeklyData2.length / 7))} // Responsive bar size
              >
                {weeklyData2.map((_, index) => (
                  <Cell key={`cell-${index}`} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
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
