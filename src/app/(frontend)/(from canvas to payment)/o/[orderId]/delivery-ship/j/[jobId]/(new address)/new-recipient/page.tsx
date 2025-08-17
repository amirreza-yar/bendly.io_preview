'use client'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Edit, Info, MapMarker, Ruler, XIcon } from '@/components/uikit/icons'
import { LabeledInput, LabeledInputWithCode } from '@/components/uikit/input'
import { Button } from '@/components/uikit/buttons/button'
import Link from 'next/link'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { RadioGroup, RadioGroupItem } from '@/components/uikit/radioGroup'
import { Drawer, DrawerClose } from '@/components/uikit/drawer'
import { useState } from 'react'
import { notFound, redirect, useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useNewAddress } from '@/providers/data_providers/job_reference_providers/NewAddressContext'
import { jobReferences } from '@/utilities/demo_datas/demoJobRefData'
import { getJobRefById, updateJobReference } from '@/lib/db/helpers/jobRefHelpers'
import { generateRandomId } from '@/lib/db/helpers/utils'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { RecipientForm } from '@/components/dashboard/jobReference/forms'

export default function JobReferencesPage({}) {
  const { jobId, orderId } = useParams<{ jobId: string; orderId: string }>()

  const jobReference = getJobRefById(jobId)

  const { newAddress } = useNewAddress()

  const router = useRouter()

  if (
    !(
      newAddress.title &&
      newAddress.streetAddress &&
      newAddress.suburb &&
      newAddress.state &&
      newAddress.postcode
    )
  ) {
    notFound()
  }

  const onSubmitRecipient = async (data: { name: string; mobile: number }) => {
    await updateJobReference(jobReference?.id ?? '', {
      addresses: [
        {
          id: generateRandomId({ length: 4 }),
          title: newAddress.title ?? '',
          streetAddress: newAddress.streetAddress,
          suburb: newAddress.suburb,
          state: newAddress.state,
          postcode: Number(newAddress.postcode),
          recipientName: data.name,
          recipientMobile: data.mobile,
        },
      ],
    })

    toast('New Address Added')
    router.push(`/o/${orderId}/delivery-ship/j/${jobReference?.id}`)
  }

  return (
    <>
      <Header
        title="Recipient"
        returnHref={`/o/${orderId}/delivery-ship/j/${jobReference?.id}/new-address-details`}
      />
      <ContentWrapper>
        <div className="grid gap-4">
          <Link
            href={`/o/${orderId}/delivery-ship/j/${jobReference?.id}/new-address-details`}
            data-slot="card"
            className="grid gap-4 rounded-md border-1 border-border-default bg-surface-card py-3 px-4 relative"
          >
            <Edit className="absolute top-3 right-3 size-5" />
            <div className="grid gap-2">
              <div className="flex gap-2">
                <MapMarker className="size-5" />
                <div className="flex flex-col gap-1 truncate">
                  <p className="label-regular">{newAddress.title}</p>
                  <p className="body-small">
                    {newAddress.streetAddress}, {newAddress.suburb}, {newAddress.state}{' '}
                    {newAddress.postcode}
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
