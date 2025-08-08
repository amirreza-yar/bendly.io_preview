'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from '@/components/ui/icon'
import {LabeledInput} from '@/components/uikit/input'
import { toast } from 'sonner'

export default function SetNewPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const validatePassword = (pw) => pw.length >= 8 && /[A-Za-z]/.test(pw) && /[0-9]/.test(pw)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters and contain letters and numbers.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      toast("Password reset! Redirecting to login...")
      setTimeout(() => router.push('/login'), 1500)
    }, 1000)
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
          <h5 className="text-xmd font-bold pb-4">Reset Your Password</h5>
          <p className="text-gray-600 text-sm pt-1.5">Please enter a new password for your account</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
        <LabeledInput
        className="w-full"
        label="New Password"
        type="password"
        required
        placeholder="Enter your new password"
        helpText="Use 8+ characters with letters, numbers, and symbols"
        value={password}
        onChange={e => setPassword(e.target.value)}
        error={error}
      />
          {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
          {success && <div className="text-green-600 text-xs mb-2">Password reset! Redirecting to login...</div>}
          <Button
            type="submit"
            variant="default"
            className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
        <span className=' h-5 text-xsm mt-3 ml-13'>
                Remembered your password? 
            <button
              className="text-blue-600 text-xms mt-2 pl-2"
              onClick={() => router.push('/login')}
            >
            Back to Login
            </button>
            </span>
      </div>
    </div>
  )
}
