'use client'
import { Button } from '@/components/uikit/buttons/button'
import { GoogleIcon } from '@/components/ui/icon'
import React, { useState } from 'react'
import { notFound, useRouter, useSearchParams } from 'next/navigation'
import { HeaderWithCenterTitle } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import DividerWithText from '@/components/uikit/dividerWithText'
import { apiLogin, apiSendEmailCode } from '@/utilities/api/auth'
import { toast } from 'sonner'
import {
  AuthEmailForm,
  EmailInputValue,
  LoginForm,
  LoginFormValue,
} from '@/components/dashboard/auth/forms'
import { LabeledInput } from '@/components/uikit/input'
import { Mail } from '@/components/uikit/icons'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const email = useSearchParams().get('email')

  const [errorText, setErrorText] = useState<string>('')

  if (!email) {
    return notFound()
  }

  const onSubmitLogin = async (data: LoginFormValue) => {
    try {
      const res = await apiLogin(email, data.password)
      console.log('Login response:', res)
      
      if (res.success) {
        toast('Welcome!')
        // Small delay to ensure cookies are set
        setTimeout(() => {
          router.push('/dashboard')
        }, 100)
      } else if (res.error?.includes('password') || res.error?.includes('credentials')) {
        setErrorText('Incorrect password, Please try again')
      } else {
        toast('Something went wrong')
        setErrorText(res.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast('Something went wrong')
      setErrorText('Network error occurred')
    }
  }

  return (
    <>
      <HeaderWithCenterTitle title="Logo" returnHref={`/auth?email=${email}`} />
      <ContentWrapper className="pt-30">
        <div className="grid gap-6">
          <div className="grid items-center text-center gap-2">
            <h5>Welcome back!</h5>
            <p className="subtitle-regular">Enter you password to login</p>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between label-regular">
              <p>Email</p>
              <Link href={'/auth'} className="text-primary">
                Not you? Change email
              </Link>
            </div>
            <LabeledInput icon={Mail} value={email ?? ''} disabled />
          </div>

          <LoginForm onSubmitLogin={onSubmitLogin} errorText={errorText} />
        </div>
      </ContentWrapper>
    </>
  )
}
