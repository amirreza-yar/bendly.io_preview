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

// Validation schema
const CreateAccountFormSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters long')
    .max(50, 'Full name must be less than 50 characters'),
})

type CreateAccountFormValues = z.infer<typeof CreateAccountFormSchema>

export default function EditNamePage() {
  const { user } = useUser()

  const form = useForm<CreateAccountFormValues>({
    resolver: zodResolver(CreateAccountFormSchema),
    defaultValues: { fullName: user.fullname || '' },
  })

  const onSubmit = (data: CreateAccountFormValues) => {
    console.log('New Full Name:', data.fullName)
  }

  return (
    <>
      <Header title="Edit Full Name" returnHref="/dashboard/account/edit-account" />
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
