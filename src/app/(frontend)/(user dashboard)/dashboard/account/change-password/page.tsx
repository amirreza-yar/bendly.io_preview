'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ResetPasswordIcon, ChevronRight } from '@/components/uikit/icons'
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

  async function fakeVerifyPassword(password: string): Promise<boolean> {
    return password === user.password
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: FormValues) {
    const isPasswordCorrect = await fakeVerifyPassword(data.password)
    if (!isPasswordCorrect) {
      form.setError('password', {
        type: 'data_not_verified',
        message: 'Incorrect password. Please try again',
      })
    } else {
      setIsVerified(true)
    }
  }

  return (
    <>
      <Header title="Change Password" returnHref="/dashboard/account" />
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
                        <FormLabel>Current Password</FormLabel>
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
                  <Link href="/dashboard/account">
                    <Button type="submit" className="w-full bg-primary">
                      Update Password
                    </Button>
                  </Link>
                </form>
              </Form>
            </div>
            <Link
              href="/dashboard/account"
              className="w-full flex items-center justify-center pt-6 text-primary gap-2"
            >
              <ResetPasswordIcon className="size-[15px]" />
              <p className="label-regular">Cancel, Back to Account Page</p>
              <ChevronRight className="size-5" />
            </Link>
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <LabeledInput
                            type="password"
                            placeholder="Enter your current password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-primary">
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
