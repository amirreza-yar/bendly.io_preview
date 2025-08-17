'use client'
import { useForm, Controller } from 'react-hook-form'
import { ArrowLeft, Check, ChevronDown, ChevronUp, Info } from '@/components/uikit/icons'
import { Input, LabeledInput } from '@/components/uikit/input'
import { Button } from '@/components/uikit/buttons/button'
import Link from 'next/link'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { redirect, useParams, useRouter, useSearchParams } from 'next/navigation'
import { Select } from '@/components/uikit/select'
import { Separator } from '@/components/uikit/separator'
import { useNewJobReference } from '@/providers/data_providers/job_reference_providers/AddJobReferenceContext'
import { Header } from '@/components/dashboard/header'
import { Footer } from '@/components/dashboard/footer'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { AddressForm, AddressFormValues } from '@/components/dashboard/jobReference/forms'
import { useEffect } from 'react'

export default function JobReferencesPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const returnHref = useSearchParams().get('return')

  const { newJobReference, setNewJobReference } = useNewJobReference()

  const router = useRouter()

  if (!newJobReference.jobReferenceCode) {
    router.push(`/o/${orderId}/delivery-ship/j/add`)
  }

  const onAddressFormSubmit = (data: AddressFormValues) => {
    setNewJobReference({
      addressTitle: data.addressTitle,
      streetAddress: data.streetAddress,
      suburb: data.suburb,
      state: data.state,
      postcode: data.postcode,
    })

    router.push(
      returnHref === 'delivery'
        ? `/o/${orderId}/delivery-ship/j/add/recipient?return=${returnHref}`
        : `/o/${orderId}/delivery-ship/j/add/recipient`,
    )
  }

  return (
    <>
      <Header title="Edit Address Details" returnHref={`/o/${orderId}/delivery-ship/j/add`} />
      <ContentWrapper>
        <AddressForm onAddressFormSubmit={onAddressFormSubmit} />
      </ContentWrapper>
    </>
  )
}
