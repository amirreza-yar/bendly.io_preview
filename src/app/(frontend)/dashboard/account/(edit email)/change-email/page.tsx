'use client'
import { useState } from 'react'
import { Button } from '@/components/uikit/buttons/button'
import { Info } from '@/components/uikit/icons'
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

const FormSchema = z.object({
  email: z.email('Please enter a valid email').nonempty('This field is requiered'),
})

type FormValues = z.infer<typeof FormSchema>

export default function AccountPage() {
  const router = useRouter()
  const { user } = useUser()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  async function fakeVerifyEmail(email: string): Promise<boolean> {
    return email === user.email
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: '' },
  })

  const handleVerify = async (data: FormValues) => {
    const isEmailVarified = await fakeVerifyEmail(data.email)

    if (isEmailVarified) {
      setIsModalOpen(true)
    } else {
      form.setError('email', {
        type: 'data_not_verified',
        message: 'Incorrect Email. Please try again',
      })
    }
    // router.push('/dashboard/account/edit-current-mobile-number')
  }

  return (
    <>
      <Header title="Change Email" returnHref="/dashboard/account" />

      <ContentWrapper className="pt-18">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleVerify)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Current Email" {...field} />
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
