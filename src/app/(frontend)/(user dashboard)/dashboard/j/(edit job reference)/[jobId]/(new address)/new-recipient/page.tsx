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
import { useNewAddress } from '@/providers/data_providers/job_reference_providers/NewAddressContext'
import { jobReferences } from '@/utilities/demo_datas/demoJobRefData'
import { getJobRefById, updateJobReference } from '@/lib/db/helpers/jobRefHelpers'
import { generateRandomId } from '@/lib/db/helpers/utils'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'

const formSchema = z.object({
  recipientFullName: z
    .string()
    .min(1, 'Full name is required')
    .regex(/^[a-zA-Z\s]+$/, 'Full name must contain only letters'),
  recipientMobileNumber: z
    .string()
    .min(10, 'Please enter a valid number')
    .regex(/^\d+$/, 'Mobile number must contain only digits'),
})

type FormValues = z.infer<typeof formSchema>

export default function JobReferencesPage({}) {
  const { jobId } = useParams<{ jobId: string }>()

  const jobReference = getJobRefById(jobId)

  const { newAddress, setNewAddress } = useNewAddress()

  const router = useRouter()

  if (
    !(
      newAddress.addressTitle &&
      newAddress.streetAddress &&
      newAddress.suburb &&
      newAddress.state &&
      newAddress.postcode
    )
  ) {
    notFound()
  }

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
    console.log('Recipient data submitted:', data)

    setNewAddress({
      recipientFullName: data.recipientFullName,
      recipientMobileNumber: data.recipientMobileNumber,
    })

    setRadioValue('someone-else')

    setIsDrawerOpen(false)
  }

  const handleNextClick = async () => {
    const recipientName = newAddress.recipientFullName
      ? newAddress.recipientFullName
      : 'Amirreza Yarahmadi'

    const recipientMobile = newAddress.recipientMobileNumber
      ? Number(newAddress.recipientMobileNumber)
      : 8987654123

    await updateJobReference(jobReference?.id ?? '', {
      addresses: [
        {
          id: generateRandomId({ length: 4 }),
          title: newAddress.addressTitle ?? '',
          streetAddress: newAddress.streetAddress,
          suburb: newAddress.suburb,
          state: newAddress.state,
          postcode: Number(newAddress.postcode),
          recipientName: recipientName,
          recipientMobile: recipientMobile,
        },
      ],
    })

    toast('New Address Added')
    router.push(`/dashboard/j/${jobReference?.id}`)
  }

  return (
    <>
      <Header
        title="Recipient"
        returnHref={`/dashboard/j/${jobReference?.id}/new-address-details`}
      />
      <ContentWrapper>
        <div className="grid gap-4">
          <Link
            href={`/dashboard/j/${jobReference?.id}/new-address-details`}
            data-slot="card"
            className="grid gap-4 rounded-md border-1 border-border-default bg-surface-card py-3 px-4 relative mb-4"
          >
            <Edit className="absolute top-3 right-3 size-5" />
            <div className="grid gap-2">
              <div className="flex gap-2">
                <MapMarker className="size-5" />
                <div className="flex flex-col gap-1 truncate">
                  <p className="label-regular">{newAddress.addressTitle}</p>
                  <p className="body-small">
                    {newAddress.streetAddress}, {newAddress.suburb}, {newAddress.state}{' '}
                    {newAddress.postcode}
                  </p>
                </div>
              </div>
            </div>
          </Link>
          <div>
            <h6 className="text-smd-m">Who will receive this order delivery?</h6>
          </div>
          <RadioGroup value={radioValue} onValueChange={setRadioValue}>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="me" />
              <p className="label-regular">Me (Amirreza)</p>
            </div>
            <div
              className="flex items-center gap-3 pt-1"
              onClick={() => !newAddress.recipientFullName && setIsDrawerOpen(true)}
            >
              <RadioGroupItem value="someone-else" />
              <p className="label-regular">Someone else</p>
            </div>
          </RadioGroup>
          {newAddress.recipientFullName && (
            <div
              data-slot="card"
              className="grid gap-4 rounded-md border-1 border-border-default bg-surface-card py-3 px-4 relative"
              onClick={() => setIsDrawerOpen(true)}
            >
              <Edit className="absolute top-3 right-3 size-5" />
              <div className="grid gap-2">
                <p className="label-regular">Delivery Recipient</p>
                <p className="caption-regular text-subtitle pt-1">{newAddress.recipientFullName}</p>
                <p className="caption-regular font-regular">
                  +61{newAddress.recipientMobileNumber}
                </p>
              </div>
            </div>
          )}
          <Drawer open={isDrawerOpen} trigger>
            <div className="flex flex-col p-6">
              <div className="flex justify-between pb-6">
                <h6>Recipient Information</h6>
                <XIcon
                  onClick={() => {
                    setIsDrawerOpen(false)
                    if (!newAddress.recipientFullName) {
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
                  defaultValue={newAddress.recipientFullName}
                  type="text"
                  placeholder="Enter the full name"
                  error={!!errors.recipientFullName}
                  helpText={errors.recipientFullName?.message}
                  {...register('recipientFullName')}
                />
                <LabeledInputWithCode
                  label="Recipient Mobile Number"
                  required
                  defaultValue={newAddress.recipientMobileNumber}
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
      </ContentWrapper>
    </>
  )
}
