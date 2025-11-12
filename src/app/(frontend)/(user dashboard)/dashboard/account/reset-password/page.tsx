'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { Pencil, ResetPasswordIcon, ChevronRight, PasswordField } from '@/components/uikit/icons'
import Link from 'next/link'
import { Button } from '@/components/uikit/buttons/button'
import { Header } from '@/components/dashboard/header'
import { LabeledInput } from '@/components/uikit/input'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/uikit/form'

// --- Validation Schema ---
const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[0-9]/, 'Must include a number')
    .regex(/[^A-Za-z0-9]/, 'Must include a symbol'),
})

type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>

export default function ResetPasswordPage() {
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: '' },
  })

  const handleResetPassword = (data: ResetPasswordFormValues) => {
    console.log('Send reset link with password:', data.password)
    // Add API call or next steps here
  }

  return (
    <>
      <Header title="Reset Password" returnHref="/dashboard/account" />
      <ContentWrapper className="">
        <div className="grid text-center">
          <div className="grid px-6 gap-2 pt-12">
            <h5>Reset your password</h5>
            <p className="subtitle-regular">We will send a reset link to your email address</p>
            <div className=" flex items-center justify-center mt-4">
              <Link
                href=""
                className="flex w-fit items-center justify-center gap-2 px-4 py-2 border border-border-default rounded-full"
              >
                <p className="subtitle-large">demo@domain.com</p>
                <Pencil className="size-5" />
              </Link>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form className="grid gap-6 mt-10 " onSubmit={form.handleSubmit(handleResetPassword)}>
            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex gap-2 label-regular">
                    Password
                    <span className="text-[#E50000]">*</span>
                  </FormLabel>
                  <FormControl>
                    <LabeledInput
                      icon={PasswordField}
                      placeholder="Your Password"
                      type="password"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage>Use 8+ characters with letters, numbers, and symbols</FormMessage>
                </FormItem>
              )}
            />

            <Button type="submit" className=" bg-primary">
              Send Reset Link
            </Button>
          </form>
        </Form>

        <div className=" flex items-center justify-center pt-6 gap-2">
          <p className="text-caption-regular">Remembered your password?</p>
          <ResetPasswordIcon className="size-[15px] text-primary" />
          <Link
            href="/dashboard/account"
            className="label-regular text-primary flex items-center gap-1"
          >
            Back to Login
            <ChevronRight className="size-5 text-primary" />
          </Link>
        </div>
      </ContentWrapper>
    </>
  )
}
