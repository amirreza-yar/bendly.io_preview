'use client'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/uikit/form'
import { Footer } from '@/components/dashboard/footer'
import { StoredAddress } from '@/types/jobReferenceTypes'
import { Select } from '@/components/uikit/select'
import { useForm, Controller } from 'react-hook-form'
import { ArrowLeft, Check, ChevronDown, ChevronUp, Info } from '@/components/uikit/icons'
import { Input, LabeledInput } from '@/components/uikit/input'
import { Button } from '@/components/uikit/buttons/button'
import Link from 'next/link'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { notFound, redirect, useParams, useRouter, useSearchParams } from 'next/navigation'
import { Separator } from '@/components/uikit/separator'
import { useNewAddress } from '@/providers/data_providers/job_reference_providers/NewAddressContext'
import { jobReferences } from '@/utilities/demo_datas/demoJobRefData'
import {
  useGETJobRefAddressByIds,
  useGETJobRefById,
  updateJobReference,
} from '@/lib/db/helpers/jobRefHelpers'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { AddressForm } from '@/components/dashboard/jobReference/forms'
import { useEffect } from 'react'
import { generateRandomId } from '@/lib/db/helpers/utils'
import { toast } from 'sonner'
import { useGETOrderById, upsertPartialOrder } from '@/lib/db/helpers/orderHelpers'

const addAddressFormSchema = z.object({
  streetAddress: z
    .string()
    .nonempty('Street Address is required')
    .regex(
      /^[a-zA-Z0-9\s,'\.-]+$/,
      'Street address can only contain letters, numbers, spaces, comma, hyphen, dot, and apostrophe',
    )
    .max(100, 'Street address must be under 100 characters'),

  suburb: z
    .string()
    .nonempty('Suburb is required')
    .regex(/^[a-zA-Z\s'-]+$/, 'Suburb must contain only letters, spaces, and hyphens')
    .max(50, 'Suburb name must be under 50 characters'),

  state: z.string('State is required'),

  postcode: z
    .string('Postcode is required')
    .nonempty('Postcode is required')
    .regex(/^\d{4}$/, 'Postcode must be a 4-digit value'),
})

export type AddAddressFormValues = z.infer<typeof addAddressFormSchema>

const australianStates = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'SA', label: 'South Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT', label: 'Northern Territory' },
]

export default function JobReferencesPage({}) {
  const { jobId, orderId, addressId } = useParams<{
    jobId: string
    orderId: string
    addressId: string
  }>()

  const editAddr = useSearchParams().get('editAddr')

  const jobReference = useGETJobRefById(jobId)

  const order = useGETOrderById(Number(orderId))

  const address = useGETJobRefAddressByIds(jobId, addressId)
  const router = useRouter()

  const onAddressFormSubmit = async (data: AddAddressFormValues) => {
    const addressIdToUse = editAddr ? addressId : generateRandomId({ length: 4 })

    await updateJobReference(jobReference?.id ?? '', {
      addresses: [
        {
          id: addressIdToUse,
          title: address?.title ?? '',
          streetAddress: data.streetAddress,
          suburb: data.suburb,
          state: data.state,
          postcode: Number(data.postcode),
          recipientName: address?.recipientName ?? '',
          recipientMobile: address?.recipientMobile ?? 0,
        },
      ],
    })

    if (editAddr) {
      await upsertPartialOrder(Number(orderId), {
        deliveryType: 'delivery',
        jobRefrence: {
          id: jobReference?.id ?? '',
          code: jobReference?.code ?? 0,
          projectName: jobReference?.projectName,
        },
        recipientInfo: {
          recipientName: address?.recipientName ?? '',
          recipientMobile: address?.recipientMobile ?? 0,
        },
        address: {
          title: order?.address?.title ?? '',
          streetAddress: data.streetAddress,
          suburb: data.suburb,
          state: data.state,
          postcode: Number(data.postcode),
        },
      })
    }

    toast('New Address Added')

    router.push(`/o/${orderId}/delivery-ship`)
  }

  const form = useForm<AddAddressFormValues>({
    resolver: zodResolver(addAddressFormSchema),
  })

  return (
    <>
      <Header title="Edit Address Details" returnHref={`/o/${orderId}/delivery-ship`} />
      <ContentWrapper>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onAddressFormSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LabeledInput
                      label="Street Address"
                      required
                      type="text"
                      placeholder="e.g., 123 Main St"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="suburb"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LabeledInput
                      label="Suburb"
                      required
                      type="text"
                      placeholder="e.g., Sydney"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid gap-2">
                      <Select
                        label="State/Territory"
                        items={australianStates}
                        placeholder="Select state / territory"
                        required
                        {...field}
                        value={field.value ?? ''}
                        onValueChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postcode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LabeledInput
                      label="Postcode"
                      required
                      type="text"
                      placeholder="e.g., 2000"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Footer>
              <Button type="submit" className="w-full bg-primary">
                Continue to Recipient Details
              </Button>
            </Footer>
          </form>
        </Form>
      </ContentWrapper>
    </>
  )
}
