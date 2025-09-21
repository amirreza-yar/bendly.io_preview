'use client'
import { useState } from 'react'
import { Button } from '@/components/uikit/buttons/button'
import { Info } from '@/components/uikit/icons'
import { LabeledInputWithCode } from '@/components/uikit/input'
import { Footer } from '@/components/dashboard/footer'
import { AlertDialogContent } from '@/components/uikit/alertModal'
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
import { XIcon } from '@/components/uikit/icons'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

// --- Schema ---
const FormSchema = z.object({
  mobile: z.string().regex(/^\d+$/, 'Please enter a valid mobile number'),
})

type FormValues = z.infer<typeof FormSchema>

export default function EditMobile() {
  const router = useRouter()
  const { user } = useUser()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { mobile: user?.mobile?.toString() ?? '' },
  })

  const { isDirty } = form.formState

  const onSendVerifyCode = async (data: FormValues) => {
    console.log('form submitted', data.mobile, isDirty)
    router.push(`/dashboard/account/edit-account/verify-current-mobile?mobile=${data.mobile}`)
  }

  return (
    <>
      <Header
        title="Change Mobile Number"
        returnHref="/dashboard/account/edit-account/edit-mobile"
      />

      <ContentWrapper className="pt-18">
        <Form {...form}>
          <form
            id="change-email-form"
            onSubmit={form.handleSubmit(onSendVerifyCode)}
            className="grid gap-6"
          >
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <LabeledInputWithCode
                      placeholder="Enter your mobile number"
                      {...field}
                      value={field.value ?? ''}
                      error={Boolean(form.getFieldState('mobile').error)}
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
            To change your mobile number, you must first verify your current number again
          </p>
        </div>
      </ContentWrapper>

      <Footer>
        <Button disabled={!isDirty} className="w-full" onClick={() => setIsModalOpen(true)}>
          Send Verify Code
        </Button>
      </Footer>

      <AlertDialogPrimitive.Root data-slot="alert-dialog" open={isModalOpen}>
        <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" asChild />
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
              To change your Mobile number, you first need to confirm your current one.
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
