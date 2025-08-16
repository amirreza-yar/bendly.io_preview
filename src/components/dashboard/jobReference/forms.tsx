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

const SomeOneElseFormSchema = z.object({
  name: z
    .string('Full name is required')
    .min(1, 'Full name is required')
    .regex(/^[a-zA-Z\s]+$/, 'Full name must contain only letters'),
  mobile: z
    .string('Mobile number is required')
    .nonempty('Mobile number is required')
    .min(10, 'Please enter a valid number')
    .max(10, 'Please enter a valid number'),
})

type SomeOneElseFormValues = z.infer<typeof SomeOneElseFormSchema>

const RecipientInfoFormSchema = z.object({
  recipient: z.enum(['me', 'someone-else']).nonoptional(),
})

type RecipientInfoFormValues = z.infer<typeof RecipientInfoFormSchema>

export function RecipientForm() {
  const [user] = useState<{ name: string; mobile: number }>({
    name: 'Amirreza Yarahmadi',
    mobile: 8987654123,
  })

  const [someOneElseInfo, setSomeOneElseInfo] = useState<{
    name: string
    mobile: string
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

  const recipient = recipientInfoForm.watch('recipient')

  useEffect(() => {
    if (someOneElseInfo) {
      someOneElseForm.reset({
        name: someOneElseInfo.name,
        mobile: someOneElseInfo.mobile,
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
      mobile: data.mobile,
    })

    setIsDrawerOpen(false)
  }

  const onRecipientInfoFormSubmit = (data: RecipientInfoFormValues) => {
    console.log(data)
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
                    defaultValue={field.value}
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
                // !someOneElseInfo &&
                recipientInfoForm.reset({
                  recipient: 'me',
                })
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
