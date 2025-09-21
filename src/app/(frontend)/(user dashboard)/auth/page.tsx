'use client'
import { Button } from '@/components/uikit/buttons/button'
import { GoogleIcon } from '@/components/ui/icon'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { HeaderWithCenterTitle } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import DividerWithText from '@/components/uikit/dividerWithText'
import { apiCheckEmail, apiSendEmailCode } from '@/utilities/api/auth'
import { toast } from 'sonner'
import { AuthEmailForm, EmailInputValue } from '@/components/dashboard/auth/forms'

const AuthPage = () => {
  const router = useRouter()
  const defaultEmail = useSearchParams().get('email')

  const onSubmitEmail = async (data: EmailInputValue) => {
    // First check if email exists
    const checkRes = await apiCheckEmail(data.email)
    console.log('Email check result:', checkRes)
    
    if (checkRes.apiCode === '100102') {
      // Email exists, go to login
      router.push(`/auth/login?email=${data.email}`)
    } else if (checkRes.apiCode === '100101') {
      // Email doesn't exist, send verification code and go to signup
      const sendRes = await apiSendEmailCode(data.email)
      if (sendRes.apiCode === '100100') {
        router.push(`/auth/signup?email=${data.email}`)
        toast('Verification code sent')
      } else {
        toast('Something went wrong. Try again')
      }
    } else {
      toast('Something went wrong. Try again')
    }
  }

  return (
    <>
      <HeaderWithCenterTitle title="Logo" />
      <ContentWrapper className="pt-30">
        <div className="grid gap-6">
          <div className="grid items-center text-center gap-2">
            <h5>Welcome to Flashing Factory</h5>
            <p className="subtitle-regular">Please log in to your account</p>
          </div>
          <Button
            className="w-full border-border-default text-body mt-2 opacity-40"
            variant="secondary"
            disabled
          >
            <GoogleIcon className="size-5" />
            Continue with google
          </Button>

          <DividerWithText text="OR" />

          <AuthEmailForm onSubmitEmail={onSubmitEmail} defaultEmail={defaultEmail} />
        </div>
      </ContentWrapper>
    </>
  )
}

export default AuthPage
