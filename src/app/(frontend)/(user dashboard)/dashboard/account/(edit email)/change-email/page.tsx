'use client'
import { useState } from 'react'
import { Button } from '@/components/uikit/buttons/button'
import { Info, Mail } from '@/components/uikit/icons'
import { Input, LabeledInput } from '@/components/uikit/input'
import { Footer } from '@/components/dashboard/footer'
import { AlertDialogContent, AlertModal } from '@/components/uikit/alertModal'
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
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUser } from '@/providers/main_providers/UserContext'
import { apiSendEmailCode } from '@/utilities/api/auth'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { EmailInputValue } from '@/components/dashboard/auth/forms'
import { XIcon } from '@/components/uikit/icons'
import { cva } from 'class-variance-authority'
import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

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
    defaultValues: { email: user.email },
  })

  const { isDirty } = form.formState

  const onSendVerifyCode = async (data: EmailInputValue) => {
    // const res = await apiSendEmailCode(data.email)
    // if (res.apiCode === '100100') {
    //   router.push(`/auth/signup?email=${data.email}`)
    //   toast('Verification code sent')
    // } else if (res.apiCode === '100102') {
    //   router.push(`/auth/login?email=${data.email}`)
    // } else if (res.apiCode === '100103') {
    //   toast('Wait before sending new code')
    // } else {
    //   toast('Something went wrong. Try again')
    // }
    // console.log(res)

    console.log('form submited', data.email, isDirty)

    router.push(`/dashboard/account/verify-current-email?email=${data.email}`)
  }

  return (
    <>
      <Header title="Change Email" returnHref="/dashboard/account" />

      <ContentWrapper className="pt-18">
        <Form {...form}>
          <form
            id="change-email-form"
            onSubmit={form.handleSubmit(onSendVerifyCode)}
            className="grid gap-6"
          >
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
          </form>
        </Form>
        <div className="mt-6 border-border-seprator border p-3 rounded-lg flex gap-3 ">
          <Info className="size-6" />
          <p className="body-small text-body">
            To change your email address, you must first verify your current email again
          </p>
        </div>
      </ContentWrapper>

      <Footer>
        <Button disabled={!isDirty} className="w-full" onClick={() => setIsModalOpen(true)}>
          Send Verify Code
        </Button>
      </Footer>

      <AlertDialogPrimitive.Root data-slot="alert-dialog" open={isModalOpen}>
        <AlertDialogPrimitive.Trigger
          data-slot="alert-dialog-trigger"
          asChild
        ></AlertDialogPrimitive.Trigger>
        <AlertDialogContent className="font-roboto">
          <div data-slot="alert-dialog-header" className="flex flex-col gap-4">
            <AlertDialogPrimitive.Cancel className="absolute top-4 end-4 [&_svg:not([class*='size-'])]:size-6">
              <XIcon
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-dark"
                variant="secondary"
              />
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Title
              data-slot="alert-dialog-title"
              className="text-sm/[19px] font-semibold"
            >
              Verify Your Identity
            </AlertDialogPrimitive.Title>

            <AlertDialogPrimitive.Description
              data-slot="alert-dialog-description"
              className="text-muted-foreground text-sm"
            >
              To change your email address, you first need to confirm your current one.
            </AlertDialogPrimitive.Description>
          </div>
          <div data-slot="alert-dialog-footer" className="grid gap-4">
            <AlertDialogPrimitive.Action asChild>
              <Button type="submit" form="change-email-form">
                Send Verify Code
              </Button>
            </AlertDialogPrimitive.Action>

            <AlertDialogPrimitive.Cancel asChild>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </AlertDialogPrimitive.Cancel>
          </div>
        </AlertDialogContent>
      </AlertDialogPrimitive.Root>
    </>
  )
}
