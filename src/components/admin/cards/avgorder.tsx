'use client'

import * as React from 'react'

interface CustomerCardProps {
  data?: {
    avgOrder: string
  }
}

export default function AvgOrder({ data }: CustomerCardProps) {
  const customerdata = {
    avgOrder: '$1456.23',
  }

  const displayData = data || customerdata

  return (
    <>
      <div className="w-[259px] border rounded-lg h-30 bg-success-lightest">
        <div className="px-4 py-4 flex-col text-center gap-1">
          <h5 className="text-smd py-2">Avg. Order</h5>
          <h2 className="font-bold">{displayData.avgOrder}</h2>
        </div>
      </div>
    </>
  )
}
