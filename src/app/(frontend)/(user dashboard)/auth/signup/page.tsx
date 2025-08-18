'use client'
import { HeaderWithCenterTitle } from '@/components/dashboard/header'
import { useRouter, useSearchParams } from 'next/navigation'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import Link from 'next/link'
import { Edit } from '@/components/uikit/icons'
import { useEffect, useRef, useState } from 'react'
import { apiSendEmailCode, apiVerifyEmailCode } from '@/utilities/api/auth'
import { toast } from 'sonner'
import { VerifyEmailOTPForm, VerifyEmailOTPValue } from '@/components/dashboard/auth/forms'
import { CodeResendTime, CodeResendTimeHandle } from '@/components/dashboard/auth/resendTime'

export default function VerifyEmailPage() {
  const router = useRouter()

  const email = useSearchParams().get('email') ?? ''

  useEffect(() => {
    if (!email) {
      router.push('/auth')
    }
  }, [email, router])

  const resendRef = useRef<CodeResendTimeHandle>(null)
  const [invalidCodeErrorText, setInvalidCodeErrorText] = useState<string>('')

  const onSubmitVerifyEmail = async (data: VerifyEmailOTPValue) => {
    const res = await apiVerifyEmailCode(email, data.emailOTP)
    if (res?.ok && res?.apiCode === '100200') {
      toast('Your email is verified')
      router.push(`/auth/signup/create-account?email=${email}`)
    } else if (!res?.ok && (res?.apiCode === '100202' || res?.apiCode === '100203')) {
      setInvalidCodeErrorText('Invalid OTP. Please try again.')
    } else {
      toast('Something went wrong. Try again')
    }
    console.log(res)
  }

  const handleResendEmailCode = async () => {
    const res = await apiSendEmailCode(email)
    if (res?.ok && res?.apiCode === '100100') {
      resendRef.current?.resetTimer()
      toast('Verification code sent')
    } else if (!res?.ok && res?.apiCode === '100103') {
      toast('Wait before sending new code')
    } else {
      toast('Something went wrong. Try again')
    }
    console.log(res)
  }

  return (
    <>
      <HeaderWithCenterTitle title="Logo" returnHref={`/auth?email=${email}`} />
      <ContentWrapper className="pt-26">
        <div className="grid gap-6 items-center">
          <div className="grid items-center text-center gap-2">
            <h5>Verify your email</h5>
            <p className="subtitle-regular">We sent a 5-digit code to:</p>
            <Link
              href={`/auth?email=${email}`}
              className="flex gap-2 items-center rounded-full border border-border-default bg-surface-disable w-fit justify-self-center py-2 px-4 text-[16px]/[24px] font-regular"
            >
              {email}
              <Edit className="size-5" />
            </Link>
          </div>

          <VerifyEmailOTPForm
            onSubmitVerifyEmail={onSubmitVerifyEmail}
            errorText={invalidCodeErrorText}
          />

          <div className="flex gap-2 items-center justify-center">
            <span className="text-xs text-gray-600">Didn't receive the code?</span>
            <CodeResendTime ref={resendRef} onResendHandler={handleResendEmailCode} />
          </div>
        </div>
      </ContentWrapper>
    </>
  )
}
