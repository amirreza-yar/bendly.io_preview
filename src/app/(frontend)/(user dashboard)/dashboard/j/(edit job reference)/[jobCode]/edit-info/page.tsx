'use client'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Info } from '@/components/uikit/icons'
import { Input, LabeledInput } from '@/components/uikit/input'
import { Button } from '@/components/uikit/buttons/button'
import Link from 'next/link'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { notFound, useParams, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import {
  getJobRefById,
  jobReferCodeExists,
  updateJobReference,
} from '@/lib/db/helpers/jobRefHelpers'
import { useEffect } from 'react'
import {
  FormControl,
  FormField,
  FormItem,
  Form,
  FormLabel,
  FormMessage,
} from '@/components/uikit/form'
import { Footer } from '@/components/dashboard/footer'

export default function JobReferencesPage({}) {
  const { jobCode } = useParams()

  const jobReference = getJobRefById(Number(jobCode))

  if (jobReference === undefined) {
    // notFound()
  }

  const formSchema = z.object({
    jobReferenceCode: z
      .string()
      .nonempty('Job reference code is required')
      .regex(/^[0-9]+$/, 'Digits only')
      .refine(
        async (val) => {
          const exists = await jobReferCodeExists(Number(val))
          return !exists
        },
        { message: 'Job Reference Code already exists' },
      ),
    projectName: z.string().optional(),
  })

  type FormValues = z.infer<typeof formSchema>

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    if (jobReference) {
      form.reset({
        jobReferenceCode: String(jobReference.code),
        projectName: jobReference.projectName,
      })
    }
    console.log(form.formState.isDirty)
  }, [jobReference, form])

  const router = useRouter()

  const onSubmit = async (data: FormValues) => {
    updateJobReference(Number(jobCode), {
      code: Number(data.jobReferenceCode),
      projectName: data.projectName,
    }).then(() => {
      const newCode = data.jobReferenceCode
      router.push(`/dashboard/j/${newCode}`)
      toast('Job Reference Updated')
    })
  }

  const { isDirty } = form.formState

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-center z-10 bg-white border-b-1 border-border-dark">
        <div className="flex items-center justify-between h-full w-full px-4">
          <div className="flex items-center gap-[18px] pr-3">
            <Link href={`/dashboard/j/${jobCode}`}>
              <ArrowLeft />
            </Link>
            <h6>Edit Basic Information</h6>
          </div>
        </div>
      </header>
      <div className="overflow-scroll h-full pt-18 pb-22 px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="jobReferenceCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Refrence Code</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter unique Job Reference code"
                      {...field}
                      value={field.value ?? 0}
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
                  <FormLabel>Job Refrence Code</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter unique Job Reference code"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage>Name this job reference for easy identification</FormMessage>
                </FormItem>
              )}
            />
            <Footer>
              <Button type="submit" className="w-full" disabled={!isDirty}>
                Next
              </Button>
            </Footer>
          </form>
        </Form>
      </div>
    </>
  )
}
