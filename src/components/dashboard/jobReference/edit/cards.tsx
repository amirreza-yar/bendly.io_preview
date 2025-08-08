import { JobReference } from '@/utilities/demoJobRefData'
import { Edit, MapMarker, ProfileNav, Remove } from '@/components/uikit/icons'
import Link from 'next/link'
import { RemoveJobRefAddressModal } from './modals'

interface JobRefAddressCardProps {
  address: {
    id: string
    title: string
    streetAddress: string
    suburb: string
    state: string
    stateAbbreviation: string
    postcode: number
    recipientName: string
    recipientMobile: number
  }
  jobCode: number
}

export function JobRefAddressCard({ address, jobCode, ...props }: JobRefAddressCardProps) {
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
            // onDelete={() => toast('Address Deleted')}
          />
          <Link href={`/dashboard/job-references/${jobCode}/${address.id}`}>
            <Edit />
          </Link>
        </div>
      </div>
    </div>
  )
}

interface JobRefInfoCardProps {
  jobReference: JobReference
}

export function JobRefInfoCard({ jobReference }: JobRefInfoCardProps) {
  return (
    <Link
      href={`/dashboard/job-references/${jobReference.code}/edit-info`}
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
