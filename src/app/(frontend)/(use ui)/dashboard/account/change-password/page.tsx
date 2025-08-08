'use client'
import { useState } from 'react'
import Link from 'next/link'
import { EyeIcon, ArrowLeft, ResetPasswordIcon, ChevronRight } from '@/components/uikit/icons'
import { Input, LabeledInput } from '@/components/uikit/input'
import { Label } from '@/components/ui/label'
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
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUser } from '@/providers/main_providers/UserContext'

export const FormSchema = z.object({
  password: z.string('Password is required'),
  // .min(8, 'Password must be at least 8 characters long')
  // .max(32, 'Password cannot exceed 32 characters')
  // .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  // .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  // .regex(/[0-9]/, 'Password must contain at least one number')
  // .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
})

type FormValues = z.infer<typeof FormSchema>

export default function AccountPage() {
  const router = useRouter()

  const { user } = useUser()

  async function fakeVerifyPassword(password: string): Promise<boolean> {
    return password === user.password
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    // defaultValues: { password: '' },
  })

  async function onSubmit(data: FormValues) {
    const isPasswordCorrect = await fakeVerifyPassword(data.password)
    if (!isPasswordCorrect) {
      form.setError('password', {
        type: 'data_not_verified',
        message: 'Incorrect password. Please try again',
      })
    } else {
      // router.push('/dashboard/account/change-password')
    }
  }

  return (
    <>
      <Header title="Change Password" returnHref="/dashboard/account" />

      <ContentWrapper>
        <div className="grid justify-center text-center">
          <div className="grid gap-2 pt-8 px-6">
            <h5> Confirm you identity</h5>
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
                      <FormLabel>Currnet Password</FormLabel>
                      <FormControl>
                        <LabeledInput type="password" placeholder="Enter Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-primary">
                  Send Verify Code
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
      </ContentWrapper>
    </>
  )
}
