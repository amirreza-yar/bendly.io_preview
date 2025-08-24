'use client'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/uikit/form'
import { Select } from '@/components/uikit/select'
import { Button } from '@/components/uikit/buttons/button'

const formSchema = z.object({
  reason: z.string(),
})

const reasons = [
  { value: 'privacy', label: 'Privacy concern' },
  { value: 'serv', label: 'No longer using the service' },
  { value: 'alt', label: 'Found a better alternative' },
]

export default function finalConfirmPage() {
  const form = useForm({
    resolver: zodResolver(formSchema),
  })

  const onSubmitForm = (data) => {
    console.log(data)
  }

  return (
    <>
      <Header title="Final Confirmation" returnHref="/dashboard/profile" />
      <ContentWrapper classname="grid content-between text-center">
        <div className="gird gap-2 pt-4 px-4">
          <h5 className="text-center">Final Confirmation: Delete Your Account</h5>
          <p className="subtitle-regular text-center pt-4">
            This action is permanent and will delete all your data. This cannot be undone.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)}>
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid gap-2">
                      <Select
                        label="Why are you deleting your account? (Optional)"
                        items={reasons}
                        placeholder="Please select one of the options"
                        required
                        {...field}
                        value={field.value ?? ''}
                        onValueChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-2 text-center justify-center h-11 mt-6">
              <Button
                type='submit'
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </ContentWrapper>
    </>
  )
}
