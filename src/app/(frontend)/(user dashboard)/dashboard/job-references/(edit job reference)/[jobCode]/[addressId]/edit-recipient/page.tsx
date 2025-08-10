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
import { jobReferences } from '@/utilities/demo_datas/demoJobRefData'

const formSchema = z.object({
  recipientFullName: z
    .string()
    .min(1, 'Full name is required')
    .regex(/^[a-zA-Z\s]+$/, 'Full name must contain only letters'),
  recipientMobileNumber: z
    .string()
    .min(10, 'Please enter a valid number')
    .max(10, 'Please enter a valid number')
    .regex(/^\d+$/, 'Mobile number must contain only digits'),
})

type FormValues = z.infer<typeof formSchema>

export default function JobReferencesPage({}) {
  const { jobCode, addressId } = useParams()

  const address = jobReferences
    .find((job) => job.code === jobCode)
    ?.addresses.find((addr) => addr.id === addressId)

  if (!address) {
    notFound()
  }

  const router = useRouter()

  const [radioValue, setRadioValue] = useState('me')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    address.recipientName = data.recipientFullName
    address.recipientMobile = data.recipientMobileNumber

    setRadioValue('someone-else')

    setIsDrawerOpen(false)
  }

  const handleNextClick = () => {
    toast('Recipient Updated')
    router.push(`/dashboard/job-references/${jobCode}/${addressId}`)
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-center z-10 bg-white border-b-1 border-border-dark">
        <div className="flex items-center justify-between h-full w-full px-4">
          <div className="flex items-center gap-[18px] pr-3">
            <Link href={`/dashboard/job-references/${jobCode}/${addressId}`}>
              <ArrowLeft />
            </Link>
            <h6>Edit Recipient</h6>
          </div>
        </div>
      </header>
      <div className="overflow-scroll h-full pt-18 pb-22 px-4">
        <div className="grid gap-4">
          <div>
            <h6 className="text-smd-m">Who will receive this order delivery?</h6>
          </div>
          <RadioGroup value={radioValue} onValueChange={setRadioValue}>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="me" id="me" />
              <p className="label-regular">Me (Amirreza)</p>
            </div>
            <div
              className="flex items-center gap-3 pt-1"
              onClick={() => !address.recipientName && setIsDrawerOpen(true)}
            >
              <RadioGroupItem value="someone-else" id="someone-else" />
              <p className="label-regular">Someone else</p>
            </div>
          </RadioGroup>
          {address.recipientName && (
            <div
              data-slot="card"
              className="grid gap-4 rounded-md border-1 border-border-default bg-surface-card py-3 px-4 relative"
              onClick={() => setIsDrawerOpen(true)}
            >
              <Edit className="absolute top-3 right-3 size-5" />
              <div className="grid gap-2">
                <p className="label-regular">Delivery Recipient</p>
                <p className="caption-regular text-subtitle pt-1">{address.recipientName}</p>
                <p className="caption-regular font-regular">+61{address.recipientMobile}</p>
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
                    if (!address.recipientName) {
                      setRadioValue('me')
                    }
                  }}
                  className="size-6"
                />
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                <LabeledInput
                  label="Recipient Full Name"
                  required
                  defaultValue={address.recipientName}
                  type="text"
                  placeholder="Enter the full name"
                  error={!!errors.recipientFullName}
                  helpText={errors.recipientFullName?.message}
                  {...register('recipientFullName')}
                />
                <LabeledInputWithCode
                  label="Recipient Mobile Number"
                  required
                  defaultValue={address.recipientMobile}
                  type="number"
                  placeholder="e.g., 400123456"
                  error={!!errors.recipientMobileNumber}
                  helpText={errors.recipientMobileNumber?.message}
                  {...register('recipientMobileNumber')}
                />

                <Button type="submit" className="mt-3">
                  Confirm
                </Button>
              </form>
            </div>
          </Drawer>
          <div className="fixed bottom-0 left-0 w-full h-19 z-10 bg-white border-t-1 border-border-dark px-4">
            <div className="w-full h-full">
              <div className="flex justify-around items-center h-full">
                {/* <Link href={`/${slug}/canvas`} className="w-full"> */}
                <Button onClick={handleNextClick} type="submit" className="w-full bg-primary">
                  Save
                </Button>
                {/* </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors, isSubmitting },
  //   reset,
  // } = useForm<FormValues>({
  //   resolver: zodResolver(formSchema),
  // })

  // const router = useRouter()

  // const onSubmit = (data: FormValues) => {
  //   router.push(`/dashboard/job-references/add/address-details`)
  //   reset()
  // }

  // return (
  //   <>

  //   </>
  // )
}
