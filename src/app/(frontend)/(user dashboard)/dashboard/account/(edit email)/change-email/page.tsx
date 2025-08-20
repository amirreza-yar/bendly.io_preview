'use client'
import { useState } from 'react'
import { Button } from '@/components/uikit/buttons/button'
import { Info, Mail } from '@/components/uikit/icons'
import { Input, LabeledInput } from '@/components/uikit/input'
import { Footer } from '@/components/dashboard/footer'
import { AlertModal } from '@/components/uikit/alertModal'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { useRouter } from 'next/navigation'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/uikit/form'
import { email, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUser } from '@/providers/main_providers/UserContext'
import { apiSendEmailCode } from '@/utilities/api/user_auth/auth'
import { useSearchParams } from 'next/navigation'
import { HeaderWithCenterTitle } from '@/components/dashboard/header'
import { toast } from 'sonner'
import { AuthEmailForm, EmailInputValue } from '@/components/dashboard/auth/forms'

const FormSchema = z.object({
  email: z.email('Please enter a valid email').nonempty('This field is requiered'),
})

type FormValues = z.infer<typeof FormSchema>

export default function AccountPage() {
  const router = useRouter()
  const { user } = useUser()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: '' },
  })

  const defaultEmail = useSearchParams().get('email')

  const onSubmitEmail = async (data: EmailInputValue) => {
    const res = await apiSendEmailCode(data.email)
    if (res.apiCode === '100100') {
      router.push(`/auth/signup?email=${data.email}`)
      toast('Verification code sent')
    } else if (res.apiCode === '100102') {
      router.push(`/auth/login?email=${data.email}`)
    } else if (res.apiCode === '100103') {
      toast('Wait before sending new code')
    } else {
      toast('Something went wrong. Try again')
    }

    console.log(res)
  }

  return (
    <>
      <Header title="Change Email" returnHref="/dashboard/account" />

      <ContentWrapper className="pt-18">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitEmail)} className="grid gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <LabeledInput
                      icon={Mail}
                      placeholder="Enter your email"
                      {...field}
                      value={field.value ?? ''}
                      error={Boolean(form.getFieldState('email').error)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Footer>
              <Button type="submit" className="w-full bg-primary">
                Send Verify Code
              </Button>
            </Footer>
          </form>
        </Form>
        <div className="mt-6 border-border-seprator border p-3 rounded-lg flex gap-3 ">
          <Info className="size-6" />
          <p className="body-small text-body">
            To change your email address, you must first verify your current email again
          </p>
        </div>
      </ContentWrapper>

      <AlertModal
        title="Verify you identity"
        description="To change your email address, you first need to confirm your current one."
        cancelButtonText="Cencel"
        actionButtonText="Send Verification code"
        open={isModalOpen}
        onAction={() => {
          setIsModalOpen(false)
        }}
        onCancle={() => {
          setIsModalOpen(false)
        }}
      />
    </>
  )
}
