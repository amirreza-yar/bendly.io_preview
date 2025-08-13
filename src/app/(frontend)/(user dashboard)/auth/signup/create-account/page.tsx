'use client'
import { Header, HeaderWithCenterTitle } from '@/components/dashboard/header'
import { useRouter, useSearchParams } from 'next/navigation'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import Link from 'next/link'
import { Edit } from '@/components/uikit/icons'
import { useEffect, useState } from 'react'
import {
  apiCreateAccount,
  apiSendEmailCode,
  apiVerifyEmailCode,
} from '@/utilities/api/user_auth/auth'
import { toast } from 'sonner'
import {
  CreateAccountForm,
  CreateAccountFormValues,
  VerifyEmailOTPForm,
  VerifyEmailOTPValue,
} from '@/components/dashboard/auth/forms'

export default function SignupPage() {
  const router = useRouter()

  const email = useSearchParams().get('email') ?? ''

  useEffect(() => {
    if (!email) {
      router.push('/auth')
    }
  }, [email, router])

  const onCreateAccountSubmit = async (data: CreateAccountFormValues) => {
    console.log(data)
    const res = await apiCreateAccount(email, data.fullName, data.phone, data.password)
    if (res?.ok) {
      toast('Phone code is sent')
      router.push(`/auth/signup/verify-mobile?phone=${data.phone}&email=${email}`)
      console.log('working')
    } else if (!res?.ok && res?.apiCode === '100302') {
      toast('Email is not verified')
    } else if (!res?.ok && res?.apiCode === '100303') {
      toast('Email already registered')
      // router.push('/auth/login')
    } else {
      toast('Something went wrong')
    }
    console.log(res)
  }

  return (
    <>
      <Header title="Create account" returnHref={`/auth/signup?email=${email}`} />
      <ContentWrapper className="pt-22">
        <div className="grid gap-3">
          <CreateAccountForm onCreateAccountSubmit={onCreateAccountSubmit} />
        </div>
      </ContentWrapper>
    </>
  )
}
