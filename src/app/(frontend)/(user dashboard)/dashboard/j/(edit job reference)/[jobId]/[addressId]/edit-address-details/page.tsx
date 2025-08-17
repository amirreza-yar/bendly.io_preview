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

const formSchema = z.object({
  addressTitle: z
    .string()
    .nonempty('Address Title / Site Name is required')
    .max(100, 'Address title must be under 100 characters'),

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

  postcode: z.number('Postcode is required'),
})

type FormValues = z.infer<typeof formSchema>

export default function JobReferencesPage({}) {
  const { jobId, addressId } = useParams<{ jobId: string; addressId: string }>()

  const address = getJobRefAddressByIds(jobId, addressId)

  if (address === undefined) {
    notFound()
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    if (address) {
      form.reset({
        addressTitle: address.title,
        suburb: address.suburb,
        state: address.state,
        postcode: address.postcode,
        streetAddress: address.streetAddress,
      })
    }
  }, [form, address])

  const router = useRouter()

  const onSubmit = async (data: FormValues) => {
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

    router.push(`/dashboard/j/${jobId}/${addressId}`)
    toast('Address Updated')
  }

  return (
    <>
      <Header title="Edit Address Details" returnHref={`/dashboard/j/${jobId}/${addressId}`} />
      <ContentWrapper>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
                      type="number"
                      placeholder="e.g., 2000"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="my-2" />{' '}
            <FormField
              control={form.control}
              name="addressTitle"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LabeledInput
                      label="Address Title / Site Name"
                      required
                      type="text"
                      placeholder="Eneter a name for Site / Address"
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
