'use client'
import { notFound, useParams } from 'next/navigation'
import { jobReferences } from '@/utilities/demo_datas/demoJobRefData'
import Link from 'next/link'
import { ArrowLeft } from '@/components/uikit/icons'
import { ButtonListItem } from '@/components/uikit/buttons/buttonListItem'
import { Separator } from '@/components/uikit/separator'
import { getJobRefAddressByIds } from '@/lib/db/helpers/jobRefHelpers'
import { Header } from '@/components/dashboard/header'

export default function EditAddressPage() {
  const { jobId, addressId, orderId } = useParams<{
    jobId: string
    addressId: string
    orderId: string
  }>()

  const address = getJobRefAddressByIds(jobId, addressId)

  if (address === undefined) {
    notFound()
  }

  return (
    <>
      <Header title="Edit Address" returnHref={`/o/${orderId}/delivery-ship/j/${jobId}`} />

      <div className="overflow-scroll w-full h-full pt-18 pb-22 px-4 no-scrollbar">
        <div className="grid gap-3">
          <Link href={`/o/${orderId}/delivery-ship/j/${jobId}/${addressId}/edit-address-details`}>
            <ButtonListItem text="Edit Address Details" />
          </Link>
          <Separator />
          <Link href={`/o/${orderId}/delivery-ship/j/${jobId}/${addressId}/edit-recipient`}>
            <ButtonListItem text="Edit Recipient" />
          </Link>
        </div>
      </div>
    </>
  )
}
