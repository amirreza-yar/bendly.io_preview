import { db } from '@/lib/db/appDB'
import { DBProviders } from '@/providers/indexDB'

// const testSchema = {
//   collctions: {

//   },
//   schema: 9876,
// }

export default async function TestLayout({ children }: { children: React.ReactNode }) {
  // return <DBProviders schema={testSchema}>{children}</DBProviders>

  // ;(async () => {
  //   await db.open()
  //   // await db.users.put({
  //   //   id: 'testing',
  //   //   name: 'amirreza',
  //   //   email: 'yar.amirreza@gmail.com',
  //   //   createdAt: Date.now(),
  //   // })
  // })()

  return <>{children}</>
}
