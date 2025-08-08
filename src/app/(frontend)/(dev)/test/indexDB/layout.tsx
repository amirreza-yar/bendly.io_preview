import { DBProviders } from '@/providers/indexDB'
import { fetchPayloadSchema } from '@/lib/fetchSchema'

export default async function TestLayout({ children }: { children: React.ReactNode }) {
  const schema = await fetchPayloadSchema()

  return <DBProviders schema={schema}>{children}</DBProviders>
}
