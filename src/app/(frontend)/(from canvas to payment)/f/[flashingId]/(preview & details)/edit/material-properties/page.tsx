'use client'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { UseFormReturn } from 'react-hook-form'

import { db } from '@/lib/db/appDB'
import { useLiveQuery } from 'dexie-react-hooks'
import { getFlashingById, upsertPartialFlashing } from '@/lib/db/helpers/flashingHelpers'
import MaterialAndPropertiesSelector, {
  MaterialAndPropFormValues,
} from '@/components/flashing/material&PropertiesSelector'
import { toast } from 'sonner'
import { notFound, useParams, useRouter, useSearchParams } from 'next/navigation'
import { useGETMaterialsAndProprs } from '@/lib/db/helpers/materials&PropsHelpers'
import { useGETOrderById } from '@/lib/db/helpers/orderHelpers'

export default function SelectMaterialAndColorPage() {
  const searchParams = useSearchParams()

  const orderId = searchParams.get('orderId')

  const next = searchParams.get('next')

  const order = useGETOrderById(Number(orderId))

  if (!(next === 'preview' || next === 'order')) return notFound()
  else if (next === 'order' && !orderId) return notFound()

  const router = useRouter()

  const { flashingId }: { flashingId: string } = useParams()
  const savedFlashing = useGETFlashingById(flashingId)
  const materialsWithProperties = useGETMaterialsAndProprs()

  const onSubmit = (
    data: MaterialAndPropFormValues,
    form: UseFormReturn<MaterialAndPropFormValues>,
  ) => {
    if (data.material && (data.color || data.thicknessCode)) {
      if (data.color) {
        const colorCode = materialsWithProperties
          ?.find((obj) => obj.material === data.material)
          ?.colors?.find((obj) => obj.name === data.color)?.code

        upsertPartialFlashing(flashingId, {
          material: data.material,
          color: { name: data.color || '', code: colorCode || '' },
          thickness: undefined,
        })
      } else if (data.thicknessCode) {
        const thickness = materialsWithProperties
          ?.find((obj) => obj.material === data.material)
          ?.thicknesses?.find((obj) => obj.code === data.thicknessCode)?.thickness

        upsertPartialFlashing(flashingId, {
          material: data.material,
          thickness: { code: data.thicknessCode || '', thickness: thickness || 0 },
          color: undefined,
        })
      }
    }

    if (data.color && !(savedFlashing?.startCrushFold || savedFlashing?.endCrushFold)) {
      if (next === 'order' && orderId) {
        router.push(`/f/${flashingId}/edit/color-side?next=order&orderId=${orderId}`)
      } else if (next === 'preview') {
        router.push(`/f/${flashingId}/edit/color-side?next=preview`)
      }
    } else {
      if (order) {
        router.push(`/o/${order.id}/review`)
      } else {
        router.push(`/f/${flashingId}/preview`)
      }
    }
    toast('Flashing material and property was updated')
  }

  if (savedFlashing) {
    return (
      <>
        {order ? (
          <Header title="Select Material & Properties" returnHref={`/o/${order.id}/review`} />
        ) : (
          <Header title="Select Material & Properties" returnHref={`/f/${flashingId}/preview`} />
        )}

        <ContentWrapper className="bg-white pt-18 pb-22">
          <MaterialAndPropertiesSelector
            materialsWithProperties={materialsWithProperties}
            onMaterialAndPropsSubmit={onSubmit}
            flashing={savedFlashing}
          />
        </ContentWrapper>
      </>
    )
  }
}
