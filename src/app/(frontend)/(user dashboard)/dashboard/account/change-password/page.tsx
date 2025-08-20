'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ResetPasswordIcon, ChevronRight, PasswordField } from '@/components/uikit/icons'
import { LabeledInput } from '@/components/uikit/input'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { z } from 'zod'
import { Button } from '@/components/uikit/buttons/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/uikit/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUser } from '@/providers/main_providers/UserContext'

export const FormSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof FormSchema>

export default function AccountPage() {
  const { user } = useUser()
  const [isVerified, setIsVerified] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: '',
    },
  })

  async function fakeVerifyPassword(password: string): Promise<boolean> {
    return password === user.password
  }

  async function onSubmit(data: FormValues) {
    if (!isVerified) {
      // Verify current password
      const isPasswordCorrect = await fakeVerifyPassword(data.password)
      if (!isPasswordCorrect) {
        form.setError('password', {
          type: 'data_not_verified',
          message: 'Incorrect password. Please try again',
        })
        return
      }
      setIsVerified(true)
      form.reset() // Clear the form for the new password input
    } else {
      // Update password logic (not implemented in the original code)
      console.log('New password submitted:', data.password)
      // Add your password update logic here
      form.reset()
      setIsVerified(false) // Optionally reset to verification step
    }
  }

  return (
    <>
      <Header title={isVerified ? 'Change Password' : 'Confirm Your Identity'} returnHref="/dashboard/account" />
      <ContentWrapper>
        {isVerified ? (
          // ✅ UI after password verification
          <div className="grid justify-center text-center pt-8">
            <div className="grid gap-2 pt-8 px-6">
              <h5>Change your password</h5>
              <p className="subtitle-regular">Enter a new password for your account</p>
            </div>
            <div className="grid pt-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <LabeledInput
                            type="password"
                            placeholder="Enter your new password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-primary">
                    Update Password
                  </Button>
                </form>
              </Form>
              <Link
                href="/dashboard/account"
                className="w-full flex items-center justify-center pt-6 text-primary gap-2"
              >
                <ResetPasswordIcon className="size-[15px]" />
                <p className="label-regular">Cancel, Back to Account Page</p>
                <ChevronRight className="size-5" />
              </Link>
            </div>
          </div>
        ) : (
          // ❌ UI before password verification
          <div className="grid justify-center text-center">
            <div className="grid gap-2 pt-8 px-6">
              <h5>Confirm your identity</h5>
              <p className="subtitle-regular">
                For your security, please enter your current password to continue
              </p>
            </div>
            <div className="grid pt-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex gap-2 label-regular">Password</FormLabel>
                        <FormControl>
                          <LabeledInput
                            icon={PasswordField}
                            placeholder="Your Password"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <Link href="/dashboard/account/reset-password" className="text-primary label-regular justify-self-end">
                          Forgot password?
                        </Link>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Continue
                  </Button>
                </form>
              </Form>
            </div>
            <Link
              href="/dashboard/account/reset-password"
              className="w-full flex items-center justify-center pt-6 text-primary gap-2"
            >
              <ResetPasswordIcon className="size-[15px]" />
              <p className="label-regular">Forgot Password?</p>
              <ChevronRight className="size-5" />
            </Link>
          </div>
        )}
      </ContentWrapper>
    </>
  )
}