'use client'

import * as React from 'react'

interface CustomerCardProps {
  data?: {
    totalOrder: number
  }
}

export default function TotalOrders({ data }: CustomerCardProps) {
  const customerdata = {
    totalOrder: 9,
  }

  const displayData = data || customerdata

  return (
    <>
      <div className="w-[259px] border rounded-lg h-30 bg-[#FCEAD8]">
        <div className="px-4 py-4 flex-col text-center gap-1">
          <h5 className="text-smd py-2">Total Orders</h5>
          <h2 className="font-bold">{displayData.totalOrder}</h2>
        </div>
      </div>
    </>
  )
}
