'use client'

import { usePageNavigationAppRouter } from '@/hooks/usePageNavigationRouter'
import { getFlashingById } from '@/lib/db/helpers/flashingHelpers'
import { looksLikeGeneratedId } from '@/lib/db/helpers/utils'
import { notFound, redirect, useParams } from 'next/navigation'

export default function FlashingSlugCheckPage() {
  const { isBusy } = usePageNavigationAppRouter()

  if (isBusy) {
    return <div>Loading</div>
  }

  const { flashingId }: { flashingId: string } = useParams()

  const doesLooksLikeGeneratedId = looksLikeGeneratedId(flashingId)

  if (doesLooksLikeGeneratedId) {
    const flashing = getFlashingById(flashingId)

    if (flashing && !flashing.isDraft) {
      return redirect(`/flashing/${flashingId}/canvas`)
    } else {
      return redirect(`/flashing/${flashingId}/material-properties`)
    }
  } else {
    console.log('not found')
    notFound()
  }
}
