'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PencilIcon, FeaturedSuccess } from '@/components/uikit/icons'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from '@/components/ui/icon'

const RESEND_TIMEOUT = 30

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialEmail = searchParams?.get('email') || ''
 const [phone, setPhone] = useState('+61-0401234567')
  const [otp, setOtp] = useState(['', '', '', '', ''])
  const [otpTouched, setOtpTouched] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [resendTimer, setResendTimer] = useState(RESEND_TIMEOUT)
  const otpRefs = useRef([])

  // Focus next input on change
  const handleOtpChange = (idx, value) => {
    if (!/^[0-9]?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[idx] = value
    setOtp(newOtp)
    setOtpTouched(true)
    setOtpError('')
    if (value && idx < 4) {
      otpRefs.current[idx + 1]?.focus()
    }
  }
  const handleVerify = (e) => {
    e.preventDefault()
    setOtpTouched(true)
    if (otp.join('').length < 5) {
      setOtpError('Please enter the code.')
      return
    }
    if (!isOtpValid()) {
      setOtpError('Invalid OTP. Please try again.')
      return
    }
    // Success: go to create account
    router.push('/dashboard/account')
  }

  const handleSendCode = () => {
    router.push('/dashboard/account/edit-mobile/verify-new-mobile')
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full min-h-screen bg-white shadow-md p-4 sm:p-6 md:p-8 rounded-none sm:rounded-lg">
        <div className="flex items-center mb-6 h-8">
          <button onClick={() => router.back()} className="flex-shrink-0">
            <ArrowLeft className="w-7 h-7 text-gray-700" />
          </button>
          <div className="flex-1 flex justify-center mr-5.5">
            <h6 className="text-sm md:text-md font-bold">Logo</h6>
          </div>
        </div>
        <div className="text-center mb-10 pt-5.5">
          <div className="flex justify-center mb-4">
            <FeaturedSuccess className="w-10 h-10"/>
          </div>
          <h5 className="text-md font-bold pb-4 text-success">Your current mobile number has been verified</h5>
          <p className="text-gray-600 text-sm pt-1.5 mb-10">
            To finalize the mobile number change, your new mobile number must be verified
          </p>
          <div className="text-sm text-gray-600 mt-2 flex justify-center flex-col items-center gap-2">
            <p>We've sent it to your new mobile number:</p>
            <div className="relative w-[173px] h-[40px] rounded-[40px] border border-gray-300 bg-gray-100 flex items-center justify-center">
              <span className="text-sm text-black pr-8">{phone}</span>
              <button
                className="absolute right-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                onClick={() => {
                  console.log('Edit mobile number')
                }}
              >
                <PencilIcon className="size-4 text-black" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <Button className="w-full h-11 " onClick={handleSendCode}>
            Send Code
          </Button>
        </div>
      </div>
    </div>
  )
}
