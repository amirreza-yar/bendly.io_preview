'use client'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Info } from '@/components/uikit/icons'
import { Input, LabeledInput } from '@/components/uikit/input'
import { Button } from '@/components/uikit/buttons/button'
import Link from 'next/link'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useNewJobReference } from '@/providers/data_providers/job_reference_providers/AddJobReferenceContext'
import { jobReferCodeExists } from '@/lib/db/helpers/jobRefHelpers'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { Footer } from '@/components/dashboard/footer'

const formSchema = z.object({
  jobReferenceCode: z
    .string()
    .nonempty('Job reference code is required')
    .refine(
      async (val) => {
        // Check the DB for existence
        const exists = await jobReferCodeExists({ code: Number(val) })
        return !exists // return true if it's valid (i.e., does NOT exist)
      },
      { message: 'Job Reference Code already exists' },
    ),
  projectName: z.string().nonempty('Project name is required'),
})

type FormValues = z.infer<typeof formSchema>

export default function JobReferencesPage() {
  const { orderId } = useParams<{ orderId: string }>()

  const returnHref = useSearchParams().get('return')

  const { newJobReference, setNewJobReference } = useNewJobReference()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const router = useRouter()

  const onSubmit = (data: FormValues) => {
    setNewJobReference({
      jobReferenceCode: data.jobReferenceCode,
      projectName: data.projectName || '',
    })

    router.push(
      returnHref === 'delivery'
        ? `/o/${orderId}/delivery-ship/j/add/address-details?return=${returnHref}`
        : `/o/${orderId}/delivery-ship/j/add/address-details`,
    )
  }

  return (
    <>
      <Header
        title="Basic Information"
        returnHref={
          returnHref === 'delivery'
            ? `/o/${orderId}/delivery-ship`
            : `/o/${orderId}/delivery-ship/j`
        }
      />

      <ContentWrapper className="pt-18">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="bg-surface-info-subtle text-primary-dark rounded-md p-3 body-small flex items-start gap-3">
            <Info className="size-4 mt-1" />
            <p>Each Job Reference can include multiple delivery addresses</p>
          </div>
          <LabeledInput
            label="Job Refrence Code"
            defaultValue={newJobReference.jobReferenceCode}
            required
            type="text"
            placeholder="Enter unique Job Reference code"
            error={!!errors.jobReferenceCode}
            helpText={
              errors.jobReferenceCode?.message || 'A unique code you assign to identify this job'
            }
            {...register('jobReferenceCode')}
          />
          <LabeledInput
            label="Project Name (Optional)"
            defaultValue={newJobReference.projectName}
            type="text"
            placeholder="Enter your project name"
            helpText="Name this job reference for easy identification"
            {...register('projectName')}
          />
          <Footer>
            <Button type="submit" className="w-full bg-primary">
              Next
            </Button>
          </Footer>
        </form>
      </ContentWrapper>
    </>
  )
}
