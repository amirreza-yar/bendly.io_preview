'use client'
import { useForm, Controller } from 'react-hook-form'
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Edit,
  Info,
  MapMarker,
  XIcon,
} from '@/components/uikit/icons'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/uikit/form'
import { Input, LabeledInput, LabeledInputWithCode } from '@/components/uikit/input'
import { Button } from '@/components/uikit/buttons/button'
import Link from 'next/link'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { notFound, redirect, useParams, useRouter, useSearchParams } from 'next/navigation'
import { Select } from '@/components/uikit/select'
import { Separator } from '@/components/uikit/separator'
import { useNewAddress } from '@/providers/data_providers/job_reference_providers/NewAddressContext'
import { jobReferences } from '@/utilities/demo_datas/demoJobRefData'
import {
  addJobReference,
  getJobRefById,
  jobReferCodeExists,
  updateJobReference,
} from '@/lib/db/helpers/jobRefHelpers'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { generateRandomId } from '@/lib/db/helpers/utils'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { Drawer } from '@/components/uikit/drawer'
import { Footer } from '@/components/dashboard/footer'
import { RadioGroup, RadioGroupItem } from '@/components/uikit/radioGroup'
import { RecipientInfo } from '@/types/jobReferenceTypes'
import { upsertPartialOrder } from '@/lib/db/helpers/orderHelpers'

const NewJobRefFormSchema = z.object({
  addressTitle: z
    .string('Address Title / Site Name is required')
    .nonempty('Address Title / Site Name is required')
    .max(100, 'Address title must be under 100 characters'),
  jobReferenceCode: z
    .string('Job reference code is required')
    .nonempty('Job reference code is required')
    .refine(
      async (val) => {
        // Check the DB for existence
        const exists = await jobReferCodeExists({ code: Number(val) })
        return !exists // return true if it's valid (i.e., does NOT exist)
      },
      { message: 'Job Reference Code already exists' },
    ),
  projectName: z.string(),
  recipient: z.enum(['me', 'someone-else']).nonoptional(),
})

export type NewJobRefFormValues = z.infer<typeof NewJobRefFormSchema>

const SomeOneElseFormSchema = z.object({
  name: z
    .string('Full name is required')
    .min(1, 'Full name is required')
    .regex(/^[a-zA-Z\s]+$/, 'Full name must contain only letters'),
  mobile: z
    .string('Mobile number is required')
    .nonempty('Mobile number is required')
    .regex(/^\d{10}$/, 'Please eneter a valid mobile number'),
})

type SomeOneElseFormValues = z.infer<typeof SomeOneElseFormSchema>

export default function JobReferencesPage({}) {
  const { orderId } = useParams<{
    orderId: string
  }>()

  const router = useRouter()

  const form = useForm<NewJobRefFormValues>({
    resolver: zodResolver(NewJobRefFormSchema),
    defaultValues: {
      recipient: 'me',
    },
  })

  const [user] = useState<{ name: string; mobile: number }>({
    name: 'Amirreza Yarahmadi',
    mobile: 8987654123,
  })

  const [someOneElseInfo, setSomeOneElseInfo] = useState<{
    name: string
    mobile: number
  }>()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const someOneElseForm = useForm<SomeOneElseFormValues>({
    resolver: zodResolver(SomeOneElseFormSchema),
  })

  const recipient = form.watch('recipient')

  useEffect(() => {
    if (!someOneElseInfo && recipient === 'someone-else') {
      setIsDrawerOpen(true)
    }
  }, [recipient, someOneElseInfo])

  const onSomeOneElseInfoFormSubmit = (data: SomeOneElseFormValues) => {
    form.reset({
      recipient: 'someone-else',
    })

    setSomeOneElseInfo({
      name: data.name,
      mobile: Number(data.mobile),
    })

    setIsDrawerOpen(false)
  }

  const onNewJofRefFormSubmit = async (data: NewJobRefFormValues) => {
    console.log(data)
    const recipientInfo: RecipientInfo = { recipientName: user.name, recipientMobile: user.mobile }
    if (data.recipient === 'someone-else' && someOneElseInfo) {
      recipientInfo.recipientName = someOneElseInfo?.name
      recipientInfo.recipientMobile = someOneElseInfo?.mobile
    }
    const jobId = await addJobReference({
      code: Number(data.jobReferenceCode),
      projectName: data.projectName,
      addresses: [
        {
          id: generateRandomId({ length: 4 }),
          title: data.addressTitle,
          recipientName: recipientInfo.recipientName,
          recipientMobile: recipientInfo.recipientMobile,
        },
      ],
    })

    await upsertPartialOrder(Number(orderId), {
      deliveryType: 'pickup',
      address: {
        title: data.addressTitle,
        streetAddress: undefined,
        suburb: undefined,
        state: undefined,
        postcode: undefined,
      },
      jobRefrence: {
        id: jobId,
        code: Number(data.jobReferenceCode),
        projectName: data.projectName,
      },
      recipientInfo: {
        recipientName: recipientInfo.recipientName,
        recipientMobile: recipientInfo.recipientMobile,
      },
    })
    toast('New Address Added')
    router.push(`/o/${orderId}/delivery-ship`)
  }

  return (
    <>
      <Header title="Edit Address Details" returnHref={`/o/${orderId}/delivery-ship`} />
      <ContentWrapper className="pb-24">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onNewJofRefFormSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="jobReferenceCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LabeledInput
                      label="Job Reference Code"
                      required
                      type="text"
                      placeholder="Enter unique Job Reference code"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage>A unique code you assign to identify this job</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LabeledInput
                      label="Project Name (Optional)"
                      required
                      type="text"
                      placeholder="Enter your project name"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage>Name this job reference for easy identification</FormMessage>
                </FormItem>
              )}
            />
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
            <div>
              <h6 className="text-smd-m pt-4">Who will receive this order delivery?</h6>
            </div>
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue="me"
                      className="grid gap-2"
                    >
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="me" />
                        </FormControl>
                        <FormLabel className="label-regular">Me ({user.name})</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="someone-else" />
                        </FormControl>
                        <FormLabel className="label-regular">Someone else</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            {someOneElseInfo && (
              <div
                data-slot="card"
                className="grid gap-4 rounded-md border-1 border-border-default bg-surface-card py-3 px-4 relative"
                onClick={() => setIsDrawerOpen(true)}
              >
                <Edit className="absolute top-3 right-3 size-5" />
                <div className="grid gap-2">
                  <p className="label-regular">Delivery Recipient</p>
                  <p className="caption-regular text-subtitle pt-1">{someOneElseInfo.name}</p>
                  <p className="caption-regular font-regular">+61{someOneElseInfo.mobile}</p>
                </div>
              </div>
            )}
            <Footer>
              <Button type="submit" className="w-full bg-primary">
                Continue to Recipient Details
              </Button>
            </Footer>
          </form>
        </Form>
        <div className="grid gap-4">
          <Drawer open={isDrawerOpen}>
            <div className="flex flex-col p-6">
              <div className="flex justify-between pb-6">
                <h6>Recipient Information</h6>
                <XIcon
                  onClick={() => {
                    setIsDrawerOpen(false)
                    !someOneElseInfo && form.setValue('recipient', 'me')
                  }}
                  className="size-6"
                />
              </div>
              <Form {...someOneElseForm}>
                <form
                  onSubmit={someOneElseForm.handleSubmit(onSomeOneElseInfoFormSubmit)}
                  className="grid gap-6"
                >
                  <FormField
                    control={someOneElseForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <LabeledInput
                            label="Recipient Full Name"
                            required
                            type="text"
                            placeholder="Enter the full name"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={someOneElseForm.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <LabeledInputWithCode
                            label="Recipient Mobile Number"
                            required
                            type="number"
                            placeholder="e.g., 400123456"
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-3">
                    Confirm
                  </Button>
                </form>
              </Form>
            </div>
          </Drawer>
        </div>
      </ContentWrapper>
    </>
  )
}
