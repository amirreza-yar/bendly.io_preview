'use client'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Info } from '@/components/uikit/icons'
import { Input, LabeledInput } from '@/components/uikit/input'
import { Button } from '@/components/uikit/buttons/button'
import Link from 'next/link'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useNewJobReference } from '@/providers/data_providers/job_reference_providers/AddJobReferenceContext'
import { jobReferCodeExists } from '@/lib/db/helpers/jobRefHelpers'

const formSchema = z.object({
  jobReferenceCode: z
    .string()
    .nonempty('Job reference code is required')
    .refine(
      async (val) => {
        // Check the DB for existence
        const exists = await jobReferCodeExists(Number(val))
        return !exists // return true if it's valid (i.e., does NOT exist)
      },
      { message: 'Job Reference Code already exists' },
    ),
  projectName: z.string().nonempty('Project name is required'),
})

type FormValues = z.infer<typeof formSchema>

export default function JobReferencesPage() {
  const { newJobReference, setNewJobReference } = useNewJobReference()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const router = useRouter()

  const onSubmit = (data: FormValues) => {
    setNewJobReference({
      jobReferenceCode: data.jobReferenceCode,
      projectName: data.projectName || '',
    })

    router.push(`/dashboard/j/add/address-details`)
    // reset()
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-center z-10 bg-white border-b-1 border-border-dark">
        <div className="flex items-center justify-between h-full w-full px-4">
          <div className="flex items-center gap-[18px] pr-3">
            <Link href="/dashboard/j">
              <ArrowLeft />
            </Link>
            <h6>Basic Information</h6>
          </div>
        </div>
      </header>
      <div className="overflow-scroll h-full pt-18 pb-22 px-4">
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
          <div className="fixed bottom-0 left-0 w-full h-19 z-10 bg-white border-t-1 border-border-dark px-4">
            <div className="w-full h-full">
              <div className="flex justify-around items-center h-full">
                {/* <Link href={`/${slug}/canvas`} className="w-full"> */}
                <Button type="submit" className="w-full bg-primary">
                  Next
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
