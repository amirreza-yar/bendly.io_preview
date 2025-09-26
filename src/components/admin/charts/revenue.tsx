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
import { useState } from 'react'
import { cn } from '@/utilities/ui'

import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Bullish1, ArrowLeft2, ArrowRight2 } from '@/components/uikit/icons'
import { Tabs, TabsList, TabsTrigger } from '@/components/uikit/tabs'

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

  const chartData =
    period === 'weekly' ? weeklyData : period === 'monthly' ? monthlyData : yearlyData

  return (
    <div className="rounded-2xl border bg-white p-6 h-140 shadow-sm dark:bg-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-smd text-subtitle mt-6">Total Revenue</h6>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 mt-6">
          <select className="rounded-md border bg-transparent pl-4 pr-7 py-2 text-sm">
            <option>Spline</option>
            <option>Bar</option>
            <option>Line</option>
          </select>

          {/* Arrow buttons grouped with separator */}
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
      <div className="mt-2">
        <h2 className="text-xl font-bold">$45,577.00</h2>
        <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
          <Bullish1 className="h-4 w-4" />
          <span className="text-xs">+4.2% from previous period</span>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 h-64">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={14} // space below labels
              />
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
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Footer Tabs */}
      <div className="mt-13 flex items-center justify-center">
        <Tabs defaultValue="weekly" onValueChange={(v) => setPeriod(v as typeof period)}>
          <TabsList className="grid grid-cols-3 rounded-md border bg-neutral-100 dark:bg-neutral-800">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
