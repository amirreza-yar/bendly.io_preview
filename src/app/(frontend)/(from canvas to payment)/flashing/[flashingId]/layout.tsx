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
      <div className="bg-surface-page-body text-body">
        {/* <Toaster
        position="bottom-center"
        mobileOffset={{ bottom: '96px', right: '0', left: '0' }}
        toastOptions={{
          unstyled: true,
          classNames: {
            toast: 'bg-[#171717] -fit px-6 py-[12.5px] rounded-md max-w-fit mx-auto shadow-md',
            title: 'font-roboto text-xs/[22.5px] text-white',
          },
        }}
        duration={2000}
      /> */}
        {children}
      </div>
    </NewFlashingProvider>
  )
}
