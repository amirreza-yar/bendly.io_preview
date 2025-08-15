'use client'
import { ArrowLeft, Edit, MapMarker, Plus, ProfileNav, Remove } from '@/components/uikit/icons'
import Link from 'next/link'
import { jobReferences } from '@/utilities/demo_datas/demoJobRefData'
import { notFound, useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/uikit/buttons/button'
import JobRefHeader from '@/components/dashboard/jobReference/edit/header'
import { JobRefInfoCard } from '@/components/dashboard/jobReference/edit/cards'
import { JobRefAddressCard } from '@/components/dashboard/jobReference/edit/cards'
import JobRefFooter from '@/components/dashboard/jobReference/edit/footer'
import { deleteJobRefById, getJobRefById } from '@/lib/db/helpers/jobRefHelpers'
import { toast } from 'sonner'

export default function jobReferencePage() {
  const { jobCode } = useParams()

  const router = useRouter()

  const jobReference = getJobRefById(Number(jobCode))
  if (jobReference === undefined) {
    notFound()
  }

  const onJobRefDelete = async () => {
    await deleteJobRefById(jobReference?.code ?? 0)

    toast('Job Reference deleted')
    router.push('/dashboard/j')
  }

  return (
    <>
      <JobRefHeader jobCode={jobReference?.code} onJobRefDelete={onJobRefDelete} />
      <div className="overflow-scroll w-full h-full pt-14 pb-22 px-4 no-scrollbar">
        <div className="grid">
          <JobRefInfoCard jobReference={jobReference} />
          <div className="grid gap-4">
            <h6>Associated Addresses</h6>

            {jobReference?.addresses?.map((address, index) => (
              <JobRefAddressCard address={address} key={index} jobCode={jobReference.code} />
            ))}
          </div>
        </div>
      </div>
      <JobRefFooter jobCode={jobReference?.code} />
    </>
  )
}
