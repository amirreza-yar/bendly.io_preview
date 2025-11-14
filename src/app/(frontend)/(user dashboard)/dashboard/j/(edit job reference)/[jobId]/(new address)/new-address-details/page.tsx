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

const existingCodes = ['3568', '4921', '5782'] // Replace with fetch/API call if needed

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

  state: z.string(),

  postcode: z
    .string()
    .nonempty('Postcode is required')
    .regex(/^\d{4}$/, 'Postcode must be a 4-digit number'), // Adjust length to your country's format
})

type FormValues = z.infer<typeof formSchema>

export default function JobReferencesPage({}) {
  const { jobId } = useParams<{ jobId: string }>()

  const jobReference = useGETJobRefById(jobId)

  const { newAddress, setNewAddress } = useNewAddress()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const router = useRouter()

  const onSubmit = (data: FormValues) => {
    setNewAddress({
      addressTitle: data.addressTitle,
      streetAddress: data.streetAddress,
      suburb: data.suburb,
      state: data.state,
      postcode: data.postcode,
    })

    router.push(`/dashboard/j/${jobReference?.id}/new-recipient`)
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-center z-10 bg-white border-b-1 border-border-dark">
        <div className="flex items-center justify-between h-full w-full px-4">
          <div className="flex items-center gap-[18px] pr-3">
            <Link href={`/dashboard/j/${jobReference?.id}`}>
              <ArrowLeft />
            </Link>
            <h6>Address Details</h6>
          </div>
        </div>
      </header>
      <div className="overflow-scroll h-full pt-18 pb-22 px-4 no-scrollbar">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <LabeledInput
            label="Street Address"
            required
            type="text"
            placeholder="e.g., 123 Main St"
            error={!!errors.streetAddress}
            helpText={errors.streetAddress?.message}
            defaultValue={newAddress.streetAddress}
            {...register('streetAddress')}
          />
          <LabeledInput
            label="Suburb"
            required
            type="text"
            placeholder="e.g., Sydney"
            error={!!errors.suburb}
            helpText={errors.suburb?.message}
            defaultValue={newAddress.suburb}
            {...register('suburb')}
          />
          <div className="grid gap-2">
            <Controller
              control={control}
              name="state"
              rules={{ required: 'State / Territory is required' }}
              render={({ field, fieldState }) => (
                <Select
                  label="State/Territory"
                  items={australianStates}
                  placeholder="Select state / territory"
                  value={field.value}
                  required
                  onValueChange={field.onChange}
                  error={!!fieldState.error}
                  helpText={!!fieldState.error && 'State / Territory is required'}
                  // defaultValue={newAddress.state}
                />
              )}
            />
          </div>
          <LabeledInput
            label="Postcode"
            required
            type="number"
            placeholder="e.g., 2000"
            error={!!errors.postcode}
            helpText={errors.postcode?.message}
            defaultValue={newAddress.postcode}
            {...register('postcode')}
          />

          <Separator className="my-2" />

          <LabeledInput
            label="Address Title / Site Name"
            required
            type="text"
            placeholder="Eneter a name for Site / Address"
            error={!!errors.addressTitle}
            helpText={errors.addressTitle?.message}
            defaultValue={newAddress.addressTitle}
            {...register('addressTitle')}
          />
          <div className="fixed bottom-0 left-0 w-full h-19 z-10 bg-white border-t-1 border-border-dark px-4">
            <div className="w-full h-full">
              <div className="flex justify-around items-center h-full">
                {/* <Link href={`/${slug}/canvas`} className="w-full"> */}
                <Button type="submit" className="w-full bg-primary md:max-w-[700px]">
                  Continue to Recipient Details
                </Button>
                {/* </Link> */}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
