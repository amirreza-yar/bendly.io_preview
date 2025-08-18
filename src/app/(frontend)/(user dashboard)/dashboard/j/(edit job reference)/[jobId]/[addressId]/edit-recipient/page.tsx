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
import { useGETJobRefAddressByIds } from '@/lib/db/helpers/jobRefHelpers'
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
import { RecipientForm } from '@/components/dashboard/jobReference/forms'

const SomeOneElseFormSchema = z.object({
  name: z
    .string('Full name is required')
    .min(1, 'Full name is required')
    .regex(/^[a-zA-Z\s]+$/, 'Full name must contain only letters'),
  mobile: z
    .number('Mobile number is required')
    .min(10, 'Please enter a valid number')
    .max(10, 'Please enter a valid number'),
})

type SomeOneElseFormValues = z.infer<typeof SomeOneElseFormSchema>

const RecipientInfoFormSchema = z.object({
  type: z.enum(['me', 'someoneelse']).nonoptional(),
})

type RecipientInfoFormValues = z.infer<typeof RecipientInfoFormSchema>

export default function JobReferencesPage({}) {
  const { jobId, addressId } = useParams<{ jobId: string; addressId: string }>()

  const address = useGETJobRefAddressByIds(jobId, addressId)

  if (address === undefined) {
    notFound()
  }

  const [user, setUser] = useState<{ name: string; mobile: number }>({
    name: 'Amirreza Yarahmadi',
    mobile: 8987654123,
  })

  const [someOneElseInfo, setSomeOneElseInfo] = useState<{
    name: string
    mobile: number
  }>()

  const router = useRouter()

  const [radioValue, setRadioValue] = useState('me')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const someOneElseForm = useForm<SomeOneElseFormValues>({
    resolver: zodResolver(SomeOneElseFormSchema),
  })

  const recipientInfoForm = useForm<RecipientInfoFormValues>({
    resolver: zodResolver(RecipientInfoFormSchema),
  })

  useEffect(() => {
    if (someOneElseInfo) {
      someOneElseForm.reset({
        name: someOneElseInfo.name,
        mobile: someOneElseInfo.mobile,
      })
    }
  }, [someOneElseInfo, someOneElseForm])

  const onSomeOneElseInfoFormSubmit = (data: z.infer<typeof SomeOneElseFormSchema>) => {
    // address.recipientName = data.recipientFullName
    // address.recipientMobile = data.recipientMobileNumber

    setRadioValue('someone-else')

    setIsDrawerOpen(false)
  }

  const handleNextClick = () => {
    toast('Recipient Updated')
    router.push(`/dashboard/j/${jobId}/${addressId}`)
  }

  return (
    <>
      <Header title="Edit Recipient" returnHref={`/dashboard/j/${jobId}/${addressId}`} />
      <ContentWrapper>
        <div className="grid gap-4">
          <div>
            <h6 className="text-smd-m">Who will receive this order delivery?</h6>
          </div>
          <RecipientForm />
        </div>
      </ContentWrapper>
    </>
  )
}
