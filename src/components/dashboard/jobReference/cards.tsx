import { JobReference } from '@/utilities/demo_datas/demoJobRefData'
import { ChevronRight, Edit, MapMarker, ProfileNav, Remove } from '@/components/uikit/icons'
import Link from 'next/link'
import { RemoveJobRefAddressModal } from './modals'
import { StoredAddress, StoredJobReference } from '@/types/jobReferenceTypes'
import { AlertTriangle } from 'lucide-react'

interface JobRefAddressCardProps {
  address: StoredAddress
  jobId: string
  toHref?: string
  onJobRefAddressDelete?: (addressId: string) => void
}

export function JobRefAddressCard({
  address,
  jobId,
  onJobRefAddressDelete,
  toHref,
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
              {address.street_address}, {address.suburb}, {address.state} {address.postcode}{' '}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <ProfileNav className="size-5 mt-[2px]" />
          <div className="grid gap-1">
            <p className="body-small truncate">
              {address.recipient_name} {address.recipient_phone}
            </p>
          </div>
        </div>
        <div className="flex justify-end items-center [&_svg]:size-5 gap-6">
          {onJobRefAddressDelete && (
            <RemoveJobRefAddressModal
              trigger={<Remove />}
              onJobRefAddressDelete={() => onJobRefAddressDelete(address.id)}
            />
          )}
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
        <div className="flex gap-2 truncate">{jobReference?.project_name}</div>
      </div>
    </Link>
  )
}

export function JobRefCard({
  job,
  toHref,
  ...props
}: {
  job: StoredJobReference | null
  toHref?: string
}) {
  const href = toHref ? toHref : `/dashboard/j/${job?.id}`
  return (
    <Link
      {...props}
      href={href}
      data-slot="card"
      className="grid gap-4 rounded-md border-1 border-border-default bg-surface-card py-3 px-4 relative"
    >
      <ChevronRight className="absolute top-4 right-4" />
      <div className="grid gap-1 label-regular">
        <p>JR-{job?.code}</p>
        <p>{job?.projectName}</p>
      </div>
      {(job?.addresses?.length ?? 0) > 0 ? (
        <>
          <div className="grid gap-2">
            <div className="flex gap-2">
              <MapMarker className="size-5" />
              <div className="flex flex-col gap-1 truncate">
                <p className="label-regular">{job?.addresses?.[0]?.title}</p>
                <p className="body-small">
                  {job?.addresses?.[0]?.streetAddress}, {job?.addresses?.[0]?.suburb},{' '}
                  {job?.addresses?.[0]?.state} {job?.addresses?.[0]?.postcode}
                </p>
              </div>
            </div>
            {job?.addresses?.[1] ? (
              <>
                <div className="flex items-center gap-2">
                  <p className="label-small">Other Address:</p>
                  <span className="caption-regular rounded-[900px] border-1 border-border-default px-[10px] py-1 bg-surface-disable">
                    {job?.addresses?.[1].title}
                  </span>
                  {job?.addresses?.length > 2 && (
                    <span className="caption-regular rounded-[900px] border-1 border-border-default px-[10px] py-1 bg-surface-disable">
                      +{job?.addresses?.length - 2}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <p className="label-small">Other Address:</p>
                  <span className="caption-regular rounded-[900px] border-1 border-border-default px-[10px] py-1 bg-surface-disable">
                    ---
                  </span>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex gap-3 items-start text-alert-default bg-surface-alert-subtle p-3 rounded-md">
            <AlertTriangle className="size-5 mt-0.5" />
            <div className="grid">
              <p className="label-large">Associated addresses deleted</p>
              <p className="body-small">Add an address to continue or delete this Job Reference.</p>
            </div>
          </div>
        </>
      )}
    </Link>
  )
}
