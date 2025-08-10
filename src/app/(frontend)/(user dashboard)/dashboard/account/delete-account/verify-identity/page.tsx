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
      <Header title="Verify identity" returnHref="/dashboard/account" />
      <ContentWrapper>
        <div className="grid justify-center text-center">
          <div className="grid gap-2 pt-8 px-6 mb-8">
            <h5>Verify your identity</h5>
            <p className="subtitle-regular text-center">
              To proceed with account deletion, please verify your identity
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <LabeledInput
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                          className="pb-6"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-primary">
                  Continue
                </Button>
                <Link href="/dashboard/account">
                  <Button
                    type="submit"
                    className="w-full bg-white border-2  border-border-primary text-primary"
                  >
                    Cancel
                  </Button>
                </Link>
              </form>
            </Form>
          </div>
        </div>
      </ContentWrapper>
    </>
  )
}
