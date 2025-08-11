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
import { useParams, useRouter } from 'next/navigation'
import { getMaterialsAndProprs } from '@/lib/db/helpers/materials&PropsHelpers'

export default function SelectMaterialAndColorPage() {
  const router = useRouter()

  const { flashingId }: { flashingId: string } = useParams()
  const savedFlashing = getFlashingById(flashingId)
  const materialsWithProperties = getMaterialsAndProprs()

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

    router.push(`/flashing/${flashingId}/preview`)

    toast('Flashing material and property was updated')
  }

  if (savedFlashing) {
    return (
      <>
        <Header
          title="Select Material & Properties"
          returnHref={`/flashing/${flashingId}/preview`}
        />

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
