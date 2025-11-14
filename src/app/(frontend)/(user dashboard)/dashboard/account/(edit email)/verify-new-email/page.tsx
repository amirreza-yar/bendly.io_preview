'use client'
import React, { useState, useRef, useEffect } from 'react'
import { notFound, useRouter, useSearchParams } from 'next/navigation'
import { PencilIcon } from '@/components/uikit/icons'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from '@/components/ui/icon'
import { Header } from '@/components/dashboard/header'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { useUser } from '@/providers/main_providers/UserContext'
import { HeaderWithCenterTitle } from '@/components/dashboard/header'
import Link from 'next/link'
import { Edit } from '@/components/uikit/icons'
import { apiSendEmailCode, apiVerifyEmailCode } from '@/utilities/api/auth'
import { toast } from 'sonner'
import { VerifyEmailOTPForm, VerifyEmailOTPValue } from '@/components/dashboard/auth/forms'
import { CodeResendTime, CodeResendTimeHandle } from '@/components/dashboard/auth/resendTime'

const RESEND_TIMEOUT = 30

export default function VerifyEmailPage() {
  const router = useRouter()

  const { user } = useUser()
  const email = user.email

  const newEmail = useSearchParams().get('email') ?? ''

  // if (!newEmail) notFound()

  useEffect(() => {
    if (!email) {
      router.push('/auth')
    }

    console.log(newEmail)
  }, [email, router])

  const resendRef = useRef<CodeResendTimeHandle>(null)
  const [invalidCodeErrorText, setInvalidCodeErrorText] = useState<string>('')

  const onSubmitVerifyEmail = async (data: VerifyEmailOTPValue) => {
    // const res = await apiVerifyEmailCode(email, data.emailOTP)
    // if (res?.ok && res?.apiCode === '100200') {
    //   toast('Your email is verified')
    //   router.push(`/auth/signup/create-account?email=${email}`)
    // } else if (!res?.ok && (res?.apiCode === '100202' || res?.apiCode === '100203')) {
    //   setInvalidCodeErrorText('Invalid OTP. Please try again.')
    // } else {
    //   toast('Something went wrong. Try again')
    // }
    // console.log(res)
    router.push(`/dashboard/account?email=${newEmail}`)
  }

  const handleResendEmailCode = async () => {
    // const res = await apiSendEmailCode(email)
    // if (res?.ok && res?.apiCode === '100100') {
    //   resendRef.current?.resetTimer()
    //   toast('Verification code sent')
    // } else if (!res?.ok && res?.apiCode === '100103') {
    //   toast('Wait before sending new code')
    // } else {
    //   toast('Something went wrong. Try again')
    // }
    // console.log(res)
    resendRef.current?.resetTimer()
  }
  return (
    <>
      <Header
        title="Verify New Email"
        returnHref="/dashboard/account/email-verified"
        className="border-0"
      />

      <ContentWrapper className="pt-24 min-h-screen md:max-w-[1000px] md:mx-auto md:px-4">
        <div className="grid gap-6 items-center">
          <div className="grid items-center text-center gap-2">
            <h5>Verify your new email</h5>
            <p className="subtitle-regular">We've sent a 5-digit code to your new email address:</p>
            <div className="flex gap-2 items-center rounded-full border border-border-default bg-surface-disable w-fit justify-self-center py-2 px-4 text-[16px]/[24px] font-regular">
              {email}
            </div>
          </div>

          <VerifyEmailOTPForm
            onSubmitVerifyEmail={onSubmitVerifyEmail}
            errorText={invalidCodeErrorText}
          />

          <div className="flex gap-2 items-center justify-center">
            <span className="text-xs text-gray-600">Did not receive the code?</span>
            <CodeResendTime ref={resendRef} onResendHandler={handleResendEmailCode} />
          </div>
        </div>
      </ContentWrapper>
    </>
  )
}
