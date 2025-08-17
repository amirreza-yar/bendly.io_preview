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
import { useEffect, useState } from 'react'
import { notFound, redirect, useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { jobReferences } from '@/utilities/demo_datas/demoJobRefData'
import { getJobRefAddressByIds } from '@/lib/db/helpers/jobRefHelpers'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
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
import { Separator } from '@/components/uikit/separator'

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

const RecipientInfoFormSchema = z.object({
  recipient: z.enum(['me', 'someone-else']).nonoptional(),
})

type RecipientInfoFormValues = z.infer<typeof RecipientInfoFormSchema>

export function RecipientForm({
  onSubmitRecipient,
  prevRecipient,
}: {
  onSubmitRecipient: (data: { name: string; mobile: number }) => void
  prevRecipient?: { name: string; mobile: number }
}) {
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

  const recipientInfoForm = useForm<RecipientInfoFormValues>({
    resolver: zodResolver(RecipientInfoFormSchema),
    defaultValues: {
      recipient: 'me',
    },
  })

  useEffect(() => {
    if (prevRecipient?.name === user.name && prevRecipient?.mobile === user.mobile) {
      recipientInfoForm.reset({
        recipient: 'me',
      })
    } else if (prevRecipient?.name && prevRecipient?.mobile) {
      recipientInfoForm.reset({
        recipient: 'someone-else',
      })
      setSomeOneElseInfo(prevRecipient)
    }
  }, [prevRecipient, someOneElseForm, recipientInfoForm])

  const recipient = recipientInfoForm.watch('recipient')

  useEffect(() => {
    if (someOneElseInfo) {
      someOneElseForm.reset({
        name: someOneElseInfo.name,
        mobile: String(someOneElseInfo.mobile),
      })
    }
  }, [someOneElseInfo, someOneElseForm])

  useEffect(() => {
    if (!someOneElseInfo && recipient === 'someone-else') {
      setIsDrawerOpen(true)
    }
  }, [recipient, someOneElseInfo])

  const onSomeOneElseInfoFormSubmit = (data: SomeOneElseFormValues) => {
    recipientInfoForm.reset({
      recipient: 'someone-else',
    })

    setSomeOneElseInfo({
      name: data.name,
      mobile: Number(data.mobile),
    })

    setIsDrawerOpen(false)
  }

  const onRecipientInfoFormSubmit = (data: RecipientInfoFormValues) => {
    console.log(data)
    if (data.recipient === 'me') {
      onSubmitRecipient({
        name: user.name,
        mobile: user.mobile,
      })
    } else if (data.recipient === 'someone-else' && someOneElseInfo) {
      onSubmitRecipient({
        name: someOneElseInfo.name,
        mobile: someOneElseInfo.mobile,
      })
    }
  }

  return (
    <>
      <Form {...recipientInfoForm}>
        <form onSubmit={recipientInfoForm.handleSubmit(onRecipientInfoFormSubmit)}>
          <FormField
            control={recipientInfoForm.control}
            name="recipient"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
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
          <Footer>
            <Button type="submit" className="w-full bg-primary">
              Save
            </Button>
          </Footer>
        </form>
      </Form>
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
      <Drawer open={isDrawerOpen}>
        <div className="flex flex-col p-6">
          <div className="flex justify-between pb-6">
            <h6>Recipient Information</h6>
            <XIcon
              onClick={() => {
                setIsDrawerOpen(false)
                !someOneElseInfo && recipientInfoForm.setValue('recipient', 'me')
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
    </>
  )
}

const addressFormSchema = z.object({
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

  postcode: z
    .string('Postcode is required')
    .nonempty('Postcode is required')
    .regex(/^\d{4}$/, 'Postcode must be a 4-digit value'),
})

export type AddressFormValues = z.infer<typeof addressFormSchema>

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

export const AddressForm = ({
  address,
  onAddressFormSubmit,
}: {
  address?: Partial<StoredAddress> | null
  onAddressFormSubmit: (data: AddressFormValues) => void
}) => {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
  })

  useEffect(() => {
    if (address) {
      form.reset({
        addressTitle: address.title,
        suburb: address.suburb,
        state: address.state,
        postcode: String(address.postcode ?? ''),
        streetAddress: address.streetAddress,
      })
    }
  }, [form, address])

  return (
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
  )
}
