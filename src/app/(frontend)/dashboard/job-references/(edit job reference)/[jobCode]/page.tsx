import { ArrowLeft, Edit, MapMarker, Plus, ProfileNav, Remove } from '@/components/uikit/icons'
import Link from 'next/link'
import { jobReferences } from '../../../../../../utils/demoJobRefData'
import { notFound } from 'next/navigation'
import { Button } from '@/components/uikit/buttons/button'
import JobRefHeader from '@/components/dashboard/jobReference/edit/header'
import { JobRefInfoCard } from '@/components/dashboard/jobReference/edit/cards'
import { JobRefAddressCard } from '@/components/dashboard/jobReference/edit/cards'
import JobRefFooter from '@/components/dashboard/jobReference/edit/footer'

export default async function jobReferencePage({
  params,
}: {
  params: Promise<{ jobCode: number }>
}) {
  const { jobCode } = await params

  const jobReference = jobReferences.find((job) => job.code === jobCode)

  if (!jobReference) {
    notFound()
  }

  return (
    <>
      <JobRefHeader jobCode={jobCode} />
      <div className="overflow-scroll w-full h-full pt-14 pb-22 px-4 no-scrollbar">
        <div className="grid">
          <JobRefInfoCard jobReference={jobReference} />
          <div className="grid gap-4">
            <h6>Associated Addresses</h6>

            {jobReference?.addresses.map((address, index) => (
              <JobRefAddressCard address={address} key={index} jobCode={jobCode} />
            ))}
          </div>
        </div>
      </div>
      <JobRefFooter jobCode={jobCode} />
    </>
  )
}
