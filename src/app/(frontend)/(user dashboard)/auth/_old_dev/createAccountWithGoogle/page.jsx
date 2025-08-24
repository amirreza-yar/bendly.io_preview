'use client'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from '@/components/ui/icon'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { LabeledInput } from '@/components/uikit/input'
import { LabeledInputWithCode } from '@/components/uikit/input'

const LoginPage = () => {
  const {
    formState: { errors },
  } = useForm()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  function isValidMobile(value) {
    return /^\d{9,}$/.test(value) // Basic mobile number validation (at least 9 digits)
  }

  const validateForm = () => {
    const errors = {}
    if (!fullName) errors.fullName = 'Full Name is required'
    if (!mobileNumber) errors.mobileNumber = 'Mobile Number is required'
    else if (!isValidMobile(mobileNumber))
      errors.mobileNumber = 'Please enter a valid number, without any space'
    if (!password) errors.password = 'Password is required'
    else if (password.length < 8)
      errors.password = 'Use 8+ characters with letters, numbers, and symbols'
    if (!isChecked) errors.terms = 'Terms & Conditions is required'
    return errors
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    setLoading(true)
    router.push('/signup/verifyMobile')

    setTimeout(() => {
      setLoading(false)
      // After successful verification, navigate to home page
      router.push('/home')
    }, 2000) // Simulate 2-second verification delay
  }

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
    if (formErrors.terms) setFormErrors({ ...formErrors, terms: '' })
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-900">
      <div className="flex flex-col w-full h-full -md md:-lg mx-auto bg-white shadow-md p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 rounded-none sm:rounded-lg">
        <div className="flex items-center mb-4 h-8">
          <button onClick={() => router.back()} className="flex-shrink-0">
            <ArrowLeft className="w-7 h-7 text-gray-700" />
          </button>
          <div className="flex-1 flex ml-5">
            <h6 className="text-sm md:text-md font-bold">Create Account</h6>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form onSubmit={onSubmit} className="space-y-8 flex-grow w-full mt-5">
            <div className="space-y-8">
              <div>
                <LabeledInput
                  label="Full Name"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: '' })
                  }}
                  className={formErrors.fullName ? 'border-red-500' : ''}
                />
                {formErrors.fullName && (
                  <p className="text-red-500 text-xs mt-2 ml-2 text-left">{formErrors.fullName}</p>
                )}
              </div>
                <LabeledInputWithCode
                  label="Mobile Number"
                  type="number"
                  className={`${formErrors.mobileNumber ? 'border-red-500' : ''} flex-1 border-gray-300 rounded-r-md focus:outline-none focus:ring-0 border-l-0`}
                  required
                  placeholder="e.g., 400123456"
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value)
                    if (formErrors.mobileNumber) setFormErrors({ ...formErrors, mobileNumber: '' })
                  }}
                />
                {formErrors.mobileNumber && (
                  <p className="text-red-500 text-xs mt-2 ml-2 text-left">
                    {formErrors.mobileNumber}
                  </p>
                )}
              <div className="w-full h-4 mt-6 text-left pb-8">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 mr-2 rounded-xl pt-2"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="terms">
                  I agree to the <span className="text-primary">Terms & Conditions</span>
                </label>
                {formErrors.terms && (
                  <p className="text-red-500 text-xs mt-1 ml-2 ">{formErrors.terms}</p>
                )}
              </div>
            </div>
            <Button
              type="submit"
              variant="default"
              className="h-[44px] w-full bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Create Account'}
            </Button>
            <p className="text-center text-sm text-gray-600 mt-2">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:underline">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
