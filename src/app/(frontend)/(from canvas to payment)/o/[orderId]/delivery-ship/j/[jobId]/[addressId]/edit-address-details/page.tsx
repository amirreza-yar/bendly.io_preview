'use client'
import { useForm, Controller } from 'react-hook-form'
import { ArrowLeft, Check, ChevronDown, ChevronUp, Info } from '@/components/uikit/icons'
import { Input, LabeledInput } from '@/components/uikit/input'
import { Button } from '@/components/uikit/buttons/button'
import Link from 'next/link'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { notFound, redirect, useParams, useRouter, useSearchParams } from 'next/navigation'
import { Select } from '@/components/uikit/select'
import { Separator } from '@/components/uikit/separator'
import { useNewJobReference } from '@/providers/data_providers/job_reference_providers/AddJobReferenceContext'
import { jobReferences } from '@/utilities/demo_datas/demoJobRefData'
import { toast } from 'sonner'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { getJobRefAddressByIds, updateJobReference } from '@/lib/db/helpers/jobRefHelpers'
import { Footer } from '@/components/dashboard/footer'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/uikit/form'
import { useEffect } from 'react'
import { AddressForm, AddressFormValues } from '@/components/dashboard/jobReference/forms'

export default function JobReferencesPage({}) {
  const { jobId, addressId, orderId } = useParams<{
    jobId: string
    addressId: string
    orderId: string
  }>()

  const address = getJobRefAddressByIds(jobId, addressId)

  if (address === undefined) {
    notFound()
  }

  const router = useRouter()

  const onAddressFormSubmit = async (data: AddressFormValues) => {
    await updateJobReference(jobId, {
      addresses: [
        {
          id: address?.id ?? '',
          title: data.addressTitle,
          streetAddress: data.streetAddress,
          state: data.state,
          suburb: data.suburb,
          postcode: Number(data.postcode),
          recipientName: address?.recipientName ?? '',
          recipientMobile: address?.recipientMobile ?? 0,
        },
      ],
    })

    router.push(`/o/${orderId}/delivery-ship/j/${jobId}`)
    toast('Address Updated')
  }

  return (
    <>
      <Header
        title="Edit Address Details"
        returnHref={`/o/${orderId}/delivery-ship/j/${jobId}/${addressId}`}
      />
      <ContentWrapper>
        <AddressForm address={address} onAddressFormSubmit={onAddressFormSubmit} />
      </ContentWrapper>
    </>
  )
}
