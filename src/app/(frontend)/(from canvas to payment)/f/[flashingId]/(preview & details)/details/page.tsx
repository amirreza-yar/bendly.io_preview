'use client'
import React from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import DetailsComponent, { DetailsFormValues } from '@/components/flashing/details/detailsComponent'
import { useGETOrderById, initNewOrder, upsertPartialOrder } from '@/lib/db/helpers/orderHelpers'
import {
  useGETFlashingById,
  removeOrderIdToBeSavedFromFlashingById,
} from '@/lib/db/helpers/flashingHelpers'
import { Specification, StoredOrder, StoredOrderFlashing } from '@/types/orderTypes'
import { generateRandomId } from '@/lib/db/helpers/utils'
import { toast } from 'sonner'

export default function DetailsPage() {
  const { flashingId }: { flashingId: string } = useParams()
  const searchParams = useSearchParams()

  const orderId = searchParams.get('orderId')

  const order = useGETOrderById(Number(orderId))

  const router = useRouter()

  const flashing = useGETFlashingById(flashingId)

  const onModalDiscardChanges = () => {
    router.push(`/o/${orderId}/review`)
  }

  const onDetailsFormSubmit = async (data: DetailsFormValues) => {
    const specificationsToBeStored: Specification[] = data.specifications.map((spec) => ({
      ...spec,
      id: generateRandomId({ length: 4 }),
      flashingId: flashing?.id ?? '',
    }))

    const orderIdToBeSaved = flashing?.orderIdToBeSaved

    if (flashing?.orderIdToBeSaved) {
      removeOrderIdToBeSavedFromFlashingById(flashing.id)
    }

    const newFlashing: StoredOrderFlashing = {
      id: flashing?.id ?? '',
      code: data.code,
      position: data.position,
      specifications: specificationsToBeStored,
    }

    const newOrderFlashing: Partial<StoredOrder> = {
      flashings: [newFlashing],
    }

    if (orderIdToBeSaved) {
      upsertPartialOrder(Number(orderIdToBeSaved), newOrderFlashing).then((orderId) => {
        router.push(`/o/${orderIdToBeSaved}/review`)
        toast('New flashing added')
      })
    } else if (order) {
      console.log(order, orderId)
      upsertPartialOrder(Number(orderId), newOrderFlashing).then((orderId) => {
        router.push(`/o/${order.id}/review`)
        toast('Your changes have been saved')
      })
    } else {
      initNewOrder(newOrderFlashing).then((orderId) => {
        router.push(`/o/${orderId}/review`)
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
