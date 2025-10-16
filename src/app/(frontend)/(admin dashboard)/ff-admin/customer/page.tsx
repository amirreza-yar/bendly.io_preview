'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import CustomerCard from '@/components/admin/cards/customercard'
import { Search } from 'lucide-react'
import { PlusIcon } from '@/components/uikit/icons'

export default function AdminDashboardCustomers() {
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const router = useRouter()

  const customerData = [
    {
      id: '1',
      name: 'Mike Oldfield',
      email: 'Mike@example.com',
      phone: '+610412364625',
      totalOrder: 10,
      totalSpend: 1264000,
    },
    {
      id: '2',
      name: 'Jane Doe',
      email: 'Jane@example.com',
      phone: '+610412364626',
      totalOrder: 8,
      totalSpend: 950000,
    },
    {
      id: '3',
      name: 'John Smith',
      email: 'John@example.com',
      phone: '+610412364627',
      totalOrder: 12,
      totalSpend: 1500000,
    },
    {
      id: '4',
      name: 'Emma Wilson',
      email: 'Emma@example.com',
      phone: '+610412364628',
      totalOrder: 5,
      totalSpend: 600000,
    },
    {
      id: '5',
      name: 'Emma Wilson',
      email: 'Emma@example.com',
      phone: '+610412364628',
      totalOrder: 5,
      totalSpend: 600000,
    },
    {
      id: '6',
      name: 'Emma Wilson',
      email: 'Emma@example.com',
      phone: '+610412364628',
      totalOrder: 5,
      totalSpend: 600000,
    },
  ]

  // Filter customerData based on search query
  const matchesSearch = (data: (typeof customerData)[0]) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      data.name.toLowerCase().includes(query) ||
      data.email.toLowerCase().includes(query) ||
      data.phone.toLowerCase().includes(query)
    )
  }

  // Filter customers to display
  const displayData = customerData.filter(matchesSearch)

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-slate-lightest">
        <div className="mx-6">
          <div className="w-full h-11 flex flex-col sm:flex-row sm:justify-between items-center mt-6 mb-5 gap-4 sm:gap-0">
            <div className="w-full max-w-md flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <Search className="h-5 w-5 text-gray-500 mr-2" />
              <input
                type="search"
                name="search"
                placeholder="Search by name, email, mobile number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm focus:outline-none"
              />
            </div>
            <button
              onClick={() => router.push('/add-customer')}
              className="w-full max-w-xs sm:w-auto sm:max-w-none flex items-center justify-center gap-2 px-4 py-2 sm:px-3 sm:py-2 sm:text-sm border border-border-primary text-primary rounded-md hover:bg-blue-200 "
            >
              <PlusIcon className="h-6 w-6 sm:h-5 sm:w-5 mr-2 sm:mr-1" />
              Add New Customer
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-6 md:gap-y-4 min-w-0">
            {displayData.length > 0 ? (
              displayData.map((customer, index) => (
                <div
                  key={index}
                  onClick={() => router.push(`/ff-admin/customer/customerdetails/customerdetails/`)}
                  className="w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                >
                  <CustomerCard data={customer} />
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 col-span-full">
                <p>No results found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
