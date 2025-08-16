'use client'
import { ArrowLeft, Edit, MapMarker, Plus, ProfileNav, Remove } from '@/components/uikit/icons'
import Link from 'next/link'
import { jobReferences } from '@/utilities/demo_datas/demoJobRefData'
import { notFound, useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/uikit/buttons/button'
import JobRefHeader from '@/components/dashboard/jobReference/header'
import { JobRefInfoCard } from '@/components/dashboard/jobReference/cards'
import { JobRefAddressCard } from '@/components/dashboard/jobReference/cards'
import JobRefFooter from '@/components/dashboard/jobReference/footer'
import {
  deleteJobRefAddressByIds,
  deleteJobRefById,
  getJobRefById,
} from '@/lib/db/helpers/jobRefHelpers'
import { toast } from 'sonner'
import { useState } from 'react'
import { Footer } from '@/components/dashboard/footer'
import { Header } from '@/components/dashboard/header'
import { RemoveJobRefModal } from '@/components/dashboard/jobReference/modals'

export default function jobReferencePage() {
  const { jobId } = useParams<{ jobId: string }>()

  const router = useRouter()
  const [isDeleted, setIsDeleted] = useState<boolean>(false)

  const jobReference = getJobRefById(jobId)
  if (!isDeleted && jobReference === undefined) {
    notFound()
  }

  const onJobRefDelete = async () => {
    setIsDeleted(true)
    await deleteJobRefById(jobReference?.id ?? '').then(() => {
      toast('Job Reference deleted')
      router.replace('/dashboard/j')
    })
  }

  const onJobRefAddressDelete = async (addressId: string) => {
    await deleteJobRefAddressByIds(jobReference?.id ?? '', addressId).then(() => {
      toast('Address deleted')
    })
  }

  return (
    <>
      <Header title={`Job Ref: JR-${jobReference?.id}`} returnHref="/dashboard/j">
        <RemoveJobRefModal
          trigger={<Remove className="size-6" />}
          onJobRefDelete={onJobRefDelete}
        />
      </Header>
      <div className="overflow-scroll w-full h-full pt-14 pb-22 px-4 no-scrollbar">
        <div className="grid">
          <JobRefInfoCard jobReference={jobReference ?? null} />
          <div className="grid gap-4">
            <h6>Associated Addresses</h6>
            {(jobReference?.addresses?.length ?? 0) > 0 ? (
              <>
                {jobReference?.addresses?.map((address, index) => (
                  <JobRefAddressCard
                    address={address}
                    key={index}
                    jobId={jobReference.id}
                    onJobRefAddressDelete={onJobRefAddressDelete}
                  />
                ))}
              </>
            ) : (
              <div className="h-[50vh]">
                <div className="h-full grid items-center justify-center opacity-40">
                  <h6>No addresses for JR-{jobReference?.code}</h6>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer>
        <Link className="w-full" href={`/dashboard/j/${jobReference?.id}/new-address-details`}>
          <Button className="w-full">
            <Plus />
            Add New Address
          </Button>
        </Link>
      </Footer>
    </>
  )
}
