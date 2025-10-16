'use client'

import * as React from 'react'

interface CustomerCardProps {
  data?: {
    name: string
    email: string
    phone: string
    totalOrder: number
    totalSpend: number
  }
}

export default function CustomerCard({ data }: CustomerCardProps) {
  const customerData = {
    name: 'Mike Oldfield',
    email: 'Mike@example.com',
    phone: '+610412364625',
    totalOrder: 10,
    totalSpend: 1264000,
  }

  // Use provided data or fallback to customerData
  const displayData = data || customerData

  return (
    <div className="border rounded-lg w-full h-[201px] bg-white space-y-5 px-6">
      <div className="mt-6">
        <h6 className="mr-6">{displayData.name}</h6>
        <p className="text-subtitle">{displayData.email}</p>
        <p className="text-subtitle">{displayData.phone}</p>
      </div>
      <div className="w-full h-13 flex-col mb-6">
        <div className="flex justify-between">
          <p>Total Order</p>
          <p>{displayData.totalOrder}</p>
        </div>
        <div className="flex justify-between">
          <p>Total Spend</p>
          <p>${displayData.totalSpend.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
