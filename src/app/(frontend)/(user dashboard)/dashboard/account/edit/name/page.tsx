'use client'
import { Button } from '@/components/uikit/buttons/button'
import { LabeledInput } from '@/components/uikit/input'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { Footer } from '@/components/dashboard/footer'
import { useUser } from '@/providers/main_providers/UserContext'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/uikit/form'
import { toast } from 'sonner'
import api, { fetcher } from '@/lib/axios'
import useSWR from 'swr'
import { notFound, useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Validation schema
const CreateAccountFormSchema = z.object({
  fullName: z
    .string()
    .nonempty('Fullname is required')
    .regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/, 'You have digit or character in your name?')
    .min(2, 'Full name must be at least 2 characters long')
    .max(50, 'Full name must be less than 50 characters'),
})

type CreateAccountFormValues = z.infer<typeof CreateAccountFormSchema>

export default function EditNamePage() {
  const router = useRouter()

  const form = useForm<CreateAccountFormValues>({
    resolver: zodResolver(CreateAccountFormSchema),
  })

  const { data, isLoading } = useSWR('/d/profile/', fetcher, {
    onError: () => notFound(),
  })

  useEffect(() => {
    if (data) {
      form.reset({
        fullName: `${data.first_name} ${data.last_name}`,
      })
    }
  }, [data, form])

  const onSubmit = async (data: CreateAccountFormValues) => {
    try {
      const parts = data.fullName.trim().split(/\s+/)
      const firstName = parts[0]
      const lastName = parts.slice(1).join(' ') || ''

      await api.patch('/d/profile/', {
        first_name: firstName,
        last_name: lastName,
      })

      toast('Full Name Updated')
      router.replace('/dashboard/account/')
    } catch (error: any) {
      toast('Something went wrong!')
    }
  }

  return (
    <>
      <Header title="Edit Full Name" returnHref="/dashboard/account/edit" />
      <ContentWrapper className="pt-18">
        {/* Give form an ID so Footer button can reference it */}
        <Form {...form}>
          <form id="edit-name-form" className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-2 label-regular">
                    Full Name
                    <span className="text-[#E50000]">*</span>
                  </FormLabel>
                  <FormControl>
                    <LabeledInput
                      type="text"
                      placeholder="Enter your full name"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </ContentWrapper>
      <Footer>
        {/* Button outside form, but linked via form attribute */}
        <Button type="submit" form="edit-name-form" className="w-full bg-primary md:max-w-[700px]">
          Save
        </Button>
      </Footer>
    </>
  )
}
