'use client'

import { usePageNavigationAppRouter } from '@/hooks/usePageNavigationRouter'
import { getFlashingById } from '@/lib/db/helpers/flashingHelpers'
import { looksLikeGeneratedId } from '@/lib/db/helpers/utils'
import { notFound, redirect, useParams, useSearchParams } from 'next/navigation'

export default function FlashingSlugCheckPage() {
  const { isBusy } = usePageNavigationAppRouter()

  if (isBusy) {
    return <div>Loading</div>
  }

  const { flashingId }: { flashingId: string } = useParams()

  const orderId = useSearchParams().get('orderId')

  const doesLooksLikeGeneratedId = looksLikeGeneratedId(flashingId)

  if (doesLooksLikeGeneratedId) {
    const flashing = getFlashingById(flashingId)

    if (flashing && !flashing.isDraft) {
      return redirect(`/f/${flashingId}/canvas`)
    } else {
      return redirect(`/f/${flashingId}/material-properties?orderId=${orderId}`)
    }
  } else {
    console.log('not found')
    notFound()
  }
}
