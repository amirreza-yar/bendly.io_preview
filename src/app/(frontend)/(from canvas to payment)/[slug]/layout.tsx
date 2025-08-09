import { NewFlashingProvider } from '@/providers/data_providers/flashing_providers/NewFlashingContext'
import { Toaster } from 'sonner'

export const metadata = {
  title: 'Order Proceed Page',
}

function generateRandomId(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    result += chars[randomIndex]
  }
  return result
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
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
