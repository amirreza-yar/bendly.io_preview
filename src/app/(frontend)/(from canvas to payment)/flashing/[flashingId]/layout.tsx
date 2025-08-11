import { looksLikeGeneratedId } from '@/lib/db/helpers/utils'
import { NewFlashingProvider } from '@/providers/data_providers/flashing_providers/NewFlashingContext'
import { notFound } from 'next/navigation'
import { Toaster } from 'sonner'

export const metadata = {
  title: 'Flashing Page',
}

export default async function AppLayout({
  children,
  params: paramsPromise,
  ...props
}: {
  children: React.ReactNode
  params: Promise<{ flashingId: string }>
}) {
  const { flashingId } = await paramsPromise
  const doesLooksLikeGeneratedId = looksLikeGeneratedId(flashingId)

  if (!doesLooksLikeGeneratedId) {
    notFound()
  }

  return (
    <NewFlashingProvider>
      <div className="bg-surface-page-body text-body">{children}</div>
    </NewFlashingProvider>
  )
}
