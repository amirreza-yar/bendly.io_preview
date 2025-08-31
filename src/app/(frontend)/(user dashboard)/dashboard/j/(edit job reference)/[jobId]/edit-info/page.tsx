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
  useGETJobRefById,
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
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'

export default function JobReferencesPage({}) {
  const { jobId } = useParams<{ jobId: string }>()

  const jobReference = useGETJobRefById(jobId)

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
          const exists = await jobReferCodeExists({ jobRefId: jobReference?.id, code: Number(val) })
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
  }, [jobReference, form])

  const router = useRouter()

  const onSubmit = async (data: FormValues) => {
    updateJobReference(jobReference?.id ?? '', {
      code: Number(data.jobReferenceCode),
      projectName: data.projectName,
    }).then(() => {
      router.push(`/dashboard/j/${jobReference?.id}`)
      toast('Job Reference Updated')
    })
  }

  const { isDirty } = form.formState

  return (
    <>
      <Header title="Edit Basic Infromation" returnHref={`/dashboard/j/${jobReference?.id}`} />
      <ContentWrapper>
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
      </ContentWrapper>
    </>
  )
}
