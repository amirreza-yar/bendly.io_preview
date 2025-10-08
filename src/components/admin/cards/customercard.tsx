'use client'

import * as React from 'react'

export default function CustomerCard() {
  const [data, setData] = React.useState<any>(null)
  const customerData = {
    name: 'Mike Oldfield',
    email: 'Mike@example.com',
    phone: '+610412364625',
    totalOrder: 10,
    totalSpend: 1264000,
  }

  // React.useEffect(() => {
  //   async function fetchData() {
  //     const res = await fetch('/api/customer')
  //     const json = await res.json()
  //     setData(json)
  //   }
  //   fetchData()
  // }, [])

  // if (!data) {
  //   return (
  //     <div className="border rounded-lg w-[357px] h-[201px] bg-white flex items-center justify-center">
  //       <p>Loading...</p>
  //     </div>
  //   )
  // }

  return (
    <div className="border rounded-lg w-[357px] h-[201px] bg-white space-y-5 px-6">
      <div className="mt-6">
        <h6 className="mr-6">{data.name}</h6>
        <p className="text-subtitle">{data.email}</p>
        <p className="text-subtitle">{data.phone}</p>
      </div>
      <div className="w-full h-13 flex-col mb-6">
        <div className="flex justify-between">
          <p>Total Order</p>
          <p>{data.totalOrder}</p>
        </div>
        <div className="flex justify-between">
          <p>Total Spend</p>
          <p>${data.totalSpend.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
