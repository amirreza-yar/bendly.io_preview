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
import { useNewAddress } from '@/providers/data_providers/job_reference_providers/NewAddressContext'
import { jobReferences } from '@/utilities/demo_datas/demoJobRefData'
import { useGETJobRefById } from '@/lib/db/helpers/jobRefHelpers'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { AddressForm, AddressFormValues } from '@/components/dashboard/jobReference/forms'

export default function JobReferencesPage({}) {
  const { jobId, orderId } = useParams<{
    jobId: string
    orderId: string
  }>()

  const jobReference = useGETJobRefById(jobId)

  const { newAddress, setNewAddress } = useNewAddress()

  const router = useRouter()

  const onAddressFormSubmit = (data: AddressFormValues) => {
    setNewAddress({
      title: data.addressTitle,
      streetAddress: data.streetAddress,
      suburb: data.suburb,
      state: data.state,
      postcode: Number(data.postcode),
    })

    router.push(`/o/${orderId}/delivery-ship/j/${jobId}/new-recipient`)
  }

  return (
    <>
      <Header title="Edit Address Details" returnHref={`/o/${orderId}/delivery-ship/j/${jobId}`} />
      <ContentWrapper>
        <AddressForm address={newAddress} onAddressFormSubmit={onAddressFormSubmit} />
      </ContentWrapper>
    </>
  )
}
