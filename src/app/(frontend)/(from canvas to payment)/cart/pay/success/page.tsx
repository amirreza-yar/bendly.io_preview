'use client'

import { Button } from '@/components/uikit/buttons/button'
import { FeaturedSuccess } from '@/components/uikit/icons'
import { fetcher } from '@/lib/axios'
import { Download } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'

export default function SuccessPayPage() {
  const searchParams = useSearchParams
  const transId = searchParams().get('id')
  const orderId = searchParams().get('orderId')

  const { data: order, isLoading, error } = useSWR(`/d/order/${orderId}`, fetcher)

  //   const cart = await api.get(`/d/order/${orderId}`)

  console.log(order)

  return (
    <>
      <div className="w-full h-full flex flex-col gap-6 items-center justify-center">
        <div className="grid text-center p-4 gap-2 bg-gray-50 border border-gray-200 rounded-md">
          <FeaturedSuccess className="size-12 w-full my-6" />
          <h5>Payment successfull</h5>
          <p className="text-[13px]">Your order has been submitted</p>
          <div className="flex items-center gap-4 justify-between">
            <p className="text-[13px]">Transaction ID</p>
            <p className="text-[13px] font-bold">{transId}</p>
          </div>
          <div className="flex items-center gap-4 justify-between">
            <p className="text-[13px]">Order ID</p>
            <p className="text-[13px] font-bold">{orderId}</p>
          </div>
          <div className="flex items-center gap-4 justify-between">
            <p className="text-[13px]">Date</p>
            <p className="text-[13px] font-bold">
              {new Date(order?.created_at).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <Button size="default" variant="ghost" className="mt-2 bg-gray-50">
            Get Reciept
            <Download />
          </Button>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-84">
          <Link href={`/dashboard/orders/${orderId}`} className="w-full">
            <Button className="w-full">Track Order</Button>
          </Link>
          <Link href={`/dashboard`} className="w-full">
            <Button variant="ghost" className="w-full">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
