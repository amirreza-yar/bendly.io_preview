'use client'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Info } from '@/components/uikit/icons'
import { Input, LabeledInput } from '@/components/uikit/input'
import { Button } from '@/components/uikit/buttons/button'
import Link from 'next/link'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { notFound, useParams, useRouter, useSearchParams } from 'next/navigation'
import { useNewJobReference } from '@/providers/data_providers/job_reference_providers/AddJobReferenceContext'
import { jobReferences } from '@/utilities/demo_datas/demoJobRefData'
import { toast } from 'sonner'

let existingCodes: string[]
const formSchema = z.object({
  jobReferenceCode: z
    .string()
    .nonempty('Job reference code is required')
    .refine((val: any) => !existingCodes.includes(val), {
      message: 'Job Reference Code already exists',
    }),
  projectName: z.string(),
})

type FormValues = z.infer<typeof formSchema>

export default function JobReferencesPage({}) {
  const { jobCode } = useParams()

  const jobReference = jobReferences.find((job) => job.code === jobCode)
  existingCodes = jobReferences.map((job) => job.code).filter((code) => code !== jobCode)

  if (!jobReference) {
    notFound()
  }

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
    router.push(`/dashboard/job-references/${jobCode}`)
    toast('Job Reference Updated')
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-center z-10 bg-white border-b-1 border-border-dark">
        <div className="flex items-center justify-between h-full w-full px-4">
          <div className="flex items-center gap-[18px] pr-3">
            <Link href={`/dashboard/job-references/${jobCode}`}>
              <ArrowLeft />
            </Link>
            <h6>Edit Basic Information</h6>
          </div>
        </div>
      </header>
      <div className="overflow-scroll h-full pt-18 pb-22 px-4">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <LabeledInput
            label="Job Refrence Code"
            defaultValue={jobReference.code}
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
            defaultValue={jobReference.projectName}
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
