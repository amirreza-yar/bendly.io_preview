'use client'
import { Button } from '@/components/uikit/buttons/button'
import { BackRedirectOnThisPage } from '@/hooks/browserBackRedirect'
import { upsertPartialOrder, useGETOrderById } from '@/lib/db/helpers/orderHelpers'
import { notFound, redirect, useParams, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function PaymentResultPage() {
  const { orderId } = useParams<{ orderId: string }>()

  const router = useRouter()
  const stampedRef = useRef(false)

  const order = useGETOrderById(Number(orderId))

  useEffect(() => {
    // run once per mount
    if (stampedRef.current || !order) return
    stampedRef.current = true

    // best-effort: set completed=true (ignore if already true)
    if (!order?.completed) {
      console.log(order?.completed)
      void upsertPartialOrder(Number(orderId), { completed: true })
    } else {
      void upsertPartialOrder(Number(orderId), { hasSeenPayResult: true })
      notFound()
    }
  }, [orderId, order])

  const goHomeHandler = async () => {
    await upsertPartialOrder(Number(orderId), {
      hasSeenPayResult: true,
    })

    router.push('/dashboard')
  }

  const trackOrderHandler = async () => {
    await upsertPartialOrder(Number(orderId), {
      hasSeenPayResult: true,
    })

    router.push(`/dashboard/orders/${orderId}`)
  }

  return (
    <>
      <BackRedirectOnThisPage />
      <div className="h-screen w-screen flex items-center text-center justify-center">
        <div className="grid gap-6 px-4">
          <h4 className="font-semibold text-[20px]/[27px]">Your Pay Successful</h4>
          <p className="subtitle-large">
            You’ll receive your delivery code once your order is ready
          </p>
          <Button variant="secondary" onClick={trackOrderHandler}>
            Track Order
          </Button>
          <Button variant="secondary" onClick={goHomeHandler}>
            Go Home
          </Button>
        </div>
      </div>
    </>
  )
}
