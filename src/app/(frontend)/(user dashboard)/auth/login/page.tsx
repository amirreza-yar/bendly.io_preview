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
import api from '@/lib/axios'

export default function LoginPage() {
  const router = useRouter()
  const email = useSearchParams().get('email')

  const [errorText, setErrorText] = useState<string>('')

  // if (!email) {
  //   return notFound()
  // }

  const onSubmitLogin = async (data: LoginFormValue) => {
    console.log(data)

    try {
      const res = await api.post('/auth/login/', {
        email: data.email,
        password: data.password,
      })

      if (res.status === 200) {
        toast('Welcome!')
        setTimeout(() => {
          router.push('/dashboard')
        }, 100)
      }
    } catch (error: any) {
      const message =
        error.response.data.non_field_errors[0] ||
        error.response?.data ||
        'Something broke, probably not your fault.'

      toast(message)
      // setErrorText(message)
    }
  }

  return (
    <>
      <HeaderWithCenterTitle title="Logo" />
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
