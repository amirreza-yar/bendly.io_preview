'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PencilIcon } from '@/components/uikit/icons'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from '@/components/ui/icon'

const RESEND_TIMEOUT = 30

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('davod.osanlo@gmail.com')
  const [emailSent, setEmailSent] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [editingEmail, setEditingEmail] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let interval
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((t) => {
          if (t <= 1) {
            clearInterval(interval)
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSend = (e) => {
    e.preventDefault()
    setError('')
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setEmailSent(true)
    setResendTimer(RESEND_TIMEOUT)
    // Here you would trigger the backend to send the reset link
  }

  const handleResend = () => {
    if (resendTimer === 0) {
      setResendTimer(RESEND_TIMEOUT)
      // Here you would trigger the backend to resend the reset link
    }
  }

  const handleEditEmail = () => {
    setEditingEmail(true)
    setEmailSent(false)
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-900">
      <div className="flex flex-col w-full h-full -md md:-lg mx-auto bg-white shadow-md p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 rounded-none sm:rounded-lg">
        <div className="flex items-center mb-6 h-8">
          <button onClick={() => router.back()} className="flex-shrink-0">
            <ArrowLeft className="w-7 h-7 text-gray-700" />
          </button>
          <div className="flex-1 flex justify-center mr-5.5">
            <h6 className="text-sm md:text-md font-bold">Logo</h6>
          </div>
        </div>
        <div className="text-center mb-10 pt-5.5">
          <h5 className="text-xmd font-bold pb-2">Reset Your Password</h5>
          <p className="text-gray-600 text-sm pt-1.5">We'll send a reset link to your email address</p>
        </div>
        {!emailSent || editingEmail ? (
          <form onSubmit={handleSend} className="flex flex-col items-center gap-11 w-full">
            <div className="relative w-[245px] h-[40px] rounded-[40px] border border-gray-300 bg-gray-100 flex items-center justify-center">
              <span className="text-sm text-black pr-8">{email}</span>
              <button 
                className="absolute right-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                onClick={() => {
 
                  console.log('Edit email address')
                }}
              >
                <PencilIcon className="w-4 h-4 text-black " />
              </button>
            </div>
            <Button
              type="submit"
              variant="default"
              className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="mt-2 flex justify-center w-full">
              <div className="relative w-[245px] h-[40px] rounded-[40px] border border-gray-300 bg-gray-100 flex items-center justify-center">
                <span className="text-sm text-black pr-8">{email}</span>
                <button
                  className="absolute right-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                  onClick={handleEditEmail}
                >
                  <PencilIcon className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-600 text-center">A reset link has been sent to your email address.</div>
            <Button
              type="button"
              variant="default"
              className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleResend}
              disabled={resendTimer > 0}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
            </Button>
            <span className=' h-5 text-xsm'>
                Remembered your password? 
            <button
              className="text-blue-600 text-xms mt-2 pl-2"
              onClick={() => router.push('/login')}
            >
            Back to Login
            </button>
            </span>
            
          </div>
        )}
      </div>
    </div>
  )
}
