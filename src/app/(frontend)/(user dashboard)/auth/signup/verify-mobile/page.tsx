'use client'
import { HeaderWithCenterTitle } from '@/components/dashboard/header'
import { useRouter, useSearchParams } from 'next/navigation'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import Link from 'next/link'
import { Edit } from '@/components/uikit/icons'
import { useEffect, useRef, useState } from 'react'
import {
  apiResendMobileCode,
  apiSendEmailCode,
  apiVerifyEmailCode,
  apiVerifyMobileCode,
} from '@/utilities/api/user_auth/auth'
import { toast } from 'sonner'
import { VerifyPhoneOTPForm, VerifyPhoneOTPValue } from '@/components/dashboard/auth/forms'
import { CodeResendTime, CodeResendTimeHandle } from '@/components/dashboard/auth/resendTime'

export default function VerifyMobilePage() {
  const router = useRouter()

  const phone = useSearchParams().get('phone') ?? ''
  const email = useSearchParams().get('email') ?? ''

  useEffect(() => {
    if (!phone || !email) {
      router.push('/auth')
    }
  }, [phone, router])

  const resendRef = useRef<CodeResendTimeHandle>(null)
  const [invalidCodeErrorText, setInvalidCodeErrorText] = useState<string>('')

  const onSubmitVerifyMobile = async (data: VerifyPhoneOTPValue) => {
    await apiVerifyMobileCode(phone, String(data.phoneOTP)).then((res) => {
      if (res?.ok && res?.apiCode === '100500') {
        console.log(res)
        toast('Welcome! Your account is created')

        router.push(`/dashboard`)
      } else if (!res?.ok && (res?.apiCode === '100502' || res?.apiCode === '100503')) {
        console.log(res)
        setInvalidCodeErrorText('Invalid OTP. Please try again.')
      } else {
        console.log(res)
        toast('Something went wrong. Try again')
      }
    })
  }

  const handleResendPhoneCode = async () => {
    await apiResendMobileCode(phone, email).then((res) => {
      if (res?.ok && res?.apiCode === '100400') {
        resendRef.current?.resetTimer()
        toast('Verification code sent')
      } else if (!res?.ok && res?.apiCode === '100401') {
        toast('Wait before sending new code')
      } else {
        toast('Something went wrong. Try again')
      }
    })
  }

  return (
    <>
      <HeaderWithCenterTitle
        title="Logo"
        returnHref={`/auth/signup/create-account?email=${email}`}
      />
      <ContentWrapper className="pt-26">
        <div className="grid gap-6 items-center">
          <div className="grid items-center text-center gap-2">
            <h5>Verify your Mobile Number</h5>
            <p className="subtitle-regular">We sent a 5-digit code to:</p>
            <Link
              href={`/auth/signup/create-account?email=${email}`}
              className="flex gap-2 items-center rounded-full border border-border-default bg-surface-disable w-fit justify-self-center py-2 px-4 text-[16px]/[24px] font-regular"
            >
              {phone}
              <Edit className="size-5" />
            </Link>
          </div>

          <VerifyPhoneOTPForm
            onSubmitVerifyPhone={onSubmitVerifyMobile}
            errorText={invalidCodeErrorText}
          />

          <div className="flex gap-2 items-center justify-center">
            <span className="text-xs text-gray-600">Didn't receive the code?</span>
            <CodeResendTime ref={resendRef} onResendHandler={handleResendPhoneCode} />
          </div>
        </div>
      </ContentWrapper>
    </>
  )
}
