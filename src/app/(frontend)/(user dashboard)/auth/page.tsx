'use client'
import { Button } from '@/components/uikit/buttons/button'
import { GoogleIcon } from '@/components/ui/icon'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { HeaderWithCenterTitle } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import DividerWithText from '@/components/uikit/dividerWithText'
import { apiSendEmailCode } from '@/utilities/api/user_auth/auth'
import { toast } from 'sonner'
import { AuthEmailForm, EmailInputValue } from '@/components/dashboard/auth/forms'

const AuthPage = () => {
  const router = useRouter()
  const defaultEmail = useSearchParams().get('email')

  const onSubmitEmail = async (data: EmailInputValue) => {
    const res = await apiSendEmailCode(data.email)
    if (res.apiCode === '100100') {
      router.push(`/auth/signup?email=${data.email}`)
      toast('Verification code sent')
    } else if (res.apiCode === '100102') {
      router.push(`/auth/login?email=${data.email}`)
    } else if (res.apiCode === '100103') {
      toast('Wait before sending new code')
    } else {
      toast('Something went wrong. Try again')
    }
    console.log(res)
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
