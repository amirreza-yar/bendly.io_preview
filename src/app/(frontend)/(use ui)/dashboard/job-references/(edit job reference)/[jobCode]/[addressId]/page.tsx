import { notFound } from 'next/navigation'
import { jobReferences } from '@/utilities/demoJobRefData'
import Link from 'next/link'
import { ArrowLeft } from '@/components/uikit/icons'
import { ButtonListItem } from '@/components/uikit/buttons/buttonListItem'
import { Separator } from '@/components/uikit/separator'

export default async function EditAddressPage({
  params,
}: {
  params: Promise<{ jobCode: number; addressId: string }>
}) {
  const { jobCode, addressId } = await params

  const address = jobReferences
    .find((job) => job.code === jobCode)
    .addresses.find((addr) => addr.id === addressId)

  if (!address) {
    notFound()
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-center z-10 bg-white border-b-1 border-border-dark">
        <div className="flex items-center justify-between h-full w-full px-4">
          <div className="flex items-center gap-[18px] pr-3">
            <Link href={`/dashboard/job-references/${jobCode}`}>
              <ArrowLeft />
            </Link>
            <h6>Edit Address</h6>
          </div>
        </div>
      </header>

      <div className="overflow-scroll w-full h-full pt-18 pb-22 px-4 no-scrollbar">
        <div className="grid gap-3">
          <Link href={`/dashboard/job-references/${jobCode}/${addressId}/edit-address-details`}>
            <ButtonListItem text="Edit Address Details" />
          </Link>
          <Separator className />
          <Link href={`/dashboard/job-references/${jobCode}/${addressId}/edit-recipient`}>
            <ButtonListItem text="Edit Recipient" />
          </Link>
        </div>
      </div>
    </>
  )
}
