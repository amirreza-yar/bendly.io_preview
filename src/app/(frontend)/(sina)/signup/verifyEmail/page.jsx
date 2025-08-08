'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PencilIcon } from '@/components/uikit/icons'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from '@/components/ui/icon'

const RESEND_TIMEOUT = 30

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialEmail = searchParams?.get('email') || ''
  const [email, setEmail] = useState('davod.osanlo@gmail.com')
  const [otp, setOtp] = useState(['', '', '', '', ''])
  const [otpTouched, setOtpTouched] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [resendTimer, setResendTimer] = useState(RESEND_TIMEOUT)
  const otpRefs = useRef([])

  // Start resend timer on mount
  useEffect(() => {
    setResendTimer(RESEND_TIMEOUT)
    const interval = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) {
          clearInterval(interval)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

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

  // Handle backspace
  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus()
    }
  }

  // Simulate OTP validation
  const isOtpValid = () => otp.join('') === '12345' // Demo: only 12345 is valid

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
    router.push('/signup/createAccountWithEmail')
  }

  const handleResend = () => {
    if (resendTimer === 0) {
      setOtp(['', '', '', '', ''])
      setOtpTouched(false)
      setOtpError('')
      setResendTimer(RESEND_TIMEOUT)
      // In real app, would trigger resend here
      const interval = setInterval(() => {
        setResendTimer((t) => {
          if (t <= 1) {
            clearInterval(interval)
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full min-h-screen  bg-white shadow-md p-4 sm:p-6 md:p-8 rounded-none sm:rounded-lg">
        <div className="flex items-center mb-6 h-8">
          <button onClick={() => router.back()} className="flex-shrink-0">
            <ArrowLeft className="w-7 h-7 text-gray-700" />
          </button>
          <div className="flex-1 flex justify-center mr-5.5">
            <h6 className="text-sm md:text-md font-bold">Logo</h6>
          </div>
        </div>
        <div className="text-center mb-10 pt-5.5">
          <h5 className="text-xmd font-bold pb-4">Verify Your Email</h5>
          <p className="text-gray-600 text-sm pt-1.5">We sent a 5-digit code to:</p>
          <div className="mt-2 flex justify-center">
            <div className="relative w-[245px] h-[40px] rounded-[40px] border border-gray-300 bg-gray-100 flex items-center justify-center">
              <span className="text-sm text-black pr-8">{email}</span>
              <button
                className="absolute right-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                onClick={() => {
                  console.log('Edit email address')
                }}
              >
                <PencilIcon className="size-4 text-black" />
              </button>
            </div>
          </div>
        </div>
        <form onSubmit={handleVerify} className="flex flex-col items-center gap-4">
          <div className="flex gap-2 justify-center mb-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (otpRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className={`w-12 h-12 text-center text-lg border-2 rounded-md focus:outline-none ${otpError ? 'border-red-500' : 'border-gray-300'}`}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
              />
            ))}
          </div>
          {otpError && <div className="text-red-500 text-xs mb-2">{otpError}</div>}
          <Button
            type="submit"
            variant="default"
            className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            Verify
          </Button>
        </form>
        <div className="flex flex-col items-center mt-4">
          <span className="text-xs text-gray-600">Didn't receive the code?</span>
          <button
            className="text-blue-600 text-xs disabled:text-gray-400 mt-1"
            onClick={handleResend}
            disabled={resendTimer > 0}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
          </button>
        </div>
      </div>
    </div>
  )
}
