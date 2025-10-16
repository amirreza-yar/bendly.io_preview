'use client'

import * as React from 'react'

interface CustomerCardProps {
  data?: {
    totalSpend: number
  }
}

export default function TotalSpend({ data }: CustomerCardProps) {
  const customerdata = {
    totalSpend: 9,
  }

  const displayData = data || customerdata

  return (
    <>
      <div className="w-[259px] border rounded-lg h-30 bg-attention-lightest">
        <div className="px-4 py-4 flex-col text-center gap-1">
          <h5 className="text-smd py-2">Total Spend</h5>
          <h2 className="font-bold">{displayData.totalSpend}</h2>
        </div>
      </div>
    </>
  )
}
