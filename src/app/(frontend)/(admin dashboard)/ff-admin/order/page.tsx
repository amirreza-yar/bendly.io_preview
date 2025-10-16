'use client'
import * as React from 'react'
import { CustomerOrderTable } from '@/components/admin/tables/ordermanagement'
export default function AdminDashboardOrderManagement() {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-[#F1F5F9]">
        <div className="mt-8 bg-white border rounded-lg">
          <CustomerOrderTable />
        </div>
      </div>
    </>
  )
}
