import { NewAddressProvider } from '@/providers/data_providers/job_reference_providers/NewAddressContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <NewAddressProvider>{children}</NewAddressProvider>
}
