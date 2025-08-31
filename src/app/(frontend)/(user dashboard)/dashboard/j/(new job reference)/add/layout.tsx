import { NewJobReferenceProvider } from '@/providers/data_providers/job_reference_providers/AddJobReferenceContext' // adjust path accordingly

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <NewJobReferenceProvider>{children}</NewJobReferenceProvider>
}
