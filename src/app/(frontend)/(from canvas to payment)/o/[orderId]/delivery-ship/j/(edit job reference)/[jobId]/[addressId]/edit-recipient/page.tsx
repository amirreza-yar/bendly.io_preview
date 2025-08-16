'use client'
import { notFound, useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { getJobRefAddressByIds, updateJobReference } from '@/lib/db/helpers/jobRefHelpers'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { RecipientForm } from '@/components/dashboard/jobReference/forms'
import { toast } from 'sonner'

export default function JobReferencesPage({}) {
  const { jobId, addressId } = useParams<{ jobId: string; addressId: string }>()

  const address = getJobRefAddressByIds(jobId, addressId)

  if (address === undefined) {
    notFound()
  }

  const router = useRouter()

  const onSubmitRecipient = async (data: { name: string; mobile: number }) => {
    console.log(data)

    await updateJobReference(jobId, {
      addresses: [
        {
          id: address?.id ?? '',
          title: address?.title ?? '',
          streetAddress: address?.streetAddress,
          state: address?.state,
          suburb: address?.suburb,
          postcode: address?.postcode,
          recipientName: data.name,
          recipientMobile: data.mobile,
        },
      ],
    })
    toast('Recipient Updated')
    router.push(`/dashboard/j/${jobId}/${addressId}`)
  }

  return (
    <>
      <Header title="Edit Recipient" returnHref={`/dashboard/j/${jobId}/${addressId}`} />
      <ContentWrapper>
        <div className="grid gap-4">
          <div>
            <h6 className="text-smd-m">Who will receive this order delivery?</h6>
          </div>
          <RecipientForm
            onSubmitRecipient={onSubmitRecipient}
            prevRecipient={{
              name: address?.recipientName ?? '',
              mobile: address?.recipientMobile ?? 0,
            }}
          />
        </div>
      </ContentWrapper>
    </>
  )
}
