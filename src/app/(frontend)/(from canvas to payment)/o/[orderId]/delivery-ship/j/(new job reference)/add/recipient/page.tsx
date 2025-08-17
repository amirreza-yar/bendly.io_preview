'use client'
import { Edit, MapMarker } from '@/components/uikit/icons'
import Link from 'next/link'
import { useNewJobReference } from '@/providers/data_providers/job_reference_providers/AddJobReferenceContext'
import { redirect, useParams, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { addJobReference } from '@/lib/db/helpers/jobRefHelpers'
import { generateRandomId } from '@/lib/db/helpers/utils'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { RecipientForm } from '@/components/dashboard/jobReference/forms'
import { upsertPartialFlashing } from '@/lib/db/helpers/flashingHelpers'
import { upsertPartialOrder } from '@/lib/db/helpers/orderHelpers'

export default function JobReferencesPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const returnHref = useSearchParams().get('return')

  const { newJobReference } = useNewJobReference()

  const router = useRouter()

  if (
    !(
      newJobReference.addressTitle &&
      newJobReference.streetAddress &&
      newJobReference.suburb &&
      newJobReference.state &&
      newJobReference.postcode &&
      newJobReference.jobReferenceCode
    )
  ) {
    redirect('/dashboard/j/add')
  }

  const onSubmitRecipient = async (data: { name: string; mobile: number }) => {
    const jobId = generateRandomId({ length: 4 })

    await addJobReference({
      code: Number(newJobReference.jobReferenceCode),
      projectName: newJobReference.projectName,
      addresses: [
        {
          id: jobId,
          title: newJobReference.addressTitle ?? '',
          streetAddress: newJobReference.streetAddress,
          state: newJobReference.state,
          suburb: newJobReference.suburb,
          postcode: Number(newJobReference.postcode),
          recipientName: data.name,
          recipientMobile: data.mobile,
        },
      ],
    })

    if (returnHref === 'delivery') {
      await upsertPartialOrder(Number(orderId), {
        jobRefrence: {
          id: jobId,
          code: Number(newJobReference.jobReferenceCode),
          projectName: newJobReference.projectName,
        },
        address: {
          title: newJobReference.addressTitle ?? '',
          streetAddress: newJobReference.streetAddress,
          state: newJobReference.state,
          suburb: newJobReference.suburb,
          postcode: Number(newJobReference.postcode),
        },
        recipientInfo: {
          recipientName: data.name,
          recipientMobile: data.mobile,
        },
      })

      router.push(`/o/${orderId}/delivery-ship`)
    } else {
      router.push(`/o/${orderId}/delivery-ship/j/add/recipient`)
    }
    toast('New Job Reference Created')
  }

  return (
    <>
      <Header title="Recipient" returnHref={`/o/${orderId}/delivery-ship/j/add/address-details`} />
      <ContentWrapper>
        <div className="grid gap-4">
          <Link
            href={`/o/${orderId}/delivery-ship/j/add`}
            data-slot="card"
            className="grid gap-4 rounded-md border-1 border-border-default bg-surface-card py-3 px-4 relative"
          >
            <Edit className="absolute top-3 right-3 size-5" />
            <div className="grid gap-2">
              <div className="flex gap-2">
                <MapMarker className="size-5" />
                <div className="flex flex-col gap-1 truncate">
                  <p className="label-regular">{newJobReference.addressTitle}</p>
                  <p className="body-small">
                    {newJobReference.streetAddress}, {newJobReference.suburb},{' '}
                    {newJobReference.state} {newJobReference.postcode}
                  </p>
                </div>
              </div>
            </div>
          </Link>
          <div>
            <h6 className="text-smd-m">Who will receive this order delivery?</h6>
          </div>
          <RecipientForm onSubmitRecipient={onSubmitRecipient} />
        </div>
      </ContentWrapper>
    </>
  )
}
