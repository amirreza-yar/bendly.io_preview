import { JobReference } from '@/utilities/demo_datas/demoJobRefData'
import { Edit, MapMarker, ProfileNav, Remove } from '@/components/uikit/icons'
import Link from 'next/link'
import { RemoveJobRefAddressModal } from './modals'
import { StoredAddress, StoredJobReference } from '@/types/jobReferenceTypes'

interface JobRefAddressCardProps {
  address: StoredAddress
  jobId: string
  onJobRefAddressDelete: (addressId: string) => void
}

export function JobRefAddressCard({
  address,
  jobId,
  onJobRefAddressDelete,
  ...props
}: JobRefAddressCardProps) {
  return (
    <div
      {...props}
      data-slot="card"
      className="rounded-md border-1 border-border-default bg-surface-card py-3 px-4 relative"
    >
      <div className="grid gap-2">
        <div className="flex gap-2">
          <MapMarker className="size-5" />
          <div className="grid gap-1">
            <p className="label-regular truncate">{address.title}</p>
            <p className="body-small truncate">
              {address.streetAddress}, {address.suburb}, {address.state} {address.postcode}{' '}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <ProfileNav className="size-5 mt-[2px]" />
          <div className="grid gap-1">
            <p className="body-small truncate">
              {address.recipientName} {address.recipientMobile}
            </p>
          </div>
        </div>
        <div className="flex justify-end items-center [&_svg]:size-5 gap-6">
          <RemoveJobRefAddressModal
            trigger={<Remove />}
            onJobRefAddressDelete={() => onJobRefAddressDelete(address.id)}
          />
          <Link href={`/dashboard/j/${jobId}/${address.id}`}>
            <Edit />
          </Link>
        </div>
      </div>
    </div>
  )
}

interface JobRefInfoCardProps {
  jobReference: StoredJobReference | null
}

export function JobRefInfoCard({ jobReference }: JobRefInfoCardProps) {
  return (
    <Link
      href={`/dashboard/j/${jobReference?.id}/edit-info`}
      data-slot="card"
      className="grid gap-4 items-center rounded-md border-1 border-border-default bg-surface-card py-3 px-4 relative mt-4 mb-8"
    >
      <Edit className="absolute right-3 size-5" />
      <div className="grid gap-2 label-regular">
        <div className="flex gap-2 truncate">JR-{jobReference?.code}</div>
        <div className="flex gap-2 truncate">{jobReference?.projectName}</div>
      </div>
    </Link>
  )
}
