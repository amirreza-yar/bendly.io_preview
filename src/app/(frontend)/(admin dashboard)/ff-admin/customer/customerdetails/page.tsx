'use client'

import AvgOrder from '@/components/admin/cards/avgorder'
import CustomerDetailsCard from '@/components/admin/cards/customerdetailscard'
import TotalOrders from '@/components/admin/cards/totalorders'
import TotalSpend from '@/components/admin/cards/totalspend'
import { CustomerOrderTable } from '@/components/admin/tables/ordermanagement'

export default function CustomerDetails() {
  return (
    <div className="flex flex-col min-h-screen gap-4 p-4 sm:p-6 bg-slate-100">
      {/* ====== Row 1 ====== */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left item */}
        <div className="flex-1 w-full">
          <CustomerDetailsCard />
        </div>

        {/* Middle item */}
        <div className="flex-1 w-full bg-white rounded-lg border p-4 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Middle section (placeholder)</p>
        </div>

        {/* Right item (stacked cards) */}
        <div className="flex-1 w-full flex flex-col gap-4 lg:max-w-[300px]">
          <TotalOrders />
          <TotalSpend />
          <AvgOrder />
        </div>
      </div>

      {/* ====== Row 2 ====== */}
      <div className="w-full mt-6 bg-white border rounded-lg">
        <CustomerOrderTable />
      </div>
    </div>
  )
}
