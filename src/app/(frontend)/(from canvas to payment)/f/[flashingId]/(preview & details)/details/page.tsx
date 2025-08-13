'use client'
import React from 'react'
import Link from 'next/link'
import { notFound, useParams, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/uikit/buttons/button'
import { ArrowLeft } from '@/components/uikit/icons'
import DetailsForm from '@/components/dashboard/order/DetailsForm'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import DetailsComponent, { DetailsFormValues } from '@/components/flashing/details/detailsComponent'
import { getOrderById, initNewOrder, upsertPartialOrder } from '@/lib/db/helpers/orderHelpers'
import { getFlashingById } from '@/lib/db/helpers/flashingHelpers'
import { Specification, StoredOrder, StoredOrderFlashing } from '@/types/orderTypes'
import { generateRandomId } from '@/lib/db/helpers/utils'
import { toast } from 'sonner'

export default function DetailsPage() {
  const { flashingId }: { flashingId: string } = useParams()
  const searchParams = useSearchParams()

  const orderId = searchParams.get('orderId')

  const order = getOrderById(Number(orderId))

  const router = useRouter()

  const flashing = getFlashingById(flashingId)

  const onModalDiscardChanges = () => {
    router.push(`/new-order/${orderId}`)
  }

  const onDetailsFormSubmit = async (data: DetailsFormValues) => {
    const specificationsToBeStored: Specification[] = data.specifications.map((spec) => ({
      ...spec,
      id: generateRandomId({ length: 4 }),
      flashingId: flashing?.id ?? '',
    }))

    const newFlashing: StoredOrderFlashing = {
      id: flashing?.id ?? '',
      code: data.code,
      position: data.position,
      specifications: specificationsToBeStored,
    }

    const newOrderFlashing: Partial<StoredOrder> = {
      flashings: [newFlashing],
    }

    if (order) {
      console.log(order, orderId)
      upsertPartialOrder(Number(orderId), newOrderFlashing).then((orderId) => {
        router.push(`/new-order/${order.id}`)
        toast('Your changes have been saved')
      })
    } else {
      initNewOrder(newOrderFlashing).then((orderId) => {
        router.push(`/new-order/${orderId}`)
      })
    }
  }

  return (
    <>
      <DetailsComponent
        onDetailsFormSubmit={onDetailsFormSubmit}
        order={order}
        flashingId={flashingId}
        onModalDiscardChanges={onModalDiscardChanges}
        title={order ? 'Edit Details' : 'Details'}
      />
    </>
  )
}
