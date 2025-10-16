'use client'

import AvgOrder from '@/components/admin/cards/avgorder'
import CustomerDetailsCard from '@/components/admin/cards/customerdetailscard'
import TotalOrders from '@/components/admin/cards/totalorders'
import TotalSpend from '@/components/admin/cards/totalspend'
import { CustomerOrderTable } from '@/components/admin/tables/ordermanagement'
import * as React from 'react'

export default function CustomerDetails() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-6 bg-slate-lightest justify-between">
      {/* ====== Row 1 ====== */}
      <div className="flex flex-col md:flex-row gap-6 h-100">
        {/* Left item */}
        <div className="flex-1 w-full h-full">
          <CustomerDetailsCard />
        </div>

        {/* Middle item */}
        <div className="flex-1 bg-white rounded-lg border p-4 flex items-center justify-center w-113 ">
          <p className="text-gray-500 text-sm">Middle section (placeholder)</p>
        </div>

        {/* Right item (has 3 stacked sections) */}
        <div className="flex-1 flex flex-col gap-5 items-end w-[259px]">
          <div className="">
            <TotalOrders />
          </div>
          <div className="">
            <TotalSpend />
          </div>
          <div className="">
            <AvgOrder />
          </div>
        </div>
      </div>

      {/* ====== Row 2 ====== */}
      <div className="bg-white rounded-lg border p-4 mt-8">
        <CustomerOrderTable />
      </div>
    </div>
  )
}
